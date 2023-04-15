// online-simulator.github.io

My_entry.handler_wave = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_main);

My_entry.handler_wave.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "def", "math_wave"]);
  self.init_worker();
  self.isSingle = (self.entry.$._id("input-freq"))? true: false;
  self.isScriptMode = (self.entry.$._id("textarea-script"))? true: false;
  self.text_log = "finished SAVE-OK 保存可能";
  self.text_link = "download-wav@double-click";  // Ver.1.23.4
  self.fileName_default = "download.wav";
  self.regex = {};
  self.regex.s = /\s/g;
  self.regex.mb = /\{.*?\}/g;
  self.regex.ml = /\[.*?\]/g;
  self.regex.rb = /\{|\}/g;
  self.regex.rl = /\[|\]/g;
  self.regex.qn = /^(.*)?b(.*)?$/;  // Ver.1.19.4
  self.regex.oc = /^o([+-]?\d+)c(\d+)$/;  // Ver.1.13.4
  self.regex.nc = /^n(\d+)$/;  // Ver.1.13.4
  self.regex.sn = /^([A-G]?)([+-]?\d+)([sf]?)$/;  // Ver.1.14.4
  self.regex.freq = /^f(.*)/;  // Ver.1.19.4
  self.regex.rest = /^r/;
  self.msec_60BPM = 1000;  // Ver.1.19.4
  self.notes = {C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11};
  self.params = {};
  if(self.isScriptMode){
    self.set_n_thread_worker(self.entry.$.selectNum_id("select-n_thread"));
  }
  return self;
};
My_entry.handler_wave.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elem_log = $._id("span-log");
  self.elem_name = $._id("span-name");
  self.elem_time = $._id("input-time");
  self.elem_top = $._id("select-Bytes_perSample");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.handler_wave.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
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
  self.handlers.onclick = function(e, elem){
    var self = this;
    var id = elem.id;
    switch(id){
      case "play":
        if(self.waveo.audio) return false;
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.output_log("Now encoding...");
        try{
          var arr_params = [];
          if(self.isScriptMode){
            var input = $._id("textarea-script").value;
            if(input){
              arr_params = self.check_script(input);
            }
          }
          else{
            arr_params = self.waveo.check_arr_params([self.params]);
          }
          if(arr_params.length){
            self.update_number_samples();
            var useWorker = $.checkbox_id("checkbox-useWorker");
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
        $.arr("input[type='checkbox']").forEach(function(elem){
          var id = elem.id;
          var mc = id.match(self.regex.oc);
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
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id;
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
  /* Ver.1.24.4 -> */
  var base0 = 2;
  var expo0 = self.entry.$.inputVal_id("input-rate");
  var rate0 = Math.pow(base0, expo0);
  self.params.rate = self.entry.def.limit(rate0, 0, Number.MAX_VALUE, 1);
  /* Ver.1.26.4 -> */
  var base1 = 2;
  var expo1 = self.entry.$.inputVal_id("input-order");
  var rate1 = Math.pow(base1, expo1);
  self.params.order = self.entry.def.limit(rate1, 0, Number.MAX_VALUE, 1);
  /* -> Ver.1.26.4 */
  /* -> Ver.1.24.4 */
  /* Ver.1.20.4 -> */
  /* Ver.1.16.4 -> */
  self.params.duty0 = self.entry.$.inputVal_id("input-duty");
  self.params.duty0 = self.entry.def.limit(self.params.duty0, 0, 1, 0.5);
  self.params.duty1 = self.params.duty0;
  /* -> Ver.1.16.4 */
  var sec = self.entry.$.inputNum_id("input-time")*0.001;
  if(isNaN(sec) || sec < 0){
    sec = 1;
    self.entry.$._id("input-time").value = sec*1000;
  }
  self.params.sec = sec;
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
  /* Ver.1.17.4 -> */
  self.params.w1 = self.entry.$.selectNum_id("select-w1");
  self.params.p1 = self.entry.$.selectNum_id("select-p1");
  self.params.amplitude0 = self.entry.$.inputVal_id("input-amplitude");
  self.params.amplitude0 = self.entry.def.limit(self.params.amplitude0, 0, 1, 1);
  self.params.amplitude1 = self.params.amplitude0;
  if(self.isScriptMode){
    /* Ver.1.18.4 -> */
    self.params.wr = self.entry.$.inputVal_id("input-wr");
    self.params.wr = self.entry.def.limit(self.params.wr, 0, 1, 0);
    /* -> Ver.1.18.4 */
    self.params.tempo = self.entry.$.inputVal_id("input-tempo");
    self.params.pitch = self.entry.$.inputVal_id("input-pitch");
    self.params.tempo = self.entry.def.limit(self.params.tempo, 0, Number.MAX_VALUE, 1);  // Ver.1.19.4
    self.params.pitch = self.entry.def.limit(self.params.pitch, -16, 16, 0);
    self.params.ampli = self.params.amplitude0;  // Ver.1.28.4
  }
  /* -> Ver.1.17.4 */
  /* -> Ver.1.20.4 */
  else{
    self.params.arr_f = self.get_freqs();
  }
  return self;
};
