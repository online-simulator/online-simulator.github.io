// online-simulator.github.io

My_entry.original_workers = function(job, url, callbacks, n_thread){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.original_workers.prototype.init = function(job, url, callbacks, n_thread){
  var self = this;
  if(self.handler){
    self.handler.terminate();
    self.handler.re_init();
  }
  else if(window.Worker){
    self.set_job(job);
    self.set_url(url);
    self.set_callbacks(callbacks);
    self.handler = new My_entry.handler_worker(self.url, self.callbacks, n_thread);
    self.init_arr();
  }
  return self;
};
My_entry.original_workers.prototype.init_arr = function(){
  var self = this;
  self.arr_data_in = null;
  self.arr_data_out = null;
  return self;
};
My_entry.original_workers.prototype.stop = function(isClear){
  var self = this;
  if(self.handler){
    if(self.handler.isLocked){
      if(self.callbacks.final){
        self.callbacks.final();
      }
    }
    self.handler.terminate();
  }
  if(isClear){
    self.init_arr();
  }
  return self;
};
My_entry.original_workers.prototype.set_job = function(job){
  var self = this;
  self.job = job;
  return self;
};
My_entry.original_workers.prototype.set_url = function(url){
  var self = this;
  self.url = url;
  return self;
};
My_entry.original_workers.prototype.set_callbacks = function(callbacks){
  var self = this;
  self.callbacks = callbacks;
  return self;
};
My_entry.original_workers.prototype.set_n_thread = function(n_thread){
  var self = this;
  if(self.handler){
    self.handler.setter.n_thread(n_thread);
  }
  return self;
};
My_entry.original_workers.prototype.run = function(arr_data_in, useWorker){
  var self = this;
  if(self.handler && self.handler.isLocked) return false;
  arr_data_in.forEach(function(data_in, i){
    if(typeof data_in.i === "undefined"){
      data_in.i = i;
    }
  });
  self.arr_data_in = arr_data_in;
  self.arr_data_out = [];
  if(self.handler && useWorker){
    self.init();
    self.handler.run(self.arr_data_in);
  }
  else{
    self.arr_data_in.forEach(function(data_in){
      try{
        self.callbacks.onmessage({data: self.job(data_in)});
      }
      catch(e){
        self.callbacks.onerror(e);
      }
    });
  }
  return self;
};
