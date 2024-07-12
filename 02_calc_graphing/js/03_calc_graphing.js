// online-simulator.github.io

My_entry.calc_graphing = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.calc_graphing, My_entry.original_main);

My_entry.calc_graphing.prototype.config = {
  LOG: {
    sizeMax: 5000
  },
  /* Ver.2.22.11 */
  MAT: {
    sizeMax: 1024  // Ver.2.321.77
  },
  /* Ver.2.144.36 */
  LIMIT: {
    depthMax: 300
  },
  /* Ver.2.158.38 */
  REv: {
    csv: "csv"
  }
};
My_entry.calc_graphing.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "conv", "def", "math_com", "DATA", "parser", "draw_svg"]);
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
  $.setup_elem$_id("input-z", self.handlers, "onchange");  // Ver.2.354.86
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
    self.io.write_text(self.elems.h, self.logh.substring(0, self.config.LOG.sizeMax));
  }
  return self;
};
My_entry.calc_graphing.prototype.output_log = function(data){
  var self = this;
  if(data.log){
    /* Ver.2.22.11 -> */
/*
    self.io.write_text(self.elems.o, data.log.split(";").join(";\n"));
*/
    self.io.write_text(self.elems.o, data.log.split(";").join(";\n").substring(0, self.config.LOG.sizeMax));
    /* -> Ver.2.22.11 */
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
    data.options.makeLog = data.options.makeLog || 2;  // || not0  // Ver.2.76.30
    data.options.expDigit = $.selectNum_id("select-expDigit");
    try{
      self.entry.parser.post_try(data);
      self.output_log(data);  // Ver.2.20.7 moved from out of try{}
    }
    catch(e){
      self.callbacks_worker_calc.onerror(e);
    }
  }
  return self;
};
My_entry.calc_graphing.prototype.output_log_plot = function(isFinal){
  var self = this;
  /* Ver.2.30.15 -> */
  /* Ver.2.15.6 -> */
  var arr_data_in = self.worker_plot.arr_data_in;
  var arr_data_out = self.worker_plot.arr_data_out;
  if(!(self.isCheckedError)){
    var len_in = (arr_data_in)? arr_data_in.length: 0;
    var len_out = (arr_data_out)? Object.keys(arr_data_out).length: 0;
    self.io.write_text(self.elems.d, ("finished"+((self.worker_plot && self.worker_plot.handler.isLocked)? "...": "")+" ")+len_out+"/"+len_in);  // 2.387.86  // 2.391.86
  }
  /* -> Ver.2.15.6 */
  /* -> Ver.2.30.15 */
  /* Ver.2.16.6 -> */
  if(isFinal){
    self.elems.d.focus();
  }
  /* -> Ver.2.16.6 */
  return self;
};
/* Ver.2.39.18 -> */
My_entry.calc_graphing.prototype.get_axis_zooming = function(rate, options_plot){
  var self = this;
  var $ = self.entry.$;
  var isRelative = options_plot.relzooming;
  var xmin = $.inputNum_id("input-xmin");
  var ymin = $.inputNum_id("input-ymin");
  var xmax = $.inputNum_id("input-xmax");
  var ymax = $.inputNum_id("input-ymax");
  if(isRelative){
    var xc = (xmin+xmax)/2;
    var yc = (ymin+ymax)/2;
    xmin = xc+(xmin-xc)*rate;
    ymin = yc+(ymin-yc)*rate;
    xmax = xc+(xmax-xc)*rate;
    ymax = yc+(ymax-yc)*rate;
  }
  else{
    xmin *= rate;
    ymin *= rate;
    xmax *= rate;
    ymax *= rate;
  }
  return {xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax};
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
  if(!(isNaN(xmin))) $._id("input-xmin").value = callback(xmin);
  if(!(isNaN(ymin))) $._id("input-ymin").value = callback(ymin);
  if(!(isNaN(xmax))) $._id("input-xmax").value = callback(xmax);
  if(!(isNaN(ymax))) $._id("input-ymax").value = callback(ymax);
  return self;
};
/* -> Ver.2.39.18 */
/* Ver.2.37.18 */
/* Ver.2.16.6 */
My_entry.calc_graphing.prototype.input_axis = function(arr2d_vec){
  var self = this;
  var $ = self.entry.$;
  var xmin = $.inputNum_id("input-xmin");
  var ymin = $.inputNum_id("input-ymin");
  var xmax = $.inputNum_id("input-xmax");
  var ymax = $.inputNum_id("input-ymax");
  var gxmin = Math.min(xmin, xmax);
  var gymin = Math.min(ymin, ymax);
  var gxmax = Math.max(xmin, xmax);
  var gymax = Math.max(ymin, ymax);
  arr2d_vec.gxmin = gxmin;
  arr2d_vec.gymin = gymin;
  arr2d_vec.gxmax = gxmax;
  arr2d_vec.gymax = gymax;
  return self;
};
My_entry.calc_graphing.prototype.output_msgError_plot = function(e){
  var self = this;
  /* Ver.2.25.14 -> */
  if(!(self.isCheckedError)){
    self.plot2d.objs.temp.detach();  // Ver.2.50.25
    var msg = self.entry.def.get_msgError(e, "Invalid plot2d");
    /* Ver.2.224.50 -> */
    self.io.write_text(self.elems.d, msg);
//    self.elems.d.focus();
    var mc = msg.match(/j=(\d+)/);
    if(mc && mc.length){
      var je = Number(mc[1]);
      var sc = self.io.read_text(self.elems.x).split(";").filter(function(sentence){return sentence.replace(/\s/g, "");});
      var len_j = sc.length;
      var je_x = len_j-((sc[len_j-1])? 0: 1);
      var isY = (je >= je_x);
      if(isY){
        je -= je_x;
      }
      self.io.set_selection_elem(self.elems[(isY)? "y": "x"], je, ";");
    }
    /* -> Ver.2.224.50 */
    self.isCheckedError = true;
    throw false;
  }
  /* -> Ver.2.25.14 */
  return self;
};
/* Ver.2.17.6 -> */
My_entry.calc_graphing.prototype.plot = function(arr_data_, options_plot, isFinal){
  var self = this;
  var $ = self.entry.$;
  var DATA = self.entry.DATA;
  var _svg = "";
  var toSVG = (isFinal === "SVG");
  var arr_data = arr_data_;
  if(arr_data && arr_data.length){
    /* Ver.2.105.33 -> */
    var name_x = $._id("input-vx").value;
    var name_y = $._id("input-vy").value;
    var hasName_v = (options_plot["axis-v"] && name_x && name_y);  // Ver.2.328.80
    if(hasName_v){  // Ver.2.328.80
      var _arr_data = [];
      var len_n = arr_data.length;
      for(var n=0; n<len_n; ++n){
        var datan = arr_data[n];
        var x = datan.vars[name_x];
        var y = datan.vars[name_y];
        if(!(_arr_data[n])){
          _arr_data[n] = {len_n: len_n, x: x, y: y};  // Ver.2.328.80
        }
      }
      arr_data = _arr_data;
    }
    else{
      arr_data.forEach(function(data){
        /* Ver.2.25.12 -> */
/*
        data.arr_num = self.entry.parser.make_arr_num(data);
*/
        data.arr_num = data.arr_num || self.entry.parser.make_arr_num(data);
        /* -> Ver.2.25.12 */
      });
    }
    /* -> Ver.2.105.33 */
    var arr2d_vec = self.arr_data2arr2d_vec(arr_data, options_plot);
    if(self.plot2d.isChanged){
      self.input_axis(arr2d_vec);
    }
    else{
      self.output_axis(arr2d_vec, options_plot);
    }
    if(toSVG){
      self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);
      _svg += self.plot2d.final(arr2d_vec, options_plot, toSVG);
    }
    else{
      self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);
      if(isFinal){
        self.plot2d.final(arr2d_vec, options_plot, toSVG);
        var options_calc = arr_data[0].options;
        /* Ver.2.25.12 -> */
        if(options_calc){
          self.output_logh(options_calc.plot2d+"\n", options_calc.logo);  // Ver.2.10.4
        }
        /* -> Ver.2.25.12 */
      }
      else{
        self.plot2d.run(arr2d_vec, options_plot);
      }
      $._id("output-path").value = options_plot._path;  // Ver.2.437.90
    }
  }
  /* Ver.2.14.5 -> */
  else{
    if(!(toSVG)){
      self.plot2d.objs.temp.detach();  // tap || stop
    }
  }
  /* -> Ver.2.14.5 */
  if(!(toSVG)){  // for double-click link
    self.output_log_plot(isFinal);
  }
  return _svg;
};
/* -> Ver.2.17.6 */
My_entry.calc_graphing.prototype.re_plot = function(isFinal){
  var self = this;
  var draw_svg = self.entry.draw_svg;
  var _svg = "";
  var arr_data = self.worker_plot.get_arr_data();  // Ver.2.43.20  // Ver.2.43.21
  if(arr_data){
    /* Ver.2.17.6 -> */
    var callback = function(){
      try{
        return self.plot(arr_data, self.get_options(true), isFinal);
      }
      catch(e){
        self.output_msgError_plot(e);
      }
    };
    var toSVG = (isFinal === "SVG");
    if(toSVG){
      _svg += draw_svg.header(self.plot2d.px_w, self.plot2d.px_h);
      _svg += draw_svg.comment(self.io.getter.stamp());  // 3rd line
      /* Ver.2.27.14 -> */
      var options_calc = (arr_data.length)? arr_data[0].options: null;  // check length
      if(options_calc){
        _svg += draw_svg.comment(options_calc.plot2d);  // 4th line
        _svg += draw_svg.comment(options_calc.logo);    // 5th line
      }
      /* -> Ver.2.27.14 */
      _svg += callback();        // sync
      _svg += draw_svg.footer();
    }
    else{
      setTimeout(callback, 50);  // async
    }
    /* -> Ver.2.17.6 */
  }
  return _svg;
};
My_entry.calc_graphing.prototype.arr_data2arr2d_vec = function(arr_data, options_plot){
  var self = this;
  var $ = self.entry.$;  // Ver.2.328.80
  var conv = self.entry.conv;
  var DATA = self.entry.DATA;  // Ver.2.328.80
  var arr2d_x = [];  // Ver.2.328.80
  var arr2d_y = [];  // Ver.2.328.80
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
  /* Ver.2.328.80 -> */
  var update_xy = function(n, j, x, y){
    var tx = self.plot2d.trans(x, isLog_x);
    var ty = self.plot2d.trans(y, isLog_y);
    if(isNaN(tx)){
      arr2d_x[n][j] = NaN;
    }
    else{
      arr2d_x[n][j] = x;
      xmin = Math.min(xmin, x);
      xmax = Math.max(xmax, x);
    }
    if(isNaN(ty)){
      arr2d_y[n][j] = NaN;
    }
    else{
      arr2d_y[n][j] = y;
      ymin = Math.min(ymin, y);
      ymax = Math.max(ymax, y);
    }
  };
  if(arr_data && arr_data.length){
    var name_x = $._id("input-vx").value;
    var name_y = $._id("input-vy").value;
    var hasName_v = (options_plot["axis-v"] && name_x && name_y);
  if(hasName_v){
    /* Ver.2.337.82 -> */
    len_j = arr_data.length;
    len_n = 0;
    arr_data.forEach(function(data){
      var x = data.x;
      var y = data.y;
      if(x && y){
        var arr_x = x.mat.arr;
        var arr_y = y.mat.arr;
        var len_x = arr_x.length;
        var len_y = arr_y.length;
        if(len_x === len_y){
          len_n = Math.max(len_n, len_y);
        }
        else{
          throw "Invalid v.length("+len_x+"<>"+len_y+")";
        }
      }
      else{
        throw "Undef v.name("+((x)? name_y: name_x)+")";
      }
    });
    for(var n=0; n<len_n; ++n){
      arr2d_x[n] = new Array(len_j);
      arr2d_y[n] = new Array(len_j);
      for(var j=0; j<len_j; ++j){
        var data = arr_data[j];
        var x = NaN;
        var y = NaN;
        if(data && data.x && data.y){
          var arr_x = data.x.mat.arr;
          var arr_y = data.y.mat.arr;
          if(arr_x[n]){
            var num_x = DATA.arr2obj_i(arr_x, n);
            x = num_x.com[sw_ri_x];
          }
          if(arr_y[n]){
            var num_y = DATA.arr2obj_i(arr_y, n);
            y = num_y.com[sw_ri_y];
          }
        }
        update_xy(n, j, x, y);
      }
    }
    /* -> Ver.2.337.82 */
  }
  /* -> Ver.2.328.80 */
  else{
    len_n = arr_data.length;  // Ver.2.337.82
    for(var n=0; n<len_n; ++n){
      var data = arr_data[n];
      var len_x = data.len_x;
      var len_y = data.len_y;
      var arr_num = data.arr_num;
      if(arr_num){
        len_j = Math.max(len_x, len_y);  // Ver.2.328.80
        arr2d_x[n] = new Array(len_j);
        arr2d_y[n] = new Array(len_j);
        for(var j=0; j<len_j; ++j){
          var num_x = arr_num[Math.min(j, len_x-1)];
          var num_y = arr_num[Math.min(j+len_x, len_y+len_x-1)];
          if(num_x && num_x.com && num_y && num_y.com){
            /* Ver.2.162.39 -> */
            var x = num_x.com[sw_ri_x];
            var y = num_y.com[sw_ri_y];
            update_xy(n, j, x, y);  // Ver.2.328.80
            /* -> Ver.2.162.39 */
          }
          else{
//            throw "Invalid (x(t),y(t))";  // Ver.2.25.14
//            throw "Invalid x(t) || y(t)";  // Ver.2.129.35
          }
        }
      }
    }
    len_n = arr2d_x.length;  // Ver.2.328.80
  }
    /* Ver.2.190.44 -> */
    var ver_plot = options_plot["plot2d-Ver"];
    /* Ver.2.33.17 -> */
    if(ver_plot === 1){
      gxmin = conv.dec2round_sw(xmin);
      gymin = conv.dec2round_sw(ymin);
      gxmax = conv.dec2round_sw(xmax, "ceil");
      gymax = conv.dec2round_sw(ymax, "ceil");
    }
    else{
      gxmin = xmin;
      gymin = ymin;
      gxmax = xmax;
      gymax = ymax;
    }
    /* -> Ver.2.33.17 */
    /* -> Ver.2.190.44 */
    /* Ver.2.43.21 -> */
    arr2d_x = arr2d_x.filter(Boolean);
    arr2d_y = arr2d_y.filter(Boolean);
    /* -> Ver.2.43.21 */
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
  /* Ver.2.25.12 -> */
/*
  _log += $.selectVal_id("select-N");
  _log += sq+$.selectVal_id("select-N")+sq;
*/
  _log += sq+$.inputNum_id("input-N")+sq;  // Ver.2.149.37
  /* -> Ver.2.25.12 */
  /* Ver.2.27.14 -> */
  var inputZ = $.inputVal_id("input-z");
  _log += (inputZ)? ca+sq+inputZ+sq: "";
  /* -> Ver.2.27.14 */
  _log += ")";
  return _log;
};
My_entry.calc_graphing.prototype.arr_data2csv = function(arr_data, options_plot){
  var self = this;
  var $ = self.entry.$;
  var DATA = self.entry.DATA;  // Ver.2.328.79
  var ds = My_entry.$.config.DELIMITER;
  var dq = ds.dq;
  var ca = ds.ca;
  var rn = ds.rn;
  var _csv = "";
  var sw_ri_x = (options_plot["imag-x"])? "i": "r";
  var sw_ri_y = (options_plot["imag-y"])? "i": "r";
  /* Ver.2.16.6 -> */
  if(arr_data && arr_data.length){
  /* Ver.2.328.79 -> */
    var name_x = $._id("input-vx").value;
    var name_y = $._id("input-vy").value;
    var hasName_v = (options_plot["axis-v"] && name_x && name_y);  // Ver.2.328.80
  if(hasName_v){  // Ver.2.328.80
    var len_n = arr_data.length;
    // stamp
    for(var n=0; n<len_n; ++n){
      _csv += name_x+n+ca+name_y+n+ca;
    }
    var options_calc = arr_data[0].options;
    if(options_calc){
      _csv += dq+options_calc.plot2d+dq+ca;
      _csv += dq+options_calc.logo+dq+ca;
    }
    _csv += dq+self.io.getter.stamp()+dq+rn;
    // (x,y)
    /* Ver.2.337.82 -> */
    len_j = arr_data.length;
    len_n = 0;
    arr_data.forEach(function(data){
      var x = data.vars[name_x];
      var y = data.vars[name_y];
      if(x && y){
        var arr_x = x.mat.arr;
        var arr_y = y.mat.arr;
        var len_x = arr_x.length;
        var len_y = arr_y.length;
        if(len_x === len_y){
          len_n = Math.max(len_n, len_y);
        }
        else{
          throw "Invalid v.length("+len_x+"<>"+len_y+")";
        }
      }
      else{
        throw "Undef v.name("+((x)? name_y: name_x)+")";
      }
    });
    for(var n=0; n<len_n; ++n){
      for(var j=0; j<len_j; ++j){
        var data = arr_data[j];
        var x = "";
        var y = "";
        if(data && data.vars[name_x] && data.vars[name_y]){
          var arr_x = data.vars[name_x].mat.arr;
          var arr_y = data.vars[name_y].mat.arr;
          if(arr_x[n]){
            var num_x = DATA.arr2obj_i(arr_x, n);
            x = num_x.com[sw_ri_x];
            if(isNaN(x)){
              x = "";
            }
          }
          if(arr_y[n]){
            var num_y = DATA.arr2obj_i(arr_y, n);
            y = num_y.com[sw_ri_y];
            if(isNaN(y)){
              y = "";
            }
          }
        }
        _csv += x+ca;
        _csv += y+ca;
      }
      _csv += rn;
    }
    /* -> Ver.2.337.82 */
  }
  /* -> Ver.2.328.79 */
  else{
    var arr_x = options_plot.arr_x;
    var arr_y = options_plot.arr_y;
  /* -> Ver.2.16.6 */
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
    /* Ver.2.25.12 -> */
    /* Ver.2.10.4 -> */
    if(options_calc){
      _csv += dq+options_calc.plot2d+dq+ca;
      _csv += dq+options_calc.logo+dq+ca;
    }
    /* -> Ver.2.10.4 */
    /* -> Ver.2.25.12 */
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
        /* Ver.2.328.79 -> */
        if(isNaN(x)){
          x = "";
        }
        if(isNaN(y)){
          y = "";
        }
        /* -> Ver.2.328.79 */
        _csv += (xj)? x+ca: "";
        _csv += (yj)? y+ca: "";
      }
      _csv += rn;
    }
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
  _options.N = self.entry.def.limit(Math.round($.inputNum_id("input-N")), 0, self.config.MAT.sizeMax, 10);  // Ver.2.149.37 round  // Ver.2.392.86
  $.get_urlParams(_options);
  /* Ver.2.207.46 -> */
  if(_options.test){
    _options.useScope = $.val2literal(_options.useScope);
    _options.precedence = _options.precedence || $.inputVal_id("input-precedence");
  }
  /* -> Ver.2.207.46 */
  /* Ver.2.22.11 -> */
  _options.matSizeMax = (isNaN(_options.matSizeMax)? null: _options.matSizeMax) || self.config.MAT.sizeMax;
  _options.depthMax = (isNaN(_options.depthMax)? null: _options.depthMax) || self.config.LIMIT.depthMax;  // Ver.2.144.36
  /* -> Ver.2.22.11 */
  /* Ver.2.11.4 */
  /* Ver.2.10.4 */
  if(isPlot){
    /* Ver.2.35.18 -> */
    _options.oldPlot2d = _options.oldPlot2d || (_options["plot2d-Ver"] === 0);  // Ver.2.190.44
    if(_options.oldPlot2d){
      _options["input-z"] = parser.remove_commentAndWspace(self.io.read_text(self.elems.z));
    }
    else{
      _options["input-z"] = parser.remove_comment(self.io.read_text(self.elems.z));
    }
    /* -> Ver.2.35.18 */
    _options["bg-color"] = $.inputVal_id("input-bg-color");
    _options["grid-line-color"] = $.inputVal_id("input-grid-line-color");
    _options["logo"] = parser.make_logo({options: _options});  // including z
    _options["plot2d"] = self.make_log_plot2d();               // including z
    /* Ver.2.16.6 -> */
    _options.arr_x = self.arr_x;
    _options.arr_y = self.arr_y;
    /* -> Ver.2.16.6 */
    /* Ver.2.401.86 -> */
    if(_options["plot-only"]){
      _options["legend"] = false;
      _options["axis-x"] = false;
      _options["axis-y"] = false;
      _options.oldPlot2d = true;  // last
    }
    /* -> Ver.2.401.86 */
  }
  return _options;
};
My_entry.calc_graphing.prototype.get_data = function(input, options, sharedStorage){
  var self = this;
  var _data = self.entry.DATA.data();
  _data.in = input;
  _data.options = options;
  /* Ver.2.21.10 -> */
  if(sharedStorage){
    self.storage.global2local(_data);
  }
  /* -> Ver.2.21.10 */
  return _data;
};
My_entry.calc_graphing.prototype.init_storage = function(){
  var self = this;
  self.storage = {};
  self.storage.clear = function(){
    /* Ver.2.139.36 -> storage.clear()@C -> storage.restore()@onerror */
    self.vars0 = {};
    self.eqns0 = {};
    /* -> Ver.2.139.36 */
    self.vars = {};
    self.eqns = {};
    /* Ver.2.158.38 -> */
    self.no_csv = 0;
    self.entry.$._id("input-file-csv").value = null;
    /* -> Ver.2.158.38 */
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
  /* Ver.2.20.6 */
  self.storage.get_list_sw = function(sw_prop){
    var _list = "";
    for(var name in self[sw_prop]){
      _list += name;
      _list += "; ";
    }
    return _list;
  };
  return self;
};
My_entry.calc_graphing.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var conv = self.entry.conv;  // Ver.2.158.38
  var math_com = self.entry.math_com;
  var DATA = self.entry.DATA;
  var parser = self.entry.parser;
  var get_inputs_plot = function(){
    var input = "";
    var x = parser.remove_commentAndWspace(self.io.read_text(self.elems.x));
    var y = parser.remove_commentAndWspace(self.io.read_text(self.elems.y));
    /* Ver.2.43.21 -> */
    var arr_x = x.split(";").filter(Boolean);
    var arr_y = y.split(";").filter(Boolean);
    /* -> Ver.2.43.21 */
    var len_x = arr_x.length;
    var len_y = arr_y.length;
    if(len_x && len_y){
      x = arr_x.join(";");
      y = arr_y.join(";");
      input = x+";"+y;
    }
    else{
      /* Ver.2.25.14 -> */
/*
      self.output_msgError_plot("Invalid (x(t),y(t))");
*/
      self.output_msgError_plot("Invalid x(t) || y(t)");
      /* -> Ver.2.25.14 */
    }
    self.arr_x = arr_x;
    self.arr_y = arr_y;
    return {input: input, len_x: len_x, len_y: len_y};
  };
  /* Ver.2.25.14 -> */
  var get_num = function(input, options){
    var _num = null;
    var data = self.get_data(input, options, options.sharedStorage);
    parser.run(data);  // Ver.2.158.38
    if(data.out){
      _num = DATA.out2num(data.out);
    }
    else{
      throw false;
    }
    if(!(_num && _num.com)){
      throw false;
    }
    if(isNaN(_num.com.r) || isNaN(_num.com.i)){
      throw false;
    }
    return _num;
  };
  /* -> Ver.2.25.14 */
  var clear_imageBg = function(){
    $._id("input-file-bg").value = null;
    self.plot2d.setter.base64_bg(null);
    self.plot2d.setter.img_bg(null);
  };
  /* Ver.2.25.12 -> */
  var plot2d_from_log = function(tokens){
    var re = /\'/g;
    $._id("input-t0").value = tokens[0].replace(re, "");
    $._id("input-t1").value = tokens[1].replace(re, "");
    $._id("input-x").value = tokens[2].replace(re, "");
    $._id("input-y").value = tokens[3].replace(re, "");
    if(tokens[4]){
      /* Ver.2.149.37 -> */
//      $.set_selectVal_id("select-N", tokens[4].replace(re, ""));
      var num = tokens[4].replace(re, "");
      if(!(isNaN(num))){
        $._id("input-N").value = num;
      }
      /* -> Ver.2.149.37 */
    }
    /* Ver.2.27.14 -> */
    if(tokens[5]){
      $._id("input-z").value = tokens[5].replace(re, "");
    }
    /* -> Ver.2.27.14 */
    $._id("button-plot").onclick();
  };
  var plot2d_from_arr = function(tokens, isRowVector){  // Ver.2.175.42
    var name_x = tokens[0];
    var name_y = tokens[1];
    var var_x = self.vars[name_x];
    var var_y = self.vars[name_y];
    if(var_x && var_y){
      var arr2d_x = (var_x.mat)? var_x.mat.arr: null;
      var arr2d_y = (var_y.mat)? var_y.mat.arr: null;
      if(arr2d_x && arr2d_y){
        /* Ver.2.175.42 -> */
        var num_NaN = DATA.num(NaN, NaN);  // common reference
        var len_x = 0;
        var len_y = 0;
        var len_n = 0;
        // arr_data
        var arr_data = [];
        if(isRowVector){
          len_x = arr2d_x.length;
          len_y = arr2d_y.length;
          for(var j=0; j<len_x; ++j){
            len_n = Math.max(len_n, arr2d_x[j].length);
          }
          for(var j=0; j<len_y; ++j){
            len_n = Math.max(len_n, arr2d_y[j].length);
          }
          for(var n=0; n<len_n; ++n){
            var data = self.get_data();  // self
            var arr_num = [];
            for(var j=0; j<len_x; ++j){
              var hasXj = arr2d_x[j];
              arr_num.push((hasXj)? arr2d_x[j][n] || num_NaN: num_NaN);
            }
            for(var j=0; j<len_y; ++j){
              var hasYj = arr2d_y[j];
              arr_num.push((hasYj)? arr2d_y[j][n] || num_NaN: num_NaN);
            }
            data.arr_num = arr_num;
            data.len_x = len_x;
            data.len_y = len_y;
            arr_data.push(data);
          }
        }
        else{
          len_n = Math.max(arr2d_x.length, arr2d_y.length);
          /* Ver.2.175.43 -> */
          for(var n=0; n<len_n; ++n){
            len_x = Math.max(len_x, (arr2d_x[n] || []).length);
            len_y = Math.max(len_y, (arr2d_y[n] || []).length);
          }
          /* -> Ver.2.175.43 */
          for(var n=0; n<len_n; ++n){
            var hasXn = arr2d_x[n];
            var hasYn = arr2d_y[n];
            var data = self.get_data();  // self
            var arr_num = [];
            for(var j=0; j<len_x; ++j){
              arr_num.push((hasXn)? arr2d_x[n][j] || num_NaN: num_NaN);
            }
            for(var j=0; j<len_y; ++j){
              arr_num.push((hasYn)? arr2d_y[n][j] || num_NaN: num_NaN);
            }
            data.arr_num = arr_num;
            data.len_x = len_x;
            data.len_y = len_y;
            arr_data.push(data);
          }
        }
        /* -> Ver.2.175.42 */
        // str
        var arr_x = [];
        var arr_y = [];
        for(var j=0; j<len_x; ++j){
          arr_x.push("x"+String(j));
        }
        for(var j=0; j<len_y; ++j){
          arr_y.push("y"+String(j));
        }
        self.arr_x = arr_x;
        self.arr_y = arr_y;
        self.worker_plot.arr_data_in = new Array(len_n);
        self.worker_plot.arr_data_out = arr_data;
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
      }
    /* Ver.2.25.14 -> */
      else{
        throw false;
      }
    }
    else{
      throw false;
    }
    /* -> Ver.2.25.14 */
  };
  /* -> Ver.2.25.12 */
  /* Ver.2.140.36 -> */
  var run_command = function(command, isRowVector){  // Ver.2.175.42
          /* Ver.2.34.18 -> */
          /* Ver.2.25.14 -> */
          if(self.worker_plot && self.worker_plot.handler.isLocked) return false;
          if(self.plot2d.isLocked) return false;
          /* -> Ver.2.25.14 */
          try{
            var tokens_quotation = command.match(/\'.*?\'/g);
            var tokens_comma = command.replace(/\s/g, "").split(",");  // Ver.2.176.44 white spaces removed
          /* -> Ver.2.34.18 */
            if(tokens_quotation && tokens_quotation.length > 3){
              plot2d_from_log(tokens_quotation);
            }
            else if(tokens_comma && tokens_comma.length === 2){
              plot2d_from_arr(tokens_comma, isRowVector);  // Ver.2.175.42
              self.io.write_text(self.elems.o, "plot2d-from-arr finished");  // Ver.2.25.14
            }
            else{
              throw false;
            }
          }
          catch(e){
            self.io.write_text(self.elems.o, self.entry.def.get_msgError(e, "plot2d-command data not found"));
          }
  };
  /* -> Ver.2.140.36 */
  self.handlers.onload = function(e){
    var self = this;
    /* Ver.2.25.14 -> */
    // flag
    self.isCheckedError = false;
    /* -> Ver.2.25.14 */
    // canvas
    self.plot2d = new self.constructors.plot2d("div-plot2d", 512, 256);
    /* Ver.2.137.35 -> */
    /* Ver.2.37.18 -> */
    self.plot2d.setter.callbacks({
      onmouseup: function(e, gaxis){
        var options_plot = self.get_options(true);
        self.output_axis(self.plot2d.gaxis2axis(gaxis, options_plot), options_plot);
        self.re_plot(true);
      }
    });
    /* -> Ver.2.37.18 */
    /* -> Ver.2.137.35 */
    // workers
    self.set_callbacks_worker();
    /* Ver.2.43.20 -> */
    self.worker_calc = new self.constructors.original_workers(My_entry.job_imported, "js/for_url.js", self.callbacks_worker_calc);
    self.worker_plot = new self.constructors.original_workers(My_entry.job_imported, "js/for_url.js", self.callbacks_worker_plot, $.selectNum_id("select-n_thread"));
    /* -> Ver.2.43.20 */
    // else
    self.io = new self.constructors.io();
    var json = {p: {id: "wrapper-link-png"}, a: {id: "a-png", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return conv.base2buffer(self.plot2d.objs.all.get_base64());});  // Ver.2.158.38
    /* Ver.2.17.6 -> */
    var json = {p: {id: "wrapper-link-svg"}, a: {id: "a-svg", it: "-svg(src-over)"}, name: "download", ext: "svg"};
    self.handler_link_svg = new self.constructors.handler_link(json);
    self.handler_link_svg.setter.callback(function(){return self.re_plot("SVG");});
    /* -> Ver.2.17.6 */
    var json = {p: {id: "wrapper-link-csv"}, a: {id: "a-csv", it: "-csv@double-click"}, name: "download", ext: "csv"};  // Ver.2.138.35
    self.handler_link_csv = new self.constructors.handler_link(json);
    self.handler_link_csv.setter.callback(function(){return self.arr_data2csv(self.worker_plot.get_arr_data(), self.get_options(true));});  // Ver.2.43.20  // Ver.2.43.21
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt@double-click"}, name: "download", ext: "txt"};  // Ver.2.138.35
    self.handler_link = new self.constructors.handler_link(json);
    self.handler_link.setter.callback(function(){return self.logh;});
    self.handler_drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    $.set_selectVal_id("select-n_thread", (Math.min(window.navigator.hardwareConcurrency || 1, 12)*2));  // Ver.2.325.78
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
        self.isCheckedError = false;  // Ver.2.25.14
        self.plot2d.init_flags();
        var options = self.get_options(true);
        options.checkError = false;
        /* Ver.2.34.18 -> */
        // check t first
        var isAxisT = options["axis-t"];
        var N = options["N"];
        var t = new Array(N);
        var len_n = N+1;
        try{
          var t0 = get_num($.inputVal_id("input-t0"), options);
          var t1 = (N)? get_num($.inputVal_id("input-t1"), options): t0;  // Ver.2.392.86
          for(var n=0; n<len_n; ++n){
            var tn = math_com.lerp_sw(t0.com, t1.com, n/(N || 1), isAxisT);  // || not0  // Ver.2.392.86
            var tcr = tn.r;
            var tci = tn.i;
            /* Ver.2.50.25 -> */
            if(isNaN(tcr) || isNaN(tci)){
              if(isNaN(tcr) && isNaN(tci)){
                throw false;
              }
              else if(isNaN(tcr) && !(t0.com.r) && !(t1.com.r)){
                tn.r = 0;
              }
              else if(isNaN(tci) && !(t0.com.i) && !(t1.com.i)){
                tn.i = 0;
              }
              else{
                throw false;
              }
            }
            /* -> Ver.2.50.25 */
            t[n] = tn;
          }
        }
        catch(e){
          self.output_msgError_plot((isAxisT)? "Invalid log(t0 || t1)": "Invalid t0 || t1");
        }
        // check x||y second
        var inputs = get_inputs_plot();
        // make arr_data_in
        var arr_data_in = [];
        for(var n=0; n<len_n; ++n){
          var tn = t[n];
          var tcr = tn.r;
          var tci = tn.i;
          var data = self.get_data(inputs.input, options, options.sharedStorage);
          data.len_x = inputs.len_x;
          data.len_y = inputs.len_y;
          data.vars.t = DATA.tree_num(tcr, tci);
          /* Ver.2.85.32 -> */
          var tc0 = t[0];
          var tc1 = t[N];
          data.vars.N = DATA.tree_num(N, 0);
          data.vars.t0 = DATA.tree_num(tc0.r, tc0.i);
          data.vars.t1 = DATA.tree_num(tc1.r, tc1.i);
          /* -> Ver.2.85.32 */
          data.tcr = tcr;
          data.tci = tci;
          arr_data_in.push(data);
        }
        /* -> Ver.2.34.18 */
        /* Ver.2.10.3 */
        self.io.write_text(self.elems.d, "Now calculating...");
        setTimeout(function(){
          self.worker_plot.run(arr_data_in, $.checkbox_id("checkbox-useWorker"));
        }, 50);
        break;
      case "stop":
        self.worker_plot.stop();
        self.plot2d.init_flags();
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      case "=":
        /* Ver.2.10.4 */
        if(self.worker_calc && self.worker_calc.handler.isLocked) return false;
        self.storage.store();
        var input = self.io.read_text(self.elems.i);
        var options = self.get_options();
        /* Ver.2.25.12 -> */
        /* Ver.2.175.42 -> */
        /* Ver.2.27.14 -> comment allowed */
        var command_col = self.entry.def.get_command(input, "plot2d", true);
        var command_row = self.entry.def.get_title(input, "plot2d", true);
        /* -> Ver.2.27.14 */
        if(command_col){
          run_command(command_col);  // Ver.2.140.36
        }
        else if(command_row){
          run_command(command_row, true);
        }
        /* -> Ver.2.175.42 */
        else{
          var arr_data_in = [];
          var len_n = 1;
          for(var n=0; n<len_n; ++n){
            var data = self.get_data(input, options, true);
            arr_data_in.push(data);
          }
          /* Ver.2.10.3 */
          self.io.write_text(self.elems.o, "Now calculating...");
          setTimeout(function(){
            self.worker_calc.run(arr_data_in, $.checkbox_id("checkbox-useWorker"));
          }, 50);
        }
        /* -> Ver.2.25.12 */
        break;
      /* Ver.2.20.6 -> */
      case "list-vars":
        self.io.write_text(self.elems.o, self.storage.get_list_sw("vars"));
        break;
      case "list-eqns":
        self.io.write_text(self.elems.o, self.storage.get_list_sw("eqns"));
        break;
      /* -> Ver.2.20.6 */
      case "C":
        self.worker_calc.stop(true);  // Ver.2.161.39
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        self.storage.clear();
        self.output_logh("storage cleared\n\n");
        break;
      /* Ver.2.26.14 */
      case "C-input":
        self.io.write_text(self.elems.i, "");
        break;
      /* Ver.2.140.36 -> */
      case "cancel":
        if(self.worker_calc && self.worker_calc.handler.isLocked){
          self.worker_calc.stop();
          self.io.write_text(self.elems.o, "canceled");
          self.storage.restore();
        }
        break;
      /* Ver.2.175.42 */
      /* Ver.2.50.25 */
      case "plot2d{}":
      case "plot2d()":
        var symbol_x = $._id("input-plot2d-x").value;
        var symbol_y = $._id("input-plot2d-y").value;
        var isRowVector = (text_half === "plot2d{}");
        run_command(symbol_x+","+symbol_y, isRowVector);
        break;
      /* -> Ver.2.140.36 */
      case "BS":
      case "DEL":
      /* Ver.2.26.14 -> */
/*
      case "ans":
*/
      /* -> Ver.2.26.14 */
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
      /* Ver.2.26.14 -> */
      case "{}":
      /* -> Ver.2.26.14 */
        self.io["onclick_default"](self.elems, text_half, -1);
        break;
      /* Ver.2.39.18 -> */
      case "x 1":
        $._id("checkbox-imag-x").onchange();
        break;
      case "x0.1":
      case "x0.5":
      case "x 2":
      case "x10":
        var options_plot = self.get_options(true);
        var rate = 1/Number(text_half.replace(/x/, ""));
        self.output_axis(self.get_axis_zooming(rate, options_plot), options_plot);
        $._id("input-xmin").onchange();
        break;
      /* -> Ver.2.39.18 */
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
      /* Ver.2.136.35 */
      case "checkbox-center":
        var isChecked = $.checkbox_elem(elem);
        $._id("div-drag").classList[(isChecked)? "add": "remove"]("text-center");
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
      case "checkbox-equation-list":
        var isChecked = $.checkbox_elem(elem);
        $.show("#div-equation-list", isChecked, true);
        break;
      case "select-expDigit":
        self.re_output_log();
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      /* Ver.2.43.20 */
      case "select-n_thread":
        self.worker_plot.set_n_thread($.selectNum_id(id));
        break;
      /* Ver.2.136.35 */
      case "input-canvas-width":
      case "input-canvas-height":
        var px_w = $.inputNum_id("input-canvas-width");
        var px_h = $.inputNum_id("input-canvas-height");
        px_w = self.entry.def.limit(px_w, 16, 2560, 512);
        px_h = self.entry.def.limit(px_h, 16, 2560, 256);
        clear_imageBg();
        self.plot2d.update(px_w, px_h);
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      /* Ver.2.16.6 */
      case "input-xmin":
      case "input-ymin":
      case "input-xmax":
      case "input-ymax":
        self.plot2d.isChanged = true;
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      case "checkbox-imag-x":
      case "checkbox-imag-y":
        self.plot2d.init_flags();
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      case "select-plot2d-Ver":  // Ver.2.190.44
      case "select-decDigit":
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
      case "checkbox-plot-only":  // Ver.2.401.86
      case "checkbox-log-x":
      case "checkbox-log-y":
      case "checkbox-legend":
      case "checkbox-axis-x":
      case "checkbox-axis-y":
      case "checkbox-axis-z":
      /* Ver.2.105.33 -> */
      case "checkbox-axis-v":
      case "input-vx":
      case "input-vy":
      case "input-vz":
      /* -> Ver.2.105.33 */
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      /* Ver.2.16.6 */
      case "select-canvas-background":
        $._id("input-bg-color").value = "";
        $.set_id("input-bg-color", "background", null);
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      case "input-bg-color":
      case "input-grid-line-color":
        $.set_elem(elem, "background", elem.value);
        self.isCheckedError = false;  // Ver.2.33.17
        self.re_plot(true);
        break;
      /* Ver.2.15.5 */
      /* Ver.2.14.5 */
      case "input-file-bg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          self.plot2d.setter.base64_bg(base64);
          conv.base2img(base64, function(e, img){  // Ver.2.158.38
            self.plot2d.setter.img_bg(img);
            self.isCheckedError = false;  // Ver.2.33.17
            self.re_plot(true);
          });
        });
        if(!(file)){
          clear_imageBg();
          self.isCheckedError = false;  // Ver.2.33.17
          self.re_plot(true);
        }
        break;
      /* Ver.2.158.38 */
      case "input-file-csv":
        if(self.worker_calc && self.worker_calc.handler.isLocked) return false;
        var file = $.readFile_elem(elem, /^text\/csv|^text\/comma-separated-values/, function(e){
          var base64 = e.target.result;
          var text = conv.base2binary(base64);
          var arr = conv.csv2arr(text, function(r){return DATA.num(r, 0);}, 1);
          /* Ver.2.161.38 -> */
          var no_csv = self.no_csv || 0;
          var varName = self.config.REv.csv+no_csv;
          var hasData = (arr.length && arr[0].length);
          if(hasData){
            self.vars[varName] = DATA.tree_mat(arr);
            self.no_csv = no_csv+1;
          }
          var msg = (hasData)? "finished reading "+varName: "csv-data not found";
          self.io.write_text(self.elems.o, msg);
          /* -> Ver.2.161.38 */
        });
        if(!(file)){
          elem.value = null;
          self.io.write_text(self.elems.o, "input-file.csv not found");
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
    /* Ver.2.224.50 -> */
    self.io.write_text(self.elems.o, msg);
    var mc = msg.match(/j=(\d+)/);
    if(mc && mc.length){
      var je = Number(mc[1]);
      self.io.set_selection_elem(self.elems.i, je, ";");
    }
    /* -> Ver.2.224.50 */
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
