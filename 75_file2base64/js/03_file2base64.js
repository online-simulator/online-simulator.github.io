// online-simulator.github.io

My_entry.test_file2base64 = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_file2base64, My_entry.original_main);

My_entry.test_file2base64.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  return self;
};
My_entry.test_file2base64.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems_readonly$("textarea");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  return self;
};
My_entry.test_file2base64.prototype.init_handlers = function(){
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
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    switch(elem.id){
      case "input-file":
        self.convert(elem);
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_file2base64.prototype.convert = function(elem){
  var self = this;
  var $ = self.entry.$;
  var elemo = self.entry.$._id("textarea-output");
  var file = $.readFile_elem(elem, /^/, function(e){
    var base64 = e.target.result;
    elemo.value = base64;
  });
  if(!(file)){
    elem.value = null;
    elemo.value = "input-file not found";
  }
  return self;
};
