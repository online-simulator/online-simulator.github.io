// online-simulator.github.io

My_entry.pen = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.pen, My_entry.original_main);

/* Ver.1.29.7 */
My_entry.pen.prototype.init = function(){
  var self = this;
  self.isLocked = false;  // Ver.1.21.5
  self.isRunning = false;  // Ver.1.29.7
  self.isSaved = false;  // Ver.1.24.7
  self.isDragging = false;
  self.objs = {};
  self.options = {};
  self.arr_vec = [];  // Ver.1.35.7
  self.keys = {modes_pen: {}, modes: {}, buttons: {}, inputs: {}};  // Ver.1.15.4  // Ver.1.16.4  // Ver.1.19.4  // Ver.1.34.7  // Ver.1.38.7
  self.init_main.call(self, ["$", "conv", "def"]);
  self.filter = new self.constructors.filter();  // Ver.1.17.4
  return self;
};
/* Ver.1.16.4 */
My_entry.pen.prototype.init_keys = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var keys = self.keys;
  var modes_pen = keys.modes_pen;  // Ver.1.34.7
  var modes = keys.modes;
  var buttons = keys.buttons;
  var inputs = keys.inputs;
  /* Ver.1.19.4 -> */
  self.mode = 0;
  ["eraser_A100", "eraser"].forEach(function(id, i){
    modes_pen[id] = options[id] || ["KeyF", "KeyR"][i];  // Ver.1.34.7
  });
  ["bucket", "circle", "rectangle", "picker"].forEach(function(id, i){
    modes[id] = options[id] || ["KeyB", "KeyG", "KeyT", "KeyY"][i];  // Ver.1.31.7
  });
  ["<<", ">>", "clear", "run", "draw", "put", "blur"].forEach(function(id, i){
    buttons[id] = options[id] || ["KeyS", "KeyD", "KeyA", "KeyW", "KeyE", "Digit3", "Digit2"][i];  // Ver.1.17.4  // Ver.1.35.7  // Ver.1.42.8  // Ver.1.44.8
  });
  ["checkbox-config", "checkbox-snap"].forEach(function(id, i){
    inputs[id] = options[id] || ["KeyP", "KeyO"][i];  // Ver.1.38.7
  });
  /* Ver.1.15.4 -> */
  document.onkeydown = function(e){
    if(self.isLocked) return false;  // Ver.1.29.7
    keys.code = e.code;
    keys.keyCode = e.keyCode;
    keys.ctrlKey = e.ctrlKey;
    keys.shiftKey = e.shiftKey;
    /* Ver.1.22.6 -> */
    var aElem = document.activeElement;
    var TAG = (aElem)? aElem.tagName.toUpperCase(): "";
    /* -> Ver.1.22.6 */
    var isNG_fire = (self.mode || e.ctrlKey || e.shiftKey || TAG === "INPUT" || TAG === "SELECT");  // Ver.1.21.5  // Ver.1.29.7
    if(!(isNG_fire)){
      var mode = 0;
      /* Ver.1.34.7 */
      Object.keys(modes_pen).forEach(function(id, i){
        if(modes_pen[id] == e.code){  // Ver.1.34.7 ==
          mode = -(i+1);
        }
      });
      Object.keys(modes).forEach(function(id, i){
        if(modes[id] == e.code){  // Ver.1.34.7 ==
          mode = i+1;
        }
      });
      Object.keys(buttons).forEach(function(id){
        if(buttons[id] == e.code){  // Ver.1.34.7 ==
          var elem = $._id(id);
          if(elem){
            elem.onclick(e);
          }
        }
      });
      /* Ver.1.38.7 */
      Object.keys(inputs).forEach(function(id){
        if(inputs[id] == e.code){
          var elem = $._id(id);
          if(elem){
            var TYPE = elem.type.toUpperCase();
            if(TYPE === "CHECKBOX"){
              elem.checked = !(elem.checked);
            }
            elem.onchange(e);
          }
        }
      });
      self.mode = mode;
    }
  };
  /* Ver.1.17.4 */
  document.onkeyup = function(e){
    if(self.isLocked) return false;  // Ver.1.29.7
    keys.code = e.code;
    keys.keyCode = e.keyCode;
    keys.ctrlKey = e.ctrlKey;
    keys.shiftKey = e.shiftKey;
    self.mode = 0;
  };
  /* -> Ver.1.15.4 */
  /* -> Ver.1.19.4 */
  return self;
};
My_entry.pen.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
/* Ver.1.44.8 */
/* Ver.1.43.8 */
/* Ver.1.35.7 */
My_entry.pen.prototype.update_options = function(){
  var self = this;
  var $ = self.entry.$;
  var def = self.entry.def;
  var options = self.options;
  var fg = self.objs.fg;
  $.get_elemProps("input[type='checkbox']", "checkbox-", "checked", self.options);
  $.get_elemProps("input[type='color']", "input-", "value", self.options);
  $.get_elemProps("input[type='number']", "input-", "value", self.options);
  $.get_elemProps("select", "select-", "value", self.options);
  $.get_urlParams(self.options, true, "?"+$._id("input-third-url-parameters").value);  // Ver.1.42.8
  $.get_urlParams(self.options, true, "?"+$._id("input-second-url-parameters").value);  // "?" first  // Ver.1.39.7
  $.get_urlParams(self.options);
  if(fg){
    var rgba = fg.draw.color2rgba(options.RGB);
    var alpha = Math.abs(options.A)/100;  // Ver.1.30.7
    rgba.a = Math.round(255*alpha);  // round(float)@ID -> 0~255
    var sh = Math.abs(options.sh);  // Ver.1.21.4
    options._rgba = rgba;
    options._alpha = alpha;
    options._sh = sh;
    options._color_hex = fg.draw.rgba2color_hex(rgba);
    options._color_rgba = "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+alpha+")";
    /* 1.45.8 -> */
    options["canvas-width"] = def.limit(options["canvas-width"], 16, 2560, 512);
    options["canvas-height"] = def.limit(options["canvas-height"], 16, 2560, 512);
    /* -> 1.45.8 */
    /* Ver.1.49.9 -> */
    options["canvas-width"] = Math.floor(options["canvas-width"]);
    options["canvas-height"] = Math.floor(options["canvas-height"]);
    options["grid-width"] = Math.floor(options["grid-width"]);
    options["grid-height"] = Math.floor(options["grid-height"]);
    /* -> Ver.1.49.9 */
    options.dlen = def.limit(options.dlen, 1, 2560, 5);  // Ver.1.46.8 for direct-input
    options.x0 = def.limit(options.x0, 0, fg.px_w, fg.px_w/2);
    options.y0 = def.limit(options.y0, 0, fg.px_h, fg.px_h/2);
    options.offsetR = def.limit(options.offsetR, 0, 1, 0);
    options.orderR = def.limit(options.orderR, 0, 10, 1);
    options.NrandR = def.limit(Math.floor(options.NrandR), 0, 255, 0);
    options.NrandT = def.limit(Math.floor(options.NrandT), 0, 255, 0);
    options.isMin = def.limit(options.isMin, -10, 10, true);
    options.isRound = def.limit(options.isRound, -10, 10, true);
    options.Nrender = def.limit(Math.floor(options.Nrender), 1, 32767, 2560);
    options.Ncycle = def.limit(Math.floor(options.Ncycle), 0, 127, 1);
    options.isCyclic = def.limit(options.isCyclic, -10, 10, true);
    options.isSquare = def.limit(options.isSquare, -10, 10, true);
    options.x_asym = (isNaN(options.x_asym))? 0: Number(options.x_asym);
    options.y_asym = (isNaN(options.y_asym))? 0: Number(options.y_asym);
    options.k_asym = (isNaN(options.k_asym))? 0: Number(options.k_asym);
    options.Nrad_asym = (isNaN(options.Nrad_asym))? 0: Number(options.Nrad_asym);
  }
  return self;
};
/* Ver.1.21.4 */
My_entry.pen.prototype.show_fileSize_svg = function(){
  var self = this;
  var _i_header = -1;
  var $ = self.entry.$;
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  var fileSize = 0;
  for(var i=len-1; i>=0; --i){
    var revi = rev[i];
    fileSize += revi.length;
    if(revi.substring(0, 5) === "<?xml"){
      _i_header = i;
      break;
    }
  }
  $._id("span-fileSize-svg").innerText = "<"+Math.ceil(fileSize/1e6)+"MB";
  return _i_header;
};
/* Ver.1.2.0 -> */
My_entry.pen.prototype.make_svg = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // Ver.1.7.1
  var _svg = "";
  var fg = self.objs.fg;
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  var i_header = self.show_fileSize_svg();  // Ver.1.21.4
  if(i_header >= 0){
    for(var i=i_header; i<len; ++i){
      var revi = rev[i];  // Ver.1.21.4
      _svg += revi;
    }
    _svg += fg.draw.footer();
  }
  return _svg;
};
My_entry.pen.prototype.make_svg_header = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // Ver.1.7.1
  var _svg = "";
  var options = self.options;
  var fg = self.objs.fg;
  _svg += fg.draw.header(fg.px_w, fg.px_h);
  _svg += fg.draw.comment(My_entry.VERSION);
  _svg += fg.fill(options.bgcolor);
  return _svg;
};
My_entry.pen.prototype.make_svg_lines = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // Ver.1.7.1
  var _svg = "";
  var options = self.options;
  var fg = self.objs.fg;
  /* Ver.1.3.0 -> */
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  _svg += fg.draw.pen("id"+(len-1), self.arr_data, options);  // Ver.1.12.4  // Ver.1.26.7
  /* -> Ver.1.3.0 */
  return _svg;
};
/* -> Ver.1.2.0 */
/* Ver.1.11.4 */
My_entry.pen.prototype.change_size = function(px_w, px_h){
  var self = this;
  var $ = self.entry.$;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // Ver.1.10.2
  var bg = self.objs.bg;  // Ver.1.7.1
  $.set_id("div-canvas", "width", (1+px_w+1)+"px");  // Ver.1.10.3
  $.set_id("div-canvas", "height", (1+px_h+1)+"px");
  fg.change_size(px_w, px_h);
  mg.change_size(px_w, px_h);  // Ver.1.10.2
  bg.change_size(px_w, px_h);
  return self;
};
My_entry.pen.prototype.reset_canvas = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);  // Ver.1.7.1
  var $ = self.entry.$;
  var options = self.options;
  /* Ver.1.7.1 -> */
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // Ver.1.10.2
  var bg = self.objs.bg;  // Ver.1.7.1
  var px_w = options["canvas-width"];
  var px_h = options["canvas-height"];
  var bgcolor = options.bgcolor;
  self.change_size(px_w, px_h);  // Ver.1.11.4
  if(bgcolor){
    bg.fill(bgcolor);
  }
  else{
    bg.clear();
  }
  self.handler_history_ID.save(bg.getID());  // Ver.1.1.0
  fg.clear();
  /* -> Ver.1.7.1 */
  self.handler_history_svg.save(self.make_svg_header());  // Ver.1.2.0
  $._id("input-file-fg").value = null;  // Ver.1.11.4
  $._id("input-file-bg").value = null;  // Ver.1.8.1
  self.reset_canvas_grid();  // Ver.1.10.2
  return self;
};
/* Ver.1.10.2 */
My_entry.pen.prototype.reset_canvas_grid = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);
  var options = self.options;
  var mg = self.objs.mg;
  mg.clear();
  /* Ver.1.48.8 -> */
  /* Ver.1.37.7 -> */
  var px_w = options["canvas-width"];
  var px_h = options["canvas-height"];
  var dxg = options["grid-width"];
  var dyg = options["grid-height"];
  var hasGrid = (dxg > 0 && dyg > 0);
  if(hasGrid){
    var rgba = mg.draw.color2rgba(options.bgcolor);
    var gridWidth = options.gridWidth || 0.5;
    var gridColor = options.gridColor || ((rgba.a > 255/2 && rgba.r+rgba.g+rgba.b < 255*3/2)? "#ffffff55": "#00000033");
    mg.ctx.save();
    mg.draw_lines_grid(dxg, dyg, gridWidth, gridColor);  // Ver.1.10.4
    mg.draw.line({x: 0, y: px_h/2}, {x: px_w, y: px_h/2}, gridWidth, gridColor);
    mg.draw.line({x: px_w/2, y: 0}, {x: px_w/2, y: px_h}, gridWidth, gridColor);
    mg.ctx.restore();
  }
  /* -> Ver.1.37.7 */
  /* -> Ver.1.48.8 */
  return self;
};
/* Ver.1.26.7 */
/* Ver.1.17.4 */
My_entry.pen.prototype.run_filter = function(obj_canvas, text_filter, sw_put){
  var self = this;
  var _ID = null;
  var $ = self.entry.$;
  var conv = self.entry.conv;
  var def = self.entry.def;
  if(text_filter){
    var callback_filter = function(){
      var filters = text_filter.split(":");
      filters.forEach(function(filter){
        var re = /\[.*?\]/g;
        var text = filter;
        var area = "";
        text = def.enter_name(text, "area", false, 2, function(content){area = content;});
        var content = def.get_title(text, "", false, 2);
        var arr_w = (content || "").split(",");  // rgba || rgba[] -> [""]
        arr_w = conv.arr_str2arr_num(arr_w, 0);  // [""] || [string] -> [0]
        var params = $.get_records(area, ",", 0, ["is", "js", "px_w", "px_h"], true);
        params.rgba = text.replace(re, "");
        params.arr_w = arr_w;
        params.content = content;  // Ver.1.13.7
        _ID = self.filter.run(obj_canvas.ctx, params);
        if(sw_put){
          obj_canvas.putID_xy(_ID, params.is, params.js);
//          var ID_check = obj_canvas.getID();  // _ID <> ID_check irreversible?
        }
      });
    };
    callback_filter();
  }
  return _ID;
};
My_entry.pen.prototype.make_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // Ver.1.10.2
  var bg = self.objs.bg;  // Ver.1.7.1
  var ctx = fg.draw.ctx;
  /* Ver.1.20.4 */
  var set_ctx = function(){
    var alpha = options._alpha;  // Ver.1.35.7
    var sh = options._sh;  // Ver.1.35.7
    ctx.shadowBlur = sh;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = options.RGB;
    ctx.fillStyle = ctx.strokeStyle = options.RGB;
    ctx.globalAlpha = (self.mode === -1)? 1: alpha;  // Ver.1.34.7
    ctx.globalCompositeOperation = (self.mode < 0)? "source-over": options.composite;
    ctx.lineCap = options.cap;
  };
  var _handlers = {
    onmousedown: function(e){
      self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);  // Ver.1.7.1
      e.preventDefault();
      e.stopPropagation();
      /* Ver.1.22.6 -> */
      var aElem = document.activeElement;
      if(aElem && aElem.blur){
        aElem.blur();
      }
      /* -> Ver.1.22.6 */
      if(self.isLocked) return false;  // Ver.1.29.7
      /* Ver.1.24.7 -> */
      if(!(self.isSaved)){
        ctx.save();
        self.isSaved = true;
      }
      /* -> Ver.1.24.7 */
      self.isLocked = true;  // Ver.1.21.5
      self.isDragging = true;
      /* Ver.1.4.1 -> */
      var xy1 = fg.get_offset(e);
      self.xy0 = xy1;
      self.xym0 = xy1;
      self.xyp0 = xy1;
      /* -> Ver.1.4.1 */
      self.w0 = 0;
      self.arr_data = [];  // Ver.1.2.0
      /* Ver.1.43.8 */
      if(!(e.isMyCalled)){
        self.mode = self.mode || Number($.selectVal_id("select-mode"));  // Ver.1.19.4 Key first  // Ver.1.33.7
        /* Ver.1.35.7 */
        if(self.mode === 0){
          self.arr_vec = [];
        }
      }
    },
    onmousemove: function(e){
      var w_p = function(p){
        return options.W*p;
      };
      /* Ver.1.5.1 */
      var w_len = function(len){
        var dw = 0;
        var dlen = len-options.len_th;  // Ver.1.4.1
        if(dlen > 0){
          var s = options.out;
          dw = (s < 0)? dlen: -1;
          dw *= s;
        }
        else{
          var s = options.in;
          dw = (s < 0)? dlen: 1;
          dw *= s;
        }
        return Math.min(options.W, Math.max(0, self.w0+dw));
      };
      if(self.isDragging){
        e.preventDefault();
        e.stopPropagation();
        /* Ver.1.36.7 -> */
        var ox = options.ox;
        var oy = options.oy;
        var dxg = options["grid-width"];
        var dyg = options["grid-height"];
        var dxyg = {x: dxg, y: dyg};
        var hasGrid = (dxg > 0 && dyg > 0);
        var hasSnap = (options.snap && hasGrid);
        var xy1 = fg.get_offset(e);
        var xy0 = self.xy0 || xy1;
        if(hasSnap){
          xy0 = fg.draw.xy2xy_snapped(xy0, dxyg);
          xy1 = fg.draw.xy2xy_snapped(xy1, dxyg);
        }
        var x0 = xy0.x;
        var y0 = xy0.y;
        var x1 = xy1.x;
        var y1 = xy1.y;
        /* -> Ver.1.36.7 */
      /* Ver.1.32.7 -> */
      if(self.mode <= 0){  // Ver.1.34.7
        /* Ver.1.18.4 -> */
        /* Ver.1.13.4 -> */
        var stabi = options.stabi;
        var istabi = Math.floor(stabi);
        if(!(hasSnap) && istabi > 0){
          var w = stabi-istabi;
          var arr = self.arr_data;
          var len = arr.length;
          if(len){
            var is = Math.max(0, len-istabi);
            var ie = len-1;
            var N_old = ie-is+1;
            var x_old = 0;
            var y_old = 0;
            for(var i=is; i<=ie; ++i){
              var xy1i = arr[i].xy1;
              x_old += xy1i.x;
              y_old += xy1i.y;
            }
            if(w){
              x_old /= N_old;
              y_old /= N_old;
              x1 = w*x_old+(1-w)*x1;
              y1 = w*y_old+(1-w)*y1;
            }
            else{
              x1 = (x_old+x1)/(N_old+1);
              y1 = (y_old+y1)/(N_old+1);
            }
            xy1.x = x1;
            xy1.y = y1;
          }
        }
        /* -> Ver.1.13.4 */
        /* -> Ver.1.18.4 */
        self.xy0 = xy1;
        /* Ver.1.4.1 -> */
        var dx = x1-x0;
        var dy = y1-y0;
        var len = Math.sqrt(dx*dx+dy*dy);
        var w0 = self.w0 || 0;  // || 0
        var w1 = (options.pressure)? w_p(e.pressure): w_len(len);
        self.w0 = w1;
        var k = (w1/2)/(len || 1);  // || not0
        var dxk = dx*k;
        var dyk = dy*k;
        var xym1x = x1-dyk;
        var xym1y = y1+dxk;
        var xyp1x = x1+dyk;
        var xyp1y = y1-dxk;
        var xym1 = {x: xym1x, y: xym1y};
        var xyp1 = {x: xyp1x, y: xyp1y};
        var xym0 = self.xym0 || xym1;
        var xyp0 = self.xyp0 || xyp1;
        self.xym0 = xym1;
        self.xyp0 = xyp1;
        if(w0+w1){
          self.arr_data.push({xy0: xy0, xy1: xy1, w0: w0, w1: w1, xym0: xym0, xyp0: xyp0, xym1: xym1, xyp1: xyp1});  // Ver.1.2.0
        /* -> Ver.1.4.1 */
          set_ctx();  // Ver.1.20.4
          /* Ver.1.46.8 -> */
          /* Ver.1.4.1 -> */
          if(Math.min(w0, w1) < options.w_th){
            ctx.beginPath();
            ctx.moveTo(xym0.x+ox, xym0.y+oy);
            ctx.lineTo(xyp0.x+ox, xyp0.y+oy);
            ctx.lineTo(xyp1.x+ox, xyp1.y+oy);
            ctx.lineTo(xym1.x+ox, xym1.y+oy);
            ctx.fill();
          }
          else{
            var len_p = Math.ceil(len/(options.dlen || 1));  // || not0
            var dw01 = (w1-w0)/len_p;
            var dx01 = (x1-x0)/len_p;
            var dy01 = (y1-y0)/len_p;
            var wp = w0;
            var xp = x0;
            var yp = y0;
            for(var p=0; p<len_p; ++p){
              ctx.beginPath();
              ctx.moveTo(xp+ox, yp+oy);
              wp = w0+dw01*(p+1);
              xp = x0+dx01*(p+1);
              yp = y0+dy01*(p+1);
              ctx.lineWidth = wp;
              ctx.lineTo(xp+ox, yp+oy);
              ctx.stroke();
            }
          }
          /* -> Ver.1.4.1 */
          /* -> Ver.1.46.8 */
          /* Ver.1.35.7 */
          if(self.mode === 0){
            self.arr_vec.push({x: x1+ox, y: y1+oy});
          }
        }
      }
      else{
        fg.clear();
        var r = (hasGrid)? Math.min(6, Math.min(dxg, dyg)/2): 6;
        switch(self.mode){
          case 2:
          case 3:
            fg.draw.marker_circle({x: x0+ox, y: y0+oy}, r/2, r, "#000000", "#ffffff");
            break;
          default:
            break;
        }
        fg.draw.marker_circle({x: x1+ox, y: y1+oy}, r/2, r, "#000000", "#ffffff");
      }
      /* -> Ver.1.32.7 */
      }
    },
    onmouseup: function(e){
      e.preventDefault();
      e.stopPropagation();
      if(self.isRunning) return false;  // Ver.1.29.7 down failed
      /* Ver.1.49.9 -> */
      if(e.isMyCalled){
        self.mode = 0;
      }
      var isBucket = (self.mode === 1);
      var isEraser = (self.mode < 0);
      /* -> Ver.1.49.9 */
      /* Ver.1.7.1 -> */
      /* Ver.1.6.1 -> */
      /* Ver.1.12.4 -> */
      var ID = null;
      /* Ver.1.35.7 -> */
      var rgba = options._rgba;
      var alpha = options._alpha;
      /* -> Ver.1.35.7 */
      /* Ver.1.47.8 -> */
      if(isEraser){  // Ver.1.49.9
        options.RGB = "#ffffff";  // for svg
        if(self.mode === -1){
          options.A = 100;  // for svg
          rgba.a = 255;
          alpha = 1;
        }
      }
      /* -> Ver.1.47.8 */
      /* Ver.1.32.7 -> */
      /* Ver.1.20.4 -> */
      /* Ver.1.36.7 -> */
      var ox = options.ox;
      var oy = options.oy;
      var dxg = options["grid-width"];
      var dyg = options["grid-height"];
      var dxyg = {x: dxg, y: dyg};
      var hasLimit_A = (options.A < 0);  // Ver.1.49.9
      var hasGrid = (dxg > 0 && dyg > 0);
      var hasSnap = (options.snap && hasGrid);
      var hasMosaic = (options.mosaic && hasGrid);  // Ver.1.49.9
      var xy1 = fg.get_offset(e);
      var xy0 = self.xy0 || xy1;
      if(hasSnap){
        xy0 = fg.draw.xy2xy_snapped(xy0, dxyg);
        xy1 = fg.draw.xy2xy_snapped(xy1, dxyg);
      }
      var x0 = xy0.x;
      var y0 = xy0.y;
      var x1 = xy1.x;
      var y1 = xy1.y;
      /* -> Ver.1.36.7 */
      /* Ver.1.43.8 -> */
      if(self.mode > 0){  // Ver.1.34.7  // Ver.1.49.9
        fg.clear();  // Ver.1.32.7
        var dx = x1-x0;
        var dy = y1-y0;
        var len = Math.sqrt(dx*dx+dy*dy);
        /* Ver.1.39.7 -> */
        set_ctx();
        self.update_options();
        var hasStyle = (options.strokeStyle && options.fillStyle);
        if(hasStyle){
          ctx.globalAlpha = 1;
          ctx.fillStyle = options.fillStyle;
          ctx.shadowColor = ctx.strokeStyle = options.strokeStyle;
          ctx.lineWidth = options.lineWidth || 1;
          ctx.shadowBlur = options.blur || ctx.shadowBlur;
        }
        switch(self.mode){
          /* Ver.1.30.7 */
          case 1:
            /* Ver.1.26.7 -> */
            var text_filter = "fiin["+(x1+ox)+","+(y1+oy)+","+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+","+(options.Nwrap || 16);  // text=""+(x+ox)+""
            self.run_filter(bg, text_filter+"]", true);  // Ver.1.17.4
            var ID_map = self.run_filter(bg, text_filter+",1]");
            self.arr_data = {ID_map: ID_map};
            /* -> Ver.1.26.7 */
            break;
          case 2:
            var cx = x0;
            var cy = y0;
            var r = len;
            ctx.beginPath();
            ctx.arc(x0+ox, y0+oy, len, 0, Math.PI*2);
            ctx.fill();
            if(hasStyle){
              ctx.stroke();
            }
            self.arr_data = {cx: cx, cy: cy, r: r};
            break;
          case 3:
            var x = Math.min(x0, x1);
            var y = Math.min(y0, y1);
            var width = Math.max(x0, x1)-x;
            var height = Math.max(y0, y1)-y;
            ctx.fillRect(x+ox, y+oy, width, height);
            if(hasStyle){
              ctx.strokeRect(x+ox, y+oy, width, height);
            }
            self.arr_data = {x: x, y: y, width: width, height: height};
            break;
          case 4:
            var ID_picked = bg.getID_xy(x1+ox, y1+oy);
            if(ID_picked){
              var data_picked = ID_picked.data;
              var r_picked = data_picked[0] || 0;
              var g_picked = data_picked[1] || 0;
              var b_picked = data_picked[2] || 0;
              var a_picked = data_picked[3] || 0;
              var color_hex = bg.draw.rgba2color_hex({r: r_picked, g: g_picked, b: b_picked, a: a_picked});
              var elem_RGB = $.set_id("input-RGB");
              elem_RGB.value = color_hex.substring(0, 7);  // including #
              $._id("input-A").value = a_picked*100/255;
              elem_RGB.onchange();
            }
            break;
          default:
            break;
        }
        /* -> Ver.1.39.7 */
      }
      /* -> Ver.1.20.4 */
      /* -> Ver.1.32.7 */
      /* -> Ver.1.43.8 */
      /* Ver.1.47.8 -> */
      /* Ver.1.26.7 -> */
      if(!(isBucket)){  // Ver.1.34.7  // Ver.1.49.9
        if(hasLimit_A){  // Ver.1.49.9
          ID = fg.getID_alpha(alpha);
        }
        if(hasMosaic){  // Ver.1.49.9
          ID = fg.draw.filter_mosaic(ID, dxg, dyg, options.mosaic, rgba);  // Ver.1.35.7  // Ver.1.49.9
          if(options["with-svg"]){
            /* Ver.1.34.7 -> */
            var ID_svg = ID;
            if(isEraser){  // Ver.1.49.9
              var rgba_white = {r: 255, g: 255, b: 255, a: -1};
              ID_svg = fg.convID_rgba(rgba_white, ID);
            }
            self.arr_data = {ID: ID_svg};
            /* -> Ver.1.34.7 */
          }
        }
      }
      /* -> Ver.1.26.7 */
      if(ID){
        fg.putID(ID);
      }
      /* -> Ver.1.12.4 */
      var base64_fg = fg.get_base64();
      /* Ver.1.21.5 -> */
      /* Ver.1.34.7 -> */
      var callback = function(){
        self.handler_history_ID.save(bg.getID());  // Ver.1.1.0
        fg.clear();
      /* -> Ver.1.47.8 */
        var svg = (hasMosaic && options["with-svg"])? self.make_svg_lines(): (e.mysvg || self.make_svg_lines());  // Ver.1.43.8  // Ver.1.49.9
        self.handler_history_svg.save(svg);  // Ver.1.2.0
        if(isEraser){  // Ver.1.49.9
          self.update_options();
        }
        /* Ver.1.24.7 -> */
        $._id("input-file-fg").value = null;  // Ver.1.11.4
        $._id("input-file-bg").value = null;  // Ver.1.8.1
        if(self.isSaved){
          ctx.restore();
          self.isSaved = false;
        }
        /* -> Ver.1.24.7 */
        self.mode = 0;  // Ver.1.19.4
        self.isLocked = false;  // async
      }
      var composite = (isEraser)? "destination-out": options.composite;  // Ver.1.49.9
      /* Ver.1.21.4 -> */
      if(options.sh < 0){
        var len_sh = Math.min(100, -options.sh);
        var arr_base64 = [];
        for(var nsh=0; nsh<len_sh+1; ++nsh){
          arr_base64.push(base64_fg);
        }
        bg.draw_base64s(arr_base64, callback, composite);
      }
      else{
        bg.draw_base64(base64_fg, null, callback, composite);  // Ver.1.11.4
      }
      /* -> Ver.1.21.4 */
      /* -> Ver.1.34.7 */
      /* -> Ver.1.6.1 */
      /* -> Ver.1.7.1 */
      /* fluid-Ver.0.0.0 -> */
      self.reset_canvas_grid();
      self.uvp = null;
      /* -> fluid-Ver.0.0.0 */
      self.isDragging = false;  // sync
      /* -> Ver.1.21.5 */
    }
  };
  return _handlers;
};
My_entry.pen.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  /* Ver.1.14.4 */
  self.handlers.onload = function(e){
    var self = this;
    self.update_options();
    self.init_keys();  // Ver.1.16.4
    var json = {p: {id: "wrapper-link-png"}, a: {id: "a-png", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.objs.bg.get_base64());});  // Ver.1.7.1
    /* Ver.1.2.0 -> */
    var json = {p: {id: "wrapper-link-svg"}, a: {id: "a-svg", it: "-svg(src-over)"}, name: "download", ext: "svg"};
    self.handler_link_svg = new self.constructors.handler_link(json);
    self.handler_link_svg.setter.callback(function(){return self.make_svg();});
    self.handler_history_ID = new self.constructors.handler_history(options.history_len_max);  // Ver.1.1.0
    /* Ver.1.21.4 -> */
    var callback_svg = function(){
      self.show_fileSize_svg();
    };
    self.handler_history_svg = new self.constructors.handler_history(10000, callback_svg);  // about 10000 lines
    /* -> Ver.1.21.4 */
    /* -> Ver.1.2.0 */
    self.drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    /* Ver.1.7.1 -> */
    self.objs.fg = new self.constructors.canvas($._id("canvas-fg"));
    self.objs.mg = new self.constructors.canvas($._id("canvas-mg"));  // Ver.1.10.2
    self.objs.bg = new self.constructors.canvas($._id("canvas-bg"));
    /* -> Ver.1.7.1 */
    self.objs.fg.attach_point(self.make_handlers());
    /* Ver.1.35.7 -> */
    var decDigit = (isNaN(options.decDigit)? 1: options.decDigit);
    self.objs.fg.draw.setter.decDigit(decDigit);  // Ver.1.2.0
    self.objs.mg.draw.setter.decDigit(decDigit);
    self.objs.bg.draw.setter.decDigit(decDigit);
    /* -> Ver.1.35.7 */
    $.change_elems$("input[type='checkbox']");
    self.reset_canvas();
    self.update_options();  // Ver.1.35.7 re-update
    /* fluid-Ver.0.0.0 -> */
    var base64 = "";
    switch(self.options.testcase){
      case 0:
        base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCI+CjwhLS0gb25saW5lLXNpbXVsYXRvci5naXRodWIuaW8uNi4xNTUuNzEuMTIuNDAgLS0+Cjxwb2x5Z29uIGZpbGw9InJnYmEoMCwgMCwgMCwgMCkiIHN0cm9rZT0ibm9uZSIgcG9pbnRzPSIwIDAgMjQwIDAgMjQwIDI0MCAwIDI0MCIvPgo8ZyBpZD0iaWQyIj4KPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIwIiB5PSI2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMTIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjAiIHk9IjE2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMTgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIwIiB5PSIyMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjAiIHk9IjIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPC9nPgo8ZyBpZD0iaWQzIj4KPHJlY3QgeD0iNDAiIHk9IjgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iNDAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjQwIiB5PSIxMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSI0MCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPC9nPgo8L3N2Zz4K";
        break;
      case 1:
        base64 = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIiB2aWV3Qm94PSIwIDAgMjQwIDI0MCI+CjwhLS0gb25saW5lLXNpbXVsYXRvci5naXRodWIuaW8uNi4xNTUuNzEuMTIuNDAgLS0+Cjxwb2x5Z29uIGZpbGw9InJnYmEoMCwgMCwgMCwgMCkiIHN0cm9rZT0ibm9uZSIgcG9pbnRzPSIwIDAgMjQwIDAgMjQwIDI0MCAwIDI0MCIvPgo8ZyBpZD0iaWQwIj4KPHJlY3QgeD0iMCIgeT0iMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMjAiIHk9IjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMjAiIHk9IjQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMjAiIHk9IjYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMjAiIHk9IjgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMjAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjQwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSI2MCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iODAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMTIwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIxNDAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjE2MCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMTgwIiB5PSIxMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMDAiIHk9IjEwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjIyMCIgeT0iMTAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPC9nPgo8ZyBpZD0iaWQxIj4KPHJlY3QgeD0iMCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMjAiIHk9IjIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjQwIiB5PSIyMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSI2MCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iODAiIHk9IjIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjEwMCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMTIwIiB5PSIyMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIxNDAiIHk9IjIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjE2MCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMTgwIiB5PSIyMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMDAiIHk9IjIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjIyMCIgeT0iMjIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPC9nPgo8ZyBpZD0iaWQyIj4KPHJlY3QgeD0iMCIgeT0iMjAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iMjAiIHk9IjIwMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjxyZWN0IHg9IjQwIiB5PSIyMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8L2c+CjxnIGlkPSJpZDMiPgo8cmVjdCB4PSIwIiB5PSIxODAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIyMCIgeT0iMTgwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMCkiLz4KPHJlY3QgeD0iNDAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjwvZz4KPGcgaWQ9ImlkNCI+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjIwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSI0MCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iNjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjgwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIxMDAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjEyMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMTQwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIxNjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjxyZWN0IHg9IjE4MCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPHJlY3QgeD0iMjAwIiB5PSIwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMCwwKSIvPgo8cmVjdCB4PSIyMjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwwLDApIi8+CjwvZz4KPGcgaWQ9ImlkNSI+CjxyZWN0IHg9IjIyMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjwvZz4KPGcgaWQ9ImlkNiI+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwwKSIvPgo8cmVjdCB4PSIwIiB5PSIyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDApIi8+CjwvZz4KPGcgaWQ9ImlkNyI+CjxyZWN0IHg9IjAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMTAwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigxMDAsMCwwKSIvPgo8cmVjdCB4PSIwIiB5PSIxNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDEwMCwwLDApIi8+CjwvZz4KPGcgaWQ9ImlkOCI+CjwvZz4KPGcgaWQ9ImlkOSI+CjxyZWN0IHg9IjIyMCIgeT0iMjAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMjU1KSIvPgo8L2c+CjxnIGlkPSJpZDEwIj4KPHJlY3QgeD0iMjAwIiB5PSI4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDI1NSkiLz4KPC9nPgo8ZyBpZD0iaWQxMSI+CjwvZz4KPGcgaWQ9ImlkMTIiPgo8cmVjdCB4PSIyMjAiIHk9IjEyMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDI1NSkiLz4KPHJlY3QgeD0iMjIwIiB5PSIxNDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwyNTUpIi8+CjxyZWN0IHg9IjIyMCIgeT0iMTYwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigwLDAsMjU1KSIvPgo8cmVjdCB4PSIyMjAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMCwwLDI1NSkiLz4KPHJlY3QgeD0iMjIwIiB5PSIyMDAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDAsMCwyNTUpIi8+CjwvZz4KPGcgaWQ9ImlkMTMiPgo8cmVjdCB4PSIwIiB5PSIxMjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDUwLDAsMCkiLz4KPHJlY3QgeD0iMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYig1MCwwLDApIi8+CjxyZWN0IHg9IjAiIHk9IjE2MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoNTAsMCwwKSIvPgo8L2c+CjxnIGlkPSJpZDE0Ij4KPC9nPgo8ZyBpZD0iaWQxNSI+CjxyZWN0IHg9IjIyMCIgeT0iMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDAsMCkiLz4KPC9nPgo8ZyBpZD0iaWQxNiI+CjxyZWN0IHg9IjIyMCIgeT0iMTQwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMjU1LDI1NSkiLz4KPHJlY3QgeD0iMjIwIiB5PSIxNjAiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0icmdiKDI1NSwyNTUsMjU1KSIvPgo8cmVjdCB4PSIyMjAiIHk9IjE4MCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJyZ2IoMjU1LDI1NSwyNTUpIi8+CjxyZWN0IHg9IjIyMCIgeT0iMjAwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9InJnYigyNTUsMjU1LDI1NSkiLz4KPC9nPgo8L3N2Zz4K";
        break;
      default:
        break;
    }
    if(base64){
      self.objs.bg.draw_base64(base64);
    }
    /* -> fluid-Ver.0.0.0 */
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    /* fluid-Ver.0.0.0 */
    if(self.isLocked){
      switch(elem.id){
        case "stop":
          self.isLocked = false;
          break;
        default:
          break;
      }
      return false;  // Ver.1.28.7 all-buttons
    }
    var fg = self.objs.fg;
    var mg = self.objs.mg;  // Ver.1.10.2
    var bg = self.objs.bg;  // Ver.1.7.1
    self.update_options();
    switch(elem.id){
      /* Ver.1.7.1 -> */
      case "flat_low":
      case "flat_all":
      case "flat_upp":
        var R255 = Math.min(255, Math.max(-1, options["png-R255"]));
        var G255 = Math.min(255, Math.max(-1, options["png-G255"]));
        var B255 = Math.min(255, Math.max(-1, options["png-B255"]));
        var A100 = Math.min(100, Math.max(-1, options["png-A100"]));
        if(R255 >= 0 || G255 >= 0 || B255 >= 0 || A100 >= 0){
          var ID = bg.getID_RGBA(R255, G255, B255, A100, elem.id);
          bg.putID(ID);
          self.handler_history_ID.save(ID);
          self.handler_history_svg.save("");
        }
        break;
      /* -> Ver.1.7.1 */
      /* Ver.1.17.4 */
      case "run":
        self.isLocked = true;  // Ver.1.28.7
        self.isRunning = true;  // Ver.1.29.7
        var label0 = elem.innerText;
        elem.innerText = label0+"...";
        setTimeout(function(){
          self.run_filter(bg, $._id("input-text-filter").value, true);  // Ver.1.26.7
          self.handler_history_ID.save(bg.getID());
          self.handler_history_svg.save("");
          elem.innerText = label0;
          self.isRunning = false;  // Ver.1.29.7
          self.isLocked = false;  // Ver.1.28.7
        }, 50);
        break;
      /* Ver.1.35.7 */
      case "draw":
        var arr_vec = self.arr_vec;
        var len = arr_vec.length;
        var text = $._id("input-text-draw").value;
        if(text && len > 0){
          bg.draw.textpath_sw(text, arr_vec, options.composite, len-1, options.fontFamily, options.fontSize || options.W, options.isBold, options.isItalic, options.isReverse, options.fillStyle || options.bgcolor, options.strokeStyle || options._color_rgba, options.fillStr, options.spacingX || 0, options.spacingY || 0, options.offsetX || 0, options.offsetY || 0, options.blur || options._sh, options.deg0 || 0);
          var svg = bg.draw.textpath_sw(text, arr_vec, options.composite, len-1, options.fontFamily, options.fontSize || options.W, options.isBold, options.isItalic, options.isReverse, options.fillStyle || options.bgcolor, options.strokeStyle || options._color_rgba, options.fillStr, options.spacingX || 0, options.spacingY || 0, options.offsetX || 0, options.offsetY || 0, options.blur || options._sh, options.deg0 || 0, true);
          self.handler_history_ID.save(bg.getID());
          self.handler_history_svg.save(svg);
        }
        break;
      /* Ver.1.43.8 */
      /* Ver.1.42.8 */
      case "put":
        var arr_vec = self.arr_vec;
        var len = arr_vec.length;
        var text = $._id("input-colors-gradation").value;
        if(text && len > 0){
          var vec0 = {x: options.x0, y: options.y0};
          var colors = (text).split(":");
          self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);
          var ID = fg.draw.gradation(colors, arr_vec, options.composite, vec0, options.offsetR, options.orderR, options.NrandR, options.NrandT, options.isMin, options.isRound, options.Nrender, options.Ncycle);
          self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);
          var svg = fg.draw.gradation(colors, arr_vec, options.composite, vec0, options.offsetR, options.orderR, options.NrandR, options.NrandT, options.isMin, options.isRound, options.Nrender, options.Ncycle);
          fg.putID(ID);
          fg.tap_point({mysvg: svg});
        }
        break;
      /* Ver.1.44.8 */
      case "blur":
        var arr_vec = self.arr_vec;
        var len = arr_vec.length;
        var text = $._id("input-strengths-blur").value;
        if(text && len > 0){
          var vec0 = {x: options.x0, y: options.y0};
          var arr_s = self.entry.conv.arr_str2arr_num((text || "0:10").split(":"), 0, 0, 20);
          self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);
          var ID = bg.draw.blur(arr_s, arr_vec, options.composite, vec0, options.offsetR, options.orderR, options.NrandR, options.NrandT, options.isMin, options.isRound, options.Nrender, options.Ncycle, options.isCyclic, options.isSquare, options.x_asym, options.y_asym, options.k_asym, options.Nrad_asym);
          bg.putID(ID);
          self.handler_history_ID.save(ID);
          self.handler_history_svg.save("");
        }
        break;
      /* Ver.1.1.0 -> */
      case "<<":
        var ID = self.handler_history_ID.reverse();
        if(ID){
          /* Ver.1.23.6 -> */
          var px_w = ID.width;
          var px_h = ID.height;
          if(!(px_w === fg.px_w && px_h === fg.px_h)){
            self.change_size(px_w, px_h);
          }
          /* -> Ver.1.23.6 */
          bg.putID(ID);  // Ver.1.7.1
          self.handler_history_svg.reverse();  // Ver.1.2.0  // Ver.1.3.1
        }
        break;
      case ">>":
        var ID = self.handler_history_ID.forward();
        if(ID){
          /* Ver.1.23.6 -> */
          var px_w = ID.width;
          var px_h = ID.height;
          if(!(px_w === fg.px_w && px_h === fg.px_h)){
            self.change_size(px_w, px_h);
          }
          /* -> Ver.1.23.6 */
          bg.putID(ID);  // Ver.1.7.1
          self.handler_history_svg.forward();  // Ver.1.2.0  // Ver.1.3.1
        }
        break;
      /* -> Ver.1.1.0 */
      case "clear":
        self.reset_canvas();
        self.uvp = null;  // fluid-Ver.0.0.0
        break;
      /* fluid-Ver.0.0.0 */
      case "start":
        self.isLocked = true;
        var dxg = options["grid-width"];
        var dyg = options["grid-height"];
        var hasGrid = (dxg > 0 && dyg > 0);
        if(hasGrid){
          var solver = self.solver || new My_entry.solver_NS();
          var uvp = self.uvp || self.objs.bg.make_uvp(options["grid-width"], options["grid-height"]);
          self.solver = solver;
          self.uvp = uvp;
          var n = 0;
          var callback = function(){
            var hasError = false;
            var dn = 10;
            try{
              solver.FS2d({Re: options.Re, dt: uvp.dtmax/options.Ndt, Nnt: dn, order_upstream: options.order_upstream}, uvp);
            }
            catch(e){
              hasError = true;
            }
            if(uvp){
              var cont = uvp.cmax;
              var cont_isNaN = isNaN(cont);
              $._id("input-time").value = uvp.t;
              $._id("input-cont").value = cont;
              var isFinal = hasError || cont_isNaN || (++n >= 1000);
              if(isFinal){
                self.reset_canvas_grid();
                self.uvp = null;
                self.isLocked = false;
              }
              else{
                mg.clear();
                var svg = mg.draw.uvp(uvp);
                setTimeout(function(){
                  if(self.isLocked) callback();
                }, 50);
              }
            }
          };
          callback();
        }
        break;
      /* Ver.1.17.4 */
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var fg = self.objs.fg;
    var mg = self.objs.mg;  // Ver.1.10.2
    var bg = self.objs.bg;  // Ver.1.7.1
    self.update_options();
    switch(elem.id){
      case "checkbox-drag":
        self.drag.switch();
        break;
      case "checkbox-config":
        var isChecked = $.checkbox_elem(elem);
        $.show("#div-config", isChecked, true);
        break;
      case "checkbox-black":
        $.set_id("div-canvas", "background", ((options.black)? "black": "white"));  // options including URL-parameter
        break;
      /* Ver.1.24.6 */
      case "input-W":
        var W = options.W;  // options
        var isChecked = options["auto-config"];  // options
        if(isChecked && W > 0){
          var A = options.A;  // options
          $._id("input-A").value = (W < 5)? ((A < 0)? A: -30): ((A > 0)? A: 10);
          /* Ver.1.46.8 -> */
          $._id("input-w_th").value = (1-Math.pow(Math.E, -0.029375226827858474*W))*8;
          $._id("input-dlen").value = (1-Math.pow(Math.E, -0.11198496682675355*W))*6;
          /* -> Ver.1.46.8 */
          $._id("input-len_th").value = 5+Math.max(0, 5*(W-16)/(128-16));
          $._id("input-in").value = 0.4*W/16;
          $._id("input-out").value = (W < 32)? Math.max(0.8, W/8): -W/32;
          self.update_options();  // including URL-parameter
        }
        break;
      case "select-canvas-width":
      case "select-canvas-height":
      case "select-bgcolor":  // Ver.1.7.1
      case "input-second-url-parameters":  // Ver.1.39.7  // Ver.1.41.8
      case "input-third-url-parameters":  // Ver.1.42.8
        self.reset_canvas();
        break;
      /* Ver.1.10.2 */
      case "input-grid-width":
      case "input-grid-height":
        self.reset_canvas_grid();
        break;
      /* Ver.1.43.8 */
      /* Ver.1.11.4 -> */
      case "input-file-fg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          var callback_last = function(){
            fg.tap_point({mysvg: ""});
          };
          fg.draw_base64(base64, null, callback_last, options.composite);
        });
        if(!(file)){
          elem.value = null;
        }
        break;
      /* Ver.1.8.1 */
      case "input-file-bg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          // self.entry.conv.base2img
          var callback_first = function(e){
            var px_w = e.target.width;
            var px_h = e.target.height;
            self.change_size(px_w, px_h);  // Ver.1.11.4
          };
          var callback_last = function(){
            self.handler_history_ID.save(bg.getID());
            self.handler_history_svg.save(self.make_svg_header());  // Ver.1.21.6
          };
          bg.draw_base64(base64, callback_first, callback_last, options.composite);
        });
        if(!(file)){
          elem.value = null;
        }
        break;
      /* -> Ver.1.11.4 */
      default:
        break;
    }
    return self;
  };
  return self;
};
