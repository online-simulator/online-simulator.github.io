// online-simulator.github.io

My_entry.handler_worker = function(url, callbacks, n_thread){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_worker.prototype.init = function(url, callbacks, n_thread){
  var self = this;
  // define
  // setter function
  self.setter = {
    url: function(url){
      self.set_url(url);
    },
    n_thread: function(n_thread){
      self.set_n_thread(n_thread);
    },
    callbacks: function(callbacks){
      self.callbacks = callbacks || {};
      self.workers.forEach(function(worker){
        if(worker){
          for(var onevent in self.callbacks){
            worker[onevent] = self.callbacks[onevent];
          }
        }
      });
    }
  };
  // getter function
  self.getter = {
    url: function(){return self.url;}
  };
  // initialize
  self.isLocked = false;
  self.hasWorker = (window.Worker)? true: false;
  self.workers = [];
  self.setter.url(url);
  self.setter.n_thread(n_thread);
  for(var i=0; i<self.n_thread; ++i){
    self.workers[i] = new Worker(self.url);
  }
  self.setter.callbacks(callbacks);
  return self;
};
My_entry.handler_worker.prototype.re_init = function(){
  var self = this;
  self.init(self.url, self.callbacks, self.n_thread);
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
My_entry.handler_worker.prototype.set_n_thread = function(n_thread){
  var self = this;
  self.n_thread = n_thread || 1;
  self.terminate();
  return self;
};
My_entry.handler_worker.prototype.run = function(arr_data){
  var self = this;
  if(!(self.hasWorker) || self.isLocked) return false;
  self.isLocked = true;
  arr_data.forEach(function(data, i){
    var worker = self.workers[i%self.n_thread];
    if(worker){  // check null
      worker.postMessage(data);
    }
  });
  return self;
};
My_entry.handler_worker.prototype.terminate = function(){
  var self = this;
  self.workers.forEach(function(worker){
    if(worker){
      worker.terminate();
    }
  });
  self.workers = [];
  self.isLocked = false;
  return self;
};
