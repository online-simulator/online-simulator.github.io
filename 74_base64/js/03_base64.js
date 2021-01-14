// online-simulator.github.io

function My_test_base64(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_base64, My_original_main);

My_test_base64.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_base64.prototype.init_elems = function(){
  var self = this;
  My$.setup_elems_readonly$("textarea");
  My$.setup_elems$_tag("button", self.handlers, "onclick");
  self.arr_sw_out = ["BE", "LE", "native"];
  return self;
};
My_test_base64.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
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
My_test_base64.prototype.clear = function(){
  var self = this;
  My$.arr("textarea").forEach(function(elem){
    elem.value = "";
  });
  return self;
};
My_test_base64.prototype.str2base64_sw = function(sw){
  var self = this;
  var input = My$._id("textarea-input").value;
  var output = "";
  try{
    switch(sw){
      case "BE":
        input = My_conv.str2binary(input);
        break;
      case "LE":
        input = My_conv.str2binary(input, true);
        break;
      default:
        break;
    }
    output = btoa(input);
  }
  catch(e){
    output = e.message;
  }
  My$._id("textarea-output_"+sw).value = output;
  return self;
};
My_test_base64.prototype.str2base64 = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.str2base64_sw(sw);
  });
  return self;
};
My_test_base64.prototype.base64_2str_sw = function(sw){
  var self = this;
  var input = My$._id("textarea-input").value;
  var output = "";
  try{
    output = atob(input);
    switch(sw){
      case "BE":
        output = My_conv.binary2str(output);
        break;
      case "LE":
        output = My_conv.binary2str(output, true);
        break;
      default:
        break;
    }
  }
  catch(e){
    output = e.message;
  }
  My$._id("textarea-output_"+sw).value = output;
  return self;
};
My_test_base64.prototype.base64_2str = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.base64_2str_sw(sw);
  });
  return self;
};
My_test_base64.prototype.postset_sw = function(sw){
  var self = this;
  My$._id("textarea-input").value = My$._id("textarea-output_"+sw).value;
  return self;
};
