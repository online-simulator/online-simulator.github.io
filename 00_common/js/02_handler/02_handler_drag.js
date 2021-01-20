// online-simulator.github.io

My_entry.handler_drag = function(id_drag, id_checkbox, opt_handlers){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_drag.prototype.init = function(id_drag, id_checkbox, opt_handlers){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$"]);
  self.handlers = opt_handlers;
  self.drag = new self.constructors.drag(id_drag, opt_handlers);
  self.checkbox = self.entry.$._id(id_checkbox);
  return self;
};
My_entry.handler_drag.prototype.switch = function(opt_handlers){
  var self = this;
  if(self.checkbox.checked){
    self.drag.add_handlers(opt_handlers || self.handlers);
  }
  else{
    self.drag.remove_handlers();
  }
  return self;
};
