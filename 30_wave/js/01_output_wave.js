// online-simulator.github.io

// Reference
// soundfile.sapp.org/doc/WaveFormat/
// developer.mozilla.org

/*

dependency files:
  <script type="text/javascript" src="../00_common/js/000_entry/000_entry.js"></script>
  <script type="text/javascript" src="../00_common/js/00_class/01_math_wave.js"></script>
  <script type="text/javascript" src="../00_common/js/02_handler/02_handler_baseview.js"></script>
  <script type="text/javascript" src="../00_common/js/03_original/03_original_main.js"></script>
  <script type="text/javascript" src="js/01_output_wave.js"></script>

Native method used:
  window.btoa()
  new Audio()

ex. of use:
  <button onclick="new My_entry.output_wave().output_sound({sec: 1, arr_f: [523, 660, 784, 3000], arr_g: null});">play</button>
  <button onclick="new My_entry.output_wave().output_sound({sec: 1, arr_f: [523, 660, 784, 3000], arr_g: []});">play</button>
  <button onclick="new My_entry.output_wave().output_sound({sec: 1, arr_f: [523, 660, 784, 3000], arr_g: [,1]});">play</button>

instance method:
  new My_entry.output_wave().output_sound(params, opt_volume);

    params: object
      sec: number
        play-time[sec] >= 0
      arr_f: array
        frequency[Hz]
      arr_g: array
        gain >= 0
        arr_g: null -> default LPF gains
        arr_g: []   -> converted to ones array [1, 1, ..., 1]
        arr_g: [1,] -> fill-in with zero array [1, 0, ..., 0]

    opt_volume: number
      0 <= volume <= 1
      default: 0.5

*/

My_entry.output_wave = function(Bytes_perSample, samples_perSecond, number_channels){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.output_wave.config =
My_entry.output_wave.prototype.config = {
  ERROR: {
    title: "[MyErr]"
  }
};
My_entry.output_wave.prototype.init = function(Bytes_perSample, samples_perSecond, number_channels){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["math_wave"]);
  self.arr_prop_baseview = [, "Uint", "Int", , "Uint"];
  self.arr_amplitude = [, 128-1, 32768-1];
  self.arr_offset    = [, 128,   0];
  self.handler_baseview = new self.constructors.handler_baseview(self.arr_prop_baseview);
  self.arr_buffer = self.handler_baseview.arr_buffer;
  self.arr_viewset = self.handler_baseview.set;
  self.title_error = My_entry.output_wave.config.ERROR.title;
  self.audio = null;
  self.base64 = "";
  self.binary = "";
  self.func_t = null;
  self.number_samples = 0;
  self.Bytes_subChunk2 = 0;
  // wave format
  self.id_format         = 1;
  self.Bytes_subChunk1   = 2+2+4+4+2+2;
  self.Bytes_perSample   = Bytes_perSample || 2 || 1;
  self.bits_perSample    = self.Bytes_perSample*8;
  self.amplitude         = self.arr_amplitude[self.Bytes_perSample];
  self.offset            = self.arr_offset[self.Bytes_perSample];
  self.samples_perSecond = samples_perSecond || 44100 || 48000 || 96000;
  self.number_channels   = number_channels || 2 || 1;
  self.Bytes_perBlock    = self.Bytes_perSample*self.number_channels;
  self.Bytes_perSecond   = self.Bytes_perBlock*self.samples_perSecond;
  self.ba_type = {b: /_rand$/, a: ""};  // Ver.1.34.6
  return self;
};
My_entry.output_wave.prototype.binary2buffer = function(binary){
  var self = this;
  var arrb_uint8 = new Uint8Array(binary.length);
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    arrb_uint8[i] = binary.charCodeAt(i);
  });
  var _buffer = arrb_uint8.buffer;
  return _buffer;
};
My_entry.output_wave.prototype.buffer2binary = function(buffer){
  var self = this;
  var _binary = "";
  var arrb_uint8 = new Uint8Array(buffer);
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    _binary += String.fromCharCode(uint8);
  });
  return _binary;
};
My_entry.output_wave.prototype.int2binary_BE = function(n, dec){
  var self = this;
  var isLE_default = false;
  var isLE = arguments[2] || isLE_default;
  var idec = Math.floor(dec);
  self.arr_viewset[n](0, idec, isLE);
  return self.buffer2binary(self.arr_buffer[n]);
};
My_entry.output_wave.prototype.int2binary_LE = function(n, dec){
  var self = this;
  return self.int2binary_BE.call(self, n, dec, true);
};
My_entry.output_wave.prototype.str2binary_BE = function(n, bstr){
  var self = this;
  var isLE_default = false;
  var isLE = arguments[2] || isLE_default;
  for(var i=0; i<n; ++i){
    var offset = (isLE)? n-1-i: i;
    self.handler_baseview.arr_view[n].setUint8(offset, bstr.charCodeAt(i));
  }
  return self.buffer2binary(self.arr_buffer[n]);
};
My_entry.output_wave.prototype.str2binary_LE = function(n, bstr){
  var self = this;
  return self.str2binary_BE.call(self, n, bstr, true);
};
My_entry.output_wave.prototype.get_fileSize = function(number_samples){
  var self = this;
  var Bytes_subChunk1 = self.Bytes_subChunk1;
  var Bytes_subChunk2 = self.Bytes_perBlock*number_samples;
  return (4+4+4+4+4+Bytes_subChunk1+4+4+Bytes_subChunk2);
};
My_entry.output_wave.prototype.get_binary_header = function(number_samples){
  var self = this;
  self.Bytes_subChunk2 = self.Bytes_perBlock*number_samples;
  self.Bytes_chunks = self.get_fileSize(number_samples)-(4+4);  // Format~
  // header
  var _binary = "";
  // ChunkID
  _binary += self.str2binary_BE(4, "RIFF");  // _binary += "RIFF";
  // ChunkSize
  _binary += self.int2binary_LE(4, self.Bytes_chunks);
  // Format
  _binary += self.str2binary_BE(4, "WAVE");  // _binary += "WAVE";
  // Subchunk1ID
  _binary += self.str2binary_BE(4, "fmt ");  // _binary += "fmt ";
  // Subchunk1Size
  _binary += self.int2binary_LE(4, self.Bytes_subChunk1);
  // AudioFormat
  _binary += self.int2binary_LE(2, self.id_format);
  // NumChannels
  _binary += self.int2binary_LE(2, self.number_channels);
  // SampleRate
  _binary += self.int2binary_LE(4, self.samples_perSecond);
  // ByteRate
  _binary += self.int2binary_LE(4, self.Bytes_perSecond);
  // BlockAlign
  _binary += self.int2binary_LE(2, self.Bytes_perBlock);
  // BitsPerSample
  _binary += self.int2binary_LE(2, self.bits_perSample);
  // Subchunk2ID
  _binary += self.str2binary_BE(4, "data");  // _binary += "data";
  // Subchunk2Size
  _binary += self.int2binary_LE(4, self.Bytes_subChunk2);
  return _binary;
};
My_entry.output_wave.prototype.normalize_gains = function(arr_g, gain_type, gain_band){
  var self = this;
  var _arr_g = new Array(arr_g.length);
  var sum_g = 0;
  arr_g.forEach(function(g, i){
    _arr_g[i] = Math.abs(arr_g[i] || 0);
    sum_g += _arr_g[i];
  });
  arr_g.forEach(function(g, i){
    if(sum_g > 1){
      _arr_g[i] /= sum_g;  // normalize
    }
    _arr_g[i] *= gain_type;  // after normalize
    if(gain_band){
      _arr_g[i] *= gain_band;
    }
  });
  return _arr_g;
};
/* Ver.1.25.4 -> */
My_entry.output_wave.prototype.get_gain_loglog = function(f, f0, f1, g0, g1){
  var self = this;
  var _gain = 1;
  _gain = self.entry.math_wave.getY_linear_baseE(f, f0, f1, g0, g1, true, true);
  _gain = self.entry.math_wave.get_limit(_gain, g0, g1);
  return _gain;
};
My_entry.output_wave.prototype.get_gains_loglog = function(arr_f, f0, f1, g0, g1){
  var self = this;
  var _arr_g = new Array(arr_f.length);
  arr_f.forEach(function(f, i){
    _arr_g[i] = self.get_gain_loglog(f, f0, f1, g0, g1);
  });
  return _arr_g;
};
/* -> Ver.1.25.4 */
My_entry.output_wave.prototype.check_gains = function(params){
  var self = this;
  var arr_f = params.arr_f;
  var _arr_g = params.arr_g;
  if(!(_arr_g)){
    // default LPF
    // gain: g0 >= f0~f1[Hz] >= g1
    _arr_g = self.get_gains_loglog(arr_f, params.f0, params.f1, params.g0, params.g1);
  }
  else if(!(_arr_g.length)){
    // ones array
    _arr_g = (function(){
      var __arr_g = new Array(arr_f.length);
      arr_f.forEach(function(f, i){
        __arr_g[i] = 1;
      });
      return __arr_g;
    })();
  }
  else if(_arr_g.length < arr_f.length){
    // fill-in with zero
    _arr_g = (function(){
      var __arr_g = new Array(arr_f.length);
      arr_f.forEach(function(f, i){
        __arr_g[i] = _arr_g[i] || 0;
      });
      return __arr_g;
    })();
  }
  return _arr_g;
};
My_entry.output_wave.prototype.get_gain_type = function(type){
  var self = this;
  var fn = self.entry.math_wave[type.replace(self.ba_type.b, self.ba_type.a) || "sin"];  // Ver.1.34.6
  var rms = self.entry.math_wave.get_rms(1000, fn);
  return Math.min(1, 0.5/rms);  // gain["square"] = 0.5(at rms=1)
};
My_entry.output_wave.prototype.check_error = function(params){
  var self = this;
  var title = self.title_error;
  var sec = params.sec;
  var number_samples = params.number_samples;
  var arr_f = params.arr_f;
  var arr_g = params.arr_g;
  if(isNaN(sec) || sec <= 0) throw new Error(title+"time is invalid");  // Ver.1.17.4
  var fileSize = self.get_fileSize(number_samples);
  var fileSizeMax = params.fileSizeMax*Math.pow(2, 10*2);
  if(fileSize > fileSizeMax) throw new Error(title+"fileSize is over limit");
  arr_f.forEach(function(f, i){
    if(isNaN(f)) throw new Error(title+"frequency is not a number");
    if(arr_g && arr_g[i] && isNaN(arr_g[i])) throw new Error(title+"gain is not a number");
  });
  return self;
};
My_entry.output_wave.prototype.check_params = function(_params){
  var self = this;
  self.check_error(_params);
  var arr_f = _params.arr_f;
  var arr_g = _params.arr_g;
  var arr_g = self.check_gains(_params);
  _params.gain_type = self.get_gain_type(_params.type);
  _params.arr_g_normalized = self.normalize_gains(arr_g, _params.gain_type, _params.gain_band);
  return _params;
};
My_entry.output_wave.prototype.check_arr_params = function(_arr_params){
  var self = this;
  _arr_params.forEach(function(params, i){
    _arr_params[i] = self.check_params(params);
  });
  return _arr_params;
};
My_entry.output_wave.prototype.get_binary_soundData_LE = function(params){
  var self = this;
  var params = self.check_params(params);
  return self.encode_soundData_LE(params);  // Ver.1.25.4
};
My_entry.output_wave.prototype.encode_soundData_LE = function(params){  // Ver.1.25.4
  var self = this;
  var _binary = "";
  var Bytes_perSample = self.Bytes_perSample;
  var amplitude = self.amplitude;
  var offset = self.offset;
  var seconds_perSample = 1/self.samples_perSecond;
  /* Ver.1.16.4 -> */
  var fn = self.entry.math_wave[params.type.replace(self.ba_type.b, self.ba_type.a) || "sin"];  // Ver.1.25.4  // Ver.1.34.6
  var func_t = function(){
    return fn.apply(self.entry.math_wave, arguments);
  };
  /* -> Ver.1.16.4 */
  var phi0 = (params.type.match(self.ba_type.b))? Math.random()*Math.PI*2: 0;  // Ver.1.34.6
  /* Ver.1.25.4 -> */
  /* Ver.1.17.4 */
  /* Ver.1.13.3 */
  /* Ver.1.4.2 */
  // average(cut-off) high frequency input at w0 > 0
  var w0 = params.w0 || 0;
  var p0 = params.p0 || 0;
  var w1 = params.w1 || 0;
  var p1 = params.p1 || 0;
  var oldAmp = 0;
  var dns0 = Math.floor(params.number_samples*p0);
  var dns1 = Math.floor(params.number_samples*p1);
  /* Ver.1.38.8 -> */
  dns1 = Math.min(dns1, params.number_samples-1-dns0);
  var ns_in = dns0;
  var ns_out = params.number_samples-1-dns1;
  var useFade = (params.p0 || params.p1);
  var get_newAmp = function(ns){
    return amplitude;
  };
  if(useFade && params.order_fade === 0){  // Ver.1.39.8
    get_newAmp = function(ns){
      var _newAmp = amplitude;
      var isIn = (ns < ns_in);
      var isOut = (ns > ns_out);
      if(isIn){
        _newAmp = w0*oldAmp+(1-w0)*amplitude;  // w0 first
      }
      else if(isOut){
        _newAmp = w1*oldAmp;
      }
      oldAmp = _newAmp;
      return _newAmp;
    };
  }
  else if(useFade && params.order_fade === 2){
    var fade_o2 = function(x, a, b){
      return Math.pow(1+Math.exp(-a*(x-0.5)), b);
    };
    var a_fade = 10;
    var b0 = -1+(w0-0.5);
    var b1 = -1+(w1-0.5);
    var fade00 = fade_o2(0, a_fade, b0);
    var fade10 = fade_o2(1, a_fade, b0);
    var fade01 = fade_o2(0, a_fade, b1);
    var fade11 = fade_o2(1, a_fade, b1);
    get_newAmp = function(ns){
      var _newAmp = amplitude;
      var isIn = (ns < ns_in);
      var isOut = (ns > ns_out);
      if(isIn){
        var x = ns/dns0;  // /not0
        var fade = fade_o2(x, a_fade, b0);
        _newAmp *= (fade-fade00)/(fade10-fade00);  // /not0
      }
      else if(isOut){
        var x = 1-(ns-ns_out)/dns1;  // /not0
        var fade = fade_o2(x, a_fade, b1);
        _newAmp *= (fade-fade01)/(fade11-fade01);  // /not0
      }
      return _newAmp;
    };
  }
  /* Ver.1.39.8 -> */
  else if(useFade && params.order_fade === 1){
    var fade_o1 = function(x, a){
      return Math.pow(x, a);
    };
    var a0 = Math.pow(2, 2*w0-1);
    var a1 = Math.pow(2, 2*w1-1);
    get_newAmp = function(ns){
      var _newAmp = amplitude;
      var isIn = (ns < ns_in);
      var isOut = (ns > ns_out);
      if(isIn){
        var x = ns/dns0;  // /not0
        var fade = fade_o1(x, a0);
        _newAmp *= fade;
      }
      else if(isOut){
        var x = 1-(ns-ns_out)/dns1;  // /not0
        var fade = fade_o1(x, a1);
        _newAmp *= fade;
      }
      return _newAmp;
    };
  }
  /* -> Ver.1.39.8 */
  /* -> Ver.1.38.8 */
  for(var ns=0; ns<params.number_samples; ++ns){
    var t = ns*seconds_perSample;
    /* Ver.1.20.4 -> */
    var dt = ns/params.number_samples;
    /* Ver.1.31.6 -> */
    var order_a = params.order_a;
    var prop_da = Math.pow(dt, order_a);
    var kamplitude = params.amplitude0+(params.amplitude1-params.amplitude0)*prop_da;
    var order_d = params.order_d;
    var prop_dd = Math.pow(dt, order_d);
    var duty = params.duty0+(params.duty1-params.duty0)*prop_dd;
    /* -> Ver.1.31.6 */
    /* -> Ver.1.20.4 */
    /* Ver.1.24.4 -> */
    var kf0 = 1;
    var kf1 = params.rate;
    /* Ver.1.26.4 -> */
    var order = params.order;
    var prop_dkf = Math.pow(dt, order);
    var kf = kf0+(kf1-kf0)*prop_dkf;
    /* -> Ver.1.26.4 */
    /* -> Ver.1.24.4 */
    var val = 0;
    // composite waves
    params.arr_f.forEach(function(f, i){
      var f0 = f;
      var ft = f*kf;
      var gain_normalized = params.arr_g_normalized[i];
      var gaint = gain_normalized;
      var gain_f0 = self.get_gain_loglog(f0, params.f0, params.f1, params.g0, params.g1);
      if(gain_f0){
        var gain_ft = self.get_gain_loglog(ft, params.f0, params.f1, params.g0, params.g1);
        gaint *= gain_ft/gain_f0;
      }
      val += gaint*func_t(ft, t, phi0, duty);  // gain first  // Ver.1.16.4  // Ver.1.25.4
    });
    val *= get_newAmp(ns);
    val *= kamplitude;  // Ver.1.20.4
    val += offset;
    var binary_perChannel = self.int2binary_LE(Bytes_perSample, val);
    for(var nc=0; nc<params.number_channels; ++nc){
      _binary += binary_perChannel;
    }
  }
  /* -> Ver.1.25.4 */
  return _binary;
};
My_entry.output_wave.prototype.get_binary_wave = function(params){
  var self = this;
  var _binary_header = self.get_binary_header(params.number_samples);
  var _binary_soundData_LE = self.get_binary_soundData_LE(params);
  return _binary_header+_binary_soundData_LE;
};
My_entry.output_wave.prototype.get_buffer = function(params){
  var self = this;
  var _buffer = null;
  var binary = self.get_binary_wave(params);
  _buffer = self.binary2buffer(binary);
  return _buffer;
};
My_entry.output_wave.prototype.make_base64 = function(params){
  var self = this;
  if(window.btoa){
    self.binary = self.get_binary_wave(params);
    self.base64 = "data:audio/wav;base64,"+btoa(self.binary);
  }
  return self;
};
My_entry.output_wave.prototype.add_params = function(params){
  var self = this;
  if(typeof params.f0 === "undefined"){
    params.f0 = 800;
    params.f1 = 4800;
    params.g0 = 1;
    params.g1 = 0.3;
  }
  /* Ver.1.25.4 -> */
  if(typeof params.amplitude0 === "undefined"){
    params.amplitude0 = 1;
  }
  if(typeof params.amplitude1 === "undefined"){
    params.amplitude1 = 1;
  }
  if(typeof params.duty0 === "undefined"){
    params.duty0 = 0.5;
  }
  if(typeof params.duty1 === "undefined"){
    params.duty1 = 0.5;
  }
  if(typeof params.rate === "undefined"){
    params.rate = 1;
  }
  /* -> Ver.1.25.4 */
  /* Ver.1.26.4 -> */
  if(typeof params.order === "undefined"){
    params.order = 1;
  }
  /* Ver.1.31.6 -> */
  if(typeof params.order_d === "undefined"){
    params.order_d = 1;
  }
  if(typeof params.order_a === "undefined"){
    params.order_a = 1;
  }
  /* -> Ver.1.31.6 */
  /* -> Ver.1.26.4 */
  /* Ver.1.38.8 -> */
  if(typeof params.order_fade === "undefined"){
    params.order_fade = 2;
  }
  /* -> Ver.1.38.8 */
  return self;
};
My_entry.output_wave.prototype.get_number_samples = function(sec){
  var self = this;
  return Math.floor(self.samples_perSecond*sec);
};
My_entry.output_wave.prototype.output_sound = function(params, volume){
  var self = this;
  if(self.audio) return false;
  self.number_samples = self.get_number_samples(params.sec)
  params.number_samples = self.number_samples;
  params.number_channels = self.number_channels;
  params.volume = volume;
  self.add_params(params);
  self.make_base64(params);
  self.play_base64(self.base64, volume);
  return self;
};
My_entry.output_wave.prototype.play_base64 = function(base64, volume){
  var self = this;
  if(self.audio) return false;
  if(base64){
    var volume = (typeof volume === "undefined")? 0.5: volume;
    if(isNaN(volume) || volume < 0) throw new Error(self.title_error+"volume is invalid");
    self.audio = new Audio(base64);
    self.audio.volume = Math.min(1, volume);
    self.audio.play();
//    self.audio.onloadeddata = function(){
//    };
    self.audio.onended = function(){
      self.stop_sound();
    };
  }
  return self;
};
My_entry.output_wave.prototype.stop_sound = function(){
  var self = this;
  if(self.audio){
    self.audio.pause();
    self.audio = null;
  }
  return self;
};
