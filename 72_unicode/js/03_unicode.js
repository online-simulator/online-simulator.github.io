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
  My_setup_elems_readonly$("textarea");
  My_setup_elems$_tag("button", self.handlers, "onclick");
  self.elems = My_get_elems$("input,textarea");
  self.arr_sw_out = ["utf16BE", "utf16LE", "utf8", "utf8IE"];
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
        self[elem.id]();
        break;
      case "postset_utf16BE":
      case "postset_utf16LE":
      case "postset_utf8":
      case "postset_utf8IE":
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
My_test_unicode.prototype.clear = function(){
  var self = this;
  My$arr("input,textarea").forEach(function(elem){
    elem.value = "";
  });
  return self;
};
My_test_unicode.prototype.str2code_sw = function(sw){
  var self = this;
  var n = My$selectNum_id("select-n");
  var input = self.elems["textarea-input"].value;
  var output = "";
  try{
    switch(sw){
      case "utf16BE":
      case "utf16LE":
      case "utf8":
        var title = (sw === "utf8")? "バイト数: ": "ユニット数: ";
        output = My_conv["str2code_"+sw](input, n);
        self.elems["input-"+sw].value = title+output.length;
        break;
      case "utf8IE":
        output = My_conv.binary2code_utf8(input, n);
        break;
      default:
        break;
    }
  }
  catch(e){
    output = e.message;
  }
  self.elems["textarea-output_"+sw].value = output;
  return self;
};
My_test_unicode.prototype.str2code = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.str2code_sw(sw);
  });
  return self;
};
My_test_unicode.prototype.code2str_sw = function(sw){
  var self = this;
  var n = My$selectNum_id("select-n");
  var input = self.elems["textarea-input"].value;
  var output = "";
  var arr_num_n = input.split(",");
  try{
    switch(sw){
      case "utf16BE":
      case "utf16LE":
      case "utf8":
        var mc = sw.match(/^utf(\d+)(.*)$/);
        var n_uint = mc[1];
        var opt = mc[2];
        var title = "文字数: ";
        var arr_uint_ = My_conv.arr_num2arr_uint(arr_num_n, n, n_uint);
        output = My_conv["arr_uint"+n_uint+opt+"_2str"](arr_uint_);
        self.elems["input-"+sw].value = title+output.length;
        break;
      case "utf8IE":
        var arr_uint8 = My_conv.arr_num2arr_uint(arr_num_n, n, 8);
        output = My_conv.arr_uint8_2binary(arr_uint8);
        break;
      default:
        break;
    }
  }
  catch(e){
    output = e.message;
  }
  self.elems["textarea-output_"+sw].value = output;
  return self;
};
My_test_unicode.prototype.code2str = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.code2str_sw(sw);
  });
  return self;
};
My_test_unicode.prototype.postset_sw = function(sw){
  var self = this;
  self.elems["textarea-input"].value = self.elems["textarea-output_"+sw].value;
  return self;
};
