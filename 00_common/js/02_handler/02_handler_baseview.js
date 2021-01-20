// online-simulator.github.io

My_entry.handler_baseview = function(arr_prop_baseview){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_baseview.prototype.init = function(arr_prop_baseview){
  var self = this;
  self.arr_buffer = [];
  self.arr_view = [];
  self.set = [];
  self.get = [];
  arr_prop_baseview.forEach(function(Prop, n){
    self.arr_buffer[n] = new ArrayBuffer(n);
    self.arr_view[n] = new DataView(self.arr_buffer[n], 0);
    var view = self.arr_view[n];
    var Prop = (Prop || "Int")+String(n*8);
    self.set[n] = function(){
      return view["set"+Prop].apply(view, arguments);
    };
    self.get[n] = function(){
      return view["get"+Prop].apply(view, arguments);
    };
  });
  return self;
};
