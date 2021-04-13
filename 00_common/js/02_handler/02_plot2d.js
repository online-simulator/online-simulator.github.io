// online-simulator.github.io

My_entry.plot2d = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.plot2d.prototype.init = function(id, opt_px_w, opt_px_h, opt_px_b){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "def"]);
  self.setter = {};
  self.setter.callbacks = function(callbacks){
    self.callbacks = callbacks;
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
      temp.draw.rectangle(vec0, vec1, 3, "rgb(7, 135, 200)");
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
My_entry.plot2d.prototype.grid = function(x0, y0, x1, y1, Ni, Nj, isLog_x, isLog_y, gridLineWidth, gridLineColor, globalCompositeOperation){
  var self = this;
  var grid = self.objs.grid;
  var lineWidth = gridLineWidth;
  var styleRGBA = gridLineColor || "gray";
  var dx = (x1-x0)/Ni;
  var dy = (y1-y0)/Nj;
  var len_i = Ni+1;
  var len_j = Nj+1;
  var tx0 = self.trans(x0, isLog_x);
  var ty0 = self.trans(y0, isLog_y);
  var tx1 = self.trans(x1, isLog_x);
  var ty1 = self.trans(y1, isLog_y);
  for(var i=0; i<len_i; ++i){
    var tx = self.trans(x0+i*dx, isLog_x);
    grid.line(tx, ty0, tx, ty1, lineWidth, styleRGBA, globalCompositeOperation);
  }
  for(var j=0; j<len_j; ++j){
    var ty = self.trans(y0+j*dy, isLog_y);
    grid.line(tx0, ty, tx1, ty, lineWidth, styleRGBA, globalCompositeOperation);
  }
  return self;
};
My_entry.plot2d.prototype.change_scale = function(gxmin, gymin, gxmax, gymax, isLog_x, isLog_y){
  var self = this;
  var grid = self.objs.grid;
  var plot = self.objs.plot;
  var tgxmin = self.trans(gxmin, isLog_x);
  var tgymin = self.trans(gymin, isLog_y);
  var tgxmax = self.trans(gxmax, isLog_x);
  var tgymax = self.trans(gymax, isLog_y);
  var tgdx = (tgxmax-tgxmin)*0.125 || 1;
  var tgdy = (tgymax-tgymin)*0.125 || 1;
  tgxmin -= tgdx;
  tgymin -= tgdy;
  tgxmax += tgdx;
  tgymax += tgdy;
  grid.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  plot.change_scale(tgxmin, tgymin, tgxmax, tgymax);
  return self;
};
My_entry.plot2d.prototype.run = function(arr2d_vec, options){
  var self = this;
  if(self.isLocked) return false;
  self.isLocked = true;
  var background = self.objs.background;
  var plot = self.objs.plot;
  var markers = plot.markers;
  var markerSize0 = options["marker-size"];
  var markerLineWidth0 = options["marker-line-width"];
  var plotLineWidth0 = options["plot-line-width"];
  var gridLineWidth = options["grid-line-width"];
  var gridLineColor = options["grid-line-color"];
  var globalCompositeOperation = null;  // source-over
  var isLog_x = options["log-x"];
  var isLog_y = options["log-y"];
  var arr2d_x = arr2d_vec.x;
  var arr2d_y = arr2d_vec.y;
  var len_n = arr2d_vec.len_n;
  var len_j = arr2d_vec.len_j;
  var gxmin = arr2d_vec.gxmin;
  var gymin = arr2d_vec.gymin;
  var gxmax = arr2d_vec.gxmax;
  var gymax = arr2d_vec.gymax;
  if(!(self.isChanged)){
    self.change_scale(gxmin, gymin, gxmax, gymax, isLog_x, isLog_y);
  }
  // legend
  var arr_markerType = new Array(len_j);
  var arr_styleRGBA = new Array(len_j);
  var arr_markerSize = new Array(len_j);
  var arr_markerLineWidth = new Array(len_j);
  var arr_plotLineWidth = new Array(len_j);
  var inputZ = options["input-z"] || "";
  var arr_legend = inputZ.split(";");
  var markerType = null;
  var styleRGBA = null;
  var markerSize = null;
  var markerLineWidth = null;
  var plotLineWidth = null;
  for(var j=0; j<len_j; ++j){
    var legend = arr_legend[j];
    var type = null;
    var style = null;
    var size = null;
    var lineWidth = null;
    var plineWidth = null;
    if(legend){
      var arr_config = legend.split(":");
      type = arr_config[0];
      style = arr_config[1];
      size = arr_config[2];
      lineWidth = arr_config[3];
      plineWidth = arr_config[4];
      type = (self.entry.def.hasElem_arr(markers, type))? type: null;
    }
    markerType = type || markerType;
    styleRGBA = style || styleRGBA;
    markerSize = Number(size || markerSize);
    markerLineWidth = Number(lineWidth || markerLineWidth);
    plotLineWidth = Number(plineWidth || plotLineWidth);
    // Ver.2.11.4
    markerSize = (isNaN(markerSize))? 0: markerSize;
    markerLineWidth = (isNaN(markerLineWidth))? 0: markerLineWidth;
    var G = (len_j>1)? Math.floor(j*255/(len_j-1)): 0;
    var R = Math.floor(255-G)%256;
    var B = Math.floor(G<<1)%(256-1);
    arr_markerType[j] = markerType || markers[j%markers.length];
    arr_styleRGBA[j] = styleRGBA || "rgb("+R+","+G+","+B+")";
    arr_markerSize[j] = markerSize || markerSize0;
    arr_markerLineWidth[j] = markerLineWidth || markerLineWidth0;
    arr_plotLineWidth[j] = plotLineWidth || plotLineWidth0;
  }
  // background
  background.fill(options["bg-color"] || options["canvas-background"], globalCompositeOperation);
  // grid
  self.grid(gxmin, gymin, gxmax, gymax, 10, 10, isLog_x, isLog_y, gridLineWidth, gridLineColor, globalCompositeOperation);
  // plot
  for(var j=0; j<len_j; ++j){
    var markerType = arr_markerType[j];
    var styleRGBA = arr_styleRGBA[j];
    var markerSize = arr_markerSize[j];
    var markerLineWidth = arr_markerLineWidth[j];
    var plotLineWidth = arr_plotLineWidth[j];
    for(var n=0; n<len_n-1; ++n){
      var x0 = self.trans(arr2d_x[n][j], isLog_x);
      var y0 = self.trans(arr2d_y[n][j], isLog_y);
      var x1 = self.trans(arr2d_x[n+1][j], isLog_x);
      var y1 = self.trans(arr2d_y[n+1][j], isLog_y);
      if(plotLineWidth){
        plot.line(x0, y0, x1, y1, plotLineWidth, styleRGBA, globalCompositeOperation);
      }
      if(markerSize){
        plot[markerType](x0, y0, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
        if(n === len_n-2){
          plot[markerType](x1, y1, markerSize, markerLineWidth, styleRGBA, globalCompositeOperation);
        }
      }
    }
  }
  self.isLocked = false;
  return self;
};
My_entry.plot2d.prototype.final = function(arr2d_vec, options){
  var self = this;
  var all =  self.objs.all;
  var temp =  self.objs.temp;
  self.run(arr2d_vec, options);
  var base64_bg = self.objs.background.getBase64();
  var arr_base64_grid_plot = [self.objs.grid.getBase64(), self.objs.plot.getBase64()];
  var callback = function(){
    all.putBase64s(arr_base64_grid_plot.reverse(), function(){
      self.names.forEach(function(name){
        self.objs[name].clear();
      });
    }, options["canvas-globalCompositeOperation"]);
  };
  all.putBase64(base64_bg, callback);  // source-over
  temp.add_handlers(self.handlers);
  self.isDrawn = true;
  self.isLocked = false;
  return self;
};
