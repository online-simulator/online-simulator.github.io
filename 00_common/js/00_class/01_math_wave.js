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
  var _t = self.normalize_phi(freq, t, phi0)/self.pi2;  // Ver.2.118.27
  _t = self.t_duty(_t, duty);
  return _t;
};
/* Ver.1.56.12 */
My_entry.math_wave.prototype.normalize_phi = function(freq, t, phi0){
  var self = this;
  return (phi0+t*freq*self.pi2)%self.pi2;  // t first  // Ver.2.118.27
};
/* Ver.2.118.27 */
/* Ver.1.71.14 */
My_entry.math_wave.prototype.table = function(freq, t, phi0, duty, table){
  var self = this;
  var _val = 0;
  if(freq && table && table[0] && table[1]){
    t = self.normalize_t.apply(self, arguments);
    var table0 = table[0];
    var table1 = table[1];
    var len = table0.length;
    var lenm1 = len-1;
    if(table._isEqual_dx === undefined){
      var isEqual = true;
      var dx0 = table0[1]-table0[0];
      var dxe = Math.abs(dx0)*0.1;
      for(var i=1; i<lenm1; ++i){
        var dxi = table0[i+1]-table0[i];
        if(Math.abs(dxi-dx0) > dxe){
          isEqual = false;
          break;
        }
      }
      table._isEqual_dx = isEqual;
    }
    // 3rd-order Hermit and Catmull-Rom spline
    if(table._isEqual_dx){
      var p_t = lenm1*t;
      var idx = Math.floor(p_t);
      var mu = p_t-idx;
      var mu2 = mu*mu;
      var mu3 = mu2*mu;
      if(idx >= lenm1) idx = lenm1-1;
      var idx1 = idx+lenm1;
      var y0 = table1[(idx1-1)%lenm1];
      var y1 = table1[(idx1+0)%lenm1];
      var y2 = table1[(idx1+1)%lenm1];
      var y3 = table1[(idx1+2)%lenm1];
      var a0 = -0.5*y0+1.5*y1-1.5*y2+0.5*y3;
      var a1 = y0-2.5*y1+2*y2-0.5*y3;
      var a2 = -0.5*y0+0.5*y2;
      var a3 = y1;
      _val = a0*mu3+a1*mu2+a2*mu+a3;
    }
    // linear
    else{
      var idx = table0.findIndex(function(x){return (x >= t);})-1;  // Ver.2.118.27 ES2015
      if(idx < 0) idx = 0;
      if(idx >= lenm1) idx = lenm1-1;
      var t0 = table0[idx];
      var t1 = table0[idx+1];
      var y0 = table1[idx];
      var y1 = table1[idx+1];
      _val = (t0 === t1)? (y0+y1)/2: y0+((y1-y0)/(t1-t0))*(t-t0);
    }
  }
  return _val;
};
My_entry.math_wave.prototype.sin = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
    _val = Math.sin(t*self.pi2);
  }
  return _val;
};
My_entry.math_wave.prototype.triangle = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
    _val = (t<0.25)? t: (t<0.75)? -t+0.5: t-1;
    _val *= 4;
  }
  return _val;
};
My_entry.math_wave.prototype.square = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
    _val = (t<0.5)? 1: -1;
  }
  return _val;
};
/* Ver.1.34.6 -> */
My_entry.math_wave.prototype.sawtooth = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
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
/* Ver.1.71.14 */
My_entry.math_wave.prototype.sawsmooth = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
    _val = (t < 0.5)? t: 0.5-t;
    _val *= 2;
  }
  return _val;
};
My_entry.math_wave.prototype.sawtooth0 = function(freq, t, phi0, duty){
  var self = this;
  var _val = 0;
  if(freq){
    t = self.normalize_t.apply(self, arguments);
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
My_entry.math_wave.prototype.get_rms = function(len, fn, opt_freq, opt_table){  // Ver.1.71.14
  var self = this;
  var _rms = 0;
  for(var i=0; i<len; ++i){
    var t = i/len;
    var y = fn.call(self, opt_freq || 1, t, 0, 0.5, opt_table);  // Ver.1.71.14
    _rms += y*y;
  }
  _rms = Math.sqrt(_rms/len);
  return _rms;
};
/* Ver.1.112.26 */
My_entry.math_wave.prototype.getY_linear_baseE = function(x, x0, x1, y0, y1, isLog_x, isLog_y){
  var self = this;
  var x = (isLog_x)? Math.log(x): x;
  var x0 = (isLog_x)? Math.log(x0): x0;
  var x1 = (isLog_x)? Math.log(x1): x1;
  var y0 = (isLog_y)? Math.log(y0): y0;
  var y1 = (isLog_y)? Math.log(y1): y1;
  var slop = (y1-y0)/(x1-x0);
  var _y = y0+(x-x0)*slop;
  _y = (isLog_y)? Math.pow(Math.E, _y): _y;
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
