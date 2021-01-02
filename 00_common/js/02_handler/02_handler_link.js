function My_handler_link(json){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_link.prototype.init = function(json){
  var self = this;
  self.isClicked = false;
  self.p = json.p;
  self.a = json.a;
  self.o = json.o;
  self.browser = new My_browser();
  self.link = new My_link(self.a.id, json.name);
  self.io = new My_io();
  self.handler = null;
  self.set_handler();
  self.elem_p = My$_id(self.p.id);
  self.elem_o = (self.o)? My$_id(self.o.id): null;
  self.elems = {};
  self.create_elems(json.isIB);
  self.save_text();
  return self;
};
My_handler_link.prototype.save_text = function(isOnclick){
  var self = this;
  var text = (self.elem_o)? self.io.read_text(self.elem_o): "";
  self.link.set_url(text);
  self.browser.save_file(self.link, isOnclick);
  return self;
};
My_handler_link.prototype.set_handler = function(type){
  var self = this;
  var handler = null;
  switch(type){
    default:
      handler = function(isClicked){
        var self = this;
        self.save_text(isClicked);
        return self;
      };
      break;
  }
  self.handler = handler;
  My$bind(self, self.handler);
  return self;
};
My_handler_link.prototype.create_elem_a = function(){
  var self = this;
  self.elems.a = document.createElement("a");
  self.elems.a.id = self.a.id;
  self.elems.a.textContent = self.a.it;
  self.elems.a.onclick = function(e){
    if(self.isClicked){
      self.isClicked = false;
      if(self.browser.sws.isIE){
        self.handler(true);
        e.preventDefault();
      }
    }
    else{
      self.isClicked = true;
      self.handler();
      e.preventDefault();
    }
//    e.stopPropagation();
  };
  return self;
};
My_handler_link.prototype.create_elem_o = function(){
  var self = this;
  if(!self.elem_o && self.o){
    self.elems.o = document.createElement(self.o.tag || "span");
    if(self.o.id){
      self.elems.o.id = self.o.id;
    }
    self.elem_o = self.elems.o;
  }
  if(self.elem_o){
    self.elem_o.onchange = function(e){
      self.handler();
    };
  }
  return self;
};
My_handler_link.prototype.create_elems = function(isIB){
  var self = this;
  self.create_elem_a();
  self.create_elem_o();
  var add = (isIB)? My$add_first_elem: My$add_last_elem;
  for(var prop in self.elems){
    add(self.elems[prop], self.elem_p);
  }
  return self;
};
