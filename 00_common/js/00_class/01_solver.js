// online-simulator.github.io

My_entry.solver = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.solver.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["math", "math_com", "DATA", "unit"]);
  return self;
};
My_entry.solver.prototype.gaussian = function(options, obj_Axb){
  var self = this;
  obj_Axb.N = obj_Axb.A.length;
  self.gaussian_pre(options, obj_Axb);
  self.gaussian_forward(options, obj_Axb);
  self.gaussian_backward(options, obj_Axb);
  return self;
};
My_entry.solver.prototype.gaussian_pre = function(options, obj_Axb){
  var self = this;
  var math = self.entry.math;
  var math_com = self.entry.math_com;
  var N = obj_Axb.N;
  var A = obj_Axb.A;
  var b = obj_Axb.b;
  var abs_pivot = 0;
  var abs_non_pivot = 0;
  var i_switch = 0;
  for(var i=0; i<N-1; ++i){
    i_switch = i;
    abs_pivot = math_com.absolute_com(A[i][i].com);
    for(var ii=i+1; ii<N; ++ii){
      abs_non_pivot = math_com.absolute_com(A[ii][i].com);
      if(abs_pivot < abs_non_pivot){
        abs_pivot = abs_non_pivot;
        i_switch = ii;
      }
    }
    if(i !== i_switch){
      math.switch_arr(A, i, i_switch);
      math.switch_arr(b, i, i_switch);
    }
  }
  return self;
};
My_entry.solver.prototype.gaussian_forward = function(options, obj_Axb){
  var self = this;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var N = obj_Axb.N;
  var A = obj_Axb.A;
  var b = obj_Axb.b;
  for(var i=0; i<N-1; ++i){
    for(var ii=i+1; ii<N; ++ii){
      var w = unit["BRd"](options, A[ii][i], A[i][i]);
      A[ii][i] = DATA.num(0, 0);
      for(j=i+1; j<N; ++j){
        A[ii][j] = unit["BRs"](options, A[ii][j], unit["BRm"](options, A[i][j], w));
      }
      b[ii][0] = unit["BRs"](options, b[ii][0], unit["BRm"](options, b[i][0], w));
    }
  }
  return self;
};
My_entry.solver.prototype.gaussian_backward = function(options, obj_Axb){
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
