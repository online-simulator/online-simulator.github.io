function My_handler_drag(id_drag, id_checkbox, opt_handlers){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_drag.prototype.init = function(id_drag, id_checkbox, opt_handlers){
  var self = this;
  self.handlers = opt_handlers;
  self.drag = new My_drag(id_drag, opt_handlers);
  self.checkbox = My$_id(id_checkbox);
  return self;
};
My_handler_drag.prototype.switch = function(opt_handlers){
  var self = this;
  if(self.checkbox.checked){
    self.drag.add_handlers(opt_handlers || self.handlers);
  }
  else{
    self.drag.remove_handlers();
  }
  return self;
};
