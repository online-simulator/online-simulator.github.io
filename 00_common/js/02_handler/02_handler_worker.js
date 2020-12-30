function My_handler_worker(url, handlers){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_worker.prototype.init = function(url, handlers){
  var self = this;
  // define
  // setter function
  self.setter = {
    url: function(url){
      self.set_url(url);
    },
    handlers: function(handlers){
      self.handlers = handlers || {};
    }
  };
  // getter function
  self.getter = {
    url: function(){return self.url;}
  };
  // initialize
  self.hasWorker = (window.Worker)? true: false;
  self.setter.url(url);
  self.setter.handlers(handlers);
  // re-initialize
  self.re_init.apply(self, arguments);
  return self;
};
My_handler_worker.prototype.re_init = function(){
  var self = this;
  self.arr_worker = [];
  self.isLocked = false;
  return self;
};
My_handler_worker.prototype.set_url = function(url){
  var self = this;
  switch(typeof url){
    case "string":
      self.url = url;
      break;
    case "function":
////////////////////////////////////////////////////////////
      self.url = My_conv.fn2url(url);
////////////////////////////////////////////////////////////
      break;
    default:
      self.url = null;
      break;
  }
  return self;
};
My_handler_worker.prototype.run = function(arr_data){
  var self = this;
  if(!(self.hasWorker) || self.isLocked) return false;
  self.isLocked = true;
  var url = self.url;
  var handlers = self.handlers;
  arr_data.forEach(function(data){
    var worker = new Worker(url);
    self.arr_worker.push(worker);
    for(var onevent in handlers){
      worker[onevent] = handlers[onevent];
    }
    worker.postMessage(data);
  });
  return self;
};
My_handler_worker.prototype.stop = function(){
  var self = this;
  self.arr_worker.forEach(function(worker){
    worker.terminate();
  });
  self.re_init();
  return self;
};
