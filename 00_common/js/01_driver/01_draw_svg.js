// online-simulator.github.io

My_entry.draw_svg = function(ctx){
};

// instance
My_entry.draw_svg.prototype.quote = function(arg){
  var self = this;
  return "\""+arg+"\"";
};
My_entry.draw_svg.prototype.escape = function(text){
  var self = this;
  var _text = (text)? String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"): text;
  return _text;
};
My_entry.draw_svg.prototype.comment = function(arg){
  var self = this;
  return "<!-- "+arg+" -->"+"\n";
};
My_entry.draw_svg.prototype.header = function(px_w, px_h){
  var self = this;
  var _svg = "";
  var points = "0 0 "+px_w+" "+px_h;
  _svg += "<?xml"
  _svg += " version="+self.quote("1.0");
  _svg += " encoding="+self.quote("utf-8");
  _svg += "?>";
  _svg += "\n";
  _svg += "<svg";
  _svg += " version="+self.quote("1.1");
//  _svg += " id="+self.quote("");
  _svg += " xmlns="+self.quote("http://www.w3.org/2000/svg");
  _svg += " xmlns:xlink="+self.quote("http://www.w3.org/1999/xlink");
  _svg += " width="+self.quote(px_w);
  _svg += " height="+self.quote(px_h);
  _svg += " viewBox="+self.quote(points);
  _svg += ">";
  _svg += "\n";
  return _svg;
};
My_entry.draw_svg.prototype.footer = function(){
  var self = this;
  var _svg = "";
  _svg += "</svg>";
  _svg += "\n";
  return _svg;
};
/* 1.0.0 */
My_entry.draw_svg.prototype.header_group = function(idName, svg_config){
  var self = this;
  var _svg = "";
  _svg += "<g";
  _svg += (idName)? " id="+self.quote(idName): "";
  _svg += (svg_config)? svg_config: "";
  _svg += ">";
  _svg += "\n";
  return _svg;
};
My_entry.draw_svg.prototype.footer_group = function(){
  var self = this;
  var _svg = "";
  _svg += "</g>";
  _svg += "\n";
  return _svg;
};
// mix-in
My_entry.draw_svg.prototype.line = function(vec0, vec1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  if(lineWidth){
    var fillStyle = opt_styleRGBA || self.config.default.rgba;
    var strokeStyle = fillStyle;
    var x0 = self.floor(vec0.x);
    var y0 = self.floor(vec0.y);
    var x1 = self.floor(vec1.x);
    var y1 = self.floor(vec1.y);
    _svg += "<line";
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth));  // 0 enabled
    _svg += " stroke-linecap="+self.quote("round");
    _svg += " x1="+self.quote(x0);
    _svg += " y1="+self.quote(y0);
    _svg += " x2="+self.quote(x1);
    _svg += " y2="+self.quote(y1);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.lines = function(arr_vec, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  var fillStyle = opt_styleRGBA || self.config.default.rgba;
  var strokeStyle = fillStyle;
  var fillPath = opt_fillPath || false;
  var points = "";
  if(fillPath || lineWidth){
    for(var n=0, len_n=arr_vec.length; n<len_n; ++n){
      if(n > 0){
        points += " ";
      }
      var vecn = arr_vec[n];
      var x = self.floor(vecn.x);
      var y = self.floor(vecn.y);
      points += x+" "+y;
    }
  }
  // fill
  if(fillPath){
    _svg += "<polygon";
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote("none");
    _svg += " points="+self.quote(points);
    _svg += "/>";
    _svg += self.rn;
  }
  // stroke
  if(lineWidth){
    _svg += "<polyline";
    _svg += " fill="+self.quote("none");
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth));
    _svg += " stroke-linecap="+self.quote("round");  // "butt" || "round" || "square"
    _svg += " stroke-linejoin="+self.quote("round");  // "round" || "bevel" || "miter"
    _svg += " points="+self.quote(points);
    _svg += "/>";
    _svg += self.rn;  // 1.0.0
  }
  return _svg;
};
/* 1.0.0 -> */
My_entry.draw_svg.prototype.mask = function(x, y, w, h, idName){
  var self = this;
  return self.def_mask(idName, "#ffffff", x, y, w, h);
};
My_entry.draw_svg.prototype.none = function(){
  var self = this;
  var _svg = "";
  return _svg;
};
My_entry.draw_svg.prototype.def_dropShadow = function(idName, style, offsetX, offsetY, blur){
  var self = this;
  var _svg = "";
  if(blur){  // blur
    var offsetX0 = self.floor(offsetX);
    var offsetY0 = self.floor(offsetY);
    var blur0 = self.floor(blur);
    _svg += "<defs>";
    _svg += "<filter";
    _svg += " id="+self.quote(idName);
    _svg += ">";
    _svg += "<feDropShadow";
    _svg += " flood-color="+self.quote(style);
    _svg += " dx="+self.quote(offsetX0);
    _svg += " dy="+self.quote(offsetY0);
    _svg += " stdDeviation="+self.quote(blur0);
    _svg += "/>";
    _svg += "</filter>";
    _svg += "</defs>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.def_mask = function(idName, style, x, y, w, h){
  var self = this;
  var _svg = "";
  var w0 = self.floor(w);
  var h0 = self.floor(h);
  if(w0 && h0){
    var x0 = self.floor(x);
    var y0 = self.floor(y);
    _svg += "<defs>";
    _svg += "<mask";
    _svg += " id="+self.quote(idName);
    _svg += ">";
    _svg += "<rect";
    _svg += " x="+self.quote(x0);
    _svg += " y="+self.quote(y0);
    _svg += " width="+self.quote(w0);
    _svg += " height="+self.quote(h0);
    _svg += " fill="+self.quote(style);
    _svg += "/>";
    _svg += "</mask>";
    _svg += "</defs>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.use_filter = function(idName){
  var self = this;
  var _svg = "";
  _svg += " style="+self.quote("filter:url(#"+idName+")");
  return _svg;
};
My_entry.draw_svg.prototype.use_mask = function(idName){
  var self = this;
  var _svg = "";
  _svg += " style="+self.quote("mask:url(#"+idName+")");
  return _svg;
};
My_entry.draw_svg.prototype.textpath = function(){
  var self = this;
  Array.prototype.push.apply(arguments, [true]);
  return self.textpath_sw.apply(self, arguments);
};
My_entry.draw_svg.prototype.gradation = function(colors, arr_vec, opt_globalCompositeOperation, vec0, offsetR, orderR, NrandR, NrandT, isMin, isRound, Nrender, Ncycle){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  var len_n = arr_vec.length;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var Ncolor = colors.length;
  var arr_style = [];
  colors.forEach(function(color, i){
    arr_style[i] = self.rgba2style(self.color2rgba(color));
  });
  var lerp_arr_vec = function(k){
    var _arr_vec = [];
    for(var n=0; n<len_n; ++n){
      var vecn = arr_vec[n];
      var x = vecn.x;
      var y = vecn.y;
      _arr_vec[n] = {x: x0+(x-x0)*k, y: y0+(y-y0)*k};
    }
    return _arr_vec;
  };
  for(var cycle=0; cycle<Ncycle; ++cycle){
    var arr_vec0 = lerp_arr_vec(offsetR+cycle);
    for(var i=0; i<Ncolor; ++i){
      arr_vec0.reverse();
      var arr_veck = lerp_arr_vec(offsetR+(1-offsetR)*(i+1)/Ncolor+cycle);
      _svg += self.lines(arr_vec0.concat(arr_veck), 0, arr_style[i], opt_globalCompositeOperation, true);
      arr_vec0 = arr_veck;
    }
  }
  return _svg;
};
/* -> 1.0.0 */
My_entry.draw_svg.prototype.text = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  if(fontSize){
    var fillStyle = opt_styleRGBA || self.config.default.rgba;
    var strokeStyle = fillStyle;
    var x = self.floor(vec0.x);
    var y = self.floor(vec0.y);
    _svg += "<text";
    _svg += " font-family="+self.quote(fontFamily);
    _svg += " font-size="+self.quote(fontSize);
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " x="+self.quote(x);
    _svg += " y="+self.quote(y);
    _svg += ">";
    _svg += self.escape(text);
    _svg += "</text>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.label = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  if(fontSize){
    var fillStyle = opt_styleRGBA || self.config.default.rgba;
    var strokeStyle = fillStyle;
    var x0 = self.floor(vec0.x);
    var y0 = self.floor(vec0.y);
    ctx.save();
    ctx.font = fontSize+"px "+fontFamily;
    var w = ctx.measureText(text).width;
    var h = fontSize;
    var t = (isY)? -90: 0;
    var x = self.floor(-w/2);
    var y = (isY)? self.floor(h): 0;
    var points = "";
    points += x0+" "+y0;
    var tr = "";
    tr += (t)? "rotate("+t+" "+points+") ": "";
    tr += "translate("+points+")";
//    tr += " scale(1 1)";
    ctx.restore();
    _svg += "<text";
    _svg += " font-family="+self.quote(fontFamily);
    _svg += " font-size="+self.quote(fontSize);
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " transform="+self.quote(tr);
    _svg += " x="+self.quote(x);
    _svg += " y="+self.quote(y);
    _svg += ">";
    _svg += self.escape(text);
    _svg += "</text>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.axis = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  if(fontSize){
    ctx.save();
    ctx.font = fontSize+"px "+fontFamily;
    var w = ctx.measureText(text).width;
    var h = fontSize;
    var w2 = (isY)? -w-h: -w/2;
    var h2 = (isY)? h/2: h*2;
    var x = vec0.x+w2;
    var y = vec0.y+h2;
    ctx.restore();
    _svg += self.text(text, {x: x, y: y}, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation);
  }
  return _svg;
};
My_entry.draw_svg.prototype.textbox = function(text, vec0, vec1, opt_fontSize, opt_styleRGBA_bg, opt_styleRGBA_fg, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  var w = ctx.measureText(text).width;
  var dw = fontSize;
  var h = fontSize;
  var hr2 = h/2;
  ctx.restore();
  _svg += self.fill({x: vec0.x, y: vec0.y-hr2}, {x: vec1.x+w+dw, y: vec1.y+hr2}, opt_styleRGBA_bg, opt_globalCompositeOperation);
  _svg += self.text(text, {x: vec1.x+dw, y: vec1.y+hr2}, opt_fontSize, opt_styleRGBA_fg, opt_globalCompositeOperation);
  return _svg;
};
My_entry.draw_svg.prototype.fill = function(vec0, vec1, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var fillStyle = opt_styleRGBA || self.config.default.rgba;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var x1 = self.floor(vec1.x);
  var y1 = self.floor(vec1.y);
  var points = "";
  points += x0+" "+y0;
  points += " "+x1+" "+y0;
  points += " "+x1+" "+y1;
  points += " "+x0+" "+y1;
  _svg += "<polygon";
  _svg += " fill="+self.quote(fillStyle);
  _svg += " stroke="+self.quote("none");
  _svg += " points="+self.quote(points);
  _svg += "/>";
  _svg += self.rn;
  return _svg;
};
My_entry.draw_svg.prototype.circle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  if(r){
    var backgroundColor = (self.backgroundColor === 0)? self.config.default.white: self.backgroundColor;
    var fillStyle = ((lineWidth)? "none": opt_styleRGBA) || self.config.default.rgba;
    var strokeStyle = ((lineWidth)? opt_styleRGBA: backgroundColor) || self.config.default.rgba;
    var x0 = self.floor(vec0.x);
    var y0 = self.floor(vec0.y);
    var r0 = self.floor(r);
    _svg += "<circle";
    _svg += " r="+self.quote(r0);
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth || r*0.3));
    _svg += " cx="+self.quote(x0);
    _svg += " cy="+self.quote(y0);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.triangle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_flagFlipY){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  if(r){
    var backgroundColor = (self.backgroundColor === 0)? self.config.default.white: self.backgroundColor;
    var fillStyle = ((lineWidth)? "none": opt_styleRGBA) || self.config.default.rgba;
    var strokeStyle = ((lineWidth)? opt_styleRGBA: backgroundColor) || self.config.default.rgba;
    var x0 = vec0.x;
    var y0 = vec0.y;
    var k1 = 1.2091995761561452;
    var k2 = 0.5773502691896258;
    var k3 = 1.1547005383792515;
    var dx = r*k1;
    var dy = dx*k2;
    var dy2 = dx*k3;
    if(opt_flagFlipY){
      dy = -dy;
      dy2 = -dy2;
    }
    _svg += "<polygon";
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth || r*0.3));
    _svg += " stroke-linecap="+self.quote("round");
    _svg += " stroke-linejoin="+self.quote("round");
    var points = "";
    points += self.floor(x0)+" "+self.floor(y0-dy2);
    points += " "+self.floor(x0-dx)+" "+self.floor(y0+dy);
    points += " "+self.floor(x0+dx)+" "+self.floor(y0+dy);
    _svg += " points="+self.quote(points);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.triangle2 = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  return self.triangle(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, true);
};
My_entry.draw_svg.prototype.square = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  if(r){
    var backgroundColor = (self.backgroundColor === 0)? self.config.default.white: self.backgroundColor;
    var fillStyle = ((lineWidth)? "none": opt_styleRGBA) || self.config.default.rgba;
    var strokeStyle = ((lineWidth)? opt_styleRGBA: backgroundColor) || self.config.default.rgba;
    var x0 = vec0.x;
    var y0 = vec0.y;
    var dx = r*Math.sqrt(Math.PI)/2;
    var dy = dx;
    _svg += "<polygon";
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth || r*0.3));
    _svg += " stroke-linecap="+self.quote("round");
    _svg += " stroke-linejoin="+self.quote("round");
    var points = "";
    points += self.floor(x0-dx)+" "+self.floor(y0-dy);
    points += " "+self.floor(x0+dx)+" "+self.floor(y0-dy);
    points += " "+self.floor(x0+dx)+" "+self.floor(y0+dy);
    points += " "+self.floor(x0-dx)+" "+self.floor(y0+dy);
    _svg += " points="+self.quote(points);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.diamond = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  if(r){
    var backgroundColor = (self.backgroundColor === 0)? self.config.default.white: self.backgroundColor;
    var fillStyle = ((lineWidth)? "none": opt_styleRGBA) || self.config.default.rgba;
    var strokeStyle = ((lineWidth)? opt_styleRGBA: backgroundColor) || self.config.default.rgba;
    var x0 = vec0.x;
    var y0 = vec0.y;
    var dx = r*Math.sqrt(Math.PI)/2;
    var dy = dx;
    var rad = Math.PI/4;
    _svg += "<polygon";
    _svg += " fill="+self.quote(fillStyle);
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth || r*0.3));
    _svg += " stroke-linecap="+self.quote("round");
    _svg += " stroke-linejoin="+self.quote("round");
    var points = "";
    var vec = self.rotate2d_vec({x: -dx, y: -dy}, rad);
    points += self.floor(x0+vec.x)+" "+self.floor(y0+vec.y);
    var vec = self.rotate2d_vec({x: +dx, y: -dy}, rad);
    points += " "+self.floor(x0+vec.x)+" "+self.floor(y0+vec.y);
    var vec = self.rotate2d_vec({x: +dx, y: +dy}, rad);
    points += " "+self.floor(x0+vec.x)+" "+self.floor(y0+vec.y);
    var vec = self.rotate2d_vec({x: -dx, y: +dy}, rad);
    points += " "+self.floor(x0+vec.x)+" "+self.floor(y0+vec.y);
    _svg += " points="+self.quote(points);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
My_entry.draw_svg.prototype.cross = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var _svg = "";
  var lineWidth = opt_lineWidth;
  if(r){
    var strokeStyle = opt_styleRGBA || self.config.default.rgba;
    var x0 = vec0.x;
    var y0 = vec0.y;
    var dx = r*Math.sqrt(Math.PI)/2;
    var dy = dx;
    _svg += "<path";
    _svg += " fill="+self.quote("none");
    _svg += " stroke="+self.quote(strokeStyle);
    _svg += " stroke-width="+self.quote(self.floor(lineWidth || self.floor(r/3)+1));
    _svg += " stroke-linecap="+self.quote("round");
    _svg += " stroke-linejoin="+self.quote("round");
    var d = "";
    d += "M";
    d += " "+self.floor(x0-dx)+" "+self.floor(y0-dy);
    d += " L";
    d += " "+self.floor(x0+dx)+" "+self.floor(y0+dy);
    d += " Z";
    d += " M";
    d += " "+self.floor(x0+dx)+" "+self.floor(y0-dy);
    d += " L";
    d += " "+self.floor(x0-dx)+" "+self.floor(y0+dy);
    d += " Z";
    _svg += " d="+self.quote(d);
    _svg += "/>";
    _svg += self.rn;
  }
  return _svg;
};
