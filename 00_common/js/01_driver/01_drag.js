function My_drag(id, opt_handlers){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_drag.prototype.init = function(id, opt_handlers){
  var self = this;
  self.id = id;
  self.elem = My$_id(self.id);
  self.elem_p = (self.elem)? self.elem.parentElement: self.elem;
  self.onevent = ["ondragstart", "ondragover", "ondragend"];
  self.touch = {
    ondragstart: "ontouchstart",
    ondragover: "ontouchmove",
    ondragend: "ontouchend"
  };
  self.handlers = {};
  self.handlers0 = {};
  self.set_handlers0();
  self.add_handler(opt_handlers);
  return self;
};
My_drag.prototype.set_handlers0 = function(){
  var self = this;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "position", "absolute");
////////////////////////////////////////////////////////////
  self.onevent.forEach(function(onevent){
    var handler = null;
    switch(onevent){
      case "ondragstart":
        handler = function(e){
          self.set_offset0(e);
        };
        break;
      case "ondragover":
      case "ondragend":
        handler = function(e){
          self.set_offset(e);
        };
        break;
      default:
        break;
    }
    self.handlers0[onevent] = handler;
  });
  return self;
};
My_drag.prototype.get_handler = function(onevent, opt_handlers){
  var self = this;
  var _handler = null;
  var handlers0 = self.handlers0;
  _handler = function(e){
    if(handlers0[onevent]){
      handlers0[onevent](e);
    }
    if(opt_handlers && opt_handlers[onevent]){
      opt_handlers[onevent](e);
    }
  }
  return _handler;
};
My_drag.prototype.add_handler = function(opt_handlers){
  var self = this;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "draggable", true);
////////////////////////////////////////////////////////////
  self.onevent.forEach(function(onevent){
    var handler = self.get_handler(onevent, opt_handlers);
////////////////////////////////////////////////////////////
    My$set_elem(self.elem, onevent, handler);
    My$set_elem(self.elem, self.touch[onevent], handler);
////////////////////////////////////////////////////////////
    self.handlers[onevent] = handler;
  });
  return self;
};
My_drag.prototype.remove_handler = function(){
  var self = this;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "draggable", false);
////////////////////////////////////////////////////////////
  self.onevent.forEach(function(onevent){
////////////////////////////////////////////////////////////
    My$set_elem(self.elem, onevent, null);
    My$set_elem(self.elem, self.touch[onevent], null);
////////////////////////////////////////////////////////////
    self.handlers[onevent] = null;
  });
  return self;
};
My_drag.prototype.set_offset0 = function(e){
  var self = this;
  self.offset0 = self.get_offset();
  self.client0 = self.get_client(e);
  return self;
};
My_drag.prototype.set_offset = function(e){
  var self = this;
  var client = self.get_client(e);
  if(client){
    var parent = self.elem_p;
    var offset0 = self.offset0;
    var client0 = self.client0;
    var left = parent.scrollLeft+offset0.left;
        left += (client.x-client0.x);
    var top = parent.scrollTop+offset0.top;
        top += (client.y-client0.y);
////////////////////////////////////////////////////////////
    My$set_elem(self.elem, "left", left+"px");
    My$set_elem(self.elem, "top", top+"px");
////////////////////////////////////////////////////////////
  }
  return self;
};
My_drag.prototype.get_offset = function(){
  var self = this;
  return {left: self.elem.offsetLeft, top: self.elem.offsetTop};
};
My_drag.prototype.get_client = function(e){
  var self = this;
  var e = e;
  if(e.touches){
    e = (e.touches.length)? e.touches[0]: false;
  }
  var _client = (e)? {x: e.clientX, y: e.clientY}: false;
  return _client;
};
