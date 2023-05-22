// online-simulator.github.io

My_entry.math_com = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math_com.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["math", "DATA"]);
  return self;
};
My_entry.math_com.prototype.isNaN = function(com){
  var self = this;
//  return (isNaN(com.r) || isNaN(com.i));
  return isNaN(com.r+com.i);
};
My_entry.math_com.prototype.isNumber = function(com){
  var self = this;
  return !(self.isNaN(com));
};
//
My_entry.math_com.prototype.absolute_com = function(a){
  var self = this;
  return Math.sqrt(a.r*a.r+a.i*a.i);
};
My_entry.math_com.prototype.argument_com = function(a){
  var self = this;
  if(a.r === 0 && a.i === 0) return 0;
  return Math.atan2(a.i, a.r);
};
//
My_entry.math_com.prototype.ceq = function(a, b){
  var self = this;
  var sw = ((a.r == b.r) && (a.i == b.i));
  return self.entry.DATA.com(((sw)? 1: 0), 0);
};
My_entry.math_com.prototype.cne = function(a, b){
  var self = this;
  var sw = !((a.r == b.r) && (a.i == b.i));
  return self.entry.DATA.com(((sw)? 1: 0), 0);
};
My_entry.math_com.prototype.cmin = function(a, b){
  var self = this;
  return self.entry.DATA.com(Math.min(self.absolute_com(a),self.absolute_com(b)), 0);
};
My_entry.math_com.prototype.cmax = function(a, b){
  var self = this;
  return self.entry.DATA.com(Math.max(self.absolute_com(a),self.absolute_com(b)), 0);
};
My_entry.math_com.prototype.comp =
My_entry.math_com.prototype.complex = function(a, b){
  var self = this;
  return self.entry.DATA.com(a.r, b.r);
};
My_entry.math_com.prototype.pcomp =
My_entry.math_com.prototype.pcomplex = function(r, t){
  var self = this;
  var r = r.r;
  var t = t.r;
  return self.entry.DATA.com(Math.cos(t)*r, Math.sin(t)*r);
};
My_entry.math_com.prototype.ecomp =
My_entry.math_com.prototype.ecomplex = function(t){
  var self = this;
  var t = t.r;
  return self.entry.DATA.com(Math.cos(t), Math.sin(t));
};
My_entry.math_com.prototype.real = function(a){
  var self = this;
  return self.entry.DATA.com(a.r, 0);
};
My_entry.math_com.prototype.imag =
My_entry.math_com.prototype.imaginary = function(a){
  var self = this;
  return self.entry.DATA.com(a.i, 0);
};
My_entry.math_com.prototype.conj =
My_entry.math_com.prototype.conjugate = function(a){
  var self = this;
  return self.entry.DATA.com(a.r, -a.i);
};
My_entry.math_com.prototype.arg =
My_entry.math_com.prototype.argument = function(a){
  var self = this;
  return self.entry.DATA.com(self.argument_com(a), 0);
};
My_entry.math_com.prototype.deg_arg =
My_entry.math_com.prototype.deg_argument = function(a){
  var self = this;
  return self.entry.DATA.com(self.entry.math.degrees(self.argument_com(a)), 0);
};
//
My_entry.math_com.prototype.abs = function(a){
  var self = this;
  return self.entry.DATA.com(self.absolute_com(a), 0);
};
My_entry.math_com.prototype.abs_ri = function(a){
  var self = this;
  return self.entry.DATA.com(Math.abs(a.r), Math.abs(a.i));
};
My_entry.math_com.prototype.maxabs = function(a, b){
  var self = this;
  return self.entry.DATA.com(Math.max(Math.abs(a.r), Math.abs(b.r)), Math.max(Math.abs(a.i), Math.abs(b.i)));
};
My_entry.math_com.prototype.max_ab = function(a, b){
  var self = this;
  return self.entry.DATA.com(Math.max(a.r, b.r), Math.max(a.i, b.i));
};
My_entry.math_com.prototype.flip = function(a){
  var self = this;
  return self.entry.DATA.com(-a.r, -a.i);
};
My_entry.math_com.prototype.muli = function(a){
  var self = this;
  return self.entry.DATA.com(-a.i, a.r);
};
My_entry.math_com.prototype.add = function(a, b){
  var self = this;
  return self.entry.DATA.com(a.r+b.r, a.i+b.i);
};
My_entry.math_com.prototype.sub = function(a, b){
  var self = this;
  return self.entry.DATA.com(a.r-b.r, a.i-b.i);
};
My_entry.math_com.prototype.mul = function(a, b){
  var self = this;
  var cr = a.r*b.r-a.i*b.i;
  var ci = a.r*b.i+a.i*b.r;
  return self.entry.DATA.com(cr, ci);
};
My_entry.math_com.prototype.mul1 = function(a, k){
  var self = this;
  return self.entry.DATA.com(a.r*k, a.i*k);
};
My_entry.math_com.prototype.div = function(a, b){
  var self = this;
  var w = b.r*b.r+b.i*b.i;
  var cr = (a.r*b.r+a.i*b.i)/w;
  var ci = (a.i*b.r-a.r*b.i)/w;
  return self.entry.DATA.com(cr, ci);
};
My_entry.math_com.prototype.div1 = function(a, k){
  var self = this;
  return self.entry.DATA.com(a.r/k, a.i/k);
};
My_entry.math_com.prototype.ln =
My_entry.math_com.prototype.log = function(a){
  var self = this;
  return self.entry.DATA.com(Math.log(self.absolute_com(a)), self.argument_com(a));
};
My_entry.math_com.prototype.log2 = function(a){
  var self = this;
  return self.mul(self.entry.DATA.com(Math.LOG2E, 0), self.ln(a));
};
My_entry.math_com.prototype.log10 = function(a){
  var self = this;
  return self.mul(self.entry.DATA.com(Math.LOG10E, 0), self.ln(a));
};
My_entry.math_com.prototype.log_ex = function(a, b){
  var self = this;
  return self.mul(self.entry.DATA.com(self.entry.math.log_ex(Math.E, (b)? b.r: 10), 0), self.ln(a));
};
My_entry.math_com.prototype.exp = function(a){
  var self = this;
  var x = Math.exp(a.r);
  return self.entry.DATA.com(Math.cos(a.i)*x, Math.sin(a.i)*x);
};
My_entry.math_com.prototype.pow = function(a, b){
  var self = this;
  if(!(self.absolute_com(a))){
    var cr = (self.absolute_com(b))? 0: 1;
    return self.entry.DATA.com(cr, 0);
  }
  return self.exp(self.mul(self.ln(a), b));
};
My_entry.math_com.prototype.sin = function(a){
  var self = this;
  var math = self.entry.math;
  return self.entry.DATA.com(Math.sin(a.r)*math.cosh(a.i), Math.cos(a.r)*math.sinh(a.i));
};
My_entry.math_com.prototype.cos = function(a){
  var self = this;
  var math = self.entry.math;
  return self.entry.DATA.com(Math.cos(a.r)*math.cosh(a.i), -Math.sin(a.r)*math.sinh(a.i));
};
My_entry.math_com.prototype.tan = function(a){
  var self = this;
  return self.div(self.sin(a), self.cos(a));
};
My_entry.math_com.prototype.sqrt = function(a){
  var self = this;
  var z = Math.sqrt(self.absolute_com(a));
  var t = self.argument_com(a)*0.5;
  return self.entry.DATA.com(Math.cos(t)*z, Math.sin(t)*z);
};
My_entry.math_com.prototype.sinh = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.mul1(self.sub(epz, emz), 0.5);
};
My_entry.math_com.prototype.cosh = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.mul1(self.add(epz, emz), 0.5);
};
My_entry.math_com.prototype.tanh = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.div(self.sub(epz, emz), self.add(epz, emz));
};
My_entry.math_com.prototype.asin = function(z){
  var self = this;
  var DATA = self.entry.DATA;
  var r1 = DATA.com(1, 0);
  var im1 = DATA.com(0, -1);
  var iz = self.muli(z);
  var z2 = self.mul(z, z);
  var sqrt_r1mz2 = self.sqrt(self.sub(r1, z2));
/*
  var ans1 = self.mul(im1, self.ln(self.add(iz, sqrt_r1mz2)));
  var ans2 = self.mul(im1, self.ln(self.sub(iz, sqrt_r1mz2)));
*/
  return self.mul(im1, self.ln(self.add(iz, sqrt_r1mz2)));
};
My_entry.math_com.prototype.acos = function(z){
  var self = this;
/*
  var DATA = self.entry.DATA;
  var r1 = DATA.com(1, 0);
  var im1 = DATA.com(0, -1);
  var z2 = self.mul(z, z);
  var sqrt_z2mr1 = self.sqrt(self.sub(z2, r1));
  var ans1 = self.mul(im1, self.ln(self.add(z, sqrt_z2mr1)));
  var ans2 = self.mul(im1, self.ln(self.sub(z, sqrt_z2mr1)));
*/
  var pi0p5 = self.entry.DATA.com(Math.PI*0.5, 0);
  return self.sub(pi0p5, self.asin(z));
};
My_entry.math_com.prototype.atan = function(z){
  var self = this;
  var DATA = self.entry.DATA;
  var r1 = DATA.com(1, 0);
  var i0p5 = DATA.com(0, 0.5);
  var iz = self.muli(z);
  var r1miz = self.sub(r1, iz);
  var r1piz = self.add(r1, iz);
  return self.mul(i0p5, self.ln(self.div(r1miz, r1piz)));
};
My_entry.math_com.prototype.asinh = function(z){
  var self = this;
  var r1 = self.entry.DATA.com(1, 0);
  var zp2 = self.mul(z, z);
  var sqrt_zp2pr1 = self.sqrt(self.add(zp2, r1));
  return self.ln(self.add(z, sqrt_zp2pr1));
};
My_entry.math_com.prototype.acosh = function(z){
  var self = this;
  var r1 = self.entry.DATA.com(1, 0);
  var sqrt_zpr1 = self.sqrt(self.add(z, r1));
  var sqrt_zmr1 = self.sqrt(self.sub(z, r1));
  return self.ln(self.add(z, self.mul(sqrt_zpr1, sqrt_zmr1)));
};
My_entry.math_com.prototype.atanh = function(z){
  var self = this;
  var DATA = self.entry.DATA;
  var r1 = DATA.com(1, 0);
  var r0p5 = DATA.com(0.5, 0);
  var r1pz = self.add(r1, z);
  var r1mz = self.sub(r1, z);
  return self.mul(r0p5, self.ln(self.div(r1pz, r1mz)));
};
/* Ver.2.149.37 -> */
My_entry.math_com.prototype.csch = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.div(self.entry.DATA.com(2, 0), self.sub(epz, emz));
};
My_entry.math_com.prototype.sech = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.div(self.entry.DATA.com(2, 0), self.add(epz, emz));
};
My_entry.math_com.prototype.coth = function(z){
  var self = this;
  var epz = self.exp(z);
  var emz = self.exp(self.flip(z));
  return self.div(self.add(epz, emz), self.sub(epz, emz));
};
My_entry.math_com.prototype.acsch = function(z){
  var self = this;
  var rz = self.div(self.entry.DATA.com(1, 0), z);
  return self.asinh(rz);
};
My_entry.math_com.prototype.asech = function(z){
  var self = this;
  var rz = self.div(self.entry.DATA.com(1, 0), z);
  return self.acosh(rz);
};
My_entry.math_com.prototype.acoth = function(z){
  var self = this;
  var rz = self.div(self.entry.DATA.com(1, 0), z);
  return self.atanh(rz);
};
/* -> Ver.2.149.37 */
My_entry.math_com.prototype.lerp_sw = function(t0, t1, k, isLog){
  var self = this;
  var math = self.entry.math;
  return self.entry.DATA.com(math.lerp_sw(t0.r, t1.r, k, isLog), math.lerp_sw(t0.i, t1.i, k, isLog));
};
