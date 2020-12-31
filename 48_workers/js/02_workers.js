"use strict";

function My_test_worker(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_test_worker.prototype.init = function(){
  var self = this;
  self.set_job();
  self.set_url();
  self.set_handlers();
  self.handler_worker = new My_handler_worker(self.url, self.handlers);
  return self;
};
My_test_worker.prototype.handler_onbeforeunload = function(e){
  var self = this;
  self.handler_worker.terminate();
  return self;
};
My_test_worker.prototype.stop = function(){
  var self = this;
  self.handler_worker.terminate(true);
  self.elem_o.value += "terminated"+"\n";
  return self;
};
My_test_worker.prototype.set_job = function(){
  var self = this;
  self.job = My_job_imported;
  return self;
};
My_test_worker.prototype.set_url = function(){
  var self = this;
  self.url = "js/for_url.js";
  return self;
};
My_test_worker.prototype.set_handlers = function(){
  var self = this;
  var get_log = function(data, isIn){
    var _log = (isIn)?
      "data from main  ("+data.i+"): "+data.in:
      "data from worker("+data.i+"): "+data.out;
    return _log;
  };
  self.handlers = {};
  self.handlers.onmessage = function(e){
    var self = this;
    var data = e.data;
    var log =  get_log(data, true)+"\n";
        log += get_log(data)+"\n";
    self.elem_o.value += log;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      self.stop();
    }
    return self;
  };
  self.handlers.onerror = function(e){
    var self = this;
    var log = e.message+"\n";
    self.elem_o.value += log;
    self.stop();
    return self;
  };
////////////////////////////////////////////////////////////
  My_def.bind_handlers(self, self.handlers);
////////////////////////////////////////////////////////////
  return self;
};
My_test_worker.prototype.make_testcase = function(n, sw_job){
  var self = this;
  self.arr_data_in = [];
  self.arr_data_out = [];
  for(var i=0; i<n; ++i){
    var data = {};
    data.i = i;
    data.in = Math.random();
    data.sw_job = sw_job;
    self.arr_data_in.push(data);
  }
  return self;
};
My_test_worker.prototype.run = function(n, hasWorker, sw_job, id_output){
  var self = this;
  if(self.handler_worker.isLocked) return false;
  self.elem_o = My$_id(id_output);
  self.elem_o.value = "";
  self.make_testcase(n, sw_job);
  var hasWorker = (window.Worker && hasWorker);
  if(hasWorker){
    self.handler_worker.run(self.arr_data_in);
  }
  else{
    self.arr_data_in.forEach(function(data_in){
      self.handlers.onmessage({data: self.job(data_in)});
    });
  }
  return self;
};
