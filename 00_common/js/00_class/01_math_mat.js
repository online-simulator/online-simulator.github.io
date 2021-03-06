// online-simulator.github.io

My_entry.math_mat = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math_mat.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["solver", "DATA", "unit"]);
  My_entry.def.mix_in_props(My_entry.math_mat, My_entry.DATA, ["arr2num", "arr2args"]);
  return self;
};
My_entry.math_mat.prototype.init2d = function(len_i, len_j){
  var self = this;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    _arr[i] = new Array(len_j);
  }
  return _arr;
};
My_entry.math_mat.prototype.init2d_num = function(len_i, len_j, num){
  var self = this;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    _arr[i] = new Array(len_j);
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = num;
    }
  }
  return _arr;
};
/* Ver.2.22.11 */
My_entry.math_mat.prototype.num2size = function(options, num){
  var self = this;
  var _n = (num && num.com)? Math.floor(num.com.r): 0;
  if(_n <= 0) throw "Invalid matrix size";
  if(_n > options.matSizeMax) throw "Invalid matSizeMax over";
  return _n;
};
/* Ver.2.25.12 -> */
My_entry.math_mat.prototype.vectorr = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.zeros2d(1, self.num2size(options, num));
};
My_entry.math_mat.prototype.vectorc = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.zeros2d(self.num2size(options, num), 1);
};
/* -> Ver.2.25.12 */
My_entry.math_mat.prototype.identity = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.Imat(self.num2size(options, num));  // Ver.2.22.11
};
My_entry.math_mat.prototype.scalars = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1];
  if(!(num1 && num1.com)) throw "Invalid Scalar";
  return self.Imat_num(self.num2size(options, num0), num1);  // Ver.2.22.11
};
My_entry.math_mat.prototype.zeros = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1];
  return self.zeros2d(self.num2size(options, num0), self.num2size(options, num1));  // Ver.2.22.11
};
My_entry.math_mat.prototype.ones = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1];
  return self.ones2d(self.num2size(options, num0), self.num2size(options, num1));  // Ver.2.22.11
};
My_entry.math_mat.prototype.zeros2d = function(len_i, len_j){
  var self = this;
  var DATA = self.entry.DATA;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    _arr[i] = new Array(len_j);
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.ones2d = function(len_i, len_j){
  var self = this;
  var DATA = self.entry.DATA;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    _arr[i] = new Array(len_j);
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = DATA.num(1, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.zeros2d_arr = function(arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    _arr[i] = new Array(len_j);
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.get_lens = function(arr){
  var self = this;
  var len_i = arr.length;
  var len_j = 0;
  for(var i=0; i<len_i; ++i){
    var len = (arr[i])? arr[i].length: 0;
    len_j = Math.max(len_j, len);
  }
  return {i: len_i, j: len_j};
};
My_entry.math_mat.prototype.get_len = function(arr){
  var self = this;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  return Math.max(len_i, len_j);
};
My_entry.math_mat.prototype.first = function(options, arr){
  var self = this;
  return [[arr[0][0]]];
};
My_entry.math_mat.prototype.last = function(options, arr){
  var self = this;
  return [[self.arr2num(arr)]];
};
My_entry.math_mat.prototype.sizer = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  return [[DATA.num(lens.i, 0)]];
};
My_entry.math_mat.prototype.sizec = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  return [[DATA.num(lens.j, 0)]];
};
My_entry.math_mat.prototype.normalizer = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var callback = (options.useComplex)?
    function(num){
      return unit["FN"]("conjugate", options, num);
    }:
    function(num){
      return num;
    };
  var _arr = self.init2d(len_i, len_j);
  for(var i=0; i<len_i; ++i){
    var arri = arr[i];
    var arrR = [];
    for(var j=0; j<len_j; ++j){
      var arrij = arri[j];
      arrR[j] = (arrij)? callback(arrij): null;
    }
    var norm_euclid = self.sqrt_iproduct(options, arri, arrR);
    for(var j=0; j<len_j; ++j){
      var arrij = arri[j];
      _arr[i][j] = (arrij)? unit["BRd"](options, arrij, norm_euclid): DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.normalizec = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var callback = (options.useComplex)?
    function(num){
      return unit["FN"]("conjugate", options, num);
    }:
    function(num){
      return num;
    };
  var _arr = self.init2d(len_i, len_j);
  for(var j=0; j<len_j; ++j){
    var arrL = [];
    var arrR = [];
    for(var i=0; i<len_i; ++i){
      var arrij = arr[i][j];
      arrL[i] = (arrij)? callback(arrij): null;
      arrR[i] = arrij;
    }
    var norm_euclid = self.sqrt_iproduct(options, arrL, arrR);
    for(var i=0; i<len_i; ++i){
      var arrij = arr[i][j];
      _arr[i][j] = (arrij)? unit["BRd"](options, arrij, norm_euclid): DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.transpose = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var _arr = new Array(len_j);
  for(var j=0; j<len_j; ++j){
    _arr[j] = new Array(len_i);
    for(var i=0; i<len_i; ++i){
      _arr[j][i] = arr[i][j] || DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.hermitian = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var callback = (options.useComplex)?
    function(num){
      return unit["FN"]("conjugate", options, num);
    }:
    function(num){
      return num;
    };
  var _arr = new Array(len_j);
  for(var j=0; j<len_j; ++j){
    _arr[j] = new Array(len_i);
    for(var i=0; i<len_i; ++i){
      var num = arr[i][j] || DATA.num(0, 0);
      _arr[j][i] = callback(num);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.euclidean = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var arr = self.BRm(options, self.hermitian(options, arr), arr);
  var _arr = DATA.obj2arr(unit["FN"]("sqrt", options, self.arr2num(arr)));
  return _arr;
};
My_entry.math_mat.prototype.jacobian = function(options, arr){
  var self = this;
  if(arr[0].length > 2){
    throw "Invalid J arguments";
  }
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var len_i = arr.length;
  var len_j = len_i;
  var _arr = new Array(len_i);
  for(var i=0; i<len_i; ++i){
    var leftNum = arr[i][0] || DATA.num(0, 0);
    _arr[i] = new Array(len_j);
    for(var j=0; j<len_j; ++j){
      var rightNum = arr[j][1] || DATA.num(0, 0);
      _arr[i][j] = unit["BRd"](options, leftNum, rightNum);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.gaussian = function(options, arr){
  var self = this;
  var solver = self.entry.solver;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  if(len_i !== (len_j-1)) throw "Invalid irregular matrix";  // arr=concat(A, b) len_i = len_j-1
  var obj_Axb = {};
  var A = [];
  var b = [];
  arr.forEach(function(arri, i){
    A[i] = arri.slice(0, len_j-1);
    b[i] = arri.slice(len_j-1, len_j);
  });
  obj_Axb.A = A;
  obj_Axb.x = self.init2d(len_i, 1);
  obj_Axb.b = b;
  solver.gaussian(options, obj_Axb);
  var _arr = obj_Axb.x;
  return _arr;
};
My_entry.math_mat.prototype.Imat = function(len){
  var self = this;
  return self.Imat_num(len);
};
My_entry.math_mat.prototype.Imat_num = function(len, num){
  var self = this;
  var DATA = self.entry.DATA;
  var _arr = self.zeros2d(len, len);
  var num = num || DATA.num(1, 0);
  for(var i=0; i<len; ++i){
    _arr[i][i] = num;
  }
  return _arr;
};
My_entry.math_mat.prototype.Imat_arr = function(arr){
  var self = this;
  var len = self.get_len(arr);
  return self.Imat(len);
};
My_entry.math_mat.prototype.re_size = function(arr, newLen_i, newLen_j){
  var self = this;
  var len_i = arr.length;
  var _arr = self.init2d(newLen_i, newLen_j);
  for(var i=0; i<len_i; ++i){
    var len_j = arr[i].length;
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = arr[i][j];
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.iproduct = function(options, vec0, vec1){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _num = DATA.num(0, 0);
  var len = (vec0 && vec1)? Math.min(vec0.length, vec1.length): 0;
  for(var i=0; i<len; ++i){
    var leftNum = vec0[i] || DATA.num(0, 0);
    var rightNum = vec1[i] || DATA.num(0, 0);
    _num = unit["BRa"](options, _num, unit["BRm"](options, leftNum, rightNum));
  }
  return _num;
};
My_entry.math_mat.prototype.sqrt_iproduct = function(options, vec0, vec1){
  var self = this;
  var unit = self.entry.unit;
  var _num = unit["FN"]("sqrt", options, self.iproduct(options, vec0, vec1));
  return _num;
};
My_entry.math_mat.prototype.BRd = function(options, left, right){
  var self = this;
  throw false;
  return self;
};
My_entry.math_mat.prototype.BRm = function(options, left, right){
  var self = this;
  var leftLens = self.get_lens(left);
  var rightLens = self.get_lens(right);
  var len_i = leftLens.i;
  var len_j = rightLens.j;
  if(leftLens.j !== rightLens.i) throw "Invalid matrix operation";
  var newRight = self.transpose(options, right);
  var _arr = self.init2d(len_i, len_j);
  for(var i=0; i<len_i; ++i){
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = self.iproduct(options, left[i], newRight[j]);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.BRsa = function(options, left, right, sw_sa){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var leftLens = self.get_lens(left);
  var rightLens = self.get_lens(right);
  if(leftLens.i !== rightLens.i || leftLens.j !== rightLens.j) throw "Invalid matrix operation";
  var lens = leftLens;
  var len_i = lens.i;
  var len_j = lens.j;
  var _arr = self.init2d(len_i, len_j);
  for(var i=0; i<len_i; ++i){
    for(var j=0; j<len_j; ++j){
      var leftNum = left[i][j] || DATA.num(0, 0);
      var rightNum = right[i][j] || DATA.num(0, 0);
      _arr[i][j] = unit[sw_sa](options, leftNum, rightNum);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.BRs = function(options, left, right){
  var self = this;
  return self.BRsa(options, left, right, "BRs");
};
My_entry.math_mat.prototype.BRa = function(options, left, right){
  var self = this;
  return self.BRsa(options, left, right, "BRa");
};
My_entry.math_mat.prototype.BRe = function(options, left, right){
  var self = this;
  return self.BRs(options, right, left);
};
My_entry.math_mat.prototype.rotationx = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var args = self.arr2args(arr);
  var num = args[0];
  if(!(num.com)) throw "Invalid rotation matrix";
  var _arr = self.Imat(3);
  var phi = num.com.r;
  var cos_phi = Math.cos(phi);
  var sin_phi = Math.sin(phi);
  _arr[1][1] = DATA.num(cos_phi, 0);
  _arr[2][2] = DATA.num(cos_phi, 0);
  _arr[1][2] = DATA.num(-sin_phi, 0);
  _arr[2][1] = DATA.num(sin_phi, 0);
  return _arr;
};
My_entry.math_mat.prototype.rotationy = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var args = self.arr2args(arr);
  var num = args[0];
  if(!(num.com)) throw "Invalid rotation matrix";
  var _arr = self.Imat(3);
  var theta = num.com.r;
  var cos_theta = Math.cos(theta);
  var sin_theta = Math.sin(theta);
  _arr[0][0] = DATA.num(cos_theta, 0);
  _arr[2][2] = DATA.num(cos_theta, 0);
  _arr[0][2] = DATA.num(sin_theta, 0);
  _arr[2][0] = DATA.num(-sin_theta, 0);
  return _arr;
};
My_entry.math_mat.prototype.rotationz = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var args = self.arr2args(arr);
  var num = args[0];
  if(!(num.com)) throw "Invalid rotation matrix";
  var _arr = self.Imat(3);
  var psi = num.com.r;
  var cos_psi = Math.cos(psi);
  var sin_psi = Math.sin(psi);
  _arr[0][0] = DATA.num(cos_psi, 0);
  _arr[1][1] = DATA.num(cos_psi, 0);
  _arr[0][1] = DATA.num(-sin_psi, 0);
  _arr[1][0] = DATA.num(sin_psi, 0);
  return _arr;
};
My_entry.math_mat.prototype.vector2r = function(){
  var self = this;
  return self.zeros2d(1, 2);
};
My_entry.math_mat.prototype.vector3r = function(){
  var self = this;
  return self.zeros2d(1, 3);
};
My_entry.math_mat.prototype.vector4r = function(){
  var self = this;
  return self.zeros2d(1, 4);
};
My_entry.math_mat.prototype.vector2c = function(){
  var self = this;
  return self.zeros2d(2, 1);
};
My_entry.math_mat.prototype.vector3c = function(){
  var self = this;
  return self.zeros2d(3, 1);
};
My_entry.math_mat.prototype.vector4c = function(){
  var self = this;
  return self.zeros2d(4, 1);
};
My_entry.math_mat.prototype.zeros2 = function(){
  var self = this;
  return self.zeros2d(2, 2);
};
My_entry.math_mat.prototype.zeros3 = function(){
  var self = this;
  return self.zeros2d(3, 3);
};
My_entry.math_mat.prototype.zeros4 = function(){
  var self = this;
  return self.zeros2d(4, 4);
};
My_entry.math_mat.prototype.ones2 = function(){
  var self = this;
  return self.ones2d(2, 2);
};
My_entry.math_mat.prototype.ones3 = function(){
  var self = this;
  return self.ones2d(3, 3);
};
My_entry.math_mat.prototype.ones4 = function(){
  var self = this;
  return self.ones2d(4, 4);
};
My_entry.math_mat.prototype.identity2 = function(){
  var self = this;
  return self.Imat(2);
};
My_entry.math_mat.prototype.identity3 = function(){
  var self = this;
  return self.Imat(3);
};
My_entry.math_mat.prototype.identity4 = function(){
  var self = this;
  return self.Imat(4);
};
