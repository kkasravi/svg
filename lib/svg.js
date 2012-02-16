(function() {
  var nm = module.Module('svg');
  (function(require, exports, moduleId) {
    var log = require('log');
    var events = require('events');
    var monads = require('monads');
    var utilities = require('utilities');
    var SVGable = (function() {
      SVGable.prototype = monads.DOMable();
      SVGable.prototype.constructor = SVGable;
      var DOMable = monads.DOMable.constructor;
      function SVGable() {
        function privateData() {
          this.dimensions = null;
          this.svg = null;
          this.transform = null;
        }
        var p_vars = new privateData();
        var dimensions = p_vars.dimensions;
        Object.getOwnPropertyDescriptor(this,'dimensions') || Object.defineProperty(this,'dimensions', {get: function(){return dimensions;},set: function(e){dimensions=e;}});
        var svg = p_vars.svg;
        Object.getOwnPropertyDescriptor(this,'svg') || Object.defineProperty(this,'svg', {get: function(){return svg;},set: function(e){svg=e;}});
        var transform = p_vars.transform;
        Object.getOwnPropertyDescriptor(this,'transform') || Object.defineProperty(this,'transform', {get: function(){return transform;},set: function(e){transform=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {
            dimensions:{
              x:0,
              y:0,
              width:'100%',
              height:'100%'
            },
            viewBox:'none',
            transform:'scale(1.0)'
          };
          this.dimensions=properties.dimensions;
          this.svg=properties.svg;
          this.transform=null;
          var x=this.dimensions.x;
          var y=this.dimensions.y;
          var width=this.dimensions.width;
          var height=this.dimensions.height;
          this.transform=properties.transform;
          properties.width=width + 'px';
          properties.height=height + 'px';
          properties.top=x + 'px';
          properties.left=y + 'px';
          if(properties.id) {
            DOMable.call(this,{
              id:properties.id
            });
          } else if(properties.element) {
            DOMable.call(this,{
              element:properties.element
            });
          }
          if(this.svg) {
            this.svg=typeof((this.svg)) === 'string'?Svg({
              id:this.svg
            }):this.svg;
            this.element=this.element || this.svg.svg.getElementById(this.id);
          }
          this.continuationConstructor=SVGContinuation;
        }
        return ctor.apply(this,args) || this;
      }
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGable;
        return new SVGable(args && args.length && args[0]);
      };
    })();
    exports.SVGable = SVGable;
    var SVGContinuation = (function() {
      SVGContinuation.prototype = monads.DOMContinuation();
      SVGContinuation.prototype.constructor = SVGContinuation;
      var DOMContinuation = monads.DOMContinuation.constructor;
      function SVGContinuation() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          DOMContinuation.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      SVGContinuation.prototype['animatePath'] = function(begin,interval,path) {
        try {
          var node=document.createElementNS(this.monad.svg.getDefaultNS(),'animateMotion');
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
      };
      SVGContinuation.prototype['animateRotate'] = function(from,to,interval) {
        try {
          var node=document.createElementNS(this.monad.svg.getDefaultNS(),'animateTransform');
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
      };
      SVGContinuation.prototype['animateTranslate'] = function(from,to,interval) {
        try {
          var node=document.createElementNS(this.monad.svg.getDefaultNS(),'animateTransform');
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
      };
      SVGContinuation.prototype['attributes'] = function(attrs,recurse) {
        for(attr in attrs) {
          if(attrs.hasOwnProperty(attr)) {
            try {
              if(this.element()) {
                this.element().setAttributeNS(null,attr,attrs[attr]);
              }
            } catch(e) {
              log.Logger.error(this,e);
            }
          }
        }
        return this;
      };
      SVGContinuation.prototype['bind'] = function(fn,ele,ucap) {
        var binder=function (c,f,e,u) {
          var cont=c;
          var func=f;
          var ele=e;
          var useCapture=u || (ele?true:false);
          var closure=function (ev) {
            func.call(cont,ev,ele || cont.element());
          };
          return closure;
        };
        if(/^load/.test(this.event)) {
          if(DOMContinuation.loaded) {
            fn.call(this,ele);
          }
        } else {
          (ele || this.element()).setAttributeNS(null,'on' + this.event,fn);
        }
        return this.monad;
      };
      SVGContinuation.prototype['emboss'] = function() {
        return this;
      };
      SVGContinuation.prototype['getUserCoordinate'] = function(ev) {
        var point=this.monad.svg.svg.createSVGPoint();
        point.x=ev.clientX;
        point.y=ev.clientY;
        return point.matrixTransform(this.monad.svg.svg.getScreenCTM().inverse());
      };
      SVGContinuation.prototype['getPointFromTransform'] = function() {
        var point=this.monad.svg.svg.createSVGPoint();
        var xy=this.transform.match(/^.*translate\((.*)\)/)[1].split(',');
        point.x=parseInt(xy[0]);
        point.y=parseInt(xy[1]);
        return point;
      };
      SVGContinuation.prototype['move'] = function(x,y) {
        return this;
      };
      SVGContinuation.prototype['pointLight'] = function(x,y,z,color) {
        return this;
      };
      SVGContinuation.prototype['shadow'] = function(_properties) {
        Object.adapt(properties,{
          horizontal:5,
          vertical:5,
          blurRadius:5,
          color:'#888',
          inset:false
        });
        var style=properties.horizontal + 'px ' + properties.vertical + 'px ' + properties.blurRadius + 'px ' + properties.color;
        style+=properties.inset?' inset':'';
        this.style({
          'MozBoxShadow':style,
          '-webkit-box-shadow':style
        });
        return this;
      };
      SVGContinuation.prototype['style'] = function(styles) {
        for(styleName in styles) {
          if(styles.hasOwnProperty(styleName)) {
            if(styleName === 'cssFloat' && utilities.Environment.ie) {
              this.monad.element.style.styleFloat=styles[styleName];
            } else {
              this.monad.element.style[styleName]=styles[styleName];
            }
          }
        }
        return this;
      };
      SVGContinuation.prototype['unbind'] = function(func,ele,ucap) {
        this.active=false;
        DOMContinuation.prototype.unbind.call(this,func,ele,ucap);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGContinuation;
        return new SVGContinuation(args && args.length && args[0]);
      };
    })();
    exports.SVGContinuation = SVGContinuation;
    var SVGMoveable = (function() {
      SVGMoveable.prototype = exports.SVGable();
      SVGMoveable.prototype.constructor = SVGMoveable;
      var SVGable = exports.SVGable.constructor;
      function SVGMoveable() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGable.call(this,properties);
          this.continuationConstructor=SVGMoveContinuation;
        }
        return ctor.apply(this,args) || this;
      }
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGMoveable;
        return new SVGMoveable(args && args.length && args[0]);
      };
    })();
    exports.SVGMoveable = SVGMoveable;
    var SVGMoveContinuation = (function() {
      SVGMoveContinuation.prototype = exports.SVGContinuation();
      SVGMoveContinuation.prototype.constructor = SVGMoveContinuation;
      var SVGContinuation = exports.SVGContinuation.constructor;
      function SVGMoveContinuation() {
        function privateData() {
          this.active = null;
          this.offsetX = null;
          this.offsetY = null;
          this.transform = null;
        }
        var p_vars = new privateData();
        var active = p_vars.active;
        Object.getOwnPropertyDescriptor(this,'active') || Object.defineProperty(this,'active', {get: function(){return active;},set: function(e){active=e;}});
        var offsetX = p_vars.offsetX;
        Object.getOwnPropertyDescriptor(this,'offsetX') || Object.defineProperty(this,'offsetX', {get: function(){return offsetX;},set: function(e){offsetX=e;}});
        var offsetY = p_vars.offsetY;
        Object.getOwnPropertyDescriptor(this,'offsetY') || Object.defineProperty(this,'offsetY', {get: function(){return offsetY;},set: function(e){offsetY=e;}});
        var transform = p_vars.transform;
        Object.getOwnPropertyDescriptor(this,'transform') || Object.defineProperty(this,'transform', {get: function(){return transform;},set: function(e){transform=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGContinuation.call(this,properties);
          this.active=false;
          this.offsetX=0;
          this.offsetY=0;
          this.transform=null;
        }
        return ctor.apply(this,args) || this;
      }
      SVGMoveContinuation.prototype['move'] = function() {
        this.transform=this.element().getAttributeNS(null,'transform') || "";
        this.element().addEventListener('mousedown',this.onmovebegin);
        this.monad.svg.svg.addEventListener('mousemove',this.onmoveduring);
        this.monad.svg.svg.ownerDocument.addEventListener('mouseup',this.onmoveend);
        return this.bind(this.onmovebegin);
      };
      SVGMoveContinuation.prototype['translate'] = function(x,y) {
        var translate=' translate(' + x + ',' + y + ')';
        this.element().setAttribute('transform',translate);
        return this;
      };
      SVGMoveContinuation.prototype['onmovebegin'] = function(ev) {
        ev.preventDefault();
        if(!this.active) {
          var point=this.getUserCoordinate(ev);
          this.offsetX=point.x;
          this.offsetY=point.y;
          this.active=true;
        }
        return false;
      };
      SVGMoveContinuation.prototype['onmoveduring'] = function(ev) {
        if(this.active) {
          ev.preventDefault();
          var point=this.getUserCoordinate(ev);
          var x=point.x - offsetX,y=point.y - offsetY;
          this.translate(x,y);
        }
        return false;
      };
      SVGMoveContinuation.prototype['onmoveend'] = function(ev) {
        this.active=false;
        return false;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGMoveContinuation;
        return new SVGMoveContinuation(args && args.length && args[0]);
      };
    })();
    exports.SVGMoveContinuation = SVGMoveContinuation;
    var SVGRotatable = (function() {
      SVGRotatable.prototype = exports.SVGable();
      SVGRotatable.prototype.constructor = SVGRotatable;
      var SVGable = exports.SVGable.constructor;
      function SVGRotatable() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGable.call(this,properties);
          this.continuationConstructor=SVGRotateContinuation;
        }
        return ctor.apply(this,args) || this;
      }
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGRotatable;
        return new SVGRotatable(args && args.length && args[0]);
      };
    })();
    exports.SVGRotatable = SVGRotatable;
    var SVGRotateContinuation = (function() {
      SVGRotateContinuation.prototype = exports.SVGContinuation();
      SVGRotateContinuation.prototype.constructor = SVGRotateContinuation;
      var SVGContinuation = exports.SVGContinuation.constructor;
      function SVGRotateContinuation() {
        function privateData() {
          this.active = null;
          this.offsetX = null;
          this.offsetY = null;
          this.transform = null;
        }
        var p_vars = new privateData();
        var active = p_vars.active;
        Object.getOwnPropertyDescriptor(this,'active') || Object.defineProperty(this,'active', {get: function(){return active;},set: function(e){active=e;}});
        var offsetX = p_vars.offsetX;
        Object.getOwnPropertyDescriptor(this,'offsetX') || Object.defineProperty(this,'offsetX', {get: function(){return offsetX;},set: function(e){offsetX=e;}});
        var offsetY = p_vars.offsetY;
        Object.getOwnPropertyDescriptor(this,'offsetY') || Object.defineProperty(this,'offsetY', {get: function(){return offsetY;},set: function(e){offsetY=e;}});
        var transform = p_vars.transform;
        Object.getOwnPropertyDescriptor(this,'transform') || Object.defineProperty(this,'transform', {get: function(){return transform;},set: function(e){transform=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGContinuation.call(this,properties);
          this.active=false;
          this.offsetX=0;
          this.offsetY=0;
          this.transform=null;
        }
        return ctor.apply(this,args) || this;
      }
      SVGRotateContinuation.prototype['rotate'] = function() {
        this.transform=this.element().getAttributeNS(null,'transform') || "";
        this.element().addEventListener('mousedown',this.onrotatebegin);
        this.monad.svg.svg.addEventListener('mousemove',this.onrotateduring);
        this.monad.svg.svg.ownerDocument.addEventListener('mouseup',this.onrotateend);
        return this.bind(this.onrotatebegin);
      };
      SVGRotateContinuation.prototype['transform'] = function(evt,x,y) {
        var rise=y - lastY;
        var run=x - lastX;
        var degrees=Math.atan(rise / run) * 180 / Math.PI;
        var transform='rotate(' + degrees + ')  translate(' + x + ',' + y + ')';
        this.element().setAttributeNS(null,'transform',transform);
        return this;
      };
      SVGRotateContinuation.prototype['onrotatebegin'] = function(ev) {
        ev.preventDefault();
        if(!this.active) {
          var point=this.getUserCoordinate(ev);
          this.offsetX=point.x;
          this.offsetY=point.y;
          this.active=true;
        }
        return false;
      };
      SVGRotateContinuation.prototype['onrotateduring'] = function(ev) {
        if(this.active) {
          var point=this.getUserCoordinate(ev);
          var x=this.point.x - this.offsetX,y=this.point.y - this.offsetY;
          this.translate(x,y);
        }
        return false;
      };
      SVGRotateContinuation.prototype['onrotateend'] = function(ev) {
        this.active=false;
        return false;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGRotateContinuation;
        return new SVGRotateContinuation(args && args.length && args[0]);
      };
    })();
    exports.SVGRotateContinuation = SVGRotateContinuation;
    var SVGTouchable = (function() {
      SVGTouchable.prototype = exports.SVGable();
      SVGTouchable.prototype.constructor = SVGTouchable;
      var SVGable = exports.SVGable.constructor;
      function SVGTouchable() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGable.call(this,properties);
          this.continuationConstructor=SVGTouchContinuation;
        }
        return ctor.apply(this,args) || this;
      }
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGTouchable;
        return new SVGTouchable(args && args.length && args[0]);
      };
    })();
    exports.SVGTouchable = SVGTouchable;
    var SVGTouchContinuation = (function() {
      SVGTouchContinuation.prototype = exports.SVGContinuation();
      SVGTouchContinuation.prototype.constructor = SVGTouchContinuation;
      var SVGContinuation = exports.SVGContinuation.constructor;
      function SVGTouchContinuation() {
        function privateData() {
          this.active = null;
          this.offsetX = null;
          this.offsetY = null;
          this.transform = null;
        }
        var p_vars = new privateData();
        var active = p_vars.active;
        Object.getOwnPropertyDescriptor(this,'active') || Object.defineProperty(this,'active', {get: function(){return active;},set: function(e){active=e;}});
        var offsetX = p_vars.offsetX;
        Object.getOwnPropertyDescriptor(this,'offsetX') || Object.defineProperty(this,'offsetX', {get: function(){return offsetX;},set: function(e){offsetX=e;}});
        var offsetY = p_vars.offsetY;
        Object.getOwnPropertyDescriptor(this,'offsetY') || Object.defineProperty(this,'offsetY', {get: function(){return offsetY;},set: function(e){offsetY=e;}});
        var transform = p_vars.transform;
        Object.getOwnPropertyDescriptor(this,'transform') || Object.defineProperty(this,'transform', {get: function(){return transform;},set: function(e){transform=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SVGContinuation.call(this,properties);
          this.active=false;
          this.offsetX=0;
          this.offsetY=0;
          this.transform=null;
        }
        return ctor.apply(this,args) || this;
      }
      SVGTouchContinuation.prototype['getUserCoordinate'] = function(ev) {
        var point=this.monad.svg.svg.createSVGPoint();
        if(ev.touches.length === 1) {
          var touch=ev.touches[0];
          point.x=touch.pageX;
          point.y=touch.pageY;
        }
        return point.matrixTransform(this.monad.svg.svg.getScreenCTM().inverse());
      };
      SVGTouchContinuation.prototype['gesture'] = function() {
        this.element().addEventListener('gesturestart',this.ongesturestart);
        this.element().addEventListener('gesturechange',this.ongesturechange);
        this.element().addEventListener('gestureend',this.ongestureend);
        return this;
      };
      SVGTouchContinuation.prototype['touch'] = function() {
        this.element().addEventListener('touchstart',this.ontouchstart);
        this.element().addEventListener('touchmove',this.ontouchmove);
        this.element().addEventListener('touchend',this.ontouchend);
        return this;
      };
      SVGTouchContinuation.prototype['translate'] = function(x,y) {
        var translate=' translate(' + x + ',' + y + ')';
        this.element().setAttribute('transform',translate);
        return this;
      };
      SVGTouchContinuation.prototype['ontouchstart'] = function(ev) {
        ev.preventDefault();
        if(!this.active) {
          var point=this.getUserCoordinate(ev);
          this.offsetX=this.point.x;
          this.offsetY=this.point.y;
          this.active=true;
        }
        return false;
      };
      SVGTouchContinuation.prototype['ontouchmove'] = function(ev) {
        ev.preventDefault();
        var point=this.getUserCoordinate(ev);
        var x=this.point.x - this.offsetX,y=this.point.y - this.offsetY;
        this.translate(x,y);
        return false;
      };
      SVGTouchContinuation.prototype['ontouchend'] = function(ev) {
        if(ev.touches.length === 0) {
          this.active=false;
        }
      };
      SVGTouchContinuation.prototype['ongesturestart'] = function(ev) {
        ev.preventDefault();
        handlingGesture=true;
        var node=ev.target;
        x=parseInt(node.getAttributeNS(null,'x'));
        y=parseInt(node.getAttributeNS(null,'y'));
        width=parseInt(node.getAttributeNS(null,'width'));
        height=parseInt(node.getAttributeNS(null,'height'));
        var transform=(node.getAttributeNS(null,'transform'));
        rotation=parseInt(transform.split('rotate(')[1].split(' ')[0]);
        if(isNaN(rotation)) {
          rotation=0;
        }
        return false;
      };
      SVGTouchContinuation.prototype['ongesturechange'] = function(ev) {
        ev.preventDefault();
        var node=ev.target;
        var newWidth=width * ev.scale;
        var newHeight=height * ev.scale;
        var newX=x - (newWidth - width) / 2;
        var newY=y - (newHeight - height) / 2;
        node.setAttributeNS(null,'width',newWidth);
        node.setAttributeNS(null,'height',newHeight);
        node.setAttributeNS(null,'x',newX);
        node.setAttributeNS(null,'y',newY);
        var newRotation=rotation + ev.rotation;
        var centerX=newX + newWidth / 2;
        var centerY=newY + newHeight / 2;
        this.setRotation(node,newRotation,centerX,centerY);
        return false;
      };
      SVGTouchContinuation.prototype['ongestureend'] = function(ev) {
        rotation=rotation + ev.rotation;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SVGTouchContinuation;
        return new SVGTouchContinuation(args && args.length && args[0]);
      };
    })();
    exports.SVGTouchContinuation = SVGTouchContinuation;
    var SvgType = (function() {
      function SvgType() {
        function privateData() {
          this.attributes = null;
          this.type = null;
        }
        var p_vars = new privateData();
        var attributes = p_vars.attributes;
        Object.getOwnPropertyDescriptor(this,'attributes') || Object.defineProperty(this,'attributes', {get: function(){return attributes;},set: function(e){attributes=e;}});
        var type = p_vars.type;
        Object.getOwnPropertyDescriptor(this,'type') || Object.defineProperty(this,'type', {get: function(){return type;},set: function(e){type=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          this.attributes=null;
          this.type=null;
          var root=properties.root;
          if(root) {
            root.lift(this.constructor);
          }
        }
        return ctor.apply(this,args) || this;
      }
      SvgType.prototype['setAttributes'] = function(composer,attrs) {
        this.attributes=attrs;
        for(attr in attrs) {
          if(attr === 'text') {
            this.type.appendChild(document.createTextNode(attrs[attr]));
          } else if(attr === 'xlink:href') {
            this.type.setAttributeNS(composer.getXlinkNS(),"href",attrs[attr]);
          } else {
            this.type.setAttribute(attr,attrs[attr]);
          }
        }
        return this;
      };
      SvgType.prototype['setType'] = function(t) {
        this.type=t;
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = SvgType;
        return new SvgType(args && args.length && args[0]);
      };
    })();
    exports.SvgType = SvgType;
    var Defs = (function() {
      Defs.prototype = exports.SvgType();
      Defs.prototype.constructor = Defs;
      var SvgType = exports.SvgType.constructor;
      function Defs() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Defs.prototype['defs'] = function(composer) {
        if(composer) {
          var current=composer.svg.childNodes && composer.svg.childNodes.length && composer.svg.childNodes[0];
          this.type=current || document.createElementNS(composer.svgNS,'defs');
          composer.top().appendChild(this.type);
          composer.push(this.type);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Defs;
        return new Defs(args && args.length && args[0]);
      };
    })();
    exports.Defs = Defs;
    var G = (function() {
      G.prototype = exports.SvgType();
      G.prototype.constructor = G;
      var SvgType = exports.SvgType.constructor;
      function G() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      G.prototype['g'] = function(composer,attrs) {
        var node;
        if(attrs) {
          node=this.type=document.createElementNS(composer.svgNS,'g');
          composer.top().appendChild(node);
          composer.push(node);
          this.setAttributes(composer,attrs);
        } else {
          node=SVGable({
            element:composer.top(),
            svg:composer.svg
          }).on('load').children('g');
          node && node.length && composer.push(node[0]);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = G;
        return new G(args && args.length && args[0]);
      };
    })();
    exports.G = G;
    var Animate = (function() {
      Animate.prototype = exports.SvgType();
      Animate.prototype.constructor = Animate;
      var SvgType = exports.SvgType.constructor;
      function Animate() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Animate.prototype['animate'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'animate');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Animate;
        return new Animate(args && args.length && args[0]);
      };
    })();
    exports.Animate = Animate;
    var AnimateColor = (function() {
      AnimateColor.prototype = exports.SvgType();
      AnimateColor.prototype.constructor = AnimateColor;
      var SvgType = exports.SvgType.constructor;
      function AnimateColor() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      AnimateColor.prototype['animateColor'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'animateColor');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = AnimateColor;
        return new AnimateColor(args && args.length && args[0]);
      };
    })();
    exports.AnimateColor = AnimateColor;
    var AnimateMotion = (function() {
      AnimateMotion.prototype = exports.SvgType();
      AnimateMotion.prototype.constructor = AnimateMotion;
      var SvgType = exports.SvgType.constructor;
      function AnimateMotion() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      AnimateMotion.prototype['animateMotion'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'animateMotion');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = AnimateMotion;
        return new AnimateMotion(args && args.length && args[0]);
      };
    })();
    exports.AnimateMotion = AnimateMotion;
    var AnimateTransform = (function() {
      AnimateTransform.prototype = exports.SvgType();
      AnimateTransform.prototype.constructor = AnimateTransform;
      var SvgType = exports.SvgType.constructor;
      function AnimateTransform() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      AnimateTransform.prototype['animateTransform'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'animateTransform');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = AnimateTransform;
        return new AnimateTransform(args && args.length && args[0]);
      };
    })();
    exports.AnimateTransform = AnimateTransform;
    var Circle = (function() {
      Circle.prototype = exports.SvgType();
      Circle.prototype.constructor = Circle;
      var SvgType = exports.SvgType.constructor;
      function Circle() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Circle.prototype['circle'] = function(composer,attrs) {
        var node;
        if(attrs) {
          node=this.type=document.createElementNS(composer.svgNS,'circle');
          composer.top().appendChild(node);
          composer.push(node);
          this.setAttributes(composer,attrs);
        } else {
          node=SVGable({
            element:composer.top(),
            svg:composer.svg
          }).on('load').children('circle');
          node && node.length && composer.push(node[0]);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Circle;
        return new Circle(args && args.length && args[0]);
      };
    })();
    exports.Circle = Circle;
    var ClipPath = (function() {
      ClipPath.prototype = exports.SvgType();
      ClipPath.prototype.constructor = ClipPath;
      var SvgType = exports.SvgType.constructor;
      function ClipPath() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      ClipPath.prototype['clipPath'] = function(composer,attrs) {
        var node;
        if(attrs) {
          this.type=document.createElementNS(composer.svgNS,'clipPath');
          node=this.type;
          composer.top().appendChild(node);
          composer.push(node);
          this.setAttributes(composer,attrs);
        } else {
          node=SVGable({
            element:composer.top(),
            svg:composer.svg
          }).on('load').children('clipPath');
          node && node.length && composer.push(node[0]);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = ClipPath;
        return new ClipPath(args && args.length && args[0]);
      };
    })();
    exports.ClipPath = ClipPath;
    var Ellipse = (function() {
      Ellipse.prototype = exports.SvgType();
      Ellipse.prototype.constructor = Ellipse;
      var SvgType = exports.SvgType.constructor;
      function Ellipse() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Ellipse.prototype['ellipse'] = function(composer,attrs) {
        var node;
        if(attrs) {
          this.type=document.createElementNS(composer.svgNS,'ellipse');
          node=this.type;
          composer.top().appendChild(node);
          composer.push(node);
          this.setAttributes(composer,attrs);
        } else {
          node=SVGable({
            element:composer.top(),
            svg:composer.svg
          }).on('load').children('ellipse');
          node && node.length && composer.push(node[0]);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Ellipse;
        return new Ellipse(args && args.length && args[0]);
      };
    })();
    exports.Ellipse = Ellipse;
    var FeBlend = (function() {
      FeBlend.prototype = exports.SvgType();
      FeBlend.prototype.constructor = FeBlend;
      var SvgType = exports.SvgType.constructor;
      function FeBlend() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeBlend.prototype['feBlend'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feBlend');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeBlend;
        return new FeBlend(args && args.length && args[0]);
      };
    })();
    exports.FeBlend = FeBlend;
    var FeComponentTransfer = (function() {
      FeComponentTransfer.prototype = exports.SvgType();
      FeComponentTransfer.prototype.constructor = FeComponentTransfer;
      var SvgType = exports.SvgType.constructor;
      function FeComponentTransfer() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeComponentTransfer.prototype['feComponentTransfer'] = function(composer,attrs) {
        var node;
        if(attrs) {
          this.type=document.createElementNS(composer.svgNS,'feComponentTransfer');
          node=this.type;
          composer.top().appendChild(node);
          composer.push(node);
          this.setAttributes(composer,attrs);
        } else {
          node=SVGable({
            element:composer.top(),
            svg:composer.svg
          }).on('load').children('feComponentTransfer');
          node && node.length && composer.push(node[0]);
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeComponentTransfer;
        return new FeComponentTransfer(args && args.length && args[0]);
      };
    })();
    exports.FeComponentTransfer = FeComponentTransfer;
    var FeComposite = (function() {
      FeComposite.prototype = exports.SvgType();
      FeComposite.prototype.constructor = FeComposite;
      var SvgType = exports.SvgType.constructor;
      function FeComposite() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeComposite.prototype['feComposite'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feComposite');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeComposite;
        return new FeComposite(args && args.length && args[0]);
      };
    })();
    exports.FeComposite = FeComposite;
    var FeDiffuseLighting = (function() {
      FeDiffuseLighting.prototype = exports.SvgType();
      FeDiffuseLighting.prototype.constructor = FeDiffuseLighting;
      var SvgType = exports.SvgType.constructor;
      function FeDiffuseLighting() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeDiffuseLighting.prototype['feDiffuseLighting'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feDiffuseLighting');
        var node=this.type;
        composer.top().appendChild(node);
        composer.push(node);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeDiffuseLighting;
        return new FeDiffuseLighting(args && args.length && args[0]);
      };
    })();
    exports.FeDiffuseLighting = FeDiffuseLighting;
    var FeDisplacementMap = (function() {
      FeDisplacementMap.prototype = exports.SvgType();
      FeDisplacementMap.prototype.constructor = FeDisplacementMap;
      var SvgType = exports.SvgType.constructor;
      function FeDisplacementMap() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeDisplacementMap.prototype['feDisplacementMap'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feDisplacementMap');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeDisplacementMap;
        return new FeDisplacementMap(args && args.length && args[0]);
      };
    })();
    exports.FeDisplacementMap = FeDisplacementMap;
    var FeFlood = (function() {
      FeFlood.prototype = exports.SvgType();
      FeFlood.prototype.constructor = FeFlood;
      var SvgType = exports.SvgType.constructor;
      function FeFlood() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeFlood.prototype['feFlood'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feFlood');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeFlood;
        return new FeFlood(args && args.length && args[0]);
      };
    })();
    exports.FeFlood = FeFlood;
    var FeFuncA = (function() {
      FeFuncA.prototype = exports.SvgType();
      FeFuncA.prototype.constructor = FeFuncA;
      var SvgType = exports.SvgType.constructor;
      function FeFuncA() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeFuncA.prototype['feFuncA'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feFuncA');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeFuncA;
        return new FeFuncA(args && args.length && args[0]);
      };
    })();
    exports.FeFuncA = FeFuncA;
    var FeImage = (function() {
      FeImage.prototype = exports.SvgType();
      FeImage.prototype.constructor = FeImage;
      var SvgType = exports.SvgType.constructor;
      function FeImage() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeImage.prototype['feImage'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feImage');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeImage;
        return new FeImage(args && args.length && args[0]);
      };
    })();
    exports.FeImage = FeImage;
    var FeGaussianBlur = (function() {
      FeGaussianBlur.prototype = exports.SvgType();
      FeGaussianBlur.prototype.constructor = FeGaussianBlur;
      var SvgType = exports.SvgType.constructor;
      function FeGaussianBlur() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeGaussianBlur.prototype['feGaussianBlur'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feGaussianBlur');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeGaussianBlur;
        return new FeGaussianBlur(args && args.length && args[0]);
      };
    })();
    exports.FeGaussianBlur = FeGaussianBlur;
    var FeMerge = (function() {
      FeMerge.prototype = exports.SvgType();
      FeMerge.prototype.constructor = FeMerge;
      var SvgType = exports.SvgType.constructor;
      function FeMerge() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeMerge.prototype['feMerge'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feMerge');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeMerge;
        return new FeMerge(args && args.length && args[0]);
      };
    })();
    exports.FeMerge = FeMerge;
    var FeMergeNode = (function() {
      FeMergeNode.prototype = exports.SvgType();
      FeMergeNode.prototype.constructor = FeMergeNode;
      var SvgType = exports.SvgType.constructor;
      function FeMergeNode() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeMergeNode.prototype['feMergeNode'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feMergeNode');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeMergeNode;
        return new FeMergeNode(args && args.length && args[0]);
      };
    })();
    exports.FeMergeNode = FeMergeNode;
    var FeOffset = (function() {
      FeOffset.prototype = exports.SvgType();
      FeOffset.prototype.constructor = FeOffset;
      var SvgType = exports.SvgType.constructor;
      function FeOffset() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeOffset.prototype['feOffset'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feOffset');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeOffset;
        return new FeOffset(args && args.length && args[0]);
      };
    })();
    exports.FeOffset = FeOffset;
    var FePointLight = (function() {
      FePointLight.prototype = exports.SvgType();
      FePointLight.prototype.constructor = FePointLight;
      var SvgType = exports.SvgType.constructor;
      function FePointLight() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FePointLight.prototype['fePointLight'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'fePointLight');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FePointLight;
        return new FePointLight(args && args.length && args[0]);
      };
    })();
    exports.FePointLight = FePointLight;
    var FeSpecularLighting = (function() {
      FeSpecularLighting.prototype = exports.SvgType();
      FeSpecularLighting.prototype.constructor = FeSpecularLighting;
      var SvgType = exports.SvgType.constructor;
      function FeSpecularLighting() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeSpecularLighting.prototype['feSpecularLighting'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feSpecularLighting');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeSpecularLighting;
        return new FeSpecularLighting(args && args.length && args[0]);
      };
    })();
    exports.FeSpecularLighting = FeSpecularLighting;
    var FeTile = (function() {
      FeTile.prototype = exports.SvgType();
      FeTile.prototype.constructor = FeTile;
      var SvgType = exports.SvgType.constructor;
      function FeTile() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeTile.prototype['feTile'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feTile');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeTile;
        return new FeTile(args && args.length && args[0]);
      };
    })();
    exports.FeTile = FeTile;
    var FeTransform = (function() {
      FeTransform.prototype = exports.SvgType();
      FeTransform.prototype.constructor = FeTransform;
      var SvgType = exports.SvgType.constructor;
      function FeTransform() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeTransform.prototype['feTransform'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feTransform');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeTransform;
        return new FeTransform(args && args.length && args[0]);
      };
    })();
    exports.FeTransform = FeTransform;
    var FeTurbulence = (function() {
      FeTurbulence.prototype = exports.SvgType();
      FeTurbulence.prototype.constructor = FeTurbulence;
      var SvgType = exports.SvgType.constructor;
      function FeTurbulence() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      FeTurbulence.prototype['feTurbulence'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'feTurbulence');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = FeTurbulence;
        return new FeTurbulence(args && args.length && args[0]);
      };
    })();
    exports.FeTurbulence = FeTurbulence;
    var Filter = (function() {
      Filter.prototype = exports.SvgType();
      Filter.prototype.constructor = Filter;
      var SvgType = exports.SvgType.constructor;
      function Filter() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Filter.prototype['filter'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'filter');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Filter;
        return new Filter(args && args.length && args[0]);
      };
    })();
    exports.Filter = Filter;
    var Line = (function() {
      Line.prototype = exports.SvgType();
      Line.prototype.constructor = Line;
      var SvgType = exports.SvgType.constructor;
      function Line() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Line.prototype['line'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'line');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Line;
        return new Line(args && args.length && args[0]);
      };
    })();
    exports.Line = Line;
    var LinearGradient = (function() {
      LinearGradient.prototype = exports.SvgType();
      LinearGradient.prototype.constructor = LinearGradient;
      var SvgType = exports.SvgType.constructor;
      function LinearGradient() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      LinearGradient.prototype['linearGradient'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'linearGradient');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = LinearGradient;
        return new LinearGradient(args && args.length && args[0]);
      };
    })();
    exports.LinearGradient = LinearGradient;
    var Marker = (function() {
      Marker.prototype = exports.SvgType();
      Marker.prototype.constructor = Marker;
      var SvgType = exports.SvgType.constructor;
      function Marker() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Marker.prototype['marker'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'marker');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Marker;
        return new Marker(args && args.length && args[0]);
      };
    })();
    exports.Marker = Marker;
    var Path = (function() {
      Path.prototype = exports.SvgType();
      Path.prototype.constructor = Path;
      var SvgType = exports.SvgType.constructor;
      function Path() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Path.prototype['path'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'path');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Path;
        return new Path(args && args.length && args[0]);
      };
    })();
    exports.Path = Path;
    var Pattern = (function() {
      Pattern.prototype = exports.SvgType();
      Pattern.prototype.constructor = Pattern;
      var SvgType = exports.SvgType.constructor;
      function Pattern() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Pattern.prototype['pattern'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'pattern');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Pattern;
        return new Pattern(args && args.length && args[0]);
      };
    })();
    exports.Pattern = Pattern;
    var Polygon = (function() {
      Polygon.prototype = exports.SvgType();
      Polygon.prototype.constructor = Polygon;
      var SvgType = exports.SvgType.constructor;
      function Polygon() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Polygon.prototype['polygon'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'polygon');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Polygon;
        return new Polygon(args && args.length && args[0]);
      };
    })();
    exports.Polygon = Polygon;
    var RadialGradient = (function() {
      RadialGradient.prototype = exports.SvgType();
      RadialGradient.prototype.constructor = RadialGradient;
      var SvgType = exports.SvgType.constructor;
      function RadialGradient() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      RadialGradient.prototype['radialGradient'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'radialGradient');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = RadialGradient;
        return new RadialGradient(args && args.length && args[0]);
      };
    })();
    exports.RadialGradient = RadialGradient;
    var Rect = (function() {
      Rect.prototype = exports.SvgType();
      Rect.prototype.constructor = Rect;
      var SvgType = exports.SvgType.constructor;
      function Rect() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Rect.prototype['rect'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'rect');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Rect;
        return new Rect(args && args.length && args[0]);
      };
    })();
    exports.Rect = Rect;
    var Stop = (function() {
      Stop.prototype = exports.SvgType();
      Stop.prototype.constructor = Stop;
      var SvgType = exports.SvgType.constructor;
      function Stop() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Stop.prototype['stop'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'stop');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Stop;
        return new Stop(args && args.length && args[0]);
      };
    })();
    exports.Stop = Stop;
    var Text = (function() {
      Text.prototype = exports.SvgType();
      Text.prototype.constructor = Text;
      var SvgType = exports.SvgType.constructor;
      function Text() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Text.prototype['text'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'text');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Text;
        return new Text(args && args.length && args[0]);
      };
    })();
    exports.Text = Text;
    var TextArea = (function() {
      TextArea.prototype = exports.SvgType();
      TextArea.prototype.constructor = TextArea;
      var SvgType = exports.SvgType.constructor;
      function TextArea() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      TextArea.prototype['textArea'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'textArea');
        composer.top().appendChild(this.type);
        composer.push(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = TextArea;
        return new TextArea(args && args.length && args[0]);
      };
    })();
    exports.TextArea = TextArea;
    var TextPath = (function() {
      TextPath.prototype = exports.SvgType();
      TextPath.prototype.constructor = TextPath;
      var SvgType = exports.SvgType.constructor;
      function TextPath() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      TextPath.prototype['textPath'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'textPath');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = TextPath;
        return new TextPath(args && args.length && args[0]);
      };
    })();
    exports.TextPath = TextPath;
    var Tspan = (function() {
      Tspan.prototype = exports.SvgType();
      Tspan.prototype.constructor = Tspan;
      var SvgType = exports.SvgType.constructor;
      function Tspan() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Tspan.prototype['tspan'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'tspan');
        composer.top().appendChild(this.type);
        function setAttributes(node,attrs) {
          for(attr in attrs) {
            if(attr === 'text') {
              node.type.appendChild(document.createTextNode(attrs[attr]));
            } else if(attr === 'xlink:href') {
              node.type.setAttributeNS(composer.getXlinkNS(),"href",attrs[attr]);
            } else {
              node.type.setAttribute(attr,attrs[attr]);
            }
          }
        }
        setAttributes(this,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Tspan;
        return new Tspan(args && args.length && args[0]);
      };
    })();
    exports.Tspan = Tspan;
    var Use = (function() {
      Use.prototype = exports.SvgType();
      Use.prototype.constructor = Use;
      var SvgType = exports.SvgType.constructor;
      function Use() {
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {};
          SvgType.call(this,properties);
        }
        return ctor.apply(this,args) || this;
      }
      Use.prototype['use'] = function(composer,attrs) {
        this.type=document.createElementNS(composer.svgNS,'use');
        composer.top().appendChild(this.type);
        this.setAttributes(composer,attrs);
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Use;
        return new Use(args && args.length && args[0]);
      };
    })();
    exports.Use = Use;
    var Svg = (function() {
      Svg.prototype = monads.Composer();
      Svg.prototype.constructor = Svg;
      var Composer = monads.Composer.constructor;
      function Svg() {
        function privateData() {
          this.defaultNS = null;
          this.height = null;
          this.id = null;
          this.svgNS = null;
          this.stack = null;
          this.svg = null;
          this.style = null;
          this.viewBox = null;
          this.width = null;
          this.xlinkNS = null;
        }
        var p_vars = new privateData();
        var defaultNS = p_vars.defaultNS;
        Object.getOwnPropertyDescriptor(this,'defaultNS') || Object.defineProperty(this,'defaultNS', {get: function(){return defaultNS;},set: function(e){defaultNS=e;}});
        var height = p_vars.height;
        Object.getOwnPropertyDescriptor(this,'height') || Object.defineProperty(this,'height', {get: function(){return height;},set: function(e){height=e;}});
        var id = p_vars.id;
        Object.getOwnPropertyDescriptor(this,'id') || Object.defineProperty(this,'id', {get: function(){return id;},set: function(e){id=e;}});
        var svgNS = p_vars.svgNS;
        Object.getOwnPropertyDescriptor(this,'svgNS') || Object.defineProperty(this,'svgNS', {get: function(){return svgNS;},set: function(e){svgNS=e;}});
        var stack = p_vars.stack;
        Object.getOwnPropertyDescriptor(this,'stack') || Object.defineProperty(this,'stack', {get: function(){return stack;},set: function(e){stack=e;}});
        var svg = p_vars.svg;
        Object.getOwnPropertyDescriptor(this,'svg') || Object.defineProperty(this,'svg', {get: function(){return svg;},set: function(e){svg=e;}});
        var style = p_vars.style;
        Object.getOwnPropertyDescriptor(this,'style') || Object.defineProperty(this,'style', {get: function(){return style;},set: function(e){style=e;}});
        var viewBox = p_vars.viewBox;
        Object.getOwnPropertyDescriptor(this,'viewBox') || Object.defineProperty(this,'viewBox', {get: function(){return viewBox;},set: function(e){viewBox=e;}});
        var width = p_vars.width;
        Object.getOwnPropertyDescriptor(this,'width') || Object.defineProperty(this,'width', {get: function(){return width;},set: function(e){width=e;}});
        var xlinkNS = p_vars.xlinkNS;
        Object.getOwnPropertyDescriptor(this,'xlinkNS') || Object.defineProperty(this,'xlinkNS', {get: function(){return xlinkNS;},set: function(e){xlinkNS=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {
            id:Math.uuid(8),
            style:{}
          };
          Composer.call(this);
          this.defaultNS="http://www.w3.org/2000/svg";
          this.height=properties.height || (properties.dimensions && properties.dimensions.height) || "100%";
          this.id=properties.id;
          this.svgNS="http://www.w3.org/2000/svg";
          this.svg=null;
          this.style=properties.style;
          this.viewBox="none";
          this.width=properties.width || (properties.dimensions && properties.dimensions.width) || "100%";
          this.xlinkNS="http://www.w3.org/1999/xlink";
          this.composables={};
          this.createOrFind(properties);
          this.stack=utilities.Stack().push(this.svg);
          Defs({
            root:this
          });
          G({
            root:this
          });
          Animate({
            root:this
          });
          AnimateColor({
            root:this
          });
          AnimateMotion({
            root:this
          });
          AnimateTransform({
            root:this
          });
          Circle({
            root:this
          });
          ClipPath({
            root:this
          });
          Ellipse({
            root:this
          });
          FeBlend({
            root:this
          });
          FeComponentTransfer({
            root:this
          });
          FeComposite({
            root:this
          });
          FeDiffuseLighting({
            root:this
          });
          FeDisplacementMap({
            root:this
          });
          FeFlood({
            root:this
          });
          FeFuncA({
            root:this
          });
          FeImage({
            root:this
          });
          FeGaussianBlur({
            root:this
          });
          FeMerge({
            root:this
          });
          FeMergeNode({
            root:this
          });
          FeOffset({
            root:this
          });
          FePointLight({
            root:this
          });
          FeSpecularLighting({
            root:this
          });
          FeTile({
            root:this
          });
          FeTransform({
            root:this
          });
          FeTurbulence({
            root:this
          });
          Filter({
            root:this
          });
          LinearGradient({
            root:this
          });
          Line({
            root:this
          });
          Marker({
            root:this
          });
          Path({
            root:this
          });
          Pattern({
            root:this
          });
          Polygon({
            root:this
          });
          RadialGradient({
            root:this
          });
          Rect({
            root:this
          });
          Stop({
            root:this
          });
          Text({
            root:this
          });
          TextArea({
            root:this
          });
          TextPath({
            root:this
          });
          Tspan({
            root:this
          });
          Use({
            root:this
          });
        }
        return ctor.apply(this,args) || this;
      }
      Svg.prototype['createOrFind'] = function(properties) {
        this.svg=this.svg || document.getElementById(this.id);
        if(!this.svg) {
          this.svg=document.createElementNS(this.svgNS,'svg');
          this.svg.setAttribute('id',this.id);
          this.svg.setAttribute('width',this.width);
          this.svg.setAttribute('height',this.height);
          if(this.style) {
            for(name in this.style) {
              if(this.style.hasOwnProperty(name)) {
                this.svg.style[name]=this.style[name];
              }
            }
          }
        }
        return this;
      };
      Svg.prototype['end'] = function() {
        this.stack.pop();
        return this;
      };
      Svg.prototype['pop'] = function() {
        return this.stack.pop();
      };
      Svg.prototype['push'] = function(o) {
        this.stack.push(o);
        return this;
      };
      Svg.prototype['setXmlNS'] = function() {
        this.svg && this.svg.setAttribute("xmlns",this.svgNS);
        return this;
      };
      Svg.prototype['setXlinkNS'] = function() {
        this.svg && this.svg.setAttributeNS("xmlns","xlink",this.xlinkNS);
        return this;
      };
      Svg.prototype['setVersion'] = function() {
        this.svg && this.svg.setAttribute("version","1.1");
        return this;
      };
      Svg.prototype['setViewBox'] = function(v) {
        if(v && v !== 'none') {
          this.viewBox=v;
          this.svg && this.svg.setAttribute('viewBox',this.viewBox);
        }
        return this;
      };
      Svg.prototype['setHeight'] = function(h) {
        this.height=h;
        this.svg && this.svg.setAttribute('height',this.height);
        return this;
      };
      Svg.prototype['setWidth'] = function(w) {
        this.width=w;
        this.svg && this.svg.setAttribute('width',width);
        return this;
      };
      Svg.prototype['top'] = function() {
        return this.stack.top();
      };
      Svg.prototype['add'] = function(svgType,config) {
        config.id=this.id;
        svgType(config);
        return this;
      };
      Svg.prototype['lift'] = function(composableType) {
        if(composableType.name) {
          var method=composableType.name.substr(0,1).toLowerCase() + composableType.name.substr(1,composableType.name.length);
          var methods=composableType.prototype;
          var self=this;
          if(methods.hasOwnProperty(method) && typeof((methods[method])) === 'function' && !this[method]) {
            this[method]=function () {
              try {
                var inst=new composableType({
                  root:self
                });
                self.addComposable(composableType.name,inst);
                var args=[self];
                var remainder=Array.prototype.slice.call(arguments);
                var combined=args.concat(remainder);
                methods[method].apply(inst,combined);
              } catch(e) {
                log.Logger.error(this,e);
              }
              return self;
            };
          }
        }
        return this;
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.constructor = Svg;
        return new Svg(args && args.length && args[0]);
      };
    })();
    exports.Svg = Svg;
    var SvgNode = (function() {
      SvgNode.prototype = exports.SvgType();
      SvgNode.prototype.constructor = SvgNode;
      var SvgType = exports.SvgType.constructor;
      function SvgNode() {
        function privateData() {
          this.background = null;
          this.className = null;
          this.color = null;
          this.dimensions = null;
          this.enabled = null;
          this.id = null;
          this.root = null;
          this.transform = null;
        }
        var p_vars = new privateData();
        var background = p_vars.background;
        Object.getOwnPropertyDescriptor(this,'background') || Object.defineProperty(this,'background', {get: function(){return background;},set: function(e){background=e;}});
        var className = p_vars.className;
        Object.getOwnPropertyDescriptor(this,'className') || Object.defineProperty(this,'className', {get: function(){return className;},set: function(e){className=e;}});
        var color = p_vars.color;
        Object.getOwnPropertyDescriptor(this,'color') || Object.defineProperty(this,'color', {get: function(){return color;},set: function(e){color=e;}});
        var dimensions = p_vars.dimensions;
        Object.getOwnPropertyDescriptor(this,'dimensions') || Object.defineProperty(this,'dimensions', {get: function(){return dimensions;},set: function(e){dimensions=e;}});
        var enabled = p_vars.enabled;
        Object.getOwnPropertyDescriptor(this,'enabled') || Object.defineProperty(this,'enabled', {get: function(){return enabled;},set: function(e){enabled=e;}});
        var id = p_vars.id;
        Object.getOwnPropertyDescriptor(this,'id') || Object.defineProperty(this,'id', {get: function(){return id;},set: function(e){id=e;}});
        var root = p_vars.root;
        Object.getOwnPropertyDescriptor(this,'root') || Object.defineProperty(this,'root', {get: function(){return root;},set: function(e){root=e;}});
        var transform = p_vars.transform;
        Object.getOwnPropertyDescriptor(this,'transform') || Object.defineProperty(this,'transform', {get: function(){return transform;},set: function(e){transform=e;}});
        var args = Array.prototype.slice.call(arguments);
        var ctor = function (_properties) {
          var properties = _properties || {
            background:'white',
            color:'black',
            dimensions:{
              x:0,
              y:0,
              width:110,
              height:25
            },
            id:Math.uuid(8),
            transform:'scale(1.0)'
          };
          this.background='white';
          this.className=properties.className || 'svg-' + this.constructor.name;
          this.color=properties.color;
          this.dimensions=properties.dimensions;
          this.enabled=true;
          this.id=null;
          this.transform=properties.transform;
          if(!properties.viewBox) {
            properties.viewBox="none";
          }
          var x=this.dimensions.x;
          var y=this.dimensions.y;
          var width=this.dimensions.width;
          var height=this.dimensions.height;
          properties.width=width + 'px';
          properties.height=height + 'px';
          properties.top=x + 'px';
          properties.left=y + 'px';
          this.root=Svg(properties);
        }
        return ctor.apply(this,args) || this;
      }
      SvgNode.prototype['add'] = function(svgtype,config) {
        this.root.add(svgtype,config);
        return this;
      };
      SvgNode.prototype['element'] = function() {
        return this.root && this.root.svg;
      };
      SvgNode.prototype['insert'] = function(target) {
        monads.DOMable({
          id:this.id
        }).on('load').insert(target);
        return this;
      };
      SvgNode.prototype['style'] = function(styles) {
        if(!!this.styles) {
          for(styleName in this.styles) {
            if(this.styles.hasOwnProperty(styleName)) {
              if(styleName === 'cssFloat' && utilities.Environment.ie) {
                this.element().style.styleFloat=this.styles[styleName];
              } else {
                this.element().style[styleName]=this.styles[styleName];
              }
            }
          }
        }
        return this;
      };
      Object.defineProperty(SvgNode.prototype,'id', {get: function(){      return root && root.getId();
      }});
      SvgNode.JUSTIFY = {
        left:"start",
        center:"middle",
        right:"end"
      };
      return function __() {
        var args = Array.prototype.slice.call(arguments);
        __.JUSTIFY = SvgNode.JUSTIFY;
        __.constructor = SvgNode;
        return new SvgNode(args && args.length && args[0]);
      };
    })();
    exports.SvgNode = SvgNode;
  })(require, nm.getExports(), nm.getId());
})();

