// online-simulator.github.io

My_entry.test_decimal = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_decimal, My_entry.original_main);

My_entry.test_decimal.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$", "conv"]);
  return self;
};
My_entry.test_decimal.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems_readonly$("input");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onclick");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  self.entry.$.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_decimal.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(e){
    var self = this;
    self.drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    self.entry.$._id("checkbox-drag").onchange();
    self.entry.$._id("input-n").onchange();
    self.entry.$._id("input-dec").onchange();
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
My_entry.test_decimal.prototype.n2dec = function(){
  var self = this;
  var val_n = self.entry.$._id("input-n").value;
  var n = self.entry.$.selectNum_id("select-n2dec");
  var dec = self.entry.conv.n2dec(val_n, n);
  self.entry.$._id("output-dec").value = dec;
  var isChecked = self.entry.$.checkbox_id("checkbox-dec-dec");
  if(isChecked){
    self.entry.$._id("input-dec").value = dec;
    var n = self.entry.$.selectNum_id("select-dec2n");
    self.entry.$._id("output-n").value = self.entry.conv.dec2n(dec, n);
  }
  return self;
};
My_entry.test_decimal.prototype.dec2n = function(){
  var self = this;
  var val_dec = self.entry.$._id("input-dec").value;
  var n = self.entry.$.selectNum_id("select-dec2n");
  self.entry.$._id("output-n").value = self.entry.conv.dec2n(val_dec, n);
  var isChecked = self.entry.$.checkbox_id("checkbox-dec-dec");
  if(isChecked){
    self.entry.$._id("output-dec").value = val_dec;
    var n = self.entry.$.selectNum_id("select-n2dec");
    self.entry.$._id("input-n").value = self.entry.conv.dec2n(val_dec, n);
  }
  return self;
};
