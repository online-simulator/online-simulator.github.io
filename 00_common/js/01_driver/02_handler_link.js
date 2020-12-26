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
  self.dom_p = My$_id(self.p.id);
  self.dom_o = (self.o)? My$_id(self.o.id): null;
  self.dom = {};
  self.create_dom(json.isIB);
  self.save_text();
  return self;
};
My_handler_link.prototype.save_text = function(isOnclick){
  var self = this;
  var text = (self.dom_o)? self.io.read_text(self.dom_o): "";
  self.link.set_url(text);
  self.browser.save_file(self.link, isOnclick);
  return self;
};
My_handler_link.prototype.create_dom = function(isIB){
  var self = this;
  self.dom.a = document.createElement("a");
  self.dom.a.id = self.a.id;
  self.dom.a.innerText = self.a.it;
  self.dom.a.onclick = function(){
    self.save_text(true);
  };
  if(!self.dom_o && self.o){
    self.dom.o = document.createElement(self.o.tag || "span");
    if(self.o.id){
      self.dom.o.id = self.o.id;
    }
    self.dom_o = self.dom.o;
  }
  if(self.dom_o){
/*
    self.dom_o.onchange = My$bind(self, function(){
      var self = this;
      self.save_text();
      return self;
    });
*/
    self.dom_o.onchange = function(){
      self.save_text();
    };
  }
  var add = (isIB)? My$add_first_dom: My$add_last_dom;
  for(var prop in self.dom){
    add(self.dom_p, self.dom[prop]);
  }
  return self;
};
