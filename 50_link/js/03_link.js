// online-simulator.github.io

function My_test_link(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_link, My_original_main);

My_test_link.prototype.init = function(){
  var self = this;
  self.counter = 0;
  self.handler_link = null;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_link.prototype.init_elems = function(){
  var self = this;
  My$.setup_elems$_tag("button", self.handlers, "onclick");
  return self;
};
My_test_link.prototype.init_handlers = function(){
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
      case "create":
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
My_test_link.prototype.create = function(id_output, isInsertBefore){
  var self = this;
  var n = self.counter++;
  var name = My$._id("input-name").value+n;
  var json = {p: {id: "wrapper-link"}, a: {id: "a"+n, it: "download-txt by double-click"+n}, name: name, ext: "txt", isIB: isInsertBefore};
  json.o = (id_output)? {id: id_output}: {tag: "input"};
  self.handler_link = new My_handler_link(json);
  return self;
};
