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
  self.samples_perSecond = 1;
  self.Nsmax = 5000;
  /* else-Ver.0.27.4 -> */
  self.ByteMax = 128;
  self.digitMax = 17;
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
  for(var n=0; n<=self.Nhex; ++n){
    self.hex0[n] = set0(n, "0");
  }
  for(var n=0; n<=self.ByteMax; ++n){
    self.dec0[n] = set0(n, " ");
    self.len0[n] = Math.min(String(Math.pow(2, n*8)).length, self.digitMax)+1;
  }
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
    params.Bytes_header = self.entry.def.limit(Math.floor($.inputNum_id("input-Bytes_header")), 0, params.Bytes_file, 0);  // Ver.1.49.11
    params.Bytes_perSample = self.entry.def.limit(Math.floor($.inputNum_id("input-Bytes_perSample")), 1, self.ByteMax, 1);  // else-Ver.0.27.4
    params.number_channels = 1;  // else-Ver.0.27.4
    params.Bytes_data = params.Bytes_file-params.Bytes_header;
    params.is = null;
    params.di = null;
    params.Ns = null;
    params.Nsmax = null;
    var Nsmax = params.Bytes_data/(params.Bytes_perSample*params.number_channels);
    var isOK = (Nsmax && Nsmax%1 === 0);
    if(isOK){
      /* Ver.1.49.11 -> */
      params.is = self.entry.def.limit(Math.floor($.inputNum_id("input-is")), 0, Nsmax-1, 0);
      params.di = self.entry.def.limit(Math.floor($.inputNum_id("input-di")), 1, Nsmax, 1);
      params.Ns = self.entry.def.limit(Math.floor($.inputNum_id("input-Ns")), 1, self.Nsmax, 1);
      /* -> Ver.1.49.11 */
      params.Nsmax = Nsmax;
    }
    $._id("input-Nsmax").value = params.Nsmax;
    self.output_log((isOK)? self.make_log(params.samples_perSecond): "make disabled");
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
  $._id("textarea-plot2d").value = log;
  return self;
};
/* else-Ver.0.27.4 -> */
My_entry.test_file.prototype.val2hex = function(val, Bytes_perSample){
  var self = this;
  var sign = (val < 0)? "-": " ";
  var aval = Math.abs(val);
  var hex = aval.toString(16);
  var zeros = self.hex0[Math.min(Bytes_perSample*2-hex.length, self.Nhex)] || "";
  return (sign+"0x"+zeros+hex);
};
My_entry.test_file.prototype.val2dec = function(val, Bytes_perSample){
  var self = this;
  var dec = String(val);
  var zeros = self.dec0[Math.min(self.len0[Bytes_perSample]-dec.length, self.ByteMax)] || "";
  return (zeros+dec);
};
My_entry.test_file.prototype.output = function(elem){
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
    var view = new DataView(buffer, Bytes_header);
    /* Ver.1.49.11 -> */
    /* Ver.1.48.11 -> */
    var handler_baseview = new self.constructors.handler_baseview().make_view(null, Bytes_perSample);
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
    text += "{\n";
    var ns = 0;
    for(var i=is; i<Nsmax; i+=di){
      if(++ns > Ns) break;  // first
      var i0 = (i*number_channels+0)*Bytes_perSample;
      var uintBE = getter_uint(i0, false);
      var intBE = getter_int(i0, false);
      var uintLE = getter_uint(i0, true);
      var intLE = getter_int(i0, true);
      var noByte = self.val2hex(Bytes_header+i0, 2);
      if(i > is){
        text += ":\n";
      }
      text += "{\n";
      text += String(noByte);
      text += ", ";
      text += self.val2hex(uintBE, Bytes_perSample);
      text += ", ";
      text += self.val2dec(uintBE, Bytes_perSample);
      text += ", ";
      text += self.val2dec(intBE, Bytes_perSample);
      if(isMulti){
        text += ",\n";
        text += String(noByte);
        text += ", ";
        text += self.val2hex(uintLE, Bytes_perSample);
        text += ", ";
        text += self.val2dec(uintLE, Bytes_perSample);
        text += ", ";
        text += self.val2dec(intLE, Bytes_perSample);
      }
      text += "\n}";
    }
    text += "\n};\n\n";
    text += "xt=trans(data[0]);\n";
    var bits = Bytes_perSample*8;
    var uint8n = "uint"+bits;
    var int8n = "int"+bits;
    var sw_index = (isMulti)? "7/*1:hexBE, 2:"+uint8n+"BE, 3:"+int8n+"BE, 5:hexLE, 6:"+uint8n+"LE, 7:"+int8n+"LE*/": "1/*1:hex, 2:"+uint8n+", 3:"+int8n+"*/";
    text += "yt=trans(data["+sw_index+"]);\n";
    self.output_log(text);
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
  var file = $.readFile_elem(elem, /.*/, function(e){  // else-Ver.0.27.4
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
  else{
    $._id("span-MIME-type").innerText = file.type;  // Ver.1.49.11
  }
  return self;
};
/* -> else-Ver.0.27.4 */
