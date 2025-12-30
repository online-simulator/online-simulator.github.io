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
  /* Ver.1.48.11 -> */
  var handler_view = self.handler_view;
  var newSetter = (newView["set"+Prop])?
    function(){
      return newView["set"+Prop].apply(newView, arguments);
    }:
    function(){
      return handler_view.setInt8n(newView, Bytes_perSample, arguments[0], arguments[1], arguments[2]);
    };
  var newGetter = (newView["get"+Prop])?
    function(){
      return newView["get"+Prop].apply(newView, arguments);
    }:
    function(){
      return handler_view.getInt8n(newView, Bytes_perSample, arguments[0], arguments[1]);
    };
  /* -> Ver.1.48.11 */
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
    /* Ver.1.48.11 -> */
    var getter = (view["get"+Prop])?
      function(){
        return view["get"+Prop].apply(view, arguments);
      }:
      function(){
        return handler_view.getInt8n(view, Bytes_perSample, arguments[0], arguments[1]);
      };
    /* -> Ver.1.48.11 */
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
  /* Ver.1.45.11 -> */
  var maxAmp = data.maxAmp;
  var iaval_max = Math.ceil(aval_max);
  var isMax_amp = (iaval_max === val_amplitude);
  var kampli_post0 = (isMax_amp)? 1: (val_amplitude-1)/iaval_max;  // /0
  var kampli_post = (maxAmp && iaval_max)? kampli_post0: 1;
  var kampli_max = (iaval_max)? data.kampli*kampli_post0: null;  // Ver.1.75.14
  var log_amplitude_max = (isMax_amp)? self.post_maxAmp.eq+String(kampli_max): self.post_maxAmp.simeq+String(Math.floor(kampli_max*100)/100);
  data._amplitude_max = (maxAmp && kampli_max)? log_amplitude_max: kampli_max;  // Ver.1.36.6
  /* -> Ver.1.35.6 */
  var dfreq = data.dfreq;
  /* Ver.1.32.6 -> */
  if(dfreq || maxAmp){
    /* Ver.1.33.6 -> */
    var s_stereo = (isStereo)? data.s_stereo/100: 1;
    var amp_sin = (dfreq)? s_stereo/2: 0;
  /* -> Ver.1.45.11 */
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
      /* Ver.1.45.11 -> */
      val0 = val_offset+(val0-val_offset)*kampli_post;
      val1 = val_offset+(val1-val_offset)*kampli_post;
      /* -> Ver.1.45.11 */
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
      self.handler_link.link.set_url(buffer);
      var base64 = (window.btoa)? "data:audio/wav;base64,"+btoa(binary): "";
      var isIE = self.handler_link.browser.sws.isIE;
      if(!(isIE)){
        self.waveo.play_base64(base64, data.volume);
      }
    }
    catch(e){
      log = e.message;
      self.handler_link.link.name = self.fileName_default+".wav";  // Ver.1.68.14
      self.handler_link.link.clear_url();
    }
      self.stop_worker();
      self.output_amplitude_max(data0._amplitude_max);  // Ver.1.35.6
      self.output_log(log);
    /* -> Ver.1.40.9 */
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
/* Ver.1.71.14 */
My_entry.handler_wave.prototype.make_table = function(token0, token1){
  var self = this;
  var _table = null;
  if(token0 && token1){
    var arr_x = token0.split(",");
    var arr_y = token1.split(",");
    if(arr_x.length === arr_y.length && arr_x.length > 1){
      var len = arr_x.length;
      _table = [[], []];
      for(var i=0; i<len; ++i){
        var x = Number(arr_x[i]);
        var y = Number(arr_y[i]);
        if(isNaN(x) || x < 0 || x > 1){
          throw new Error(self.waveo.config.ERROR.title+"Invalid table-x="+arr_x[i]);
        }
        else if(isNaN(y) || y < -1 || y > 1){
          throw new Error(self.waveo.config.ERROR.title+"Invalid table-y="+arr_y[i]);
        }
        else{
          _table[0][i] = x;
          _table[1][i] = y;
        }
      }
    }
    else{
      throw new Error(self.waveo.config.ERROR.title+"Invalid table-size");
    }
  }
  else{
    throw new Error(self.waveo.config.ERROR.title+"Invalid table-"+token0+":"+token1);
  }
  return _table;
};
/* Ver.1.73.14 -> */
My_entry.handler_wave.prototype.str2sec = function(str){
  var self = this;
  var msec = (str === "")? self.msec_60BPM: Number(str);
  var mct = str.match(self.regex.qn);
  if(mct && mct.length){
    var nume = Number(mct[1] || 1);
    var deno = Number(mct[2] || 1);
    msec = (deno)? self.msec_60BPM*nume/deno: 0;
  }
  /* Ver.1.65.14 -> */
  if(isNaN(msec)){
    throw new Error(self.waveo.config.ERROR.title+"Invalid time-"+str);
  }
  /* -> Ver.1.65.14 */
  var _sec = msec/1000;
  var ktempo = self.params.tempo || 0;  // Ver.1.17.4
  _sec *= ktempo;  // Ver.1.17.4
  return _sec;
};
My_entry.handler_wave.prototype.str2freq = function(str, A4, tune, mode){  // Ver.1.84.15
  var self = this;
  var _freq = self.calc_freq(str, A4, tune, mode);  // Ver.1.44.11  // Ver.1.84.15
  /* Ver.1.65.14 -> */
  if(isNaN(_freq)){
    throw new Error(self.waveo.config.ERROR.title+"Invalid frequency-"+str);
  }
  /* -> Ver.1.65.14 */
  var kpitch = Math.pow(2, self.params.pitch || 0);  // Ver.1.17.4  // Ver.1.83.15  // Ver.1.84.15
  _freq *= kpitch;  // Ver.1.17.4
  return _freq;
};
My_entry.handler_wave.prototype.str2arr_f = function(str, A4, tune, mode){  // Ver.1.84.15
  var self = this;
  var _arr_f = [0];
  var mcl = str.match(self.regex.ml);
  var f_isFound = false;
  if(mcl){
    var arr_f = mcl[0].replace(self.regex.rl, "").split(",");
    arr_f.forEach(function(str, k){
      arr_f[k] = self.str2freq(str, A4, tune, mode);  // Ver.1.84.15
    });
    f_isFound = arr_f;
  }
  else{
    f_isFound = [self.str2freq(str, A4, tune, mode)];  // Ver.1.84.15
  }
  if(f_isFound){
    _arr_f = f_isFound;
  }
  return _arr_f;
};
/* -> Ver.1.73.14 */
/* Ver.1.69.14 */
My_entry.handler_wave.prototype.make_params_extended = function(tokens, params0, opt_params){  // Ver.1.71.14
  var self = this;
  var _params = opt_params || {};
  var isDefined = {};  // Ver.1.71.14
  var tokens_ = tokens;  // Ver.1.71.14
  var kampli = self.params.kampli || 0;  // Ver.1.28.4  // Ver.1.75.14
  var hasDataset_base = opt_params;  // Ver.1.70.14
  var isStored = !(hasDataset_base) || (opt_params && opt_params.ver_script === 1);  // Ver.1.70.14
  /* Ver.1.65.14 -> */
  var get_num = function(prop, token, isTime){  // Ver.1.74.14
    var _num = NaN;
    if(token){
      var num = (isTime)? self.str2sec(token): Number(token);  // Ver.1.74.14
      if(isNaN(num)){
        var sc = token.split("=");
        if(sc.length > 1){
          if(sc.length !== 2){
            throw new Error(self.waveo.config.ERROR.title+"Invalid dataset-"+token);
          }
        }
        else{
          throw new Error(self.waveo.config.ERROR.title+"Invalid dataset-"+prop+"="+token);
        }
      }
      else{
        _num = num;
      }
    }
    return _num;
  };
  /* Ver.1.71.14 */
  var store = function(prop, param){
    if(isDefined[prop]){
      throw new Error(self.waveo.config.ERROR.title+"Duplicate dataset-"+prop+"="+param);
    }
    else{
      isDefined[prop] = true;
    }
    _params[prop] = param;
    /* Ver.1.70.14 -> */
    if(isStored){
      params0[prop] = param;
    }
    /* -> Ver.1.70.14 */
  };
  var set_params = function(prop, token){
    if(self.hasProp[prop]){
      var param0 = params0[prop];
      var isTime = (prop === "ti" || prop === "to");  // Ver.1.74.14
      var num = get_num(prop, token, isTime);  // Ver.1.74.14
      if(!(isNaN(num))){
        /* Ver.1.75.14 -> */
        var param = num;  // Ver.1.47.11
        if(prop === "type"){
          param = self.types0[num] || _params[prop];
        }
        /* -> Ver.1.75.14 */
        store(prop, param);  // Ver.1.71.14
      }
      else if(typeof param0 !== "undefined"){
        _params[prop] = param0;
      }
      /* Ver.1.75.14 -> */
      var isAmplitude = (prop === "amplitude0" || prop === "amplitude1");  // Ver.1.28.4
      if(isAmplitude){
        _params[prop] *= kampli;  // Ver.1.47.11
      }
      /* -> Ver.1.75.14 */
    }
    else{
      throw new Error(self.waveo.config.ERROR.title+"Invalid dataset-"+prop);
    }
  };
  /* Ver.1.71.14 -> */
  var n0 = 3;
  var mc_type = tokens_.match(self.regex.type);
  if(mc_type && mc_type.length){
    var token = mc_type[mc_type.length-1];
    var mc = token.match(self.regex.table);
    store("type", self.make_table(mc[1], mc[2]));
    tokens_ = tokens_.replace(self.regex.type, "");
    n0 = 4;
  }
  var arr_token = tokens_.split(":");
  /* -> Ver.1.71.14 */
  /* Ver.1.70.14 -> */
  if(hasDataset_base){
    for(var n=n0, len_n=self.props0.length; n<len_n; ++n){  // Ver.1.71.14
      var prop = self.props0[n];
      var token = arr_token[n];
      set_params(prop, token);
    }
  }
  /* -> Ver.1.70.14 */
  for(var n=0, len_n=arr_token.length; n<len_n; ++n){  // Ver.1.70.14
    var token = arr_token[n];
    if(token){
      var sc = token.split("=");
      if(sc && sc.length === 2){
        var prop = sc[0];
        var token = sc[1];
        set_params(prop, token);
      }
      /* Ver.1.69.14 -> */
      else if(sc && sc.length > 2 || !(hasDataset_base)){  // Ver.1.70.14
        throw new Error(self.waveo.config.ERROR.title+"Invalid dataset-"+token);
      }
      /* -> Ver.1.69.14 */
    }
  }
  /* -> Ver.1.65.14 */
  return _params;
};
/* Ver.1.70.14 */
My_entry.handler_wave.prototype.isClear_command = function(command, checkError){
  var self = this;
  var _isClear = false;
  if(command === "clear"){
    _isClear = true;
  }
  /* Ver.1.65.14 -> */
  else if(checkError && command){
    if(!(command.match("="))){  // Ver.1.69.14
      throw new Error(self.waveo.config.ERROR.title+"Invalid command-"+command);
    }
  }
  /* -> Ver.1.65.14 */
  return _isClear;
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
  var len_band = Math.max(mcb.length/number_channels, 1);
  mcb.forEach(function(str, i){
    // include empty channel {}
    _arr_input[i] = [];
    /* Ver.1.20.4 -> */
    var params0 = {};
    /* -> Ver.1.20.4 */
    var arr_data = str.replace(self.regex.rb, "").split(";");
    arr_data.forEach(function(tokens, j){
      var arr_token = tokens.split(":");
      /* Ver.1.44.11 -> */
      var token0 = arr_token[0];
      /* Ver.1.70.14 -> */
      var hasOnlyDataset_ext = token0.match("=");
      if(hasOnlyDataset_ext){
        self.make_params_extended(tokens, params0);  // Ver.1.71.14
        arr_token.length = 0;
      }
      var has1elem = (arr_token.length === 1 && token0 !== "");
      if(has1elem){
        if(self.isClear_command(token0, false)){
          params0 = {};
        }
        else{
          arr_token[0] = String(self.msec_60BPM);
          arr_token[1] = (token0.match(self.regex.rest))? String(0): token0;
        }
      }
      var hasDataset_base = (arr_token.length > 1);
      /* -> Ver.1.70.14 */
      /* -> Ver.1.44.11 */
      if(hasDataset_base){
        var params = {};
        for(var prop in self.params){
          params[prop] = self.params[prop];
        }
        params.sec = self.str2sec(arr_token[0]);  // Ver.1.73.14
        /* Ver.1.20.4 -> */
        var command = arr_token[2];
        /* Ver.1.70.14 -> */
        if(self.isClear_command(command, true)){
          params0 = {};
        }
        /* -> Ver.1.70.14 */
        self.make_params_extended(tokens, params0, params);  // Ver.1.69.14  // Ver.1.71.14
        params.arr_f = self.str2arr_f(arr_token[1], params.A4, params.tune, params.mode);  // Ver.1.73.14  // Ver.1.84.15
        /* -> Ver.1.20.4 */
        params.gain_band = 1/len_band;  // Ver.1.73.14
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
