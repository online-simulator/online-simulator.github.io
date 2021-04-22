// online-simulator.github.io

My_entry.plot2d = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.plot2d.prototype.config = {
  default: {
    px_w: 512,
    px_h: 256,
    gridLineColor: "gray",
    selectedLineColor: "rgb(7, 135, 200)",
    Ni: 10,
    Nj: 10,
    Ni0: 6,
    Nj0: 6,
    fontSize: 12
  },
  threshold: {
    px: 256
  }
};
My_entry.plot2d.prototype.init = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "def"]);
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
  self.vec0 = null;
  self.vec1 = null;
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
My_entry.plot2d.prototype.re_init = function(name){
  var self = this;
  self.names.forEach(function(name){
    self.objs[name].clear();
  });
  self.objs.all.clear();
  self.isLocked = false;
  return self;
};
My_entry.plot2d.prototype.init_flags = function(){
  var self = this;
  self.isDrawn = false;
  self.isDragging = false;
  self.isChanged = false;
  return self;
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
    self.vec0 = temp.get_offset(e);
    self.vec1 = null;
  };
  handlers.onmousemove = function(e){
    e.preventDefault();
    e.stopPropagation();
    if(self.isDragging){
      temp.clear();
      var vec0 = self.vec0;
      var vec1 = self.vec1 = temp.get_offset(e);
      temp.draw.rectangle(vec0, vec1, 3, self.config.default.selectedLineColor);
    }
  };
  handlers.onmouseup = function(e){
    e.preventDefault();
    e.stopPropagation();
    temp.clear();
    var vec0 = self.vec0;
    var vec1 = self.vec1;
    if(vec1 && (vec1.x-vec0.x || vec1.y-vec0.y)){  // check no move
      var gxmin = grid.xp2x(Math.min(vec0.x, vec1.x));
      var gymin = grid.myp2y(Math.max(vec0.y, vec1.y));  // max
      var gxmax = grid.xp2x(Math.max(vec0.x, vec1.x));
      var gymax = grid.myp2y(Math.min(vec0.y, vec1.y));  // min
      self.change_scale(gxmin, gymin, gxmax, gymax);
      self.isChanged = true;
    }
    else{
      self.isChanged = false;
    }
    self.callbacks.onmouseup(e);
    self.isDragging = false;
  };
  self.entry.$.bind_objs(self, self.handlers);
  return self;
};
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
My_entry.plot2d.prototype.grid = function(x0, y0, x1, y1, Ni, Nj, isLog_x, isLog_y, isAxis_x, isAxis_y, fontSize, gridLineWidth, gridLineColor, globalCompositeOperation){
  var self = this;
  var grid = self.objs.grid;
  var lineWidth = gridLineWidth;
  var styleRGBA = gridLineColor || self.config.default.gridLineColor;
  var dx = (x1-x0)/Ni;
  var dy = (y1-y0)/Nj;
  var len_i = Ni+1;
  var len_j = Nj+1;
  var tx0 = self.trans(x0, isLog_x);
  var ty0 = self.trans(y0, isLog_y);
  var tx1 = self.trans(x1, isLog_x);
  var ty1 = self.trans(y1, isLog_y);
  /* 0.5.0 -> */
  var ed = (Math.min(self.px_w, self.px_h) < self.config.threshold.px)? 0: 1;
  if(isAxis_x){
    grid.label("x(t)", (tx0+tx1)/2, ty0, fontSize, styleRGBA, globalCompositeOperation, false);
  }
  if(isAxis_y){
    grid.label("y(t)", tx0, (ty0+ty1)/2, fontSize, styleRGBA, globalCompositeOperation, true);
  }
  /* -> 0.5.0 */
  for(var i=0; i<len_i; ++i){
    var tx = self.trans(x0+i*dx, isLog_x);
    grid.line(tx, ty0, tx, ty1, lineWidth, styleRGBA, globalCompositeOperation);
    if(isAxis_x){
      grid.axis(tx.toExponential(ed), tx, ty0, fontSize, styleRGBA, globalCompositeOperation, false);
    }
  }
  for(var j=0; j<len_j; ++j){
    var ty = self.trans(y0+j*dy, isLog_y);
    grid.line(tx0, ty, tx1, ty, lineWidth, styleRGBA, globalCompositeOperation);
    if(isAxis_y){
      grid.axis(ty.toExponential(ed), tx0, ty, fontSize, styleRGBA, globalCompositeOperation, true);
    }
  }
  return self;
};
/* 0.5.0 -> */
My_entry.plot2d.prototype.get_kx = function(fontSize){
  var self = this;
  var k = (self.px_w < self.config.threshold.px)? 2: 1;
  return (self.config.default.px_w/self.px_w)*(fontSize/self.config.default.fontSize)*k;
};
My_entry.plot2d.prototype.get_ky = function(fontSize){
  var self = this;
  var k = (self.px_h < self.config.threshold.px)? 2: 1;
  return (self.config.default.px_h/self.px_h)*(fontSize/self.config.default.fontSize)*k;
};
/* -> 0.5.0 */
My_entry.plot2d.prototype.change_scale = function(gxmin, gymin, gxmax, gymax, isLog_x, isLog_y, isAxis_x, isAxis_y, fontSize){
  var self = this;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var tgxmin = self.trans(gxmin, isLog_x);
  var tgymin = self.trans(gymin, isLog_y);
  var tgxmax = self.trans(gxmax, isLog_x);
  var tgymax = self.trans(gymax, isLog_y);
  var tgdx = (tgxmax-tgxmin)*0.125 || 1;
  var tgdy = (tgymax-tgymin)*0.125 || 1;
  /* 0.5.0 -> */
  var kx = self.get_kx(fontSize);
  var ky = self.get_ky(fontSize);
  tgxmin -= (isAxis_y)? tgdx*2.5*kx: tgdx;
  tgymin -= (isAxis_x)? tgdy*3.0*ky: tgdy;
  tgxmax += (isAxis_y)? tgdx*1.0*kx: tgdx;
  tgymax += (isAxis_x)? tgdy*1.0*ky: tgdy;
  /* -> 0.5.0 */
  grid.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  plot.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  return self;
};
My_entry.plot2d.prototype.run = function(arr2d_vec, options){
  var self = this;
  if(self.isLocked) return false;
  self.isLocked = true;
  var def = self.entry.def;
  var background = self.objs.background;
  var plot = self.objs.plot;
  var temp =  self.objs.temp;
  var markers = plot.markers;
  var markerSize0 = options["marker-size"];
  var markerLineWidth0 = options["marker-line-width"];
  var plotLineWidth0 = options["plot-line-width"];
  var gridLineWidth = options["grid-line-width"];
  var gridLineColor = options["grid-line-color"];
//  var globalCompositeOperation = options["globalCompositeOperationAll"] || null;  // 0.2.0 urlParam || source-over
  var globalCompositeOperation = options["canvas-globalCompositeOperationLayer"] || null;  // 0.3.0 selectVal || source-over
  var isLog_x = options["log-x"];
  var isLog_y = options["log-y"];
  var isAxis_x = options["axis-x"];
  var isAxis_y = options["axis-y"];
  var fontSize = options["font-size"];
  var arr2d_x = arr2d_vec.x;
  var arr2d_y = arr2d_vec.y;
  var len_n = arr2d_vec.len_n;
  var len_j = arr2d_vec.len_j;
  var gxmin = arr2d_vec.gxmin;
  var gymin = arr2d_vec.gymin;
  var gxmax = arr2d_vec.gxmax;
  var gymax = arr2d_vec.gymax;
  if(!(self.isChanged)){
    self.change_scale(gxmin, gymin, gxmax, gymax, isLog_x, isLog_y, isAxis_x, isAxis_y, fontSize);
  }
  // legend
  var arr_markerType = new Array(len_j);
  var arr_styleRGBA = new Array(len_j);
  var arr_markerSize = new Array(len_j);
  var arr_markerLineWidth = new Array(len_j);
  var arr_plotLineWidth = new Array(len_j);
  var arr_fillPath = new Array(len_j);
  var inputZ = options["input-z"] || "";
  var arr_legend = inputZ.split(";");
  var markerType = null;
  var styleRGBA = null;
  var markerSize = null;
  var markerLineWidth = null;
  var plotLineWidth = null;
  var fillPath = null;
  for(var j=0; j<len_j; ++j){
    var legend = arr_legend[j];
    var type = null;
    var style = null;
    var size = null;
    var lineWidth = null;
    var plineWidth = null;
    var fill = null;
    if(legend){
      var arr_config = legend.split(":");
      type = arr_config[0];
      style = arr_config[1];
      size = arr_config[2];
      lineWidth = arr_config[3];
      plineWidth = arr_config[4];
      fill = arr_config[5];
      type = (self.entry.def.hasElem_arr(markers, type))? type: null;
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
    var G = (len_j>1)? Math.floor(j*255/(len_j-1)): 0;
    var R = Math.floor(255-G)%256;
    var B = Math.floor(G<<1)%(256-1);
    arr_markerType[j] = markerType || markers[j%markers.length];
    arr_styleRGBA[j] = styleRGBA || "rgb("+R+","+G+","+B+")";
    arr_markerSize[j] = markerSize;
    arr_markerLineWidth[j] = markerLineWidth;
    arr_plotLineWidth[j] = plotLineWidth;
    arr_fillPath[j] = fillPath;
  }
  // background
  var img_bg = self.img_bg;
  if(img_bg){
    background.ctx.drawImage(img_bg, 0, 0);
  }
  else{
    background.fill(options["bg-color"] || options["canvas-background"], globalCompositeOperation);
  }
  // grid
  /* 0.5.0 -> */
  var Ni = (isAxis_x)? Math.floor(self.config.default.Ni0/self.get_kx(fontSize)) || 1: self.config.default.Ni;
  var Nj = (isAxis_y)? Math.floor(self.config.default.Nj0/self.get_ky(fontSize)) || 1: self.config.default.Nj;
  /* -> 0.5.0 */
  self.grid(gxmin, gymin, gxmax, gymax, Ni, Nj, isLog_x, isLog_y, isAxis_x, isAxis_y, fontSize, gridLineWidth, gridLineColor, globalCompositeOperation);
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
  // plot lines
  for(var j=0; j<len_j; ++j){
    var styleRGBA = arr_styleRGBA[j];
    var plotLineWidth = arr_plotLineWidth[j];
    var fillPath = arr_fillPath[j];
    if(plotLineWidth){
      var arr_vec = [];
      for(var n=0; n<len_n; ++n){
        var x = arr2d_tx[n][j];
        var y = arr2d_ty[n][j];
        arr_vec[n] = {x: x, y: y};
      }
      plot.lines(arr_vec, plotLineWidth, styleRGBA, globalCompositeOperation, fillPath);
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
        plot[markerType](x, y, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
      }
    }
  }
  temp.attach(self.handlers);  // 0.4.0 moved from final()
  self.isLocked = false;
  return self;
};
My_entry.plot2d.prototype.final = function(arr2d_vec, options){
  var self = this;
  var all =  self.objs.all;
  self.run(arr2d_vec, options);
  var base64_bg = self.base64_bg || self.objs.background.getBase64();
  var arr_base64_grid_plot = [self.objs.grid.getBase64(), self.objs.plot.getBase64()];
  var callback = function(){
    all.putBase64s(arr_base64_grid_plot.reverse(), function(){
      self.names.forEach(function(name){
        self.objs[name].clear();
      });
    }, options["canvas-globalCompositeOperation"]);
  };
  all.putBase64(base64_bg, callback);  // source-over
  self.isDrawn = true;
  self.isLocked = false;
  return self;
};
