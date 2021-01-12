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
  self.setup_elems_readonly(["textarea"]);
  self.setup_elems(My$arr_tag("button"), "onclick");
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
      case "postset_uri":
      case "postset_uriCom":
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
My_test_encodeURI.prototype.clear = function(){
  var self = this;
  My$_id("textarea-input").value = "";
  My$_id("textarea-output_uri").value = "";
  My$_id("textarea-output_uriCom").value = "";
  return self;
};
My_test_encodeURI.prototype.uri2code = function(){
  var self = this;
  var input = My$_id("textarea-input").value;
  var output_uri = "";
  var output_uriCom = "";
  try{
    output_uri = encodeURI(input);
  }
  catch(e){
    output_uri = e.message;
  }
  My$_id("textarea-output_uri").value = output_uri;
  try{
    output_uriCom = encodeURIComponent(input);
  }
  catch(e){
    output_uriCom = e.message;
  }
  My$_id("textarea-output_uriCom").value = output_uriCom;
  return self;
};
My_test_encodeURI.prototype.code2uri = function(){
  var self = this;
  var input = My$_id("textarea-input").value;
  var output_uri = "";
  var output_uriCom = "";
  try{
    output_uri = decodeURI(input);
  }
  catch(e){
    output_uri = e.message;
  }
  My$_id("textarea-output_uri").value = output_uri;
  try{
    output_uriCom = decodeURIComponent(input);
  }
  catch(e){
    output_uriCom = e.message;
  }
  My$_id("textarea-output_uriCom").value = output_uriCom;
  return self;
};
My_test_encodeURI.prototype.postset_uri = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_uri").value;
  return self;
};
My_test_encodeURI.prototype.postset_uriCom = function(){
  var self = this;
  My$_id("textarea-input").value = My$_id("textarea-output_uriCom").value;
  return self;
};
