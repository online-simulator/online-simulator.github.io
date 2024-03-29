// online-simulator.github.io

My_entry.test_waveplot = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_waveplot, My_entry.original_main);

My_entry.test_waveplot.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$", "conv", "def"]);
  self.type0 = "audio\/wav";  // else-Ver.0.28.4
  self.samples_perSecond = 44100;
  self.Nsmax = 500000;
  return self;
};
My_entry.test_waveplot.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  $.setup_elems_readonly$("input,textarea");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_waveplot.prototype.init_handlers = function(){
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
My_entry.test_waveplot.prototype.clear = function(){
  var self = this;
  self.params = null;
  self.buffer = null;
  return self;
};
My_entry.test_waveplot.prototype.reset = function(){
  var self = this;
  var $ = self.entry.$;
  $._id("input-Nsmax").value = "";
  self.output_log("");
  self.isLocked = false;
  return self;
};
My_entry.test_waveplot.prototype.update = function(){
  var self = this;
  var $ = self.entry.$;
  var params = self.params;
  if(params){
    params.Bytes_header = self.entry.def.limit($.inputInt_id("input-Bytes_header"), 0, params.Bytes_file, 0);  // Ver.1.49.11
    params.Bytes_perSample = $.selectNum_id("select-Bytes_perSample");
    params.number_channels = $.selectNum_id("select-number_channels");
    params.Bytes_data = params.Bytes_file-params.Bytes_header;
    params.is = null;
    params.di = null;
    params.Ns = null;
    params.Nsmax = null;
    var Nsmax = params.Bytes_data/(params.Bytes_perSample*params.number_channels);
    var isOK = (Nsmax && Nsmax%1 === 0);
    if(isOK){
      /* Ver.1.49.11 -> */
      params.is = self.entry.def.limit($.inputInt_id("input-is"), 0, Nsmax-1, 0);
      params.di = self.entry.def.limit($.inputInt_id("input-di"), 1, Nsmax, 1);
      params.Ns = self.entry.def.limit($.inputInt_id("input-Ns"), 1, self.Nsmax, 1);
      /* -> Ver.1.49.11 */
      params.Nsmax = Nsmax;
    }
    $._id("input-Nsmax").value = params.Nsmax;
    self.output_log((isOK)? self.make_log(params.samples_perSecond): "make disabled");
  }
  return self;
};
My_entry.test_waveplot.prototype.make_log = function(samples_perSecond){
  var self = this;
  var _log = "samples_perSecond="+((samples_perSecond)? samples_perSecond: self.samples_perSecond+"/*unknown*/")+";\n";
  return _log;
};
My_entry.test_waveplot.prototype.output_log = function(log){
  var self = this;
  var $ = self.entry.$;
  $._id("textarea-plot2d").value = log;
  return self;
};
My_entry.test_waveplot.prototype.output = function(){  // Ver.1.51.11
  var self = this;
  var $ = self.entry.$;
  var text_xt = "";
  var text_yt0 = "";
  var text_yt1 = "";
  self.update();
  var params = self.params;
  var buffer = self.buffer;
  if(params && buffer && params.Nsmax){
    var Prop = (params.Bytes_perSample === 1)? "Uint8": "Int"+String(params.Bytes_perSample*8);  // Ver.1.46.11
    var Bytes_header = params.Bytes_header;
    var Bytes_perSample = params.Bytes_perSample;
    var number_channels = params.number_channels;
    var samples_perSecond = params.samples_perSecond;
    var isStereo = (number_channels === 2);
    var is = params.is;
    var di = params.di;
    var Ns = params.Ns;
    var Nsmax = params.Nsmax;
    var view = new DataView(buffer, Bytes_header);
    /* Ver.1.49.11 -> */
    /* Ver.1.48.11 -> */
    var hasViewProp = (view["get"+Prop]);
    var handler_baseview = (hasViewProp)? null: new self.constructors.handler_baseview().make_view(Prop, Bytes_perSample);
    var getter = (hasViewProp)?
      function(){
        return view["get"+Prop].apply(view, arguments);
      }:
      function(){
        return handler_baseview.getInt8n(view, Bytes_perSample, arguments[0], arguments[1]);
      };
    /* Ver.1.51.11 -> */
    text_xt += "xt=(1/samples_perSecond)*(";
    text_yt0 += "yt0=(";
    text_yt1 += "yt1=(";
    /* -> Ver.1.51.11 */
    /* -> Ver.1.48.11 */
    /* -> Ver.1.49.11 */
    var ns = 0;
    for(var i=is; i<Nsmax; i+=di){
      if(++ns > Ns) break;  // first
      if(i > is){
        text_xt += ",";
        text_yt0 += ",";
        text_yt1 += ",";
      }
      var i0 = (i*number_channels+0)*Bytes_perSample;
      var i1 = (i*number_channels+1)*Bytes_perSample;
      var val0 = getter(i0, true);  // Ver.1.48.11
      var val1 = (isStereo)? getter(i1, true): "";  // Ver.1.48.11
      text_xt += String(i);
      text_yt0 += String(val0);
      text_yt1 += String(val1);
    }
    /* Ver.1.51.11 -> */
    text_xt += ");\n";
    text_yt0 += ");\n";
    text_yt1 += ");\n";
    /* -> Ver.1.51.11 */
    var text = self.make_log(samples_perSecond);
    text += text_xt;
    text += text_yt0;
    /* Ver.1.51.11 -> */
    if(isStereo){
      text += text_yt1;
      text += "yt={yt0,yt1};\n";
    }
    else{
      text += "yt={yt0};\n";
    }
    text += "fft1d(yt0);\n";
    /* -> Ver.1.51.11 */
    self.output_log(text);
  }
  return self;
};
My_entry.test_waveplot.prototype.read_file = function(elem){
  var self = this;
  var $ = self.entry.$;
  var conv = self.entry.conv;
  self.isLocked = true;
  self.clear();
  self.output_log("Now reading...");
  var file = $.readFile_elem(elem, new RegExp("^"+self.type0), function(e){  // else-Ver.0.28.4
    var base64 = e.target.result;
    var buffer = conv.base2buffer(base64);
    var view = new DataView(buffer, 0);
    var params = {};
    params.Bytes_file = view.byteLength;
    params.Bytes_subChunk2 = view.getInt32(4+4+4+4+4+2+2+4+4+2+4+2, true);
    params.Bytes_header = 44;
    params.Bytes_perSample = 2;
    var is44Bytes_header = (params.Bytes_file-params.Bytes_subChunk2 === params.Bytes_header);
    if(is44Bytes_header){
      params.Bytes_chunks      = view.getInt32(4, true);
      params.Bytes_subChunk1   = view.getInt32(4+4+4+4, true);
      params.id_format         = view.getInt16(4+4+4+4+4, true);
      params.number_channels   = view.getInt16(4+4+4+4+4+2, true);
      params.samples_perSecond = view.getInt32(4+4+4+4+4+2+2, true);
      params.Bytes_perSecond   = view.getInt32(4+4+4+4+4+2+2+4, true);
      params.Bytes_perBlock    = view.getInt16(4+4+4+4+4+2+2+4+4, true);
      params.bits_perSample    = view.getInt16(4+4+4+4+4+2+2+4+4+2, true);
      params.Bytes_perSample   = params.bits_perSample/8;
      params.Bytes_header      = params.Bytes_file-params.Bytes_subChunk2;
    }
    else{
      params.Bytes_header = 232;
      params.Bytes_perSample = 2;
      params.number_channels = 2;
    }
    $._id("input-Bytes_header").value = params.Bytes_header;
    $.set_selectVal_id("select-Bytes_perSample", params.Bytes_perSample);
    $.set_selectVal_id("select-number_channels", params.number_channels);
    self.params = params;
    self.buffer = buffer;
    self.update();
    self.isLocked = false;
  });
  if(!(file)){
    elem.value = null;
    self.output_log("input-file.wav not found");
    self.isLocked = false;
  }
  $._id("span-MIME-type").innerText = (file)? file.type: self.type0;  // Ver.1.49.11  // else-Ver.0.28.4
  return self;
};
