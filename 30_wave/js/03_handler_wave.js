// online-simulator.github.io

My_entry.handler_wave = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_main);

My_entry.handler_wave.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "def"]);  // Ver.1.47.11  // Ver.1.84.15  // Ver.1.94.21
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
  self.regex.macro_prifix = "\\$";  // Ver.1.42.10  // Ver.1.85.19
  self.regex.macro_depthMax = 100;  // Ver.1.85.19
  /* Ver.1.43.11 -> */
  /* Ver.1.85.18 -> */
  self.regex.macro_chars = "0-9a-zA-Z_\\-";
  self.regex.make_tag = function(tag){
    var tag_escaped = tag.replace(/[^a-zA-Z0-9\s]/g, "\\$&");
    return (new RegExp(tag_escaped+"(?!["+self.regex.macro_chars+"])", "gm"));
  };
  var sw_flag = (My_entry.flag.hasFlagS)? "s": "";
  self.regex.macros = new RegExp("("+self.regex.macro_prifix+"["+self.regex.macro_chars+"]+)\\(([0-9a-zA-Z_\\-\\+\\=.,:;\\[\\]\\$#\\s\\x20]*?)\\)", "g"+sw_flag);  // Ver.1.41.9  // Ver.1.42.10  // Ver.1.42.11  // Ver.1.65.14  // Ver.1.84.16  // Ver.1.85.19
  self.regex.macro = new RegExp(self.regex.macro_prifix+"["+self.regex.macro_chars+"]+");  // Ver.1.41.9  // Ver.1.42.10  // Ver.1.85.19
  /* -> Ver.1.85.18 */
  self.regex.mb = new RegExp("\\{.*?\\}", "g"+sw_flag);
  self.regex.ml = new RegExp("\\[.*?\\]", "g"+sw_flag);
  /* -> Ver.1.43.11 */
  self.regex.rb = /\{|\}/g;
  self.regex.rl = /\[|\]/g;
  self.regex.qn = /^(.*)?b(.*)?$/;  // Ver.1.19.4
  self.regex.oc = /^o([+-]?\d+)c(\d+)$/;  // Ver.1.13.4
  self.regex.nc = /^n(\d+)$/;  // Ver.1.13.4
  self.regex.sn = /^([A-G]?)([+-]?\d+)?([sf#bn]*)$/;  // Ver.1.14.4  // Ver.1.84.15  // Ver.1.94.19  // Ver.1.94.21
  self.regex.sharp = /s|#/g;  // Ver.1.84.15
  self.regex.flat = /f|b/g;  // Ver.1.84.15
  self.regex.natural = /n/g;  // Ver.1.94.19
  self.regex.freq = /^f(.*)/;  // Ver.1.19.4
  self.regex.rest = /^r$/;  // Ver.1.65.14
  self.regex.type = /type=\[(.*?):(.*?)\]/g;  // Ver.1.71.14
  self.regex.table = /\[(.*?):(.*?)\]/;  // Ver.1.71.14
  self.msec_60BPM = 1000;  // Ver.1.19.4
  /* Ver.1.84.15 -> */
  self.note2index = {C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11, "Cb": 11, "B#": 0};  // Ver.1.90.19  // Ver.1.94.20
  self.notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  self.notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  self.tunes = ["Equal", "Pure", "Pythagorean", "MeanTone", "Young2", "Schnittger", "WerckMeister3", "KirnBerger3", "Vallotti", "PureMinor", "WerckMeister4", "WerckMeister5"];  // Ver.1.92.19
  self.modes = ["Major", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Minor", "Aeolian", "Locrian", "HarmonicMinor", "MelodicMinor", "Bayati", "Rast", "Saba", "PhrygianDominant"];  // Ver.1.87.19  // Ver.1.92.19
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
    },
    Bayati: {degrees: [2, 3, 6, 7], alterations: [-0.5, -1, -1, -1]},  // Ver.1.87.19
    Rast:   {degrees: [3, 7], alterations: [-0.5, -0.5]},  // Ver.1.87.19
    Saba:   {degrees: [2, 3, 4, 6, 7], alterations: [-0.5, -1, -1, -1, -1]},  // Ver.1.92.19
    PhrygianDominant: {degrees: [2, 6, 7], alterations: [-1, -1, -1]}  // Ver.1.92.19
  };
  /* Ver.1.93.19 -> */
  /* Ver.1.90.19 -> */
  self.str_base = "A4";  // Ver.1.94.21
  self.pitch_base = 440;  // Ver.1.94.21
  self.edo = 12;
  self.octaves = 11;
  self.cents_in_octave = 1200;
  var PC = 531441/524288;  // Pythagorean Comma
  var SC = 81/80;          // Syntonic Comma
  var cents_PC = self.cents_in_octave*Math.LOG2E*Math.log(PC);  // cents of PC
  var cents_SC = self.cents_in_octave*Math.LOG2E*Math.log(SC);  // cents of SC
  var edo = self.edo;
  self.cents_deviation = {
    Young2:        [0, -2, -3, -1, -4, -1, -3, -2, -2, -4, -1, -3].map(function(v){return v*(cents_PC/edo);}),
    WerckMeister3: [0, -5, -4, -3, -5, -1, -6, -2, -4, -6, -2, -4].map(function(v){return v*(cents_PC/edo);}),
    WerckMeister4: [0, -4, -2, -4, -4, 2, -4, -2, -4, -4, -2, -2].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    WerckMeister5: [0, -2, -2, -2, -4, 2, -2, -2, -2, -4, 0, -2].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    Vallotti:      [0, -2, -4, -2, -6, 2, -4, -2, -2, -6, 0, -4].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    Schnittger:    [0, -2, -6, -2, -8, 0, -4, -3, -2, -7, -2, -4].map(function(v){return v*(cents_PC/(edo*2));}),
    KirnBerger3:   [[0, 0], [3, -9], [-2, 0], [-3, 0], [4, -12], [-1, 0], [3, -9], [-1, 0], [-4, 0], [-4, 0], [-2, 0], [-6, 0]].map(function(v){return v[0]*(cents_PC/edo)+v[1]*(cents_SC/edo);})
  };
  /* Ver.1.94.20 */
  self.stem2fifth = function(idx, alt){
    var fifth_step = Math.round(self.edo*Math.LOG2E*Math.log(1.5));
    var cents_offsets = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5];  // [C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B]
    return cents_offsets[idx]+fifth_step*alt;
  };
  /* Ver.1.85.17 */
  self.get_ratio_from_C = function(tune, obj_root, obj_note){  // Ver.1.94.20  // Ver.1.94.21
    var edo = self.edo;
    var octaves = self.octaves;
    var calc_ratio_from_root = function(idx, alt){
      var alt_int = Math.floor(alt);  // |alteration| < 128(MIDI) < octaves*edo
      var alt_frac = alt-alt_int;
      if(tune === "Equal"){
        return Math.pow(2, (idx+alt)/edo);
      }
      else if(tune === "Pure" || tune === "PureMinor"){  // Ver.1.92.19
        var semitones_from_root = (idx+alt_int-(obj_root.idx+obj_root.alt)+octaves*edo)%edo;  // Ver.1.94.21
        var pureTable = (tune === "Pure")?
          [1/1, 25/24, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 25/16, 5/3, 9/5, 15/8]:
          [1/1, 25/24, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5,  5/3, 9/5, 15/8];  // Ver.1.92.19
        var _r = pureTable[semitones_from_root];
        _r *= Math.pow(2, alt_frac/edo);
        return _r;
      }
      else if(tune === "Pythagorean" || tune === "MeanTone"){
        var base = (tune === "Pythagorean")? 1.5: Math.pow(5, 0.25);
        var root_fifth = self.stem2fifth(obj_root.idx, obj_root.alt);  // Ver.1.94.20  // Ver.1.94.21
        var target_fifth = self.stem2fifth(idx, alt);  // Ver.1.94.20
        return Math.pow(base, target_fifth-root_fifth);
      }
      else{
        if(self.cents_deviation[tune]){
          var semitones_from_C = (idx+alt_int+octaves*edo)%edo;
          var _r = Math.pow(2, (idx+alt_int)/edo);
          _r *= Math.pow(2, self.cents_deviation[tune][semitones_from_C]/self.cents_in_octave);
          _r *= Math.pow(2, alt_frac/edo);
          return _r;
        }
      }
      return 1;
    };
    var ratio_target = calc_ratio_from_root(obj_note.idx, obj_note.alt);  // Ver.1.94.21
    var ratio_C      = calc_ratio_from_root(0, 0);
    var _ratio = ratio_target/ratio_C;
    while(_ratio < 1) _ratio *= 2;
    while(_ratio >= 2) _ratio /= 2;
    return _ratio;  // [1, 2)
  };
  /* -> Ver.1.90.19 */
  /* -> Ver.1.93.19 */
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
    if(self.isSingle && (elem.tagName.toUpperCase() === "SELECT" || elem.id === "input-A4" || elem.id === "checkbox-lockPitch")){  // Ver.1.84.15  // Ver.1.91.19
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
/* Ver.1.94.21 -> */
My_entry.handler_wave.prototype.str_note_or_root2obj = function(str_note_or_root){
  var self = this;
  var mc = str_note_or_root.match(self.regex.sn);
  if(!(mc)) return false;
  var str_stem = mc[1];
  var idx_stem = self.note2index[str_stem];
  var octave = (mc[2] === undefined)? null: Number(mc[2]);
  var str_sfn = mc[3] || "";
  var alteration = (str_sfn.match(self.regex.sharp) || []).length-(str_sfn.match(self.regex.flat) || []).length;
  var hasNatural = !!(str_sfn.match(self.regex.natural));
  return {str: str_stem, idx: idx_stem, oct: octave, alt: alteration, hasN: hasNatural};
};
/* Ver.1.93.19 */
/* Ver.1.85.17 */
/* Ver.1.44.11 */
My_entry.handler_wave.prototype.calc_freq = function(str, A4, tune, root, mode, opt_lockPitch, opt_octave0, opt_sw_sharp2flat){  // Ver.1.90.19  // Ver.1.91.19
  var self = this;
  var _freq = NaN;
  var edo = self.edo;
  var mc_oc = str.match(self.regex.oc);
  var mc_nc = str.match(self.regex.nc);  // Ver.1.13.4
  var mc_sn = str.match(self.regex.sn);  // Ver.1.14.4
  var mc_f = str.match(self.regex.freq);
  var mc_r = str.match(self.regex.rest);
  /* Ver.1.13.4 -> */
  if(mc_oc || mc_nc){  // o4c9 || n69 -> A4
    _freq = (A4/self.pitch_base)*self.entry.reference.calc_freq((mc_oc)? Number(mc_oc[1]): -1, (mc_oc)? Number(mc_oc[2]): Number(mc_nc[1]));  // Ver.1.94.21 original Equal restored
  }
  /* -> Ver.1.13.4 */
  else if(mc_f){
    _freq = Number(mc_f[1]);
  }
  else if(mc_r){
    _freq = 0;
  }
  else{
    _freq = Number(str);
  }
  /* Ver.1.90.19 -> */
  if(mc_sn && typeof mc_sn[2] !== "undefined"){  // Ver.1.14.4  // A4 || A4# || A4## || A4###... || A4bbb... || A4n#b
    var char2diatonic = {C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6};
    var freq_base = A4;
    var str_tune = (isNaN(tune))? tune: self.tunes[Number(tune)];
    var str_root = (isNaN(root))? root: self.notes_sharp[Number(root)%edo];
    var str_mode = (isNaN(mode))? mode: self.modes[Number(mode)];
    var obj_root = self.str_note_or_root2obj(str_root);
    var obj_note = self.str_note_or_root2obj(str);
    var obj_base = self.str_note_or_root2obj(self.str_base);
    var rules = self.rules[str_mode] || self.rules[self.modes[0]];
    if(rules && rules.degrees){
      var d_stem_root = char2diatonic[obj_root.str];  // natural root  // Ver.1.94.19
      var d_stem_note = char2diatonic[obj_note.str];
      var degree_note_from_root = ((d_stem_note-d_stem_root+7)%7)+1;
      var i_note = rules.degrees.indexOf(degree_note_from_root);
      if(i_note !== -1 && !(obj_note.hasN) && !(obj_root.hasN)){  // Ver.1.94.19
        obj_note.alt += rules.alterations[i_note];
      }
      if(opt_lockPitch){
        var d_stem_base = char2diatonic[obj_base.str];
        var degree_base_from_root = ((d_stem_base-d_stem_root+7)%7)+1;
        var i_base = rules.degrees.indexOf(degree_base_from_root);
        if(i_base !== -1 && !(obj_base.hasN) && !(obj_root.hasN)){
          obj_base.alt += rules.alterations[i_base];
        }
      }
    }
    var doctave = (opt_octave0 || 0);
    doctave += obj_note.oct-obj_base.oct;
    doctave += Math.floor((obj_note.idx+obj_note.alt)/edo)-Math.floor((obj_base.idx+obj_base.alt)/edo);
    var ratio_note_from_C = self.get_ratio_from_C(str_tune, obj_root, obj_note);  // Ver.1.94.20
    var ratio_base_from_C = self.get_ratio_from_C(str_tune, obj_root, obj_base);  // Ver.1.94.20
    _freq = freq_base*Math.pow(2, doctave)*(ratio_note_from_C/ratio_base_from_C);
  }
  /* -> Ver.1.90.19 */
  return _freq;
};
/* -> Ver.1.94.21 */
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
  var lockPitch = self.entry.$.checkbox_id("checkbox-lockPitch");  // Ver.1.91.19
  if(str){
    var octave0 = self.entry.$.selectNum_id("select-octave");
    var sw_sharp2flat = self.entry.$.checkbox_id("checkbox-sharp2flat");
    _freq = self.calc_freq(str, A4, tune, root, mode, lockPitch, octave0, sw_sharp2flat);  // Ver.1.91.19
  }
  else{
    var octave = self.entry.$.selectNum_id("select-octave");
    var note = self.entry.$.selectVal_id("select-note");
    var str = self.make_str(octave, note);
    _freq = self.calc_freq(str, A4, tune, root, mode, lockPitch);  // Ver.1.91.19
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
  params.lockPitch = $.checkbox_id("checkbox-lockPitch");  // Ver.1.91.19
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
