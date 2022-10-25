// online-simulator.github.io

My_entry.test_solver = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_solver, My_entry.original_main);

My_entry.test_solver.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  self.solver = new My_entry.solver_real();
  return self;
};
My_entry.test_solver.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elem_o = $._id("textarea-output");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_solver.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  self.handlers.onload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    var check_num = function(arr){
      var len_j = arr.length;
      for(var j=0; j<len_j; ++j){
        var num = arr[j];
        if(isNaN(num)){
          throw "element isNaN";
        }
        else{
          arr[j] = Number(num);
        }
      }
    };
    var mat2obj = function(){
      var text_b = $._id("input-b").value;
      var text_A = $._id("input-A").value;
      var b = text_b.split(",");
      var A = text_A.split(":");
      check_num(b);
      var len_b = b.length;
      var len_i = A.length;
      if(len_i !== len_b) throw "Invalid size-Ab";
      for(var i=0; i<len_i; ++i){
        A[i] = A[i].split(",");
        var len_j = A[i].length;
        if(len_i !== len_j) throw "Invalid size-A";
        check_num(A[i]);
      }
      var _obj = {A: A, b: b, x: []};
      return _obj;
    };
    var coo2obj = function(){
      var _obj = {x: []};
      ["b", "aA", "mA", "nA"].forEach(function(id){
        _obj[id] = ($._id("input-"+id).value).split(",");
        check_num(_obj[id]);
      });
      var len_b = _obj.b.length;
      var len_j = _obj.aA.length;
      ["mA", "nA"].forEach(function(id){
        if(_obj[id].length !== len_j) throw "Invalid size-"+id;
      });
      var dict = {};
      for(var j=0; j<len_j; ++j){
        var id = "m"+_obj.mA[j]+"n"+_obj.nA[j];
        if(dict[id]){
          throw "Invalid duplication of coo";
        }
        else{
          dict[id] = true;
        }
      }
      dict = null;
      return _obj;
    };
    switch(elem.id){
      case "mat2coo":
        self.elem_o.value = "Now calculating...";
        setTimeout(function(){
          try{
            var obj = mat2obj();
            var aA = [];
            var mA = [];
            var nA = [];
            var A = obj.A;
            var len_i = A.length;
            for(var i=0; i<len_i; ++i){  // i -> j
              var len_j = A[i].length;
              for(var j=0; j<len_j; ++j){
                var num = A[i][j];
                if(num){
                  var m = i+1;
                  var n = j+1;
                  aA.push(num);
                  mA.push(m);
                  nA.push(n);
                }
              }
            }
            $._id("input-aA").value = aA;
            $._id("input-mA").value = mA;
            $._id("input-nA").value = nA;
            self.elem_o.value = "";
          }
          catch(e){
            self.elem_o.value = e;
          }
        }, 50);
        break;
      case "coo2mat":
        self.elem_o.value = "Now calculating...";
        setTimeout(function(){
          try{
            var obj = coo2obj();
            var aA = obj.aA;
            var mA = obj.mA;
            var nA = obj.nA;
            var len_i = Math.max.apply(Math, mA);
            var len_j = Math.max.apply(Math, nA);
            var arr = new Array(len_i);
            for(var i=0; i<len_i; ++i){
              arr[i] = new Array(len_j);
            }
            var len_j = mA.length;
            for(var j=0; j<len_j; ++j){
              arr[mA[j]-1][nA[j]-1] = aA[j];
            }
            var text_A = "";
            for(var i=0; i<len_i; ++i){
              if(i > 0) text_A += ":";
              text_A += arr[i];
            }
            $._id("input-A").value = text_A;
            self.elem_o.value = "";
          }
          catch(e){
            self.elem_o.value = e;
          }
        }, 50);
        break;
      case "Gauss":
        self.elem_o.value = "Now calculating...";
        setTimeout(function(){
          try{
            var obj = mat2obj();
            self.solver.gaussian({}, obj);
            self.elem_o.value = obj.x;
          }
          catch(e){
            self.elem_o.value = e;
          }
        }, 50);
        break;
      case "Gauss_coo":
        self.elem_o.value = "Now calculating...";
        setTimeout(function(){
          try{
            var obj = coo2obj();
            var len_b = obj.b.length;
            var len_m = Math.max.apply(Math, obj.mA);
            var len_n = Math.max.apply(Math, obj.nA);
            if(len_m > len_b || len_n > len_b) throw "Invalid size-m,n,b="+len_m+","+len_n+","+len_b;
            self.solver.gaussian_coo({}, obj);
            self.elem_o.value = obj.x;
          }
          catch(e){
            self.elem_o.value = e;
          }
        }, 50);
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id;
    switch(id){
      default:
        break;
    }
    return self;
  };
  return self;
};
