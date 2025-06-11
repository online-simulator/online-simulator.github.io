// online-simulator.github.io

My_entry.test_base64 = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_base64, My_entry.original_main);

My_entry.test_base64.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$", "conv"]);
  return self;
};
My_entry.test_base64.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems_readonly$("textarea");
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  self.arr_sw_out = ["BE", "LE", "blob", "native"];  // Ver.0.76.8
  return self;
};
My_entry.test_base64.prototype.init_handlers = function(){
  var self = this;
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
    switch(elem.id){
      case "clear":
      case "str2base64":
      case "base64_2str":
        self[elem.id]();
        break;
      case "postset_BE":
      case "postset_LE":
      case "postset_blob":  // Ver.0.76.8
      case "postset_native":
        self.postset_sw(elem.id.split("_")[1]);
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    switch(elem.id){
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_base64.prototype.clear = function(){
  var self = this;
  self.entry.$.arr("textarea").forEach(function(elem){
    elem.value = "";
  });
  return self;
};
My_entry.test_base64.prototype.str2base64_sw = function(sw){
  var self = this;
  var input = self.entry.$._id("textarea-input").value;
  var output = "";
  try{
    switch(sw){
      case "BE":
        output = btoa(self.entry.conv.str2binary(input));
        break;
      case "LE":
        output = btoa(self.entry.conv.str2binary(input, true));
        break;
      // Ver.0.76.8
      case "blob":
        output = self.entry.conv.str2base(input);
        break;
      default:
        output = btoa(input);
        break;
    }
  }
  catch(e){
    output = e.message;
  }
  self.entry.$._id("textarea-output_"+sw).value = output;
  return self;
};
My_entry.test_base64.prototype.str2base64 = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.str2base64_sw(sw);
  });
  return self;
};
My_entry.test_base64.prototype.base64_2str_sw = function(sw){
  var self = this;
  var input = self.entry.$._id("textarea-input").value;
  var output = "";
  try{
    switch(sw){
      case "BE":
        output = self.entry.conv.binary2str(atob(input));
        break;
      case "LE":
        output = self.entry.conv.binary2str(atob(input), true);
        break;
      // Ver.0.76.8
      case "blob":
        output = self.entry.conv.base2str(input);
        break;
      default:
        output = atob(input);
        break;
    }
  }
  catch(e){
    output = e.message;
  }
  self.entry.$._id("textarea-output_"+sw).value = output;
  return self;
};
My_entry.test_base64.prototype.base64_2str = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.base64_2str_sw(sw);
  });
  return self;
};
My_entry.test_base64.prototype.postset_sw = function(sw){
  var self = this;
  self.entry.$._id("textarea-input").value = self.entry.$._id("textarea-output_"+sw).value;
  return self;
};
