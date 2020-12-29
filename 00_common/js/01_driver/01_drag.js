function My_drag(id, opt_handler){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_drag.prototype.init = function(id, opt_handler){
  var self = this;
  self.id = id;
  self.elem = My$_id(self.id);
  self.elem_p = (self.elem)? self.elem.parentElement: self.elem;
  self.event = ["ondragstart", "ondragover", "ondragend"];
  self.touch = {
    ondragstart: "ontouchstart",
    ondragover: "ontouchmove",
    ondragend: "ontouchend"
  };
  self.handler = {};
  self.handler0 = {};
  self.set_handler0();
  self.add_handler(opt_handler);
  return self;
};
My_drag.prototype.set_handler0 = function(){
  var self = this;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "position", "absolute");
////////////////////////////////////////////////////////////
  self.event.forEach(function(event){
    switch(event){
      case "ondragstart":
        self.handler0[event] = function(e){
          self.set_offset0(e);
        };
        break;
      case "ondragover":
      case "ondragend":
        self.handler0[event] = function(e){
          self.set_offset(e);
        };
        break;
      default:
        break;
    }
  });
  return self;
};
My_drag.prototype.add_handler = function(opt_handler){
  var self = this;
  var opt_handler = opt_handler || {};
  var handler0 = self.handler0;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "draggable", true);
////////////////////////////////////////////////////////////
  self.event.forEach(function(event){
    var handler = function(e){
      if(handler0[event]){
        handler0[event](e);
      }
      if(opt_handler[event]){
        opt_handler[event](e);
      }
    }
////////////////////////////////////////////////////////////
    My$set_elem(self.elem, event, handler);
    My$set_elem(self.elem, self.touch[event], handler);
////////////////////////////////////////////////////////////
    self.handler[event] = handler;
  });
  return self;
};
My_drag.prototype.remove_handler = function(){
  var self = this;
////////////////////////////////////////////////////////////
  My$set_elem(self.elem, "draggable", false);
////////////////////////////////////////////////////////////
  self.event.forEach(function(event){
////////////////////////////////////////////////////////////
    My$set_elem(self.elem, event, null);
    My$set_elem(self.elem, self.touch[event], null);
////////////////////////////////////////////////////////////
    self.handler[event] = null;
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
