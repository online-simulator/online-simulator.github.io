// online-simulator.github.io

My_entry.math_wave = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math_wave.prototype.init = function(){
  var self = this;
  self.pi2 = Math.PI*2;  // Ver.1.30.6
  return self;
};
My_entry.math_wave.prototype.t_duty = function(t, opt_th){
  var self = this;
  var th = opt_th || 0;
  return ((t < th)? t*0.5/th: 1+(t-1)*0.5/(1-th));
};
/* Ver.1.30.6 -> */
My_entry.math_wave.prototype.normalize_t = function(freq, t, phi0, duty){
  var self = this;
  var _t = (t*freq+phi0/self.pi2)%1;
  _t = self.t_duty(_t, duty);
  return _t;
};
My_entry.math_wave.prototype.sin = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    var t = self.normalize_t.apply(self, arguments);
    _val = Math.sin(t*self.pi2);
  }
  return _val;
};
My_entry.math_wave.prototype.triangle = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    var t = self.normalize_t.apply(self, arguments);
    _val = (t<0.25)? t: (t<0.75)? -t+0.5: t-1;
    _val *= 4;
  }
  return _val;
};
My_entry.math_wave.prototype.square = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    var t = self.normalize_t.apply(self, arguments);
    _val = (t<0.5)? 1: -1;
  }
  return _val;
};
/* Ver.1.34.6 -> */
My_entry.math_wave.prototype.sawtooth = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    var t = self.normalize_t.apply(self, arguments);
    _val = -1+t*2;  // -1~
  }
  return _val;
};
My_entry.math_wave.prototype.sawtoothrev = function(freq, t, phi0, duty){
  var self = this;
  var _val = self.sawtooth.apply(self, arguments);
  _val *= -1;
  return _val;
};
My_entry.math_wave.prototype.sawtooth0 = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    var t = self.normalize_t.apply(self, arguments);
    _val = t-Math.floor(t+0.5);  // 0~
    _val *= 2;
  }
  return _val;
};
My_entry.math_wave.prototype.sawtooth0rev = function(freq, t, phi0, duty){
  var self = this;
  var _val = self.sawtooth0.apply(self, arguments);
  _val *= -1;
  return _val;
};
/* -> Ver.1.34.6 */
/* -> Ver.1.30.6 */
My_entry.math_wave.prototype.get_rms = function(len, fn, freq){
  var self = this;
  var _rms = 0;
  for(var i=0; i<len; ++i){
    var t = i/len;
    var y = fn.call(self, freq || 1, t, 0, 0.5);
    _rms += y*y;
  }
  _rms = Math.sqrt(_rms/len);
  return _rms;
};
My_entry.math_wave.prototype.getY_linear_baseE = function(x, x0, x1, y0, y1, isLogE_x, isLogE_y){
  var self = this;
  var x = (isLogE_x)? Math.log(x) : x;
  var x0 = (isLogE_x)? Math.log(x0): x0;
  var x1 = (isLogE_x)? Math.log(x1): x1;
  var y0 = (isLogE_y)? Math.log(y0): y0;
  var y1 = (isLogE_y)? Math.log(y1): y1;
  var slop = (y1-y0)/(x1-x0);
  var _y = y0+(x-x0)*slop;
  _y = (isLogE_y)? Math.pow(Math.E, _y): _y;
  return _y;
};
My_entry.math_wave.prototype.getY_linear_base10 = function(x, x0, x1, y0, y1, isLog10_x, isLog10_y){
  var self = this;
  // IE not supported
  var x = (isLog10_x)? Math.log10(x) : x;
  var x0 = (isLog10_x)? Math.log10(x0): x0;
  var x1 = (isLog10_x)? Math.log10(x1): x1;
  var y0 = (isLog10_y)? Math.log10(y0): y0;
  var y1 = (isLog10_y)? Math.log10(y1): y1;
  var slop = (y1-y0)/(x1-x0);
  var _y = y0+(x-x0)*slop;
  _y = (isLog10_y)? Math.pow(10, _y): _y;
  return _y;
};
My_entry.math_wave.prototype.get_limit = function(num, num_min, num_max){
  var self = this;
  var num_min = num_min;
  var num_max = num_max;
  if(num_max < num_min){
    var w = num_min;
    num_min = num_max;
    num_max = w;
  }
  return Math.min(num_max, Math.max(num_min, num));
};
