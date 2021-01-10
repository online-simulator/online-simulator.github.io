// online-simulator.github.io

function My_handler_baseview(arr_n, prop_set, prop_get){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_baseview.prototype.init = function(arr_base){
  var self = this;
  self.arr_buffer = [];
  self.arr_view = [];
  self.set = [];
  self.get = [];
  arr_base.forEach(function(base){
    var n = Number(base.n);
    if(!isNaN(n)){
      self.arr_buffer[n] = new ArrayBuffer(n);
      self.arr_view[n] = new DataView(self.arr_buffer[n], 0);
      var view = self.arr_view[n];
      var prop_set = ("set"+(base.prop || "Int"))+String(n*8);
      var prop_get = ("get"+(base.prop || "Int"))+String(n*8);
      self.set[n] = function(){
        return view[prop_set].apply(view, arguments);
      };
      self.get[n] = function(){
        return view[prop_get].apply(view, arguments);
      };
    }
  });
  return self;
};
