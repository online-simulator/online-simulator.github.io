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
  self.setup_elems_readonly(["textarea"]);
  self.setup_elems(My$arr_tag("button"), "onclick");
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
      case "postset_BE":
      case "postset_LE":
      case "postset_native":
        self[elem.id]();
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
  My$_id("textarea-input").value = "";
  My$_id("textarea-output_BE").value = "";
  My$_id("textarea-output_LE").value = "";
  My$_id("textarea-output_native").value = "";
  return self;
};
My_test_base64.prototype.str2base64 = function(){
  var self = this;
  var input = My$_id("textarea-input").value;
  var output_BE = "";
  var output_LE = "";
  var output_native = "";
  try{
    var binary = My_conv.str2binary(input);
    output_BE = btoa(binary);
  }
  catch(e){
    output_BE = e.message;
  }
  My$_id("textarea-output_BE").value = output_BE;
  try{
    var binary = My_conv.str2binary(input, true);
    output_LE = btoa(binary);
  }
  catch(e){
    output_LE = e.message;
  }
  My$_id("textarea-output_LE").value = output_LE;
  try{
    output_native = btoa(input);
  }
  catch(e){
    output_native = e.message;
  }
  My$_id("textarea-output_native").value = output_native;
  return self;
};
My_test_base64.prototype.base64_2str = function(){
  var self = this;
  var input = My$_id("textarea-input").value;
  var output_BE = "";
  var output_LE = "";
  var output_native = "";
  try{
    var binary = atob(input);
    output_BE = My_conv.binary2str(binary);
  }
  catch(e){
    output_BE = e.message;
  }
  My$_id("textarea-output_BE").value = output_BE;
  try{
    var binary = atob(input);
    output_LE = My_conv.binary2str(binary, true);
  }
  catch(e){
    output_LE = e.message;
  }
  My$_id("textarea-output_LE").value = output_LE;
  try{
    output_native = atob(input);
  }
  catch(e){
    output_native = e.message;
  }
  My$_id("textarea-output_native").value = output_native;
  return self;
};
My_test_base64.prototype.postset_BE = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_BE").value;
  return self;
};
My_test_base64.prototype.postset_LE = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_LE").value;
  return self;
};
My_test_base64.prototype.postset_native = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_native").value;
  return self;
};
