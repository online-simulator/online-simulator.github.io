// online-simulator.github.io

function My_handler_wave(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_wave.prototype.init = function(){
  var self = this;
  var text_link = "download-wav by double-click";
  var json = {p: {id: "wrapper-link"}, a: {id: "a", it: text_link}, name: "download.wav", type: "audio/wav"};
  self.handler_link = new My_handler_link(json);
  self.elem_a = self.handler_link.elems.a;
  var callback = function(){
    var self = this;
    self.make_params();
    self.handler_link.link.name = self.get_fileName();
    self.elem_a.textContent = "Now encoding...";
    var _buffer = self.waveo.get_buffer(self.params);
    self.elem_a.textContent = text_link;
    return _buffer;
  };
  self.callback = callback.bind(self);
  self.handler_link.setter.callback(self.callback);
  self.params = {};
  self.handlers = {};
  self.handlers.onload = function(isSingle){
    var self = this;
    self.isSingle = isSingle;
    self.handlers.onchange("SELECT");
    return self;
  };
  self.handlers.onbeforeunload = function(){
    var self = this;
    if(self.waveo){
      self.waveo.stop_sound();
      self.waveo = null;
    }
    return self;
  };
  self.handlers.onchange = function(tagName){
    var self = this;
    if(self.waveo){
      self.waveo.stop_sound();
    }
    if(self.isSingle && tagName.toUpperCase() === "SELECT"){
      self.output_freq();
    }
    self.make_params();
    self.waveo = new My_output_wave(self.params.Bytes_perSample, self.params.samples_perSecond, self.params.number_channels);
    self.output_fileSize();
    return self;
  };
  self.handlers.onclick = function(id){
    var self = this;
    switch(id){
      case "play":
        var volume = My$inputNum_id("range-volume")*0.01;
        if(isNaN(volume)){
          volume = 0.5;
          My$_id("range-volume").value = volume*100;
        }
        self.waveo.output_sound(self.params, volume);
        break;
      case "stop":
        self.waveo.stop_sound();
        break;
      case "uncheck":
        My$arr("input[type='checkbox']").forEach(function(elem){
          elem.checked = false;
        });
        break;
      default:
        break;
    }
    return self;
  };
  My$bind_objs(self, self.handlers);
  return self;
};
My_handler_wave.prototype.calc_freq = function(octave, code){
  // Reference
  // en.m.wikipedia.org/wiki/MIDI_tuning_standard
  var self = this;
  var octave = octave;
  var code = code;
  if(self.isSingle){
    octave = My$selectNum_id("select-octave");
    code = My$selectNum_id("select-code");
  }
  var d = (octave+2)*12+code;
  var _freq = Math.pow(2, (d-69)/12)*440;
  return _freq;
};
My_handler_wave.prototype.output_freq = function(){
  var self = this;
  var freq = self.calc_freq();
  My$_id("input-freq").value = freq.toFixed(2);
  return self;
};
My_handler_wave.prototype.output_fileSize = function(){
  var self = this;
  var fileSize = self.waveo.get_fileSize(self.params.sec);
  My$_id("input-fileSize").value = fileSize/1000;
  return self;
};
My_handler_wave.prototype.get_fileName = function(){
  var self = this;
  var _name = self.params.type;
  self.params.arr_f.forEach(function(f, i){
    _name += Math.round(f);
    _name += "Hz";
  });
  _name += Math.round(self.params.sec*1000)/1000;
  _name += "sec";
  _name += ".wav";
  return _name;
};
My_handler_wave.prototype.get_freqs = function(){
  var self = this;
  var _arr_f = [];
  if(self.isSingle){
    var freq = My$inputNum_id("input-freq") || self.calc_freq();
    if(isNaN(freq)){
      self.output_freq();
    }
    _arr_f.push(My_math_wave.get_limit(freq, 0, 48000));
  }
  else{
    var octave0 = My$selectNum_id("select-octave");
    var isChecked = false;
    My$arr("input[type='checkbox']").forEach(function(elem){
      if(elem.checked){
        isChecked = true;
        var mc = elem.id.match(/^o(\d+)c(\d+)$/);
        var doctave = Number(mc[1]);
        var code = Number(mc[2]);
        _arr_f.push(self.calc_freq(octave0+doctave, code));
      }
    });
  }
  return _arr_f;
};
My_handler_wave.prototype.make_params = function(){
  var self = this;
  self.params.Bytes_perSample = My$selectNum_id("select-Bytes_perSample");
  self.params.samples_perSecond = My$selectNum_id("select-samples_perSecond");
  self.params.number_channels = My$selectNum_id("select-number_channels");
  var sec = My$inputNum_id("input-time")*0.001;
  if(isNaN(sec)){
    sec = 1;
    My$inputNum_id("input-time") = sec*1000;
  }
  self.params.sec = My_math_wave.get_limit(sec, 0, 10);
  self.params.type = My$selectVal_id("select-type");
  self.params.arr_f = self.get_freqs();
  return self;
};
