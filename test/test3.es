module log from 'log';
module monads from 'monads';
module svg from 'svg';
class Test3 {
  constructor() {
    private element;
    @element = monads.DOMable({element:document.body}).on('load').add(
      svg.Svg({id:'mySVG'}).
        circle({cx:"100",cy:"100",r:"50",stroke:"none",fill:"#f00"}).
          animateMotion({'path':"M 300,400 C 50,800 400,850 800,500 S 500,500 300,700 900,1000 800,600 550,0 300,400",'dur':"3s"}).end().
        end().
      end().svg
    );
  }
}
Test3();
