function My_drag(id, handler){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_drag.prototype.init = function(id, opt_handler){
  var self = this;
  self.id = id;
  self.dom = My$_id(self.id);
  My$set(self.id, "position", "absolute");
  My$set(self.id, "draggable", true);
  ["ondragstart", "ondragover", "ondragend"].forEach(function(event){
    switch(event){
      case "ondragstart":
        self.dom[event] = function(e){
          self.client0 = self.get_client(e);
          self.offset0 = self.get_offset();
          if(opt_handler && opt_handler[event]){
            opt_handler[event](e);
          }
        };
        self.dom["touchstart"] = self.dom[event];
        break;
      case "ondragover":
        self.dom[event] = function(e){
          var client = self.get_client(e);
          var left = (self.offset0.left+(client.x-self.client0.x))+"px";
          var top = (self.offset0.top+(client.y-self.client0.y))+"px";
          My$set(self.id, "left", left);
          My$set(self.id, "top", top);
          if(opt_handler && opt_handler[event]){
            opt_handler[event](e);
          }
        };
        self.dom["touchmove"] = self.dom[event];
        break;
      case "ondragend":
        self.dom[event] = function(e){
          var client = self.get_client(e);
          var left = (self.offset0.left+(client.x-self.client0.x))+"px";
          var top = (self.offset0.top+(client.y-self.client0.y))+"px";
          My$set(self.id, "left", left);
          My$set(self.id, "top", top);
          if(opt_handler && opt_handler[event]){
            opt_handler[event](e);
          }
        };
        self.dom["touchend"] = self.dom[event];
        break;
      default:
        break;
    }
  });
  return self;
};
My_drag.prototype.get_offset = function(){
  var self = this;
  return {left: self.dom.offsetLeft, top: self.dom.offsetTop};
};
My_drag.prototype.get_client = function(e){
  var self = this;
  return {x: e.clientX, y: e.clientY};
};
