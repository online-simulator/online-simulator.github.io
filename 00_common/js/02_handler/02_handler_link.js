function My_handler_link(json){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_link.prototype.init = function(json){
  var self = this;
  self.p = json.p;
  self.a = json.a;
  self.o = json.o;
  self.browser = new My_browser();
  self.link = new My_link(self.a.id, json.name);
  self.io = new My_io();
  self.elem_p = My$_id(self.p.id);
  self.elem_o = (self.o)? My$_id(self.o.id): null;
  self.elem = {};
  self.create_elem(json.isIB);
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
My_handler_link.prototype.create_elem = function(isIB){
  var self = this;
  self.elem.a = document.createElement("a");
  self.elem.a.id = self.a.id;
  self.elem.a.textContent = self.a.it;
  self.elem.a.onclick = function(e){
    self.save_text(true);
    if(self.browser.sw.isIE){
      e.preventDefault();
    }
//    e.stopPropagation();
  };
  if(!self.elem_o && self.o){
    self.elem.o = document.createElement(self.o.tag || "span");
    if(self.o.id){
      self.elem.o.id = self.o.id;
    }
    self.elem_o = self.elem.o;
  }
  if(self.elem_o){
/*
    self.elem_o.onchange = My$bind(self, function(){
      var self = this;
      self.save_text();
      return self;
    });
*/
    self.elem_o.onchange = function(e){
      self.save_text();
    };
  }
  var add = (isIB)? My$add_first_elem: My$add_last_elem;
  for(var prop in self.elem){
    add(self.elem[prop], self.elem_p);
  }
  return self;
};
