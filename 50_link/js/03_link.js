// online-simulator.github.io

My_entry.test_link = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_link, My_entry.original_main);

My_entry.test_link.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  self.counter = 0;
  self.handler_link = null;
  return self;
};
My_entry.test_link.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  return self;
};
My_entry.test_link.prototype.init_handlers = function(){
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
My_entry.test_link.prototype.create = function(id_output, isInsertBefore){
  var self = this;
  var n = self.counter++;
  var name = self.entry.$._id("input-name").value+n;
  var json = {p: {id: "wrapper-link"}, a: {id: "a"+n, it: "download-txt by double-click"+n}, name: name, ext: "txt", isIB: isInsertBefore};
  json.o = (id_output)? {id: id_output}: {tag: "input"};
  self.handler_link = new self.constructors.handler_link(json);
  return self;
};
