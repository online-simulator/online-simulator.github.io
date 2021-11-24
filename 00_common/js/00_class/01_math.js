// online-simulator.github.io

My_entry.math = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math.config =
My_entry.math.prototype.config = {
  EPSILON: Number.EPSILON || Math.pow(2, -52),
  MAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER || Math.pow(2, 53)-1,
  MIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER || -(Math.pow(2, 53)-1),
  EPSF: Math.pow(2, -26+4),
  EPSD: Math.pow(2, -52+8)
};
My_entry.math.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.math.prototype.isEven = function(x){
  var self = this;
  return (x%2 === 0);
};
My_entry.math.prototype.isOdd = function(x){
  var self = this;
  return !(self.isEven(x));
};
My_entry.math.prototype.isInt = function(val, eps){
  var self = this;
  var eps = eps || self.config.EPSD;
  // round at val < 0
  var ival = Math.round(val);
  return (Math.abs(val-ival) < eps)? true: false;
};
My_entry.math.prototype.isInf = function(val){
  var self = this;
  if(val === Number.NEGATIVE_INFINITY || val === Number.POSITIVE_INFINITY) return true;
  return false;
};
/* for CALC */
/* 2.87.32 -> */
My_entry.math.prototype.int = function(x){
  var self = this;
  return Math.floor((x >= 0 || x%1 === 0)? x: x+1);
};
/* -> 2.87.32 */
My_entry.math.prototype.eq = function(a, b){
  var self = this;
  return ((a == b)? 1: 0);
};
My_entry.math.prototype.ne = function(a, b){
  var self = this;
  return ((a != b)? 1: 0);
};
My_entry.math.prototype.lt = function(a, b){
  var self = this;
  return ((a < b)? 1: 0);
};
My_entry.math.prototype.le = function(a, b){
  var self = this;
  return ((a <= b)? 1: 0);
};
My_entry.math.prototype.gt = function(a, b){
  var self = this;
  return ((a > b)? 1: 0);
};
My_entry.math.prototype.ge = function(a, b){
  var self = this;
  return ((a >= b)? 1: 0);
};
My_entry.math.prototype.sinh = function(x){
  var self = this;
  return 0.5*(Math.exp(x)-Math.exp(-x));
};
My_entry.math.prototype.cosh = function(x){
  var self = this;
  return 0.5*(Math.exp(x)+Math.exp(-x));
};
My_entry.math.prototype.tanh = function(x){
  var self = this;
  return self.sinh(x)/self.cosh(x);
};
My_entry.math.prototype.asinh = function(x){
  var self = this;
  return Math.log(Math.sqrt(x*x+1)+x);
};
My_entry.math.prototype.acosh = function(x){
  var self = this;
  return Math.log(Math.sqrt(x*x-1)+x);
};
My_entry.math.prototype.atanh = function(x){
  var self = this;
  return 0.5*Math.log((1+x)/(1-x));
};
My_entry.math.prototype.log_ex = function(x, base){
  var self = this;
  return Math.log(x)/Math.log(base || 10);
};
My_entry.math.prototype.log10 = function(x){
  var self = this;
  return self.log_ex(x, 10);
};
My_entry.math.prototype.sign = function(XYZ){
  var self = this;
  if(typeof XYZ === "number"){
    if(XYZ === 0)    return  0;
    else if(XYZ > 0) return  1;
    else             return -1;
  }
  else if(typeof XYZ === "string" && XYZ.length === 3){
    var XYZ = XYZ.toLowerCase();
    var str1 = XYZ.charAt(0);
    var str2 = XYZ.charAt(1);
    var str3 = XYZ.charAt(2);
    if(str1 === str2 || str2 === str3 || str3 === str1){
      return false;
    }
    switch(str1){
      case "x":
        if(str2 === "y")      return  1;
        else if(str2 === "z") return -1;
        break;
      case "y":
        if(str2 === "z")      return  1;
        else if(str2 === "x") return -1;
        break;
      case "z":
        if(str2 === "x")      return  1;
        else if(str2 === "y") return -1;
        break;
      default:
        break;
    }
  }
  return false;
};
My_entry.math.prototype.degrees = function(rad){
  var self = this;
  return (rad*180/Math.PI);
};
My_entry.math.prototype.radians = function(deg){
  var self = this;
  return (deg*Math.PI/180);
};
My_entry.math.prototype.sin_deg = function(deg){
  var self = this;
  return Math.sin(self.radians(deg));
};
My_entry.math.prototype.cos_deg = function(deg){
  var self = this;
  return Math.cos(self.radians(deg));
};
My_entry.math.prototype.tan_deg = function(deg){
  var self = this;
  return Math.tan(self.radians(deg));
};
My_entry.math.prototype.deg_asin = function(x){
  var self = this;
  return self.degrees(Math.asin(x));
};
My_entry.math.prototype.deg_acos = function(x){
  var self = this;
  return self.degrees(Math.acos(x));
};
My_entry.math.prototype.deg_atan = function(x){
  var self = this;
  return self.degrees(Math.atan(x));
};
/* Ver.2.69.28 -> */
/*
My_entry.math.prototype.fact = function(n){
  var self = this;
  return self.fact_k(n, n);
};
My_entry.math.prototype.fact_k = function(left, right){
  var self = this;
  var n = Math.floor(left);
  var k = Math.floor(right);
  if(n < 0 || k < 0 || n < k) return 0;  // undefined first
  if(k === 1) return n;                  // permut(3,3) || fact(3) || 3*2*1 -> 6
  if(k === 0) return 1;                  // permut(3,0) || combin(3,0) -> 1
  return self.fact_k(n-1, k-1)*n;        // do not use --n
};
My_entry.math.prototype.fact_m = function(left, right){
  var self = this;
  var n = Math.floor(left);
  var m = Math.floor(right);
  if(n < 0 || m <= 0) return 0;  // undefined first
  if(n === 0) return 1;          // 0! || 0!! -> 1
  if(n <= m) return n;           // 3!!! -> 3
  return self.fact_m(n-m, m)*n;
};
*/
My_entry.math.prototype.fact = function(left){
  var self = this;
  var _fact = 1;
  var n = Math.floor(left);
  if(n < 0){
    _fact = 0;
  }
  else{
    for(var i=n; i>0; --i){
      _fact *= i;
    }
  }
  return _fact;
};
My_entry.math.prototype.fact_k = function(left, right){
  var self = this;
  if(isNaN(right)) return 0;
  var _fact = 1;
  var n = Math.floor(left);
  var k = Math.floor(right);
  if(n < 0 || k < 0 || n < k){
    _fact = 0;
  }
  else{
    for(var i=n; i>n-k; --i){
      _fact *= i;
    }
  }
  return _fact;
};
My_entry.math.prototype.fact_m = function(left, right){
  var self = this;
  if(isNaN(right)) return 0;
  var _fact = 1;
  var n = Math.floor(left);
  var m = Math.floor(right);
  if(n < 0 || m <= 0){
    _fact = 0;
  }
  else{
    for(var i=n; i>0; i-=m){
      _fact *= i;
    }
  }
  return _fact;
};
My_entry.math.prototype.permut =
My_entry.math.prototype.permutation = function(n, k){
  var self = this;
  return self.fact_k(n, k);
};
My_entry.math.prototype.combin =
My_entry.math.prototype.combination = function(n, r){
  var self = this;
  return self.permut(n, r)/(self.fact(r) || 1);  // || not0
};
/* -> Ver.2.69.28 */
My_entry.math.prototype.deg_atan2 = function(y, x){
  var self = this;
  return self.degrees(Math.atan2(y, x));
};
My_entry.math.prototype.deg_atan2_ex = function(x, y){
  var self = this;
  return self.degrees(Math.atan2(y, x));
};
My_entry.math.prototype.atan2_ex = function(x, y){
  var self = this;
  return Math.atan2(y, x);
};
My_entry.math.prototype.kdelta = function(i, j){
  var self = this;
  return ((i === j)? 1: 0);
};
/* Ver.2.87.32 -> */
My_entry.math.prototype.mod =
My_entry.math.prototype.fmod = function(x, y){
  var self = this;
  return (x%y);
//  return (x-self.int(x/y)*y);
};
My_entry.math.prototype.quot = function(x, y){
  var self = this;
  return self.int(x/y);
};
/* -> Ver.2.87.32 */
My_entry.math.prototype["~"] = function(y){
  var self = this;
  return (~y);
};
My_entry.math.prototype["<<"] = function(x, y){
  var self = this;
  return (x<<y);
};
My_entry.math.prototype[">>"] = function(x, y){
  var self = this;
  return (x>>y);
};
My_entry.math.prototype[">>>"] = function(x, y){
  var self = this;
  return (x>>>y);
};
My_entry.math.prototype["&"] = function(x, y){
  var self = this;
  return (x&y);
};
My_entry.math.prototype["@"] = function(x, y){
  var self = this;
  return (x^y);
};
My_entry.math.prototype["|"] = function(x, y){
  var self = this;
  return (x|y);
};
My_entry.math.prototype["<"] = function(x, y){
  var self = this;
  return ((x<y)? 1: 0);
};
My_entry.math.prototype["<="] = function(x, y){
  var self = this;
  return ((x<=y)? 1: 0);
};
My_entry.math.prototype[">="] = function(x, y){
  var self = this;
  return ((x>=y)? 1: 0);
};
My_entry.math.prototype[">"] = function(x, y){
  var self = this;
  return ((x>y)? 1: 0);
};
My_entry.math.prototype["=="] = function(x, y){
  var self = this;
  return ((x==y)? 1: 0);
};
My_entry.math.prototype["<>"] = function(x, y){
  var self = this;
  return ((x!=y)? 1: 0);
};
My_entry.math.prototype["~~"] = function(y){
  var self = this;
  return ((y)? 0: 1);
};
My_entry.math.prototype.lcm = function(x, y){
  var self = this;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  var xy = x*y;
  if(xy === 0) return 0;
  return (xy/self.gcd(x, y));
};
My_entry.math.prototype.gcd = function(x, y){
  var self = this;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  if(y === 0) return x;
  return self.gcd(y, x%y);
};
My_entry.math.prototype.round_ex = function(num, n){
  var self = this;
  var lsb = Math.pow(10, n);
  return Math.round(num*lsb)/lsb;
};
My_entry.math.prototype.get_prob = function(arr, elem_comp, opt_fn){
  var self = this;
  var _prob = 0;
  var len = arr.length;
  var _len = arr.filter(opt_fn || function(elem){
    return (String(elem) === String(elem_comp));
  }).length;
  _prob = (len)? _len/len: 0;
  return _prob;
};
My_entry.math.prototype.switch_arr = function(_arr, i, j){
  var self = this;
  var w = _arr[i];
  _arr[i] = _arr[j];
  _arr[j] = w;
  return _arr;
};
My_entry.math.prototype.u = function(n, t){
  var self = this;
  return (Math.abs(t-n)-Math.abs(t-(n+1))+1)*0.5;
};
My_entry.math.prototype.vP_vS = function(iN, isX){
  var self = this;
  var theta = Math.PI*0.5*(1-8*iN);
  return (!(isX))? Math.cos(theta): Math.sin(theta);
};
My_entry.math.prototype.star1 = function(t, N, isX){
  var self = this;
  var _val = null;
  var t = t;
  var N = N || 5;
  var u = self.u;
  var vP_vS = self.vP_vS;
  var rN = 1/N;
  var pi2 = Math.PI*2;
  if(t < 0){
    t += Math.ceil(-t/pi2)*pi2;
  }
  t %= pi2;
  var Nt = N*t/pi2;
  _val = vP_vS(0, isX);
  for(var i=0; i<N-1; ++i){
    var iN = i*rN;
    var ipN = iN+rN;
    _val += u(i, Nt)*(vP_vS(ipN, isX)-vP_vS(iN, isX));
  }
  var iN = (N-1)*rN;
  _val += u(N-1, Nt)*(vP_vS(0, isX)-vP_vS(iN, isX));
  return _val;
};
My_entry.math.prototype.lerp_val = function(left, right, k){
  var self = this;
  return left+(right-left)*k;
};
My_entry.math.prototype.star2 = function(t, N, isX, kr){
  var self = this;
  var _val = null;
  var t = t;
  var N = N || 5;
  var pi2 = Math.PI*2;
  var dt = pi2/N;
  var dtr2 = dt/2;
  if(t < 0){
    t += Math.ceil(-t/pi2)*pi2;
  }
  t %= pi2;
  var it = Math.floor(t/dt);
  var it1 = (it+0)%N;
  var it2 = (it+1)%N;
  var k = (t-it1*dt)/dt;
  var callback_t = (isX)?
    function(i){return Math.cos(i*dt);}:
    function(i){return Math.sin(i*dt);};
  var callback_c = (isX)?
    function(i){return Math.cos(i*dt+dtr2)*kr;}:
    function(i){return Math.sin(i*dt+dtr2)*kr;};
  _val = (k < 0.5)?
    self.lerp_val(callback_t(it1), callback_c(it1), (t-(it1*dt))/dtr2):
    self.lerp_val(callback_c(it1), callback_t(it2), (t-(it1*dt+dtr2))/dtr2);
  return _val;
};
My_entry.math.prototype.star = function(t, N, isX, kr){
  var self = this;
  var star = (typeof kr === "undefined")? self.star1: self.star2;
  return star.apply(self, arguments);
};
My_entry.math.prototype.poly =
My_entry.math.prototype.polygon = function(t, N, isX){
  var self = this;
  var _val = null;
  var t = t;
  var N = N || 5;
  var pi2 = Math.PI*2;
  var dt = pi2/N;
  t %= pi2;
  var it = Math.floor(t/dt);
  var k = (t-it*dt)/dt;
  var callback_t = (isX)?
    function(i){return Math.cos(i*dt);}:
    function(i){return Math.sin(i*dt);};
  _val = self.lerp_val(callback_t(it), callback_t(it+1), k);
  return _val;
};
My_entry.math.prototype.lerp_sw = function(t0, t1, k, isLog){
  var self = this;
  return ((isLog)? Math.exp(Math.log(t0)+(Math.log(t1)-Math.log(t0))*k): t0+(t1-t0)*k);
};
