// online-simulator.github.io

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_worker);

My_entry.handler_wave.prototype.composite_binary_soundData_LE = function(arr_binary, arr_number_samples, data){
  var self = this;
  var isLE = true;
  var samples_perSecond = data.samples_perSecond;  // Ver.1.29.4
  var number_samples_perChannel_max = data.number_samples_perChannel_max;
  var number_channels = self.waveo.number_channels;  // from waveo
  var Bytes_perSample = data.Bytes_perSample;
  var val_amplitude = self.waveo.arr_amplitude[Bytes_perSample];  // Ver.1.36.6
  var val_offset = self.waveo.arr_offset[Bytes_perSample];
  var Prop = self.waveo.arr_prop_baseview[Bytes_perSample]+String(Bytes_perSample*8);
  var newBuffer = new ArrayBuffer(Bytes_perSample*number_samples_perChannel_max*number_channels);
  var newView = new DataView(newBuffer, 0);
  var newSetter = function(){
    return newView["set"+Prop].apply(newView, arguments);
  };
  var newGetter = function(){
    return newView["get"+Prop].apply(newView, arguments);
  };
  // substitute val_offset
  for(var i=0, len=number_samples_perChannel_max*number_channels; i<len; ++i){
    newSetter(i*Bytes_perSample, val_offset, isLE);
  }
  /* Ver.1.29.4 -> */
  var hasCh2 = (arr_binary.length > 1)? true: false;
  var isStereo = (number_channels === 2);
  var isNotExist_ch2 = !(hasCh2) && isStereo;
  /* Ver.1.35.6 -> */
  var aval_max = 0;
  arr_binary.forEach(function(binary, i){
    var buffer = self.waveo.binary2buffer(binary);
    var view = new DataView(buffer, 0);
    var getter = function(){
      return view["get"+Prop].apply(view, arguments);
    };
    var j_offset = i%number_channels;
    /* Ver.1.18.4 -> */
    var wr = data.wr;
    var oldVal = val_offset;
    for(var j=0, len=arr_number_samples[i]; j<len; ++j){
      var j_new = (j*number_channels+j_offset)*Bytes_perSample;
      var j_out = j*Bytes_perSample;
      var nowVal = newGetter(j_new, isLE)+getter(j_out, isLE)-val_offset;
      var newVal = wr*oldVal+(1-wr)*nowVal;  // wr first
      oldVal = newVal;
      newSetter(j_new, newVal, isLE);
      /* Ver.1.40.9 -> */
      var aval = Math.abs(newVal-val_offset);
      if(aval > val_amplitude){
        data._amplitude_max = "overflow";
        throw new Error(self.waveo.config.ERROR.title+"stopped by over-flow@post");  // Ver.1.41.10
      }
      aval_max = Math.max(aval_max, aval);
      /* -> Ver.1.40.9 */
      if(isNotExist_ch2){
        newSetter(j_new+Bytes_perSample, newVal, isLE);
      }
    }
    /* -> Ver.1.18.4 */
  });
  data._amplitude_max = data.ampli*(val_amplitude-1)/Math.ceil(aval_max);  // Ver.1.36.6
  /* -> Ver.1.35.6 */
  var dfreq = data.dfreq;
  /* Ver.1.32.6 -> */
  if(dfreq){
    /* Ver.1.33.6 -> */
    var s_stereo = (isStereo)? data.s_stereo/100: 1;
    var amp_sin = s_stereo/2;
    /* -> Ver.1.33.6 */
    var pi2 = Math.PI*2;
    var freq0 = dfreq;
    var omega = pi2*freq0;
    var is0 = 0;
    var is = is0;
    var di = 0;
    var s_random = data.s_random || 0;
    for(var i=is0, len=number_samples_perChannel_max; i<len; ++i){
      if(s_random && i-is >= di){
        var base = 2;
        var expo = 2*(Math.random()-0.5);  // [-1,1)
        expo *= s_random;
        var freq1 = freq0;
        freq1 *= Math.pow(base, expo);
        omega = pi2*freq1;
        di = samples_perSecond/freq1;  // /not0
        is = i;
      }
      var dt = (i-is)/samples_perSecond;
      /* Ver.1.33.6 -> */
      var sint = Math.sin(omega*dt);
      var s = 1+amp_sin*(sint-1);  // [0,1]
      /* -> Ver.1.33.6 */
      var i0 = (i*number_channels+0)*Bytes_perSample;
      var i1 = (i*number_channels+1)*Bytes_perSample;
      var val0 = newGetter(i0, isLE);
      var val1 = (isStereo)? newGetter(i1, isLE): val_offset;  // Ver.1.36.7
      var newVal0 = s*val0+(1-s)*val1;  // Ver.1.37.8 s=1@s_stereo=0
      newSetter(i0, newVal0, isLE);
      if(isStereo){
        var newVal1 = s*val1+(1-s)*val0;  // Ver.1.37.8 s=1@s_stereo=0
        newSetter(i1, newVal1, isLE);
      }
    }
  }
  /* -> Ver.1.32.6 */
  /* -> Ver.1.29.4 */
  return self.waveo.buffer2binary(newBuffer);
};
My_entry.handler_wave.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    if(!(self.arr_data_out[data.i])){
      self.arr_data_out[data.i] = new Array(data.len_j);
    }
    self.arr_data_out[data.i][data.j] = data;
    var len_in = self.arr_data_in.length;
    var len_out = 0;
    self.arr_data_out.forEach(function(arr_data_j, i){
      len_out += Object.keys(self.arr_data_out[i]).length;
    });
    if(len_out === len_in){
      var arr_binary = new Array(data.len_i);
      var arr_number_samples = new Array(data.len_i);
      var i0 = null;
      var j0 = null;
      self.arr_data_out.forEach(function(arr_data_j, i){
        var binary = "";
        var number_samples_perChannel = null;
        self.arr_data_out[i].forEach(function(data_j, j){
          binary += data_j.out;
          if(data_j.number_samples_perChannel_max){
            i0 = i;
            j0 = j;
          }
          if(data_j.number_samples_perChannel){
            number_samples_perChannel = data_j.number_samples_perChannel;
          }
        });
        arr_number_samples[i] = number_samples_perChannel;
        arr_binary[i] = binary;
      });
    /* Ver.1.40.9 -> */
      var log = "";
    try{
      var data0 = self.arr_data_out[i0][j0];
      var number_samples = data0.number_samples_perChannel_max;
      var binary_header = self.waveo.get_binary_header(number_samples);
      var binary_soundData_LE = self.composite_binary_soundData_LE(arr_binary, arr_number_samples, data0);
      var binary = binary_header+binary_soundData_LE;
      var buffer = self.waveo.binary2buffer(binary);
      var fileName = "made_by_script.wav";
      self.handler_link.link.name = fileName;
      self.handler_link.link.set_url(buffer);
      var base64 = (window.btoa)? "data:audio/wav;base64,"+btoa(binary): "";
      var isIE = self.handler_link.browser.sws.isIE;
      if(!(isIE)){
        self.waveo.play_base64(base64, data.volume);
      }
    }
    catch(e){
      log = e.message;
      var fileName = self.fileName_default;
      self.handler_link.link.name = fileName;
      self.handler_link.link.clear_url();
    }
      self.stop_worker();
      self.output_amplitude_max(data0._amplitude_max);  // Ver.1.35.6
      self.output_log(log);
    /* -> Ver.1.40.9 */
      self.output_fileName(fileName);
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker(true);
    self.output_log(e.message);
    return self;
  };
  self.callbacks_worker.final = function(){
    var self = this;
    self.output_log("stopped by onchange");
    return self;
  };
  return self;
};
My_entry.handler_wave.prototype.input2arr = function(input){
  var self = this;
  var _arr_input = [];
  /* Ver.1.41.9 -> */
  var input_ = (My_entry.flag.hasFlagS)? input: input.replace(self.regex.s, "");  // Ver.1.43.11
  var macros = input_.replace(self.regex.mb, "");
  if(macros){
    var mc_macros = macros.match(self.regex.macros);
    if(mc_macros && mc_macros.length){
      for(var i=0, len=mc_macros.length; i<len; ++i){
        var macro = mc_macros[i];
        var mc_macro = macro.match(self.regex.macro);
        if(mc_macro && mc_macro[1]){
          var tag = mc_macro[1];  // Ver.1.43.11
          var dataset = mc_macro[2] || "";
          var re = self.regex.make_tag(tag);  // Ver.1.43.11
          input_ = input_.replace(re, dataset);
        }
      }
    }
  }
  /* Ver.1.43.11 -> */
  var mcb_ = input_.match(self.regex.mb);
  if(mcb_ && mcb_.length){
    var script_original = "";
    mcb_.forEach(function(str, i){
      script_original += str+"\n\n";
    });
    self.output_script(script_original);
    if(script_original.match(self.regex.macro_prifix)) throw new Error(self.waveo.config.ERROR.title+"Invalid macro remained");  // Ver.1.42.10
  }
  var mcb = input_.replace(self.regex.s, "").match(self.regex.mb);
  /* -> Ver.1.43.11 */
  /* -> Ver.1.41.9 */
  /* Ver.1.4.2 */
  if(!(mcb)) throw new Error(self.waveo.config.ERROR.title+"Invalid dataset");
  var number_channels = self.waveo.number_channels;  // from waveo
  /* Ver.1.4.2 */
  /* Ver.1.17.4 -> */
  var ktempo = self.params.tempo || 0;
  var kpitch = Math.pow(2, self.params.pitch || 0);
  var kampli = self.params.ampli || 0;  // Ver.1.28.4
  /* -> Ver.1.17.4 */
  var len_band = Math.max(mcb.length/number_channels, 1);
  var str2freq = function(str){
    var _freq = null;
    var mc_oc = str.match(self.regex.oc);
    var mc_nc = str.match(self.regex.nc);  // Ver.1.13.4
    var mc_sn = str.match(self.regex.sn);  // Ver.1.14.4
    var mc_f = str.match(self.regex.freq);
    var mc_r = str.match(self.regex.rest);
    if(mc_oc){
      var octave = Number(mc_oc[1]);
      var note = Number(mc_oc[2]);  // Ver.1.44.11
      _freq = self.calc_freq(octave, note);  // Ver.1.44.11
    }
    /* Ver.1.13.4 -> */
    else if(mc_nc){
      var octave = -1;
      var note = Number(mc_nc[1]);
      _freq = self.calc_freq(octave, note);
    }
    /* -> Ver.1.13.4 */
    /* Ver.1.14.4 -> */
    else if(mc_sn && mc_sn[1]){
      var octave = Number(mc_sn[2]);
      var note = self.notes[mc_sn[1]];
      var sw_sf = mc_sn[3];
      if(sw_sf === "s"){
        note += 1;
      }
      else if(sw_sf === "f"){
        note += -1;
      }
      _freq = self.calc_freq(octave, note);
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
    return _freq;
  };
  mcb.forEach(function(str, i){
    // include empty channel {}
    _arr_input[i] = [];
    /* Ver.1.20.4 -> */
    var types0 = {
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
      11: "sawtoothrev_rand"
      /* -> Ver.1.34.6 */
    };
    var props0 = [
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
      "order_fade"  // Ver.1.38.8
    ];
    var params0 = {};
    /* -> Ver.1.20.4 */
    var arr_data = str.replace(self.regex.rb, "").split(";");
    arr_data.forEach(function(tokens, j){
      var arr_token = tokens.split(":");
      /* Ver.1.44.11 -> */
      var token0 = arr_token[0];
      var has1elem = (arr_token.length === 1 && token0 !== "");
      if(has1elem){
        arr_token[0] = String(self.msec_60BPM);
        arr_token[1] = token0;
      }
      /* -> Ver.1.44.11 */
      if(arr_token.length > 1){
        /* Ver.1.19.4 -> */
        var time = arr_token[0];
        var t = (time === "")? self.msec_60BPM: Number(time);
        var mct = time.match(self.regex.qn);
        if(mct && mct.length){
          var nume = Number(mct[1] || 1);
          var deno = Number(mct[2] || 1);
          t = (deno)? self.msec_60BPM*nume/deno: 0;
        }
        /* -> Ver.1.19.4 */
        var params = {};
        for(var prop in self.params){
          params[prop] = self.params[prop];
        }
        params.sec = t/1000;
        params.sec *= ktempo;  // Ver.1.17.4
        var token = arr_token[1];
        var mcl = token.match(self.regex.ml);
        var f_isFound = false;
        if(mcl){
          var arr_f = mcl[0].replace(self.regex.rl, "").split(",");
          arr_f.forEach(function(str, k){
            arr_f[k] = str2freq(str);
          });
          f_isFound = arr_f;
        }
        else{
          f_isFound = [str2freq(token)];
        }
        params.arr_f = (f_isFound)? f_isFound: [0];
        /* Ver.1.17.4 -> */
        params.arr_f.forEach(function(f, i){
          params.arr_f[i] *= kpitch;
        });
        /* -> Ver.1.17.4 */
        /* Ver.1.20.4 -> */
        var command = arr_token[2];
        if(command === "clear"){
          params0 = {};
        }
        for(var n=3, len_n=props0.length; n<len_n; ++n){
          var prop = props0[n];
          var param0 = params0[prop];
          var token = arr_token[n];
          var num = Number(token);
          if(token && !(isNaN(num))){
            var param = null;
            switch(prop){
              case "type":
                param = types0[num] || params[prop];
                break;
              // Ver.1.28.4
              case "amplitude0":
              case "amplitude1":
                num *= kampli;
                param = self.entry.def.limit(num, 0, Number.MAX_VALUE, 1);  // Ver.1.35.6
                break;
              case "f0":
              case "f1":
                param = num;
                break;
              // Ver.1.31.6
              case "order_d":
              case "order_a":
              // Ver.1.26.4
              case "order":
              // Ver.1.24.4
              case "rate":
                param = self.entry.def.limit(num, 0, Number.MAX_VALUE, 1);
                break;
              // Ver.1.38.8
              case "order_fade":
                param = self.entry.def.limit(Math.floor(num), -2, 2, 2);  // Ver.1.39.8  // Ver.1.40.8
                break;
              default:
                param = self.entry.def.limit(num, 0, 1, 0);
                break;
            }
            params[prop] = param;
            params0[prop] = param;
          }
          else if(typeof param0 !== "undefined"){
            params[prop] = param0;
          }
        }
        /* -> Ver.1.20.4 */
        params.gain_band = (f_isFound)? 1/len_band: 0;
        _arr_input[i].push(params);
      }
    });
  });
  return _arr_input;
};
My_entry.handler_wave.prototype.check_script = function(input){
  var self = this;
  var arr_input = self.input2arr(input);
  var len_i = arr_input.length;
  var number_samples_perChannel_max = 0;
  var _arr_params = [];
  var counter = 0;
  arr_input.forEach(function(params_perChannel, i){
    var number_samples_perChannel = 0;
    var len_j = params_perChannel.length;
    var counter_j0 = counter;
    params_perChannel.forEach(function(params_perTime, j){
      params_perTime.isScript = true;
      params_perTime.i = i;
      params_perTime.j = j;
      params_perTime.len_i = len_i;
      params_perTime.len_j = len_j;
      params_perTime.number_samples = self.waveo.get_number_samples(params_perTime.sec);
      params_perTime.number_channels = 1;
      _arr_params[counter++] = self.waveo.check_params(params_perTime);
      number_samples_perChannel += params_perTime.number_samples;
    });
    number_samples_perChannel_max = Math.max(number_samples_perChannel_max, number_samples_perChannel);
    if(len_j){
      _arr_params[counter_j0].number_samples_perChannel = number_samples_perChannel;
    }
  });
  /* Ver.1.30.5 -> */
  var fileSizeMax = 0;
  var sec = null;
  var params_all = {};
  var param0 = _arr_params[0];
  if(param0){
    param0.number_samples_perChannel_max = number_samples_perChannel_max;
    fileSizeMax = param0.fileSizeMax;
    sec = number_samples_perChannel_max/param0.samples_perSecond;
    self.output_time(sec);
    self.output_fileSize(sec);
  }
  params_all.fileSizeMax = fileSizeMax;
  /* -> Ver.1.30.5 */
  params_all.sec = sec;
  params_all.number_samples = number_samples_perChannel_max;
  params_all.arr_f = [];
  self.waveo.check_error(params_all);
  return _arr_params;
};
