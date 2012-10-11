var log = require('log');
var monads = require('monads');
var svg = require('svg');
var Test3 = (function() {
  function Test3() {
    function privateData() {
      this.element = null;
    }
    var p_vars = new privateData();
    var element = p_vars.element;
    Object.getOwnPropertyDescriptor(this,'element') || Object.defineProperty(this,'element', {get: function(){return element;},set: function(e){element=e;}});
    var args = Array.prototype.slice.call(arguments);
    var ctor = function () {
      this.element=monads.DOMable({
        element:document.body
      }).on('load').add(svg.Svg({
        id:'mySVG'
      }).circle({
        cx:"100",
        cy:"100",
        r:"50",
        stroke:"none",
        fill:"#f00"
      }).animateMotion({
        'path':"M 300,400 C 50,800 400,850 800,500 S 500,500 300,700 900,1000 800,600 550,0 300,400",
        'dur':"3s"
      }).end().end().end().svg);
    }
    return ctor.apply(this,args) || this;
  }
  return function __() {
    var args = Array.prototype.slice.call(arguments);
    __.constructor = Test3;
    return new Test3(args && args.length && args[0]);
  };
})();
Test3();

