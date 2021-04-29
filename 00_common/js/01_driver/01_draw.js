// online-simulator.github.io

My_entry.draw = function(ctx){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.draw.prototype.config = {
  default: {
    white: "#fff",
    rgba: "rgba(0, 0, 0, 0)",
    decDigit: 0
  }
};
My_entry.draw.prototype.init = function(ctx){
  var self = this;
  self.ctx = ctx;
  self.setter = {};
  self.setter.backgroundColor = function(backgroundColor){
    self.backgroundColor = backgroundColor;
  };
  self.setter.decDigit = function(decDigit){
    self.decDigit = decDigit;
    self.dec = Math.pow(10, decDigit);
  };
  self.setter.backgroundColor(self.config.default.rgba);
  self.setter.decDigit(self.config.default.decDigit);
  self.fontFamily = "sans-serif";
  self.rn = "\n";
  return self;
};
/* Ver.0.7.0 -> */
My_entry.draw.prototype.floor = function(x_pixel){
  var self = this;
  var dec = self.dec;
  return Math.floor(x_pixel*dec)/dec;  // /dec
};
/* -> Ver.0.7.0 */
/* Ver.0.6.0 -> moved from canvas.js */
My_entry.draw.prototype.hex2dec = function(hex_8bit){
  var self = this;
  var dec_8bit = Number("0x"+hex_8bit);
  if(isNaN(dec_8bit)){
    dec_8bit = 0;
  }
  return Math.min(255, Math.max(0, dec_8bit));
};
My_entry.draw.prototype.hex2rgba = function(hex){
  var self = this;
  var _rgba = null;
  if(hex){
    var re = /#/g;
    if(hex.match(re)){
      var newHex = hex.replace(re, "");
      var len = newHex.length;
      var r = 0;
      var g = 0;
      var b = 0;
      var a = 0;
      if(len === 3){
        r = newHex.substr(0, 1);
        g = newHex.substr(1, 1);
        b = newHex.substr(2, 1);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = 255;
      }
      else if(len === 4){
        r = newHex.substr(0, 1);
        g = newHex.substr(1, 1);
        b = newHex.substr(2, 1);
        a = newHex.substr(3, 1);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = self.hex2dec(a+a);
      }
      else if(len === 6){
        r = newHex.substr(0, 2);
        g = newHex.substr(2, 2);
        b = newHex.substr(4, 2);
        r = self.hex2dec(r);
        g = self.hex2dec(g);
        b = self.hex2dec(b);
        a = 255;
      }
      else if(len === 8){
        r = newHex.substr(0, 2);
        g = newHex.substr(2, 2);
        b = newHex.substr(4, 2);
        a = newHex.substr(6, 2);
        r = self.hex2dec(r);
        g = self.hex2dec(g);
        b = self.hex2dec(b);
        a = self.hex2dec(a);
      }
      _rgba = "rgba("+r+","+g+","+b+","+a/255+")";  // a=0~1
    }
    else{
      _rgba = hex;  // "black"
    }
  }
  else{
    _rgba = self.config.default.rgba;
  }
  return _rgba;
};
/* -> Ver.0.6.0 */
My_entry.draw.prototype.rotate2d_vec = function(vec, t){
  var self = this;
  var cos_t = Math.cos(t);
  var sin_t = Math.sin(t);
  return {x: vec.x*(cos_t)-vec.y*(sin_t), y: vec.x*(sin_t)+vec.y*(cos_t)};
//  return {x: vec.x*(cos_t)+vec.y*(sin_t), y: vec.x*(-sin_t)+vec.y*(cos_t)};
};
My_entry.draw.prototype.rectangle = function(vec0, vec1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fill){
  var self = this;
  var ctx = self.ctx;
  ctx.save();
  ctx.lineWidth = self.floor(opt_lineWidth || 0);
  ctx.fillStyle = ctx.strokeStyle = self.hex2rgba(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var x1 = self.floor(vec1.x);
  var y1 = self.floor(vec1.y);
  if(opt_fill){
    ctx.fillRect(x0, y0, x1-x0, y1-y0);
  }
  else{
    ctx.strokeRect(x0, y0, x1-x0, y1-y0);
  }
  ctx.restore();
  return self;
};
My_entry.draw.prototype.enter = function(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  ctx.fillStyle = ctx.strokeStyle = self.hex2rgba(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;  // 0.3.0 moved upper fill
  if(lineWidth){
  }
  else{
    ctx.fill();
    if(opt_globalCompositeOperation === "source-over"){  // default
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
    }
  }
  ctx.lineCap = "round";  // "butt" || "round" || "square"
  ctx.lineJoin = "round";  // "round" || "bevel" || "miter"
  ctx.lineWidth = self.floor(lineWidth || r*0.3);
  ctx.stroke();
  return self;
};
