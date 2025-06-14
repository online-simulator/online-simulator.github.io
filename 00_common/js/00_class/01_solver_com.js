// online-simulator.github.io

My_entry.solver_com = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.solver_com.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["math", "math_com", "DATA", "unit"]);
  return self;
};
My_entry.solver_com.prototype.gaussian = function(options, obj_Axb){
  var self = this;
  obj_Axb.N = obj_Axb.A.length;
  self.gaussian_forward(options, obj_Axb);
  self.gaussian_backward(options, obj_Axb);
  return self;
};
My_entry.solver_com.prototype.gaussian_pre = function(options, obj_Axb, i){  // Ver.2.871.164
  var self = this;
  var math = self.entry.math;
  var math_com = self.entry.math_com;
  var N = obj_Axb.N;
  var A = obj_Axb.A;
  var b = obj_Axb.b;
  /* Ver.2.871.164 -> */
  var i_switch = i;
  var abs_pivot = math_com.absolute_com(A[i][i].com);
  for(var ii=i+1; ii<N; ++ii){
    var abs_non_pivot = math_com.absolute_com(A[ii][i].com);
    if(abs_pivot < abs_non_pivot){
      abs_pivot = abs_non_pivot;
      i_switch = ii;
    }
  }
  if(i_switch !== i){
    math.switch_arr(A, i, i_switch);
    math.switch_arr(b, i, i_switch);
  }
  /* -> Ver.2.871.164 */
  return self;
};
My_entry.solver_com.prototype.gaussian_forward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var A = obj_Axb.A;
  var b = obj_Axb.b;
  for(var i=0; i<N-1; ++i){
    self.gaussian_pre(options, obj_Axb, i);  // Ver.2.871.164
    for(var ii=i+1; ii<N; ++ii){
      var w = unit["BRd"](options, A[ii][i], A[i][i]);
      A[ii][i] = DATA.num(0, 0);
      for(j=i+1; j<N; ++j){
        A[ii][j] = unit["BRs"](options, A[ii][j], unit["BRm"](options, w, A[i][j]));  // Ver.1.47.8
      }
      b[ii][0] = unit["BRs"](options, b[ii][0], unit["BRm"](options, w, b[i][0]));  // Ver.1.47.8
    }
  }
  return self;
};
My_entry.solver_com.prototype.gaussian_backward = function(options, obj_Axb){
  var self = this;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var A = obj_Axb.A;
  var x = obj_Axb.x;
  var b = obj_Axb.b;
  if(N > 0){
    var i = N-1;
    var nume = b[i][0];
    var deno = A[i][i];
    x[i][0] = unit["BRd"](options, nume, deno);
  }
  if(N > 1){
    for(var i=N-2; i>=0; --i){
      var nume = b[i][0];
      for(var j=i+1; j<N; ++j){
        nume = unit["BRs"](options, nume, unit["BRm"](options, A[i][j], x[j][0]));
      }
      var deno = A[i][i];
      x[i][0] = unit["BRd"](options, nume, deno);
    }
  }
  return self;
};
/* Ver.2.123.34 -> */
My_entry.solver_com.prototype.gaussian_coo = function(options, obj_Axb){
  var self = this;
  obj_Axb.N = obj_Axb.b.length;
  try{
    self.gaussian_coo_forward(options, obj_Axb);
    self.gaussian_coo_backward(options, obj_Axb);
  }
  catch(e){
    throw "Invalid gauss_coo2mat";
  }
  return self;
};
My_entry.solver_com.prototype.get_jn = function(arr_n, n0, opt_isChecked){
  var self = this;
  var _jn = -1;
  if(!(arr_n)) throw false;
  var len_j = arr_n.length;
  for(var j=0; j<len_j; ++j){
    var n = arr_n[j];
    if(n === n0){
      _jn = j;
      break;
    }
  }
  if(opt_isChecked && j === len_j) throw false;
  return _jn;
};
My_entry.solver_com.prototype.gaussian_coo_pre = function(options, obj_Axb, i){  // Ver.2.871.164
  var self = this;
  var math = self.entry.math;
  var math_com = self.entry.math_com;
  var DATA = self.entry.DATA;
  var N = obj_Axb.N;
  var m2arr_n = obj_Axb.m2arr_n;
  var m2A = obj_Axb.m2A;
  var b = obj_Axb.b;
  /* Ver.2.871.164 -> */
  var i_switch = i;
  var m0 = i+1;
  var n0 = i+1;
  var aA0 = m2A[m0];
  /* Ver.2.128.35 -> */
  var jn0 = self.get_jn(m2arr_n[m0], n0);
  var num_pivot = (jn0 === -1)? DATA.num(0, 0): aA0[jn0];  // pivot=0 allowed
  /* -> Ver.2.128.35 */
  var abs_pivot = math_com.absolute_com(num_pivot.com);
  for(var ii=i+1; ii<N; ++ii){
    var m = ii+1;
    var jn = self.get_jn(m2arr_n[m], n0);
    if(jn !== -1){
      var aA = m2A[m];
      var num_non_pivot = aA[jn];
      var abs_non_pivot = math_com.absolute_com(num_non_pivot.com);
      if(abs_pivot < abs_non_pivot){
        abs_pivot = abs_non_pivot;
        i_switch = ii;
      }
    }
  }
  if(i_switch !== i){
    var m_switch = i_switch+1;
    math.switch_arr(m2arr_n, m0, m_switch);
    math.switch_arr(m2A, m0, m_switch);
    math.switch_arr(b, i, i_switch);
  }
  /* -> Ver.2.871.164 */
  return self;
};
My_entry.solver_com.prototype.gaussian_coo_forward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var m2arr_n = obj_Axb.m2arr_n;
  var m2A = obj_Axb.m2A;
  var b = obj_Axb.b;
  for(var i=0; i<N-1; ++i){
    self.gaussian_coo_pre(options, obj_Axb, i);  // Ver.2.871.164
    var m0 = i+1;
    var n0 = i+1;
    var aA0 = m2A[m0];
    var num_pivot = aA0[self.get_jn(m2arr_n[m0], n0, true)];
    for(var ii=i+1; ii<N; ++ii){
      var m = ii+1;
      var jn = self.get_jn(m2arr_n[m], n0);
      if(jn !== -1){
        var arr_n0 = m2arr_n[m0];
        var len_j0 = arr_n0.length;
        var arr_n = m2arr_n[m];
        var len_j = arr_n.length;
        var aA = m2A[m];
        var w = unit["BRd"](options, aA[jn], num_pivot);
        for(var j0=0; j0<len_j0; ++j0){
          var aA0j0 = unit["BRm"](options, w, aA0[j0]);  // 1.47.8
          var nn0 = arr_n0[j0];
          var jnn = self.get_jn(m2arr_n[m], nn0);
          if(jnn === -1){
            arr_n.push(nn0);
            aA.push(unit["BRs"](options, DATA.num(0, 0), aA0j0));
          }
          else{
            aA[jnn] = unit["BRs"](options, aA[jnn], aA0j0);
          }
        }
        b[ii] = unit["BRs"](options, b[ii], unit["BRm"](options, w, b[i]));  // 1.47.8
      }
    }
  }
  return self;
};
My_entry.solver_com.prototype.gaussian_coo_backward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var m2arr_n = obj_Axb.m2arr_n;
  var m2A = obj_Axb.m2A;
  var b = obj_Axb.b;
  var x = obj_Axb.x;
  if(N > 0){
    var i = N-1;
    var m0 = i+1;
    var n0 = i+1;
    var nume = b[i];
    var deno = m2A[m0][self.get_jn(m2arr_n[m0], n0, true)];
    x[i][0] = unit["BRd"](options, nume, deno);
  }
  if(N > 1){
    for(var i=N-2; i>=0; --i){
      var m0 = i+1;
      var n0 = i+1;
      var arr_n0 = m2arr_n[m0];
      var len_j0 = arr_n0.length;
      var aA0 = m2A[m0];
      var nume = b[i];
      for(var j0=0; j0<len_j0; ++j0){
        var nn0 = arr_n0[j0];
        if(nn0 > n0){
          nume = unit["BRs"](options, nume, unit["BRm"](options, aA0[self.get_jn(m2arr_n[m0], nn0, true)], x[nn0-1][0]));
        }
      }
      var deno = aA0[self.get_jn(m2arr_n[m0], n0, true)];
      x[i][0] = unit["BRd"](options, nume, deno);
    }
  }
  return self;
};
/* -> Ver.2.123.34 */
/* Ver.2.135.35 -> */
My_entry.solver_com.prototype.gaussian_lil = function(options, obj_Axb){
  var self = this;
  obj_Axb.N = obj_Axb.b.length;
  try{
    self.gaussian_lil_init(options, obj_Axb);
    self.gaussian_lil_forward(options, obj_Axb);
    self.gaussian_lil_backward(options, obj_Axb);
  }
  catch(e){
    throw "Invalid gauss_lil2mat";
  }
  return self;
};
My_entry.solver_com.prototype.gaussian_lil_init = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  self.NUM0 = DATA.num(0, 0);
  var aA = obj_Axb.aA;
  var mA = obj_Axb.mA;
  var nA = obj_Axb.nA;
  var mnA = [];
  var len_j = aA.length;
  for(var j=0; j<len_j; ++j){
    var m = mA[j];
    var n = nA[j];
    mnA[m] = mnA[m] || {};  // list
    mnA[m][n] = aA[j];
  }
  obj_Axb.mnA = mnA;
  return self;
};
My_entry.solver_com.prototype.gaussian_lil_pre = function(options, obj_Axb, i){  // Ver.2.871.164
  var self = this;
  var math = self.entry.math;
  var math_com = self.entry.math_com;
  var DATA = self.entry.DATA;
  var N = obj_Axb.N;
  var mnA = obj_Axb.mnA;
  var b = obj_Axb.b;
  /* Ver.2.871.164 -> */
  var i_switch = i;
  var m0 = i+1;
  var n0 = i+1;
  var aA0 = mnA[m0];
  var num_pivot = aA0[n0] || self.NUM0;  // pivot=0 allowed
  var abs_pivot = math_com.absolute_com(num_pivot.com);
  for(var ii=i+1; ii<N; ++ii){
    var m = ii+1;
    var aA = mnA[m];
    var num_non_pivot = aA[n0] || self.NUM0;
    var abs_non_pivot = math_com.absolute_com(num_non_pivot.com);
    if(abs_pivot < abs_non_pivot){
      abs_pivot = abs_non_pivot;
      i_switch = ii;
    }
  }
  if(i_switch !== i){
    var m_switch = i_switch+1;
    math.switch_arr(mnA, m0, m_switch);
    math.switch_arr(b, i, i_switch);
  }
  /* -> Ver.2.871.164 */
  return self;
};
My_entry.solver_com.prototype.gaussian_lil_forward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var mnA = obj_Axb.mnA;
  var b = obj_Axb.b;
  for(var i=0; i<N-1; ++i){
    self.gaussian_lil_pre(options, obj_Axb, i);  // Ver.2.871.164
    var m0 = i+1;
    var n0 = i+1;
    var aA0 = mnA[m0];
    var num_pivot = aA0[n0] || self.NUM0;
    for(var ii=i+1; ii<N; ++ii){
      var m = ii+1;
      var aA = mnA[m];
      var num = aA[n0] || self.NUM0;
      if(num.com.r || num.com.i){  // not0
        var w = unit["BRd"](options, num, num_pivot);
        for(var n in aA0){
          aA[n] = unit["BRs"](options, aA[n] || self.NUM0, unit["BRm"](options, w, aA0[n] || self.NUM0));
        }
        b[ii] = unit["BRs"](options, b[ii], unit["BRm"](options, w, b[i]));
      }
    }
  }
  return self;
};
My_entry.solver_com.prototype.gaussian_lil_backward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var mnA = obj_Axb.mnA;
  var b = obj_Axb.b;
  var x = obj_Axb.x;
  if(N > 0){
    var i = N-1;
    var m0 = i+1;
    var n0 = i+1;
    var nume = b[i];
    var deno = mnA[m0][n0] || self.NUM0;
    x[i][0] = unit["BRd"](options, nume, deno);
  }
  if(N > 1){
    for(var i=N-2; i>=0; --i){
      var m0 = i+1;
      var n0 = i+1;
      var aA0 = mnA[m0];
      var nume = b[i];
      for(var n in aA0){
        var nn = Number(n);
        if(nn > n0){
          nume = unit["BRs"](options, nume, unit["BRm"](options, aA0[nn] || self.NUM0, x[nn-1][0]));
        }
      }
      var deno = aA0[n0] || self.NUM0;
      x[i][0] = unit["BRd"](options, nume, deno);
    }
  }
  return self;
};
/* -> Ver.2.135.35 */
