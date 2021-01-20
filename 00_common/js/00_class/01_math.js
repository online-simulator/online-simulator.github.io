// online-simulator.github.io

My_entry.math = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.math.prototype.lcm = function(x, y){
  self = this;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  var xy = x*y;
  if(xy === 0) return 0;
  return (xy/self.gcd(x, y));
};
My_entry.math.prototype.gcd = function(x, y){
  self = this;
  if(x < 0 || y < 0) return false;
  var x = Math.floor(x);
  var y = Math.floor(y);
  if(y === 0) return x;
  return self.gcd(y, x%y);
};
My_entry.math.prototype.round_ex = function(num, n){
  self = this;
  var lsb = Math.pow(10, n);
  return Math.round(num*lsb)/lsb;
};
My_entry.math.prototype.get_prob = function(arr, elem_comp, opt_fn){
  self = this;
  var self = this;
  var _prob = 0;
  var len = arr.length;
  var _len = arr.filter(opt_fn || function(elem){
    return (String(elem) === String(elem_comp));
  }).length;
  _prob = (len)? _len/len: 0;
  return _prob;
};
