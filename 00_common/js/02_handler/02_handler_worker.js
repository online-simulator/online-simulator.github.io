// online-simulator.github.io

My_entry.handler_worker = function(url, callbacks){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_worker.prototype.init = function(url, callbacks){
  var self = this;
  // define
  // setter function
  self.setter = {
    url: function(url){
      self.set_url(url);
    },
    callbacks: function(callbacks){
      self.callbacks = callbacks || {};
      if(self.worker){
        for(var onevent in self.callbacks){
          self.worker[onevent] = self.callbacks[onevent];
        }
      }
    }
  };
  // getter function
  self.getter = {
    url: function(){return self.url;}
  };
  // initialize
  self.isLocked = false;
  self.hasWorker = (window.Worker)? true: false;
  self.setter.url(url);
  self.worker = new Worker(self.url);
  self.setter.callbacks(callbacks);
  return self;
};
My_entry.handler_worker.prototype.re_init = function(){
  var self = this;
  self.init(self.url, self.callbacks);
  return self;
};
My_entry.handler_worker.prototype.set_url = function(url){
  var self = this;
  switch(typeof url){
    case "string":
      self.url = url;
      break;
    default:
      self.url = null;
      break;
  }
  return self;
};
My_entry.handler_worker.prototype.run = function(arr_data){
  var self = this;
  if(!(self.hasWorker) || self.isLocked) return false;
  self.isLocked = true;
  arr_data.forEach(function(data){
    if(self.worker){  // check null
      self.worker.postMessage(data);
    }
  });
  return self;
};
My_entry.handler_worker.prototype.terminate = function(){
  var self = this;
  if(self.worker){
    self.worker.terminate();
  }
  self.worker = null;
  self.isLocked = false;
  return self;
};
