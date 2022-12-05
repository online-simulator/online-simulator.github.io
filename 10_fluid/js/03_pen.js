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
  var options = self.options;  // fluid-Ver.1.8.0
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // fluid-Ver.1.8.0
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  var i_header = self.show_fileSize_svg();  // Ver.1.21.4
  if(i_header >= 0){
    for(var i=i_header; i<len; ++i){
      var revi = rev[i];  // Ver.1.21.4
      _svg += revi;
    }
    _svg += (options.arrows && self.uvp)? mg.draw.uvp(self.uvp): "";  // fluid-Ver.1.8.0
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
/* Ver.1.52.10 */
/* Ver.1.11.4 */
My_entry.pen.prototype.change_size = function(px_w, px_h){
  var self = this;
  var $ = self.entry.$;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // Ver.1.10.2
  var bg = self.objs.bg;  // Ver.1.7.1
  $._id("input-canvas-width").value = px_w;
  $._id("input-canvas-height").value = px_h;
  self.update_options();
  $.set_id("div-canvas", "width", (1+px_w+1)+"px");  // Ver.1.10.3
  $.set_id("div-canvas", "height", (1+px_h+1)+"px");
  fg.change_size(px_w, px_h);
  mg.change_size(px_w, px_h);  // Ver.1.10.2
  bg.change_size(px_w, px_h);
  self.reset_canvas_grid();
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
  self.init_config();  // fluid-Ver.1.10.0
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
    /* Ver.1.50.9 -> */
    var gridLineWidth = options.gridLineWidth || 0.5;
    var gridLineColor = options.gridLineColor || ((rgba.a > 255/2 && rgba.r+rgba.g+rgba.b < 255*3/2)? "#ffffff55": "#00000033");
    mg.ctx.save();
    mg.draw_lines_grid(dxg, dyg, gridLineWidth, gridLineColor);  // Ver.1.10.4
    mg.draw.line({x: 0, y: px_h/2}, {x: px_w, y: px_h/2}, gridLineWidth, gridLineColor);
    mg.draw.line({x: px_w/2, y: 0}, {x: px_w/2, y: px_h}, gridLineWidth, gridLineColor);
    /* -> Ver.1.50.9 */
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
      /* fluid-Ver.1.0.0 -> */
      self.init_config();  // fluid-Ver.1.10.0
      /* -> fluid-Ver.1.0.0 */
      self.isDragging = false;  // sync
      /* -> Ver.1.21.5 */
    }
  };
  return _handlers;
};
/* fluid-Ver.1.10.0 */
My_entry.pen.prototype.init_config = function(opt_isFinal){
  var self = this;
  var $ = self.entry.$;
  $._id("input-Lx").value = null;
  self.reset_canvas_grid();
  self.uvp = null;
  if(opt_isFinal){
    self.isLocked = false;
  }
  return self;
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
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.objs[(options.arrows)? "mg": "bg"].get_base64());});  // Ver.1.7.1  // fluid-Ver.1.8.0
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
    /* fluid-Ver.1.0.0 -> */
    var base64 = "";
    /* fluid-Ver.1.12.0 svg -> png */
    /* fluid-Ver.1.3.0 */
    switch(self.options.testcase){
      case 0:
        base64 = "data:image/png;base64,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";
        break;
      case 1:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.6.0 */
      case 2:
        base64 = "data:image/png;base64,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";
        break;
      case 3:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.6.0 */
      case 4:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.7.0 */
      case 5:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.7.0 */
      case 6:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.5.0 */
      case 7:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.7.0 */
      case 8:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.7.0 */
      case 9:
        base64 = "data:image/png;base64,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";
        break;
      case 10:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.6.0 */
      case 11:
        base64 = "data:image/png;base64,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";
        break;
      case 12:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.12.0 */
      case 13:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.12.0 */
      case 14:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.12.0 */
      case 15:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAB1NJREFUeF7t3LGNY0EMBUEpv8s/HV0MD1xg2ijZ/BiiiHb1/Xw+v0/59/tX3s5uBJ4KfAX81N/jBE4CAj7x+ZjAWwEBv/X3OoGTgIBPfD4m8FZAwG/9vU7gJCDgE5+PCbwVEPBbf68TOAkI+MTnYwJvBQT81t/rBE4CAj7x+ZjAWwEBv/X3OoGTgIBPfD4m8FZAwG/9vU7gJCDgE5+PCbwVEPBbf68TOAkI+MTnYwJvBQT81t/rBE4CAj7x+ZjAWwEBv/X3OoGTwPf3x/+J9f21/2LrpOVjAjEBAccOYh0Ci4CAFy2zBGICAo4dxDoEFgEBL1pmCcQEBBw7iHUILAICXrTMEogJCDh2EOsQWAQEvGiZJRATEHDsINYhsAgIeNEySyAmIODYQaxDYBEQ8KJllkBMQMCxg1iHwCIg4EXLLIGYgIBjB7EOgUVAwIuWWQIxAQHHDmIdAouAgBctswRiAgKOHcQ6BBYBAS9aZgnEBAQcO4h1CCwCAl60zBKICQg4dhDrEFgEBLxomSUQExBw7CDWIbAICHjRMksgJiDg2EGsQ2AREPCiZZZATEDAsYNYh8AiIOBFyyyBmICAYwexDoFFQMCLllkCMQEBxw5iHQKLgIAXLbMEYgICjh3EOgQWAQEvWmYJxAQEHDuIdQgsAgJetMwSiAkIOHYQ6xBYBAS8aJklEBMQcOwg1iGwCAh40TJLICYg4NhBrENgERDwomWWQExAwLGDWIfAIiDgRcssgZiAgGMHsQ6BRUDAi5ZZAjEBAccOYh0Ci4CAFy2zBGICAo4dxDoEFgEBL1pmCcQEBBw7iHUILAICXrTMEogJCDh2EOsQWAQEvGiZJRATEHDsINYhsAgIeNEySyAmIODYQaxDYBEQ8KJllkBMQMCxg1iHwCIg4EXLLIGYgIBjB7EOgUVAwIuWWQIxAQHHDmIdAouAgBctswRiAgKOHcQ6BBYBAS9aZgnEBAQcO4h1CCwCAl60zBKICQg4dhDrEFgEBLxomSUQExBw7CDWIbAICHjRMksgJiDg2EGsQ2AREPCiZZZATEDAsYNYh8AiIOBFyyyBmICAYwexDoFFQMCLllkCMQEBxw5iHQKLgIAXLbMEYgICjh3EOgQWAQEvWmYJxAQEHDuIdQgsAgJetMwSiAkIOHYQ6xBYBAS8aJklEBMQcOwg1iGwCAh40TJLICYg4NhBrENgERDwomWWQExAwLGDWIfAIiDgRcssgZiAgGMHsQ6BRUDAi5ZZAjEBAccOYh0Ci4CAFy2zBGICAo4dxDoEFgEBL1pmCcQEBBw7iHUILAICXrTMEogJCDh2EOsQWAQEvGiZJRATEHDsINYhsAgIeNEySyAmIODYQaxDYBEQ8KJllkBMQMCxg1iHwCIg4EXLLIGYgIBjB7EOgUVAwIuWWQIxAQHHDmIdAouAgBctswRiAgKOHcQ6BBYBAS9aZgnEBAQcO4h1CCwCAl60zBKICQg4dhDrEFgEBLxomSUQExBw7CDWIbAICHjRMksgJiDg2EGsQ2AREPCiZZZATEDAsYNYh8AiIOBFyyyBmICAYwexDoFFQMCLllkCMQEBxw5iHQKLgIAXLbMEYgICjh3EOgQWAQEvWmYJxAQEHDuIdQgsAgJetMwSiAkIOHYQ6xBYBAS8aJklEBMQcOwg1iGwCAh40TJLICYg4NhBrENgERDwomWWQExAwLGDWIfAIiDgRcssgZiAgGMHsQ6BRUDAi5ZZAjEBAccOYh0Ci4CAFy2zBGICAo4dxDoEFgEBL1pmCcQEBBw7iHUILAICXrTMEogJCDh2EOsQWAQEvGiZJRATEHDsINYhsAgIeNEySyAmIODYQaxDYBEQ8KJllkBMQMCxg1iHwCIg4EXLLIGYgIBjB7EOgUVAwIuWWQIxAQHHDmIdAouAgBctswRiAgKOHcQ6BBYBAS9aZgnEBAQcO4h1CCwCAl60zBKICQg4dhDrEFgEBLxomSUQExBw7CDWIbAICHjRMksgJiDg2EGsQ2AREPCiZZZATEDAsYNYh8AiIOBFyyyBmICAYwexDoFFQMCLllkCMQEBxw5iHQKLgIAXLbMEYgICjh3EOgQWAQEvWmYJxAQEHDuIdQgsAgJetMwSiAkIOHYQ6xBYBAS8aJklEBMQcOwg1iGwCAh40TJLICYg4NhBrENgERDwomWWQExAwLGDWIfAIiDgRcssgZiAgGMHsQ6BRUDAi5ZZAjEBAccOYh0Ci4CAFy2zBGICAo4dxDoEFgEBL1pmCcQEBBw7iHUILAICXrTMEogJCDh2EOsQWAQEvGiZJRATEHDsINYhsAgIeNEySyAmIODYQaxDYBEQ8KJllkBMQMCxg1iHwCIg4EXLLIGYgIBjB7EOgUVAwIuWWQIxAQHHDmIdAouAgBctswRiAgKOHcQ6BBYBAS9aZgnEBAQcO4h1CCwCAl60zBKICQg4dhDrEFgEBLxomSUQExBw7CDWIbAICHjRMksgJiDg2EGsQ2AR+A9ck5xSThvMsAAAAABJRU5ErkJggg==";
        break;
      default:
        break;
    }
    if(base64){
      /* fluid-Ver.1.3.0 -> */
      var fg = self.objs.fg;
      var callback_last = function(){
        var w = options.mosaic;
        options.mosaic = "min";
        fg.tap_point({mysvg: ""});
        options.mosaic = w;
      };
      fg.draw_base64(base64, null, callback_last);
      /* -> fluid-Ver.1.3.0 */
    }
    /* -> fluid-Ver.1.0.0 */
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    /* fluid-Ver.1.0.0 */
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
        break;
      /* fluid-Ver.1.0.0 */
      case "start":
        self.isLocked = true;
        var dxg = options["grid-width"];
        var dyg = options["grid-height"];
        var hasGrid = (dxg > 0 && dyg > 0);
        if(hasGrid){
          var solver = self.solver || new My_entry.solver_NS();
          var uvp = self.uvp || self.objs.bg.make_uvp(options);  // fluid-Ver.1.10.0
          $._id("input-Lx").value = uvp.Lx;  // fluid-Ver.1.10.0
          self.solver = solver;
          self.uvp = uvp;
          var n = 0;
          var callback = function(){
            var hasError = false;
            var nmax = options.nmax || 1000;
            try{
              solver.FS2d({Re: options.Re, Ndt: options.Ndt, Nnt: options.Nnt, order_upstream: options.order_upstream, type_bound: options.type_bound}, uvp);  // fluid-Ver.1.7.0  // fluid-Ver.1.11.0  // fluid-Ver.1.12.0
            }
            catch(e){
              hasError = "No solution";  // fluid-Ver.1.3.0
            }
            if(uvp){
              var cont = uvp.cmax;
              var cont_isNaN = isNaN(cont);
              $._id("input-time").value = uvp.t;
              $._id("input-cmax").value = hasError || ((cont_isNaN)? cont: (uvp.cmax).toExponential(1));  // fluid-Ver.1.9.0
              $._id("input-qtotal").value = hasError || ((cont_isNaN)? cont: (uvp.qtotal).toExponential(1));  // fluid-Ver.1.3.0
              if(hasError || cont_isNaN){
                self.init_config(true);  // fluid-Ver.1.10.0
              }
              else if(++n >= nmax){
                self.isLocked = false;
              }
              else{
                mg.clear();
                uvp._k_arrow = options.k_arrow;  // fluid-Ver.1.3.0
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
    /* fluid-Ver.1.10.0 */
    if(self.isLocked){
      switch(elem.id){
        case "input-Ly":
          self.init_config(true);
          break;
        default:
          break;
      }
    }
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
      case "input-canvas-width":  // Ver.1.52.10
      case "input-canvas-height":  // Ver.1.52.10
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
