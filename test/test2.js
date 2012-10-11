var log = require('log');
var monads = require('monads');
var svg = require('svg');
var Multiply = (function() {
  function Multiply() {
    function privateData() {
      this.element = null;
    }
    var p_vars = new privateData();
    var element = p_vars.element;
    Object.getOwnPropertyDescriptor(this,'element') || Object.defineProperty(this,'element', {get: function(){return element;},set: function(e){element=e;}});
    var args = Array.prototype.slice.call(arguments);
    var ctor = function () {
      this.element=monads.DOMable({
        tagName:'div'
      }).on('load').add(svg.Svg({
        width:"1000.0",
        height:"1000.0"
      }).path({
        id:"pfad",
        d:"M 300,400 C 50,800 400,850 800,500 S 500,500 300,700 900,1000 800,600 550,0 300,400",
        'fill':"none",
        'stroke-width':"20",
        'stroke':"#888",
        'stroke-linecap':"round",
        'stroke-linejoin':"round"
      }).end().g({
        id:"am1"
      }).circle({
        id:"c1",
        cx:"0",
        cy:"0",
        r:"40",
        stroke:"#00f",
        'stroke-width':"60",
        fill:"#f00"
      }).end().circle({
        id:"c2",
        cx:"50",
        cy:"0",
        r:"10",
        fill:"#88f"
      }).end().end().animateMotion({
        'xlink:href':"#am1",
        'dur':"30s",
        'repeatDur':"indefinite"
      }).mpath({
        'xlink:href':"#pfad"
      }).end().end().use({
        'xlink:href':"#pfad"
      }).end().end().svg);
      return this.element;
    }
    return ctor.apply(this,args) || this;
  }
  return function __() {
    var args = Array.prototype.slice.call(arguments);
    __.constructor = Multiply;
    return new Multiply(args && args.length && args[0]);
  };
})();
Multiply().insert(document.body);

