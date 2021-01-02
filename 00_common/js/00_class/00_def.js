function My_def(){
}

// class method
My_def.mix_in = function(Sub, Supers){
  for(var i=1, len=arguments.length; i<len; ++i){
    var Super = arguments[i];
    for(var property in Super.prototype){
      // mix-in super"s prototype undefined in sub
      if(!Sub.prototype[property]){
        Sub.prototype[property] = Super.prototype[property];
      }
    }
  }
  return Sub;
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
