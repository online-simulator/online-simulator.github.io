// online-simulator.github.io

My_entry.def = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.config =
My_entry.def.prototype.config = {
  ERROR: {
    title: "[MyErr]"
  }
};
My_entry.def.prototype.init = function(){
  var self = this;
  return self;
};

/*

function _sub(){
  My_entry.def.mix_in(_sub, supers_);    // mix-in
  My_entry.def.mix_over(_sub, supers_);  // mix-overwrite allowed
}
My_entry.def.mix_in(_sub, supers_);      // override
_sub.prototype.init = function(){};
My_entry.def.mix_in(_sub, supers_);      // mix-in

*/

My_entry.def.mix_in =
My_entry.def.prototype.mix_in = function(_sub, supers_){
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
My_entry.def.mix_over =
My_entry.def.prototype.mix_over = function(_sub, supers_){
  for(var i=1, len=arguments.length; i<len; ++i){
    var super_ = arguments[i];
    for(var prop in super_.prototype){
      _sub.prototype[prop] = super_.prototype[prop];
    }
  }
  return _sub;
};
My_entry.def.mix_in_props =
My_entry.def.prototype.mix_in_props = function(_sub, super_, props){
  props.forEach(function(prop){
    _sub.prototype[prop] = super_.prototype[prop];
  });
  return _sub;
};
My_entry.def.get_msgError =
My_entry.def.prototype.get_msgError = function(e, msg){
  var self = this;
  var title = self.config.ERROR.title;
  return (e === false)?
    title+(msg || ""):
    (typeof e === "string")?
      title+e:
      e.message;
};
My_entry.def.prototype.hasElem_arr = function(arr, val_comp){
  var self = this;
  return arr.filter(function(val){return (val === val_comp);}).length;
};
My_entry.def.prototype.hasProp = function(obj, prop){
  var self = this;
  return self.isDef(obj[prop]);
};
My_entry.def.prototype.isArray = function(arg){
  var self = this;
  return Array.isArray(arg);
};
My_entry.def.prototype.isObject = function(arg){
  var self = this;
  /* typeof null -> "object" */
  return (typeof arg === "object" && arg !== null);
};
My_entry.def.prototype.isUndef = function(arg){
  var self = this;
  return (typeof arg === "undefined");
};
My_entry.def.prototype.isDef = function(arg){
  var self = this;
  return !(self.isUndef(arg));
};
My_entry.def.prototype.isEmpty = function(arg){
  var self = this;
  return (arg === null || arg === "" || typeof arg === "undefined");
};
My_entry.def.prototype.isNotEmpty = function(arg){
  var self = this;
  return !(self.isEmpty(arg));
};
My_entry.def.prototype.isNotNull = function(arg){
  var self = this;
  return !(arg === null);
};
My_entry.def.prototype.isNotNullStr = function(arg){
  var self = this;
  return !(arg === "");
};
My_entry.def.prototype.isNaN = function(val){
  var self = this;
  /* isNaN(null || "" || false || true) -> false */
  /* Number(null || "" || false || true) -> 0 or 1 */
  /* parseFloat(null || "" || false || true) -> NaN */
  return (isNaN(val) || val === null || val === "" || val === false || val === true);
};
My_entry.def.prototype.isNumber = function(val){
  var self = this;
  return !(self.isNaN(val));
};
My_entry.def.prototype.Number = function(val){
  var self = this;
  /* Number(010) -> 8 */
  /* parseFloat(011) -> 9 */
  /* parseFloat("011") -> 11 */
  /* parseFloat("0xf") -> 0 */
  /* parseFloat(0xf) -> 15 */
  /* Number(0xf || "0xf") -> 15 */
  var _num = (self.isNumber(val))? Number(val): NaN;
  return _num;
};
My_entry.def.prototype.newClone = function(right){
  var self = this;
  var _left = null;
  var isDeep = false;
  if(self.isArray(right)){
    isDeep = true;
    _left = [];
  }
  else if(self.isObject(right)){
    isDeep = true;
    _left = {};
  }
  if(isDeep){
    for(var prop in right){
      if(right[prop]){
        // value or reference
        _left[prop] = self.newClone(right[prop]);
      }
      else{
        // value
        _left[prop] = right[prop];
      }
    }
  }
  else{
    // value: number/string/boolean
    // reference: function
    _left = right;
  }
  return _left;
};
