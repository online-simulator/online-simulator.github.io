// online-simulator.github.io

function My_math_wave(){
}

My_math_wave.sin = function(freq, t, phi0){
  var pi2 = Math.PI*2;
  var t = (t*freq+phi0/pi2)%1;
  return Math.sin(t*pi2);
};
My_math_wave.triangle = function(freq, t, phi0){
  var pi2 = Math.PI*2;
  var t = (t*freq+phi0/pi2)%1;
  var _val = (t<0.25)? t: (t<0.75)? -t+0.5: t-1;
  return _val*4;
};
My_math_wave.square = function(freq, t, phi0){
  var pi2 = Math.PI*2;
  var t = (t*freq+phi0/pi2)%1;
  var _val = (t<0.5)? 1: -1;
  return _val;
};
My_math_wave.sawtooth = function(freq, t, phi0){
  var pi2 = Math.PI*2;
  var t = (t*freq+phi0/pi2)%1;
  var _val = -1+t*2;
  return _val;
};
My_math_wave.get_rms = function(len, fn, freq){
  var _rms = 0;
  for(var i=0; i<len; ++i){
    var t = i/len;
    var y = fn(freq || 1, t, 0);
    _rms += y*y;
  }
  _rms = Math.sqrt(_rms/len);
  return _rms;
};
My_math_wave.getY_linear_baseE = function(x, x0, x1, y0, y1, isLogE_x, isLogE_y){
  var x  = (isLogE_x)? Math.log(x) : x;
  var x0 = (isLogE_x)? Math.log(x0): x0;
  var x1 = (isLogE_x)? Math.log(x1): x1;
  var y0 = (isLogE_y)? Math.log(y0): y0;
  var y1 = (isLogE_y)? Math.log(y1): y1;
  var slop = (y1-y0)/(x1-x0);
  var _y = y0+(x-x0)*slop;
  _y = (isLogE_y)? Math.pow(Math.E, _y): _y;
  return _y;
};
My_math_wave.getY_linear_base10 = function(x, x0, x1, y0, y1, isLog10_x, isLog10_y){
  // IE not supported
  var x  = (isLog10_x)? Math.log10(x) : x;
  var x0 = (isLog10_x)? Math.log10(x0): x0;
  var x1 = (isLog10_x)? Math.log10(x1): x1;
  var y0 = (isLog10_y)? Math.log10(y0): y0;
  var y1 = (isLog10_y)? Math.log10(y1): y1;
  var slop = (y1-y0)/(x1-x0);
  var _y = y0+(x-x0)*slop;
  _y = (isLog10_y)? Math.pow(10, _y): _y;
  return _y;
};
My_math_wave.get_limit = function(num, num_min, num_max){
  var num_min = num_min;
  var num_max = num_max;
  if(num_max < num_min){
    var w = num_min;
    num_min = num_max;
    num_max = w;
  }
  return Math.min(num_max, Math.max(num_min, num));
};
