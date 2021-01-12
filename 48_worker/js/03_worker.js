// online-simulator.github.io

function My_test_worker(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_def.mix_in(My_test_worker, My_original_main, My_original_worker);

My_test_worker.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  self.init_worker();
  return self;
};
My_test_worker.prototype.init_elems = function(){
  var self = this;
  self.elem_o = My$_id("textarea-output");
  self.setup_elems(My$arr_tag("button"), "onclick");
  return self;
};
My_test_worker.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
    var self = this;
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.stop_worker();
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "run":
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.init_worker();
        self.run_worker(My$selectNum_id("select-n"), My$checkbox_id("checkbox-useWorker"));
        break;
      case "stop":
        self.stop_worker();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_test_worker.prototype.stop_worker = function(){
  var self = this;
  if(self.handler_worker){
    self.handler_worker.terminate();
  }
  self.elem_o.value += "terminated"+"\n";
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
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    var log =  get_log(data, true)+"\n";
        log += get_log(data)+"\n";
    self.elem_o.value += log;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    var log = e.message+"\n";
    self.elem_o.value += log;
    self.stop_worker();
    return self;
  };
  return self;
};
My_test_worker.prototype.make_testcase = function(n){
  var self = this;
  self.arr_data_in = [];
  self.arr_data_out = [];
  for(var i=0; i<n; ++i){
    var data = {};
    data.i = i;
    data.in = Math.random();
    data.sw_job = My$selectText_id("select-job");
    self.arr_data_in.push(data);
  }
  return self;
};
My_test_worker.prototype.run_worker = function(n, useWorker){
  var self = this;
  if(self.handler_worker && self.handler_worker.isLocked) return false;
  self.elem_o.value = "";
  self.make_testcase(n);
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
