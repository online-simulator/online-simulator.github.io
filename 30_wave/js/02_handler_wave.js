// online-simulator.github.io

function My_handler_wave(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_handler_wave.prototype.init = function(){
  var self = this;
  self.isScriptMode = (My$_id("select-octave"))? false: true;
  self.elem_log = My$_id("span-log");
  self.elem_name = My$_id("span-name");
  self.elem_time = My$_id("input-time");
  self.text_log = "finished SAVE-OK 保存可能";
  self.fileName_default = "download.wav";
  var text_link = "download-wav by double-click";
  var json = {p: {id: "wrapper-link"}, a: {id: "a", it: text_link}, name: self.fileName_default, type: "audio/wav"};
  self.handler_link = new My_handler_link(json);
  self.regex = {};
  self.regex.s = /\s/g;
  self.regex.mb = /\{.*?\}/g;
  self.regex.ml = /\[.*?\]/g;
  self.regex.rb = /\{|\}/g;
  self.regex.rl = /\[|\]/g;
  self.regex.oc = /^o(\d+)c(\d+)$/;
  self.regex.freq = /^f(\d+)/;
  self.regex.rest = /^r/;
  self.params = {};
  self.handlers = {};
  self.handlers.onload = function(isSingle){
    var self = this;
    self.isSingle = isSingle;
    self.handlers.onchange("SELECT");
    self.output_fileName();
    return self;
  };
  self.handlers.stop_sound = function(isClear){
    var self = this;
    if(self.waveo){
      self.waveo.stop_sound();
    }
    if(isClear){
      self.waveo = null;
    }
    return self;
  };
  self.handlers.stop_worker = function(){
    var self = this;
    if(self.handler_worker){
      self.stop_worker();
    }
    return self;
  };
  self.handlers.onbeforeunload = function(){
    var self = this;
    self.handlers.stop_sound(true);
    self.handlers.stop_worker();
    return self;
  };
  self.handlers.onchange = function(tagName){
    var self = this;
    self.handlers.onbeforeunload();
    if(self.isSingle && tagName.toUpperCase() === "SELECT"){
      self.output_freq();
    }
    self.waveo = new My_output_wave();
    self.make_params();
    self.waveo.init(self.params.Bytes_perSample, self.params.samples_perSecond, self.params.number_channels);
    if(self.isScriptMode){
      self.output_time("");
    }
    else{
      self.output_fileSize();
    }
    return self;
  };
  self.handlers.onclick = function(id){
    var self = this;
    switch(id){
      case "play":
        if(self.waveo.audio) return false;
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.output_log("Now encoding...");
        try{
          var arr_params = null;
          if(self.isScriptMode){
            var input = My$_id("textarea-script").value;
            if(input){
              arr_params = self.check_script(input);
            }
          }
          else{
            arr_params = self.waveo.check_arr_params([self.params]);
          }
          if(arr_params.length){
            self.update_number_samples();
            var useWorker = My$checkbox_id("checkbox-useWorker");
            self.init_worker();
            setTimeout(function(){
              self.run_worker(arr_params, useWorker);
            }, 50);
          }
          else{
            self.output_log("stopped by no-data");
          }
        }
        catch(e){
          self.output_log(e.message);
        }
        break;
      case "stop":
        self.handlers.stop_sound();
        self.handlers.stop_worker();
        self.output_log("stopped");
        break;
      case "uncheck":
        My$arr("input[type='checkbox']").forEach(function(elem){
          var mc = elem.id.match(self.regex.oc);
          if(mc && elem.checked){
            elem.checked = false;
          }
        });
        self.handlers.onchange();
        break;
      default:
        break;
    }
    return self;
  };
  My$bind_objs(self, self.handlers);
  return self;
};
My_handler_wave.prototype.output_log = function(log){
  var self = this;
  self.elem_log.textContent = log || self.text_log;
  return self;
};
My_handler_wave.prototype.output_fileName = function(fileName){
  var self = this;
  self.elem_name.textContent = fileName || self.fileName_default;
  return self;
};
My_handler_wave.prototype.output_time = function(sec){
  var self = this;
  self.elem_time.value = sec;
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
My_handler_wave.prototype.output_fileSize = function(sec){
  var self = this;
  var number_samples = self.waveo.get_number_samples(sec || self.params.sec);
  var fileSize = self.waveo.get_fileSize(number_samples);
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
  if(_name.length > 50){
    _name = self.fileName_default;
  }
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
    My$arr("input[type='checkbox']").forEach(function(elem){
      var mc = elem.id.match(self.regex.oc);
      if(mc && elem.checked){
        var doctave = Number(mc[1]);
        var code = Number(mc[2]);
        _arr_f.push(self.calc_freq(octave0+doctave, code));
      }
    });
  }
  return _arr_f;
};
My_handler_wave.prototype.update_number_samples = function(){
  var self = this;
  if(self.waveo){
    self.params.number_samples = self.waveo.get_number_samples(self.params.sec);
  }
  return self;
};
My_handler_wave.prototype.make_params = function(){
  var self = this;
  self.params.f0 = My$selectNum_id("select-f0");
  self.params.f1 = My$selectNum_id("select-f1");
  self.params.g0 = My$selectNum_id("select-g0");
  self.params.g1 = My$selectNum_id("select-g1");
  self.params.Bytes_perSample = My$selectNum_id("select-Bytes_perSample");
  self.params.samples_perSecond = My$selectNum_id("select-samples_perSecond");
  self.params.number_channels = My$selectNum_id("select-number_channels");
  self.params.type = My$selectVal_id("select-type");
  var sec = My$inputNum_id("input-time")*0.001;
  if(isNaN(sec)){
    sec = 1;
    My$inputNum_id("input-time") = sec*1000;
  }
  self.params.sec = My_math_wave.get_limit(sec, 0, 10);
  self.update_number_samples();
  var volume = My$inputNum_id("range-volume")*0.01;
  if(isNaN(volume)){
    volume = 0.5;
    My$_id("range-volume").value = volume*100;
  }
  self.params.volume = volume;
  self.params.i = 0;
  if(!(self.isScriptMode)){
    self.params.arr_f = self.get_freqs();
  }
  return self;
};
