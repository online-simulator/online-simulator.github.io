// online-simulator.github.io

My_entry.def.mix_in(My_entry.handler_wave, My_entry.original_worker);

My_entry.handler_wave.prototype.composite_binary_soundData_LE = function(arr_binary, arr_number_samples, data){
  var self = this;
  var isLE = true;
  var number_samples_perChannel_max = data.number_samples_perChannel_max;
  var number_channels = self.waveo.number_channels;  // from waveo
  var Bytes_perSample = data.Bytes_perSample;
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
  var hasCh2 = (arr_binary.length > 1)? true: false;
  var isNotExist_ch2 = !(hasCh2) && (number_channels === 2);
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
      if(isNotExist_ch2){
        newSetter(j_new+Bytes_perSample, newVal, isLE);
      }
    }
    /* -> Ver.1.18.4 */
  });
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
      self.stop_worker();
      self.output_log();
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
  var mcb = input.replace(self.regex.s, "").match(self.regex.mb);
  /* Ver.1.4.2 */
  if(!(mcb)) throw new Error(self.waveo.config.ERROR.title+"Invalid dataset");
  var number_channels = self.waveo.number_channels;  // from waveo
  /* Ver.1.4.2 */
  /* Ver.1.17.4 -> */
  var ktempo = self.params.tempo || 0;
  var kpitch = Math.pow(2, self.params.pitch || 0);
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
      var code = Number(mc_oc[2]);
      _freq = self.calc_freq(octave, code);
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
      3: "sawtooth"
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
      "order"  // Ver.1.26.4
    ];
    var params0 = {};
    /* -> Ver.1.20.4 */
    var arr_data = str.replace(self.regex.rb, "").split(";");
    arr_data.forEach(function(tokens, j){
      var arr_token = tokens.split(":");
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
              case "f0":
              case "f1":
                param = num;
                break;
              // Ver.1.26.4
              case "order":
              // Ver.1.24.4
              case "rate":
                param = self.entry.def.limit(num, 0, Number.MAX_VALUE, 1);
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
  var sec = null;
  var params_all = {};
  if(_arr_params[0]){
    _arr_params[0].number_samples_perChannel_max = number_samples_perChannel_max;
    sec = number_samples_perChannel_max/_arr_params[0].samples_perSecond;
    self.output_time(sec);
    self.output_fileSize(sec);
  }
  params_all.sec = sec;
  params_all.number_samples = number_samples_perChannel_max;
  params_all.arr_f = [];
  self.waveo.check_error(params_all);
  return _arr_params;
};
