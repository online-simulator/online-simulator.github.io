// online-simulator.github.io

function My_original_worker(){
}

My_original_worker.prototype.init_worker = function(){
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
    My$.bind_objs(self, self.callbacks_worker);
    self.handler_worker = new My_handler_worker(self.url_worker, self.callbacks_worker);
  }
  return self;
};
My_original_worker.prototype.stop_worker = function(){
  var self = this;
  if(self.handler_worker){
    if(self.handler_worker.isLocked){
    }
    self.handler_worker.terminate();
  }
  return self;
};
My_original_worker.prototype.set_job_worker = function(){
  var self = this;
  self.job_worker = My_job_imported;
  return self;
};
My_original_worker.prototype.set_url_worker = function(){
  var self = this;
  self.url_worker = "js/for_url.js";
  return self;
};
My_original_worker.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker();
    return self;
  };
  return self;
};
My_original_worker.prototype.run_worker = function(arr_data_in, useWorker){
  var self = this;
  if(self.handler_worker && self.handler_worker.isLocked) return false;
  self.arr_data_in = arr_data_in;
  self.arr_data_out = [];
  var hasWorker = (self.handler_worker && useWorker);
  if(hasWorker){
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
