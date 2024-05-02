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
/* 1.37.8 */
My_entry.draw_svg.prototype.pen = function(idName, arr_data, options){
  var self = this;
  var sw_method = "";
  if(arr_data.ID){
    sw_method = "_mosaic";
  }
  else if(arr_data.ID_map){
    sw_method = "_bucket";
  }
  return self["lines_pen"+sw_method].apply(self, arguments);
};
/* 1.25.7 */
My_entry.draw_svg.prototype.lines_pen = function(idName, arr_data, options){
  var self = this;
  var _svg = "";
  var config = "";
  /* 1.41.8 -> */
  var isSpecial = !(arr_data.length);
  var hasStyle = (options.strokeStyle && options.fillStyle);
  /* 1.26.7 -> */
  if(options.sh){
    var idName_sh = idName+"_sh";
    var sh = Math.abs(options.sh);
    var shadowColor = (isSpecial && hasStyle)? options.strokeStyle: options.RGB;
    var shadowBlur = (isSpecial)? (options.blur || sh): sh;
    _svg += self.def_dropShadow(idName_sh, shadowColor, 0, 0, shadowBlur);  // 1.36.8
    config += self.use_filter(idName_sh);
  }
  /* -> 1.26.7 */
  /* -> 1.41.8 */
  config += " fill="+self.quote(options.RGB);  // 1.27.7
  config += " stroke="+self.quote(options.RGB);
  /* 1.29.7 -> */
  var alpha = self.floor(Math.abs(options.A))/100;
  var svg_alpha = " opacity="+self.quote(alpha);
  if(options.A < 0){
    config += svg_alpha;
    svg_alpha = "";
  }
  /* -> 1.29.7 */
  config += " stroke-linecap="+self.quote(options.cap);
/* 1.36.8 -> */
  var len_sh = (options.sh < 0)? Math.min(100, -options.sh): 0;
for(var nsh=0; nsh<len_sh+1; ++nsh){
  _svg += self.header_group(idName, config);
  /* 1.35.8 -> */
  /* Ver.1.54.10 -> */
  /* 1.28.7 -> */
//  var ox = options.ox;
//  var oy = options.oy;
  var ox = 0;
  var oy = 0;
  /* -> 1.28.7 */
  /* -> Ver.1.54.10 */
  /* 1.41.8 -> */
  if(arr_data.cx){
    var cx = self.floor(arr_data.cx+ox);
    var cy = self.floor(arr_data.cy+oy);
    var r = self.floor(arr_data.r);
    _svg += "<circle";
    if(hasStyle){
      _svg += " fill="+self.quote(options.fillStyle);
      _svg += (options.lineWidth)? " stroke-width="+self.quote(options.lineWidth || 1): "";
    }
    _svg += " stroke="+self.quote((hasStyle)? options.strokeStyle: "none");
    _svg += (hasStyle)? "": svg_alpha;
    _svg += " cx="+self.quote(cx);
    _svg += " cy="+self.quote(cy);
    _svg += " r="+self.quote(r);
    _svg += "/>";
    _svg += self.rn;
  }
  else if(arr_data.x){
    var x = self.floor(arr_data.x+ox);
    var y = self.floor(arr_data.y+oy);
    var width = self.floor(arr_data.width);
    var height = self.floor(arr_data.height);
    _svg += "<rect";
    if(hasStyle){
      _svg += " fill="+self.quote(options.fillStyle);
      _svg += (options.lineWidth)? " stroke-width="+self.quote(options.lineWidth || 1): "";
    }
    _svg += " stroke="+self.quote((hasStyle)? options.strokeStyle: "none");
    _svg += (hasStyle)? "": svg_alpha;
    _svg += " x="+self.quote(x);
    _svg += " y="+self.quote(y);
    _svg += " width="+self.quote(width);
    _svg += " height="+self.quote(height);
    _svg += "/>";
    _svg += self.rn;
  }
  /* -> 1.41.8 */
  /* 1.44.8 -> */
  for(var n=0, len_n=arr_data.length || 0; n<len_n; ++n){
  /* -> 1.35.8 */
    var data = arr_data[n];
    var vec0 = data.xy0;
    var vec1 = data.xy1;
    var x0 = vec0.x;
    var y0 = vec0.y;
    var x1 = vec1.x;
    var y1 = vec1.y;
    var dx = x1-x0;
    var dy = y1-y0;
    var len = Math.sqrt(dx*dx+dy*dy);
  /* 1.27.7 -> */
    var w0 = data.w0;
    var w1 = data.w1;
  if(Math.min(w0, w1) < options.w_th){
    var xym0 = data.xym0;
    var xyp0 = data.xyp0;
    var xym1 = data.xym1;
    var xyp1 = data.xyp1;
    var points = "";
    points += self.floor(xym0.x+ox)+" "+self.floor(xym0.y+oy);
    points += " ";
    points += self.floor(xyp0.x+ox)+" "+self.floor(xyp0.y+oy);
    points += " ";
    points += self.floor(xyp1.x+ox)+" "+self.floor(xyp1.y+oy);
    points += " ";
    points += self.floor(xym1.x+ox)+" "+self.floor(xym1.y+oy);
    _svg += "<polyline";
    _svg += svg_alpha;  // 1.29.7
    _svg += " stroke-width="+self.quote(0);
    _svg += " points="+self.quote(points);
    _svg += "/>";
  }
  else{
    var len_p = Math.ceil(len/options.dlen);
    var dw01 = (w1-w0)/len_p;
    var dx01 = (x1-x0)/len_p;
    var dy01 = (y1-y0)/len_p;
    /* pen-Ver.1.64.12 -> */
    for(var p=0; p<len_p; ++p){
//      if(p > 0) _svg += self.rn;
      _svg += "<line";
      _svg += svg_alpha;  // 1.29.7
      var wp = w0+dw01*p;
      var xp = x0+dx01*p;
      var yp = y0+dy01*p;
      _svg += " stroke-width="+self.quote(Math.max(0, self.floor(wp+dw01)));  // Ver.1.68.12 w>=0
      _svg += " x1="+self.quote(self.floor(xp+ox));
      _svg += " y1="+self.quote(self.floor(yp+oy));
      _svg += " x2="+self.quote(self.floor(xp+dx01+ox));
      _svg += " y2="+self.quote(self.floor(yp+dy01+oy));
      _svg += "/>";
    }
    /* -> pen-Ver.1.64.12 */
  }
  /* -> 1.27.7 */
    _svg += self.rn;
  }
  /* -> 1.44.8 */
  _svg += self.footer_group();
}
/* -> 1.36.8 */
  return _svg;
};
/* 1.33.8 */
My_entry.draw_svg.prototype.lines_pen_mosaic = function(idName, arr_data, options){  // 1.37.8
  var self = this;
  var _svg = "";
  var config = "";
  var ID = arr_data.ID;  // 1.37.8
  var data = ID.data;
  var px_w = ID.width;
  var px_h = ID.height;
  var dx = options["grid-width"];
  var dy = options["grid-height"];
  var rdx = Math.round(dx);
  var rdy = Math.round(dy);
  var hasArea = (rdx > 0 && rdy > 0);
  _svg += self.header_group(idName, config);
  if(hasArea){
    /* 1.46.8 -> */
    var Ni = Math.ceil(px_w/rdx);
    var Nj = Math.ceil(px_h/rdy);
    for(var j=0; j<Nj; ++j){
      for(var i=0; i<Ni; ++i){
    /* -> 1.46.8 */
        var xs = rdx*i;
        var ys = rdy*j;
        var ired = 4*(px_w*ys+xs);
        var r = data[ired+0];
        var g = data[ired+1];
        var b = data[ired+2];
        var a = data[ired+3];
        if(r+g+b+a){
          _svg += "<rect";
          _svg += " x="+self.quote(xs);
          _svg += " y="+self.quote(ys);
          _svg += " width="+self.quote(rdx);
          _svg += " height="+self.quote(rdy);
          _svg += " fill="+self.quote(self.rgba2style({r: r, g: g, b: b, a: a}));
          _svg += "/>";
          _svg += self.rn;
        }
      }
    }
  }
  _svg += self.footer_group();
  return _svg;
};
/* 1.37.8 */
My_entry.draw_svg.prototype.lines_pen_bucket = function(idName, arr_data, options){
  var self = this;
  var _svg = "";
  var config = "";
  var ID = arr_data.ID_map;
  var data = ID.data;
  var px_w = ID.width;
  var px_h = ID.height;
  config += " fill="+self.quote(options.RGB);
  config += " stroke="+self.quote("none");
  var alpha = self.floor(Math.abs(options.A))/100;
  config += " opacity="+self.quote(alpha);
  _svg += self.header_group(idName, config);
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var sw_on = data[ired+0];
      if(sw_on){
        for(var ii=i+1; ii<px_w; ++ii){
          var iired = 4*(px_w*j+ii);
          var sw_off = !(data[iired+0]);
          if(sw_off){
            break;
          }
        }
        var w = ii-i;
        _svg += "<rect";
        _svg += " x="+self.quote(i);
        _svg += " y="+self.quote(j);
        _svg += " width="+self.quote(w);
        _svg += " height="+self.quote(1);
        _svg += "/>";
        _svg += self.rn;
        i += w;
      }
    }
  }
  _svg += self.footer_group();
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
/* 1.10.6 -> */
My_entry.draw_svg.prototype.transform = function(a, b, c, d, e, f){
  var self = this;
  var _svg = "";
  var mat = "matrix";
  mat += "("+self.floor(a);
  mat += " "+self.floor(b);
  mat += " "+self.floor(c);
  mat += " "+self.floor(d);
  mat += " "+self.floor(e);
  mat += " "+self.floor(f);
  mat += ")";
  _svg += " transform="+self.quote(mat);
  return _svg;
};
/* -> 1.10.6 */
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
  /* 1.26.7 -> */
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  /* -> 1.26.7 */
  if(blur){  // blur
    var offsetX0 = self.floor(offsetX);
    var offsetY0 = self.floor(offsetY);
    var blur0 = self.floor(blur);
    _svg += "<defs>";
    _svg += "<filter";
    _svg += " id="+self.quote(idName);
    /* 1.26.7 -> */
    _svg += " x="+self.quote(-px_w);
    _svg += " y="+self.quote(-px_h);
    _svg += " width="+self.quote(px_w*2);
    _svg += " height="+self.quote(px_h*2);
    /* -> 1.26.7 */
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
/* 1.15.7 */
My_entry.draw_svg.prototype.def_mask_style = function(idName, style){
  var self = this;
  var _svg = "";
  if(style){
    _svg += "<defs>";
    _svg += "<mask";
    _svg += " id="+self.quote(idName);
    _svg += ">";
    _svg += style;
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
  /* 1.12.6 -> */
if(Ncycle){
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
}
else{
  var pi2 = Math.PI*2;
  var N = NrandT || 10;
  var lerp_arr_vec = function(k){
    var _arr_vec = [];
    var rad = k*pi2;
    for(var n=0; n<len_n; ++n){
      var vecn = arr_vec[n];
      var x = vecn.x;
      var y = vecn.y;
      var xb = x-x0;
      var yb = y-y0;
      var xa = +Math.cos(rad)*xb+Math.sin(rad)*yb;
      var ya = -Math.sin(rad)*xb+Math.cos(rad)*yb;
      var xp = x0+xa;
      var yp = y0+ya;
      _arr_vec[n] = {x: xp, y: yp};
    }
    return _arr_vec;
  };
  var arr_vec0 = lerp_arr_vec(offsetR);
  for(var i=0; i<Ncolor; ++i){
    for(var n=0; n<N; ++n){
      arr_vec0.reverse();
      var di = (n+1)/N;
      var arr_veck = lerp_arr_vec(offsetR+(1-offsetR)*(i+di)/Ncolor);
      _svg += self.lines(arr_vec0.concat(arr_veck), 0, arr_style[i], opt_globalCompositeOperation, true);
      arr_vec0 = arr_veck;
    }
  }
}
  /* -> 1.12.6 */
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
