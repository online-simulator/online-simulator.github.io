// online-simulator.github.io

function My_def(){
}

/*

function sub(){
  My_def.mix_in(_sub, supers_);  // mix-in
  My_def.mix_over(_sub, supers_);  // mix-overwrite allowed
}
My_def.mix_in(_sub, supers_);  // override
sub.prototype.init = function(){};
My_def.mix_in(_sub, supers_);  // mix-in

*/

My_def.mix_in = function(_sub, supers_){
  for(var i=1, len=arguments.length; i<len; ++i){
    var super_ = arguments[i];
    for(var prop in super_.prototype){
      if(!(_sub.prototype[prop])){
        _sub.prototype[prop] = super_.prototype[prop];
      }
    }
  }
  return _sub;
};
My_def.mix_over = function(_sub, supers_){
  for(var i=1, len=arguments.length; i<len; ++i){
    var super_ = arguments[i];
    for(var prop in super_.prototype){
      _sub.prototype[prop] = super_.prototype[prop];
    }
  }
  return _sub;
};
My_def.hasProp = function(obj, prop){
  return My_def.isDef(obj[prop]);
};
My_def.isArray = function(arg){
  return Array.isArray(arg);
};
My_def.isObject = function(arg){
  /* typeof null -> "object" */
  return (typeof arg === "object" && arg !== null);
};
My_def.isUndef = function(arg){
  return (typeof arg === "undefined");
};
My_def.isDef = function(arg){
  return !(My_def.isUndef(arg));
};
My_def.isNaN = function(val){
  /* isNaN(null || "" || false || true) -> false */
  /* Number(null || "" || false || true) -> 0 or 1 */
  /* parseFloat(null || "" || false || true) -> NaN */
  return (isNaN(val) || val === null || val === "" || val === false || val === true);
};
My_def.isNumber = function(val){
  /* parseFloat("9") -> 9 */
  /* parseFloat("0xf") -> 0 */
  /* Number("0xf") -> 15 */
  return !(My_def.isNaN(val));
};
My_def.Number = function(val){
  var _num = (My_def.isNumber(val))? Number(val): NaN;
  return _num;
};
