// online-simulator.github.io

My_entry.canvas = function(elem){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.canvas.prototype.init = function(elem){
  var self = this;
//  My_entry.def.mix_in_props(My_entry.canvas, My_entry.drag, ["get_client"]);
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
      var vec0 = {x: self.x2xp(x0), y: self.y2myp(y0)};
      self.draw[type](vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
      return self;
    };
  });
  self.onevents = ["onmousedown", "onmousemove", "onmouseup"];
  self.touch = {
    onmousedown: "ontouchstart",
    onmousemove: "ontouchmove",
    onmouseup: "ontouchend"
  };
  return self;
};
My_entry.canvas.prototype.attach = function(handlers){
  var self = this;
  self.onevents.forEach(function(onevent){
    self.elem[self.touch[onevent]] = self.elem[onevent] = handlers[onevent];
  });
  return self;
};
My_entry.canvas.prototype.detach = function(){
  var self = this;
  self.onevents.forEach(function(onevent){
    self.elem[self.touch[onevent]] = self.elem[onevent] = null;
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
My_entry.canvas.prototype.getBase64 = function(){
  var self = this;
  return self.ctx.canvas.toDataURL();
};
My_entry.canvas.prototype.putBase64 = function(base64, opt_callback, opt_globalCompositeOperation){
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
My_entry.canvas.prototype.putBase64s = function(arr_base64, opt_callback, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  if(arr_base64.length){
    self.putBase64(arr_base64.pop(), function(e){
      self.putBase64s(arr_base64, opt_callback, opt_globalCompositeOperation);
    }, opt_globalCompositeOperation);  // 0.3.0 simplified
  }
  else{
    if(opt_callback){
      opt_callback();
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
My_entry.canvas.prototype.line = function(x0, y0, x1, y1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var vecp0 = {x: self.x2xp(x0), y: self.y2myp(y0)};
  var vecp1 = {x: self.x2xp(x1), y: self.y2myp(y1)};
  self.draw.line(vecp0, vecp1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  return self;
};
/* 0.4.0 */
My_entry.canvas.prototype.lines = function(arr_vec, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath){
  var self = this;
  var arr_vecp = [];
  for(var n=0, len_n=arr_vec.length; n<len_n; ++n){
    var vecn = arr_vec[n];
    var x = vecn.x;
    var y = vecn.y;
    arr_vecp[n] = {x: self.x2xp(x), y: self.y2myp(y)};
  }
  self.draw.lines(arr_vecp, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath);
  return self;
};
/* 0.5.0 -> */
My_entry.canvas.prototype.text = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var vecp0 = {x: self.x2xp(x0), y: self.y2myp(y0)};
  self.draw.text(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation);
  return self;
};
My_entry.canvas.prototype.label = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var vecp0 = (isY)? {x: self.px_w*x0, y: self.y2myp(y0)}: {x: self.x2xp(x0), y: self.px_h*(1-y0)};
  self.draw.label(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY);
  return self;
};
My_entry.canvas.prototype.axis = function(text, x0, y0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var vecp0 = {x: self.x2xp(x0), y: self.y2myp(y0)};
  self.draw.axis(text, vecp0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY);
  return self;
};
/* -> 0.5.0 */
/* 0.6.0 -> */
My_entry.canvas.prototype.fill = function(opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  self.draw.fill({x: 0, y: 0}, {x: self.px_w, y: self.px_h}, opt_styleRGBA, opt_globalCompositeOperation);
  return self;
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
