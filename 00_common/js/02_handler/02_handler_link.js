// online-simulator.github.io

function My_handler_link(json){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_link.prototype.init = function(json){
  var self = this;
  self.setter = {};
  self.setter.callback = function(callback){
    self.callback = callback || function(){};
  };
  self.setter.callback();
  self.p = json.p;
  self.a = json.a;
  self.o = json.o;
  self.browser = new My_browser();
  self.link = new My_link(self.a.id, json.name, json.ext);
  self.io = new My_io();
  self.elem_p = My$_id(self.p.id);
  self.elem_o = (self.o)? My$_id(self.o.id): null;
  self.elems = {};
  self.create_elems(json.isIB);
  self.isClicked = false;
  self.handler = null;
  self.set_handler();
  self.handler();
  return self;
};
My_handler_link.prototype.save_content = function(isOnclick){
  var self = this;
  var content = (self.elem_o)? self.io.read_text(self.elem_o): self.callback();
  self.link.set_url(content);
  self.browser.save_file(self.link, isOnclick);
  return self;
};
My_handler_link.prototype.set_handler = function(){
  var self = this;
  var handler = function(isClicked){
    var self = this;
    self.save_content(isClicked);
    return self;
  };
  self.handler = handler.bind(self);
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
        e.preventDefault();
        self.handler(true);
      }
    }
    else{
      self.isClicked = true;
      e.preventDefault();
      self.handler();
      setTimeout(function(){
        self.isClicked = false;
      }, 1000);
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
