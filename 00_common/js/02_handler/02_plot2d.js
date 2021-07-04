// online-simulator.github.io

My_entry.plot2d = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.plot2d.prototype.config = {
  default: {
    msec_snapping: 300,
    NUMMIN: -32768,
    NUMMAX: 32767,
    px_w: 512,
    px_h: 256,
    gridLineColor: "gray",
    selectedLineColor: "rgb(7, 135, 200)",
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
  self.isLocked = false;
  self.isDrawn = false;
  self.isDragging = false;
  self.isChanged = false;
  self.sw_snap = 0;
  self.screen_xy = null;
  self.vec0 = null;
  self.vec1 = null;
  self.vec2 = null;
  self.vec10 = null;
  self.vec20 = null;
  self.arr_ID_plot = null;
  self.id = id;
  self.tagName = "canvas";
  self.className = self.id+"-"+self.tagName;
  self.classNames = [self.className, "absolute"];
  self.elem_p = self.entry.$._id(self.id);
  self.objs = {};
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
My_entry.plot2d.prototype.init_canvas = function(){
  var self = this;
  self.names.forEach(function(name){
    self.objs[name].clear();
  });
  self.objs.all.clear();
  return self;
};
My_entry.plot2d.prototype.init_flags = function(){
  var self = this;
  self.isDrawn = false;
  self.isDragging = false;
  self.isChanged = false;
  self.sw_snap = 0;
  return self;
};
/* 1.0.0 -> */
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
    _vec  = {x: x0+Math.round((x1-x0)/dx)*dx, y: y0+Math.round((y1-y0)/dy)*dy};
  }
  return _vec;
};
My_entry.plot2d.prototype.vec2data_centering = function(vec){
  var self = this;
  var grid =  self.objs.grid;
  var _data = null;
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
    _data = grid.screen2plot(x0+dx, y0+dy, x1+dx, y1+dy);
  }
  return _data;
};
My_entry.plot2d.prototype.init_handlers = function(){
  var self = this;
  var grid =  self.objs.grid;
  var temp =  self.objs.temp;
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
      var isSnapped = (self.entry.$._id("checkbox-snap").checked || self.sw_snap > 0);
      if(isSnapped){
        vec0 = self.vec2vec_snapped(vec0);
        vec1 = self.vec2vec_snapped(vec1);
        self.sw_snap = 2;
      }
      temp.draw.rectangle(vec0, vec1, 3, self.config.default.selectedLineColor, null);
    }
  };
  handlers.onmouseup = function(e){  // always
    e.preventDefault();
    e.stopPropagation();
    temp.clear();
    var vec0 = self.vec2 || self.vec0;
    var vec1 = self.vec1;
    var isSnapped = (self.entry.$._id("checkbox-snap").checked || self.sw_snap > 0);
    if(isSnapped){
      vec0 = self.vec2vec_snapped(vec0);
      vec1 = self.vec2vec_snapped(vec1);
    }
    var data = null;
    var isMoved = (vec1 && (vec1.x-vec0.x || vec1.y-vec0.y));
    if(isMoved){
      data = grid.screen2plot(vec0.x, vec0.y, vec1.x, vec1.y);
      self.isChanged = true;
    }
    else{
      data = self.vec2data_centering(vec0);
      self.isChanged = true;
    }
    if(isMoved || self.sw_snap){
      self.callbacks.onmouseup(e, data);
    }
    self.isDragging = false;
    self.sw_snap = 0;
  };
  self.entry.$.bind_objs(self, self.handlers);
  return self;
};
/* -> 1.0.0 */
My_entry.plot2d.prototype.throw_msg = function(msg){
  var self = this;
  self.isLocked = false;
  throw msg;
  return self;
};
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
My_entry.plot2d.prototype.grid = function(options, tx0, ty0, tx1, ty1, Ni, Nj, isLog_x, isLog_y, label_x, label_y, fontSize, expDigit, gridLineWidth, gridLineColor, globalCompositeOperation){
  var self = this;
  var grid = self.objs.grid;
  var _svg = "";
  var lineWidth = gridLineWidth;
  var styleRGBA = gridLineColor;
  var len_i = Ni+1;
  var len_j = Nj+1;
  var tdx = (tx1-tx0)/Ni;
  var tdy = (ty1-ty0)/Nj;
  /* 0.5.0 -> */
  if(label_x){
    if(tx0 <= 0 && tx1 >= 0 && !(isLog_x)){
      var tx = self.trans(0, isLog_x);
      _svg += grid.line(tx, ty0, tx, ty1, lineWidth, styleRGBA, globalCompositeOperation);
    }
    _svg += grid.label(label_x, (tx0+tx1)/2, self.config.default.ratio_y, fontSize+self.config.default.dfontSize, styleRGBA, globalCompositeOperation, false);
  }
  if(label_y){
    if(ty0 <= 0 && ty1 >= 0 && !(isLog_y)){
      var ty = self.trans(0, isLog_y);
      _svg += grid.line(tx0, ty, tx1, ty, lineWidth, styleRGBA, globalCompositeOperation);
    }
    _svg += grid.label(label_y, self.config.default.ratio_x, (ty0+ty1)/2, fontSize+self.config.default.dfontSize, styleRGBA, globalCompositeOperation, true);
  }
  /* -> 0.5.0 */
  for(var i=0; i<len_i; ++i){
    var tx = tx0+i*tdx;
    _svg += grid.line(tx, ty0, tx, ty1, lineWidth, styleRGBA, globalCompositeOperation);
    if(label_x){
      var val = self.entry.conv.num2not(tx, self.config.default.decDigit, expDigit);
      _svg += grid.axis(val, tx, ty0, fontSize, styleRGBA, globalCompositeOperation, false);
    }
  }
  for(var j=0; j<len_j; ++j){
    var ty = ty0+j*tdy;
    _svg += grid.line(tx0, ty, tx1, ty, lineWidth, styleRGBA, globalCompositeOperation);
    if(label_y){
      var val = self.entry.conv.num2not(ty, self.config.default.decDigit, expDigit);
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
  return self;
};
My_entry.plot2d.prototype.run = function(arr2d_vec, options, toSVG, isFinal){
  var self = this;
  if(self.isLocked) return false;
  self.isLocked = true;
  /* 1.0.1 -> */
  if(!(toSVG)){
    self.init_canvas();
  }
  /* -> 1.0.1 */
  var $ = self.entry.$;
  var def = self.entry.def;
  var background = self.objs.background;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var temp =  self.objs.temp;
  var markers = plot.markers;
  var _svg = "";
  var expDigit = options["expDigit"];
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
  if(!(isAxis_z)){
    gridLineWidth = 0;
    isLegend = false;
    isAxis_x = false;
    isAxis_y = false;
  }
  var tgxmin = self.trans(gxmin, isLog_x);
  var tgymin = self.trans(gymin, isLog_y);
  var tgxmax = self.trans(gxmax, isLog_x);
  var tgymax = self.trans(gymax, isLog_y);
  if(!(isFinite(tgxmin)) || !(isFinite(tgymin)) || !(isFinite(tgxmax)) || !(isFinite(tgymax))){
    temp.detach();
    self.isDrawn = false;
    throw "Invalid plot2d isInf";
  }
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
  var title = "";
  if(isAxis_z && inputZ){
    inputZ = def.enter_name(inputZ, "title", false, 0, function(content){title = content;});
  }
  var label_x = "";
  if(isAxis_x && isAxis_z && inputZ){
    inputZ = def.enter_name(inputZ, "xlabel", false, 0, function(content){label_x = content;});
  }
  var label_y = "";
  if(isAxis_y && isAxis_z && inputZ){
    inputZ = def.enter_name(inputZ, "ylabel", false, 0, function(content){label_y = content;});
  }
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
    var G = (len_j>1)? Math.floor(j*255/(len_j-1)): 0;
    var R = Math.floor(255-G)%256;
    var B = Math.floor(G<<1)%(256-1);
    arr_markerType[j] = markerType || markers[j%markers.length];
    arr_styleRGBA[j] = styleRGBA || "rgb("+R+","+G+","+B+")";
    arr_markerSize[j] = markerSize;
    arr_markerLineWidth[j] = markerLineWidth;
    arr_plotLineWidth[j] = plotLineWidth;
    arr_fillPath[j] = fillPath;
    arr_str[j] = str;
    arr_strFontSize[j] = strFontSize;
  }
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
  if(isAxis_x && !(label_x)){
    label_x = "x(t)";
    label_x = (isImag_x)? "imag("+label_x+")": label_x;
    label_x = (isLog_x)? "log10("+label_x+")": label_x;
  }
  if(isAxis_y && !(label_y)){
    label_y = "y(t)";
    label_y = (isImag_y)? "imag("+label_y+")": label_y;
    label_y = (isLog_y)? "log10("+label_y+")": label_y;
  }
  self.screen_xy = grid.plot2screen(tgxmin, tgymin, tgxmax, tgymax, Ni, Nj);
  /* -> 0.5.0 */
  _svg += self.grid(options, tgxmin, tgymin, tgxmax, tgymax, Ni, Nj, isLog_x, isLog_y, label_x, label_y, fontSize, expDigit, gridLineWidth, gridLineColor, globalCompositeOperation);
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
  // make arr2d_tvec
  var arr2d_tvec = new Array(len_j);
  for(var j=0; j<len_j; ++j){
    arr2d_tvec[j] = new Array(len_n);
    for(var n=0; n<len_n; ++n){
      var x = arr2d_tx[n][j];
      var y = arr2d_ty[n][j];
      arr2d_tvec[j][n] = {x: x, y: y};
    }
  }
  // masking
  var idName_mask = "mask_lines_and_gradations";
  var dtgx = dtgx0*1e-15;
  var dtgy = dtgy0*1e-15;
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
  for(var j=0; j<len_j; ++j){
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
      var hasRand = records.NrandR || records.NrandT;
      var ID_or_svg = plot.gradation(colors, arr2d_tvec[j], globalCompositeOperation, records);
      if(isFinal){
        if(toSVG){
          _svg += ID_or_svg;
        }
        else{
          if(isAxis_z){
            if(!(options.oldPlot2d)){
              plot.putID(ID_or_svg);
              ID_or_svg = plot.mask(tgxmin_mask, tgymin_mask, tgxmax_mask, tgymax_mask, idName_mask);
              plot.clear();
            }
          }
          self.arr_ID_plot.push(ID_or_svg);
        }
      }
      else if(!(hasRand)){
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
if(isAxis_z){
  // plot lines
  if(!(options.oldPlot2d)){
    if(toSVG){
      _svg += plot.draw.header_group(null, plot.draw.use_mask(idName_mask));
    }
  }
  for(var j=0; j<len_j; ++j){
    var styleRGBA = arr_styleRGBA[j];
    var plotLineWidth = arr_plotLineWidth[j];
    var fillPath = arr_fillPath[j];
    _svg += plot.lines(arr2d_tvec[j], plotLineWidth, styleRGBA, globalCompositeOperation, fillPath);
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
  for(var j=0; j<len_j; ++j){
    var markerType = arr_markerType[j];
    var styleRGBA = arr_styleRGBA[j];
    var markerSize = arr_markerSize[j];
    var markerLineWidth = arr_markerLineWidth[j];
    if(markerSize){
      for(var n=0; n<len_n; ++n){
        var x = arr2d_tx[n][j];
        var y = arr2d_ty[n][j];
        if(options.oldPlot2d || !(x < tgxmin_mask || x > tgxmax_mask || y < tgymin_mask || y > tgymax_mask)){
          _svg += plot[markerType](x, y, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
        }
      }
    }
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
    for(var j=0; j<len_j; ++j){
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
        _svg += plot.draw.textbox(text, {x: xp0, y: yp}, {x: xp1, y: yp}, strFontSize, backgroundColor, gridLineColor, globalCompositeOperation);
        if(plotLineWidth){
          _svg += plot.draw.line({x: xp0, y: yp}, {x: xp1, y: yp}, plotLineWidth, styleRGBA, globalCompositeOperation);
        }
        if(markerSize){
          _svg += plot.draw[markerType]({x: (xp0+xp1)/2, y: yp}, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
        }
        yp += dyp_half;
      }
    }
  }
  /* -> 0.6.0 */
  // string with SVG-path
  for(var j=0; j<len_j; ++j){
    var styleRGBA = arr_styleRGBA[j];
    var strFontSize = arr_strFontSize[j];
    var strPath = arr_strPath[j];
    if(strPath){
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
  temp.attach(self.handlers);  // 0.4.0 moved from final()
  self.isLocked = false;
  return _svg;
};
/* 1.0.0 */
My_entry.plot2d.prototype.final = function(arr2d_vec, options, toSVG){
  var self = this;
  var all =  self.objs.all;
  self.arr_ID_plot = [];
  /* 1.0.1 -> */
  var _svg = self.run(arr2d_vec, options, toSVG, true) || "";
  if(!(toSVG)){
    if(self.isLocked) return false;
  /* -> 1.0.1 */
    var base64_bg = self.base64_bg || self.objs.background.getBase64();
    var arr_base64_grid_plot = [];
    arr_base64_grid_plot.push(self.objs.grid.getBase64());
    var arr_base64_plot = [];
    self.arr_ID_plot.forEach(function(ID){
      all.putID(ID);
      arr_base64_plot.push(all.getBase64());
    });
    arr_base64_plot.push(self.objs.plot.getBase64());
    var callback0 = function(){
      arr_base64_grid_plot.push(all.getBase64());
      var callback1 = function(){
        var callback2 = function(){
          self.names.forEach(function(name){
            self.objs[name].clear();  // here for flickering-proof
          });
          self.isDrawn = true;
          self.isLocked = false;
        };
        all.putBase64s(arr_base64_grid_plot.reverse(), callback2, options["canvas-globalCompositeOperation"]);
      };
      all.clear();
      all.putBase64(base64_bg, callback1);  // bg(source-over) <- grid <- plot
    };
    self.isLocked = true;
    all.clear();
    all.putBase64s(arr_base64_plot.reverse(), callback0, options["canvas-globalCompositeOperationLayer"]);
  }
  return _svg;
};
