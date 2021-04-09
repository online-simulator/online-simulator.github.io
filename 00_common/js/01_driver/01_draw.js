// online-simulator.github.io

My_entry.draw = function(ctx){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.draw.prototype.init = function(ctx){
  var self = this;
  self.ctx = ctx;
  return self;
};
My_entry.draw.prototype.rotate2d_vec = function(vec, t){
  var self = this;
  var cos_t = Math.cos(t);
  var sin_t = Math.sin(t);
  return {x: vec.x*(cos_t)-vec.y*(sin_t), y: vec.x*(sin_t)+vec.y*(cos_t)};
//  return {x: vec.x*(cos_t)+vec.y*(sin_t), y: vec.x*(-sin_t)+vec.y*(cos_t)};
};
My_entry.draw.prototype.rectangle = function(vec0, vec1, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  ctx.save();
  ctx.lineWidth = opt_lineWidth || 0;
  if(opt_styleRGBA){
    ctx.fillStyle = ctx.strokeStyle = opt_styleRGBA;
  }
  ctx.strokeRect(vec0.x, vec0.y, vec1.x-vec0.x, vec1.y-vec0.y);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.enter = function(r, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  if(opt_styleRGBA){
    ctx.fillStyle = ctx.strokeStyle = opt_styleRGBA;
  }
  if(opt_lineWidth){
  }
  else{
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "destination-out";
  }
  ctx.lineCap = "round";  // "butt" || "round" || "square"
  ctx.lineJoin = "round";  // "round" || "bevel" || "miter"
  ctx.lineWidth = opt_lineWidth || r*0.3;
  ctx.stroke();
  return self;
};
My_entry.draw.prototype.line = function(vec0, vec1, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var x1 = vec1.x;
  var y1 = vec1.y;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.closePath();
  var lineWidth = opt_lineWidth;
  self.enter(lineWidth, lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.circle = function(vec0, r, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x0, y0, r, 0, Math.PI*2);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.triangle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_flagFlipY){
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
  ctx.moveTo(x0, y0-dy2);
  ctx.lineTo(x0-dx, y0+dy);
  ctx.lineTo(x0+dx, y0+dy);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.triangle2 = function(vec0, r, opt_lineWidth, opt_styleRGBA){
  var self = this;
  self.triangle(vec0, r, opt_lineWidth, opt_styleRGBA, true);
  return self;
};
My_entry.draw.prototype.square = function(vec0, r, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0-dx, y0-dy);
  ctx.lineTo(x0+dx, y0-dy);
  ctx.lineTo(x0+dx, y0+dy);
  ctx.lineTo(x0-dx, y0+dy);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.diamond = function(vec0, r, opt_lineWidth, opt_styleRGBA){
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
  ctx.moveTo(vec.x+x0, vec.y+y0);
  var vec = self.rotate2d_vec({x: +dx, y: -dy}, rad);
  ctx.lineTo(vec.x+x0, vec.y+y0);
  var vec = self.rotate2d_vec({x: +dx, y: +dy}, rad);
  ctx.lineTo(vec.x+x0, vec.y+y0);
  var vec = self.rotate2d_vec({x: -dx, y: +dy}, rad);
  ctx.lineTo(vec.x+x0, vec.y+y0);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
My_entry.draw.prototype.cross = function(vec0, r, opt_lineWidth, opt_styleRGBA){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x0-dx, y0-dy);
  ctx.lineTo(x0+dx, y0+dy);
  ctx.moveTo(x0+dx, y0-dy);
  ctx.lineTo(x0-dx, y0+dy);
  var lineWidth = opt_lineWidth || Math.floor(r/3)+1;
  self.enter(r, lineWidth, opt_styleRGBA);
  ctx.restore();
  return self;
};
