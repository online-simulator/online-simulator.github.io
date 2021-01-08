// online-simulator.github.io

My_handler_wave.prototype.init_worker = function(){
  var self = this;
  if(self.handler_worker){
    self.handler_worker.terminate();
    self.handler_worker.re_init();
  }
  else if(window.Worker){
    self.set_job_worker();
    self.set_url_worker();
    self.set_callbacks_worker();
    self.handler_worker = new My_handler_worker(self.url_worker, self.callbacks_worker);
  }
  return self;
};
My_handler_wave.prototype.stop_worker = function(){
  var self = this;
  if(self.handler_worker){
    self.handler_worker.terminate();
  }
  return self;
};
My_handler_wave.prototype.set_job_worker = function(){
  var self = this;
  self.job_worker = My_job_imported;
  return self;
};
My_handler_wave.prototype.set_url_worker = function(){
  var self = this;
  self.url_worker = "js/for_url.js";
  return self;
};
My_handler_wave.prototype.run_worker = function(arr_data_in, useWorker){
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
      self.callbacks_worker.onmessage({data: self.job_worker(data_in)});
    });
  }
  return self;
};
