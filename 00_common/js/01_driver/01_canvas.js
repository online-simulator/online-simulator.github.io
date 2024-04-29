// online-simulator.github.io

My_entry.canvas = function(elem){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.canvas.prototype.init = function(elem){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "def"]);
  self.elem = elem;
  self.elem_p = self.elem.parentElement;
  self.ctx = elem.getContext("2d", {willReadFrequently: true});  // 1.42.8
  self.draw = new My_entry.draw(self.ctx);
  self.px_w = 0;
  self.px_h = 0;
  self.x0 = null;
  self.y0 = null;
  self.dx = null;
  self.dy = null;
  self.markers = ["circle", "triangle", "triangle2", "square", "diamond", "cross"];
  self.markers.forEach(function(type){
    My_entry.canvas.prototype[type] = function(x0, y0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
      var self = this;
      var vecp0 = self.xy2xyp(x0, y0);  // 1.18.7
      return self.draw[type](vecp0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
    };
  });
  self.onevents = ["onmousedown", "onmousemove", "onmouseup"];
  self.touch = {
    onmousedown: "ontouchstart",
    onmousemove: "ontouchmove",
    onmouseup: "ontouchend"
  };
  /* 1.23.7 */
  self.point = {
    onmousedown: "onpointerdown",
    onmousemove: "onpointermove",
    onmouseup: "onpointerup"
  };
  return self;
};
My_entry.canvas.prototype.attach = function(handlers){
  var self = this;
  self.onevents.forEach(function(onevent){
    self.elem[self.point[onevent]] = self.elem[self.touch[onevent]] = self.elem[onevent] = handlers[onevent];
  });
  return self;
};
/* 1.23.7 */
My_entry.canvas.prototype.attach_point = function(handlers){
  var self = this;
  self.onevents.forEach(function(onevent){
    self.elem[self.point[onevent]] = handlers[onevent];
  });
  return self;
};
/* 1.43.8 */
My_entry.canvas.prototype.tap_point = function(opt_e){
  var self = this;
  var e = opt_e || {};
  if(isNaN(e.offsetX)){
    e.offsetX = self.px_w/2;
  }
  if(isNaN(e.offsetY)){
    e.offsetY = self.px_h/2;
  }
  e.isMyCalled = true;
  e.preventDefault = function(){};
  e.stopPropagation = function(){};
  self.elem[self.point["onmousedown"]](e);
  self.elem[self.point["onmouseup"]](e);
  return self;
};
My_entry.canvas.prototype.detach = function(){
  var self = this;
  self.onevents.forEach(function(onevent){
    self.elem[self.point[onevent]] = self.elem[self.touch[onevent]] = self.elem[onevent] = null;
  });
  return self;
};
My_entry.canvas.prototype.get_page = function(e){
  var self = this;
  var newE = e;
  if(e.touches){
    newE = (e.touches.length)? e.touches[0]: false;
  }
  var _page = (newE)? {x: newE.pageX, y: newE.pageY}: false;
  return _page;
};
My_entry.canvas.prototype.get_offset = function(e){
  var self = this;
  var newE = e;
  if(e.touches){
    var elem = self.elem;      // absolute
    var elem_p = self.elem_p;  // relative
    var page = self.get_page(e);
    if(page){
      var offsetParent = elem_p.offsetParent;
      var offsetX = page.x;
      offsetX -= offsetParent.offsetLeft;
      offsetX -= elem_p.offsetLeft+elem.offsetLeft;
      var offsetY = page.y;
      offsetY -= offsetParent.offsetTop;
      offsetY -= elem_p.offsetTop+elem.offsetTop;
      newE = {offsetX: offsetX, offsetY: offsetY};
    }
    else{
      newE = false;
    }
  }
  var _offset = (newE)? {x: newE.offsetX, y: newE.offsetY}: false;
  return _offset;
};
My_entry.canvas.prototype.get_base64 = function(){
  var self = this;
  return self.ctx.canvas.toDataURL();
};
/* 1.32.8 -> */
My_entry.canvas.prototype.draw_base64 = function(base64, opt_callback_first, opt_callback_last, opt_globalCompositeOperation, opt_transform){  // Ver.1.59.10
  var self = this;
  var ctx = self.ctx;
  var img = new Image();
  img.onload = function(e){
    if(opt_callback_first){
      opt_callback_first(e);
    }
    ctx.save();
    ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
    /* 0.3.0 -> */
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    /* -> 0.3.0  */
    /* Ver.1.59.10 -> */
    if(opt_transform){
      var px_w = img.width;
      var px_h = img.height;
      var w = opt_transform[6];
      var scale = Math.min(w/Math.min(px_w, px_h), 1);
      var abcdef = [opt_transform[0]*scale, opt_transform[1]*scale, opt_transform[2]*scale, opt_transform[3]*scale, opt_transform[4], opt_transform[5]];
      ctx.setTransform.apply(ctx, abcdef);
      if(w){
        ctx.beginPath();
        ctx.arc(0, 0, w/2, 0, Math.PI*2);
        ctx.clip();
      }
      self.ctx.drawImage(img, -0.5*px_w, -0.5*px_h);
    }
    else{
      self.ctx.drawImage(img, 0, 0);
    }
    /* -> Ver.1.59.10 */
    ctx.restore();
    if(opt_callback_last){
      opt_callback_last(e);
    }
  };
  img.src = base64;
  return self;
};
My_entry.canvas.prototype.draw_base64s = function(arr_base64, opt_callback, opt_globalCompositeOperation, opt_transform){  // Ver.1.59.10
  var self = this;
  var ctx = self.ctx;
  if(arr_base64.length){
    self.draw_base64(arr_base64.pop(), null, function(e){
      self.draw_base64s(arr_base64, opt_callback, opt_globalCompositeOperation, opt_transform);  // Ver.1.59.10
    }, opt_globalCompositeOperation, opt_transform);  // 0.3.0 simplified  // Ver.1.59.10
  }
  else{
    if(opt_callback){
      opt_callback();
    }
  }
  return self;
};
/* -> 1.32.8 */
// 1.19.7
// 1.17.7
My_entry.canvas.prototype.draw_grid = function(opt_dx, opt_dy, opt_ID0, opt_ID1){
  var self = this;
  var def = self.entry.def;
  var ctx = self.ctx;
  var px_w = self.px_w;
  var px_h = self.px_h;
  var rgb0 = 211;
  var rgb1 = 240;
  if(ctx){
    var dx = def.limit(Math.floor(opt_dx), 1, px_w, 8);
    var dy = def.limit(Math.floor(opt_dy), 1, px_h, 8);
    var ID0 = opt_ID0 || ctx.createImageData(dx, dy);
    var data0 = ID0.data;
    var ID1 = opt_ID1 || ctx.createImageData(dx, dy);
    var data1 = ID1.data;
    for(var j=0; j<dy; ++j){
      for(var i=0; i<dx; ++i){
        var ired = 4*(dx*j+i);
        if(!(opt_ID0)){
          data0[ired+0] = rgb0;
          data0[ired+1] = rgb0;
          data0[ired+2] = rgb0;
          data0[ired+3] = 255;
        }
        if(!(opt_ID1)){
          data1[ired+0] = rgb1;
          data1[ired+1] = rgb1;
          data1[ired+2] = rgb1;
          data1[ired+3] = 255;
        }
      }
    }
    self.clear();
    for(var j=0; j<px_h; ++j){
      for(var i=0; i<px_w; ++i){
        if(i%dx === 0 && j%dy === 0){
          var igrid = Math.floor(i/dx);
          var jgrid = Math.floor(j/dy);
          var isEven = (igrid%2 === 0 && jgrid%2 === 0);
          var isOdd = (igrid%2 === 1 && jgrid%2 === 1);
          if(isEven || isOdd){
            self.putID_xy(ID0, i, j);
          }
          else{
            self.putID_xy(ID1, i, j);
          }
        }
      }
    }
  }
  return self;
};
My_entry.canvas.prototype.change_size = function(px_w, px_h){
  var self = this;
  var elem = self.elem;
  elem.width = self.px_w = px_w;
  elem.height = self.px_h = px_h;
  return self;
};
My_entry.canvas.prototype.change_scale = function(x0, y0, x1, y1){  // right-handed system
  var self = this;
  self.x0 = x0;
  self.y0 = y0;
  self.dx = x1-x0;
  self.dy = y1-y0;
  return self;
};
My_entry.canvas.prototype.xp2x = function(xp){
  var self = this;
  return self.x0+xp*self.dx/self.px_w;
};
My_entry.canvas.prototype.yp2y = function(yp){
  var self = this;
  return self.y0+yp*self.dy/self.px_h;
};
My_entry.canvas.prototype.myp2y = function(myp){  // left-handed system
  var self = this;
  return self.y0+(self.px_h-myp)*self.dy/self.px_h;
};
My_entry.canvas.prototype.x2xp = function(x){
  var self = this;
  return (x-self.x0)*self.px_w/self.dx;
};
My_entry.canvas.prototype.y2yp = function(y){
  var self = this;
  return (y-self.y0)*self.px_h/self.dy;
};
My_entry.canvas.prototype.y2myp = function(y){  // left-handed system
  var self = this;
  return self.px_h-(y-self.y0)*self.px_h/self.dy;
};
My_entry.canvas.prototype.x2fxp = function(x){
  var self = this;
  return Math.floor(self.x2xp(x));
};
My_entry.canvas.prototype.y2fyp = function(y){
  var self = this;
  return Math.floor(self.y2yp(y));
};
My_entry.canvas.prototype.y2fmyp = function(y){  // left-handed system
  var self = this;
  return Math.floor(self.y2myp(y));
};
/* 1.0.0 -> */
My_entry.canvas.prototype.plot2screen = function(gxmin, gymin, gxmax, gymax, Ni, Nj){
  var self = this;
  var xpmin = self.x2xp(Math.min(gxmin, gxmax));
  var ypmin = self.y2myp(Math.max(gymin, gymax));  // gymax(grid) -> ypmin(screen)
  var xpmax = self.x2xp(Math.max(gxmin, gxmax));
  var ypmax = self.y2myp(Math.min(gymin, gymax));  // gymin(grid) -> ypmax(screen)
  var xpc = (xpmin+xpmax)/2;
  var ypc = (ypmin+ypmax)/2;
  return {xpmin: xpmin, ypmin: ypmin, xpmax: xpmax, ypmax: ypmax, xpc: xpc, ypc: ypc, dxp: (xpmax-xpmin)/Ni, dyp: (ypmax-ypmin)/Nj};
};
My_entry.canvas.prototype.screen2plot = function(xpmin, ypmin, xpmax, ypmax){
  var self = this;
  var gxmin = self.xp2x(Math.min(xpmin, xpmax));
  var gymin = self.myp2y(Math.max(ypmin, ypmax));  // max
  var gxmax = self.xp2x(Math.max(xpmin, xpmax));
  var gymax = self.myp2y(Math.min(ypmin, ypmax));  // min
  return {gxmin: gxmin, gymin: gymin, gxmax: gxmax, gymax: gymax};
};
My_entry.canvas.prototype.line = function(x0, y0, x1, y1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var vecp0 = self.xy2xyp(x0, y0);  // 1.18.7
  var vecp1 = self.xy2xyp(x1, y1);  // 1.18.7
  return self.draw.line(vecp0, vecp1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
};
/* 1.18.7 */
My_entry.canvas.prototype.xy2xyp = function(x, y){
  var self = this;
  return {x: self.x2xp(x), y: self.y2myp(y)};
};
My_entry.canvas.prototype.arr_vec2arr_vecp = function(arr_vec){
  var self = this;
  var _arr_vecp = [];
  for(var n=0, len_n=arr_vec.length; n<len_n; ++n){
    var vecn = arr_vec[n];
    var x = vecn.x;
    var y = vecn.y;
    _arr_vecp[n] = self.xy2xyp(x, y);  // 1.18.7
  }
  return _arr_vecp;
};
/* 0.4.0 */
My_entry.canvas.prototype.lines = function(arr_vec, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath){
  var self = this;
  return self.draw.lines(self.arr_vec2arr_vecp(arr_vec), opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath);
};
My_entry.canvas.prototype.mask = function(gxmin, gymin, gxmax, gymax, idName){
  var self = this;
  var xpmin = self.x2xp(gxmin);
  var ypmin = self.y2myp(gymax);  // gymax(grid) -> ypmin(screen)
  var xpmax = self.x2xp(gxmax);
  var ypmax = self.y2myp(gymin);  // gymin(grid) -> ypmax(screen)
  var w = xpmax-xpmin+1;
  var h = ypmax-ypmin+1;
  return self.draw.mask(xpmin, ypmin, w, h, idName);
};
My_entry.canvas.prototype.none = function(){
  var self = this;
  return self.draw.none();
};
My_entry.canvas.prototype.textpath = function(text, arr_vec, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, j, records){
  var self = this;
  return self.draw.textpath(text, self.arr_vec2arr_vecp(arr_vec), opt_globalCompositeOperation, j, records.fontFamily, records.fontSize || opt_fontSize, records.isBold, records.isItalic, records.isReverse, records.styleRGBA_bg || opt_styleRGBA, records.styleRGBA_fg || opt_styleRGBA, records.fillStr, records.spacingX, records.spacingY, records.offsetX, records.offsetY, records.blur, records.deg0);
};
My_entry.canvas.prototype.gradation = function(colors, arr_vec, opt_globalCompositeOperation, records){
  var self = this;
  var vecp0 = self.xy2xyp(records.x0, records.y0);  // 1.18.7
  return self.draw.gradation(colors, self.arr_vec2arr_vecp(arr_vec), opt_globalCompositeOperation, vecp0, records.offsetR, records.orderR, records.NrandR, records.NrandT, records.isMin, records.isRound, records.Nrender, records.Ncycle);
};
/* -> 1.0.0 */
/* 1.11.6 */
/* 1.2.3 */
My_entry.canvas.prototype.blur = function(arr_s, arr_vec, opt_globalCompositeOperation, records, records_asym){
  var self = this;
  var vecp0 = self.xy2xyp(records.x0, records.y0);  // 1.18.7
  return self.draw.blur(arr_s, self.arr_vec2arr_vecp(arr_vec), opt_globalCompositeOperation, vecp0, records.offsetR, records.orderR, records.NrandR, records.NrandT, records.isMin, records.isRound, records.Nrender, records.Ncycle, records.isCyclic, records.isSquare, records_asym.x_asym, records_asym.y_asym, records_asym.k_asym, records_asym.Nrad_asym);  // 1.9.6
};
/* 0.5.0 -> */
My_entry.canvas.prototype.text = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var vecp0 = self.xy2xyp(x0, y0);  // 1.18.7
  return self.draw.text(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation);
};
My_entry.canvas.prototype.label = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var vecp0 = (isY)? {x: self.px_w*x0, y: self.y2myp(y0)}: {x: self.x2xp(x0), y: self.px_h*(1-y0)};
  return self.draw.label(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY);
};
My_entry.canvas.prototype.axis = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var vecp0 = self.xy2xyp(x0, y0);  // 1.18.7
  return self.draw.axis(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY);
};
/* -> 0.5.0 */
/* 0.6.0 -> */
My_entry.canvas.prototype.fill = function(opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  return self.draw.fill({x: 0, y: 0}, {x: self.px_w, y: self.px_h}, opt_styleRGBA, opt_globalCompositeOperation);
};
/* -> 0.6.0 */
My_entry.canvas.prototype.getRGBA_xy = function(x, y){
  var self = this;
  var ID = self.getID_xy(x, y);
  var data = ID.data;  // 1.31.7
  var r = data[0];
  var g = data[1];
  var b = data[2];
  var a = data[3];
  return {r:r, g:g, b:b, a:a};
};
My_entry.canvas.prototype.getID_xy = function(x, y){
  var self = this;
  return self.ctx.getImageData(x, y, 1, 1);
};
My_entry.canvas.prototype.getID_range = function(x, y, w, h){
  var self = this;
  return self.ctx.getImageData(x, y, w, h);
};
My_entry.canvas.prototype.getID_center = function(){
  var self = this;
  return self.getID_xy(Math.floor(self.px_w/2), Math.floor(self.px_h/2));
};
My_entry.canvas.prototype.getID = function(){
  var self = this;
  return self.ctx.getImageData(0, 0, self.px_w, self.px_h);
};
/* 1.29.7 */
My_entry.canvas.prototype.getID_alpha = function(opt_alpha){
  var self = this;
  var _ID = self.getID();
  var data = _ID.data;  // 1.31.7
  var alpha = opt_alpha || 0;
  var px_w = self.px_w;
  var px_h = self.px_h;
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var r = data[ired+0];
      var g = data[ired+1];
      var b = data[ired+2];
      var a = data[ired+3];
      if(r+g+b+a){
        data[ired+3] = Math.min(a, 255*alpha);
      }
    }
  }
  return _ID;
};
/* 1.30.7 */
My_entry.canvas.prototype.getID_RGBA = function(opt_R255, opt_G255, opt_B255, opt_A100, type){
  var self = this;
  var _ID = self.getID();
  var data = _ID.data;  // 1.31.7
  var R255 = opt_R255 || 0;
  var G255 = opt_G255 || 0;
  var B255 = opt_B255 || 0;
  var A255 = 255*(opt_A100 || 0)/100;
  var filter_rgba = null;
  if(type === "flat_low"){
    filter_rgba = function(rgba, RGBA255){
      return ((RGBA255 < 0)? rgba: Math.max(rgba, RGBA255));
    };
  }
  else if(type === "flat_all"){
    filter_rgba = function(rgba, RGBA255){
      return ((RGBA255 < 0)? rgba: RGBA255);
    };
  }
  else if(type === "flat_upp"){
    filter_rgba = function(rgba, RGBA255){
      return ((RGBA255 < 0)? rgba: Math.min(rgba, RGBA255));
    };
  }
  if(filter_rgba){
    var px_w = self.px_w;
    var px_h = self.px_h;
    for(var j=0; j<px_h; ++j){
      for(var i=0; i<px_w; ++i){
        var ired = 4*(px_w*j+i);
        var r = data[ired+0];
        var g = data[ired+1];
        var b = data[ired+2];
        var a = data[ired+3];
        if(r+g+b+a){
          data[ired+0] = filter_rgba(r, R255);
          data[ired+1] = filter_rgba(g, G255);
          data[ired+2] = filter_rgba(b, B255);
          data[ired+3] = filter_rgba(a, A255);
        }
      }
    }
  }
  return _ID;
};
/* 1.39.8 */
My_entry.canvas.prototype.convID_rgba = function(rgba, opt_ID){
  var self = this;
  var ctx = self.ctx;
  var px_w = self.px_w;
  var px_h = self.px_h;
  var _ID = ctx.createImageData(px_w, px_h);
  var ID = opt_ID || self.getID();
  var data = ID.data;
  var _data = _ID.data;
  var r_ = rgba.r;
  var g_ = rgba.g;
  var b_ = rgba.b;
  var a_ = rgba.a;
  var hasR = (r_ >= 0) && (r_ <= 255);
  var hasG = (g_ >= 0) && (g_ <= 255);
  var hasB = (b_ >= 0) && (b_ <= 255);
  var hasA = (a_ >= 0) && (a_ <= 255);
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var r = data[ired+0];
      var g = data[ired+1];
      var b = data[ired+2];
      var a = data[ired+3];
      if(r+g+b+a){
        _data[ired+0] = (hasR)? r_: r;
        _data[ired+1] = (hasG)? g_: g;
        _data[ired+2] = (hasB)? b_: b;
        _data[ired+3] = (hasA)? a_: a;
      }
    }
  }
  return _ID;
};
/* 1.49.8 */
My_entry.canvas.prototype.make_uvp = function(options, opt_ID){  // fluid-Ver.1.10.0
  var self = this;
  var _obj = null;
  var ctx = self.ctx;
  var px_w = self.px_w;
  var px_h = self.px_h;
  var ID = opt_ID || self.getID();
  var data = ID.data;
  /* fluid-Ver.1.10.0 -> */
  var dx = options["grid-width"];
  var dy = options["grid-height"];
  var Ly = options.Ly || 1;
  /* -> fluid-Ver.1.10.0 */
  var rdx = Math.round(dx);
  var rdy = Math.round(dy);
  var hasArea = (rdx > 0 && rdy > 0);
  if(hasArea){
    var Ni = Math.ceil(px_w/rdx);
    var Nj = Math.ceil(px_h/rdy);
    var u = new Array(Ni);
    var v = new Array(Ni);
    var ud = new Array(Ni);
    var vd = new Array(Ni);
    var p = new Array(Ni);
    var p0 = new Array(Ni);
    var id = new Array(Ni);
    var hasP0 = false;
    for(var i=0; i<Ni; ++i){
      u[i] = new Array(Nj);
      v[i] = new Array(Nj);
      ud[i] = new Array(Nj);
      vd[i] = new Array(Nj);
      p[i] = new Array(Nj);
      p0[i] = new Array(Nj);
      id[i] = new Array(Nj);
      for(var j=0; j<Nj; ++j){
        var xs = rdx*i;
        var ys = rdy*j;
        var ired = 4*(px_w*ys+xs);
        var r = data[ired+0];
        var g = data[ired+1];
        var b = data[ired+2];
        var a = data[ired+3];
        var isP0 = (b === 255);
        hasP0 = hasP0 || isP0;
        if(isP0){
          r = g = b = a = 0;  // only defined var
        }
        /* fluid-Ver.1.20.0 -> */
        else if(b === 1){
          r = -r;
        }
        else if(b === 2){
          g = -g;
        }
        else if(b === 3){
          r = -r;
          g = -g;
        }
        /* -> fluid-Ver.1.20.0 */
        u[i][j] = r/255;
        v[i][j] = g/255;
        ud[i][j] = 0;
        vd[i][j] = 0;
        p[i][j] = undefined;  // fluid-Ver.1.41.0
        p0[i][j] = isP0;
        id[i][j] = a/255;
      }
    }
    var i_unknowns = [];
    var j_unknowns = [];
    for(var i=0; i<Ni; ++i){
      for(var j=0; j<Nj; ++j){
        if(id[i][j] === 0){
          i_unknowns.push(i);
          j_unknowns.push(j);
          id[i][j] = i_unknowns.length;
        }
        else{
          id[i][j] = 0;
        }
      }
    }
    /* 1.50.8 -> */
//    var dxi = 1/Ni;
//    var dyi = (rdy/rdx)*dxi;
//    var dyi = 1/Nj;
    var dyi = Ly/Nj;  // fluid-Ver.1.10.0
    var dxi = (rdx/rdy)*dyi;
    var Lx = dxi*Ni;  // fluid-Ver.1.10.0
    /* -> 1.50.8 */
    _obj = {u: u, v: v, ud: ud, vd: vd, p: p, p0: p0, id: id, hasP0: hasP0, i_unknowns: i_unknowns, j_unknowns: j_unknowns, Ni: Ni, Nj: Nj, len0: i_unknowns.length, dx: dxi, dy: dyi, t: 0, cmax: 0, qtotal: 0, Re: 0, sx: 0, sy: 0, Lx: Lx, Ly: Ly};  // fluid-Ver.1.10.0  // fluid-Ver.1.11.0  // fluid-Ver.1.24.0  // fluid-Ver.1.34.0
  }
  return _obj;
};
/* 1.31.8 */
/* 1.31.7 */
My_entry.canvas.prototype.draw_lines_grid = function(dx, dy, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  var px_w = self.px_w;
  var px_h = self.px_h;
  ctx.lineWidth = opt_lineWidth || 0;
  ctx.fillStyle = ctx.strokeStyle = self.draw.color2style(opt_styleRGBA);
  var hasGrid = (dx > 0 && dy > 0);
  if(hasGrid){
    /* 1.46.8 -> */
    var Ni = Math.ceil(px_w/dx);
    var Nj = Math.ceil(px_h/dy);
    ctx.save();
    for(var i=0; i<Ni+1; ++i){  // 1.51.8
      var xi = dx*i;
      ctx.beginPath();
      ctx.moveTo(xi, 0);
      ctx.lineTo(xi, px_h);
      ctx.stroke();
    }
    for(var j=0; j<Nj+1; ++j){  // 1.51.8
    /* -> 1.46.8 */
      var yj = dy*j;
      ctx.beginPath();
      ctx.moveTo(0, yj);
      ctx.lineTo(px_w, yj);
      ctx.stroke();
    }
    ctx.restore();
  }
  return self;
};
/* 1.37.8 not used */
My_entry.canvas.prototype.make_ID_map = function(rgba, opt_sw_round, opt_ID0, opt_ID1){
  var self = this;
  var ctx = self.ctx;
  var px_w = self.px_w;
  var px_h = self.px_h;
  var _ID = ctx.createImageData(px_w, px_h);
  var ID0 = opt_ID0 || _ID;
  var ID1 = opt_ID1 || self.getID();
  var _data = _ID.data;
  var data0 = ID0.data;
  var data1 = ID1.data;
  var sw_round = opt_sw_round || "floor";
  var r_ = Math[sw_round](Math.max(0, Math.min(255, rgba.r)));
  var g_ = Math[sw_round](Math.max(0, Math.min(255, rgba.g)));
  var b_ = Math[sw_round](Math.max(0, Math.min(255, rgba.b)));
  var a_ = Math[sw_round](Math.max(0, Math.min(255, rgba.a)));
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var r0 = data0[ired+0];
      var g0 = data0[ired+1];
      var b0 = data0[ired+2];
      var a0 = data0[ired+3];
      var r1 = data1[ired+0];
      var g1 = data1[ired+1];
      var b1 = data1[ired+2];
      var a1 = data1[ired+3];
      var isColor = (r1 === r_ && g1 === g_ && b1 === b_ && a1 === a_);
      var isChanged = !(r1 === r0 && g1 === g0 && b1 === b0 && a1 === a0);
      if(isColor && isChanged){
        _data[ired+0] = 1;
      }
    }
  }
  return _ID;
};
My_entry.canvas.prototype.putID_xy = function(ID, x, y){
  var self = this;
  self.ctx.putImageData(ID, x, y);
  return self;
};
My_entry.canvas.prototype.putID = function(ID){
  var self = this;
  self.ctx.putImageData(ID, 0, 0);
  return self;
};
My_entry.canvas.prototype.put = function(src){
  var self = this;
  self.putID(src.getID());
  src.clear();
  return self;
};
My_entry.canvas.prototype.clear = function(){
  var self = this;
  self.ctx.clearRect(0, 0, self.px_w, self.px_h);
  return self;
};
My_entry.canvas.prototype.clear_range = function(x, y, w, h){
  var self = this;
  self.ctx.clearRect(x, y, w, h);
  return self;
};
