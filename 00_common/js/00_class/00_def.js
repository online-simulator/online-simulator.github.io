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
  /* calc-Ver.2.837.145 -> */
  self.str_s = "\\s";
  self.str_sS = "[\\s\\S]*";
  self.comments = {
    line: "[\/]{2}.*",
    block: self.make_str_sS({s: "\/\\*", e: "\\*\/"})
  }
  /* -> calc-Ver.2.837.145 */
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
/* calc-Ver.2.224.50 */
My_entry.def.get_msgError =
My_entry.def.prototype.get_msgError = function(e, opt_msg){
  var self = this;
  var _msg = "";
  var title = self.config.ERROR.title;
  var sw_msg = function(e){
    return (title+((e === false)? (opt_msg || ""): e));
  };
  if(self.isObject(e)){
    var msg = String(e.message);
    var hasError = msg.match("Error");
    var hasP = e.process;  // calc-Ver.2.278.65
    var hasJ = !(isNaN(e.j));
    if(hasError){
      _msg = msg.substring(hasError.index+7);
    }
    else if(hasJ){
      _msg = sw_msg(e.message);
    }
    else{
      _msg = msg;
    }
    if(hasP){
      _msg += "@"+e.process;  // calc-Ver.2.278.65
    }
    if(hasJ){
      _msg += "@j="+e.j;
    }
  }
  else{
    _msg = sw_msg(e);
  }
  return _msg;
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
  return (isNaN(val) || val === null || val === "" || val === false || val === true);  // val.toExponential() disabled
};
My_entry.def.prototype.isNumber = function(val){
  var self = this;
  return !(self.isNaN(val));
};
My_entry.def.prototype.isLiteral = function(str){
  var self = this;
  return (str === "undefined" || str === "null" || str === "NaN" || str === "false" || str === "true");
};
My_entry.def.prototype.Number = function(val){
  var self = this;
  /* Number( ) -> 0 */
  /* Number(010) -> 8 */
  /* parseFloat(011) -> 9 */
  /* parseFloat("011") -> 11 */
  /* parseFloat("0xf") -> 0 */
  /* parseFloat(0xf) -> 15 */
  /* Number(0xf || "0xf") -> 15 */
  var _num = (self.isNumber(val))? Number(val): NaN;
  return _num;
};
My_entry.def.prototype.limit = function(num, num_min, num_max, num0){
  var self = this;
  return (isNaN(num)? num0: Math.min(num_max, Math.max(num_min, num)));
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
      var rightprop = right[prop];  // calc-Ver.2.294.71
      if(rightprop){                             // no filter
        _left[prop] = self.newClone(rightprop);  // value || reference
      }
      else{
        _left[prop] = rightprop;                 // value
      }
    }
  }
  else{
    _left = right;                               // value || reference
  }
  return _left;
};
My_entry.def.prototype.join_arr = function(right, prop_comp, arr, callback){
  var self = this;
  if(self.isArray(right) || self.isObject(right)){
    for(var prop in right){
      var rightprop = right[prop];
      if(rightprop){
        if(prop === prop_comp){
          if(callback){
            callback(rightprop);
          }
          Array.prototype.push.apply(rightprop, arr);
        }
        else{
          self.join_arr(rightprop, prop_comp, arr, callback);
        }
      }
    }
  }
  return self;
};
My_entry.def.prototype.get_number = function(){
  var self = this;
  var _num = false;
  for(var i=0, len=arguments.length; i<len; ++i){
    var argi = arguments[i];
    var num = self.Number(argi);
    if(!(isNaN(num))){
      _num = num;
      break;
    }
  }
  return _num;
};
/* calc-Ver.2.837.145 -> */
My_entry.def.prototype.make_str_sS = function(pairs, isLongest){
  var self = this;
  return (pairs.s+self.str_sS+((isLongest)? "": "?")+pairs.e);
};
My_entry.def.prototype.get_re_sS = function(pairs, isLongest){
  var self = this;
  return new RegExp(self.make_str_sS.apply(self, arguments), "g");
};
/* -> calc-Ver.2.837.145 */
My_entry.def.prototype.get_title = function(input, title, isLongest, opt_i){
  var self = this;
  var pairs = [
    {s: "\\{", e: "\\}"},
    {s: "\\(", e: "\\)"},
    {s: "\\[", e: "\\]"}
  ];
  var pair = pairs[opt_i || 0];
  var re = new RegExp(self.make_str_sS({s: title+pair.s+"\(", e: "\)"+pair.e}, isLongest), "i");  // single  // calc-Ver.2.837.145
  var mc = input.match(re);
  return ((mc && mc.length === 2)? mc[1]: null);  // if(mc && mc.length)
};
My_entry.def.prototype.remove_title = function(input, title, isLongest, opt_i){
  var self = this;
  var pairs = [
    {s: "\\{", e: "\\}"},
    {s: "\\(", e: "\\)"},
    {s: "\\[", e: "\\]"}
  ];
  var pair = pairs[opt_i || 0];
  var re = new RegExp(self.make_str_sS({s: title+pair.s+"\(", e: "\)"+pair.e}, isLongest), "gi");  // all  // calc-Ver.2.837.145
  return input.replace(re, "");
};
My_entry.def.prototype.get_command = function(input, command, isLongest){
  var self = this;
  return self.get_title(input, command, isLongest, 1);
};
My_entry.def.prototype.remove_command = function(input, command, isLongest){
  var self = this;
  return self.remove_title(input, command, isLongest, 1);
};
My_entry.def.prototype.enter_name = function(input, name, isLongest, opt_i, opt_callback){
  var self = this;
  var _input = input;
  var content = self.get_title(_input, name, isLongest, opt_i);
  if(content || content === ""){  // || empty
    if(opt_callback){
      opt_callback(content);
    }
    _input = self.remove_title(_input, name, isLongest, opt_i);
  }
  return _input;
};
/* calc-Ver.2.837.143 moved from parser.js -> */
My_entry.def.prototype.replace_series = function(str, bas){
  var self = this;
  var _str = str;
  bas.forEach(function(ba){
    _str = _str.replace(ba.b, ba.a);
  });
  return _str;
};
My_entry.def.prototype.remove_comment = function(script, opt_a){
  var self = this;
  var bas = [];
  var a = opt_a || "";
  var re = new RegExp([self.comments.line, self.comments.block].join("|"), "g");  // calc-Ver.2.837.144  // calc-Ver.2.837.145
  return script.replace(re, a);  // calc-Ver.2.837.144
};
My_entry.def.prototype.remove_commentAndWspace = function(script, opt_a){
  var self = this;
  var bas = [];
  var a = opt_a || "";
  var re = new RegExp([self.comments.line, self.comments.block, self.str_s].join("|"), "g");  // calc-Ver.2.837.144  // calc-Ver.2.837.145
  return script.replace(re, a);  // calc-Ver.2.837.144
};
/* -> calc-Ver.2.837.143 */
/* calc-Ver.2.837.143 -> */
My_entry.def.prototype.str2ccc = function(str, opt_c){
  var self = this;
  var _str = "";
  var c = opt_c || "\n";
  for(var i=0, len=str.length; i<len; ++i){
    _str += c;
  }
  return _str;
};
My_entry.def.prototype.replace_comment = function(script, opt_c){
  var self = this;
  return self.remove_comment(script, function(str){return self.str2ccc(str, opt_c);});
};
My_entry.def.prototype.replace_commentAndWspace = function(script, opt_c){
  var self = this;
  return self.remove_commentAndWspace(script, function(str){return self.str2ccc(str, opt_c);});
};
/* -> calc-Ver.2.837.143 */
