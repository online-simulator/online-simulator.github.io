// online-simulator.github.io

function My_test_worker(id_output){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_test_worker.prototype.init = function(id_output){
  var self = this;
  self.hasWorker = (window.Worker)? true: false;
  self.elem_o = My$_id(id_output); // used onbeforeunload
  self.set_job_worker();
  self.set_url_worker();
  self.set_callbacks_worker();
  self.handler_worker = new My_handler_worker(self.url_worker, self.callbacks_worker);
  return self;
};
My_test_worker.prototype.stop_worker = function(isReset){
  var self = this;
  self.handler_worker.terminate(isReset);
  self.elem_o.value += "terminated"+"\n";
  return self;
};
My_test_worker.prototype.set_job_worker = function(){
  var self = this;
  self.job_worker = My_job_imported;
  return self;
};
My_test_worker.prototype.set_url_worker = function(){
  var self = this;
  self.url_worker = "js/for_url.js";
  return self;
};
My_test_worker.prototype.set_callbacks_worker = function(){
  var self = this;
  var get_log = function(data, isIn){
    var _log = (isIn)?
      "data from main  ("+data.i+"): "+data.in:
      "data from worker("+data.i+"): "+data.out;
    return _log;
  };
  self.callbacks_worker = {};
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    var log =  get_log(data, true)+"\n";
        log += get_log(data)+"\n";
    self.elem_o.value += log;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      self.stop_worker(true);
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    var log = e.message+"\n";
    self.elem_o.value += log;
    self.stop_worker(true);
    return self;
  };
////////////////////////////////////////////////////////////
  My$bind_objs(self, self.callbacks_worker);
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
My_test_worker.prototype.run_worker = function(n, hasWorker, sw_job){
  var self = this;
  if(self.handler_worker.isLocked) return false;
  self.elem_o.value = "";
  self.make_testcase(n, sw_job);
  var hasWorker = (self.hasWorker && hasWorker);
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
