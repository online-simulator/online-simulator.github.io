// online-simulator.github.io

function My_original_main(){
}

My_original_main.prototype.init_main = function(args){
  var self = this;
  self.handlers = {};
  self.handlers.onload = function(e){
    var self = this;
    console.log("onload");
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    console.log("onbeforeunload");
    return self;
  };
  self.init_handlers.apply(self, arguments);
  My$.bind_objs(self, self.handlers);
  self.elems = {};
  self.init_elems.apply(self, arguments);
  return self;
};
My_original_main.prototype.init_elems = function(){
  var self = this;
  return self;
};
My_original_main.prototype.init_handlers = function(){
  var self = this;
  return self;
};
My_original_main.prototype.onload = function(args){
  var self = this;
  self.handlers.onload.apply(self, arguments);
  document.body.onbeforeunload = function(e){
    self.handlers.onbeforeunload(e);
  };
  return self;
};
