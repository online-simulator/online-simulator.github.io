// online-simulator.github.io

function My_handler_baseview(arr_n, prop_set, prop_get){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_baseview.prototype.init = function(arr_n, prop_set, prop_get){
  var self = this;
  self.arr_buffer = [];
  self.arr_view = [];
  arr_n.forEach(function(n){
    var n = Number(n);
    if(!isNaN(n)){
      self.arr_buffer[n] = new ArrayBuffer(n);
      self.arr_view[n] = new DataView(self.arr_buffer[n], 0);
    }
  });
  self.make_setter(prop_set);
  self.make_getter(prop_get);
  return self;
};
My_handler_baseview.prototype.make_setter = function(prop_){
  var self = this;
  self.set = [];
  self.arr_view.forEach(function(view, n){
    var prop = (prop_ || "setInt")+String(n*8);
    self.set[n] = function(){
      return view[prop].apply(view, arguments);
    };
  });
  return self;
};
My_handler_baseview.prototype.make_getter = function(prop_){
  var self = this;
  self.get = [];
  self.arr_view.forEach(function(view, n){
    var prop = (prop_ || "getInt")+String(n*8);
    self.get[n] = function(){
      return view[prop].apply(view, arguments);
    };
  });
  return self;
};
