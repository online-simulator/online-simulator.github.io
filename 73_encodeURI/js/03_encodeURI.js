// online-simulator.github.io

function My_test_encodeURI(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_encodeURI, My_original_main);

My_test_encodeURI.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_encodeURI.prototype.init_elems = function(){
  var self = this;
  My$.setup_elems_readonly$("textarea");
  My$.setup_elems$_tag("button", self.handlers, "onclick");
  self.arr_sw_out = ["uri", "uriCom"];
  return self;
};
My_test_encodeURI.prototype.init_handlers = function(){
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
      case "uri2code":
      case "code2uri":
        self[elem.id]();
        break;
      case "postset_uri":
      case "postset_uriCom":
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
My_test_encodeURI.prototype.clear = function(){
  var self = this;
  My$.arr("textarea").forEach(function(elem){
    elem.value = "";
  });
  return self;
};
My_test_encodeURI.prototype.uri2code_sw = function(sw){
  var self = this;
  var input = My$._id("textarea-input").value;
  var output = "";
  try{
    output = (sw === "uri")? encodeURI(input): encodeURIComponent(input);
  }
  catch(e){
    output = e.message;
  }
  My$._id("textarea-output_"+sw).value = output;
  return self;
};
My_test_encodeURI.prototype.uri2code = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.uri2code_sw(sw);
  });
  return self;
};
My_test_encodeURI.prototype.code2uri_sw = function(sw){
  var self = this;
  var input = My$._id("textarea-input").value;
  var output = "";
  try{
    output = (sw === "uri")? decodeURI(input): decodeURIComponent(input);
  }
  catch(e){
    output = e.message;
  }
  My$._id("textarea-output_"+sw).value = output;
  return self;
};
My_test_encodeURI.prototype.code2uri = function(){
  var self = this;
  self.arr_sw_out.forEach(function(sw){
    self.code2uri_sw(sw);
  });
  return self;
};
My_test_encodeURI.prototype.postset_sw = function(sw){
  var self = this;
  My$._id("textarea-input").value = My$._id("textarea-output_"+sw).value;
  return self;
};
