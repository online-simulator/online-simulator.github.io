// online-simulator.github.io

function My_math(){
}

My_math.get_prob = function(arr, elem_comp, opt_fn){
  var self = this;
  var _prob = 0;
  var len = arr.length;
  var _len = arr.filter(opt_fn || function(elem){
    return (String(elem) === String(elem_comp));
  }).length;
  _prob = (len)? _len/len: 0;
  return _prob;
};
My_math.gcd = function(x, y){
  if(typeof x === "object") return false;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  if(y === 0) return x;
  else return My_math.gcd(y, x%y);
};
My_math.lcm = function(x, y){
  if(typeof x === "object") return false;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  var xy = x*y;
  if(xy === 0) return 0;
  else return (xy/My_math.gcd(x, y));
};
My_math.round_ex = function(num, n){
  var lsb = Math.pow(10, n);
  return Math.round(num*lsb)/lsb;
};
