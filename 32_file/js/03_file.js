// online-simulator.github.io

My_entry.test_file = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_file, My_entry.original_main);

My_entry.test_file.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$", "conv", "def"]);
  self.type0 = ".*";  // else-Ver.0.28.4
  self.samples_perSecond = 1;
  self.Nsmax = 5000;
  /* else-Ver.0.27.4 -> */
  self.ByteMax = 256;  // else-Ver.0.28.4
  self.Nhex = self.ByteMax*2;
  self.hex0 = [];
  self.dec0 = [];
  self.len0 = [];
  var set0 = function(n, str){
    var _zeros = "";
    for(var i=0; i<n; ++i){
      _zeros += str;
    }
    return _zeros;
  };
  /* else-Ver.0.28.4 -> */
  for(var n=0; n<=self.Nhex; ++n){
    self.hex0[n] = set0(n, "0");
    self.dec0[n] = set0(n, " ");
  }
  for(var n=0; n<=self.ByteMax; ++n){
    var hex = "0x0";
    for(var i=0; i<n; ++i){
      hex += "ff";
    }
    self.len0[n] = String((My_entry.flag.hasBigInt)? BigInt(hex): Number(hex)).length+1;
  }
  self.useBigInt = function(Bytes_perSample){
    return (Bytes_perSample >= 7);
  };
  /* -> else-Ver.0.28.4 */
  /* -> else-Ver.0.27.4 */
  return self;
};
My_entry.test_file.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  $.setup_elems_readonly$("input,textarea");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_file.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    if(self.isLocked) return false;
    self.reset();
    var id = elem.id || elem.innerText;
    switch(id){
      case "make":
        self.output();  // sync
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    if(self.isLocked) return false;
    self.reset();
    var id = elem.id || elem.innerText;
    switch(id){
      case "input-file-wav":
        self.read_file(elem);  // async
        break;
      default:
        self.update();  // sync
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_file.prototype.clear = function(){
  var self = this;
  self.params = null;
  self.buffer = null;
  return self;
};
My_entry.test_file.prototype.reset = function(){
  var self = this;
  var $ = self.entry.$;
  $._id("input-Nsmax").value = "";
  self.output_log("");
  self.isLocked = false;
  return self;
};
My_entry.test_file.prototype.update = function(){
  var self = this;
  var $ = self.entry.$;
  var params = self.params;
  if(params){
    params.Bytes_header = self.entry.def.limit($.inputInt_id("input-Bytes_header"), 0, params.Bytes_file, 0);  // Ver.1.49.11
    params.Bytes_perSample = self.entry.def.limit($.inputInt_id("input-Bytes_perSample"), 1, self.ByteMax, 1);  // else-Ver.0.27.4
    params.number_channels = 1;  // else-Ver.0.27.4
    params.Bytes_data = params.Bytes_file-params.Bytes_header;
    params.is = null;
    params.di = null;
    params.Ns = null;
    params.Nsmax = null;
    var Nsmax = params.Bytes_data/(params.Bytes_perSample*params.number_channels);
    /* else-Ver.0.28.4 -> */
    var msg = "make disabled";
    Nsmax = Math.floor(Nsmax);
    var isOK = (Nsmax && Nsmax%1 === 0);
    if(!(My_entry.flag.hasBigInt) && self.useBigInt(params.Bytes_perSample)){
      isOK = false;
      msg = "BigInt not supported";
    }
    /* -> else-Ver.0.28.4 */
    if(isOK){
      /* Ver.1.49.11 -> */
      params.is = self.entry.def.limit($.inputInt_id("input-is"), 0, Nsmax-1, 0);
      params.di = self.entry.def.limit($.inputInt_id("input-di"), 1, Nsmax, 1);
      params.Ns = self.entry.def.limit($.inputInt_id("input-Ns"), 1, self.Nsmax, 1);
      /* -> Ver.1.49.11 */
      params.Nsmax = Nsmax;
      params.showCharacter = $.checkbox_id("checkbox-showCharacter");  // else-Ver.0.30.4  // else-Ver.0.31.4
    }
    $._id("input-Nsmax").value = params.Nsmax;
    self.output_log((isOK)? self.make_log(params.samples_perSecond): msg);  // else-Ver.0.28.4
  }
  return self;
};
My_entry.test_file.prototype.make_log = function(samples_perSecond){
  var self = this;
  var _log = "data=\n";  // else-Ver.0.27.4
  return _log;
};
My_entry.test_file.prototype.output_log = function(log){
  var self = this;
  var $ = self.entry.$;
  $._id("textarea-plot2d-hex").value = log;  // else-Ver.0.28.4
  $._id("textarea-plot2d").value = log;
  return self;
};
/* else-Ver.0.27.4 -> */
/* else-Ver.0.31.4 */
My_entry.test_file.prototype.uintBE2str = function(uintBE, Bytes_perSample){
  var self = this;
  var _str = "";
  var hex = uintBE.toString(16);
  for(var i=hex.length; i>0; i-=2){
    var is = i;
    var ie = is-2;
    var uint8 = parseInt(hex.substring(is, ie), 16);
    var char = String.fromCharCode(uint8);
//    var char = self.entry.conv.arr_uint8_2binary([uint8]);
//    var char = self.entry.conv.arr_uint8_2str([uint8]);
    _str = char+_str;
  }
  return _str;
};
My_entry.test_file.prototype.val2hex = function(val, Bytes_perSample){
  var self = this;
  /* else-Ver.0.28.4 -> */
  var hasMinus = (val < 0);
  var sign = (hasMinus)? "-": " ";
  var aval = (hasMinus)? -val: val;  // for BigInt
  /* -> else-Ver.0.28.4 */
  var hex = aval.toString(16);
  var zeros = self.hex0[Math.min(Bytes_perSample*2-hex.length, self.Nhex)] || "";
  return (sign+"0x"+zeros+hex);
};
My_entry.test_file.prototype.val2dec = function(val, Bytes_perSample){
  var self = this;
  var dec = String(val);
  var zeros = self.dec0[Math.min(self.len0[Bytes_perSample]-dec.length, self.Nhex)] || "";  // else-Ver.0.28.4
  return (zeros+dec);
};
/* else-Ver.0.28.4 */
My_entry.test_file.prototype.val2val = function(val0, val1){
  var self = this;
  var dec0 = String(val0);
  var dec1 = String(val1);
  var zeros = self.dec0[dec1.length-dec0.length] || "";
  return (zeros+dec0);
};
My_entry.test_file.prototype.output = function(){  // Ver.1.51.11
  var self = this;
  var $ = self.entry.$;
  self.update();
  var params = self.params;
  var buffer = self.buffer;
  if(params && buffer && params.Nsmax){
    var Bytes_header = params.Bytes_header;
    var Bytes_perSample = params.Bytes_perSample;
    var number_channels = params.number_channels;
    var samples_perSecond = params.samples_perSecond;
    var is = params.is;
    var di = params.di;
    var Ns = params.Ns;
    var Nsmax = params.Nsmax;
    var showCharacter = params.showCharacter;  // else-Ver.0.30.4
    var view = new DataView(buffer, Bytes_header);
    /* Ver.1.49.11 -> */
    /* Ver.1.48.11 -> */
    /* else-Ver.0.28.4 -> */
    var useBigInt = self.useBigInt(Bytes_perSample);
    var handler_baseview = new self.constructors.handler_baseview(null, useBigInt).make_view(null, Bytes_perSample);
    /* -> else-Ver.0.28.4 */
    var getter_uint = function(){
      return handler_baseview.getUint8n(view, Bytes_perSample, arguments[0], arguments[1]);
    };
    var getter_int = function(){
      return handler_baseview.getInt8n(view, Bytes_perSample, arguments[0], arguments[1]);
    };
    /* -> Ver.1.48.11 */
    /* -> Ver.1.49.11 */
    var isMulti = (Bytes_perSample > 1);
    var text = self.make_log(samples_perSecond);
    text += "(\n";  // else-Ver.0.48.7
    /* else-Ver.0.28.4 -> */
    var text_hex = text;
    var ns = 0;
    for(var i=is; i<Nsmax; i+=di){
      if(++ns > Ns) break;  // first
      var i0 = (i*number_channels+0)*Bytes_perSample;
      var uintBE = getter_uint(i0, false);
      var intBE = getter_int(i0, false);
      var uintLE = getter_uint(i0, true);
      var intLE = getter_int(i0, true);
      var hexBE = self.val2hex(uintBE, Bytes_perSample);
      var hexLE = self.val2hex(uintLE, Bytes_perSample);
      var str = (showCharacter)? self.uintBE2str(uintBE, Bytes_perSample): "";  // else-Ver.0.30.4  // else-Ver.0.31.4
      var No_dec = Bytes_header+i0;
      var No_hex = self.val2hex(No_dec, 2);
      No_hex = self.val2val(No_hex, No_dec);
      No_dec = self.val2val(No_dec, No_hex);
      uintBE = self.val2dec(uintBE, Bytes_perSample);
      intBE = self.val2dec(intBE, Bytes_perSample);
      uintLE = self.val2dec(uintLE, Bytes_perSample);
      intLE = self.val2dec(intLE, Bytes_perSample);
      if(i > is){
        text += ",\n";  // else-Ver.0.48.7
        text_hex += ",\n";  // else-Ver.0.48.7
      }
      text += "{\n";
      text += No_hex;
      text += ", ";
      text += hexBE;
      text += ", ";
      text += uintBE;
      text += ", ";
      text += intBE;
      text += ",\n";
      text += No_dec;
      text_hex += "{\n";
      text_hex += No_hex;
      text_hex += ", ";
      text_hex += hexBE;
      /* else-Ver.0.30.4 -> */
      text_hex += ",";
      /* else-Ver.0.31.4 -> */
      if(str){
        text_hex += (str.length > 1)? ("  /*   "+str+"   */"): ("  //   "+str);
      }
      /* -> else-Ver.0.31.4 */
      text_hex += "\n";
      /* -> else-Ver.0.30.4 */
      text_hex += No_dec;
      if(isMulti){
        text += ", ";
        text += hexLE;
        text += ", ";
        text += uintLE;
        text += ", ";
        text += intLE;
      }
      text += "\n}";
      text_hex += "\n}";
    }
    text += "\n);\n\n";  // else-Ver.0.48.7
    text += "xt=data[0];\n";  // else-Ver.0.48.7
    var bits = Bytes_perSample*8;
    var hex8n = "hex"+bits;  // else-Ver.0.30.4
    var uint8n = "uint"+bits;
    var int8n = "int"+bits;
    var sw_index = (isMulti)? "7/*1:"+hex8n+"BE, 2:"+uint8n+"BE, 3:"+int8n+"BE, 5:"+hex8n+"LE, 6:"+uint8n+"LE, 7:"+int8n+"LE*/": "1/*1:"+hex8n+", 2:"+uint8n+", 3:"+int8n+"*/";  // else-Ver.0.30.4
    /* else-Ver.0.48.7 -> */
    text += "yt=data["+sw_index+"];\n";
    text += "fft1d(yt);\n";
    text_hex += "\n);\n\n";
    text_hex += "xt=data[0];\n";
    text_hex += "yt=data[1];\n";
    text_hex += "fft1d(yt);\n";
    /* -> else-Ver.0.48.7 */
    $._id("textarea-plot2d-hex").value = text_hex;
    $._id("textarea-plot2d").value = text;
    /* -> else-Ver.0.28.4 */
  }
  return self;
};
My_entry.test_file.prototype.read_file = function(elem){
  var self = this;
  var $ = self.entry.$;
  var conv = self.entry.conv;
  self.isLocked = true;
  self.clear();
  self.output_log("Now reading...");
  var file = $.readFile_elem(elem, new RegExp(self.type0), function(e){  // else-Ver.0.27.4  // else-Ver.0.28.4
    var base64 = e.target.result;
    var buffer = conv.base2buffer(base64);
    var view = new DataView(buffer, 0);
    var params = {};
    params.Bytes_file = view.byteLength;
    self.params = params;
    self.buffer = buffer;
    self.update();
    self.isLocked = false;
  });
  if(!(file)){
    elem.value = null;
    self.output_log("input-file.* not found");  // else-Ver.0.27.4
    self.isLocked = false;
  }
  $._id("span-MIME-type").innerText = (file)? file.type: self.type0;  // Ver.1.49.11  // else-Ver.0.28.4
  return self;
};
/* -> else-Ver.0.27.4 */
