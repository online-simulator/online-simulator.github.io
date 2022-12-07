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
/* 1.34.8 */
My_entry.draw.prototype.rgba2color_hex = function(rgba){
  var self = this;
  var conv = new My_entry.conv();
  var r_hex = conv.dec2n(rgba.r, 16);
  var g_hex = conv.dec2n(rgba.g, 16);
  var b_hex = conv.dec2n(rgba.b, 16);
  var a_hex = conv.dec2n(rgba.a, 16);
  if(r_hex.length === 1){
    r_hex = "0"+r_hex;
  }
  if(g_hex.length === 1){
    g_hex = "0"+g_hex;
  }
  if(b_hex.length === 1){
    b_hex = "0"+b_hex;
  }
  if(a_hex.length === 1){
    a_hex = "0"+a_hex;
  }
  return "#"+r_hex+g_hex+b_hex+a_hex;
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
        r = hex.substring(0, 1);
        g = hex.substring(1, 2);
        b = hex.substring(2, 3);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = 255;
      }
      else if(len === 4){
        r = hex.substring(0, 1);
        g = hex.substring(1, 2);
        b = hex.substring(2, 3);
        a = hex.substring(3, 4);
        r = self.hex2dec(r+r);
        g = self.hex2dec(g+g);
        b = self.hex2dec(b+b);
        a = self.hex2dec(a+a);
      }
      else if(len === 6){
        r = hex.substring(0, 2);
        g = hex.substring(2, 4);
        b = hex.substring(4, 6);
        r = self.hex2dec(r);
        g = self.hex2dec(g);
        b = self.hex2dec(b);
        a = 255;
      }
      else if(len === 8){
        r = hex.substring(0, 2);
        g = hex.substring(2, 4);
        b = hex.substring(4, 6);
        a = hex.substring(6, 8);
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
/* 1.3.4 -> */
My_entry.draw.prototype.rgb2hsv = function(arr, opt_k, opt_isConical){
  var self = this;
  var k = opt_k || 1;
  var r = arr[0]/k;
  var g = arr[1]/k;
  var b = arr[2]/k;
  var min = Math.min.apply(Math, [r, g, b]);
  var max = Math.max.apply(Math, [r, g, b]);
  var c = max-min;
  var v = max;
  var s = (v)? ((opt_isConical)? c: c/v): 0;  // not0
  var h = 0;
  if(c){  // not0
    if(max === r){
      h = (g-b)/c+0;  // [-1,1]
      h = (h+6)%6;    // [0,1][5,6)  // 0 -> 0
    }
    else if(max === g){
      h = (b-r)/c+2;  // [1,3]
    }
    else{
      h = (r-g)/c+4;  // [3,5]
    }
    h /= 6;           // [0,1)
  }
  return [h*k, s*k, v*k];
};
My_entry.draw.prototype.hsv2rgb = function(arr, opt_k, opt_isConical){
  var self = this;
  var k = opt_k || 1;
  var h = arr[0]/k;
  var s = arr[1]/k;
  var v = arr[2]/k;
  var c = (opt_isConical)? s: v*s;
  var m = v-c;
  var r = 0;
  var g = 0;
  var b = 0;
  if(c){  // not0
    var h6 = h*6;
    var x = c*(1-Math.abs(h6%2-1));
    switch(Math.ceil(h6)){
      case 0:
      case 1:
        r = c;
        g = x;
        break;
      case 2:
        r = x;
        g = c;
        break;
      case 3:
        g = c;
        b = x;
        break;
      case 4:
        g = x;
        b = c;
        break;
      case 5:
        b = c;
        r = x;
        break;
      case 6:
        b = x;
        r = c;
        break;
      default:
        break;
    }
  }
  r += m;
  g += m;
  b += m;
  return [r*k, g*k, b*k];
};
/* -> 1.3.4 */
/* 0.6.0 -> */
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
/* 1.40.8 */
My_entry.draw.prototype.flip_rgb2style = function(color, opt_a){
  var self = this;
  var rgba = self.color2rgba(color);
  var rgb_flip = {r: 255-rgba.r, g: 255-rgba.g, b: 255-rgba.b, a: opt_a || rgba.a};
  return self.rgba2style(rgb_flip);
};
My_entry.draw.prototype.rotate2d_vec = function(vec, t){
  var self = this;
  var cos_t = Math.cos(t);
  var sin_t = Math.sin(t);
  return {x: vec.x*(cos_t)-vec.y*(sin_t), y: vec.x*(sin_t)+vec.y*(cos_t)};
//  return {x: vec.x*(cos_t)+vec.y*(sin_t), y: vec.x*(-sin_t)+vec.y*(cos_t)};
};
/* 1.38.8 -> */
My_entry.draw.prototype.xy2xy_snapped = function(xy, dxy, opt_sw_round){
  var x = xy.x;
  var y = xy.y;
  var dx = dxy.x;
  var dy = dxy.y;
  var sw_round = opt_sw_round || "round";
  return {x: Math[sw_round](x/dx)*dx, y: Math[sw_round](y/dy)*dy};
};
My_entry.draw.prototype.marker_circle = function(vec, lineWidth, r, strokeStyle, fillStyle){
  var self = this;
  var ctx = self.ctx;
  ctx.save();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle  = self.color2style(strokeStyle);
  ctx.fillStyle  = self.color2style(fillStyle);
  ctx.globalAlpha = 0.5;
  var x = self.floor(vec.x);
  var y = self.floor(vec.y);
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI*2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  return self;
};
/* -> 1.38.8 */
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
My_entry.draw.prototype.textpath_sw = function(text, arr_vec, opt_globalCompositeOperation, j, opt_fontFamily, opt_fontSize, isBold, isItalic, isReverse, opt_styleRGBA_bg, opt_styleRGBA_fg, fillStr, spacingX, spacingY, offsetX, offsetY, blur, deg0, toSVG){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  var style_path = self.get_path(arr_vec, isReverse);
  path.setAttribute("d", style_path);
  var hasSpace = (spacingX || spacingY);
  var r2d = 180/Math.PI;
  var t0 = (hasSpace)? deg0/r2d: 0;
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
    var pt1 = path.getPointAtLength(x0+wi);
    var x = self.floor(pt0.x);
    var y = self.floor(pt0.y);
    var dx = self.floor(0);
    var dy = self.floor(spacingY);
    var t = t0 || Math.atan2(pt1.y-pt0.y, pt1.x-pt0.x);
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
/* 1.49.8 */
My_entry.draw.prototype.uvp = function(uvp){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  if(uvp){
    var u = uvp.u;
    var v = uvp.v;
    var p = uvp.p;
    var id = uvp.id;
    var Ni = uvp.Ni;
    var Nj = uvp.Nj;
    var dx = px_w/Ni;
    var dy = px_h/Nj;
    var dh = Math.min(dx, dy);
    var umin = 1e10;
    var vmin = 1e10;
    var pmin = 1e10;
    var umax = -1e10;
    var vmax = -1e10;
    var pmax = -1e10;
    var avmax = 0;
    for(var j=0; j<Nj; ++j){
      for(var i=0; i<Ni; ++i){
        var uij = u[i][j];
        var vij = v[i][j];
        var pij = p[i][j];
        var nij = id[i][j];
        if(nij){
          var av = Math.sqrt(uij*uij+vij*vij);
          if(uij < umin) umin = uij;
          if(vij < vmin) vmin = vij;
          if(pij < pmin) pmin = pij;
          if(uij > umax) umax = uij;
          if(vij > vmax) vmax = vij;
          if(pij > pmax) pmax = pij;
          if(av > avmax) avmax = av;
        }
      }
    }
    var pi2 = Math.PI*2;
    var rad15 = 15*Math.PI/180;
    var draw_arrow = function(xs, ys, xe, ye, p){
      var dx = xe-xs;
      var dy = ye-ys;
      /* fluid-Ver.1.15.0 -> */
      /* 1.52.8 -> */
      var k_arrow = uvp._k_arrow;
      var ak_arrow = Math.abs(k_arrow);
      dx *= ak_arrow;
      dy *= ak_arrow;
      if(k_arrow > 0){
        xe = xs+dx;
        ye = ys+dy;
      }
      /* -> 1.52.8 */
      /* -> fluid-Ver.1.15.0 */
      var k = 0.5;
      var dlen = Math.sqrt(dx*dx+dy*dy)*k;
      var t = Math.atan2(dy, dx);
      var pn = (p-pmin)/(pmax-pmin);
      var r255 = 0;
      var g255 = 0;
      var b255 = 0;
      if(pmax-pmin === 0){  // fluid-Ver.1.12.0
      }
      else if(pn < 1/3){
        g255 = 255*pn*3;
        b255 = 255;
      }
      else if(pn < 2/3){
        r255 = 255*(pn-1/3)*3;
        g255 = 255;
      }
      else{
        r255 = 255;
        g255 = 255*(1-pn)*3;
      }
      var strokeStyle = "rgb("+r255+","+g255+","+b255+")";
      var xem = xe-Math.cos(t-rad15)*dlen;
      var yem = ye-Math.sin(t-rad15)*dlen;
      var xep = xe-Math.cos(t+rad15)*dlen;
      var yep = ye-Math.sin(t+rad15)*dlen;
      ctx.strokeStyle = strokeStyle;
      ctx.beginPath();
      ctx.moveTo(xs, ys);
      ctx.lineTo(xe, ye);
      ctx.lineTo(xem, yem);
      ctx.moveTo(xe, ye);
      ctx.lineTo(xep, yep);
      ctx.moveTo(xem, yem);
      ctx.lineTo(xep, yep);
      ctx.stroke();
      var draw_line = function(xs, ys, xe, ye){
        var _svg = "";
        _svg += "<line";
        _svg += " x1="+self.quote(self.floor(xs));
        _svg += " y1="+self.quote(self.floor(ys));
        _svg += " x2="+self.quote(self.floor(xe));
        _svg += " y2="+self.quote(self.floor(ye));
        _svg += "/>";
        return _svg;
      };
      var svg_config = "";
      svg_config += " stroke="+self.quote(strokeStyle);
      svg_config += " stroke-width="+self.quote(1);
      _svg += self.header_group(null, svg_config);
      _svg += draw_line(xs, ys, xe, ye);
      _svg += draw_line(xe, ye, xem, yem);
      _svg += draw_line(xe, ye, xep, yep);
      _svg += draw_line(xem, yem, xep, yep);
      _svg += self.rn;
      _svg += self.footer_group();
    };
    ctx.save();
    for(var i=0; i<Ni; ++i){
      var xo = (0.5+i)*dx;
      for(var j=0; j<Nj; ++j){
        var yo = (0.5+j)*dy;
        var uij = u[i][j];
        var vij = v[i][j];
        var pij = p[i][j];
        if(uij || vij){
          var dxij = dh*uij/(avmax || 1);  // || not0
          var dyij = dh*vij/(avmax || 1);  // || not0
          draw_arrow(xo, yo, xo+dxij, yo+dyij, pij);
        }
      }
    }
    ctx.restore();
  }
  return _svg;
};
