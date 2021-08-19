// online-simulator.github.io

My_entry.original_worker = function(){
};

My_entry.original_worker.prototype.init_worker = function(){
  var self = this;
  if(self.handler_worker){
    self.handler_worker.terminate();
    self.handler_worker.re_init();
  }
  else if(window.Worker){
    self.set_job_worker();
    self.set_url_worker();
    self.callbacks_worker = {};
    self.set_callbacks_worker();
    self.entry.$.bind_objs(self, self.callbacks_worker);
    self.handler_worker = new self.constructors.handler_worker(self.url_worker, self.callbacks_worker);
    self.init_arr_worker();
  }
  return self;
};
My_entry.original_worker.prototype.init_arr_worker = function(){
  var self = this;
  self.arr_data_in = null;
  self.arr_data_out = null;
  return self;
};
My_entry.original_worker.prototype.stop_worker = function(isClear){
  var self = this;
  if(self.handler_worker){
    if(self.handler_worker.isLocked){
      if(self.callbacks_worker.final){
        self.callbacks_worker.final();
      }
    }
    self.handler_worker.terminate();
  }
  if(isClear){
    self.init_arr_worker();
  }
  return self;
};
My_entry.original_worker.prototype.set_job_worker = function(){
  var self = this;
  self.job_worker = My_entry.job_imported;
  return self;
};
My_entry.original_worker.prototype.set_url_worker = function(){
  var self = this;
  self.url_worker = "js/for_url.js";
  return self;
};
My_entry.original_worker.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;
    if(len_out === len_in){
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker(true);
    return self;
  };
  return self;
};
My_entry.original_worker.prototype.set_n_thread_worker = function(n_thread){
  var self = this;
  if(self.handler_worker){
    self.handler_worker.setter.n_thread(n_thread);
  }
  return self;
};
My_entry.original_worker.prototype.run_worker = function(arr_data_in, useWorker){
  var self = this;
  if(self.handler_worker && self.handler_worker.isLocked) return false;
  arr_data_in.forEach(function(data_in, i){
    if(typeof data_in.i === "undefined"){
      data_in.i = i;
    }
  });
  self.arr_data_in = arr_data_in;
  self.arr_data_out = [];
  if(self.handler_worker && useWorker){
    self.init_worker();
    self.handler_worker.run(self.arr_data_in);
  }
  else{
    self.arr_data_in.forEach(function(data_in){
      try{
        self.callbacks_worker.onmessage({data: self.job_worker(data_in)});
      }
      catch(e){
        self.callbacks_worker.onerror(e);
      }
    });
  }
  return self;
};
