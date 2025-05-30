// online-simulator.github.io

My_entry.plot2d = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.plot2d.prototype.config = {
  default: {
    msec_snapping: 300,
    base_zooming: 2,  // calc-Ver.2.843.147
    NUMMIN: -32768,
    NUMMAX: 32767,
    decDigit_grid: 13,  // Ver.2.770.117
    label_x: "x(t)",  // Ver.2.750.113
    label_y: "y(t)",  // Ver.2.750.113
    px_w: 512,
    px_h: 256,
    gridLineColor: "gray",
    selectedLineColor: "rgba(255, 128, 128, 0.75)",  // Ver.2.846.153
    Ni: 10,
    Nj: 10,
    Ni0: 6,
    Nj0: 6,
    fontSize: 12,
    dfontSize: 2,
    decDigit: 5,
    ratio_x: 0.05,
    ratio_y: 0.05,
    kh: 1.25
  }
};
My_entry.plot2d.prototype.init = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "conv", "def"]);
  self.setter = {};
  self.setter.callbacks = function(callbacks){
    self.callbacks = callbacks;
  };
  self.setter.base64_bg = function(base64){
    self.base64_bg = base64;
  };
  self.setter.img_bg = function(img){
    self.img_bg = img;
    if(img){
      self.update(img.width, img.height);
    }
  };
  self.log10 = function(x){
    return Math.log(x)*Math.LOG10E;
  };
  self.trans = function(x, isLog){
    return ((isLog)? self.log10(x): x);
  };
  /* 1.53.8 */
  self.trans_rev = function(x, isLog){
    return ((isLog)? Math.pow(10, x): x);
  };
  self.filter = new self.constructors.filter();  // 1.1.2
  self.isLocked = false;
  self.isDragging = false;
  self.isChanged = false;
  self.sw_snap = 0;
  self.screen_xy = null;
  self.vec0 = null;
  self.vec1 = null;
  self.vec2 = null;
  self.vec10 = null;
  self.vec20 = null;
  self.id = id;
  self.tagName = "canvas";
  self.className = self.id+"-"+self.tagName;
  self.classNames = [self.className, "absolute"];
  self.elem_p = self.entry.$._id(self.id);
  self.objs = {};
  self.add("background_grid");  // 1.17.7
  self.names = ["background", "grid", "plot"];
  self.names.forEach(function(name){
    self.add(name);
  });
  self.add("all");
  self.add("temp");
  self.px_w = 0;
  self.px_h = 0;
  self.update(opt_px_w, opt_px_h, opt_px_b);
  self.handlers = {};
  self.init_handlers();
  return self;
};
/* 1.0.1 */
My_entry.plot2d.prototype.init_canvas = function(isAll){
  var self = this;
  self.names.forEach(function(name){
    self.objs[name].clear();
  });
  if(isAll){
    self.objs.all.clear();
  }
  return self;
};
My_entry.plot2d.prototype.init_flags = function(){
  var self = this;
  self.isDragging = false;
  self.isChanged = false;
  self.sw_snap = 0;
  return self;
};
/* 1.0.0 -> */
/* calc-Ver.2.843.147 */
My_entry.plot2d.prototype.isSnapping = function(){
  var self = this;
  return (self.entry.$._id("checkbox-snap").checked || self.sw_snap > 0);
};
My_entry.plot2d.prototype.vec2vec_snapped = function(vec){
  var self = this;
  var _vec = vec;
  var screen_xy = self.screen_xy;
  if(screen_xy && vec){
    var x0 = screen_xy.xpmin;
    var y0 = screen_xy.ypmin;
    var dx = screen_xy.dxp;
    var dy = screen_xy.dyp;
    var x1 = vec.x;
    var y1 = vec.y;
    _vec = {x: x0+Math.round((x1-x0)/dx)*dx, y: y0+Math.round((y1-y0)/dy)*dy};
  }
  return _vec;
};
My_entry.plot2d.prototype.vec2gaxis_centering = function(vec){
  var self = this;
  var grid = self.objs.grid;
  var _gaxis = null;
  var screen_xy = self.screen_xy;
  if(screen_xy && vec){
    var x0 = screen_xy.xpmin;
    var y0 = screen_xy.ypmin;
    var x1 = screen_xy.xpmax;
    var y1 = screen_xy.ypmax;
    var xc0 = screen_xy.xpc;
    var yc0 = screen_xy.ypc;
    var xc1 = vec.x;
    var yc1 = vec.y;
    var dx = xc1-xc0;
    var dy = yc1-yc0;
    _gaxis = grid.screen2plot(x0+dx, y0+dy, x1+dx, y1+dy);
  }
  return _gaxis;
};
/* 1.53.8 */
My_entry.plot2d.prototype.gaxis2axis = function(gaxis, options){
  var self = this;
  var isLog_x = options["log-x"];
  var isLog_y = options["log-y"];
  var gxmin = gaxis.gxmin;
  var gymin = gaxis.gymin;
  var gxmax = gaxis.gxmax;
  var gymax = gaxis.gymax;
  var xmin = self.trans_rev(gxmin, isLog_x);
  var ymin = self.trans_rev(gymin, isLog_y);
  var xmax = self.trans_rev(gxmax, isLog_x);
  var ymax = self.trans_rev(gymax, isLog_y);
  return {xmin: xmin, ymin: ymin, xmax: xmax, ymax: ymax};
};
My_entry.plot2d.prototype.init_handlers = function(){
  var self = this;
  var grid = self.objs.grid;
  var temp = self.objs.temp;
  var elem = temp.elem;
  var ctx = temp.ctx;
  var handlers = self.handlers;
  handlers.onmousedown = function(e){
    e.preventDefault();
    e.stopPropagation();
    self.isDragging = true;
    if(self.sw_snap){
      self.sw_snap = -2;
    }
    else{
      self.sw_snap = -1;
      setTimeout(function(){
        if(self.sw_snap === -1){
          self.sw_snap = 1;
        }
      }, self.config.default.msec_snapping);
    }
    self.vec0 = temp.get_offset(e);
    self.vec1 = null;
    self.vec2 = null;
    self.vec10 = null;
    self.vec20 = null;
  };
  handlers.onmousemove = function(e){
    if(self.isDragging){
      e.preventDefault();
      e.stopPropagation();
      temp.clear();
      if(self.sw_snap === -1){
        self.sw_snap = -2;
      }
      var vec0 = self.vec0;
      var vec1 = null;
      var vec2 = null;
      if(e.touches && e.touches.length === 2){
        vec1 = self.vec1 = temp.get_offset({touches: [e.touches[0]]});
        vec2 = self.vec2 = temp.get_offset({touches: [e.touches[1]]});
        self.vec10 = self.vec10 || self.vec1;
        self.vec20 = self.vec20 || self.vec2;
      }
      else{
        vec1 = self.vec1 = temp.get_offset(e);
      }
      vec0 = vec2 || vec0;
      var isSnapped = self.isSnapping();  // calc-Ver.2.843.147
      if(isSnapped){
        vec0 = self.vec2vec_snapped(vec0);
        vec1 = self.vec2vec_snapped(vec1);
        self.sw_snap = 2;
      }
      temp.draw.rectangle(vec0, vec1, 3, self.config.default.selectedLineColor, null, true);  // Ver.2.846.153
    }
  };
  handlers.onmouseup = function(e){  // always
    e.preventDefault();
    e.stopPropagation();
    temp.clear();
    /* 1.0.1 -> */
    var vec0 = self.vec2 || self.vec0;
    var vec1 = self.vec1 || self.vec0;
    var isSnapped = self.isSnapping();  // calc-Ver.2.843.147
    if(isSnapped){
      vec0 = self.vec2vec_snapped(vec0);
      vec1 = self.vec2vec_snapped(vec1);
    }
    var x0 = vec0.x;
    var y0 = vec0.y;
    var x1 = vec1.x;
    var y1 = vec1.y;
    var gaxis = null;
    var isMoved = (x1-x0 && y1-y0);
    var isCentering = (x0 === x1 && y0 === y1);
    if(isMoved){
      gaxis = grid.screen2plot(x0, y0, x1, y1);
      self.isChanged = true;
    }
    else if(isCentering){
      gaxis = self.vec2gaxis_centering(vec0);
      self.isChanged = true;
    }
    if(!(self.isLocked) && gaxis){
      self.callbacks.onmouseup(e, gaxis);
    }
    /* -> 1.0.1 */
    self.isDragging = false;
    self.sw_snap = 0;
  };
  /* calc-Ver.2.843.147 */
  handlers.onwheel = function(e){
    if(self.entry.$._id("checkbox-wheel").checked){
      e.preventDefault();
      e.stopPropagation();
      var vec0 = temp.get_offset(e);
      var isSnapped = self.isSnapping();
      if(isSnapped){
        vec0 = self.vec2vec_snapped(vec0);
      }
      e._txy = grid.xyp2xy(vec0.x, vec0.y);
      e._rate = Math.pow(self.config.default.base_zooming, ((e.deltaY > 0)? 1: -1));
      self.entry.$._id("zooming").onclick(e);
    }
  };
  self.entry.$.bind_objs(self, self.handlers);
  return self;
};
/* -> 1.0.0 */
My_entry.plot2d.prototype.add = function(name){
  var self = this;
  var $ = self.entry.$;
  var elem_p = self.elem_p;
  var elem = document.createElement(self.tagName);
  elem.id = self.id+"-"+name;
  self.classNames.forEach(function(className){
    elem.classList.add(className);
  });
  $.add_last_elem(elem, elem_p);
  self.objs[name] = new self.constructors[self.tagName](elem);
  return self;
};
My_entry.plot2d.prototype.remove = function(name){
  var self = this;
  var objs = self.objs;
  if(objs[name]){
    objs[name].elem.remove();
    delete self.objs[name];
  }
  return self;
};
My_entry.plot2d.prototype.update_elem_p = function(px_w, px_h, px_b){
  var self = this;
  var $ = self.entry.$;
  var elem_p = self.elem_p;
  $.set_elem(elem_p, "width", px_w+px_b*2+"px");
  $.set_elem(elem_p, "height", px_h+px_b*2+"px");
  return self;
};
My_entry.plot2d.prototype.update_elems = function(px_w, px_h){
  var self = this;
  var objs = self.objs;
  for(var name in objs){
    objs[name].change_size(px_w, px_h);
  }
  objs.background_grid.draw_grid();  // 1.17.7
  return self;
};
My_entry.plot2d.prototype.update = function(opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  var elem_p = self.elem_p;
  var px_w = self.px_w = opt_px_w || elem_p.clientWidth || self.px_w;
  var px_h = self.px_h = opt_px_h || self.px_h;
  var px_b = opt_px_b || self.objs.plot.elem.clientTop;
  self.update_elems(px_w, px_h);
  self.update_elem_p(px_w, px_h, px_b);
  return self;
};
/* 1.0.0 */
My_entry.plot2d.prototype.grid = function(options, tx0, ty0, tx1, ty1, Ni, Nj, isLog_x, isLog_y, label_x, label_y, expDigitX, expDigitY, fontSize, gridLineWidth, gridLineColor, globalCompositeOperation){  // Ver.2.666.98
  var self = this;
  var grid = self.objs.grid;
  var _svg = "";
  var lineWidth = gridLineWidth;
  var styleRGBA = gridLineColor;
  /* 1.18.7 -> */
  var fontSize1 = fontSize+self.config.default.dfontSize;
  var lineWidth0 = gridLineWidth;
  var styleRGBA0 = gridLineColor;
  var labelSize0 = fontSize1;
  var origin = options._origin;
  if(origin){
    var sc = origin.split(",");
    if(!(isNaN(sc[0]))){
      lineWidth0 = sc[0];
    }
    styleRGBA0 = sc[1] || styleRGBA0;
    if(!(isNaN(sc[2]))){
      labelSize0 = sc[2];
    }
  }
  /* -> 1.18.7 */
  var len_i = Ni+1;
  var len_j = Nj+1;
  var tdx = (tx1-tx0)/Ni;
  var tdy = (ty1-ty0)/Nj;
  /* 1.18.7 -> */
  var hasOx = (tx0 <= 0 && tx1 >= 0 && !(isLog_x));
  var hasOy = (ty0 <= 0 && ty1 >= 0 && !(isLog_y));
  /* 0.5.0 -> */
  // labels
  if(label_x){
    _svg += grid.label(label_x, (tx0+tx1)/2, self.config.default.ratio_y, fontSize1, styleRGBA, globalCompositeOperation, false);
  }
  if(label_y){
    _svg += grid.label(label_y, self.config.default.ratio_x, (ty0+ty1)/2, fontSize1, styleRGBA, globalCompositeOperation, true);
  }
  if(label_x && label_y && (origin || origin === "")){
    if(hasOx && hasOy){
      var label_o = "O";
      var tx = self.trans(0, isLog_x);
      var ty = self.trans(0, isLog_y);
      var vecp0 = grid.xy2xyp(tx, ty);
      vecp0.x -= labelSize0*0.5;
      vecp0.y += labelSize0*0.89;
      _svg += grid.draw.label(label_o, vecp0, labelSize0, styleRGBA0, globalCompositeOperation, false);
    }
  }
  // grid-lines
  if(label_x){
    if(hasOx){
      var tx = self.trans(0, isLog_x);
      _svg += grid.line(tx, ty0, tx, ty1, lineWidth0, styleRGBA0, globalCompositeOperation);
    }
  }
  if(label_y){
    if(hasOy){
      var ty = self.trans(0, isLog_y);
      _svg += grid.line(tx0, ty, tx1, ty, lineWidth0, styleRGBA0, globalCompositeOperation);
    }
  }
  /* -> 0.5.0 */
  /* -> 1.18.7 */
  for(var i=0; i<len_i; ++i){
    var tx = tx0+i*tdx;
    _svg += grid.line(tx, ty0, tx, ty1, lineWidth, styleRGBA, globalCompositeOperation);
    if(label_x){
      var rtx = (expDigitX === -1)? self.entry.conv.dec2round_sw(tx, null, self.config.default.decDigit_grid): tx;  // Ver.2.770.117  // Ver.2.773.118
      var val = self.entry.conv.num2not(rtx, self.config.default.decDigit, expDigitX);  // Ver.2.666.98  // Ver.2.773.118
      _svg += grid.axis(val, tx, ty0, fontSize, styleRGBA, globalCompositeOperation, false);
    }
  }
  for(var j=0; j<len_j; ++j){
    var ty = ty0+j*tdy;
    _svg += grid.line(tx0, ty, tx1, ty, lineWidth, styleRGBA, globalCompositeOperation);
    if(label_y){
      var rty = (expDigitY === -1)? self.entry.conv.dec2round_sw(ty, null, self.config.default.decDigit_grid): ty;  // Ver.2.770.117  // Ver.2.773.118
      var val = self.entry.conv.num2not(rty, self.config.default.decDigit, expDigitY);  // Ver.2.666.98  // Ver.2.773.118
      _svg += grid.axis(val, tx0, ty, fontSize, styleRGBA, globalCompositeOperation, true);
    }
  }
  return _svg;
};
/* 0.5.0 -> */
My_entry.plot2d.prototype.get_kx = function(fontSize){
  var self = this;
  return (self.config.default.px_w/self.px_w)*(fontSize/self.config.default.fontSize);
};
My_entry.plot2d.prototype.get_ky = function(fontSize){
  var self = this;
  return (self.config.default.px_h/self.px_h)*(fontSize/self.config.default.fontSize);
};
/* -> 0.5.0 */
/* 1.0.0 */
My_entry.plot2d.prototype.change_scale = function(tgxmin, tgymin, tgxmax, tgymax, isAxis_x, isAxis_y, fontSize, kxAdjust, kyAdjust){
  var self = this;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var all = self.objs.all;
  var temp = self.objs.temp;
  var tgdx = (tgxmax-tgxmin)*0.125 || 1;
  var tgdy = (tgymax-tgymin)*0.125 || 1;
  /* 0.5.0 -> */
  var kx = self.get_kx(fontSize);
  var ky = self.get_ky(fontSize);
  tgxmin -= (isAxis_y)? tgdx*kxAdjust*kx: tgdx;
  tgymin -= (isAxis_x)? tgdy*3.0*ky: tgdy;
  tgxmax += (isAxis_y)? tgdx*1.0*kx: tgdx;
  tgymax += (isAxis_x)? tgdy*kyAdjust*ky: tgdy;
  /* -> 0.5.0 */
  grid.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  plot.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  all.change_scale(tgxmin, tgymin, tgxmax, tgymax);  // 1.2.3
  temp.change_scale(tgxmin, tgymin, tgxmax, tgymax);  // 1.15.7
  return self;
};
/* Ver.2.821.135 */
My_entry.plot2d.prototype.run = function(arr2d_vec, options, toSVG, isFinal){
  var self = this;
  var _svg = "";
  try{
    _svg = self.plot.apply(self, arguments);
    if(!(toSVG) && isFinal){
      self.draw.apply(self, arguments);
    }
  }
  catch(e){
    self.isLocked = false;
    throw e;
  }
  return _svg;
};
My_entry.plot2d.prototype.plot = function(arr2d_vec, options, toSVG, isFinal){  // Ver.2.821.135
  var self = this;
  if(self.isLocked) return false;
  self.isLocked = true;
  var $ = self.entry.$;
  var def = self.entry.def;
  var background = self.objs.background;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var temp = self.objs.temp;
  var markers = plot.markers;
  var _svg = "";
  var numLastLegend = options["last-legend"] || 0;  // Ver.2.822.135  // Ver.2.824.139
  var expDigit = options["expDigit"];
  var expDigitX = options["expDigitX"] || expDigit;  // Ver.2.666.98
  var expDigitY = options["expDigitY"] || expDigit;  // Ver.2.666.98
  var markerSize0 = options["marker-size"];
  var markerLineWidth0 = options["marker-line-width"];
  var plotLineWidth0 = options["plot-line-width"];
  var gridLineWidth = options["grid-line-width"];
  var gridLineColor = options["grid-line-color"] || self.config.default.gridLineColor;  // 0.6.0 moved from grid()
  var backgroundColor = options["bg-color"] || options["canvas-background"];
//  var globalCompositeOperation = options["globalCompositeOperationAll"] || null;  // 0.2.0 urlParam || source-over
  var globalCompositeOperation = options["canvas-globalCompositeOperationLayer"] || null;  // 0.3.0 selectVal || source-over
  var isLog_x = options["log-x"];
  var isLog_y = options["log-y"];
  var isImag_x = options["imag-x"];
  var isImag_y = options["imag-y"];
  var isLegend = options["legend"];
  var isAxis_x = options["axis-x"];
  var isAxis_y = options["axis-y"];
  var isAxis_z = options["axis-z"];
  var fontSize = options["font-size"];
  var Ni0 = options["grid-x-Ni"];
  var Nj0 = options["grid-y-Nj"];
  var kxAdjust = options["kx-adjust"];
  var markerColors = options["marker-colors"];  // Ver.2.846.153
  var legend_kx = options["legend-kx"];
  var legend_ky = options["legend-ky"];
  var arr2d_x = arr2d_vec.x;
  var arr2d_y = arr2d_vec.y;
  var len_n = arr2d_vec.len_n;
  var len_j = arr2d_vec.len_j;
  var gxmin = arr2d_vec.gxmin;
  var gymin = arr2d_vec.gymin;
  var gxmax = arr2d_vec.gxmax;
  var gymax = arr2d_vec.gymax;
  /* 1.0.0 -> */
  var NUMMIN = self.config.default.NUMMIN;
  var NUMMAX = self.config.default.NUMMAX;
  var tgxmin = self.trans(gxmin, isLog_x);
  var tgymin = self.trans(gymin, isLog_y);
  var tgxmax = self.trans(gxmax, isLog_x);
  var tgymax = self.trans(gymax, isLog_y);
  /* 1.0.2 -> */
  if(!(isFinite(tgxmin)) || !(isFinite(tgymin)) || !(isFinite(tgxmax)) || !(isFinite(tgymax))){
    throw "Invalid plot2d isInf";  // Ver.2.821.135
  }
  if(!(toSVG)){
    self.init_canvas(true);
  }
  /* -> 1.0.2 */
  var dtgx0 = tgxmax-tgxmin;  // dx(grid)
  var dtgy0 = tgymax-tgymin;  // dy(grid)
  /* -> 1.0.0 */
  /* 0.1.0 -> */
  // legend
  var arr_markerType = new Array(len_j);
  var arr_styleRGBA = new Array(len_j);
  /* -> 0.1.0 */
  /* 0.2.0 -> */
  var arr_markerSize = new Array(len_j);
  var arr_markerLineWidth = new Array(len_j);
  var arr_plotLineWidth = new Array(len_j);
  /* -> 0.2.0 */
  /* 0.4.0 -> */
  var arr_fillPath = new Array(len_j);
  /* -> 0.4.0 */
  /* 0.6.0 -> */
  var arr_str = new Array(len_j);
  var arr_strFontSize = new Array(len_j);
  /* -> 0.6.0 */
  /* 1.0.0 -> */
  var arr_strPath = new Array(len_j);
  var arr_gradation = new Array(len_j);
  var inputZ = options["input-z"] || "";
  /* 1.17.7 -> */
  inputZ = def.enter_name(inputZ, "bgcolor", false, 0, function(content){backgroundColor = content;});
  inputZ = def.enter_name(inputZ, "gdcolor", false, 0, function(content){gridLineColor = content;});
  inputZ = def.enter_name(inputZ, "mrcolors", false, 0, function(content){markerColors = content;});  // Ver.2.846.153
  /* Ver.2.848.155 -> */
  inputZ = def.enter_name(inputZ, "composites", false, 0, function(content){
    var sc = content.split(",");
    if(sc[0]){
      globalCompositeOperation = options._composite0 = sc[0];
    }
    if(sc[1]){
      options._composite1 = sc[1];
    }
  });
  /* -> Ver.2.848.155 */
  /* -> 1.17.7 */
  /* 1.22.7 -> */
  var plotconfig = "";
  inputZ = def.enter_name(inputZ, "plotconfig", false, 0, function(content){plotconfig = content;});
  var records_plotconfig = $.get_records(plotconfig, ",", 0, ["gridLineWidth", "fontSize", "Ni0", "Nj0", "kxAdjust", "legend_kx", "legend_ky"], true);
  gridLineWidth = records_plotconfig.gridLineWidth || gridLineWidth;
  fontSize = records_plotconfig.fontSize || fontSize;
  Ni0 = records_plotconfig.Ni0 || Ni0;
  Nj0 = records_plotconfig.Nj0 || Nj0;
  kxAdjust = records_plotconfig.kxAdjust || kxAdjust;
  legend_kx = records_plotconfig.legend_kx || legend_kx;
  legend_ky = records_plotconfig.legend_ky || legend_ky;
  Ni0 = def.limit(Ni0, 0, 2560, 0);
  Nj0 = def.limit(Nj0, 0, 2560, 0);
  /* -> 1.22.7 */
  /* 1.18.7 -> */
  /* 1.8.6 -> */
  var title = "";
  var label_x = "";
  var label_y = "";
  var origin = "";
  if(inputZ){
    inputZ = def.enter_name(inputZ, "title", false, 0, function(content){title = content;});
    inputZ = def.enter_name(inputZ, "xlabel", false, 0, function(content){label_x = content;});  // Ver.2.750.113
    inputZ = def.enter_name(inputZ, "ylabel", false, 0, function(content){label_y = content;});  // Ver.2.750.113
    inputZ = def.enter_name(inputZ, "origin", false, 0, function(content){options._origin = content;});
    /* Ver.2.401.86 -> */
    if(!(options["plot-all"])){  // Ver.2.746.111
      title = "";
    }
    /* -> Ver.2.401.86 */
  }
  /* -> 1.8.6 */
  /* -> 1.18.7 */
  /* 1.8.5 -> */
  inputZ = def.enter_name(inputZ, "transform", false, 0, function(content){options._transform = content;});
  /* -> 1.8.5 */
  /* 1.1.2 -> */
  inputZ = def.enter_name(inputZ, "filter", false, 0, function(content){options._filter = content;});
  /* -> 1.1.2 */
  /* 1.2.3 -> */
  inputZ = def.enter_name(inputZ, "blur", false, 0, function(content){options._blur = content;});
  /* -> 1.2.3 */
  /* 1.19.7 -> */
  inputZ = def.enter_name(inputZ, "tile", false, 0, function(content){options._tile = content;});
  /* -> 1.19.7 */
  /* 1.15.7 -> */
  inputZ = def.enter_name(inputZ, "cut", false, 0, function(content){options._cut = content;});
  /* -> 1.15.7 */
  // scaling
  var fontSize1 = (title)? fontSize+self.config.default.dfontSize: 0;
  var kyAdjust = 1+fontSize1*5/self.px_h;
  self.change_scale(tgxmin, tgymin, tgxmax, tgymax, isAxis_x, isAxis_y, fontSize, kxAdjust, kyAdjust);
  /* -> 1.0.0 */
  // legends
  var arr_legend = inputZ.split(";");
  var markerType = null;
  var styleRGBA = null;
  var markerSize = null;
  var markerLineWidth = null;
  var plotLineWidth = null;
  var fillPath = null;
  var strFontSize = null;
  for(var j=0; j<len_j; ++j){
    var legend = arr_legend[j];
    var type = null;
    var style = null;
    var size = null;
    var lineWidth = null;
    var plineWidth = null;
    var fill = null;
    var str = null;
    var strSize = null;
    if(legend){
      /* 1.0.0 -> */
      var gradation = "";
      legend = def.enter_name(legend, "gradation", false, 0, function(content){gradation = content;});
      arr_gradation[j] = gradation;
      var strPath = "";
      legend = def.enter_name(legend, "string", false, 0, function(content){strPath = content;});
      arr_strPath[j] = strPath;
      /* -> 1.0.0 */
      var arr_config = legend.split(":");
      type = arr_config[0];
      style = arr_config[1];
      size = arr_config[2];
      lineWidth = arr_config[3];
      plineWidth = arr_config[4];
      fill = arr_config[5];
      str = arr_config[6];
      strSize = arr_config[7];
      type = (type === "none" || def.hasElem_arr(markers, type))? type: null;  // 1.0.0
    }
    /* 0.1.0 -> */
    markerType = type || markerType;
    styleRGBA = style || styleRGBA;
    /* -> 0.1.0 */
    /* 0.4.0 -> */
    /* 0.2.0 -> */
    markerSize = def.get_number(size, markerSize, markerSize0);
    markerLineWidth = def.get_number(lineWidth, markerLineWidth, markerLineWidth0);
    plotLineWidth = def.get_number(plineWidth, plotLineWidth, plotLineWidth0);
    /* -> 0.2.0 */
    fillPath = fill || fillPath;
    /* -> 0.4.0 */
    /* 0.6.0 -> */
    strFontSize = def.get_number(strSize, strFontSize, fontSize);
    /* -> 0.6.0 */
    /* 1.48.8 -> */
    /* Ver.2.744.110 -> */
    var rgba = null;
    if(markerColors === "Ver.0"){  // old  // Ver.2.846.153
      var g255 = (len_j > 1)? Math.floor(j*255/(len_j-1)): 0;
      var r255 = Math.floor(255-g255)%256;
      var b255 = Math.floor(g255<<1)%(256-1);
      rgba = {r: r255, g: g255, b: b255, a: 255};
    }
    else if(markerColors === "Ver.1"){  // Ver.2.846.153
      var pn = (len_j-j)/len_j;
      var r255 = 0;
      var g255 = 0;
      var b255 = 0;
      if(pn < 1/3){
        g255 = 255*pn*3;
        b255 = 255;
      }
      else if(pn < 2/3){
        r255 = 255*(pn-1/3)*3;
        g255 = 255;
      }
      else{
        r255 = 255;
        g255 = 255*(1-pn)*3;
      }
      rgba = {r: r255, g: g255, b: b255, a: 255};
    }
    else{
      var isRainbow = (markerColors === "rainbow");  // Ver.2.846.153
      var text_colors = (isRainbow)? "#f00:#ff0:#0f0:#0ff:#00f:#f0f:#f00": markerColors;  // Ver.2.846.153
      var colors = text_colors.split(":");
      var dlen_j = (isRainbow)? 0: -1;
      var pn = j/(len_j+dlen_j || 1);  // /not0
      rgba = plot.draw.colors2rgba(colors, pn);
    }
    arr_markerType[j] = markerType || markers[j%markers.length];
    arr_styleRGBA[j] = styleRGBA || plot.draw.rgba2style(rgba);
    /* -> Ver.2.744.110 */
    /* -> 1.48.8 */
    /* Ver.2.744.111 -> */
    arr_markerSize[j] = def.limit(markerSize, 0, NUMMAX, 0);
    arr_markerLineWidth[j] = def.limit(markerLineWidth, 0, NUMMAX, 0);
    arr_plotLineWidth[j] = def.limit(plotLineWidth, 0, NUMMAX, 0);
    arr_fillPath[j] = fillPath;
    arr_str[j] = str;
    arr_strFontSize[j] = def.limit(strFontSize, 0, NUMMAX, 0);
    /* -> Ver.2.744.111 */
  }
  /* 1.15.7 -> */
  // transform
  var arr2d_tx = new Array(len_n);
  var arr2d_ty = new Array(len_n);
  for(var n=0; n<len_n; ++n){
    arr2d_tx[n] = [];
    arr2d_ty[n] = [];
    for(var j=0; j<len_j; ++j){
      arr2d_tx[n][j] = self.trans(arr2d_x[n][j], isLog_x);
      arr2d_ty[n][j] = self.trans(arr2d_y[n][j], isLog_y);
    }
  }
  /* calc-Ver.2.162.39 -> */
  // make arr2d_tvec
  var hasNaN = false;
  var arr2d_tvec = new Array(len_j);
  var js = Math.max(0, len_j-Math.round(numLastLegend))%len_j;  // Ver.2.822.135
  for(var j=js; j<len_j; ++j){  // Ver.2.822.135
    arr2d_tvec[j] = new Array(len_n);
    for(var n=0; n<len_n; ++n){
      var x = arr2d_tx[n][j];
      var y = arr2d_ty[n][j];
      hasNaN = hasNaN || (isNaN(x) || isNaN(y));
      arr2d_tvec[j][n] = {x: x, y: y};
    }
  }
  options._hasNaN = hasNaN;
  options._arr2d_tvec = arr2d_tvec;  // 1.2.3
  /* -> calc-Ver.2.162.39 */
  var callback_cut_toSVG = function(withTransform){
    var text = options._cut;
    var records = $.get_records(text, ",", 0, ["Nlegend", "withTransform"]);
    records.withTransform = def.limit(records.withTransform, -10, 10, true);
    if((withTransform && records.withTransform) || (!(withTransform) && !(records.withTransform))){
      var len_j = arr2d_tvec.length;
      var Nlegend = def.limit(Math.floor(records.Nlegend), NUMMIN, NUMMAX, len_j);
      var idName_mask = "mask_cut";
      _svg += plot.draw.def_mask_style(idName_mask, plot.lines(arr2d_tvec[Nlegend-1] || arr2d_tvec[len_j-1], 0, "#ffffff", null, true));
      _svg += plot.draw.header_group(null, plot.draw.use_mask(idName_mask));
    }
  };
  /* -> 1.15.7 */
  /* 1.10.6 -> */
  var callback_transform_toSVG = function(withBackground){
    var text = options._transform;
    var params = $.get_records(text, ",", 0, ["a", "b", "c", "d", "e", "f", "withBackground"], true);
    if((withBackground && params.withBackground) || (!(withBackground) && !(params.withBackground))){
      _svg += plot.draw.header_group(null, plot.draw.transform(params.a, params.b, params.c, params.d, params.e, params.f));
    }
  };
  /* 1.15.7 -> */
  if(toSVG && options._cut){
    callback_cut_toSVG(false);
  }
  if(toSVG && options._transform){
    callback_transform_toSVG(true);
  }
  if(toSVG && options._cut){
    callback_cut_toSVG(true);
  }
  /* -> 1.15.7 */
  // background
  /* 0.7.0 -> */
  var decDigit = options["decDigit"];
  plot.draw.setter.backgroundColor(backgroundColor);
  grid.draw.setter.backgroundColor(backgroundColor);
  plot.draw.setter.decDigit(decDigit);
  grid.draw.setter.decDigit(decDigit);
  /* -> 0.7.0 */
  var img_bg = self.img_bg;
  if(toSVG){
    _svg += background.fill(backgroundColor, globalCompositeOperation);
  }
  else if(img_bg){
    background.ctx.drawImage(img_bg, 0, 0);
  }
  else{
    background.fill(backgroundColor, globalCompositeOperation);
  }
  if(toSVG && options._transform){
    callback_transform_toSVG(false);
  }
  /* -> 1.10.6 */
  /* 1.0.0 -> */
  /* 0.6.0 -> */
  // title
  if(title){
    _svg += grid.draw.label(title, {x: self.px_w/2, y: fontSize1}, fontSize1, gridLineColor, globalCompositeOperation, false);
  }
  /* -> 0.6.0 */
  // grid
  /* 0.5.0 -> */
  var Ni = Ni0;
  var Nj = Nj0;
  if(!(Ni)){
    Ni = (isAxis_x)? Math.floor(self.config.default.Ni0/self.get_kx(fontSize)) || 1: self.config.default.Ni;
  }
  if(!(Nj)){
    Nj = (isAxis_y)? Math.floor(self.config.default.Nj0/self.get_ky(fontSize)) || 1: self.config.default.Nj;
  }
  // labels
  if(isAxis_x){  // Ver.2.750.113
    label_x = (label_x)? label_x: self.config.default.label_x;  // Ver.2.750.113
    label_x = (isImag_x)? "imag("+label_x+")": label_x;
    label_x = (isLog_x)? "log10("+label_x+")": label_x;
  }
  /* Ver.2.773.119 -> */
  else{
    label_x = "";
  }
  /* -> Ver.2.773.119 */
  if(isAxis_y){  // Ver.2.750.113
    label_y = (label_y)? label_y: self.config.default.label_y;  // Ver.2.750.113
    label_y = (isImag_y)? "imag("+label_y+")": label_y;
    label_y = (isLog_y)? "log10("+label_y+")": label_y;
  }
  /* Ver.2.773.119 -> */
  else{
    label_y = "";
  }
  /* -> Ver.2.773.119 */
  self.screen_xy = grid.plot2screen(tgxmin, tgymin, tgxmax, tgymax, Ni, Nj);
  /* -> 0.5.0 */
  _svg += self.grid(options, tgxmin, tgymin, tgxmax, tgymax, Ni, Nj, isLog_x, isLog_y, label_x, label_y, expDigitX, expDigitY, fontSize, gridLineWidth, gridLineColor, globalCompositeOperation);  // Ver.2.666.98
  // masking
  var idName_mask = "mask_lines_and_gradations";
  /* 1.21.7 -> */
  var dtgx = dtgx0*1e-5;
  var dtgy = dtgy0*1e-5;
  /* -> 1.21.7 */
  var tgxmin_mask = tgxmin-dtgx;
  var tgymin_mask = tgymin-dtgy;
  var tgxmax_mask = tgxmax+dtgx;
  var tgymax_mask = tgymax+dtgy;
  // gradation
  if(!(options.oldPlot2d)){
    if(toSVG){
      _svg += plot.draw.header_group(null, plot.draw.use_mask(idName_mask));
    }
  }
  options._arr_ID_plot = [];  // Ver.2.821.135
  for(var j=js; j<len_j; ++j){  // Ver.2.822.135
    var styleRGBA = arr_styleRGBA[j];
    var gradation = arr_gradation[j];
    if(gradation){
      var text = gradation;
      var config = "";
      text = def.enter_name(text, "config", false, 2, function(content){config = content;});
      var records = $.get_records(config, ":", 0, ["x0", "y0", "offsetR", "orderR", "NrandR", "NrandT", "isMin", "isRound", "Nrender", "Ncycle"]);
      records.x0 = self.trans((isNaN(records.x0))? 0: records.x0, isLog_x);
      records.y0 = self.trans((isNaN(records.y0))? 0: records.y0, isLog_y);
      records.offsetR = def.limit(records.offsetR, 0, 1, 0);
      records.orderR = def.limit(records.orderR, 0, 10, 1);
      records.NrandR = def.limit(Math.floor(records.NrandR), 0, 255, 0);
      records.NrandT = def.limit(Math.floor(records.NrandT), 0, 255, 0);
      records.isMin = def.limit(records.isMin, -10, 10, true);
      records.isRound = def.limit(records.isRound, -10, 10, true);
      records.Nrender = def.limit(Math.floor(records.Nrender), 1, NUMMAX, options.N);
      records.Ncycle = def.limit(Math.floor(records.Ncycle), 0, 127, 0);
      var colors = (text || styleRGBA).split(":");
      var ID_or_svg = plot.gradation(colors, arr2d_tvec[j], globalCompositeOperation, records);
      if(isFinal){
        if(toSVG){
          _svg += ID_or_svg;
        }
        else{
          if(!(options.oldPlot2d)){
            plot.putID(ID_or_svg);
            ID_or_svg = plot.mask(tgxmin_mask, tgymin_mask, tgxmax_mask, tgymax_mask, idName_mask);
            plot.clear();
          }
          if(options._arr_ID_plot){
            options._arr_ID_plot.push(ID_or_svg);
          }
        }
      }
      else{  // Ver.2.759.115
        if(toSVG){
          _svg += ID_or_svg;
        }
        else{
          plot.putID(ID_or_svg);  // sync compositeOperationLayer disabled
        }
      }
    }
  }
  if(!(options.oldPlot2d)){
    if(toSVG){
      _svg += plot.draw.footer_group();
    }
  }
  // plot lines
  if(!(options.oldPlot2d)){
    if(toSVG){
      _svg += plot.draw.header_group(null, plot.draw.use_mask(idName_mask));
    }
  }
  /* calc-Ver.2.162.39 -> */
  var exclude_NaN = function(j, callback){
    var arr_vec = [];
    for(var n=0; n<len_n; ++n){
      var vec = arr2d_tvec[j][n];
      var x = vec.x;
      var y = vec.y;
      var hasNaN = (isNaN(x) || isNaN(y));
      if(!(hasNaN)){
        arr_vec.push(vec);
      }
      if((hasNaN || n === len_n-1) && arr_vec.length){
        callback(arr_vec);
        arr_vec = [];
      }
    }
  };
  /* -> calc-Ver.2.162.39 */
  for(var j=js; j<len_j; ++j){  // Ver.2.822.135
    var styleRGBA = arr_styleRGBA[j];
    var plotLineWidth = arr_plotLineWidth[j];
    var fillPath = arr_fillPath[j];
    /* calc-Ver.2.162.39 -> */
    var callback = function(arr_vec){
      _svg += plot.lines(arr_vec, plotLineWidth, styleRGBA, globalCompositeOperation, fillPath);
      /* calc-Ver.2.437.90 -> */
      options._path = "";
      if(isFinal && j === len_j-1){
        var path = "";
        var arr_vecp = plot.arr_vec2arr_vecp(arr_vec);
        for(var i=0, len=arr_vecp.length; i<len; ++i){
          if(i > 0){
            path += " ";  // calc-Ver.2.438.90
          }
          path += plot.draw.floor(arr_vecp[i].x)+","+plot.draw.floor(arr_vecp[i].y);
        }
        options._path = path;
      }
      /* -> calc-Ver.2.437.90 */
    };
    exclude_NaN(j, callback);
    /* -> calc-Ver.2.162.39 */
  }
  // mask
  if(!(options.oldPlot2d)){
    if(toSVG){
      _svg += plot.draw.footer_group();
    }
    var ID_or_svg = plot.mask(tgxmin_mask, tgymin_mask, tgxmax_mask, tgymax_mask, idName_mask);
    if(toSVG){
      _svg += ID_or_svg;
    }
  }
  // plot markers
  for(var j=js; j<len_j; ++j){  // Ver.2.822.135
    var markerType = arr_markerType[j];
    var styleRGBA = arr_styleRGBA[j];
    var markerSize = arr_markerSize[j];
    var markerLineWidth = arr_markerLineWidth[j];
    if(markerSize){
      /* calc-Ver.2.162.39 -> */
      var callback = function(arr_vec){
        for(var i=0, len=arr_vec.length; i<len; ++i){
          var vec = arr_vec[i];
          var x = vec.x;
          var y = vec.y;
          if(options.oldPlot2d || !(x < tgxmin_mask || x > tgxmax_mask || y < tgymin_mask || y > tgymax_mask)){
            _svg += plot[markerType](x, y, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
          }
        }
      };
      exclude_NaN(j, callback);
      /* -> calc-Ver.2.162.39 */
    }
  }
  /* 0.6.0 -> */
  // legends
  if(isLegend){
    var arr_x = options.arr_x;
    var arr_y = options.arr_y;
    var text_x = "";
    var text_y = "";
//    var markerSize_max = Math.max.apply(Math, arr_markerSize);
    var kh = self.config.default.kh;
    var xp = self.px_w*legend_kx;
    var yp = self.px_h*legend_ky;
    for(var j=js; j<len_j; ++j){  // Ver.2.822.135
      var markerType = arr_markerType[j];
      var styleRGBA = arr_styleRGBA[j];
      var markerSize = arr_markerSize[j];
      var markerLineWidth = arr_markerLineWidth[j];
      var plotLineWidth = arr_plotLineWidth[j];
      var fillPath = arr_fillPath[j];
      var str = arr_str[j];
      var strFontSize = arr_strFontSize[j];
      /* 0.7.0 -> */
      if(fillPath && !(plotLineWidth) && !(markerSize)){
        plotLineWidth = strFontSize;
      }
      /* -> 0.7.0 */
      if(plotLineWidth || markerSize){
        var drp = Math.max(strFontSize, plotLineWidth);
        if(markerSize){
          drp = Math.max(drp, Math.max(markerLineWidth, markerSize)*2);
        }
        var dxp = Math.max(drp*2, 10);
        var dyp_half = (drp/2)*kh;
        var xp0 = xp;
        var xp1 = xp+dxp;
        yp += dyp_half;
        var arr_xj = arr_x[j];
        var arr_yj = arr_y[j];
        text_x = (arr_xj)? arr_xj: text_x;
        text_y = (arr_yj)? arr_yj: text_y;
        var text = str || ""+text_x+";"+text_y+"";
        _svg += plot.draw.textbox(text, {x: xp0, y: yp}, {x: xp1, y: yp}, strFontSize, backgroundColor, gridLineColor);  // Ver.2.851.157
        if(plotLineWidth){
          _svg += plot.draw.line({x: xp0, y: yp}, {x: xp1, y: yp}, plotLineWidth, styleRGBA);  // Ver.2.851.157
        }
        if(markerSize){
          _svg += plot.draw[markerType]({x: (xp0+xp1)/2, y: yp}, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
        }
        yp += dyp_half;
      }
    }
  }
  /* -> 0.6.0 */
  /* 1.10.6 -> */
  var idName_mask = "mask_string_path";
  if(toSVG && options._transform){
    _svg += plot.draw.mask(0, 0, plot.px_w, plot.px_h, idName_mask);
    _svg += plot.draw.header_group(null, plot.draw.use_mask(idName_mask));
  }
  /* -> 1.10.6 */
  // string with SVG-path
  for(var j=js; j<len_j; ++j){  // Ver.2.822.135
    var styleRGBA = arr_styleRGBA[j];
    var strFontSize = arr_strFontSize[j];
    var strPath = arr_strPath[j];
    if(strPath && !(options._hasNaN)){  // calc-Ver.2.162.39
      var text = strPath;
      var config = "";
      text = def.enter_name(text, "config", false, 2, function(content){config = content;});
      var records = $.get_records(config, ":", 0, ["fontFamily", "fontSize", "isBold", "isItalic", "isReverse", "styleRGBA_bg", "styleRGBA_fg", "fillStr", "spacingX", "spacingY", "offsetX", "offsetY", "blur", "deg0"]);
      records.fontSize = def.limit(records.fontSize, 0, NUMMAX, 0);
      records.spacingX = def.limit(records.spacingX, NUMMIN, NUMMAX, 0);
      records.spacingY = def.limit(records.spacingY, NUMMIN, NUMMAX, 0);
      records.offsetX = def.limit(records.offsetX, NUMMIN, NUMMAX, 0);
      records.offsetY = def.limit(records.offsetY, NUMMIN, NUMMAX, 0);
      records.blur = def.limit(records.blur, NUMMIN, NUMMAX, 0);
      records.deg0 = def.limit(records.deg0, 0, 360, 0);
      _svg += plot.textpath(text, arr2d_tvec[j], strFontSize, styleRGBA, globalCompositeOperation, j, records);
    }
  }
  /* -> 1.0.0 */
  /* 1.10.6 -> */
  if(toSVG && options._transform){
    _svg += plot.draw.footer_group();
    _svg += plot.draw.footer_group();
  }
  /* -> 1.10.6 */
  /* 1.15.7 -> */
  if(toSVG && options._cut){
    _svg += plot.draw.footer_group();
  }
  /* -> 1.15.7 */
  temp.attach(self.handlers);  // 0.4.0 moved from final()
  self.isLocked = false;
  return _svg;
};
/* 1.0.0 */
My_entry.plot2d.prototype.draw = function(arr2d_vec, options){  // Ver.2.821.135
  var self = this;
  var $ = self.entry.$;
  var conv = self.entry.conv;
  var def = self.entry.def;
  /* 1.17.7 -> */
  var background = self.objs.background;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var temp = self.objs.temp;
  var all = self.objs.all;
  /* -> 1.17.7 */
  /* 1.15.7 -> */
  var isLog_x = options["log-x"];
  var isLog_y = options["log-y"];
  var NUMMIN = self.config.default.NUMMIN;
  var NUMMAX = self.config.default.NUMMAX;
  /* 1.0.1 -> */
  var arr2d_tvec = options._arr2d_tvec;
  var len_j = (arr2d_tvec)? arr2d_tvec.length: 0;
    if(self.isLocked) return false;
    self.isLocked = true;
  /* -> 1.0.1 */
  /* -> 1.15.7 */
    var base64_bg = self.base64_bg || background.get_base64();
    var arr_base64_grid_plot = [];
    arr_base64_grid_plot.push(grid.get_base64());
    var arr_base64_plot = [];
    options._arr_ID_plot.forEach(function(ID){
      all.putID(ID);
      arr_base64_plot.push(all.get_base64());
    });
    arr_base64_plot.push(plot.get_base64());
    /* 1.2.3 -> */
    var callback_blur = function(){
      var text = options._blur;
      var config = "";
      text = def.enter_name(text, "config", false, 2, function(content){config = content;});
      var records = $.get_records(config, ":", 0, ["x0", "y0", "offsetR", "orderR", "NrandR", "NrandT", "isMin", "isRound", "Nrender", "Ncycle", "isCyclic", "isSquare", "Nlegend"]);  // 1.9.6
      records.x0 = self.trans((isNaN(records.x0))? 0: records.x0, isLog_x);  // linear-scale
      records.y0 = self.trans((isNaN(records.y0))? 0: records.y0, isLog_y);  // linear-scale
      records.offsetR = def.limit(records.offsetR, 0, 1, 0);
      records.orderR = def.limit(records.orderR, 0, 10, 1);
      records.NrandR = def.limit(Math.floor(records.NrandR), 0, 255, 0);
      records.NrandT = def.limit(Math.floor(records.NrandT), 0, 255, 0);
      records.isMin = def.limit(records.isMin, -10, 10, true);
      records.isRound = def.limit(records.isRound, -10, 10, true);
      records.Nrender = def.limit(Math.floor(records.Nrender), 1, NUMMAX, (options.N || 1));  // || not0  // Ver.2.392.86
      records.Ncycle = def.limit(Math.floor(records.Ncycle), 0, 127, 0);
      records.isCyclic = def.limit(records.isCyclic, -10, 10, true);
      records.isSquare = def.limit(records.isSquare, -10, 10, true);  // 1.9.6
      var Nlegend = def.limit(Math.floor(records.Nlegend), NUMMIN, NUMMAX, len_j);
      /* 1.11.6 -> */
      var asym = "";
      text = def.enter_name(text, "asym", false, 2, function(content){asym = content;});
      var records_asym = $.get_records(asym, ",", 0, ["x_asym", "y_asym", "k_asym", "Nrad_asym"], true);
      var arr_s = conv.arr_str2arr_num((text || "0:10").split(":"), 0, 0, 20);
      all.putID(all.blur(arr_s, arr2d_tvec[Nlegend-1] || arr2d_tvec[len_j-1], null, records, records_asym));
      /* -> 1.11.6 */
    };
    /* -> 1.2.3 */
    /* 1.8.5 -> */
    /* 1.1.2 -> */
    /* 1.15.7 -> */
    var get_records_mask = function(content){
      var _records = $.get_records(content || "", ",", 0, ["Nlegend", "isInverse", "isClear"]);
      _records.Nlegend = def.limit(Math.floor(_records.Nlegend), NUMMIN, NUMMAX, len_j);
      _records.isInverse = def.limit(_records.isInverse, -10, 10, true);
      _records.isClear = def.limit(_records.isClear, -10, 10, true);
      return _records;
    };
    var callback_cut = function(){
      var text = options._cut;
      var records_mask = get_records_mask(text);
      var Nlegend = records_mask.Nlegend;
      var withTransform = records_mask.isInverse;
      temp.ctx.save();
      if(options._transform && withTransform){
        var text = options._transform;
        var params = $.get_records(text, ",", 0, ["a", "b", "c", "d", "e", "f", "withBackground"], true);
        temp.ctx.setTransform(params.a, params.b, params.c, params.d, params.e, params.f);
      }
      temp.lines(arr2d_tvec[Nlegend-1] || arr2d_tvec[len_j-1], 0, "#ffffff", null, true);
//      all.draw_base64(temp.get_base64(), null, null, "destination-atop");  // 1.32.8
      var params = {};
      params.arr_w = ["dummy"];
      params.ID_mask = temp.getID();
      params.isClear = true;
      all.putID(self.filter.run(all.ctx, params));
      temp.ctx.restore();
      temp.clear();
    };
    /* -> 1.15.7 */
    /* 1.19.7 -> */
    var callback_tile = function(){
      var text = options._tile;
      var records = $.get_records(text, ",", 0, ["dx", "dy", "x0", "y0", "x1", "y1"], true);
      var dx = def.limit(Math.floor(records.dx), 1, 256, 1);
      var dy = def.limit(Math.floor(records.dy), 1, 256, 1);
      var x0 = def.limit(Math.floor(records.x0), NUMMIN, NUMMAX, 0);
      var y0 = def.limit(Math.floor(records.y0), NUMMIN, NUMMAX, 0);
      var x1 = def.limit(Math.floor(records.x1), NUMMIN, NUMMAX, 0);
      var y1 = def.limit(Math.floor(records.y1), NUMMIN, NUMMAX, 0);
      var ID0 = all.ctx.getImageData(x0, y0, dx, dy);
      var ID1 = all.ctx.getImageData(x1, y1, dx, dy);
      all.draw_grid(dx, dy, ID0, ID1);
    };
    /* -> 1.19.7 */
    var callback_filter = function(){
      var filters = options._filter.split(":");
      filters.forEach(function(filter){
        /* 1.1.3 -> */
        var re = /\[.*?\]/g;
        var text = filter;
        var area = "";
        text = def.enter_name(text, "area", false, 2, function(content){area = content;});
        /* 1.15.7 -> */
        var mask = "";
        text = def.enter_name(text, "mask", false, 2, function(content){mask = content;});
        /* -> 1.15.7 */
        var content = def.get_title(text, "", false, 2);
        var arr_w = (content || "").split(",");  // rgba || rgba[] -> [""]
        arr_w = conv.arr_str2arr_num(arr_w, 0);  // [""] || [string] -> [0]
        var params = $.get_records(area, ",", 0, ["is", "js", "px_w", "px_h"], true);
        params.rgba = text.replace(re, "");
        params.arr_w = arr_w;
        params.content = content;  // 1.13.7
        /* 1.15.7 -> */
        if(mask){
          var records_mask = get_records_mask(mask);
          var Nlegend = records_mask.Nlegend;
          var isInverse = records_mask.isInverse;
          var isClear = records_mask.isClear;
          temp.lines(arr2d_tvec[Nlegend-1] || arr2d_tvec[len_j-1], 0, "#ffffff", null, true);
          params.ID_mask = temp.getID();
          params.isInverse = isInverse;
          params.isClear = isClear;
          temp.clear();
        }
        /* -> 1.15.7 */
        all.putID_xy(self.filter.run(all.ctx, params), params.is, params.js);
        /* -> 1.1.3 */
      });
    };
    /* -> 1.1.2 */
    /* 1.10.6 -> */
    var callback_transform = function(withBackground){
      var text = options._transform;
      var params = $.get_records(text, ",", 0, ["a", "b", "c", "d", "e", "f", "withBackground"], true);
      if((withBackground && params.withBackground) || (!(withBackground) && !(params.withBackground))){
        all.ctx.save();
        all.ctx.setTransform(params.a, params.b, params.c, params.d, params.e, params.f);
      }
    };
    var callback0 = function(){
      arr_base64_grid_plot.push(all.get_base64());
      var callback1 = function(){
        if(options._transform){
          callback_transform(false);
        };
    /* -> 1.10.6 */
        var callback2 = function(){
          if(options._transform){
            all.ctx.restore();
          }
    /* -> 1.8.5 */
          /* 1.2.3 -> */
          if(options._blur){
            callback_blur();
          };
          /* -> 1.2.3 */
          /* 1.1.2 -> */
          if(options._filter){
            callback_filter();
          };
          /* -> 1.1.2 */
          /* 1.19.7 -> */
          if(options._tile || options._tile === ""){
            callback_tile();
          };
          /* -> 1.19.7 */
          /* 1.15.7 -> */
          if(options._cut){
            callback_cut();
          };
          /* -> 1.15.7 */
          self.init_canvas(false);  // here for flickering-proof
          self.isLocked = false;
        };
        all.draw_base64s(arr_base64_grid_plot.reverse(), callback2, options._composite1 || options["canvas-globalCompositeOperation"]);  // Ver.2.848.155
      };
      /* 1.10.6 -> */
      all.clear();
      if(options._transform){
        callback_transform(true);
      };
      /* -> 1.10.6 */
      /* 1.17.7 -> */
//      background.clear();  // not implemented for flickering-proof
      /* -> 1.17.7 */
      all.draw_base64(base64_bg, null, callback1);  // bg(source-over) <- grid <- plot  // 1.32.8
    };
    temp.clear();  // 1.15.7
    all.clear();
    all.draw_base64s(arr_base64_plot.reverse(), callback0, options._composite0 || options["canvas-globalCompositeOperationLayer"]);  // Ver.2.848.155
  return self;  // Ver.2.821.135
};
