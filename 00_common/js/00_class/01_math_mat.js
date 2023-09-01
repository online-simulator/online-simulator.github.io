// online-simulator.github.io

My_entry.math_mat = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.math_mat.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["solver_com", "DATA", "unit"]);
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
My_entry.math_mat.prototype.num2size = function(options, num, opt_n0){  // Ver.2.183.44
  var self = this;
  var _n = (num && num.com)? Math.round(num.com.r): (opt_n0 || 0);  // Ver.2.127.34 floor -> round  // Ver.2.183.44
  if(isNaN(_n)) throw "Invalid matrix size";  // Ver.2.170.42  // Ver.2.185.44
  if((opt_n0 === 0)? _n < 0: _n <= 0) throw "Invalid matrix size";  // Ver.2.185.44
  if(_n > options.matSizeMax) throw "Invalid matSizeMax over";
  return _n;
};
/* Ver.2.185.44 */
My_entry.math_mat.prototype.make_arr = function(options, num0, num1, callback){
  var self = this;
  var m = (num0)? self.num2size(options, num0, 0): 1;
  var n = (num1)? self.num2size(options, num1, 0): 1;
  return ((n === 0 || m === 0)? []: callback(m, n));
};
/* Ver.2.214.49 */
My_entry.math_mat.prototype.fill_arr = function(options, _arr, opt_common_num){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(_arr);
  var len_i = lens.i;
  var len_j = lens.j;
  for(var i=0; i<len_i; ++i){
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = _arr[i][j] || opt_common_num || DATA.num(0, 0);
    }
  }
  return _arr;
};
/* Ver.2.25.12 -> */
My_entry.math_mat.prototype.vectorr = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.make_arr(options, null, num, function(m, n){return self.zeros2d(m, n);});  // Ver.2.185.44
};
My_entry.math_mat.prototype.vectorc = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.make_arr(options, num, null, function(m, n){return self.zeros2d(m, n);});  // Ver.2.185.44
};
/* -> Ver.2.25.12 */
My_entry.math_mat.prototype.identity = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num = args[0];
  return self.make_arr(options, num, null, function(m, n){return self.Imat(m);});  // Ver.2.185.44
};
My_entry.math_mat.prototype.scalars = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1];
  if(!(num1 && num1.com)) throw "Invalid Scalar";
  return self.make_arr(options, num0, null, function(m, n){return self.Imat_num(m, num1);});  // Ver.2.185.44
};
My_entry.math_mat.prototype.zeros = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1] || num0;  // Ver.2.185.44
  return self.make_arr(options, num0, num1, function(m, n){return self.zeros2d(m, n);});  // Ver.2.185.44
};
My_entry.math_mat.prototype.ones = function(options, arr){
  var self = this;
  var args = self.arr2args(arr);
  var num0 = args[0];
  var num1 = args[1] || num0;  // Ver.2.185.44
  return self.make_arr(options, num0, num1, function(m, n){return self.ones2d(m, n);});  // Ver.2.185.44
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
/* Ver.2.224.52 */
My_entry.math_mat.prototype.hasNaN = function(options, arr){
  var self = this;
  var _hasNaN = false;
  var len_i = arr.length;
  var len_i0 = arr[0].length;
  for(var i=1; i<len_i; ++i){
    var arri = arr[i];
    _hasNaN = _hasNaN || (arri.length !== len_i0);
  }
  return _hasNaN;
};
/* Ver.2.172.42 -> */
My_entry.math_mat.prototype.isfalse = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var isFalse = DATA.isFalse_arr(arr);
  return [[DATA.num(isFalse, 0)]];
};
My_entry.math_mat.prototype.istrue = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var isFalse = DATA.isFalse_arr(arr);
  return [[DATA.num(!(isFalse), 0)]];
};
/* -> Ver.2.172.42 */
/* Ver.2.178.44 -> */
/* Ver.2.176.43 -> */
/* Ver.2.183.44 -> */
My_entry.math_mat.prototype.getNum_linterp = function(a, b, k){  // Ver.2.228.55
  var self = this;
  return self.entry.DATA.num(a.r+(b.r-a.r)*k, a.i+(b.i-a.i)*k);
};
/* Ver.2.228.55 -> */
My_entry.math_mat.prototype.getNum_linspace = function(y0, dy, j){
  var self = this;
  return self.entry.DATA.num(y0.r+dy.r*j, y0.i+dy.i*j);
};
My_entry.math_mat.prototype.getCom_dy = function(a, b, N_){
  var self = this;
  var N = N_ || 1;
  return self.entry.DATA.com((b.r-a.r)/N, (b.i-a.i)/N);  // /not0
};
/* -> Ver.2.228.55 */
My_entry.math_mat.prototype.linspace = function(options, arr){
  var self = this;
  var _arr = [];
  var len_i = arr.length;
  for(var i=0; i<len_i; ++i){
    var arri = arr[i];
    var len_j = arri.length;
    if(!(len_j === 2 || len_j === 3)) throw "Invalid args.length=2||3(linspace)";
    var com_y0 = arri[0].com;
    var com_y1 = arri[1].com;
    var Np1 = self.num2size(options, arri[2], 50);
    var com_dy = self.getCom_dy(com_y0, com_y1, Np1-1);  // Ver.2.228.55
    var arr_interp = [];
    for(var j=0; j<Np1; ++j){
      arr_interp[j] = self.getNum_linspace(com_y0, com_dy, j);  // Ver.2.228.55
    }
    if(arr_interp.length){
      _arr.push(arr_interp);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.interp_base = function(options, arr, callback){
  var self = this;
  var DATA = self.entry.DATA;
  if(!(arr.length === 3 && arr[1].length === arr[2].length)) throw "Invalid table(interp)";
  var lens = self.get_lens(arr.slice(1, 3));
  var len_i = lens.i;
  var len_j = lens.j;
  var len_n = arr[0].length;
  var _arr = [];
  for(var n=0; n<len_n; ++n){
    var com_x = arr[0][n].com;
    var xr = com_x.r;
    var num = DATA.num(NaN, NaN);
    for(var j=0; j<len_j-1; ++j){
      var com_x0 = arr[1][j].com;
      var com_x1 = arr[1][j+1].com;
      var hasXr = (xr >= com_x0.r && xr <= com_x1.r);  // >= min && <= max
      if(hasXr){
        var com_y0 = arr[2][j].com;
        var com_y1 = arr[2][j+1].com;
        num = callback(com_x, com_x0, com_x1, com_y0, com_y1, j);  // Ver.2.181.44
        break;
      }
    }
    _arr.push(num);
  }
  return [_arr];
};
/* Ver.2.179.44 */
My_entry.math_mat.prototype.interp0 = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var callback = function(com_x, com_x0, com_x1, com_y0, com_y1){
    var dxr0 = com_x.r-com_x0.r;
    var dxr1 = com_x1.r-com_x.r;
    var com = (dxr0 < dxr1)? com_y0: com_y1;  // round(0.5) -> 1
    return DATA.num(com.r, com.i);
  };
  return self.interp_base(options, arr, callback);
};
My_entry.math_mat.prototype.interp1 =  // Ver.2.179.44
My_entry.math_mat.prototype.interp = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var callback = function(com_x, com_x0, com_x1, com_y0, com_y1){
    /* Ver.2.183.44 -> */
    var dxr = com_x.r-com_x0.r;
    var hxr = com_x1.r-com_x0.r;
    var k = dxr/hxr;  // /0
    return self.getNum_linterp(com_y0, com_y1, k);  // Ver.2.228.55
    /* -> Ver.2.183.44 */
  };
  return self.interp_base(options, arr, callback);
};
/* Ver.2.181.44 -> */
My_entry.math_mat.prototype.interp2 = function(options, arr, callback){
  var self = this;
  var DATA = self.entry.DATA;
  if(!(arr.length === 3 && arr[1].length === arr[2].length)) throw "Invalid table(interp)";
  var lens = self.get_lens(arr.slice(1, 3));
  var len_i = lens.i;
  var len_j = lens.j;
  var len_n = arr[0].length;
  var ljx = function(xr, j){
    var _ljx = 1;
    var xjr = arr[1][j].com.r;
    for(var m=0; m<len_j; ++m){
      var xmr = arr[1][m].com.r;
      _ljx *= (m === j)? 1: (xr-xmr)/(xjr-xmr);
    }
    return _ljx;
  };
  var _arr = [];
  for(var n=0; n<len_n; ++n){
    var com_x = arr[0][n].com;
    var xr = com_x.r;
    var Lkxr = 0;
    var Lkxi = 0;
    for(var j=0; j<len_j; ++j){
      var yj = arr[2][j].com;
      var ljxj = ljx(xr, j);
      Lkxr += ljxj*yj.r;
      Lkxi += ljxj*yj.i;
    }
    var num = DATA.num(Lkxr, Lkxi);
    _arr.push(num);
  }
  return [_arr];
};
My_entry.math_mat.prototype.interp3 = function(options, arr, callback){
  var self = this;
  var solver_com = self.entry.solver_com;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  if(!(arr.length === 3 && arr[1].length === arr[2].length)) throw "Invalid table(interp)";
  var lens = self.get_lens(arr.slice(1, 3));
  var len_i = lens.i;
  var len_j = lens.j;
  var len_n = arr[0].length;
  var N = len_j-1;
  var arr_coo = self.init2d(4, 0);
  var dx = [];
  for(var j=0; j<N; ++j){
    var com_x0 = arr[1][j].com;
    var com_x1 = arr[1][j+1].com;
    var com_y0 = arr[2][j].com;
    var com_y1 = arr[2][j+1].com;
    dx[j] = com_x1.r-com_x0.r;
    arr_coo[3][j] = DATA.num(com_y1.r-com_y0.r, com_y1.i-com_y0.i);
    arr_coo[3][N+j] = DATA.num(0, 0);
    arr_coo[3][2*N+j] = DATA.num(0, 0);
  }
  for(var j=0; j<N; ++j){
    var n = j+1;
    var j0 = 3*j;
    var dxi = dx[j];
    arr_coo[0][j0+0] = DATA.num(dxi, 0);
    arr_coo[0][j0+1] = DATA.num(dxi*dxi, 0);
    arr_coo[0][j0+2] = DATA.num(dxi*dxi*dxi, 0);
    arr_coo[1][j0+0] = DATA.num(n, 0);
    arr_coo[1][j0+1] = DATA.num(n, 0);
    arr_coo[1][j0+2] = DATA.num(n, 0);
    arr_coo[2][j0+0] = DATA.num(n, 0);
    arr_coo[2][j0+1] = DATA.num(N+n, 0);
    arr_coo[2][j0+2] = DATA.num(2*N+n, 0);
  }
  for(var j=0; j<N-1; ++j){
    var n = j+1;
    var j0 = 3*N+4*j;
    var dxi = dx[j];
    arr_coo[0][j0+0] = DATA.num(1, 0);
    arr_coo[0][j0+1] = DATA.num(-1, 0);
    arr_coo[0][j0+2] = DATA.num(2*dxi, 0);
    arr_coo[0][j0+3] = DATA.num(3*dxi*dxi, 0);
    arr_coo[1][j0+0] = DATA.num(N+n, 0);
    arr_coo[1][j0+1] = DATA.num(N+n, 0);
    arr_coo[1][j0+2] = DATA.num(N+n, 0);
    arr_coo[1][j0+3] = DATA.num(N+n, 0);
    arr_coo[2][j0+0] = DATA.num(n, 0);
    arr_coo[2][j0+1] = DATA.num(n+1, 0);
    arr_coo[2][j0+2] = DATA.num(N+n, 0);
    arr_coo[2][j0+3] = DATA.num(2*N+n, 0);
  }
  for(var j=0; j<N-1; ++j){
    var n = j+1;
    var j0 = 7*N+3*j-4;
    var dxi = dx[j];
    arr_coo[0][j0+0] = DATA.num(1, 0);
    arr_coo[0][j0+1] = DATA.num(-1, 0);
    arr_coo[0][j0+2] = DATA.num(3*dxi, 0);
    arr_coo[1][j0+0] = DATA.num(2*N+n-1, 0);
    arr_coo[1][j0+1] = DATA.num(2*N+n-1, 0);
    arr_coo[1][j0+2] = DATA.num(2*N+n-1, 0);
    arr_coo[2][j0+0] = DATA.num(N+n, 0);
    arr_coo[2][j0+1] = DATA.num(N+n+1, 0);
    arr_coo[2][j0+2] = DATA.num(2*N+n, 0);
  }
  var j0 = 10*N-4-3;
  arr_coo[0][j0+0] = DATA.num(1, 0);
  arr_coo[0][j0+1] = DATA.num(1, 0);
  arr_coo[0][j0+2] = DATA.num(3*dx[N-1], 0);
  arr_coo[1][j0+0] = DATA.num(3*N-1, 0);
  arr_coo[1][j0+1] = DATA.num(3*N, 0);
  arr_coo[1][j0+2] = DATA.num(3*N, 0);
  arr_coo[2][j0+0] = DATA.num(N+1, 0);
  arr_coo[2][j0+1] = DATA.num(2*N, 0);
  arr_coo[2][j0+2] = DATA.num(3*N, 0);
  var arr_bcd = self.gaussian_coo(options, arr_coo);
  var callback = function(com_x, com_x0, com_x1, com_y0, com_y1, j){
    var dxr0p1 = com_x.r-com_x0.r;
    var dxr0p2 = dxr0p1*dxr0p1;
    var dxr0p3 = dxr0p1*dxr0p2;
    var b = arr_bcd[j][0];
    var c = arr_bcd[N+j][0];
    var d = arr_bcd[2*N+j][0];
    var r1 = DATA.num(com_y0.r, com_y0.i);
    var r2 = unit["BRm"](options, b, DATA.num(dxr0p1, 0));
    var r3 = unit["BRm"](options, c, DATA.num(dxr0p2, 0));
    var r4 = unit["BRm"](options, d, DATA.num(dxr0p3, 0));
    var r1_r2 = unit["BRa"](options, r1, r2);
    var r1_r2_r3 = unit["BRa"](options, r1_r2, r3);
    var r1_r2_r3_r4 = unit["BRa"](options, r1_r2_r3, r4);
    var _num = r1_r2_r3_r4;
    return _num;
  };
  return self.interp_base(options, arr, callback);
};
/* -> Ver.2.181.44 */
/* -> Ver.2.176.43 */
/* -> Ver.2.178.44 */
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
/* Ver.2.185.44 */
My_entry.math_mat.prototype.size = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  var _arr = [[DATA.num(lens.i, 0)]];
  var isSquare = (lens.i === lens.j);
  if(!(isSquare)){
    _arr.push([DATA.num(lens.j, 0)]);
  }
  return _arr;
};
My_entry.math_mat.prototype.sizec = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  return [[DATA.num(lens.j, 0)]];
};
/* Ver.2.234.56 -> */
My_entry.math_mat.prototype.reshaper = function(options, arr){
  var self = this;
  return self.reshape(options, arr, true);
};
My_entry.math_mat.prototype.reshape =
My_entry.math_mat.prototype.reshapec = function(options, arr, isRow){
  var self = this;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr.slice(0, arr.length-1));
  var len_i0 = lens.i;
  var len_j0 = lens.j;
  var len_je = arr[len_i0].length;
  if(len_je !== 2) throw "Invalid reshape length";
  var arr0_je = arr[len_i0][0];
  var arr1_je = arr[len_i0][1];
  /* Ver.2.235.56 -> */
  var len_i = (arr0_je && arr0_je.com)? Math.round(arr0_je.com.r): -1;
  var len_j = (arr1_je && arr1_je.com)? Math.round(arr1_je.com.r): -1;
  var Nelem = len_i0*len_j0;
  if(len_i === 0){
    len_i = Nelem/len_j;
  }
  if(len_j === 0){
    len_j = Nelem/len_i;
  }
  if(!(len_i%1 === 0 && len_j%1 === 0 && len_i*len_j === Nelem)) throw "Invalid reshape size";
  /* -> Ver.2.235.56 */
  var num_NaN = DATA.num(NaN, NaN);  // common reference
  var callback = (isRow)?
    function(i, j){
      var n = len_j*i+j;
      var j0 = Math.floor(n/len_j0);
      var dj = n%len_j0;
      return arr[j0][dj];
    }:
    function(i, j){
      var n = len_i*j+i;
      var i0 = Math.floor(n/len_i0);
      var di = n%len_i0;
      return arr[di][i0];
    };
  var _arr = self.init2d(len_i, len_j);
  for(var i=0; i<len_i; ++i){
    for(var j=0; j<len_j; ++j){
      _arr[i][j] = callback(i, j) || num_NaN;
    }
  }
  return _arr;
};
/* -> Ver.2.234.56 */
/* Ver.2.187.44 -> */
My_entry.math_mat.prototype.calc_norm = function(options, vec){
  var self = this;
  var unit = self.entry.unit;
  var callback = (options.useComplex)?
    function(num){
      return unit["FN"]("conjugate", options, num);
    }:
    function(num){
      return num;
    };
  var vec0 = vec;
  var vec1 = [];
  var len_j = vec0.length;
  for(var j=0; j<len_j; ++j){
    var vec0j = vec0[j];
    vec1[j] = (vec0j)? callback(vec0j): null;
  }
  return self.sqrt_iproduct(options, vec0, vec1);
};
My_entry.math_mat.prototype.normr = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _arr = [];
  var len_i = arr.length;
  for(var i=0; i<len_i; ++i){
    var arri = arr[i];
    var norm_euclid = self.calc_norm(options, arri);
    _arr[i] = [norm_euclid];
  }
  return _arr;
};
My_entry.math_mat.prototype.norm =
My_entry.math_mat.prototype.normc =
My_entry.math_mat.prototype.euclidean = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var tarr = self.transpose(options, arr);
  var _arr = [[]];
  var len_j = tarr.length;
  for(var j=0; j<len_j; ++j){
    var tarrj = tarr[j];
    var norm_euclid = self.calc_norm(options, tarrj);
    _arr[0][j] = norm_euclid;
  }
  return _arr;
};
My_entry.math_mat.prototype.normalizer = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var _arr = self.init2d(len_i, len_j);
  for(var i=0; i<len_i; ++i){
    var arri = arr[i];
    var norm_euclid = self.calc_norm(options, arri);
    for(var j=0; j<len_j; ++j){
      var arrij = arri[j];
      _arr[i][j] = (arrij)? unit["BRd"](options, arrij, norm_euclid): DATA.num(0, 0);
    }
  }
  return _arr;
};
My_entry.math_mat.prototype.normalize =  // Ver.2.185.44
My_entry.math_mat.prototype.normalizec = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  var _arr = self.init2d(len_i, len_j);
  for(var j=0; j<len_j; ++j){
    var arrj = [];
    for(var i=0; i<len_i; ++i){
      arrj[i] = arr[i][j];
    }
    var norm_euclid = self.calc_norm(options, arrj);
    for(var i=0; i<len_i; ++i){
      var arrij = arr[i][j];
      _arr[i][j] = (arrij)? unit["BRd"](options, arrij, norm_euclid): DATA.num(0, 0);
    }
  }
  return _arr;
};
/* -> Ver.2.187.44 */
My_entry.math_mat.prototype.trans =  // Ver.2.187.44
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
My_entry.math_mat.prototype.htrans =  // Ver.2.187.44
My_entry.math_mat.prototype.htranspose =  // Ver.2.187.44
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
My_entry.math_mat.prototype.jacobi =  // Ver.2.187.44
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
My_entry.math_mat.prototype.gauss =  // Ver.2.187.44
My_entry.math_mat.prototype.gaussian = function(options, arr){  // arr=(A,b) -> x
  var self = this;
  var solver_com = self.entry.solver_com;
  var DATA = self.entry.DATA;
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  if(self.hasNaN(options, arr) || DATA.hasVar_arr(arr) || len_i !== (len_j-1)) throw "Invalid irregular matrix";  // Ver.2.224.52
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
  solver_com.gaussian(options, obj_Axb);
  var _arr = obj_Axb.x;
  return _arr;
};
/* Ver.2.135.35 -> */
My_entry.math_mat.prototype.gauss_coo =  // Ver.2.187.44
My_entry.math_mat.prototype.gaussian_coo = function(options, arr){  // arr=(aA:mA:nA:tb) -> x
  var self = this;
  var solver_com = self.entry.solver_com;
  var DATA = self.entry.DATA;
  if(arr.length !== 4) throw "Invalid coo2matSize";
  var arr0 = arr[0];
  var arr1 = arr[1];
  var arr2 = arr[2];
  var arr3 = arr[3];
  var len_arr0 = arr0.length;
  var len_arr1 = arr1.length;
  var len_arr2 = arr2.length;
  var len_arr3 = arr3.length;
  var mnA = self.make_mnA(options, [arr0, arr1, arr2]);
  var mA = mnA.m;
  var nA = mnA.n;
  var len_m = Math.max.apply(Math, mA);
  var len_n = Math.max.apply(Math, nA);
  if(len_m > len_arr3 || len_n > len_arr3) throw "Invalid coo2matSize";
  var obj_Axb = {};
  obj_Axb.aA = arr0;
  obj_Axb.mA = mA;
  obj_Axb.nA = nA;
  obj_Axb.x = self.init2d(len_arr3, 1);
  obj_Axb.b = arr3;
  solver_com.gaussian_lil(options, obj_Axb);  // coo2lil
  var _arr = obj_Axb.x;
  return _arr;
};
/* Ver.2.124.34 -> */
My_entry.math_mat.prototype.gaussian_coo_original = function(options, arr){  // arr=(aA:mA:nA:tb) -> x
  var self = this;
  var solver_com = self.entry.solver_com;
  var DATA = self.entry.DATA;
  if(arr.length !== 4) throw "Invalid coo2matSize";
  var arr0 = arr[0];
  var arr1 = arr[1];
  var arr2 = arr[2];
  var arr3 = arr[3];
  var len_arr0 = arr0.length;
  var len_arr1 = arr1.length;
  var len_arr2 = arr2.length;
  var len_arr3 = arr3.length;
  var mnA = self.make_mnA(options, [arr0, arr1, arr2]);
  var mA = mnA.m;
  var nA = mnA.n;
  var len_m = Math.max.apply(Math, mA);
  var len_n = Math.max.apply(Math, nA);
  if(len_m > len_arr3 || len_n > len_arr3) throw "Invalid coo2matSize";
  var obj_Axb = {};
  var m2arr_n = [];
  var m2A = [];
  for(var j=0; j<len_arr0; ++j){
    var m = mA[j];
    var n = nA[j];
    m2arr_n[m] = m2arr_n[m] || [];
    m2arr_n[m].push(n);
    var arr0j = arr0[j];
    m2A[m] = m2A[m] || [];
    m2A[m].push(arr0j);
  }
  obj_Axb.m2arr_n = m2arr_n;
  obj_Axb.m2A = m2A;
  obj_Axb.x = self.init2d(len_arr3, 1);
  obj_Axb.b = arr3;
  solver_com.gaussian_coo(options, obj_Axb);
  var _arr = obj_Axb.x;
  return _arr;
};
/* -> Ver.2.135.35 */
My_entry.math_mat.prototype.make_mnA = function(options, arr){
  var self = this;
  if(arr.length !== 3) throw "Invalid coo2matSize";
  var arr0 = arr[0];
  var arr1 = arr[1];
  var arr2 = arr[2];
  var len_arr0 = arr0.length;
  var len_arr1 = arr1.length;
  var len_arr2 = arr2.length;
  if(!(len_arr0 === len_arr1 && len_arr0 === len_arr2)) throw "Invalid coo2matSize";
  var mA = [];
  var nA = [];
  for(var j=0; j<len_arr1; ++j){
    mA[j] = self.num2size(options, arr1[j]);
  }
  for(var j=0; j<len_arr2; ++j){
    nA[j] = self.num2size(options, arr2[j]);
  }
  var dict = {};
  for(var j=0; j<len_arr0; ++j){
    var id = "m"+mA[j]+"n"+nA[j];
    if(dict[id]){
      throw "Invalid duplication of coo";
    }
    else{
      dict[id] = true;
    }
  }
  dict = null;
  return {m: mA, n: nA};
};
/* Ver.2.123.34 */
My_entry.math_mat.prototype.coo2mat = function(options, arr){  // arr=(aA:mA:nA) -> A
  var self = this;
  var DATA = self.entry.DATA;
  var arr0 = arr[0];
  var len_arr0 = arr0.length;
  var mnA = self.make_mnA.apply(self, arguments);
  var mA = mnA.m;
  var nA = mnA.n;
  var len_i = Math.max.apply(Math, mA);
  var len_j = Math.max.apply(Math, nA);
  var _arr = self.zeros2d(len_i, len_j);
  for(var j=0; j<len_arr0; ++j){
    _arr[mA[j]-1][nA[j]-1] = arr0[j];
  }
  return _arr;
};
/* -> Ver.2.124.34 */
/* Ver.2.126.34 */
My_entry.math_mat.prototype.mat2coo = function(options, arr){
  var self = this;
  var DATA = self.entry.DATA;
  var _arr = self.init2d(3, 0);  // new Array(0) -> []
  var _arr0 = _arr[0];
  var _arr1 = _arr[1];
  var _arr2 = _arr[2];
  var lens = self.get_lens(arr);
  var len_i = lens.i;
  var len_j = lens.j;
  for(var i=0; i<len_i; ++i){  // i -> j
    for(var j=0; j<len_j; ++j){
      var num = arr[i][j];
      if(num && num.com){
        var cr = num.com.r;
        var ci = num.com.i;
        var er = num.err.r;
        var ei = num.err.i;
        if(cr || ci || er || ei){
          var m = i+1;
          var n = j+1;
          _arr0.push(num);
          _arr1.push(DATA.num(m, 0));
          _arr2.push(DATA.num(n, 0));
        }
      }
    }
  }
  return DATA.arr2arri_NaN(_arr);  // Ver.2.170.42  // Ver.2.217.50
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
  /* Ver.2.88.32 -> */
//  if(leftLens.j !== rightLens.i) throw "Invalid matrix operation";
  if(leftLens.j !== rightLens.i) return false;
  /* -> Ver.2.88.32 */
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
  /* Ver.2.88.32 -> */
//  if(leftLens.i !== rightLens.i || leftLens.j !== rightLens.j) throw "Invalid matrix operation";
  if(leftLens.i !== rightLens.i || leftLens.j !== rightLens.j) return false;
  /* -> Ver.2.88.32 */
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
