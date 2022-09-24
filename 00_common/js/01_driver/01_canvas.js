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
  self.ctx = elem.getContext("2d");
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
My_entry.canvas.prototype.draw_base64 = function(base64, opt_callback, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var img = new Image();
  img.onload = function(e){
    ctx.save();
    ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
    /* 0.3.0 -> */
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    /* -> 0.3.0  */
    self.ctx.drawImage(img, 0, 0);
    ctx.restore();
    if(opt_callback){
      opt_callback(e);
    }
  };
  img.src = base64;
  return self;
};
My_entry.canvas.prototype.draw_base64s = function(arr_base64, opt_callback, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  if(arr_base64.length){
    self.draw_base64(arr_base64.pop(), function(e){
      self.draw_base64s(arr_base64, opt_callback, opt_globalCompositeOperation);
    }, opt_globalCompositeOperation);  // 0.3.0 simplified
  }
  else{
    if(opt_callback){
      opt_callback();
    }
  }
  return self;
};
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
  var r = ID.data[0];
  var g = ID.data[1];
  var b = ID.data[2];
  var a = ID.data[3];
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
  var alpha = opt_alpha || 0;
  var px_w = self.px_w;
  var px_h = self.px_h;
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var r = _ID.data[ired+0];
      var g = _ID.data[ired+1];
      var b = _ID.data[ired+2];
      var a = _ID.data[ired+3];
      if(r+g+b+a){
        _ID.data[ired+3] = Math.min(a, 255*alpha);
      }
    }
  }
  return _ID;
};
/* 1.30.7 */
My_entry.canvas.prototype.getID_RGBA = function(opt_R255, opt_G255, opt_B255, opt_A100, type){
  var self = this;
  var _ID = self.getID();
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
        var r = _ID.data[ired+0];
        var g = _ID.data[ired+1];
        var b = _ID.data[ired+2];
        var a = _ID.data[ired+3];
        if(r+g+b+a){
          _ID.data[ired+0] = filter_rgba(r, R255);
          _ID.data[ired+1] = filter_rgba(g, G255);
          _ID.data[ired+2] = filter_rgba(b, B255);
          _ID.data[ired+3] = filter_rgba(a, A255);
        }
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
