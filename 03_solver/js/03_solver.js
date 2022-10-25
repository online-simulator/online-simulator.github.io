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
    switch(elem.id){
      case "Gauss":
        self.elem_o.value = "Now calculating...";
        setTimeout(function(){
          try{
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
            var obj = {A: A, b: b, x: []};
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
            var obj = {x: []};
            ["b", "aA", "mA", "nA"].forEach(function(id){
              obj[id] = ($._id("input-"+id).value).split(",");
              check_num(obj[id]);
            });
            var len_j = obj.aA.length;
            ["mA", "nA"].forEach(function(id){
              if(obj[id].length !== len_j) throw "Invalid size-"+id;
            });
            var dict = {};
            for(var j=0; j<len_j; ++j){
              var id = "m"+obj.mA[j]+"n"+obj.nA[j];
              if(dict[id]){
                throw "Invalid duplication of coo";
              }
              else{
                dict[id] = true;
              }
            }
            dict = null;
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
