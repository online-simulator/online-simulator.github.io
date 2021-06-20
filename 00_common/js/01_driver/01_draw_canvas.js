// online-simulator.github.io

My_entry.draw_canvas = function(){
};

// mix-in
My_entry.draw_canvas.prototype.line = function(vec0, vec1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  if(lineWidth){  // 0.3.0 ctx.lineWidth = 0 -> ctx.lineWidth -> 1
    var x0 = self.floor(vec0.x);
    var y0 = self.floor(vec0.y);
    var x1 = self.floor(vec1.x);
    var y1 = self.floor(vec1.y);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    self.enter(lineWidth, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
    ctx.restore();
  }
  return self;
};
/* 0.7.0 -> */
/* 0.4.0 -> */
My_entry.draw_canvas.prototype.lines = function(arr_vec, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath){
  var self = this;
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  var fillPath = opt_fillPath || false;
  var make_path = function(fillPath){
    ctx.beginPath();
    for(var n=0, len_n=arr_vec.length; n<len_n-1; ++n){
      var vec0 = arr_vec[n];
      var vec1 = arr_vec[n+1];
      var x0 = self.floor(vec0.x);
      var y0 = self.floor(vec0.y);
      var x1 = self.floor(vec1.x);
      var y1 = self.floor(vec1.y);
      if(fillPath){
        if(n === 0){
          ctx.moveTo(x0, y0);
        }
      }
      else{
        ctx.moveTo(x0, y0);
      }
      ctx.lineTo(x1, y1);
    }
    ctx.closePath();
  };
  ctx.save();
  // fill
  if(fillPath){
    make_path(true);
    self.enter(0, null, opt_styleRGBA, opt_globalCompositeOperation);
  }
  // stroke
  if(lineWidth){
    make_path(false);
    self.enter(lineWidth, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  }
  ctx.restore();
  return self;
};
/* -> 0.4.0 */
/* -> 0.7.0 */
/* 1.0.0 -> */
My_entry.draw_canvas.prototype.none = function(){
  var self = this;
  return self;
};
My_entry.draw_canvas.prototype.textpath = function(text, arr_vec, opt_globalCompositeOperation, j, opt_fontFamily, opt_fontSize, isBold, isItalic, isReverse, opt_styleRGBA_bg, opt_styleRGBA_fg, fillStr, spacingX, spacingY, offsetX, offsetY, blur){
  var self = this;
  self.textpath_sw.apply(self, arguments);
  return self;
};
/* -> 1.0.0 */
/* 0.5.0 -> */
My_entry.draw_canvas.prototype.text = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var fontSize = opt_fontSize || 0;
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  var x = self.floor(vec0.x);
  var y = self.floor(vec0.y);
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.label = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var ctx = self.ctx;
  var fontSize = opt_fontSize || 0;
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var w = ctx.measureText(text).width;
  var h = fontSize;
  var t = (isY)? -Math.PI/2: 0;
  ctx.setTransform(Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), x0, y0);
  var x = self.floor(-w/2);
  var y = (isY)? self.floor(h): 0;
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.axis = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var ctx = self.ctx;
  var fontSize = opt_fontSize || 0;
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  var w = ctx.measureText(text).width;
  var h = fontSize;
  var w2 = (isY)? -w-h: -w/2;
  var h2 = (isY)? h/2: h*2;
  var x = vec0.x+w2;
  var y = vec0.y+h2;
  ctx.restore();
  self.text(text, {x: x, y: y}, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation);
  return self;
};
/* -> 0.5.0 */
/* 0.6.0 -> */
My_entry.draw_canvas.prototype.textbox = function(text, vec0, vec1, opt_fontSize, opt_styleRGBA_bg, opt_styleRGBA_fg, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var fontSize = opt_fontSize || 0;
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  var w = ctx.measureText(text).width;
  var dw = fontSize;
  var h = fontSize;
  var hr2 = h/2;
  ctx.restore();
  self.fill({x: vec0.x, y: vec0.y-hr2}, {x: vec1.x+w+dw, y: vec1.y+hr2}, opt_styleRGBA_bg, opt_globalCompositeOperation);
  self.text(text, {x: vec1.x+dw, y: vec1.y+hr2}, opt_fontSize, opt_styleRGBA_fg, opt_globalCompositeOperation);
  return self;
};
My_entry.draw_canvas.prototype.fill = function(vec0, vec1, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var x1 = self.floor(vec1.x);
  var y1 = self.floor(vec1.y);
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  ctx.fillRect(x0, y0, x1-x0, y1-y0);
  ctx.restore();
  return self;
};
/* -> 0.6.0 */
My_entry.draw_canvas.prototype.circle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var r0 = self.floor(r);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x0, y0, r0, 0, Math.PI*2);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.triangle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_flagFlipY){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var k1 = 1.2091995761561452;  // Math.PI*Math.sqrt(4/27)
  var k2 = 0.5773502691896258;  // 1/Math.sqrt(3)
  var k3 = 1.1547005383792515;  // Math.sqrt(4/3)
  var dx = r*k1;
  var dy = dx*k2;
  var dy2 = dx*k3;
  ctx.save();
  ctx.beginPath();
  if(opt_flagFlipY){
    dy = -dy;
    dy2 = -dy2;
  }
  ctx.moveTo(self.floor(x0), self.floor(y0-dy2));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.triangle2 = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  self.triangle(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, true);
  return self;
};
My_entry.draw_canvas.prototype.square = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(self.floor(x0-dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.diamond = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  var rad = Math.PI/4;
  var vec = self.rotate2d_vec({x: -dx, y: -dy}, rad);
  ctx.moveTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: +dx, y: -dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: +dx, y: +dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: -dx, y: +dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.cross = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(self.floor(x0-dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.moveTo(self.floor(x0+dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  var lineWidth = opt_lineWidth || r/3+1;
  self.enter(r, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
