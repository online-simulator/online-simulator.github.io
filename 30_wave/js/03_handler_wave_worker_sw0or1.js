// online-simulator.github.io

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_worker);

My_entry.handler_wave.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      var binary_header = self.waveo.get_binary_header(data.number_samples);
      var binary_soundData_LE = data.out;
      var binary = binary_header+binary_soundData_LE;
      var buffer = self.waveo.binary2buffer(binary);
      var fileName = self.get_fileName();
      self.handler_link.link.name = fileName;
      self.handler_link.link.set_url(buffer);
      self.output_log();
      self.output_fileName(fileName);
      var base64 = (window.btoa)? "data:audio/wav;base64,"+btoa(binary): "";
      var isIE = self.handler_link.browser.sws.isIE;
      if(!(isIE)){
        self.waveo.play_base64(base64, data.volume);
      }
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker();
    self.output_log(e.message);
    return self;
  };
  return self;
};
