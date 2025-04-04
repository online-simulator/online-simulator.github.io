// online-simulator.github.io

// Reference
// soundfile.sapp.org/doc/WaveFormat/
// developer.mozilla.org

/*

dependency files:
  <script type="text/javascript" src="../00_common/js/000_namespace/000_entry.js"></script>
  <script type="text/javascript" src="../00_common/js/00_class/00_def.js"></script>
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
  new My_entry.original_main().make_instances.call(self, ["def", "math_wave"]);  // Ver.1.47.11
  /* Ver.1.46.11 -> */
  /* Ver.1.48.11 -> */
  self.arr_prop_baseview4header = [, "Uint",   "Int",          ,       "Uint"];
  self.arr_prop_baseview        = [, "Uint",   "Int",     "Int",        "Int"];
  self.arr_amplitude            = [,  128-1, 32768-1, 8388608-1, 2147483648-1];
  self.arr_offset               = [,    128,       0,         0,            0];
  /* -> Ver.1.48.11 */
  self.handler_baseview4header = new self.constructors.handler_baseview(self.arr_prop_baseview4header);
  self.arr_buffer4header = self.handler_baseview4header.arr_buffer;
  self.arr_viewset4header = self.handler_baseview4header.set;
  /* -> Ver.1.46.11 */
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
/* Ver.1.46.11 -> */
My_entry.output_wave.prototype.int2binary4header_BE = function(n, dec){
  var self = this;
  var isLE_default = false;
  var isLE = arguments[2] || isLE_default;
  var idec = Math.floor(dec);
  self.arr_viewset4header[n](0, idec, isLE);
  return self.buffer2binary(self.arr_buffer4header[n]);
};
My_entry.output_wave.prototype.int2binary4header_LE = function(n, dec){
  var self = this;
  return self.int2binary4header_BE.call(self, n, dec, true);
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
My_entry.output_wave.prototype.str2binary4header_BE = function(n, bstr){
  var self = this;
  var isLE_default = false;
  var isLE = arguments[2] || isLE_default;
  for(var i=0; i<n; ++i){
    var offset = (isLE)? n-1-i: i;
    self.handler_baseview4header.arr_view[n].setUint8(offset, bstr.charCodeAt(i));
  }
  return self.buffer2binary(self.arr_buffer4header[n]);
};
My_entry.output_wave.prototype.str2binary4header_LE = function(n, bstr){
  var self = this;
  return self.str2binary4header_BE.call(self, n, bstr, true);
};
/* -> Ver.1.46.11 */
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
  /* Ver.1.46.11 -> */
  // ChunkID
  _binary += self.str2binary4header_BE(4, "RIFF");  // _binary += "RIFF";
  // ChunkSize
  _binary += self.int2binary4header_LE(4, self.Bytes_chunks);
  // Format
  _binary += self.str2binary4header_BE(4, "WAVE");  // _binary += "WAVE";
  // Subchunk1ID
  _binary += self.str2binary4header_BE(4, "fmt ");  // _binary += "fmt ";
  // Subchunk1Size
  _binary += self.int2binary4header_LE(4, self.Bytes_subChunk1);
  // AudioFormat
  _binary += self.int2binary4header_LE(2, self.id_format);
  // NumChannels
  _binary += self.int2binary4header_LE(2, self.number_channels);
  // SampleRate
  _binary += self.int2binary4header_LE(4, self.samples_perSecond);
  // ByteRate
  _binary += self.int2binary4header_LE(4, self.Bytes_perSecond);
  // BlockAlign
  _binary += self.int2binary4header_LE(2, self.Bytes_perBlock);
  // BitsPerSample
  _binary += self.int2binary4header_LE(2, self.bits_perSample);
  // Subchunk2ID
  _binary += self.str2binary4header_BE(4, "data");  // _binary += "data";
  // Subchunk2Size
  _binary += self.int2binary4header_LE(4, self.Bytes_subChunk2);
  /* -> Ver.1.46.11 */
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
My_entry.output_wave.prototype.get_gain_type = function(type, opt_table){  // Ver.1.71.14
  var self = this;
  var fn = self.entry.math_wave[type];  // Ver.1.34.6  // Ver.1.46.11  // Ver.1.71.14
  var rms = self.entry.math_wave.get_rms(1000, fn, 1, opt_table);  // Ver.1.71.14
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
/* Ver.1.47.11 */
My_entry.output_wave.prototype.check_limit = function(_params){
  var self = this;
  var def = self.entry.def;
  /* Ver.1.71.14 -> */
  var type = _params.type;
  if(typeof type === "string"){
    if(type.match(self.ba_type.b)){
      _params._hasRand_phi0 = true;
      _params.type = type.replace(self.ba_type.b, self.ba_type.a);
    }
  }
  else if(type && type.length){
    _params._table = _params.type;
    _params.type = "table";
  }
  /* -> Ver.1.71.14 */
  if(!(self.entry.math_wave[_params.type])){  // Ver.1.71.14
    _params.type = "sin";
  }
  ["duty0", "duty1"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, 1, 0.5);
  });
  ["amplitude0", "amplitude1"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, Number.MAX_VALUE, 1);  // Ver.1.64.14
  });
  ["w0", "p0", "w1", "p1"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, 1, 0);
  });
  if(typeof _params.f0 === "undefined"){
    _params.f0 = 800;
    _params.f1 = 4800;
    _params.g0 = 1;
    _params.g1 = 0.3;
  }
  ["f0", "f1"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, Number.MAX_VALUE, 800);
  });
  ["g0", "g1"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, 1, 1);
  });
  ["rate", "order", "order_d", "order_a"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, Number.MAX_VALUE, 1);
  });
  ["order_fade"].forEach(function(prop){
    _params[prop] = def.limit(Math.floor(_params[prop]), -2, 3, 2);  // Ver.1.49.11
  });
  /* Ver.1.56.11 -> */
  ["f_vib"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], -Number.MAX_VALUE, Number.MAX_VALUE, 0);
  });
  /* -> Ver.1.56.11 */
  /* Ver.1.64.14 -> */
  ["overtone"].forEach(function(prop){
    _params[prop] = def.limit(Math.floor(_params[prop]), 0, 24, 0);
  });
  /* -> Ver.1.64.14 */
  /* Ver.1.74.14 -> */
  ["ti", "to"].forEach(function(prop){
    _params[prop] = def.limit(_params[prop], 0, Number.MAX_VALUE, 0);
  });
  /* -> Ver.1.74.14 */
  return _params;
};
My_entry.output_wave.prototype.check_params = function(_params){
  var self = this;
  self.check_error(_params);
  self.check_limit(_params);  // Ver.1.47.11
  var arr_f = _params.arr_f;
  var arr_g = _params.arr_g;
  var arr_g = self.check_gains(_params);
  _params.gain_type = self.get_gain_type(_params.type, _params._table);  // Ver.1.71.14
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
  var math_wave = self.entry.math_wave;  // Ver.1.56.12
  var _binary = "";
  var Bytes_perSample = self.Bytes_perSample;
  var amplitude = self.amplitude;
  var offset = self.offset;
  var seconds_perSample = 1/self.samples_perSecond;
  var tend = params.number_samples*seconds_perSample;  // Ver.1.74.14
  /* Ver.1.16.4 -> */
  var fn = math_wave[params.type];  // Ver.1.25.4  // Ver.1.34.6  // Ver.1.46.11  // Ver.1.56.12  // Ver.1.71.14
  var table = params._table;  // Ver.1.71.14
  var func_t = function(){
    return fn.apply(math_wave, arguments);  // Ver.1.56.12
  };
  /* -> Ver.1.16.4 */
  /* Ver.1.47.11 -> */
  var hasRand_phi0 = params._hasRand_phi0;  // Ver.1.71.14
  /* Ver.1.56.12 -> */
  /* Ver.1.64.14 -> */
  var overtone = params.overtone || 1;  // Ver.1.74.14
  var ti = params.ti;  // Ver.1.74.14
  var to = params.to;  // Ver.1.74.14
  var hasTio = (params.ti || params.to);  // Ver.1.74.14
  var arr_f = params.arr_f;
  var arr_g = params.arr_g_normalized;
  var arr_phi = [];  // Ver.1.80.14
  if(overtone > 1){
    arr_f = [];
    arr_g = [];
    for(var i=0, len=params.arr_f.length; i<len; ++i){
      var fi = params.arr_f[i];
      var gi = params.arr_g_normalized[i];
      /* Ver.1.67.14 -> */
      var arr_gain_ft = [];
      var sum_gain_ft = 0;
      for(var k=0; k<overtone; ++k){
        var ft = fi*(k+1);
        arr_f.push(ft);
        var gain_ft = self.get_gain_loglog(ft, params.f0, params.f1, params.g0, params.g1);
        gain_ft /= Math.pow(k+1, 2);  // Ver.1.80.14
        arr_gain_ft[k] = gain_ft;
        sum_gain_ft += gain_ft;
      }
      for(var k=0; k<overtone; ++k){
        var gk = arr_gain_ft[k]/sum_gain_ft;
        arr_g.push(gi*gk);
        /* Ver.1.80.14 -> */
        var phi = ((k+1)%4<2)? 0: Math.PI;  // Ver.1.80.15 k=0||3 -> 0
        arr_phi.push(phi);
        /* -> Ver.1.80.14 */
      }
      /* -> Ver.1.67.14 */
    }
  }
  /* -> Ver.1.64.14 */
  var arr_t0 = [];  // Ver.1.74.14
  var arr_t1 = [];  // Ver.1.74.14
  var t10 = 0;  // Ver.1.77.14
  var len_overlap = 0;  // Ver.1.77.14
  for(var i=0, len=arr_f.length; i<len; ++i){  // Ver.1.64.14
    /* Ver.1.80.15 -> */
    var phii = arr_phi[i] || 0;
    phii += (hasRand_phi0)? Math.PI*2*Math.random(): 0;  // Ver.1.34.6
    arr_phi[i] = phii;
    /* -> Ver.1.80.15 */
    /* Ver.1.74.14 -> */
    if(hasTio){
      var k = Math.floor(i/overtone);
      var kmax = Math.floor((len-1)/overtone);
      var t0 = ti*k;
      var t1 = (to)? tend-to*k: t0+(tend-ti*kmax);
      arr_t0[i] = t0;
      arr_t1[i] = t1;
      /* Ver.1.77.14 -> */
      t10 = t10 || t1;
      if(t0 < t10){
        len_overlap++;
      }
      /* -> Ver.1.77.14 */
    }
    /* -> Ver.1.74.14 */
  }
  /* Ver.1.64.14 -> */
  var sum_gain = 0;
  for(var i=0, len=arr_g.length; i<len; ++i){
    /* Ver.1.77.14 -> */
    if(hasTio && len_overlap){
      arr_g[i] *= len/len_overlap;  // /not0
    }
    /* -> Ver.1.77.14 */
    sum_gain += arr_g[i];
  }
  params._amplitude_max = 1/sum_gain;
  /* -> Ver.1.64.14 */
  /* -> Ver.1.56.12 */
  /* -> Ver.1.47.11 */
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
  /* Ver.1.40.8 -> */
  var isFade_time = (params.order_fade >= 0);
  var sw_fade = (isFade_time)? self.samples_perSecond: params.number_samples;
  var dns0 = Math.floor(sw_fade*p0);
  var dns1 = Math.floor(sw_fade*p1);
  /* -> Ver.1.40.8 */
  /* Ver.1.38.8 -> */
  dns1 = Math.min(dns1, params.number_samples-1-dns0);
  var ns_in = dns0;
  var ns_out = params.number_samples-1-dns1;
  var useFade = (params.p0 || params.p1);
  var get_newAmp = function(ns){
    return amplitude;
  };
  /* Ver.1.74.14 */
  var get_gaint = function(gain_normalized, f0, ft){
    var _gaint = gain_normalized;  // Ver.1.64.14
    var gain_f0 = self.get_gain_loglog(f0, params.f0, params.f1, params.g0, params.g1);
    if(gain_f0){
      var gain_ft = self.get_gain_loglog(ft, params.f0, params.f1, params.g0, params.g1);
      _gaint *= gain_ft/gain_f0;
    }
    return _gaint;
  };
  /* Ver.1.75.14 */
  var interp_f = function(dt, f0, f1, order){
    var prop = Math.pow(dt, order);
    return f0+(f1-f0)*prop;
  };
  /* Ver.1.56.11 -> */
  var useVib = params.f_vib;
  var dkf_vib = (Math.pow(2, 1/12)-1)/2;
  var omega_vib = Math.PI*2*params.f_vib;
  /* -> Ver.1.56.11 */
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
  else if(useFade && Math.abs(params.order_fade) === 2){  // Ver.1.40.8
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
  else if(useFade && Math.abs(params.order_fade) === 1){  // Ver.1.40.8
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
  /* Ver.1.49.11 -> */
  else if(useFade && params.order_fade === 3){
    var pi = Math.PI;
    var fade_o2 = function(x){
      return (Math.cos(pi*x)+1)/2;
    };
    get_newAmp = function(ns){
      var _newAmp = amplitude;
      var isIn = (ns < ns_in);
      var isOut = (ns > ns_out);
      if(isIn){
        var x = 1-ns/dns0;  // /not0
        var fade = fade_o2(x);
        _newAmp *= fade;
      }
      else if(isOut){
        var x = (ns-ns_out)/dns1;  // /not0
        var fade = fade_o2(x);
        _newAmp *= fade;
      }
      return _newAmp;
    };
  }
  /* -> Ver.1.49.11 */
  /* -> Ver.1.38.8 */
  for(var ns=0; ns<params.number_samples; ++ns){
    var t = ns*seconds_perSample;
    /* Ver.1.20.4 -> */
    var dt = ns/params.number_samples;
    /* Ver.1.31.6 -> */
    var kamplitude = interp_f(dt, params.amplitude0, params.amplitude1, params.order_a);  // Ver.1.75.14
    var duty = interp_f(dt, params.duty0, params.duty1, params.order_d);  // Ver.1.75.14
    /* -> Ver.1.31.6 */
    /* -> Ver.1.20.4 */
    /* Ver.1.24.4 -> */
    /* Ver.1.26.4 -> */
    var kdf = (useVib)? Math.sin(omega_vib*t)*dkf_vib: 0;  // Ver.1.56.11
    /* -> Ver.1.26.4 */
    /* -> Ver.1.24.4 */
    var val = 0;
    // composite waves
    arr_f.forEach(function(f, i){  // Ver.1.64.14
      /* Ver.1.75.14 -> */
      var f0 = f;
      var f1 = f0*params.rate;
      /* Ver.1.74.14 -> */
      var dti = dt;
      if(hasTio){
        var t0i = arr_t0[i];
        var t1i = arr_t1[i];
        if(t >= t0i && t <= t1i){
          dti = (t-t0i)/(t1i-t0i || 1);  // || not0
          duty = interp_f(dti, params.duty0, params.duty1, params.order_d);
          kamplitude = interp_f(dti, params.amplitude0, params.amplitude1, params.order_a);
          if(t-t0i < p0){
            kamplitude *= (t-t0i)/p0;  // /not0
          }
          else if(t1i-t < p1){
            kamplitude *= (t1i-t)/p1;  // /not0
          }
        }
        else{
          dti = 0;
          kamplitude = 0;
        }
      }
      var ft = interp_f(dti, f0, f1, params.order);
      /* Ver.1.56.11 -> */
      if(useVib){
        var dft = kdf*ft;
        ft += dft;
      }
      /* -> Ver.1.56.11 */
      var gaint = kamplitude*get_gaint(arr_g[i], f0, ft);  // k first
      /* -> Ver.1.74.14 */
      /* -> Ver.1.75.14 */
      /* Ver.1.56.12 -> */
      var phii = arr_phi[i];
      val += gaint*func_t(ft, seconds_perSample, phii, duty, table);  // gain first  // Ver.1.16.4  // Ver.1.25.4  // Ver.1.71.14
      arr_phi[i] = math_wave.normalize_phi(ft, seconds_perSample, phii);
      /* -> Ver.1.56.12 */
    });
    val *= get_newAmp(ns);
    if(val > amplitude) throw new Error(self.title_error+"stopped by over-flow@stream");  // Ver.1.41.10
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
