// online-simulator.github.io

My_entry.test_worker = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_worker, My_entry.original_main, My_entry.original_worker);

My_entry.test_worker.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  self.init_worker();
  self.set_n_thread_worker(self.entry.$.selectNum_id("select-n_thread"));
  return self;
};
My_entry.test_worker.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elem_o = $._id("textarea-output");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_worker.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  self.handlers.onload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.stop_worker(true);
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "run":
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.elem_o.value = "";
        self.make_testcase($.selectNum_id("select-n"));
        self.run_worker(self.arr_data_in, $.checkbox_id("checkbox-useWorker"));
        break;
      case "stop":
        self.stop_worker();
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id;
    switch(id){
      case "select-n_thread":
        self.set_n_thread_worker($.selectNum_id(id));
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_worker.prototype.stop_worker = function(isClear){
  var self = this;
  if(self.handler_worker){
    if(self.handler_worker.isLocked){
      self.elem_o.value += "stopped"+"\n";
    }
    self.handler_worker.terminate();
    self.elem_o.value += "terminated"+"\n";
  }
  if(isClear){
    self.init_arr_worker();
  }
  return self;
};
My_entry.test_worker.prototype.set_callbacks_worker = function(){
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
    self.stop_worker(true);
    return self;
  };
  return self;
};
My_entry.test_worker.prototype.make_testcase = function(n){
  var self = this;
  self.arr_data_in = [];
  self.arr_data_out = [];
  for(var i=0; i<n; ++i){
    var data = {};
    data.in = Math.random();
    data.sw_job = self.entry.$.selectText_id("select-job");
    self.arr_data_in.push(data);
  }
  return self;
};
