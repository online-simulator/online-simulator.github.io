// online-simulator.github.io

My_entry.handler_wave = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_main);

My_entry.handler_wave.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "math_wave"]);
  self.init_worker();
  self.isSingle = (self.entry.$._id("input-freq"))? true: false;
  self.isScriptMode = (self.entry.$._id("textarea-script"))? true: false;
  self.text_log = "finished SAVE-OK 保存可能";
  self.text_link = "download-wav by double-click";
  self.fileName_default = "download.wav";
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
  return self;
};
My_entry.handler_wave.prototype.init_elems = function(){
  var self = this;
  self.elem_log = self.entry.$._id("span-log");
  self.elem_name = self.entry.$._id("span-name");
  self.elem_time = self.entry.$._id("input-time");
  self.elem_top = self.entry.$._id("select-Bytes_perSample");
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  self.entry.$.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.handler_wave.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(e){
    var self = this;
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: self.text_link}, name: self.fileName_default, ext: "wav"};
    self.handler_link = new self.constructors.handler_link(json);
    if(self.isSingle){
      self.output_freq();
    }
    self.elem_top.onchange();
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
  self.handlers.stop_worker = function(isClear){
    var self = this;
    if(self.handler_worker){
      if(self.handler_worker.isLocked){
        self.output_log("stopped by onchange");
      }
      self.stop_worker();
    }
    if(isClear){
      self.init_arr_worker();
    }
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.handlers.stop_sound(true);
    self.handlers.stop_worker(true);
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    self.handlers.onbeforeunload();
    if(self.isSingle && elem.tagName.toUpperCase() === "SELECT"){
      self.output_freq();
    }
    self.waveo = new self.constructors.output_wave();
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
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "play":
        if(self.waveo.audio) return false;
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.output_log("Now encoding...");
        try{
          var arr_params = [];
          if(self.isScriptMode){
            var input = self.entry.$._id("textarea-script").value;
            if(input){
              arr_params = self.check_script(input);
            }
          }
          else{
            arr_params = self.waveo.check_arr_params([self.params]);
          }
          if(arr_params.length){
            self.update_number_samples();
            var useWorker = self.entry.$.checkbox_id("checkbox-useWorker");
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
        self.entry.$.arr("input[type='checkbox']").forEach(function(elem){
          var mc = elem.id.match(self.regex.oc);
          if(mc && elem.checked){
            elem.checked = false;
          }
        });
        self.elem_top.onchange();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.handler_wave.prototype.output_log = function(log){
  var self = this;
  self.elem_log.textContent = log || self.text_log;
  return self;
};
My_entry.handler_wave.prototype.output_fileName = function(fileName){
  var self = this;
  self.elem_name.textContent = fileName || self.fileName_default;
  return self;
};
My_entry.handler_wave.prototype.output_time = function(sec){
  var self = this;
  self.elem_time.value = sec;
  return self;
};
My_entry.handler_wave.prototype.calc_freq = function(octave, code){
  var self = this;
  var octave = octave;
  var code = code;
  if(self.isSingle){
    octave = self.entry.$.selectNum_id("select-octave");
    code = self.entry.$.selectNum_id("select-code");
  }
  return self.entry.reference.calc_freq(octave, code);
};
My_entry.handler_wave.prototype.output_freq = function(){
  var self = this;
  var freq = self.calc_freq();
  self.entry.$._id("input-freq").value = freq.toFixed(2);
  return self;
};
My_entry.handler_wave.prototype.output_fileSize = function(sec){
  var self = this;
  var number_samples = self.waveo.get_number_samples(sec || self.params.sec);
  var fileSize = self.waveo.get_fileSize(number_samples);
  self.entry.$._id("input-fileSize").value = fileSize/1000;
  return self;
};
My_entry.handler_wave.prototype.get_fileName = function(){
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
My_entry.handler_wave.prototype.get_freqs = function(){
  var self = this;
  var _arr_f = [];
  if(self.isSingle){
    var freq = self.entry.$.inputNum_id("input-freq") || self.calc_freq();
    if(isNaN(freq)){
      self.output_freq();
    }
    _arr_f.push(self.entry.math_wave.get_limit(freq, 0, 48000));
  }
  else{
    var octave0 = self.entry.$.selectNum_id("select-octave");
    self.entry.$.arr("input[type='checkbox']").forEach(function(elem){
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
My_entry.handler_wave.prototype.update_number_samples = function(){
  var self = this;
  if(self.waveo){
    self.params.number_samples = self.waveo.get_number_samples(self.params.sec);
  }
  return self;
};
My_entry.handler_wave.prototype.make_params = function(){
  var self = this;
  self.params.f0 = self.entry.$.selectNum_id("select-f0");
  self.params.f1 = self.entry.$.selectNum_id("select-f1");
  self.params.g0 = self.entry.$.selectNum_id("select-g0");
  self.params.g1 = self.entry.$.selectNum_id("select-g1");
  self.params.Bytes_perSample = self.entry.$.selectNum_id("select-Bytes_perSample");
  self.params.samples_perSecond = self.entry.$.selectNum_id("select-samples_perSecond");
  self.params.number_channels = self.entry.$.selectNum_id("select-number_channels");
  self.params.type = self.entry.$.selectVal_id("select-type");
  var sec = self.entry.$.inputNum_id("input-time")*0.001;
  if(isNaN(sec)){
    sec = 1;
    self.entry.$.inputNum_id("input-time") = sec*1000;
  }
  self.params.sec = self.entry.math_wave.get_limit(sec, 0, 1000);
  self.update_number_samples();
  var volume = self.entry.$.inputNum_id("range-volume")*0.01;
  if(isNaN(volume)){
    volume = 0.5;
    self.entry.$._id("range-volume").value = volume*100;
  }
  self.params.volume = volume;
  self.params.w0 = self.entry.$.selectNum_id("select-w0");
  self.params.p0 = self.entry.$.selectNum_id("select-p0");
  self.params.fileSizeMax = self.entry.$.selectNum_id("select-fileSizeMax");
  if(self.isScriptMode){
  }
  else{
    self.params.arr_f = self.get_freqs();
  }
  return self;
};
