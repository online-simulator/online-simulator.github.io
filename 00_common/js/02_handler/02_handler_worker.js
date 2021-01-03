// online-simulator.github.io

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
      if(self.worker){
        for(var onevent in self.handlers){
          self.worker[onevent] = self.handlers[onevent];
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
  self.setter.handlers(handlers);
  return self;
};
My_handler_worker.prototype.re_init = function(){
  var self = this;
  self.init(self.url, self.handlers);
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
  arr_data.forEach(function(data){
    self.worker.postMessage(data);
  });
  return self;
};
My_handler_worker.prototype.terminate = function(isReset){
  var self = this;
  self.worker.terminate();
  self.worker = null;
  self.isLocked = false;
  if(isReset){
    self.re_init();
  }
  return self;
};
