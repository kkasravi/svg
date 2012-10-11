module svg {
  module log from 'log';
  module events from 'events';
  module monads from 'monads';
  module utilities from 'utilities';
  export class SVGable extends monads.DOMable {
    constructor(properties={dimensions:{x:0,y:0,width:'100%',height:'100%'},viewBox:'none',transform:'scale(1.0)'}) {
      private dimensions, svg, transform;
      @dimensions = properties.dimensions;
      @svg = properties.svg;
      @transform = null;
      var x = @dimensions.x;
      var y = @dimensions.y;
      var width = @dimensions.width;
      var height = @dimensions.height;
      @transform = properties.transform;
      properties.width = width+'px';
      properties.height = height+'px';
      properties.top = x+'px';
      properties.left = y+'px';   
      if(properties.id) {
        DOMable.call(this,{id:properties.id});
      } else if(properties.element) {
        DOMable.call(this,{element:properties.element});
      }
      if(@svg) {
        @svg = typeof(@svg) === 'string' ? Svg({id:@svg}) : @svg;
        this.element = this.element || @svg.svg.getElementById(@id);
      }
      @continuationConstructor = SVGContinuation;
    }
  };
  export class SVGContinuation extends monads.DOMContinuation {
    constructor(properties={}) {
      DOMContinuation.call(this, properties);
    }
    animatePath(begin, interval, path) {
      try {
        var node = document.createElementNS(@monad.svg.getDefaultNS(),'animateMotion');
        node.setAttributeNS(null,"path",path);
        node.setAttributeNS(null,"dur",interval);
        node.setAttributeNS(null,"fill","freeze");
        node.setAttributeNS(null,"begin",begin);
        node.setAttributeNS(null,"rotate","auto");
        this.element().appendChild(node);
      } catch(e) {
        log.Logger.error(this,e);
      }
      return this;
    }
    animateRotate(from, to, interval) {
      try {
        var node = document.createElementNS(@monad.svg.getDefaultNS(),'animateTransform');
        node.setAttributeNS(null,"attributeName","transform");
        node.setAttributeNS(null,"attributeType","XML");
        node.setAttributeNS(null,"type","rotate");
        node.setAttributeNS(null,"from",from);
        node.setAttributeNS(null,"to",to);
        node.setAttributeNS(null,"dur",interval);
        node.setAttributeNS(null,"fill","freeze");
        node.setAttributeNS(null,"begin","click");
        this.element().appendChild(node);
      } catch(e) {
        log.Logger.error(this,e);
      }
      return this;
    }
    animateTranslate(from, to, interval) {
      try {
        var node = document.createElementNS(@monad.svg.getDefaultNS(),'animateTransform');
        node.setAttributeNS(null,"attributeName","transform");
        node.setAttributeNS(null,"attributeType","XML");
        node.setAttributeNS(null,"type","translate");
        node.setAttributeNS(null,"from",from);
        node.setAttributeNS(null,"to",to);
        node.setAttributeNS(null,"dur",interval);
        node.setAttributeNS(null,"fill","freeze");
        node.setAttributeNS(null,"begin","click");
        this.element().appendChild(node);
      } catch(e) {
        log.Logger.error(this,e);
      }
      return this;
    }
    attributes(attrs, recurse) {
      for (var attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          try {
            if (this.element()) {
              this.element().setAttributeNS(null, attr, attrs[attr]);
            }
          } catch (e) {
            log.Logger.error(this,e);
          }
        }
      }
      return this;
    }
    bind(fn, ele, ucap) {
      var binder = function(c, f, e, u) {
        var cont = c;
        var func = f;
        var ele = e;
        var useCapture = u || (ele ? true : false);
        var closure = function(ev) {
          func.call(cont, ev, ele || cont.element());
        };
        return closure;
      };
      if (/^load/.test(this.event)) {
        if (DOMContinuation.loaded) {
          fn.call(this, ele);
        }
      } else {
        (ele || this.element()).setAttributeNS(null, 'on'+this.event, fn);
      }
      return this.monad;
    } 
    emboss() {
      return this;
    }
    getUserCoordinate(ev) {
      var point = @monad.svg.svg.createSVGPoint();
      point.x = ev.clientX;
      point.y = ev.clientY;
      return point.matrixTransform(@monad.svg.svg.getScreenCTM().inverse());
    }
    getPointFromTransform() {
      var point = @monad.svg.svg.createSVGPoint();
      var xy = @transform.match(/^.*translate\((.*)\)/)[1].split(',');
      point.x = parseInt(xy[0]);
      point.y = parseInt(xy[1]);
      return point;
    }
    move(x, y) {
      return this; 
    } 
    pointLight(x, y, z, color) {
      return this;
    }
    shadow(properties={}) {
      Object.adapt(properties,{horizontal:5,vertical:5,blurRadius:5,color:'#888',inset:false});
      var style = properties.horizontal+'px '+properties.vertical+'px '+properties.blurRadius+'px '+properties.color;
      style += properties.inset ? ' inset' : '';
      this.style({'MozBoxShadow':style,'-webkit-box-shadow':style});
      return this;
    }
    style(styles) {
      for (var styleName in styles) {
        if (styles.hasOwnProperty(styleName)) {
          if (styleName === 'cssFloat' && utilities.Environment.ie) {
            @monad.element.style.styleFloat = styles[styleName];
          } else {
            @monad.element.style[styleName] = styles[styleName];
          }
        }
      }
      return this;
    }               
    unbind(func, ele, ucap) {
      @active = false;
      DOMContinuation.prototype.unbind.call(this,func,ele,ucap);
      return this;
    }
  };
  export class SVGMoveable extends SVGable {
    constructor(properties={}) {
      SVGable.call(this, properties);
      @continuationConstructor = SVGMoveContinuation;
    }
  };
  export class SVGMoveContinuation extends SVGContinuation {
    constructor(properties={}) {
      private active, offsetX, offsetY, transform;
      SVGContinuation.call(this, properties);
      @active = false;
      @offsetX = 0;
      @offsetY = 0;
      @transform = null;
    }
    move() {
      @transform =  this.element().getAttributeNS(null, 'transform') || "";
      this.element().addEventListener('mousedown', this.onmovebegin);
      @monad.svg.svg.addEventListener('mousemove', this.onmoveduring);
      @monad.svg.svg.ownerDocument.addEventListener('mouseup', this.onmoveend);
      return this.bind(this.onmovebegin);
    }
    translate(x, y) {
      var translate = ' translate(' + x + ',' + y + ')';
      this.element().setAttribute('transform', translate);
      return this;
    }
    onmovebegin(ev) {
      ev.preventDefault();
      if(!@active) {
        var point = this.getUserCoordinate(ev);
        @offsetX = point.x;
        @offsetY = point.y;
        @active = true;
      }
      return false;
    }
    onmoveduring(ev) {
      if(@active) {
        ev.preventDefault();
        var point = this.getUserCoordinate(ev);
        var x = point.x - offsetX, y = point.y - offsetY;
        this.translate(x, y);
      }
      return false;
    }
    onmoveend(ev) {
      @active = false;
      return false;
    }
  };
  export class SVGRotatable extends SVGable {
    constructor(properties={}) {
      SVGable.call(this, properties);
      @continuationConstructor = SVGRotateContinuation;
    }
  };
  export class SVGRotateContinuation extends SVGContinuation {
    constructor(properties={}) {
      private active, offsetX, offsetY, transform;
      SVGContinuation.call(this, properties);
      @active = false;
      @offsetX = 0;
      @offsetY = 0;
      @transform = null;
    }
    rotate() {
      @transform = this.element().getAttributeNS(null, 'transform') || "";
      this.element().addEventListener('mousedown', this.onrotatebegin);
      @monad.svg.svg.addEventListener('mousemove', this.onrotateduring);
      @monad.svg.svg.ownerDocument.addEventListener('mouseup', this.onrotateend);
      return this.bind(this.onrotatebegin);
    }
    transform(evt, x, y) {
      var rise = y - lastY;
      var run = x - lastX;
      var degrees = Math.atan(rise/run)*180/Math.PI;
      var transform =  'rotate(' + degrees + ')  translate(' + x + ',' + y + ')';
      this.element().setAttributeNS(null, 'transform', transform);
      return this;
    }
    onrotatebegin(ev) {
      ev.preventDefault();
      if(!@active) {
        var point = this.getUserCoordinate(ev);
        @offsetX = point.x;
        @offsetY = point.y;
        @active = true;
      }
      return false;
    }
    onrotateduring(ev) {
      if(@active) {
        var point = this.getUserCoordinate(ev);
        var x = @point.x - @offsetX, y = @point.y - @offsetY;
        this.translate(x, y);
      }
      return false;
    }
    onrotateend(ev) {
      @active = false;
      return false;
    }
  }; 
  export class SVGTouchable extends SVGable {
    constructor(properties={}) {
      SVGable.call(this, properties);
      @continuationConstructor = SVGTouchContinuation;
    }
  };
  export class SVGTouchContinuation extends SVGContinuation {
    constructor(properties={}) {
      private active, offsetX, offsetY, transform;
      SVGContinuation.call(this, properties);
      @active = false;
      @offsetX = 0;
      @offsetY = 0;
      @transform = null;
    }
    getUserCoordinate(ev) {
      var point = @monad.svg.svg.createSVGPoint();
      if(ev.touches.length === 1) {
        var touch = ev.touches[0];
        point.x = touch.pageX;
        point.y = touch.pageY;
      }  
      return point.matrixTransform(@monad.svg.svg.getScreenCTM().inverse());
    }
    gesture() {
      this.element().addEventListener('gesturestart', this.ongesturestart);
      this.element().addEventListener('gesturechange', this.ongesturechange);
      this.element().addEventListener('gestureend', this.ongestureend);
      return this;
    }
    touch() {
      this.element().addEventListener('touchstart', this.ontouchstart);
      this.element().addEventListener('touchmove', this.ontouchmove);
      this.element().addEventListener('touchend', this.ontouchend);
      return this;
    }
    translate(x, y) {
      var translate = ' translate(' + x + ',' + y + ')';
      this.element().setAttribute('transform', translate);
      return this;
    }
    ontouchstart(ev) {
      ev.preventDefault();
      if(!@active) {
        var point = this.getUserCoordinate(ev);
        @offsetX = @point.x;
        @offsetY = @point.y;
        @active = true;
      }
      return false;
    }
    ontouchmove(ev) {
      ev.preventDefault();
      var point = this.getUserCoordinate(ev);
      var x = @point.x - @offsetX, y = @point.y - @offsetY;
      this.translate(x, y);
      return false;
    }
    ontouchend(ev) {
      if(ev.touches.length === 0) {
        @active = false;
      }
    }
    ongesturestart(ev) {
      ev.preventDefault();
      handlingGesture = true;
      var node = ev.target;
      x = parseInt(node.getAttributeNS(null, 'x'));
      y = parseInt(node.getAttributeNS(null, 'y'));
      width = parseInt(node.getAttributeNS(null, 'width'));
      height = parseInt(node.getAttributeNS(null, 'height'));
      var transform = (node.getAttributeNS(null, 'transform'));
      rotation = parseInt(transform.split('rotate(')[1].split(' ')[0]); // ouch
      if(isNaN(rotation)) {
        rotation = 0;
      }
      return false;
    }
    ongesturechange(ev) {
      ev.preventDefault();
      var node = ev.target;
      var newWidth = width * ev.scale;
      var newHeight = height * ev.scale;
      var newX = x - (newWidth - width)/2;
      var newY = y - (newHeight - height)/2; 
      node.setAttributeNS(null, 'width', newWidth);
      node.setAttributeNS(null, 'height', newHeight);
      node.setAttributeNS(null, 'x', newX);
      node.setAttributeNS(null, 'y', newY);
      var newRotation = rotation + ev.rotation;
      var centerX = newX + newWidth/2;
      var centerY = newY + newHeight/2;
      this.setRotation(node, newRotation, centerX, centerY);
      return false;
    }
    ongestureend(ev) {
      rotation = rotation + ev.rotation;
    }
  };
  export class SvgType {
    constructor(properties={}) {
      private attributes, type;
      @attributes = null;
      @type = null;
      var root = properties.root;
      if (root) {
        root.lift(this.constructor);
      }
    }
    setAttributes(composer,attrs) {
      @attributes = attrs;
      for(var attr in attrs) {
        if (attr === 'text') {
          @type.appendChild(document.createTextNode(attrs[attr]));
        } else if (attr === 'xlink:href') {
          @type.setAttributeNS(composer.xlinkNS,"href",attrs[attr]);
        } else {
          @type.setAttribute(attr,attrs[attr]);
        }
      }          
      return this;
    }
    setType(t) {
      @type = t;
      return this;
    }
  };
  export class Defs extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    defs(composer) {
      if(composer) {
        var current = composer.svg.childNodes && composer.svg.childNodes.length && composer.svg.childNodes[0];
        @type = current || document.createElementNS(composer.svgNS,'defs');
        composer.top().appendChild(@type);
        composer.push(@type);
      }
      return this;
    } 
  };
  export class G extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    g(composer,attrs) {
      var node;
      if(attrs) {
        node = @type = document.createElementNS(composer.svgNS,'g');
        composer.top().appendChild(node);
        composer.push(node);
        this.setAttributes(composer,attrs);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('g');
        node && node.length && composer.push(node[0]);
      }
      return this;
    } 
  };
  export class Animate extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties);
    }
    animate(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'animate');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class AnimateColor extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties);
    }
    animateColor(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'animateColor');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class AnimateMotion extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties);
    }
    animateMotion(composer,attrs) {
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'animateMotion');
        @setAttributes(composer,attrs);
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('animateMotion');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class AnimateTransform extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties);
    }
    animateTransform(composer,attrs) { 
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'animateTransform');
        @setAttributes(composer,attrs);
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('animateTransform');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class Circle extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    circle(composer,attrs) { 
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'circle');
        @setAttributes(composer,attrs);
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('circle');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class ClipPath extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    clipPath(composer,attrs) { 
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'clipPath');
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
        this.setAttributes(composer,attrs);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('clipPath');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class Ellipse extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    ellipse(composer,attrs) {
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'ellipse');
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
        this.setAttributes(composer,attrs);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('ellipse');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class FeBlend extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feBlend(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feBlend');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeComponentTransfer extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feComponentTransfer(composer,attrs) { 
      var node;
      if(attrs) {
        @type = document.createElementNS(composer.svgNS,'feComponentTransfer');
        node = @type;
        composer.top().appendChild(node);
        composer.push(node);
        this.setAttributes(composer,attrs);
      } else {
        node = SVGable({element:composer.top(),svg:composer.svg}).on('load').children('feComponentTransfer');
        node && node.length && composer.push(node[0]);
      }
      return this;          
    }
  };
  export class FeComposite extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feComposite(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS, 'feComposite');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeDiffuseLighting extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feDiffuseLighting(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'feDiffuseLighting');
      var node = @type;
      composer.top().appendChild(node);
      composer.push(node);
      this.setAttributes(composer,attrs);
      return this;         
    }
  };
  export class FeDisplacementMap extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feDisplacementMap(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feDisplacementMap');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeFlood extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feFlood(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS, 'feFlood');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeFuncA extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feFuncA(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feFuncA');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeImage extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feImage(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feImage');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeGaussianBlur extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feGaussianBlur(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS, 'feGaussianBlur');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeMerge extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feMerge(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'feMerge');
      composer.top().appendChild(@type);
      composer.push(@type);
      return this;          
    }
  };
  export class FeMergeNode extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feMergeNode(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feMergeNode');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeOffset extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feOffset(composer,attrs) {
      @type = document.createElementNS(composer.svgNS, 'feOffset');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FePointLight extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    fePointLight(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'fePointLight');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeSpecularLighting extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feSpecularLighting(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'feSpecularLighting');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeTile extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feTile(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'feTile');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeTransform extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feTransform(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS, 'feTransform');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class FeTurbulence extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    feTurbulence(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS, 'feTurbulence');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Filter extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    filter(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'filter');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Line extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    line(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'line');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class LinearGradient extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    linearGradient(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'linearGradient');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Marker extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    marker(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'marker');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Mpath extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    mpath(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'mpath');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Path extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    path(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'path');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Pattern extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    pattern(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'pattern');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Polygon extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    polygon(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'polygon');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class RadialGradient extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    radialGradient(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'radialGradient');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Rect extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    rect(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'rect');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }    
  };
  export class Stop extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    stop(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'stop');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Text extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    text(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'text');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class TextArea extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    textArea(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'textArea');
      composer.top().appendChild(@type);
      composer.push(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class TextPath extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    textPath(composer,attrs) {
      @type = document.createElementNS(composer.svgNS,'textPath');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }
  };
  export class Tspan extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    tspan(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'tspan');
      composer.top().appendChild(@type);
      this.setAttributes(this,attrs);
      return this;          
    }
  };
  export class Use extends SvgType {
    constructor(properties={}) {
      SvgType.call(this,properties); 
    }
    use(composer,attrs) { 
      @type = document.createElementNS(composer.svgNS,'use');
      composer.top().appendChild(@type);
      this.setAttributes(composer,attrs);
      return this;          
    }    
  };
  export class Svg extends monads.Composer {
    constructor(properties={id:Math.uuid(8),style:{}}) {
      private defaultNS, height, id, svgNS, stack, svg, style, viewBox, width, xlinkNS;
      Composer.call(this);
      @defaultNS = "http://www.w3.org/2000/svg";
      @height = properties.height || (properties.dimensions && properties.dimensions.height) || "100%";
      @id = properties.id || Math.uuid(8);
      @svgNS = "http://www.w3.org/2000/svg";
      @svg = null;
      @style = properties.style;
      @viewBox = "none";
      @width = properties.width || (properties.dimensions && properties.dimensions.width) || "100%";
      @xlinkNS = "http://www.w3.org/1999/xlink";
      @composables = {};
      this.createOrFind(properties);
      @stack = utilities.Stack().push(@svg);
      Defs({root: this});
      G({root: this});
      Animate({root: this});
      AnimateColor({root: this});
      AnimateMotion({root: this});
      AnimateTransform({root: this});
      Circle({root: this});
      ClipPath({root: this});
      Ellipse({root: this});        
      FeBlend({root: this});
      FeComponentTransfer({root: this});
      FeComposite({root: this});
      FeDiffuseLighting({root: this});
      FeDisplacementMap({root: this});
      FeFlood({root: this});
      FeFuncA({root: this});
      FeImage({root: this});
      FeGaussianBlur({root: this});
      FeMerge({root: this});
      FeMergeNode({root: this});
      FeOffset({root: this});
      FePointLight({root: this});
      FeSpecularLighting({root: this});
      FeTile({root: this});
      FeTransform({root: this});
      FeTurbulence({root: this});
      Filter({root: this});
      LinearGradient({root: this});        
      Line({root: this});        
      Marker({root: this});        
      Mpath({root: this});
      Path({root: this});
      Pattern({root: this});          
      Polygon({root: this});
      RadialGradient({root: this});        
      Rect({root: this});
      Stop({root: this});
      Text({root: this});
      TextArea({root: this});        
      TextPath({root: this});
      Tspan({root: this});        
      Use({root: this});
    }
    createOrFind(properties) {
      @svg = @svg || document.getElementById(@id);
      if(!@svg) {  
        @svg = document.createElementNS(@svgNS,'svg');
        @svg.setAttribute('id',@id);
      }
      @svg.setAttribute('width',@width);
      @svg.setAttribute('height',@height);
      @setXmlNS();
      @setXlinkNS();
      if(@style) {
        for(var name in @style) {
          if(@style.hasOwnProperty(name)) {      
            @svg.style[name] = @style[name];
          }
        }
      }
      return this;
    }
    end() {
      @stack.pop();
      return this;
    }
    pop() {
      return @stack.pop();
    }
    push(o) {
      @stack.push(o);
      return this;
    }
    setXmlNS() {
      @svg && @svg.setAttribute("xmlns", @svgNS);
      return this;
    }
    setXlinkNS() {
      @svg && @svg.setAttribute("xmlns:xlink", @xlinkNS);
      return this;
    }
    setVersion() {
      @svg && @svg.setAttribute("version", "1.1");
      return this;
    }
    setViewBox(v) {
      if (v && v !== 'none') {
        @viewBox = v;
        @svg && @svg.setAttribute('viewBox', @viewBox);
      }
      return this;
    }
    setHeight(h) {
      @height = h;
      @svg && @svg.setAttribute('height',@height);
      return this;
    }
    setWidth(w) {
      @width = w;
      @svg && @svg.setAttribute('width',width);
      return this;
    }
    top() {
      return @stack.top();
    }        
    add(svgType,config) {
      config.id = @id;
      svgType(config);
      return this;
    }
    lift(composableType) {
      if(composableType.name) {
        var method = composableType.name.substr(0,1).toLowerCase() + 
        composableType.name.substr(1,composableType.name.length);
        var methods = composableType.prototype;
        var self = this;
        if(methods.hasOwnProperty(method) && typeof(methods[method]) === 'function' && !this[method]) {
          this[method] = function() {
            try {
              var inst = new composableType({root:self});
              self.addComposable(composableType.name,inst);
              var args = [self];
              var remainder = Array.prototype.slice.call(arguments);
              var combined = args.concat(remainder);
              methods[method].apply(inst,combined);
            } catch(e) {
              log.Logger.error(this,e);
            }
            return self;
          }
        }
      }
      return this;
    }
  };
  export class SvgNode extends SvgType {
    constructor(properties={background:'white',color:'black',dimensions:{x:0,y:0,width:110,height:25},
      id:Math.uuid(8),transform:'scale(1.0)'}) {
      private background, className, color, dimensions, enabled, id, root, transform;
      @background = 'white';
      @className = properties.className || 'svg-'+this.constructor.name;
      @color = properties.color;
      @dimensions = properties.dimensions;
      @enabled = true;
      @id = null;
      @transform = properties.transform;
      if(!properties.viewBox) {
        properties.viewBox = "none";
      }
      var x = @dimensions.x;
      var y = @dimensions.y;
      var width = @dimensions.width;
      var height = @dimensions.height;
      properties.width = width+'px';
      properties.height = height+'px';
      properties.top = x+'px';
      properties.left = y+'px';   
      @root = Svg(properties);
    }
    add(svgtype, config) {
      @root.add(svgtype, config);
      return this;
    }
    element() {
      return @root && @root.svg;
    }
    get id() {
        return root && root.getId();
    }
    insert(target) {
      monads.DOMable({id:@id}).on('load').insert(target);
      return this;   
    }
    style(styles) {
        if (!!@styles) {
          for (var styleName in @styles) {
            if (@styles.hasOwnProperty(styleName)) {
              if (styleName === 'cssFloat' && utilities.Environment.ie) {
                this.element().style.styleFloat = @styles[styleName];
              } else {
                this.element().style[styleName] = @styles[styleName];
              }
            }
          }
        }
        return this;
    }
    static JUSTIFY = {left:"start",center:"middle",right:"end"}
  };
}
