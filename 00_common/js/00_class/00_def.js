// online-simulator.github.io

function My_def(){
}

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
My_def.hasProp = function(obj, prop){
  return !(My_def.isUndef(obj[prop]));
};
My_def.isArray = function(arg){
  return Array.isArray(arg);
};
My_def.isObject = function(arg){
  return (typeof arg === "object")? true: false;
};
My_def.isUndef = function(arg){
  return (typeof arg === "undefined");
};
// isNaN(false) = 0
My_def.isFalseNull = function(val){
  if(val === false || val === null) return true;
  return false;
};
My_def.isFloat = function(x){
  return (x !== "" && !My_def.isFalseNull(x) && !isNaN(parseFloat(x)));
};
My_def.isNumber = function(x){
  return (x !== "" && !My_def.isFalseNull(x) && !isNaN(Number(x)));
};
