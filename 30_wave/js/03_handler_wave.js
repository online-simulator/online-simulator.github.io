// online-simulator.github.io

My_entry.handler_wave = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_main);

My_entry.handler_wave.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$", "def"]);  // Ver.1.47.11  // Ver.1.84.15
  self.init_worker();
  self.isSingle = (self.entry.$._id("input-freq"))? true: false;
  self.isScriptMode = (self.entry.$._id("textarea-script"))? true: false;
  self.text_log = "finished SAVE-OK 保存可能";
  self.text_link = "download-wav@double-click";  // Ver.1.23.4
  self.pre_maxAmp = "auto-";  // Ver.1.45.11
  self.post_maxAmp = {eq: "＝", simeq: "≒"};  // Ver.1.45.11
  self.fileName_default = (self.isScriptMode)? "made_by_script": "download";  // Ver.1.68.14
  self.regex = {};
  self.regex.s = /\s/g;
  self.regex.macro_prifix = /\$/;  // Ver.1.42.10
  /* Ver.1.43.11 -> */
  self.regex.make_tag = function(tag){
    return (new RegExp("\\"+tag, "gm"));
  };
  var sw_flag = (My_entry.flag.hasFlagS)? "s": "";
  self.regex.macros = new RegExp("\\$[0-9a-zA-Z_\\-]+\\([0-9a-zA-Z_\\-\\+\\=.,:;\\[\\]\\$\\s]+?\\)", "g"+sw_flag);  // Ver.1.41.9  // Ver.1.42.10  // Ver.1.42.11  // Ver.1.65.14
  self.regex.macro = new RegExp("^(\\$[0-9a-zA-Z\\-_]+)\\((.*)?\\)$", sw_flag);  // Ver.1.41.9  // Ver.1.42.10
  self.regex.mb = new RegExp("\\{.*?\\}", "g"+sw_flag);
  self.regex.ml = new RegExp("\\[.*?\\]", "g"+sw_flag);
  /* -> Ver.1.43.11 */
  self.regex.rb = /\{|\}/g;
  self.regex.rl = /\[|\]/g;
  self.regex.qn = /^(.*)?b(.*)?$/;  // Ver.1.19.4
  self.regex.oc = /^o([+-]?\d+)c(\d+)$/;  // Ver.1.13.4
  self.regex.nc = /^n(\d+)$/;  // Ver.1.13.4
  self.regex.sn = /^([A-G]?)([+-]?\d+)([sf#b]*)$/;  // Ver.1.14.4  // Ver.1.84.15
  self.regex.sharp = /s|#/g;  // Ver.1.84.15
  self.regex.flat = /f|b/g;  // Ver.1.84.15
  self.regex.freq = /^f(.*)/;  // Ver.1.19.4
  self.regex.rest = /^r$/;  // Ver.1.65.14
  self.regex.type = /type=\[(.*?):(.*?)\]/g;  // Ver.1.71.14
  self.regex.table = /\[(.*?):(.*?)\]/;  // Ver.1.71.14
  self.msec_60BPM = 1000;  // Ver.1.19.4
  /* Ver.1.84.15 -> */
  self.notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  self.notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  self.tunes = ["Equal", "Pure", "Pythagorean", "MeanTone", "Young2", "Schnittger", "WerckMeister3", "KirnBerger3"];
  self.modes = ["Major", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Minor", "Aeolian", "Locrian", "HarmonicMinor", "MelodicMinor"];
  self.get_degree = function(root, note){
    var note2index = {
      C: 0,
      "C#": 1,
      Db: 1,
      D: 2,
      "D#": 3,
      Eb: 3,
      E: 4,
      F: 5,
      "F#": 6,
      Gb: 6,
      G: 7,
      "G#": 8,
      Ab: 8,
      A: 9,
      "A#": 10,
      Bb: 10,
      B: 11
    };
    var steps2degree = {
      0: 1,
      2: 2,
      4: 3,
      5: 4,
      7: 5,
      9: 6,
      11: 7
    };
    var steps = (note2index[note]-note2index[root]+12)%12;
    return (steps2degree[steps] || null);
  };
  self.rules = {
    Major: {
      degrees: [],
      alterations: []
    },
    Ionian: {
      degrees: [],
      alterations: []
    },
    Dorian: {
      degrees: [3, 7],
      alterations: [-1, -1]
    },
    Phrygian: {
      degrees: [2, 3, 6, 7],
      alterations: [-1, -1, -1, -1]
    },
    Lydian: {
      degrees: [4],
      alterations: [1]
    },
    Mixolydian: {
      degrees: [7],
      alterations: [-1]
    },
    Minor: {
      degrees: [3, 6, 7],
      alterations: [-1, -1, -1]
    },
    Aeolian: {
      degrees: [3, 6, 7],
      alterations: [-1, -1, -1]
    },
    Locrian: {
      degrees: [2, 3, 5, 6, 7],
      alterations: [-1, -1, -1, -1, -1]
    },
    HarmonicMinor: {
      degrees: [3, 6],
      alterations: [-1, -1]
    },
    MelodicMinor: {
      degrees: [3],
      alterations: [-1]
    }
  };
  self.ratios = {
    Equal: {
      base: {
        C: Math.pow(2, 0/12),
        D: Math.pow(2, 2/12),
        E: Math.pow(2, 4/12),
        F: Math.pow(2, 5/12),
        G: Math.pow(2, 7/12),
        A: Math.pow(2, 9/12),
        B: Math.pow(2, 11/12)
      },
      sharp: Math.pow(2, 1/12)
    },
    Pure: {
      base: {
        C: 1/1,
        D: 9/8,
        E: 5/4,
        F: 4/3,
        G: 3/2,
        A: 5/3,
        B: 15/8
      },
      sharp: 25/24
    },
    Pythagorean: {
      base: {
        C: 1/1,
        D: 9/8,
        E: 81/64,
        F: 4/3,
        G: 3/2,
        A: 27/16,
        B: 243/128
      },
      sharp: 2187/2048
    },
    MeanTone: {
      base: {
        C: 1/1,
        D: Math.sqrt(5)/2,
        E: 5/4,
        F: Math.pow(5, 0.75)/2.5,
        G: Math.pow(5, 0.25),
        A: Math.pow(5, 0.75)/2,
        B: (5/4)*Math.pow(5, 0.25)
      },
      sharp: 25/24
    },
    Young2: {
      base: {
        C: 1/1,
        D: Math.pow(2, 2/12),
        E: (81/64)/Math.pow(81/80, 0.5),
        F: Math.pow(2, 5/12),
        G: (3/2)/Math.pow(81/80, 1/6),
        A: Math.pow(2, 9/12),
        B: Math.pow(2, 11/12)
      },
      sharp: Math.pow(2, 1/12)*Math.pow(81/80, 1/12)
    },
    Schnittger: {
      base: {
        C: 1/1,
        D: (9/8)/Math.pow(81/80, 0.5),
        E: (81/64)/Math.pow(81/80, 1.0),
        F: 4/3,
        G: (3/2)/Math.pow(81/80, 0.25),
        A: (27/16)/Math.pow(81/80, 0.75),
        B: (243/128)/Math.pow(81/80, 0.75)
      },
      sharp: 256/243
    },
    WerckMeister3: {
      base: {
        C: 1/1,
        D: (9/8)/Math.pow(81/80, 0.5),
        E: (81/64)/Math.pow(81/80, 0.75),
        F: 4/3,
        G: (3/2)/Math.pow(81/80, 0.25),
        A: (27/16)/Math.pow(81/80, 0.75),
        B: (243/128)/Math.pow(81/80, 0.75)
      },
      sharp: 256/243
    },
    KirnBerger3: {
      base: {
        C: 1/1,
        D: 9/8,
        E: 5/4,
        F: 4/3,
        G: (3/2)/Math.pow(81/80, 0.25),
        A: (27/16)/Math.pow(81/80, 0.5),
        B: 15/8
      },
      sharp: 25/24
    }
  };
  /* -> Ver.1.84.15 */
  self.params = {};
  if(self.isScriptMode){
    self.set_n_thread_worker(self.entry.$.selectNum_id("select-n_thread"));
    /* Ver.1.69.14 -> */
    self.types0 = {
      0: "sin",
      1: "triangle",
      2: "square",
      3: "sawtooth",
      /* Ver.1.34.6 -> */
      4: "sawtoothrev",
      5: "sawtooth0",
      6: "sawtooth0rev",
      7: "sin_rand",
      8: "triangle_rand",
      9: "square_rand",
      10: "sawtooth_rand",
      11: "sawtoothrev_rand",
      12: "sawsmooth",  // Ver.1.71.14
      13: "sawsmooth_rand"  // Ver.1.71.14
      /* -> Ver.1.34.6 */
    };
    self.props0 = [
      "time",
      "arr_f",
      "command",
      "type",
      "duty0",
      "duty1",
      "amplitude0",
      "amplitude1",
      "w0",
      "p0",
      "w1",
      "p1",
      "f0",
      "g0",
      "f1",
      "g1",
      "rate",  // Ver.1.24.4
      "order",  // Ver.1.26.4
      "order_d",  // Ver.1.31.6
      "order_a",  // Ver.1.31.6
      "order_fade",  // Ver.1.38.8
      "f_vib",  // Ver.1.56.11
      "overtone",  // Ver.1.64.14
      "ti",  // Ver.1.74.14
      "to",  // Ver.1.74.14
      "A4",  // Ver.1.84.15
      "tune",  // Ver.1.84.15
      "root",  // Ver.1.84.15
      "mode"  // Ver.1.84.15
    ];
    self.hasProp = {};
    for(var n=0, len_n=self.props0.length; n<len_n; ++n){
      var prop = self.props0[n];
      self.hasProp[prop] = true;
    }
    /* -> Ver.1.69.14 */
  }
  self.handler_view = new self.constructors.handler_baseview([,,,"Int",]);  // Ver.1.48.11
  return self;
};
My_entry.handler_wave.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elem_log = $._id("span-log");
  self.elem_time = $._id("input-time");
  self.elem_top = $._id("select-Bytes_perSample");
  $.setup_elems_readonly$("input,textarea");  // Ver.1.41.9
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
/* Ver.1.68.14 */
My_entry.handler_wave.prototype.update_fileName = function(){
  var self = this;
  var $ = self.entry.$;
  var fileName = "";
  var isAuto = $.checkbox_id("checkbox-fileName");
  if(isAuto){
    if(!(self.isScriptMode)){
      fileName = self.get_fileName();
    }
  }
  else{
    fileName = $._id("input-fileName").value;
  }
  if(!(fileName) || fileName.length > 50){
    fileName = self.fileName_default;
  }
  self.handler_link.link.name = fileName+".wav";
  $._id("input-fileName").value = fileName;
  $.set_id("input-fileName", "readOnly", isAuto);
  return self;
};
My_entry.handler_wave.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  self.handlers.onload = function(e){
    var self = this;
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: self.text_link}, name: self.fileName_default+".wav", ext: "wav"};  // Ver.1.68.14
    self.handler_link = new self.constructors.handler_link(json);
    if(self.isSingle){
      self.output_freq();
    }
    /* Ver.1.53.11 -> */
    if(self.isScriptMode){
      $.set_selectVal_id("select-n_thread", (Math.min(window.navigator.hardwareConcurrency || 1, 12)*2));
    }
    /* -> Ver.1.53.11 */
    self.elem_top.onchange();
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
      case "random":
        var make_sheet = function(){
          var _script = "";
          var note0 = 60;
          var Nnote = 12;
          var init_note = function(){
            return Math.floor(note0+Math.random()*Nnote*2);
          };
          var len = $.inputNum_id("input-N");
          var prob_rest0 = $.inputNum_id("input-prob_rest");
          var prob_init0 = $.inputNum_id("input-prob_init");
          var w = $.inputNum_id("input-w");
          var prob_rest = prob_rest0;
          var prob_init = prob_init0;
          var note = init_note();
          var dnote0 = 0;
          for(var i=0; i<len; ++i){
            var r = Math.random();
            var isRest = false;
            if(r < prob_rest){
              isRest = true;
              dnote0 = 0;
            }
            else if(r < prob_rest+prob_init){
              prob_init = prob_init0;
              note = init_note();
              dnote0 = 0;
            }
            else{
              var dnote1 = (-1+Math.random()*2)*Nnote;
              var dnote = w*dnote0+(1-w)*dnote1;
              dnote0 = dnote;
              note += Math.floor(dnote);
            }
            if(!(isRest) && note > 0){
              _script += "n"+note;
            }
            else{
              _script += 0;
            }
            if(i < len-1){
              _script += ";";
            }
          }
          return _script;
        };
        $._id("textarea-script").value = "";
        $._id("textarea-script").value += "$sheet("+make_sheet()+")\n\n";
        $._id("textarea-script").value += "{b::::::1:0;$sheet;}\n\n";
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
    if(self.isSingle && (elem.tagName.toUpperCase() === "SELECT" || elem.id === "input-A4")){  // Ver.1.84.15
      self.output_freq();
    }
    self.waveo = new self.constructors.output_wave();
    self.make_params();
    self.waveo.init(self.params.Bytes_perSample, self.params.samples_perSecond, self.params.number_channels);
    self.update_number_samples();  // Ver.1.59.13
    self.output_amplitude_max((self.params.maxAmp)? self.pre_maxAmp: "");  // Ver.1.35.6  // Ver.1.45.11  // Ver.1.64.14
    if(self.isScriptMode){
      self.output_time("");
    }
    else{
      self.output_fileSize();
    }
    self.update_fileName();  // Ver.1.68.14
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
  self.elem_log.textContent = (log || self.text_log).replace("Uncaught Error: ", "");  // Ver.1.41.10
  return self;
};
My_entry.handler_wave.prototype.output_time = function(sec){
  var self = this;
  self.elem_time.value = sec;
  return self;
};
/* Ver.1.84.15 -> */
My_entry.handler_wave.prototype.make_str = function(octave, note){
  var self = this;
  return note.substring(0, 1)+octave+note.substring(1);  // A4# || A4## || A4##...
};
/* Ver.1.44.11 */
My_entry.handler_wave.prototype.calc_freq = function(str, A4, tune, root, mode, opt_octave0, opt_sw_sharp2flat){
  var self = this;
  var _freq = NaN;
  var octave = 4;
  var note = "A";
  var alteration = 0;
  var mc_oc = str.match(self.regex.oc);
  var mc_nc = str.match(self.regex.nc);  // Ver.1.13.4
  var mc_sn = str.match(self.regex.sn);  // Ver.1.14.4
  var mc_f = str.match(self.regex.freq);
  var mc_r = str.match(self.regex.rest);
  var set_alteration = function(str){
    var mc_sn = str.match(self.regex.sn);  // Ver.1.14.4
    octave = Number(mc_sn[2]);
    note = mc_sn[1];
    var sn = mc_sn[3];
    alteration = (sn.match(self.regex.sharp) || []).length-(sn.match(self.regex.flat) || []).length;
  };
  if(mc_oc){
    octave = Number(mc_oc[1]);
    note = Number(mc_oc[2]);  // Ver.1.44.11
  }
  /* Ver.1.13.4 -> */
  else if(mc_nc){
    octave = -1;
    note = Number(mc_nc[1]);
  }
  /* -> Ver.1.13.4 */
  /* Ver.1.14.4 -> */
  else if(mc_sn && mc_sn[1]){
    set_alteration(str);
  }
  /* -> Ver.1.14.4 */
  else if(mc_f){
    _freq = Number(mc_f[1]);
  }
  else if(mc_r){
    _freq = 0;
  }
  else{
    _freq = Number(str);
  }
  if(isNaN(_freq)){
    if(!(isNaN(note)) && note >= 0){
      var num = Number(note);
      octave += Math.floor(num/12);
      num = num%12;
      set_alteration(self.make_str(octave, (opt_sw_sharp2flat)? self.notes_flat[num]: self.notes_sharp[num]));
    }
    var tune = tune;
    if(!(isNaN(tune))){
      var num = Number(tune);
      tune = self.tunes[num];
    }
    var mode = mode;
    if(!(isNaN(mode))){
      var num = Number(mode);
      mode = self.modes[num];
    }
    var rules = self.rules[mode] || self.rules[self.modes[0]];
    var ratios = self.ratios[tune] || self.ratios[self.tunes[0]];
    var s = ratios.sharp;
    var ratio = ratios.base[note];
    ratio *= Math.pow(s, alteration);
    if (rules && rules.degrees){
      var degree = self.get_degree(root, note);
      var i = rules.degrees.indexOf(degree);
      if(i !== -1){
        ratio *= Math.pow(s, rules.alterations[i]);
      }
    }
    var freq_A4 = A4;
    var freq_C4 = freq_A4/ratios.base["A"];
    var doctave = (opt_octave0 || 0)+octave-4;
    _freq = freq_C4*Math.pow(2, doctave)*ratio;
  }
  return _freq;
};
/* -> Ver.1.84.15 */
My_entry.handler_wave.prototype.output_freq = function(){
  var self = this;
  self.entry.$._id("input-freq").value = (self.get_freq()).toFixed(3);  // Ver.1.84.15
  return self;
};
/* Ver.1.35.6 */
My_entry.handler_wave.prototype.output_amplitude_max = function(amplitude){
  var self = this;
  self.entry.$._id("input-amplitude_max").value = amplitude;
  return self;
};
My_entry.handler_wave.prototype.output_fileSize = function(sec){
  var self = this;
  var number_samples = self.waveo.get_number_samples(sec || self.params.sec);
  var fileSize = self.waveo.get_fileSize(number_samples);
  self.entry.$._id("input-fileSize").value = fileSize/Math.pow(2, 10*2);  // Ver.1.30.5 1MB=1024KB=1024*1024B
  return self;
};
/* Ver.1.41.9 */
My_entry.handler_wave.prototype.output_script = function(script){
  var self = this;
  self.entry.$._id("textarea-script_original").value = script;
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
  return _name;
};
/* Ver.1.84.15 */
My_entry.handler_wave.prototype.get_freq = function(str){
  var self = this;
  var _freq = null;
  var A4 = self.entry.$.inputNum_id("input-A4");
  var tune = self.entry.$.selectNum_id("select-tune");
  var root = self.entry.$.selectVal_id("select-root");
  var mode = self.entry.$.selectNum_id("select-mode");
  if(str){
    var octave0 = self.entry.$.selectNum_id("select-octave");
    var sw_sharp2flat = self.entry.$.checkbox_id("checkbox-sharp2flat");
    _freq = self.calc_freq(str, A4, tune, root, mode, octave0, sw_sharp2flat)
  }
  else{
    var octave = self.entry.$.selectNum_id("select-octave");
    var note = self.entry.$.selectVal_id("select-note");
    var str = self.make_str(octave, note);
    _freq = self.calc_freq(str, A4, tune, root, mode);
  }
  return _freq;
};
My_entry.handler_wave.prototype.get_freqs = function(){
  var self = this;
  var _arr_f = [];
  if(self.isSingle){
    var freq = self.entry.$.inputNum_id("input-freq") || self.get_freq();  // Ver.1.84.15
    if(isNaN(freq)){
      self.output_freq();
    }
    _arr_f.push(self.waveo.entry.math_wave.get_limit(freq, 0, 48000));  // Ver.1.47.11
  }
  else{
    self.entry.$.arr("input[type='checkbox']").forEach(function(elem){
      /* Ver.1.84.15 -> */
      var str = elem.id;
      var mc = str.match(self.regex.oc);
      if(mc && elem.checked){
        _arr_f.push(self.get_freq(str));  // Ver.1.44.11
      }
      /* -> Ver.1.84.15 */
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
/* Ver.1.47.11 */
My_entry.handler_wave.prototype.make_params = function(){
  var self = this;
  var $ = self.entry.$;
  var def = self.entry.def;
  var params = self.params;
  params.Bytes_perSample = $.selectNum_id("select-Bytes_perSample");
  params.samples_perSecond = $.selectNum_id("select-samples_perSecond");
  params.number_channels = $.selectNum_id("select-number_channels");
  params.type = $.selectVal_id("select-type");
  /* Ver.1.20.4 -> */
  /* Ver.1.16.4 -> */
  params.duty0 = $.inputNum_id("input-duty");  // Ver.1.64.14
  params.duty1 = params.duty0;
  /* -> Ver.1.16.4 */
  /* Ver.1.84.15 -> */
  params.A4 = $.inputNum_id("input-A4");
  params.tune = $.selectNum_id("select-tune");
  params.root = $.selectVal_id("select-root");
  params.mode = $.selectNum_id("select-mode");
  /* -> Ver.1.84.15 */
  /* Ver.1.35.6 -> */
  params.kampli = $.inputNum_id("input-amplitude");  // Ver.1.64.14  // Ver.1.75.14
  params.amplitude0 = 1;  // Ver.1.75.14
  params.amplitude1 = 1;  // Ver.1.75.14
  /* -> Ver.1.35.6 */
  params.w0 = $.selectNum_id("select-w0");
  params.p0 = $.selectNum_id("select-p0");
  params.w1 = $.selectNum_id("select-w1");
  params.p1 = $.selectNum_id("select-p1");
  params.f0 = $.selectNum_id("select-f0");
  params.g0 = $.selectNum_id("select-g0");
  params.f1 = $.selectNum_id("select-f1");
  params.g1 = $.selectNum_id("select-g1");
  /* Ver.1.24.4 -> */
  var base0 = 2;
  var expo0 = $.inputNum_id("input-rate");  // Ver.1.64.14
  var rate0 = Math.pow(base0, expo0);
  params.rate = rate0;
  /* Ver.1.26.4 -> */
  var base1 = 2;
  var expo1 = $.inputNum_id("input-order");  // Ver.1.64.14
  var rate1 = Math.pow(base1, expo1);
  params.order = rate1;
  /* Ver.1.31.6 -> */
  params.order_d = 1;  // script only
  params.order_a = 1;  // script only
  /* -> Ver.1.31.6 */
  /* -> Ver.1.26.4 */
  /* -> Ver.1.24.4 */
  /* Ver.1.38.8 -> */
  params.order_fade = $.selectNum_id("select-order-fade");
  /* -> Ver.1.38.8 */
  params.f_vib = $.inputNum_id("input-f_vib");  // Ver.1.57.12  // Ver.1.64.14
  params.overtone = $.inputNum_id("input-overtone");  // Ver.1.64.14
  params.ti = 0;  // Ver.1.74.14
  params.to = 0;  // Ver.1.74.14
  var sec = $.inputNum_id("input-time")*0.001;
  if(isNaN(sec) || sec < 0){
    sec = 1;
    $._id("input-time").value = sec*1000;
  }
  params.sec = sec;
  var volume = $.inputNum_id("range-volume")*0.01;
  if(isNaN(volume)){
    volume = 0.5;
    $._id("range-volume").value = volume*100;
  }
  params.volume = volume;
  params.fileSizeMax = $.selectNum_id("select-fileSizeMax");
  /* Ver.1.17.4 -> */
  if(self.isScriptMode){
    /* Ver.1.52.11 -> */
    var tempo = 60/$.inputNum_id("input-BPM");  // Ver.1.64.14
    $._id("input-tempo").value = tempo;
    params.tempo = tempo;
    var isAutoDfreq = $.checkbox_id("checkbox-autoDfreq");
    $.set_id("input-dfreq", "readOnly", isAutoDfreq);
    if(isAutoDfreq){
      $._id("input-dfreq").value = 4/tempo;
    }
    /* -> Ver.1.52.11 */
    params.pitch = $.inputNum_id("input-pitch");  // Ver.1.64.14
    params.tempo = def.limit(params.tempo, 0, Number.MAX_VALUE, 1);  // Ver.1.19.4
    params.pitch = def.limit(params.pitch, -16, 16, 0);  // Ver.1.83.15  // Ver.1.84.15
    params.maxAmp = $.checkbox_id("checkbox-maxAmp");  // Ver.1.45.11
    /* Ver.1.29.4 -> */
    params.dfreq = $.inputNum_id("input-dfreq");  // Ver.1.64.14
    params.dfreq = def.limit(params.dfreq, -Number.MAX_VALUE, Number.MAX_VALUE, 0);
    /* Ver.1.32.6 -> */
    params.s_random = $.inputNum_id("input-s_random");  // Ver.1.64.14
    params.s_random = def.limit(params.s_random, -16, 16, 0);
    /* -> Ver.1.32.6 */
    /* Ver.1.33.6 -> */
    params.s_stereo = $.inputNum_id("input-s_stereo");  // Ver.1.64.14
    params.s_stereo = def.limit(params.s_stereo, 0, 100, 0);
    /* -> Ver.1.33.6 */
    /* -> Ver.1.29.4 */
    /* Ver.1.18.4 -> */
    params.wr = $.inputNum_id("input-wr");  // Ver.1.64.14
    params.wr = def.limit(params.wr, 0, 1, 0);
    /* -> Ver.1.18.4 */
    params.ver_script = $.selectNum_id("select-script-Ver");  // Ver.1.70.14
  }
  /* -> Ver.1.17.4 */
  /* -> Ver.1.20.4 */
  else{
    params.arr_f = self.get_freqs();
    params.amplitude0 *= params.kampli;  // Ver.1.75.14
    params.amplitude1 *= params.kampli;  // Ver.1.75.14
  }
  return self;
};
