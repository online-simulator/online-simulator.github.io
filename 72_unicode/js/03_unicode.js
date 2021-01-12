// online-simulator.github.io

function My_test_unicode(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_unicode, My_original_main);

My_test_unicode.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_unicode.prototype.init_elems = function(){
  var self = this;
  self.setup_elems_readonly(["textarea"]);
  self.setup_elems(My$arr_tag("button"), "onclick");
  return self;
};
My_test_unicode.prototype.init_handlers = function(){
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
      case "str2code":
      case "code2str":
      case "postset_utf16BE":
      case "postset_utf16LE":
      case "postset_utf8":
      case "postset_utf8IE":
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
My_test_unicode.prototype.clear = function(){
  var self = this;
  My$arr_tag("textarea").forEach(function(elem){
    elem.value = "";
  });
  return self;
};
My_test_unicode.prototype.str2code = function(){
  var self = this;
  var n = My$selectNum_id("select-n");
  var input = My$_id("textarea-input").value;
  var output_utf16BE = "";
  var output_utf16LE = "";
  var output_utf8 = "";
  var output_utf8IE = "";
  try{
    output_utf16BE = My_conv.str2code_utf16BE(input, n);
  }
  catch(e){
    output_utf16BE = e.message;
  }
  My$_id("textarea-output_utf16BE").value = output_utf16BE;
  try{
    output_utf16LE = My_conv.str2code_utf16LE(input, n);
  }
  catch(e){
    output_utf16LE = e.message;
  }
  My$_id("textarea-output_utf16LE").value = output_utf16LE;
  try{
    output_utf8 = My_conv.str2code_utf8(input, n);
  }
  catch(e){
    output_utf8 = e.message;
  }
  My$_id("textarea-output_utf8").value = output_utf8;
  try{
    output_utf8IE = My_conv.binary2code_utf8(input, n);
  }
  catch(e){
    output_utf8IE = e.message;
  }
  My$_id("textarea-output_utf8IE").value = output_utf8IE;
  return self;
};
My_test_unicode.prototype.code2str = function(){
  var self = this;
  var n = My$selectNum_id("select-n");
  var input = My$_id("textarea-input").value;
  var output_utf16BE = "";
  var output_utf16LE = "";
  var output_utf8 = "";
  var output_utf8IE = "";
  var arr_num_n = input.split(",");
  try{
    var arr_uint16 = My_conv.arr_num2arr_uint(arr_num_n, n, 16);
    output_utf16BE = My_conv.arr_uint16BE_2str(arr_uint16);
  }
  catch(e){
    output_utf16BE = e.message;
  }
  My$_id("textarea-output_utf16BE").value = output_utf16BE;
  try{
    var arr_uint16 = My_conv.arr_num2arr_uint(arr_num_n, n, 16);
    output_utf16LE = My_conv.arr_uint16LE_2str(arr_uint16);
  }
  catch(e){
    output_utf16LE = e.message;
  }
  My$_id("textarea-output_utf16LE").value = output_utf16LE;
  try{
    var arr_uint8 = My_conv.arr_num2arr_uint(arr_num_n, n, 8);
    output_utf8 = My_conv.arr_uint8_2str(arr_uint8);
  }
  catch(e){
    output_utf8 = e.message;
  }
  My$_id("textarea-output_utf8").value = output_utf8;
  try{
    var arr_uint8 = My_conv.arr_num2arr_uint(arr_num_n, n, 8);
    output_utf8IE = My_conv.arr_uint8_2binary(arr_uint8);
  }
  catch(e){
    output_utf8IE = e.message;
  }
  My$_id("textarea-output_utf8IE").value = output_utf8IE;
  return self;
};
My_test_unicode.prototype.postset_utf16BE = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_utf16BE").value;
  return self;
};
My_test_unicode.prototype.postset_utf16LE = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_utf16LE").value;
  return self;
};
My_test_unicode.prototype.postset_utf8 = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_utf8").value;
  return self;
};
My_test_unicode.prototype.postset_utf8IE = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_utf8IE").value;
  return self;
};
