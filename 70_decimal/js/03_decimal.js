// online-simulator.github.io

function My_test_decimal(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_decimal, My_original_main);

My_test_decimal.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_decimal.prototype.init_elems = function(){
  var self = this;
  self.setup_elems_readonly(["input"]);
  self.setup_elems(My$arr_tag("input"), "onclick");
  self.setup_elems(My$arr_tag("input"), "onchange");
  self.setup_elems(My$arr_tag("select"), "onchange");
  return self;
};
My_test_decimal.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
    var self = this;
    self.drag = new My_handler_drag("div-drag", "checkbox-drag", {});
    self.drag.switch();
    self.n2dec();
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "input-n":
        self.n2dec();
        break;
      case "input-dec":
        self.dec2n();
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    switch(elem.id){
      case "checkbox-drag":
        self.drag.switch();
        break;
      case "select-n2dec":
      case "input-n":
        self.n2dec();
        break;
      case "input-dec":
      case "select-dec2n":
        self.dec2n();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_test_decimal.prototype.n2dec = function(){
  var self = this;
  var val_n = My$_id("input-n").value;
  var n = My$selectNum_id("select-n2dec");
  var dec = My_conv.n2dec(val_n, n);
  My$_id("output-dec").value = dec;
  var isChecked = My$checkbox_id("checkbox-dec-dec");
  if(isChecked){
    My$_id("input-dec").value = dec;
    var n = My$selectNum_id("select-dec2n");
    My$_id("output-n").value = My_conv.dec2n(dec, n);
  }
  return self;
};
My_test_decimal.prototype.dec2n = function(){
  var self = this;
  var val_dec = My$_id("input-dec").value;
  var n = My$selectNum_id("select-dec2n");
  My$_id("output-n").value = My_conv.dec2n(val_dec, n);
  var isChecked = My$checkbox_id("checkbox-dec-dec");
  if(isChecked){
    My$_id("output-dec").value = val_dec;
    var n = My$selectNum_id("select-n2dec");
    My$_id("input-n").value = My_conv.dec2n(val_dec, n);
  }
  return self;
};
