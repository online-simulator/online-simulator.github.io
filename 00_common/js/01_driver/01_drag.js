// online-simulator.github.io

My_entry.drag = function(id, opt_handlers){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.drag.prototype.init = function(id, opt_handlers){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$"]);
  self.id = id;
  self.elem = self.entry.$._id(self.id);
  self.elem_p = self.elem.parentElement;
  self.onevents = ["ondragstart", "ondragover", "ondragend"];
  self.touch = {
    ondragstart: "ontouchstart",
    ondragover: "ontouchmove",
    ondragend: "ontouchend"
  };
  /* 1.23.7 */
  self.point = {
    ondragstart: "onpointerdown",
    ondragover: "onpointermove",
    ondragend: "onpointerup"
  };
  self.handlers = {};
  self.handlers0 = {};
  self.set_handlers0();
  self.attach(opt_handlers);
  return self;
};
My_entry.drag.prototype.set_handlers0 = function(){
  var self = this;
  var $ = self.entry.$;
  var set_position = function(){
    var style_position = $.get_elem(self.elem, "position");
    if(!(style_position)){
      $.set_elem(self.elem, "position", "absolute");
    }
  };
  set_position();
  self.onevents.forEach(function(onevent){
    var handler = null;
    switch(onevent){
      case "ondragstart":
        handler = function(e){
          set_position();
          self.set_offset0(e);
        };
        break;
      case "ondragover":
        handler = function(e){
          $.set_elem(self.elem, "opacity", 0.5);
          self.set_offset(e);
        };
        break;
      case "ondragend":
        handler = function(e){
          self.set_offset(e);
          $.set_elem(self.elem, "opacity", null);
        };
        break;
      default:
        break;
    }
    self.handlers0[onevent] = handler;
  });
  return self;
};
My_entry.drag.prototype.get_handler = function(onevent, opt_handlers){
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
  };
  return _handler;
};
My_entry.drag.prototype.attach = function(opt_handlers){
  var self = this;
  self.entry.$.set_elem(self.elem, "draggable", true);
  self.onevents.forEach(function(onevent){
    var handler = self.get_handler(onevent, opt_handlers);
    self.entry.$.set_elem(self.elem, onevent, handler);
    self.entry.$.set_elem(self.elem, self.touch[onevent], handler);
//    self.entry.$.set_elem(self.elem, self.point[onevent], handler);  // 1.23.7
    self.handlers[onevent] = handler;
  });
  return self;
};
My_entry.drag.prototype.detach = function(){
  var self = this;
  self.entry.$.set_elem(self.elem, "draggable", false);
  self.onevents.forEach(function(onevent){
    self.entry.$.set_elem(self.elem, onevent, null);
    self.entry.$.set_elem(self.elem, self.touch[onevent], null);
//    self.entry.$.set_elem(self.elem, self.point[onevent], null);  // 1.23.7
    self.handlers[onevent] = null;
  });
  return self;
};
My_entry.drag.prototype.set_offset0 = function(e){
  var self = this;
  self.offset0 = self.get_offset();
  self.client0 = self.get_client(e);
  self.client = self.client0;  // for Firefox
  return self;
};
My_entry.drag.prototype.set_offset = function(e){
  var self = this;
  var client = self.get_client(e);
  if(client){
    var parent = self.elem_p;
    var offset0 = self.offset0;
    var client0 = self.client0;
    var x0 = client0.x;
    var y0 = client0.y;
    var x = client.x;
    var y = client.y;
    if(x === 0 && y === 0){
      x = self.client.x;
      y = self.client.y;
    }
    var left = parent.scrollLeft+offset0.left+(x-x0);
    var top = parent.scrollTop+offset0.top+(y-y0);
    self.entry.$.set_elem(self.elem, "left", left+"px");
    self.entry.$.set_elem(self.elem, "top", top+"px");
    self.client = client;  // for Firefox
  }
  return self;
};
My_entry.drag.prototype.get_offset = function(){
  var self = this;
  return {left: self.elem.offsetLeft, top: self.elem.offsetTop};
};
My_entry.drag.prototype.get_client = function(e){
  var self = this;
  var newE = e;
  if(e.touches){
    newE = (e.touches.length)? e.touches[0]: false;
  }
  var _client = (newE)? {x: newE.clientX, y: newE.clientY}: false;
  return _client;
};
