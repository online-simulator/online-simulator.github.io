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
  self.regex.macro_prifix = "\\$";  // Ver.1.42.10  // Ver.1.85.19
  self.regex.macro_depthMax = 100;  // Ver.1.85.19
  /* Ver.1.43.11 -> */
  /* Ver.1.85.18 -> */
  self.regex.macro_chars = "0-9a-zA-Z_#\\-";  // Ver.1.101.21 #
  self.regex.make_tag = function(tag){
    var tag_escaped = tag.replace(/[^a-zA-Z0-9\s]/g, "\\$&");
    return (new RegExp(tag_escaped+"(?!["+self.regex.macro_chars+"])", "gm"));
  };
  var sw_flag = (My_entry.flag.hasFlagS)? "s": "";
  self.regex.macros = new RegExp("("+self.regex.macro_prifix+"["+self.regex.macro_chars+"]+)\\(([0-9a-zA-Z_\\-\\+\\=.,:;\\[\\]\\$#@\\s\\x20]*?)\\)", "g"+sw_flag);  // Ver.1.41.9  // Ver.1.42.10  // Ver.1.42.11  // Ver.1.65.14  // Ver.1.84.16 #  // Ver.1.85.19  // Ver.1.101.21 @
  self.regex.macro = new RegExp(self.regex.macro_prifix+"["+self.regex.macro_chars+"]+");  // Ver.1.41.9  // Ver.1.42.10  // Ver.1.85.19
  /* -> Ver.1.85.18 */
  self.regex.mb = new RegExp("\\{.*?\\}", "g"+sw_flag);
  self.regex.ml = new RegExp("^\\[.*?\\]$", "g"+sw_flag);  // Ver.1.101.21
  /* -> Ver.1.43.11 */
  self.regex.rb = /\{|\}/g;
  self.regex.rl = /\[|\]/g;
  self.regex.qn = /^(.*)?b(.*)?$/;  // Ver.1.19.4
  self.regex.oc = /^o([+-]?\d+)c(\d+)$/;  // Ver.1.13.4
  self.regex.nc = /^n(\d+)$/;  // Ver.1.13.4
  self.regex.sn = /^([A-G])([+-]?\d+)?([sf#bn]*)$/;  // Ver.1.14.4  // Ver.1.84.15  // Ver.1.94.19  // Ver.1.94.21  // Ver.1.101.21
  self.regex.chord = /^([A-G][+-]?\d+?[sf#bn]*)\[(.*?)\](?:@(.*))?$/;  // Ver.1.101.21
  self.regex.sharp = /s|#/g;  // Ver.1.84.15
  self.regex.flat = /f|b/g;  // Ver.1.84.15
  self.regex.natural = /n/g;  // Ver.1.94.19
  self.regex.freq = /^f(.*)/;  // Ver.1.19.4
  self.regex.rest = /^r$/;  // Ver.1.65.14
  self.regex.table = "\\[(.*?)\\]";  // Ver.1.71.14  // Ver.1.97.21
  self.msec_60BPM = 1000;  // Ver.1.19.4
  /* Ver.1.84.15 -> */
  self.tables = {};  // Ver.1.97.21
  self.tables.note2index = {C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, "E#": 5, Fb: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11, "B#": 0, "Cb": 11};  // Ver.1.90.19  // Ver.1.94.20
  self.tables.notes_sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  self.tables.notes_flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
  self.tables.tunes = ["Equal", "Pure", "Pythagorean", "MeanTone", "Young2", "Schnittger", "WerckMeister3", "KirnBerger3", "Vallotti", "PureMinor", "WerckMeister4", "WerckMeister5"];  // Ver.1.92.19
  self.tables.modes = ["Major", "Ionian", "Dorian", "Phrygian", "Lydian", "Mixolydian", "Minor", "Aeolian", "Locrian", "HarmonicMinor", "MelodicMinor", "Bayati", "Rast", "Saba", "PhrygianDominant", "Hijaz", "Sikah", "Marva", "Miyakobushi", "Ryukyu"];  // Ver.1.87.19  // Ver.1.92.19  // Ver.1.96.21
  self.tables.rules = {  // common rules by relative degrees from root or C  // Ver.1.96.21
    Major: {
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
    Saba:   {degrees: [2, 3, 4, 6, 7, 8], alterations: [-0.5, -1, -1, -1, -1, -1]},  // Ver.1.92.19  // Ver.1.96.21
    PhrygianDominant: {degrees: [2, 6, 7], alterations: [-1, -1, -1]},  // Ver.1.92.19
    Sikah:  {degrees: [3, 4, 6, 7, 8], alterations: [-0.5, -1, -1, -0.5, -1]},  // Ver.1.96.21
    Marva:  {degrees: [2, 4, 5], alterations: [-1, 1, null]},  // Ver.1.96.21
    Miyakobushi:      {degrees: [2, 3, 7], alterations: [-1, null, null]},  // Ver.1.96.21
    Ryukyu: {degrees: [2, 6], alterations: [null, null]}  // Ver.1.96.21
  };
  self.tables.rules["Ionian"] = self.tables.rules["Major"];
  self.tables.rules["Aeolian"] = self.tables.rules["Minor"];
  self.tables.rules["Hijaz"] = self.tables.rules["PhrygianDominant"];  // Ver.1.96.21
  /* Ver.1.93.19 -> */
  /* Ver.1.90.19 -> */
  self.str_base = "A4";  // Ver.1.94.21
  self.pitch_base = 440;  // Ver.1.94.21
  self.edo = 12;
  self.octave0 = -1;  // Ver.1.96.21
  self.octaves = 11;
  self.cents_in_octave = 1200;
  var PC = 531441/524288;  // Pythagorean Comma
  var SC = 81/80;          // Syntonic Comma
  var cents_PC = self.cents_in_octave*Math.LOG2E*Math.log(PC);  // cents of PC
  var cents_SC = self.cents_in_octave*Math.LOG2E*Math.log(SC);  // cents of SC
  var edo = self.edo;
  self.tables.cents_deviation = {
    Young2:        [0, -2, -3, -1, -4, -1, -3, -2, -2, -4, -1, -3].map(function(v){return v*(cents_PC/edo);}),
    WerckMeister3: [0, -5, -4, -3, -5, -1, -6, -2, -4, -6, -2, -4].map(function(v){return v*(cents_PC/edo);}),
    WerckMeister4: [0, -4, -2, -4, -4, 2, -4, -2, -4, -4, -2, -2].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    WerckMeister5: [0, -2, -2, -2, -4, 2, -2, -2, -2, -4, 0, -2].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    Vallotti:      [0, -2, -4, -2, -6, 2, -4, -2, -2, -6, 0, -4].map(function(v){return v*(cents_PC/edo);}),  // Ver.1.92.19
    Schnittger:    [0, -2, -6, -2, -8, 0, -4, -3, -2, -7, -2, -4].map(function(v){return v*(cents_PC/(edo*2));}),
    KirnBerger3:   [[0, 0], [3, -9], [-2, 0], [-3, 0], [4, -12], [-1, 0], [3, -9], [-1, 0], [-4, 0], [-4, 0], [-2, 0], [-6, 0]].map(function(v){return v[0]*(cents_PC/edo)+v[1]*(cents_SC/edo);})
  };
  /* Ver.1.97.21 -> */
  /* Ver.1.96.21 -> */
  /* Ver.1.94.20 -> */
  self.tables.bases_fifth = {
    Pythagorean: (3/2),                    // 1.5
    MeanTone: Math.pow(5, 1/4),            // 1.4953487812212205
    MeanTone1_6: (3/2)/Math.pow(SC, 1/6),  // 1.4968975827619544
    MeanTone2_9: (3/2)/Math.pow(SC, 2/9),  // 1.4958648702633985
    Equal12: Math.pow(2, 7/12),            // 1.4983070768766815
    Equal19: Math.pow(2, 11/19),           // 1.4937589616544857
    Equal31: Math.pow(2, 18/31),           // 1.4955178823482085
    Equal43: Math.pow(2, 25/43),           // 1.4962957394862462
    Equal53: Math.pow(2, 31/53)            // 1.4999409030781112
  };
  self.step0_fifth = 1;
  self.calc_steps_fifth = function(str_tune){
    var base_fifth = self.tables.bases_fifth[str_tune || "Pythagorean"] || (3/2);
    return Math.round(self.edo*Math.LOG2E*Math.log(base_fifth));
  };
  self.tables.stem2fifth = function(str_tune, idx, alt){
    var offsets_fifth = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5];  // [C, Db, D, Eb, E, F, Gb, G, Ab, A, Bb, B]
    return offsets_fifth[idx]+self.calc_steps_fifth(str_tune)*alt;
  };
  var str_defined = "defined_";
  self.tables.str_defined = str_defined;
  self.tables.ratios_interval = {
    Pure: [1/1, 25/24, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 25/16, 5/3, 9/5, 15/8],
    PureMinor: [1/1, 25/24, 9/8, 6/5, 5/4, 4/3, 45/32, 3/2, 8/5,  5/3, 9/5, 15/8]  // Ver.1.92.19
  };
  var semitones = (self.octaves-1)*self.edo;
  var steps = (self.octaves-1)*self.calc_steps_fifth();
  var cents = (self.octaves-1)*self.cents_in_octave;
  self.tables.ranges = {type: [[0, 1], [-1, 1]], tune: [[-cents, cents]], mode: [[-steps, steps], [-semitones, semitones]]};
  self.tables.initiate_tune = function(tune){
    var _tune = tune;
    if(Array.isArray(tune)){
      var table = tune;
      if(table[0].length === 1){
        self.tables.bases_fifth[str_defined] = table[0][0];
      }
      else if(table[0][0]){
        self.tables.ratios_interval[str_defined] = table[0];
      }
      else{
        self.tables.cents_deviation[str_defined] = table[0];
      }
      _tune = str_defined;
    }
    return _tune;
  };
  self.tables.initiate_mode = function(mode){
    var _mode = mode;
    if(Array.isArray(mode)){
      var table = mode;
      self.tables.rules[str_defined] = {degrees: table[0], alterations: table[1]};
      _mode = str_defined;
    }
    return _mode;
  };
  self.tables.terminate = function(){
    delete self.tables.rules[str_defined];
    delete self.tables.ratios_interval[str_defined];
    delete self.tables.bases_fifth[str_defined];
    delete self.tables.cents_deviation[str_defined];
  };
  /* -> Ver.1.94.20 */
  /* -> Ver.1.96.21 */
  /* -> Ver.1.97.21 */
  /* Ver.1.85.17 */
  self.get_ratio_from_C = function(str_tune, obj_root, obj_note, useEqual_interpolation){  // Ver.1.94.20  // Ver.1.94.21  // Ver.1.101.22
    var isLog_interpolation = !(useEqual_interpolation);  // ln(r/r0)=alt_frac*ln(r1/r0)  // Ver.1.101.22 for Pure microtones with float inversion
    var edo = self.edo;
    var octaves = self.octaves;
    var tables = self.tables;  // Ver.1.97.21
    /* Ver.1.101.22 -> */
    var idx_root = obj_root.idx;
    var alt_root = obj_root.alt;
    var alt_root_int = Math.floor(alt_root);
    var alt_root_frac = alt_root-alt_root_int;
    var calc_ratio_from_root = function(idx, alt){
      var alt_int = Math.floor(alt);  // |alteration| < 128(MIDI) < octaves*edo  // floor standardized for doctave
      var alt_frac = alt-alt_int;
      var get_ratio = null;
      if(str_tune === "Equal"){
        get_ratio = function(i){return Math.pow(2, (idx+alt_int+i)/edo);};
      }
      else if(tables.ratios_interval[str_tune]){  // Ver.1.92.19  // Ver.1.97.21
        var semitones_from_root = (idx+alt_int-(idx_root+alt_root_int)+octaves*edo)%edo;  // Ver.1.94.21
        get_ratio = function(i){return tables.ratios_interval[str_tune][(semitones_from_root+i)%edo]*((i && (semitones_from_root+i)%edo === 0)? 2: 1);};
      }
      else if(tables.bases_fifth[str_tune]){  // Ver.1.97.21
        var base = tables.bases_fifth[str_tune];
        var root_fifth = self.tables.stem2fifth(str_tune, idx_root, alt_root);  // Ver.1.94.20  // Ver.1.94.21
        get_ratio = function(i){return Math.pow(base, self.tables.stem2fifth(str_tune, idx, alt+i)-root_fifth);};
      }
      else if(tables.cents_deviation[str_tune]){  // Ver.1.97.21
        var semitones_from_C = (idx+alt_int+octaves*edo)%edo;
        get_ratio = function(i){return Math.pow(2, (idx+alt_int+i)/edo)*Math.pow(2, tables.cents_deviation[str_tune][(semitones_from_C+i)%edo]/self.cents_in_octave);};
      }
      else return NaN;  // Ver.1.97.21 error
      var r0 = get_ratio(0);
      var base = (isLog_interpolation)? (get_ratio(1)/r0): Math.pow(2, 1/edo);
      return r0*Math.pow(base, alt_frac-alt_root_frac);
    };
    /* -> Ver.1.101.22 */
    var ratio_target = calc_ratio_from_root(obj_note.idx, obj_note.alt);  // Ver.1.94.21
    var ratio_C      = calc_ratio_from_root(0, 0);
    var _ratio = ratio_target/ratio_C;
    if(isNaN(_ratio) || !(isFinite(_ratio)) || _ratio/2 < Number.EPSILON) return NaN;  // Ver.1.97.21 for table_defined
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
    if(self.isSingle && (elem.tagName.toUpperCase() === "SELECT" || elem.id === "input-A4" || elem.id === "checkbox-lockPitch" || elem.id === "checkbox-useEqual_interpolation")){  // Ver.1.84.15  // Ver.1.91.19  // Ver.1.101.22
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
My_entry.handler_wave.prototype.str_oc_nc2str_note = function(str_oc_nc, root, opt_sw_sharp2flat){
  var self = this;
  var edo = self.edo;
  var mc_oc = str_oc_nc.match(self.regex.oc);
  var mc_nc = str_oc_nc.match(self.regex.nc);  // Ver.1.13.4
  var octave = (mc_oc)? Number(mc_oc[1]): -1;
  var num = (mc_oc)? Number(mc_oc[2]): Number(mc_nc[1]);  // num >= 0
  /* Ver.1.90.19 -> */
  octave += Math.floor(num/edo);
  var idx_note = num%edo;
  var useFlat = opt_sw_sharp2flat;
  if(useFlat === undefined || useFlat === null){
    var idx_root = (isNaN(root))? self.tables.note2index[root]: Number(root)%edo;  // Ver.1.94.20
    var idx_note_from_root = (idx_note-idx_root+edo)%edo;
    var isFlatKey = [1, 3, 5, 6, 8, 10].indexOf(idx_root) !== -1 || (typeof root === "string" && root.indexOf("b") !== -1);  // [Db, Eb, F, Gb, Ab, Bb]
    useFlat = [1, 3, 8, 10].indexOf(idx_note_from_root) !== -1 || isFlatKey;  // [Db, Eb, Ab, Bb]
  }
  var str_note = self.tables["notes_"+((useFlat)? "flat": "sharp")][idx_note];  // Ver.1.44.11
  /* -> Ver.1.90.19 */
  return self.make_str(octave, str_note);
};
My_entry.handler_wave.prototype.str_note_or_root2obj = function(str_note_or_root){
  var self = this;
  var mc = str_note_or_root.match(self.regex.sn);
  if(!(mc)) return false;
  var octave0 = self.octave0;
  var str_stem = mc[1];
  var idx_stem = self.tables.note2index[str_stem];
  var octave = (mc[2] !== undefined)? Number(mc[2]): octave0;  // Ver.1.96.21
  var str_sfn = mc[3] || "";
  var alteration = (str_sfn.match(self.regex.sharp) || []).length-(str_sfn.match(self.regex.flat) || []).length;
  var num_natural = (str_sfn.match(self.regex.natural) || []).length;  // Ver.1.95.21
  return {str: str_stem, idx: idx_stem, oct: octave, alt: alteration, numN: num_natural};  // Ver.1.95.21
};
/* Ver.1.96.21 -> */
My_entry.handler_wave.prototype.get_alt_mode = function(str_tune, rules, obj_root, obj_note){  // Ver.1.97.21
  var self = this;
  var octave0 = self.octave0;
  var octaves = self.octaves;
  var step0_fifth = self.step0_fifth;  // Ver.1.97.21
  var steps_fifth = self.calc_steps_fifth(str_tune);  // Ver.1.97.21
  var char2diatonic = {C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6};
  var d_stem_root = char2diatonic[obj_root.str];  // natural root  // Ver.1.94.19
  var d_stem_note = char2diatonic[obj_note.str];
  var degree_note_from_root = (d_stem_note-d_stem_root)+(obj_note.oct-obj_root.oct)*steps_fifth+step0_fifth;
  var i_note = rules.degrees.indexOf(degree_note_from_root);
  if(i_note === -1 && (degree_note_from_root < step0_fifth || degree_note_from_root > step0_fifth+steps_fifth-1)){
    var degree_base = ((degree_note_from_root-step0_fifth)%steps_fifth+octaves*steps_fifth)%steps_fifth+step0_fifth;
    for(var doctave=octaves; doctave>=0; --doctave){
      i_note = rules.degrees.indexOf((octave0+doctave-obj_root.oct)*steps_fifth+degree_base);  // for higher notes
      if(i_note !== -1) break;
    }
  }
  var _alt_mode = (i_note === -1 || obj_note.numN)? 0: rules.alterations[i_note];  // Ver.1.94.19  // Ver.1.95.21
  if(_alt_mode === undefined || _alt_mode === null) _alt_mode = NaN;  // for skip
  return _alt_mode;
};
My_entry.handler_wave.prototype.get_ratio_altered_from_C = function(str_tune, obj_root, obj_note, useEqual_interpolation){  // Ver.1.101.22
  var self = this;
  var edo = self.edo;
  var octave0 = self.octave0;
  var semitones_from_base = obj_note.idx+Math.floor(obj_note.alt)+(obj_note.oct-octave0)*edo;
  var doctave = Math.floor(semitones_from_base/edo);
  var _ratio = self.get_ratio_from_C(str_tune, obj_root, obj_note, useEqual_interpolation);  // Ver.1.94.20  // Ver.1.101.22
  _ratio *= Math.pow(2, doctave);
  return _ratio;
};
/* -> Ver.1.96.21 */
/* Ver.1.93.19 */
/* Ver.1.85.17 */
/* Ver.1.44.11 */
My_entry.handler_wave.prototype.calc_freq = function(notes, freq_base, tune, mode, options){  // Ver.1.90.19  // Ver.1.91.19  // Ver.1.100.21  // Ver.1.101.22
  var self = this;
  var _freq = NaN;
  var edo = self.edo;
  var str_base = notes.base;  // Ver.1.100.21
  var str_root = (isNaN(notes.root))? notes.root: self.tables.notes_sharp[notes.root];  // Ver.1.100.21
  var str_note = notes.note;  // Ver.1.100.21
  var mc_oc = str_note.match(self.regex.oc);
  var mc_nc = str_note.match(self.regex.nc);  // Ver.1.13.4
  if(mc_oc || mc_nc) str_note = self.str_oc_nc2str_note(str_note, notes.root, options.sw_sharp2flat);  // Ver.1.13.4  // o4c9 || n69 -> A4  // Ver.1.100.21  // Ver.1.101.22
  var mc_sn = str_note.match(self.regex.sn);  // Ver.1.14.4
  var mc_f = str_note.match(self.regex.freq);
  var mc_r = str_note.match(self.regex.rest);
  var isNote = false;
  /* Ver.1.14.4 -> */
  if(mc_sn && mc_sn[1]){  // A4 || A4# || A4## || A4###... || A4bbb... || A4n#b  // Ver.1.100.21 || A
    isNote = true;
  }
  /* -> Ver.1.14.4 */
  else if(mc_f){
    _freq = Number(mc_f[1]);
  }
  else if(mc_r){
    _freq = 0;
  }
  else{
    _freq = Number(str_note);
  }
  /* Ver.1.90.19 -> */
  if(str_base && str_root && isNote){  // Ver.1.100.21
    var tune = self.tables.initiate_tune(tune);  // Ver.1.97.21
    var mode = self.tables.initiate_mode(mode);  // Ver.1.97.21
    var str_tune = (isNaN(tune))? tune: self.tables.tunes[Number(tune)];
    var str_mode = (isNaN(mode))? mode: self.tables.modes[Number(mode)];
    var obj_base = self.str_note_or_root2obj(str_base);
    var obj_root = self.str_note_or_root2obj(str_root);
    var obj_note = self.str_note_or_root2obj(str_note);
    var useEqual_interpolation = options.useEqual_interpolation;  // Ver.1.101.22
    obj_note.alt += notes.alt_chord || 0;  // Ver.1.101.21
    var rules = (obj_root.numN || obj_note.numN >= 2)? null: self.tables.rules[str_mode] || self.tables.rules[self.tables.modes[0]];  // Ver.1.95.21
    /* Ver.1.96.21 -> */
    if(rules){
      obj_note.alt += self.get_alt_mode(str_tune, rules, obj_root, obj_note);  // Ver.1.97.21
      if(isNaN(obj_note.alt)) return 0;  // skip
      if(options.lockPitch) obj_base.alt += self.get_alt_mode(str_tune, rules, obj_root, obj_base) || 0;  // || 0 for base  // Ver.1.97.21  // Ver.1.101.22
    }
    var doctave = options.octave0 || 0;  // Ver.1.101.22
    _freq = freq_base;
    _freq *= Math.pow(2, doctave);
    _freq *= self.get_ratio_altered_from_C(str_tune, obj_root, obj_note, useEqual_interpolation)/self.get_ratio_altered_from_C(str_tune, obj_root, obj_base, useEqual_interpolation);  // (ratio_note_altered_from_C/ratio_base_pure_from_C)/(ratio_base_altered_from_C/ratio_base_pure_from_C)  // Ver.1.101.22
    /* -> Ver.1.96.21 */
    self.tables.terminate();  // Ver.1.97.21
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
  var useEqual_interpolation = self.entry.$.checkbox_id("checkbox-useEqual_interpolation");  // Ver.1.101.22
  if(str){
    var octave0 = self.entry.$.selectNum_id("select-octave");
    var sw_sharp2flat = self.entry.$.checkbox_id("checkbox-sharp2flat");
    _freq = self.calc_freq({root: root, note: str}, A4, tune, mode, {lockPitch: lockPitch, useEqual_interpolation: useEqual_interpolation, octave0: octave0, sw_sharp2flat: sw_sharp2flat});  // Ver.1.91.19  // Ver.1.100.21  // Ver.1.101.22
  }
  else{
    var octave = self.entry.$.selectNum_id("select-octave");
    var note = self.entry.$.selectVal_id("select-note");
    var str = self.make_str(octave, note);
    _freq = self.calc_freq({root: root, note: str}, A4, tune, mode, {lockPitch: lockPitch, useEqual_interpolation: useEqual_interpolation});  // Ver.1.91.19  // Ver.1.100.21  // Ver.1.101.22
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
  params.useEqual_interpolation = $.checkbox_id("checkbox-useEqual_interpolation");  // Ver.1.101.22
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
