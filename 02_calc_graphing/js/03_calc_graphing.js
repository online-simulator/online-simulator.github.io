// online-simulator.github.io

My_entry.calc_graphing = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.calc_graphing, My_entry.original_main);

My_entry.calc_graphing.prototype.config = {
  LOG: {
    numberChars: 5000
  }
};
My_entry.calc_graphing.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "conv", "def", "DATA", "parser"]);
  return self;
};
My_entry.calc_graphing.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elems = {};
  self.elems.i = $._id("input");
  self.elems.o = $._id("output");
  self.elems.h = $._id("history");
  self.elems.x = $._id("input-x");
  self.elems.y = $._id("input-y");
  self.elems.z = $._id("input-z");
  self.elems.d = $._id("output-plot");
  $.set_elem(self.elems.i, "readOnly", null);
  $.setup_elems_readonly$("input,textarea");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  self.entry.def.mix_over(self.constructors.io, self.constructors.io_ex1);
  return self;
};
My_entry.calc_graphing.prototype.output_logh = function(log, logo){
  var self = this;
  var ds = My_entry.$.config.DELIMITER;
  var br = ds.br;
  var rn = ds.rn;
  if(log){
    var logh = log;
    logh += br;
    if(logo && self.logo !== logo){
      self.logo = logo;
      logh += logo;
      logh += rn;
      logh += br+br;
      logh += rn;
    }
    logh += self.logh;
    self.logh = logh;
    self.io.write_text(self.elems.h, self.logh.substr(0, self.config.LOG.numberChars));
  }
  return self;
};
My_entry.calc_graphing.prototype.output_log = function(data){
  var self = this;
  if(data.log){
    self.io.write_text(self.elems.o, data.log.split(";").join(";\n"));
    self.output_logh(data.logh, data.logo);
  }
  else{
    self.io.write_text(self.elems.o, "");
  }
  return self;
};
My_entry.calc_graphing.prototype.re_output_log = function(){
  var self = this;
  var $ = self.entry.$;
  if(self.worker_calc.arr_data_out){
    var data = self.worker_calc.arr_data_out[0];
    /* Ver.1.7.3 */
    data.options.makeLog = 2;
    data.options.expDigit = $.selectNum_id("select-expDigit");
    try{
      self.entry.parser.post_try(data);
    }
    catch(e){
      self.callbacks_worker_calc.onerror(e);
    }
    self.output_log(data);
  }
  return self;
};
My_entry.calc_graphing.prototype.output_log_plot = function(){
  var self = this;
  /* Ver.2.15.6 -> */
  var arr_data_in = self.worker_plot.arr_data_in;
  var arr_data_out = self.worker_plot.arr_data_out;
  var len_in = (arr_data_in)? arr_data_in.length: 0;
  var len_out = (arr_data_out)? Object.keys(arr_data_out).length: 0;
  /* -> Ver.2.15.6 */
  self.io.write_text(self.elems.d, "finished "+len_out+"/"+len_in);
  return self;
};
My_entry.calc_graphing.prototype.output_axis = function(arr2d_vec, options_plot){
  var self = this;
  var $ = self.entry.$;
  var xmin = arr2d_vec.xmin;
  var xmax = arr2d_vec.xmax;
  var ymin = arr2d_vec.ymin;
  var ymax = arr2d_vec.ymax;
  var ed = options_plot.expDigit;
  var callback = (ed >= 0)?
    function(x){return x.toExponential(ed);}:
    function(x){return x;};
  $._id("input-xmin").value = callback(xmin);
  $._id("input-ymin").value = callback(ymin);
  $._id("input-xmax").value = callback(xmax);
  $._id("input-ymax").value = callback(ymax);
  return self;
};
/* Ver.2.16.6 */
My_entry.calc_graphing.prototype.input_axis = function(arr2d_vec){
  var self = this;
  var $ = self.entry.$;
  var xmin = $.inputNum_id("input-xmin");
  var ymin = $.inputNum_id("input-ymin");
  var xmax = $.inputNum_id("input-xmax");
  var ymax = $.inputNum_id("input-ymax");
  arr2d_vec.gxmin = Math.min(Math.min(xmin, xmax), arr2d_vec.xmin);
  arr2d_vec.gymin = Math.min(Math.min(ymin, ymax), arr2d_vec.ymin);
  arr2d_vec.gxmax = Math.max(Math.max(xmin, xmax), arr2d_vec.xmax);
  arr2d_vec.gymax = Math.max(Math.max(ymin, ymax), arr2d_vec.ymax);
  return self;
};
My_entry.calc_graphing.prototype.output_msgError_plot = function(e){
  var self = this;
  var msg = self.entry.def.get_msgError(e, "Invalid plot2d");
  self.io.write_text(self.elems.d, msg.replace("Uncaught Error: ", ""));
  self.elems.d.focus();
  throw false;
  return self;
};
My_entry.calc_graphing.prototype.plot = function(arr_data, options_plot, isFinal){
  var self = this;
  self.plot2d.re_init();
  if(arr_data.length){
    arr_data.forEach(function(data){
      data.arr_num = self.entry.parser.make_arr_num(data);
    });
    var arr2d_vec = self.arr_data2arr2d_vec(arr_data, options_plot);
    /* Ver.2.16.6 -> */
    arr2d_vec.arr_x = self.arr_x;
    arr2d_vec.arr_y = self.arr_y;
    /* -> Ver.2.16.6 */
    if(self.plot2d.isChanged_axis){
      self.input_axis(arr2d_vec);
    }
    else{
      self.output_axis(arr2d_vec, options_plot);
    }
    if(isFinal){
      self.plot2d.final(arr2d_vec, options_plot);
      var options_calc = arr_data[0].options;
      self.output_logh(options_calc.plot2d+"\n", options_calc.logo);  // Ver.2.10.4
      self.elems.d.focus();
    }
    else{
      self.plot2d.run(arr2d_vec, options_plot);
    }
  }
  /* Ver.2.14.5 -> */
  else{
    self.plot2d.objs.temp.detach();
    self.plot2d.isDrawn = false;
  }
  /* -> Ver.2.14.5 */
  self.output_log_plot();
  return self;
};
My_entry.calc_graphing.prototype.re_plot = function(isFinal){
  var self = this;
  var $ = self.entry.$;
  var arr_data = self.worker_plot.arr_data_out;
  if(arr_data){
    setTimeout(function(){
      try{
        self.plot(arr_data, self.get_options(true), isFinal);
      }
      catch(e){
        self.output_msgError_plot(e);
      }
    }, 50);
  }
  return self;
};
My_entry.calc_graphing.prototype.arr_data2arr2d_vec = function(arr_data, options_plot){
  var self = this;
  var arr2d_x = null;
  var arr2d_y = null;
  var isLog_x = (options_plot["log-x"])? true: false;
  var isLog_y = (options_plot["log-y"])? true: false;
  var sw_ri_x = (options_plot["imag-x"])? "i": "r";
  var sw_ri_y = (options_plot["imag-y"])? "i": "r";
  var xmin = Number.MAX_VALUE;
  var ymin = Number.MAX_VALUE;
  var xmax = -Number.MAX_VALUE;
  var ymax = -Number.MAX_VALUE;
  var gxmin = 0;
  var gymin = 0;
  var gxmax = 0;
  var gymax = 0;
  var len_n = 0;
  var len_j = 0;
  if(arr_data){
    arr2d_x = [];
    arr2d_y = [];
    len_n = arr_data.length;
    for(var n=0; n<len_n; ++n){
      var data = arr_data[n];
      var len_x = data.len_x;
      var len_y = data.len_y;
      var arr_num = data.arr_num;
      if(arr_num){
        var len_j = Math.max(len_x, len_y);
        arr2d_x[n] = new Array(len_j);
        arr2d_y[n] = new Array(len_j);
        for(var j=0; j<len_j; ++j){
          var num_x = arr_num[Math.min(j, len_x-1)];
          var num_y = arr_num[Math.min(j+len_x, len_y+len_x-1)];
          if(num_x && num_x.com && num_y && num_y.com){
            var x = arr2d_x[n][j] = num_x.com[sw_ri_x];
            var y =arr2d_y[n][j] = num_y.com[sw_ri_y];
            if(isNaN(self.plot2d.trans(x, isLog_x)) || isNaN(self.plot2d.trans(y, isLog_y))){
              self.plot2d.objs.temp.detach();
              self.plot2d.isDrawn = false;
              throw "Invalid plot2d isNaN";
            }
            else{
              xmin = Math.min(xmin, x);
              ymin = Math.min(ymin, y);
              xmax = Math.max(xmax, x);
              ymax = Math.max(ymax, y);
            }
          }
          else{
            throw "Invalid (x(t),y(t))";
          }
        }
      }
    }
    gxmin = xmin;
    gymin = ymin;
    gxmax = xmax;
    gymax = ymax;
    len_n = arr2d_x.length;
  }
  return {x: arr2d_x, y: arr2d_y, len_n: len_n, len_j: len_j, xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax, gxmin: gxmin, gymin: gymin, gxmax: gxmax, gymax: gymax};
};
My_entry.calc_graphing.prototype.make_log_plot2d = function(){
  var self = this;
  var $ = self.entry.$;
  var ds = My_entry.$.config.DELIMITER;
  var sq = ds.sq;
  var dq = ds.dq;
  var ca = ds.ca;
  var rn = ds.rn;
  var _log = "";
  _log += "plot2d(";
  _log += sq+$.inputVal_id("input-t0")+sq+ca;
  _log += sq+$.inputVal_id("input-t1")+sq+ca;
  _log += sq+$.inputVal_id("input-x")+sq+ca;
  _log += sq+$.inputVal_id("input-y")+sq+ca;
  _log += $.selectVal_id("select-N");
  _log += ")";
  return _log;
};
My_entry.calc_graphing.prototype.arr_data2csv = function(arr_data, arr_x, arr_y, options_plot){
  var self = this;
  var $ = self.entry.$;
  var ds = My_entry.$.config.DELIMITER;
  var dq = ds.dq;
  var ca = ds.ca;
  var rn = ds.rn;
  var _csv = "";
  var sw_ri_x = (options_plot["imag-x"])? "i": "r";
  var sw_ri_y = (options_plot["imag-y"])? "i": "r";
  if(arr_data){
    // index
    _csv += dq+"real(t)"+dq+ca;
    _csv += dq+"imag(t)"+dq+ca;
    for(var j=0, len_j=Math.max(arr_x.length, arr_y.length); j<len_j; ++j){
      var xj = arr_x[j];
      var yj = arr_y[j];
      _csv += (xj)? dq+xj+dq+ca: "";
      _csv += (yj)? dq+yj+dq+ca: "";
    }
    // stamp
    var options_calc = arr_data[0].options;
    _csv += dq+options_calc.plot2d+dq+ca;  // Ver.2.10.4
    _csv += dq+options_calc.logo+dq+ca;    // Ver.2.10.4
    _csv += dq+self.io.getter.stamp()+dq+rn;
    // (x,y)
    var arr2d_vec = self.arr_data2arr2d_vec(arr_data, options_plot);
    var len_n = arr2d_vec.len_n;
    var len_j = arr2d_vec.len_j;
    for(var n=0; n<len_n; ++n){
      var data = arr_data[n];
      var tcr = data.tcr;
      var tci = data.tci;
      _csv += tcr+ca+tci+ca;
      for(var j=0; j<len_j; ++j){
        var xj = arr_x[j];
        var yj = arr_y[j];
        var x = arr2d_vec.x[n][j];
        var y = arr2d_vec.y[n][j];
        _csv += (xj)? x+ca: "";
        _csv += (yj)? y+ca: "";
      }
      _csv += rn;
    }
  }
  return _csv;
};
My_entry.calc_graphing.prototype.get_options = function(isPlot){
  var self = this;
  var $ = self.entry.$;
  var parser = self.entry.parser;
  var _options = {};
  $.get_elemProps("input[type='checkbox']", "checkbox-", "checked", _options);
  $.get_elemProps("select", "select-", "value", _options);
  $.get_urlParams(_options);
  if(_options.checkError !== false) _options.checkError = true;
  /* Ver.2.11.4 */
  /* Ver.2.10.4 */
  if(isPlot){
    _options["input-z"] = parser.remove_commentAndWspace(self.io.read_text(self.elems.z));
    _options["bg-color"] = $.inputVal_id("input-bg-color");
    _options["grid-line-color"] = $.inputVal_id("input-grid-line-color");
    _options["title"] = $.inputVal_id("input-title");
    _options["logo"] = parser.make_logo({options: _options});  // including z
    _options["plot2d"] = self.make_log_plot2d();               // excluding z
  }
  return _options;
};
My_entry.calc_graphing.prototype.get_data = function(input, options){
  var self = this;
  var _data = self.entry.DATA.data();
  _data.in = input;
  _data.options = options;
  self.storage.global2local(_data);
  return _data;
};
My_entry.calc_graphing.prototype.init_storage = function(){
  var self = this;
  self.storage = {};
  self.storage.clear = function(){
    self.vars0 = null;
    self.eqns0 = null;
    self.vars = {};
    self.eqns = {};
  };
  self.storage.store = function(){
    self.vars0 = self.entry.def.newClone(self.vars);
    self.eqns0 = self.entry.def.newClone(self.eqns);
  };
  self.storage.restore = function(){
    self.vars = self.vars0;
    self.eqns = self.eqns0;
  };
  self.storage.global2local = function(data){
    data.vars = self.entry.def.newClone(self.vars);
    data.eqns = self.entry.def.newClone(self.eqns);
  };
  self.storage.local2global = function(data){
    var vars = data.vars;
    var eqns = data.eqns;
    for(var name in vars){
      self.vars[name] = vars[name];
    }
    for(var name in eqns){
      self.eqns[name] = eqns[name];
    }
  };
  return self;
};
My_entry.calc_graphing.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var DATA = self.entry.DATA;
  var parser = self.entry.parser;
  var get_inputs_plot = function(){
    var input = "";
    var x = parser.remove_commentAndWspace(self.io.read_text(self.elems.x));
    var y = parser.remove_commentAndWspace(self.io.read_text(self.elems.y));
    var arr_x = x.split(";").filter(self.entry.def.isNotNullStr);
    var arr_y = y.split(";").filter(self.entry.def.isNotNullStr);
    var len_x = arr_x.length;
    var len_y = arr_y.length;
    if(len_x && len_y){
      x = arr_x.join(";");
      y = arr_y.join(";");
      input = x+";"+y;
    }
    else{
      self.output_msgError_plot("Invalid (x(t),y(t))");
    }
    self.arr_x = arr_x;
    self.arr_y = arr_y;
    return {input: input, len_x: len_x, len_y: len_y};
  };
  var get_num = function(input, options){
    var data = self.get_data(input, options);
    try{
      new self.constructors.parser().run(data);
    }
    catch(e){
      self.output_msgError_plot("Invalid t");
    }
    return DATA.out2num(data.out);
  };
  var clear_imageBg = function(){
    $._id("input-file-bg").value = null;
    self.plot2d.setter.base64_bg(null);
    self.plot2d.setter.img_bg(null);
  };
  self.handlers.onload = function(e){
    var self = this;
    // canvas
    self.plot2d = new self.constructors.plot2d("div-plot2d", 512, 256);
    self.plot2d.setter.callbacks({onmouseup: function(){self.re_plot(true);}});
    // workers
    self.set_callbacks_worker();
    self.worker_calc = new self.constructors.original_workers(My_entry.job_imported, "js/for_url.js", self.callbacks_worker_calc);
    self.worker_plot = new self.constructors.original_workers(My_entry.job_imported, "js/for_url.js", self.callbacks_worker_plot);
    // else
    self.io = new self.constructors.io();
    var json = {p: {id: "wrapper-link-png"}, a: {id: "a-png", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.plot2d.objs.all.getBase64());});
    var json = {p: {id: "wrapper-link-csv"}, a: {id: "a-csv", it: "download-csv by double-click"}, name: "download", ext: "csv"};
    self.handler_link_csv = new self.constructors.handler_link(json);
    self.handler_link_csv.setter.callback(function(){return self.arr_data2csv(self.worker_plot.arr_data_out, self.arr_x, self.arr_y, self.get_options(true));});
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt by double-click"}, name: "download", ext: "txt"};
    self.handler_link = new self.constructors.handler_link(json);
    self.handler_link.setter.callback(function(){return self.logh;});
    self.handler_drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    $.change_elems$("input[type='checkbox']");
    self.io.write_stamp(self.elems.h);
    self.logh = self.io.getter.stamp();
    self.logo = "";
    self.init_storage();
    self.storage.clear();
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.worker_calc.stop(true);
    self.worker_plot.stop(true);
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    var id = elem.id;
    var TAG = elem.tagName.toUpperCase();
    var text = elem[$.config.REFERRER.text];
    var val = elem[$.config.REFERRER.value];
    var text_half = self.entry.reference.fullStr2half(text);
    switch(text_half){
      case "plot":
        /* Ver.2.10.4 */
        if(self.worker_plot && self.worker_plot.handler.isLocked) return false;
        if(self.plot2d.isLocked) return false;
        self.plot2d.init_flags();
        var inputs = get_inputs_plot();
        var options = self.get_options(true);
        options.checkError = false;
        var t0 = get_num($.inputVal_id("input-t0"), options);
        var t1 = get_num($.inputVal_id("input-t1"), options);
        var t0cr = t0.com.r;
        var t0ci = t0.com.i;
        var t1cr = t1.com.r;
        var t1ci = t1.com.i;
        if(isNaN(t0cr) || isNaN(t0ci) || isNaN(t1cr) || isNaN(t1ci)){
          self.output_msgError_plot("Invalid t");
        }
        var N = $.selectNum_id("select-N");
        var dtcr = (t1cr-t0cr)/N;
        var dtci = (t1ci-t0ci)/N;
        var arr_data_in = [];
        var len_n = N+1;
        for(var n=0; n<len_n; ++n){
          var data = self.get_data(inputs.input, options);
          data.len_x = inputs.len_x;
          data.len_y = inputs.len_y;
          var tcr = t0cr+dtcr*n;
          var tci = t0ci+dtci*n;
          data.vars.t = DATA.tree_num(tcr, tci);
          data.tcr = tcr;
          data.tci = tci;
          arr_data_in.push(data);
        }
        /* Ver.2.10.3 */
        self.io.write_text(self.elems.d, "Now calculating...");
        setTimeout(function(){
          self.worker_plot.run(arr_data_in, $.checkbox_id("checkbox-useWorker"));
        }, 50);
        break;
      case "stop":
        self.worker_plot.stop();
        self.plot2d.init_flags();
        self.re_plot(true);
        break;
      case "=":
        /* Ver.2.10.4 */
        if(self.worker_calc && self.worker_calc.handler.isLocked) return false;
        self.storage.store();
        var input = self.io.read_text(self.elems.i);
        var options = self.get_options();
        var arr_data_in = [];
        var len_n = 1;
        for(var n=0; n<len_n; ++n){
          var data = self.get_data(input, options);
          arr_data_in.push(data);
        }
        /* Ver.2.10.3 */
        self.io.write_text(self.elems.o, "Now calculating...");
        setTimeout(function(){
          self.worker_calc.run(arr_data_in, $.checkbox_id("checkbox-useWorker"));
        }, 50);
        break;
      case "C":
        self.worker_calc.stop();
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        self.storage.clear();
        self.output_logh("storage cleared\n\n");
        break;
      case "BS":
      case "DEL":
      case "ans":
      case "<<":
      case ">>":
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        break;
      case "<":
        self.io["onclick_default"](self.elems, "", -1);
        break;
      case ">":
        self.io["onclick_default"](self.elems, "", 1);
        break;
      case "()":
        self.io["onclick_default"](self.elems, text_half, -1);
        break;
      default:
        var sw = "default";
        self.io["onclick_"+sw](self.elems, text_half);
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id;
    switch(id){
      case "checkbox-drag":
        self.handler_drag.switch();
        break;
      case "checkbox-config":
        var isChecked = $.checkbox_elem(elem);
        $.show("#div-config", isChecked, true);
        break;
      case "checkbox-config-plot":
        var isChecked = $.checkbox_elem(elem);
        $.show("#div-config-plot", isChecked, true);
        break;
      case "checkbox-test-case":
        var isChecked = $.checkbox_elem(elem);
        $.show("#div-test-case", isChecked, true);
        break;
      case "select-expDigit":
        self.re_output_log();
        self.re_plot(true);
        break;
      case "select-canvas-width":
      case "select-canvas-height":
        var px_w = $.selectNum_id("select-canvas-width");
        var px_h = $.selectNum_id("select-canvas-height");
        clear_imageBg();
        self.plot2d.update(px_w, px_h);
        self.re_plot(true);
        break;
      /* Ver.2.16.6 */
      case "input-xmin":
      case "input-ymin":
      case "input-xmax":
      case "input-ymax":
        self.plot2d.isChanged_axis = true;
        self.re_plot(true);
        break;
      case "checkbox-log-x":
      case "checkbox-log-y":
      case "checkbox-imag-x":
      case "checkbox-imag-y":
      case "checkbox-axis-x":
      case "checkbox-axis-y":
      case "input-title":
        self.plot2d.init_flags();
        self.re_plot(true);
        break;
      case "select-canvas-background":
      case "select-grid-line-width":
      case "select-marker-size":
      case "select-marker-line-width":
      case "select-plot-line-width":
      case "input-z":
      case "select-canvas-globalCompositeOperationLayer":
      case "select-canvas-globalCompositeOperation":
      case "select-font-size":
      case "select-grid-x-Ni":
      case "select-grid-y-Nj":
      case "select-kx-adjust":
      case "select-legend-kx":
      case "select-legend-ky":
      case "checkbox-legend":
        self.re_plot(true);
        break;
      case "input-bg-color":
      case "input-grid-line-color":
        $.set_elem(elem, "background", elem.value);
        self.re_plot(true);
        break;
      /* Ver.2.15.5 */
      /* Ver.2.14.5 */
      case "input-file-bg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          self.plot2d.setter.base64_bg(base64);
          self.entry.conv.base2img(base64, function(e, img){
            self.plot2d.setter.img_bg(img);
            self.re_plot(true);
          });
        });
        if(!(file)){
          clear_imageBg();
          self.re_plot(true);
        }
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.calc_graphing.prototype.set_callbacks_worker = function(){
  var self = this;
  var $ = self.entry.$;
  self.callbacks_worker_calc = {};
  self.callbacks_worker_plot = {};
  var store = function(data){
    var vars = data.vars;
    var eqns = data.eqns;
    for(var name in vars){
      self.vars[name] = vars[name];  // store vars
    }
    for(var name in eqns){
      self.eqns[name] = eqns[name];  // store eqns
    }
  };
  self.callbacks_worker_calc.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.worker_calc.arr_data_out[data.i] = data;
    var len_in = self.worker_calc.arr_data_in.length;
    var len_out = Object.keys(self.worker_calc.arr_data_out).length;
    if(len_in === 1){
      self.storage.local2global(data);
      self.re_output_log();  // last
    }
    if(len_out === len_in){
      self.worker_calc.stop();
    }
    return self;
  };
  self.callbacks_worker_calc.onerror = function(e){
    var self = this;
    self.worker_calc.stop(true);
    var msg = self.entry.def.get_msgError(e, "Invalid operation");
    self.io.write_text(self.elems.o, msg.replace("Uncaught Error: ", ""));
    self.storage.restore();  // clear; f=<x; f -> error@re_output_log
    return self;
  };
  self.callbacks_worker_plot.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.worker_plot.arr_data_out[data.i] = data;
    var len_in = self.worker_plot.arr_data_in.length;
    var len_out = Object.keys(self.worker_plot.arr_data_out).length;
    self.output_log_plot();
    var dlen = Math.max(Math.floor(len_in*0.1), 1);
    if(len_out < len_in && (len_out-1)%dlen === 0){
      self.re_plot();
    }
    if(len_out === len_in){
      self.worker_plot.stop();
      self.re_plot(true);
    }
    return self;
  };
  self.callbacks_worker_plot.onerror = function(e){
    var self = this;
    self.worker_plot.stop(true);
    self.output_msgError_plot(e);
    return self;
  };
  // bind here
  $.bind_objs(self, self.callbacks_worker_calc);
  $.bind_objs(self, self.callbacks_worker_plot);
  return self;
};
