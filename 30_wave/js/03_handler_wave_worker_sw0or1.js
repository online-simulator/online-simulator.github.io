// online-simulator.github.io

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_worker);

My_entry.handler_wave.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;
    if(len_out === len_in){
      self.waveo.make_blob(data, function(blob){return self.handler_link.link.set_blob(blob);});  // Ver.1.103.22  // Ver.1.110.25
      self.stop_worker();
      self.output_amplitude_max(data._amplitude_max);  // Ver.1.35.6  // Ver.1.64.14
      self.output_log();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker(true);
    self.output_log(e.message);
    return self;
  };
  self.callbacks_worker.final = function(){
    var self = this;
    self.output_log("stopped by onchange");
    return self;
  };
  return self;
};
