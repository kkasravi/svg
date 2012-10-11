module log from 'log';
module monads from 'monads';
module svg from 'svg';
class Multiply {
  constructor() {
    private element;
    @element = monads.DOMable({tagName:'div'}).on('load').add(
      svg.Svg({width:"1000.0",height:"1000.0"}).
        path({id:"pfad",d:"M 300,400 C 50,800 400,850 800,500 S 500,500 300,700 900,1000 800,600 550,0 300,400",'fill':"none",'stroke-width':"20",'stroke':"#888",'stroke-linecap':"round",'stroke-linejoin':"round"}).end().
        g({id:"am1"}).
          circle({id:"c1",cx:"0",cy:"0",r:"40",stroke:"#00f",'stroke-width':"60",fill:"#f00"}).end(). 
          circle({id:"c2",cx:"50",cy:"0",r:"10",fill:"#88f"}).end().
//        animateMotion({'path':"M 300,400 C 50,800 400,850 800,500 S 500,500 300,700 900,1000 800,600 550,0 300,400",'dur':"30s",'repeatDur':"indefinite"}).end().
        end().
        animateMotion({'xlink:href':"#am1",'dur':"30s",'repeatDur':"indefinite"}).
          mpath({'xlink:href':"#pfad"}).end().
        end().
        use({'xlink:href':"#pfad"}).end().
      end().svg
    );
    return @element;
  }
}
Multiply().insert(document.body);
