// online-simulator.github.io

My_entry.unit = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.unit.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["math", "math_com", "DATA"]);
  return self;
};
My_entry.unit.prototype.FN_call = function(callback, options){
  var self = this;
  var _num = null;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var len = arguments.length;
  var args_com = [];
  for(var i=2; i<len; ++i){
    var argCom = arguments[i].com;
    if(!(argCom)) throw "Invalid FN operation";
    args_com[i-2] = argCom;
  }
  var com = callback.apply(self, args_com);
  if(cmath.isNaN(com)) throw "FN isNaN";
  if(options.checkError){
    var args_err = [];
    for(var i=2; i<len; ++i){
      var arg = arguments[i];
      args_err[i-2] = cmath.add(arg.com, arg.err);
    }
    var err = cmath.abs_ri(cmath.sub(callback.apply(self, args_err), com));
    var args = Array.prototype.slice.call(arguments, 2, len);
    var isL = {};
    isL.r = self.get_isInfoLost.apply(self, ["r"].concat(args));
    isL.i = self.get_isInfoLost.apply(self, ["i"].concat(args));
    _num = DATA.numFull(com.r, com.i, err.r, err.i, isL.r, isL.i);
  }
  else{
    _num = DATA.num(com.r, com.i);
  }
  return _num;
};
My_entry.unit.prototype.FN = function(prop, options){
  var self = this;
  var math = self.entry.math;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var callback = function(){
    var _com = null;
    if(useComplex && cmath[prop]){
      _com = cmath[prop].apply(cmath, arguments);
    }
    else{
      var args_r = [];
      for(var i=0, len=arguments.length; i<len; ++i){
        args_r[i] = arguments[i].r;
      }
      var math_bin = Math[prop];
      if(math_bin){
        _com = DATA.com(math_bin.apply(Math, args_r), 0);
      }
      else if(math[prop]){
        _com = DATA.com(math[prop].apply(math, args_r), 0);
      }
      else if(cmath[prop]){  // imag(3-3i) -> 0 @useComplex=false
        _com = cmath[prop].apply(cmath, arguments);
      }
      else{
        throw "Invalid FN called";
      }
    }
    return _com;
  };
  var args = Array.prototype.slice.call(arguments, 1, arguments.length);
  return self.FN_call.apply(self, [callback].concat(args));
};
My_entry.unit.prototype.FNn = function(prop, options){
  var self = this;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var args = Array.prototype.slice.call(arguments, 0, 3);
  var _num = args[2];  // max(1) -> 1
  for(var i=3, len=arguments.length; i<len; ++i){
    args[2] = _num;
    args[3] = arguments[i];
    _num = self.FN.apply(self, args);
  }
  return _num;
};
My_entry.unit.prototype.BRp = function(options, left, right){
  var self = this;
  return self.FN("pow", options, left, right);
};
My_entry.unit.prototype.BRr = function(options, left, right){
  var self = this;
  return self.FN("mod", options, left, right);
};
My_entry.unit.prototype.BRm = function(options, left, right){
  var self = this;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var callback = function(leftCom, rightCom){
    return ((useComplex)?
      cmath.mul(leftCom, rightCom):
      DATA.com(leftCom.r*rightCom.r, 0));
  };
  return self.FN_call(callback, options, left, right);
};
My_entry.unit.prototype.BRd = function(options, left, right){
  var self = this;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var callback = function(leftCom, rightCom){
    return ((useComplex)?
      cmath.div(leftCom, rightCom):
      DATA.com(leftCom.r/rightCom.r, 0));
  };
  return self.FN_call(callback, options, left, right);
};
My_entry.unit.prototype.get_isInfoLost = function(sw_ri){
  var self = this;
  var _isL = false;
  for(var i=1, len=arguments.length; i<len; ++i){
    _isL = _isL | arguments[i].isL[sw_ri];  // bit or
  }
  return _isL;
};
My_entry.unit.prototype.check_isInfoLost = function(sw_ri, left, right){
  var self = this;
  var _isL = false;
  var lc_ri = left.com[sw_ri];
  var rc_ri = right.com[sw_ri];
  if(lc_ri && rc_ri){
    var absl = Math.abs(lc_ri);
    var absr = Math.abs(rc_ri);
    var dd = (absl < absr)? absl/absr: absr/absl;
    if(!((dd+1)-1)){
      _isL = true;
    }
  }
  return _isL;
};
My_entry.unit.prototype.BRsa_call = function(callback, options, left, right){
  var self = this;
  var _num = null;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var leftCom = left.com;
  var rightCom = right.com;
  if(!(leftCom) || !(rightCom)) throw "Invalid BRsa operation";
  var com = callback(leftCom, rightCom);
  if(cmath.isNaN(com)) throw "BRsa isNaN";
  if(options.checkError){
    var err = cmath.max_ab(left.err, right.err);
    var isL = {};
    isL.r = self.get_isInfoLost("r", left, right) || self.check_isInfoLost("r", left, right);
    isL.i = self.get_isInfoLost("i", left, right) || self.check_isInfoLost("i", left, right);
    _num = DATA.numFull(com.r, com.i, err.r, err.i, isL.r, isL.i);
  }
  else{
    _num = DATA.num(com.r, com.i);
  }
  return _num;
};
My_entry.unit.prototype.BRs = function(options, left, right){
  var self = this;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var callback = function(leftCom, rightCom){
    return ((useComplex)?
      cmath.sub(leftCom, rightCom):
      DATA.com(leftCom.r-rightCom.r, 0));
  };
  return self.BRsa_call(callback, options, left, right);
};
My_entry.unit.prototype.BRa = function(options, left, right){
  var self = this;
  var cmath = self.entry.math_com;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var callback = function(leftCom, rightCom){
    return ((useComplex)?
      cmath.add(leftCom, rightCom):
      DATA.com(leftCom.r+rightCom.r, 0));
  };
  return self.BRsa_call(callback, options, left, right);
};
/* Ver.2.59.26 -> */
My_entry.unit.prototype.BRlA = function(options, left, right, islO){
  var self = this;
  var _num = null;
  var DATA = self.entry.DATA;
  var useComplex = options.useComplex;
  var isRA = options.isRightAssociativityBR;
  var num_1st = left;
  var num_2nd = right;
  if(isRA){
    num_1st = right;
    num_2nd = left;
  }
  var com_1st = num_1st.com;
  var has_1st = (useComplex)? (com_1st.r || com_1st.i): com_1st.r;
  var select_num = (islO)?
    function(){
      return ((has_1st)? num_1st: num_2nd);
    }:
    function(){
      return ((has_1st)? num_2nd: num_1st);
    };
  var num = select_num();
  _num = (useComplex)? DATA.newNum(num): DATA.numFull(num.com.r, 0, num.err.r, 0, num.isL.r, 0);
  return _num;
};
My_entry.unit.prototype.BRlO = function(options, left, right){
  var self = this;
  return self.BRlA(options, left, right, true);
};
/* -> Ver.2.59.26 */
My_entry.unit.prototype.BRe = function(options, left, right){
  var self = this;
  return self.BRs(options, right, left);
};
