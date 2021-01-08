// online-simulator.github.io

My_handler_wave.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker = {};
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      var binary = self.waveo.get_binary_header(data.number_samples)+data.out;
      var buffer = self.waveo.binary2buffer(binary);
      self.handler_link.link.name = self.get_fileName();
      self.handler_link.link.set_url(buffer);
      self.output_log("finished SAVE-OK 保存可能");
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
////////////////////////////////////////////////////////////
  My$bind_objs(self, self.callbacks_worker);
////////////////////////////////////////////////////////////
  return self;
};
