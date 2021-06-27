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
/* 0.7.0 -> */
My_entry.draw.prototype.floor = function(x_pixel){
  var self = this;
  var dec = self.dec;
  return Math.floor(x_pixel*dec)/dec;  // /dec
};
/* -> 0.7.0 */
/* 1.0.0 -> */
My_entry.draw.prototype.lerp_rgba = function(rgba0, rgba1, k){
  var self = this;
  var r0 = rgba0.r;
  var g0 = rgba0.g;
  var b0 = rgba0.b;
  var a0 = rgba0.a;
  var r1 = rgba1.r;
  var g1 = rgba1.g;
  var b1 = rgba1.b;
  var a1 = rgba1.a;
  var lerp = function(t0, t1, k){
    return t0+(t1-t0)*k;
  };
  return {r: lerp(r0, r1, k), g: lerp(g0, g1, k), b: lerp(b0, b1, k), a: lerp(a0, a1, k)};  // 0~255
};
My_entry.draw.prototype.color2rgba = function(color){
  var self = this;
  var ctx = self.ctx;
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 0;
  if(color){
    var re_hex = /#/g;
    var re_rgb = /rgb[a]{0,1}\((.*?)\)/i;
    var mc_hex0 = color.match(re_hex);  // filter #000f for IE
    ctx.save();
    ctx.shadowColor = color;
    var color_ = (mc_hex0)? color: ctx.shadowColor;  // black -> #000000
    ctx.restore();
    var mc_hex = color_.match(re_hex);
    var mc_rgb = color_.match(re_rgb);
    if(mc_rgb && mc_rgb.length === 2){
      var sc = mc_rgb[1].split(",");
      var len_rgb = sc.length;
      if(len_rgb > 2){
        r = Number(sc[0]);
        g = Number(sc[1]);
        b = Number(sc[2]);
        a = (len_rgb > 3)? Number(sc[3]): 1;
        a *= 255;
      }
    }
    else if(mc_hex){
      var hex = color_.replace(re_hex, "");
      var len = hex.length;
      if(len === 3){
        r = hex.substr(0, 1);
        g = hex.substr(1, 1);
        b = hex.substr(2, 1);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = 255;
      }
      else if(len === 4){
        r = hex.substr(0, 1);
        g = hex.substr(1, 1);
        b = hex.substr(2, 1);
        a = hex.substr(3, 1);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = self.hex2dec(a+a);
      }
      else if(len === 6){
        r = hex.substr(0, 2);
        g = hex.substr(2, 2);
        b = hex.substr(4, 2);
        r = self.hex2dec(r);
        g = self.hex2dec(g);
        b = self.hex2dec(b);
        a = 255;
      }
      else if(len === 8){
        r = hex.substr(0, 2);
        g = hex.substr(2, 2);
        b = hex.substr(4, 2);
        a = hex.substr(6, 2);
        r = self.hex2dec(r);
        g = self.hex2dec(g);
        b = self.hex2dec(b);
        a = self.hex2dec(a);
      }
    }
  }
  return {r: r, g: g, b: b, a: a};  // 0~255
};
My_entry.draw.prototype.rgba2style = function(rgba){
  var self = this;
  var r = Math.floor(rgba.r);
  var g = Math.floor(rgba.g);
  var b = Math.floor(rgba.b);
  var a = Math.floor(rgba.a);
  return ((a >= 255)? "rgb("+r+","+g+","+b+")": "rgba("+r+","+g+","+b+","+a/255+")");  // floor(rgba)=0~255 for IE -> a=0~1
};
/* 0.6.0 -> moved from canvas.js */
My_entry.draw.prototype.hex2dec = function(hex_8bit){
  var self = this;
  var dec_8bit = Number("0x"+hex_8bit);
  if(isNaN(dec_8bit)){
    dec_8bit = 0;
  }
  return Math.min(255, Math.max(0, dec_8bit));
};
My_entry.draw.prototype.color2style = function(color){
  var self = this;
  return self.rgba2style(self.color2rgba(color));
};
/* -> 0.6.0 */
/* -> 1.0.0 */
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
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
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
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;  // 0.3.0 moved upper fill
  if(lineWidth){  // 0 < lineWidth including < 1
  }
  else{
    ctx.fill();
    if(opt_globalCompositeOperation === "source-over"){  // default
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "destination-out";
    }
  }
  var lineWidthFixed = self.floor(lineWidth || r*0.3);
  if(lineWidthFixed){  // 0.7.0 ctx.lineWidth = 0 -> ctx.lineWidth -> 1
    ctx.lineCap = "round";  // "butt" || "round" || "square"
    ctx.lineJoin = "round";  // "round" || "bevel" || "miter"
    ctx.lineWidth = lineWidthFixed;
    ctx.stroke();
  }
  return self;
};
/* 1.0.0 -> */
My_entry.draw.prototype.get_path = function(arr_vec, isReverse){
  var self = this;
  var _style = "";
  _style += "M";
  for(var n=0, len_n=arr_vec.length; n<len_n; ++n){
    if(n > 0){
      _style += " L";
    }
    var vecn = arr_vec[(isReverse)? (len_n-1)-n: n];
    var x = self.floor(vecn.x);
    var y = self.floor(vecn.y);
    _style += x+" "+y;
  }
  _style += " Z";
  return _style;
};
My_entry.draw.prototype.textpath_sw = function(text, arr_vec, opt_globalCompositeOperation, j, opt_fontFamily, opt_fontSize, isBold, isItalic, isReverse, opt_styleRGBA_bg, opt_styleRGBA_fg, fillStr, spacingX, spacingY, offsetX, offsetY, blur, toSVG){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var style_path = self.get_path(arr_vec, isReverse);
  path.setAttribute("d", style_path);
  var x0 = 0;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = opt_fontFamily || self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  if(isBold){
    ctx.font = "bold "+ctx.font;
  }
  if(isItalic){
    ctx.font = "italic "+ctx.font;
  }
  var fillStyle = self.color2style(opt_styleRGBA_bg);
  var strokeStyle = self.color2style(opt_styleRGBA_fg);
  var shadowColor = strokeStyle;
  if(fillStr === false){
  }
  else if(fillStr === true){
    shadowColor = fillStyle;
  }
  else{
    var rgba0 = self.color2rgba(strokeStyle);
    var rgba1 = self.color2rgba(fillStyle);
    var Nk = Number(fillStr);
    Nk = (isNaN(Nk))? 0: Math.abs(Nk)/255;
    var rgbak = self.lerp_rgba(rgba0, rgba1, Math.min(1, Nk));
    shadowColor = self.rgba2style(rgbak);
  }
  var hasSpace = (spacingX || spacingY);
  var idName_path = "path"+j;
  var idName_filter = "filter"+j;
  if(toSVG){
    _svg += "<path id="+self.quote(idName_path);
    _svg += " fill="+self.quote("none");
    _svg += " stroke="+self.quote("none");
    _svg += " d="+self.quote(style_path);
    _svg += "/>";
    _svg += self.rn;
    _svg += self.def_dropShadow(idName_filter, shadowColor, offsetX, offsetY, blur);
    var svg_config = "";
    svg_config += " font-family="+self.quote(fontFamily);
    svg_config += " font-size="+self.quote(fontSize);
    svg_config += (isBold)? " font-weight="+self.quote("bold"): "";
    svg_config += (isItalic)? " font-style="+self.quote("italic"): "";
    svg_config += " fill="+self.quote((fillStr !== false)? fillStyle: "none");
    svg_config += " stroke="+self.quote((fillStr !== true)? strokeStyle: "none");
    svg_config += (blur)? self.use_filter(idName_filter): "";
    _svg += self.header_group(null, svg_config);
  }
  else{
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    if(blur){
      var offsetX0 = self.floor(offsetX);
      var offsetY0 = self.floor(offsetY);
      var blur0 = self.floor(blur);
      ctx.shadowColor = shadowColor;
      ctx.shadowOffsetX = offsetX0;
      ctx.shadowOffsetY = offsetY0;
      ctx.shadowBlur = blur0;
    }
    ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  }
  if(toSVG){
    var svg_textPath = "";
    svg_textPath += "<text";
    svg_textPath += ">";
    svg_textPath += "<textPath href="+self.quote("#"+idName_path);
    svg_textPath += ">";
    svg_textPath += text;
    svg_textPath += "</textPath>";
    svg_textPath += "</text>";
    if(hasSpace){
      _svg += self.comment(svg_textPath);
    }
    else{
      _svg += svg_textPath;
      _svg += self.rn;
    }
  }
  for(var i=0, len=text.length; i<len; ++i){
    var chari = text.charAt(i);
    var wi = ctx.measureText(chari).width;
    // character's bottom-left based
    var pt0 = path.getPointAtLength(x0);
    var pt1 = path.getPointAtLength(x0+1);
    var x = self.floor(pt0.x);
    var y = self.floor(pt0.y);
    var dx = self.floor(0);
    var dy = self.floor(spacingY);
    var t = Math.atan2(pt1.y-pt0.y, pt1.x-pt0.x);
    var r2d = 180/Math.PI;
    var deg = self.floor(t*r2d);
    var rad = deg/r2d;
    if(toSVG){
      if(hasSpace){
        var points = "";
        points += x+" "+y;
        var tr = "";
        tr += (deg)? "rotate("+deg+" "+points+") ": "";
        tr += "translate("+points+")";
        _svg += "<text";
        _svg += " transform="+self.quote(tr);
        _svg += " x="+self.quote(dx);
        _svg += " y="+self.quote(dy);
        _svg += ">";
        _svg += self.escape(chari);
        _svg += "</text>";
        _svg += self.rn;
      }
    }
    else{
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rad);
      ctx.translate(dx, dy);
      if(fillStr !== false){
        ctx.fillText(chari, 0, 0);
      }
      if(fillStr !== true){
        ctx.strokeText(chari, 0, 0);
      }
      ctx.restore();
    }
    x0 += wi+spacingX;
  }
  if(toSVG){
    _svg += self.footer_group();
  }
  ctx.restore();
  return _svg;
};
/* -> 1.0.0 */
