function My_handler_dom(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_dom.prototype.init = function(){
  var self = this;
  return self;
};
My_handler_dom.prototype.init_drag = function(id_drag, id_checkbox, opt_handler){
  var self = this;
  self.handler = opt_handler;
  self.drag = new My_drag(id_drag, opt_handler);
  self.checkbox = My$_id(id_checkbox);
  return self;
};
My_handler_dom.prototype.drag_checkbox = function(opt_handler){
  var self = this;
  if(self.checkbox.checked){
    self.drag.add_handler(opt_handler || self.handler);
  }
  else{
    self.drag.remove_handler();
  }
  return self;
};
