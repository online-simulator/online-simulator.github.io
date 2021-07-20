// online-simulator.github.io

My_entry.original_main = function(){
};

My_entry.original_main.prototype.init_main = function(arr_prop){
  var self = this;
  self.constructors = {};
  self.setup_constructors();
  self.entry = {};
  self.make_instances(arr_prop);
  self.handlers = {};
  self.handlers.onload = function(e){
    var self = this;
    console.log("onload");
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    console.log("onbeforeunload");
    return self;
  };
  self.init_handlers();
  self.entry.$.bind_objs(self, self.handlers);
  self.elems = {};
  self.init_elems();
  return self;
};
My_entry.original_main.prototype.setup_constructors = function(){
  var self = this;
  self.constructors = self.constructors || {};
  for(var prop in My_entry){
    // global to local all
    var c = My_entry[prop];
    self.constructors[prop] = c;
//    if(c !== self.constructor && typeof c === "function"){
//    }
  }
  return self;
};
My_entry.original_main.prototype.make_instances = function(arr_prop){
  var self = this;
  self.entry = self.entry || {};
  var arr_prop = arr_prop || [];
  arr_prop.forEach(function(prop, i){
    var c = self.constructors[prop];
    if(typeof c === "function"){
      self.entry[prop] = new c();
    }
  });
  return self;
};
My_entry.original_main.prototype.init_elems = function(){
  var self = this;
  return self;
};
My_entry.original_main.prototype.init_handlers = function(){
  var self = this;
  return self;
};
My_entry.original_main.prototype.onload = function(e){
  var self = this;
  self.handlers.onload(e);
  self.entry.$.onbeforeunload(function(e){self.handlers.onbeforeunload(e);});
  return self;
};
