// online-simulator.github.io

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_worker);

/* Ver.2.112.26 */
My_entry.handler_wave.prototype.composite_buffer_soundData_LE = function(data){  // Ver.1.103.22  // Ver.1.105.22  // Ver.1.108.23
  var self = this;
  var pi2 = Math.PI*2;  // Ver.1.106.23
  var isLE = true;
  var samples_perSecond = data.samples_perSecond;  // Ver.1.29.4
  var number_samples_perChannel_max = self.scripts.number_samples_perChannel_max;  // Ver.1.105.22
  var number_channels = self.waveo.number_channels;  // from waveo
  var Bytes_perSample = data.Bytes_perSample;
  var total_samples = number_samples_perChannel_max*number_channels;
  var _arrb_float32 = new Float32Array(total_samples);
  /* Ver.1.29.4 -> */
  var hasCh2 = (self.scripts.arr_buffers.length > 1);  // Ver.1.103.22  // Ver.1.105.22  // Ver.1.108.23
  var isStereo = (number_channels === 2);
  var isNotExist_ch2 = !(hasCh2) && isStereo;
  /* Ver.1.35.6 -> */
  /* Ver.1.108.23 -> */
  self.scripts.arr_buffers.forEach(function(buffers, i){  // Ver.1.103.22  // Ver.1.105.22
    var n_offset = i%number_channels;
    buffers.forEach(function(buffer, j){
      var out = buffer.out;  // Ver.2.121.27
      if(out){
        var outView = new Float32Array(out);  // Ver.1.48.11  // Ver.1.110.24
        /* Ver.1.18.4 -> */
        var ns = buffer.ns;
        var ne = buffer.ne;
        for(var n=ns; n<=ne; ++n){  // Ver.1.105.22
          var n_out = n-ns;
          var ampVali = outView[n_out];
          var n_new = n*number_channels+n_offset;
          _arrb_float32[n_new] += ampVali;  // sum_channel[0,i-1]+channel[i]
          if(isNotExist_ch2){
            _arrb_float32[n_new+1] += ampVali;
          }
        }
        /* -> Ver.1.18.4 */
      }
    });
  });
  /* -> Ver.1.108.23 */
  /* -> Ver.1.35.6 */
  /* Ver.1.45.11 -> */
  var dfreq = data.dfreq;
  /* Ver.1.32.6 -> */
  if(dfreq){
    /* Ver.1.33.6 -> */
    var s_stereo = (isStereo)? data.s_stereo/100: 1;
    var amp_sin = (dfreq)? s_stereo/2: 0;
  /* -> Ver.1.45.11 */
    /* -> Ver.1.33.6 */
    var freq0 = dfreq;
    var omega = pi2*freq0;
    var is0 = 0;
    var is = is0;
    var di = 0;
    var s_random = data.s_random || 0;
    /* Ver.1.104.22 -> */
    var blend = data.blend;
    var isInv = blend%2;
    var kampli_blend = (blend >= 2 && blend <= 5)? 1/Math.sqrt(2): (blend >= 12)? 1/2: 1;
    var pih = Math.PI/2;
    var blenders = {  // s0=1@s_stereo=0 -> newVal0 = val0
      0: function(ampVal0, ampVal1, s0, s1, _amps_){
        _amps_.val0 = s0*ampVal0+(1-s0)*ampVal1;  // Ver.1.37.8
        _amps_.val1 = s1*ampVal1+(1-s1)*ampVal0;  // Ver.1.37.8
      },
      // conservation law against time
      2: function(ampVal0, ampVal1, s0, s1, _amps_){
        var angle0 = s0*pih;
        var angle1 = s1*pih;
        _amps_.val0 = ampVal0*Math.sin(angle0)+ampVal1*Math.cos(angle0);
        _amps_.val1 = ampVal1*Math.sin(angle1)+ampVal0*Math.cos(angle1);
      },
      4: function(ampVal0, ampVal1, s0, s1, _amps_){
        var angle0 = s0*pih;
        var angle1 = s1*pih;
        _amps_.val0 = ampVal0*Math.sin(angle0)+ampVal1*Math.cos(angle0);
        _amps_.val1 = ampVal1*Math.sin(angle1)-ampVal0*Math.cos(angle1);
      },
      6: function(ampVal0, ampVal1, s0, s1, _amps_){
        var angle0 = s0*pih;
        var angle1 = s1*pih;
        _amps_.val0 = ampVal0*Math.cos(angle0);
        _amps_.val1 = ampVal1*Math.sin(angle1);
      },
      8: function(ampVal0, ampVal1, s0, s1, _amps_){
        var angle0 = s0*pih;
        var angle1 = s1*pih;
        _amps_.val0 = ampVal0*Math.sin(angle0);
        _amps_.val1 = ampVal1*Math.cos(angle1);
      },
      10: function(ampVal0, ampVal1, s0, s1, _amps_){
        var mid = (ampVal0+ampVal1)/2;
        var side = (ampVal0-ampVal1)/2;
        _amps_.val0 = s0*mid+s1*side;
        _amps_.val1 = s0*mid-s1*side;
      },
      12: function(ampVal0, ampVal1, s0, s1, _amps_){
        var mid = (ampVal0+ampVal1)/2;
        _amps_.val0 = s0*mid+s1*mid;
        _amps_.val1 = _amps_.val0;
      },
      14: function(ampVal0, ampVal1, s0, s1, _amps_){
        var side = (ampVal0-ampVal1)/2;
        _amps_.val0 = s0*side+s1*side;
        _amps_.val1 = _amps_.val0;
      }
    };
    var step = 2;
    var blender = blenders[Math.floor(blend/step)*step];
    var _amps_ = {val0: 0, val1: 0};
    /* -> Ver.1.104.22 */
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
      /* Ver.1.104.22 -> */
      /* Ver.1.33.6 -> */
      var theta = omega*dt;
      var sint = Math.sin(theta);
      var cost = Math.cos(theta);
      var s0 = 1+amp_sin*(sint-1);  // [0,1]
      var s1 = (isInv)? 1+amp_sin*(cost-1): s0;
      /* -> Ver.1.33.6 */
      var i0 = i*number_channels+0;
      var i1 = (isStereo)? i*number_channels+1: i0;
      /* Ver.1.45.11 -> */
      var ampVal0 = _arrb_float32[i0];
      var ampVal1 = _arrb_float32[i1];
      /* -> Ver.1.45.11 */
      blender(ampVal0, ampVal1, s0, s1, _amps_);
      _arrb_float32[i0] = _amps_.val0*kampli_blend;
      if(isStereo) _arrb_float32[i1] = _amps_.val1*kampli_blend;
      /* -> Ver.1.104.22 */
    }
  }
  var maxAmp = data.maxAmp;
  var aval_max = 0;
  for(var i=0; i<total_samples; ++i){
    var val = _arrb_float32[i];
    var aval = (val < 0)? -val: val;  // abs
    if(aval > aval_max) aval_max = aval;
  }
  var kampli_post0 = 1/(aval_max || 1);  // Ver.2.112.26
  var kampli_post = (maxAmp)? kampli_post0: 1;
  var kampli_max = data.kampli*kampli_post0;  // Ver.1.75.14
  data._amplitude_max = (maxAmp)? self.post_maxAmp[(kampli_post0 === 1.0)? "eq": "simeq"]+String(kampli_max): kampli_max;  // Ver.1.36.6
  if(maxAmp && kampli_post !== 1){
    for(var i=0; i<total_samples; ++i){
      _arrb_float32[i] *= kampli_post;
    }
  }
  /* -> Ver.1.32.6 */
  /* -> Ver.1.29.4 */
  return _arrb_float32;  // Ver.1.108.23  // Ver.2.112.26
};
My_entry.handler_wave.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;  // Ver.1.105.22
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;  // Ver.1.105.22
    if(len_out === len_in){
      /* Ver.1.108.23 -> */
      /* Ver.1.105.22 -> */
      self.scripts.arr_ids.forEach(function(params_perChannel, i){
        self.scripts.arr_buffers[i] = [];
        var sum_len_ADS = 0;
        var sum_len_ADSR = 0;
        params_perChannel.forEach(function(params_perTime, j){
          var id = self.scripts.arr_ids[i][j];
          var data_id = self.arr_data_out[id];
          var out = data_id.out;
          var len_ADS = data_id.number_samples;
          var len_ADSR = out.byteLength/4;  // Ver.2.112.26
          var ns = sum_len_ADS;
          var ne = ns+len_ADSR-1;
          self.scripts.arr_buffers[i][j] = {ns: ns, ne: ne, out: (data_id.isRest)? null: out};  // Ver.2.121.27
          sum_len_ADS += len_ADS;
          sum_len_ADSR = Math.max(sum_len_ADSR, ne+1);
        });
        self.scripts.arr_number_samples[i] = sum_len_ADSR;
      });
      /* -> Ver.1.105.22 */
      /* -> Ver.1.108.23 */
    /* Ver.1.40.9 -> */
      var log = "";
    try{
      var data0 = self.arr_data_out[0];  // Ver.1.105.22
      self.update_scripts(data0);  // Ver.1.108.23
      data0.out = self.composite_buffer_soundData_LE(data0);  // Ver.1.103.22  // Ver.1.105.22  // Ver.1.108.23
      data0.number_samples = self.scripts.number_samples_perChannel_max;  // Ver.1.103.22  // Ver.1.105.22
      self.waveo.make_blob(data0, function(blob){return self.handler_link.link.set_blob(blob);});  // Ver.1.103.22  // Ver.1.110.25
    }
    catch(e){
      log = e.message;
      self.handler_link.link.name = self.fileName_default+".wav";  // Ver.1.68.14
      self.handler_link.link.clear_url();
    }
      self.stop_worker();
      self.output_amplitude_max(data0);  // Ver.1.35.6  // Ver.2.112.26
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
My_entry.handler_wave.prototype.str2sec = function(str, params0){  // Ver.2.117.26
  var self = this;
  var msec = (str === "")? self.msec_BPM0: Number(str);  // Ver.2.117.26
  var mct = str.match(self.regex.qn);
  if(mct && mct.length){
    var nume = Number(mct[1] || 1);
    var deno = Number(mct[2] || 1);
    msec = (deno)? self.msec_BPM0*nume/deno: 0;  // Ver.2.117.26
  }
  /* Ver.1.65.14 -> */
  if(isNaN(msec)){
    throw new Error(self.waveo.config.ERROR.title+"Invalid time-"+str);
  }
  /* -> Ver.1.65.14 */
  var _sec = msec/1000;
  var ktempo = self.calc_tempo(params0.BPM || self.params.BPM) || 0;  // Ver.1.17.4  // Ver.2.117.26
  _sec *= ktempo;  // Ver.1.17.4
  return _sec;
};
My_entry.handler_wave.prototype.str2freq = function(params){  // Ver.1.84.15  // Ver.1.91.19  // Ver.1.100.21
  var self = this;
  var _freq = self.calc_freq({base: params.base, root: params.root, note: params.note, alt_chord: params.alt_chord}, params.A4, params.tune, params.mode, {lockPitch: params.lockPitch, useEqual_interpolation: params.useEqual_interpolation});  // Ver.1.44.11  // Ver.1.84.15  // Ver.1.91.19  // Ver.1.100.21  // Ver.1.101.21  // Ver.1.101.22
  /* Ver.1.65.14 -> */
  if(isNaN(_freq)){
    throw new Error(self.waveo.config.ERROR.title+"Invalid frequency-"+params.note);  // Ver.1.100.21
  }
  /* -> Ver.1.65.14 */
  var kpitch = Math.pow(2, self.params.pitch || 0);  // Ver.1.17.4  // Ver.1.83.15  // Ver.1.84.15
  _freq *= kpitch;  // Ver.1.17.4
  return _freq;
};
My_entry.handler_wave.prototype.str2arr_f = function(params){  // Ver.1.84.15  // Ver.1.91.19  // Ver.1.100.21
  var self = this;
  var _arr_f = [0];
  var str = params.note;  // Ver.1.100.21
  var mcl = str.match(self.regex.ml);
  /* Ver.1.101.21 -> */
  var mcc = str.match(self.regex.chord);
  var isChord = !!(mcc && mcc[1] && mcc[2]);
  var f_isFound = false;
  if(isChord){
    f_isFound = [];
    var str_root = mcc[1];
    var inversion = (mcc[3] === undefined)? 0: Number(mcc[3]);
    var arr_num = mcc[2].split(",").map(Number);
    if(mcc[3] === "" || isNaN(inversion) || Math.abs(inversion) > self.octaves*arr_num.length) throw new Error(self.waveo.config.ERROR.title+"Invalid chord-"+str);
    var inv_int = Math.floor(inversion);
    var inv_frac = inversion-inv_int;  // [0,1)
    var arr_alt = arr_num.map(function(x, i){
      var calc_offset = function(inv){return Math.floor((inv-i-1)/arr_num.length+1);};
      var offset0 = calc_offset(inv_int);
      var offset1 = calc_offset(inv_int+1);
      var offset = offset0+(offset1-offset0)*inv_frac;
      return x+self.edo*offset;
    });
    arr_alt.forEach(function(alt, k){
      if(isNaN(alt)) throw new Error(self.waveo.config.ERROR.title+"Invalid chord-"+str);
      params.root = str_root;
      params.note = str_root;
      params.alt_chord = alt;
      f_isFound[k] = self.str2freq(params);
    });
  }
  else if(mcl){
    f_isFound = [];
    var arr_f = mcl[0].replace(self.regex.rl, "").split(",");
    arr_f.forEach(function(str, k){
      params.note = str;  // Ver.1.100.21
      f_isFound[k] = self.str2freq(params);  // Ver.1.84.15  // Ver.1.91.19
    });
  }
  /* -> Ver.1.101.21 */
  else{
    f_isFound = [self.str2freq(params)];  // Ver.1.84.15  // Ver.1.91.19
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
      var num = (isTime)? self.str2sec(token, params0): Number(token);  // Ver.1.74.14  // Ver.2.117.26
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
  /* Ver.1.97.21 -> */
  var n0 = 3;
  for(var prop in self.tables.ranges){
    var re= new RegExp(prop+"="+self.regex.table);
    var mc = tokens_.match(re);
    if(mc && mc.length){
      var table = self.entry.def.parse2table(mc[1], 2);
      try{
        var size = null;
        if(prop === "tune"){
          size = (table && table[0].length === 1)? 1: self.edo;
        }
        self.entry.def.val2num_table(table, self.tables.ranges[prop], size);
      }
      catch(e){
        e.message += "@"+prop;
        throw e;
      }
      store(prop, table);
      tokens_ = tokens_.replace(re, "");
      if(prop === "type") n0 = 4;
    }
  }
  /* -> Ver.1.97.21 */
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
        /* Ver.1.100.21 -> */
        var prop_sn = prop.match(self.regex.sn);
        var token_sn = token.match(self.regex.sn);
        if(prop_sn && !(isNaN(Number(token)))){
          store("base", prop);
          store("A4", token);
        }
        else if((prop === "root") && token_sn){  // Ver.1.98.21
          store(prop, token);
        }
        /* -> Ver.1.100.21 */
        else{
          set_params(prop, token);
        }
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
/* Ver.2.116.26 -> */
My_entry.handler_wave.prototype.apply_macro = function(input){
  var self = this;
  /* Ver.1.85.19 -> */
  var dict = {};
  var _input = input.replace(self.regex.macros, function(match, tag, content){
    dict[tag] = content;
    return "";
  });
  for(var i=0; i<self.regex.macro_depthMax; ++i){
    var isChanged = false;
    var input_prev = _input;
    for(var tag in dict){
      _input = _input.replace(self.regex.make_tag(tag), dict[tag]);
      isChanged = isChanged || (_input !== input_prev);
    }
    if(!(isChanged)) break;
  }
  dict = null;
  /* -> Ver.1.85.19 */
  return _input;
};
My_entry.handler_wave.prototype.script_original2channels = function(input){
  var self = this;
  /* Ver.1.43.11 -> */
  var mcb = input.match(self.regex.mb);
  if(mcb && mcb.length){
    var script_original = "";
    mcb.forEach(function(str, i){
      script_original += str+"\n\n";
    });
    self.output_script(script_original);
    var mc_invalid = script_original.match(self.regex.macro);  // Ver.1.85.19
    if(mc_invalid) throw new Error(self.waveo.config.ERROR.title+"Invalid macro remained: "+mc_invalid[0]);  // Ver.1.42.10  // Ver.1.85.19
  }
  var _mcb = input.replace(self.regex.s, "").match(self.regex.mb);
  /* -> Ver.1.43.11 */
  /* Ver.1.4.2 */
  if(!(_mcb)) throw new Error(self.waveo.config.ERROR.title+"Invalid dataset");
  return _mcb;
};
My_entry.handler_wave.prototype.str2channel = function(str){
  var self = this;
  /* Ver.1.106.22 -> */
  var sc = str.split(self.regex.gain_channel);
  var str_channel = sc[0];
  var gain = Number(sc[1] || 1);
  if(isNaN(gain) || gain < 0 || gain > 1) throw new Error(self.waveo.config.ERROR.title+"Invalid {channel}"+self.regex.gain_channel+gain);
  /* -> Ver.1.106.22 */
  return {str: str_channel, gain: gain};
};
My_entry.handler_wave.prototype.update_arr_token = function(arr_token, tokens, _params0){
  var self = this;
  var token0 = arr_token[0];
  var token1 = arr_token[1];
  var hasOnlyDataset_ext = token0.match("=");
  if(hasOnlyDataset_ext){
    self.make_params_extended(tokens, _params0);  // Ver.1.71.14
    arr_token.length = 0;
  }
  var has1elem = (arr_token.length === 1 && token0 !== "");
  var hasChord = token0.match(self.regex.sn) || token0.match(self.regex.chord);
  var hasTime = token0.match(self.regex.qn) && !(hasChord);
  var b1 = String(self.msec_BPM0);  // Ver.2.117.26
  var f0 = String(0);
  if(has1elem){
    if(self.isClear_command(token0, false)){
      _params0 = {};
    }
    else if(hasTime){
      arr_token.push(f0);
    }
    else{
      arr_token.unshift(b1);
    }
  }
  else{
    hasTime = hasTime || !(isNaN(Number(token0)));
    var hasChord = (hasTime)? token1: token0;
    if(!(hasTime) && hasChord){
      arr_token.unshift(b1);
    }
  }
  return _params0;
};
My_entry.handler_wave.prototype.update_params = function(arr_token, tokens, _params0, params){
  var self = this;
  for(var prop in self.params){
    params[prop] = self.params[prop];
  }
  params.sec = self.str2sec(arr_token[0], _params0);  // Ver.1.73.14  // Ver.2.117.26
  /* Ver.1.20.4 -> */
  var command = arr_token[2];
  /* Ver.1.70.14 -> */
  if(self.isClear_command(command, true)){
    _params0 = {};
  }
  /* -> Ver.1.70.14 */
  self.make_params_extended(tokens, _params0, params);  // Ver.1.69.14  // Ver.1.71.14
  params.note = arr_token[1];  // Ver.1.100.21
  params.arr_f = self.str2arr_f(params);  // Ver.1.73.14  // Ver.1.84.15  // Ver.1.91.19  // Ver.1.100.21
  /* -> Ver.1.20.4 */
  return _params0;
};
My_entry.handler_wave.prototype.input2arr = function(input){
  var self = this;
  var _arr_input = [];
  /* Ver.1.41.9 -> */
  var input_ = (My_entry.flag.hasFlagS)? input: input.replace(self.regex.s, "");  // Ver.1.43.11
  input_ = self.entry.def.remove_comments(input_);  // Ver.1.89.19
  input_ = self.apply_macro(input_);
  var channels = self.script_original2channels(input_);
  /* -> Ver.1.41.9 */
  /* Ver.1.4.2 */
  var len_band = Math.max(channels.length/self.waveo.number_channels, 1);  // from waveo  // Ver.1.106.22
  channels.forEach(function(str, i){  // include empty channel {}
    _arr_input[i] = [];
    var params0 = {};  // Ver.1.20.4
    var channel = self.str2channel(str);
    var arr_data = self.entry.def.split_outside_all_pairs(channel.str.replace(self.regex.rb, ""), ";");  // Ver.1.97.21
    arr_data.forEach(function(tokens, j){
      var arr_token = self.entry.def.split_outside_all_pairs(tokens, ":");  // Ver.1.97.21
      /* Ver.1.44.11 -> */
      params0 = self.update_arr_token(arr_token, tokens, params0);
      var hasDataset_base = (arr_token.length > 1);  // Ver.1.70.14
      /* -> Ver.1.44.11 */
      if(hasDataset_base){
        var params = {};
        params0 = self.update_params(arr_token, tokens, params0, params);
        params.gain_band = channel.gain/len_band;  // Ver.1.73.14  // Ver.2.113.26
        params.isRest = (params.arr_f.length === 1 && params.arr_f[0] === 0);  // Ver.2.121.27
        _arr_input[i].push(params);
      }
    });
  });
  return _arr_input;
};
/* -> Ver.2.116.26 */
/* Ver.1.105.22 -> */
My_entry.handler_wave.prototype.update_scripts = function(param0){
  var self = this;
  self.scripts.number_samples_perChannel_max = Math.max.apply(Math, self.scripts.arr_number_samples);
  /* Ver.1.30.5 -> */
  var fileSizeMax = 0;
  var sec = null;
  if(param0){
    fileSizeMax = param0.fileSizeMax;
    sec = self.scripts.number_samples_perChannel_max/param0.samples_perSecond;
    self.output_time(sec);
    self.output_fileSize(sec);
  }
  /* -> Ver.1.30.5 */
  self.waveo.check_error({fileSizeMax: fileSizeMax, sec: sec, number_samples: self.scripts.number_samples_perChannel_max, arr_f: []});
  return self;
};
My_entry.handler_wave.prototype.check_script = function(input){
  var self = this;
  var _arr_params = [];
  var arr_input = self.input2arr(input);
  var len_i = arr_input.length;
  self.scripts.arr_ids = new Array(len_i);
  self.scripts.arr_number_samples = new Array(len_i);
  self.scripts.arr_buffers = new Array(len_i);  // Ver.1.108.23
  var counter = 0;
  var memo = {};
  arr_input.forEach(function(params_perChannel, i){
    var number_samples_perChannel = 0;
    var len_j = params_perChannel.length;
    self.scripts.arr_ids[i] = new Array(len_j);
    params_perChannel.forEach(function(params_perTime, j){
      var number_samples = self.waveo.get_number_samples(params_perTime.sec);
      params_perTime.isScript = true;
      params_perTime.number_samples = number_samples;
      params_perTime.number_channels = 1;
      var params = self.waveo.check_params(params_perTime);
      var json = JSON.stringify(params);
      if(memo[json] === undefined){
        self.scripts.arr_ids[i][j] = memo[json] = counter++;
        _arr_params.push(params);
      }
      else{
        self.scripts.arr_ids[i][j] = memo[json];
      }
      number_samples_perChannel += number_samples;
    });
    self.scripts.arr_number_samples[i] = number_samples_perChannel;
  });
  memo = null;
  self.update_scripts(_arr_params[0]);
  return _arr_params;
};
/* -> Ver.1.105.22 */
