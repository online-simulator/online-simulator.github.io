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
  self.base64s = [];  // Ver.1.63.11
  self.base64s[3] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAfhJREFUeF7tm91KxDAUhL/1b1FRVNgbH8HH8K19Dd/BS0GUddH1j5EMxFLXutBe5JxCSLsJbWd6kmanZ2YE32bB8ZMEZAQEZyCHQPAAyEkwhwDEjgJFwBzYKUREiYhPQOVDgBfAPrAH7DZOhIG/A2/AWgRcAUfAQSmKBhV1VntLtbAI/Bp4AVYCeA2cFhI0HBwJrb0hv0O+PHmBfwYeRcANcFkI0LFLawQYj4lYAXcCewscA2cBwIsEzwMPwDIJyCGQk2C+BsMvhMIvhaOs/3vXNaHBi5EkIDoJqQekHpB6QOoBqQekHhBcEAk/BMKLouFl8dQDon8aC/2PMDT41AOCfAna+Ikv9YDUA1IPSD0g/J+hzA+ILoiEHwKpB0RPk0s9IPWAVjMCB+BKPWAASU13mSot1knXJrM+HqNt8EMbWw9QWmqdozs2AfX5N5Ewul/AF3Bismvn6nbnnm5Kfn3zQ9rU36aP2vzRdx2nzI/qFzBgp6crR183o2Ntqu1JUF/te9umzedyqr+NH13fwyR+AYMXaDszvO/IMBmeg+qh8t829bfJQ8DlflGt31TXQ3Byv4Au+ArcA4elyKiwBM7LTapN6fpyrWzbptx/lYvigXLo973mJ/ML+Gk/lUfgY8vxIqfvBusI6E5kv7U5CnSNkz/U7h9+gS8RQcnc60r6TgAAAABJRU5ErkJggg==";
  self.base64s[5] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAS1JREFUeF7tm0FqAkEURJ/GKEQQN248Qo7hrb2Gd3AvgopoYijpXmff7w80s9BN1XTVr5pmJsivCZClvQJ+AUwbERYyXkDWbwBvgE9gBnwMTkQH/gM8gUcI+Aa+gHlb2Q1Z+XN+H+keLAH/AO7ALQB3wKqREDn0nTCaL7y3fHvyAX8FziFgD2wbAd0UR/aCTsQNOAboAVgC68H133d094ETcCkCSgJlgjUG9UFIH4X1BOglUF2gukB1geoC6jKkr8P6FyL6MagPQvoorCdALwG9CerHoD4I1bmA/WBELwG9CerHoD4I6aOwngC9BPQmqB+D+iBUXaC6gPxoTG+C+jGoD0L6KKwnQC8BvQnqx2B1AXsU1pchvQT0Jqgfg/ogpI/CI38j+O/Hn2rwYecP1GExH8dnYW0AAAAASUVORK5CYII=";
  self.base64s[7] = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAYdJREFUeF7lm0tKA1EURE+M+Bcd61J0HNfsNtyDjhU/UVETSu6DlsQN3NPweNBND6r6VtXrQc2AO+AYOAdmtWh8rYCsR+A1gG+BC+BoQkDud70C/gdYAvcBegOcFQH7wC4wb4h+AP8CPoA34CkEXAGnwCEQAgJ+p8Ykz/Nilz1YQsBnEfAyCDipCdirCRhe0Al8MGX0v2sCIoHn/ySQCejoAwG/IYGY4GVJoCvwYWkjAbLHAx7ylfUxqCdAL4Ft54CuXrDVBHMOUMeg/iCkPwrrf4b0MagnQC8BvQnqY1BPgF4CehPUx6CeAL0E9Caoj0E9AXoJ6E1QH4N6AvQS0JugPgb1BOgloDdBfQzqCdBLQG+C+hjUE6CXgN4E9TGoJ0AvAb0J6mNQT4BeAnoT1MegngC9BKYmeFC1ua69wVGbe5/2Bq+rLxDwWSlLhIBulblRnExpYqM3mOJkwI/iZMcJSHNs9AYzAVm/vcFFFafTHR4SyP1MQl7osgdTvn4w/ZGA3gTVMbgGIBz9L4Sv+zQAAAAASUVORK5CYII=";
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
  ["bucket", "circle", "rectangle", "picker", "gblur"].forEach(function(id, i){
    modes[id] = options[id] || ["KeyB", "KeyG", "KeyT", "KeyY", "KeyQ"][i];  // Ver.1.31.7  // Ver.1.55.10
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
/* Ver.1.56.10 -> */
My_entry.pen.prototype.update_xy = function(e, xy0, xy1){
  var self = this;
  var arr = self.arr_data;
  var options = self.options;
  var x0 = xy0.x;
  var y0 = xy0.y;
  var x1 = xy1.x;
  var y1 = xy1.y;
  /* Ver.1.18.4 */
  /* Ver.1.13.4 */
  var stabi = options.stabi;
  var istabi = Math.floor(stabi);
  if(istabi > 0){
    var w = stabi-istabi;
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
    }
  }
  self.xy0 = {x: x1, y: y1};
  return self;
};
My_entry.pen.prototype.update_w = function(e, xy0, xy1){
  var self = this;
  var options = self.options;
  /* Ver.1.4.1 */
  var w0 = self.w0 || 0;
  var dx = xy1.x-xy0.x;
  var dy = xy1.y-xy0.y;
  var len = Math.sqrt(dx*dx+dy*dy);
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
    return Math.min(options.W, Math.max(0, w0+dw));
  };
  self.w0 = (options.pressure)? w_p(e.pressure): w_len(len);
  return self;
};
/* -> Ver.1.56.10 */
My_entry.pen.prototype.make_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // Ver.1.10.2
  var bg = self.objs.bg;  // Ver.1.7.1
  var ctx = fg.draw.ctx;
  /* Ver.1.54.10 -> */
  var get_offset = function(e){
    var _xy = fg.get_offset(e);
    _xy.x += options.ox;
    _xy.y += options.oy;
    return  _xy;
  };
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
      self.counter = 0;  // Ver.1.62.11
      /* Ver.1.4.1 -> */
      var xy1 = get_offset(e);  // Ver.1.54.10
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
      if(self.isDragging){
        e.preventDefault();
        e.stopPropagation();
        /* Ver.1.36.7 -> */
        var dxg = options["grid-width"];
        var dyg = options["grid-height"];
        var dxyg = {x: dxg, y: dyg};
        var hasGrid = (dxg > 0 && dyg > 0);
        var hasSnap = (options.snap && hasGrid);
        var xy1 = get_offset(e);  // Ver.1.54.10
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
        /* Ver.1.56.10 -> */
        var w0 = self.w0 || 0;  // || 0
        var w1 = w0;
        var data = null;
        var isPen = (self.mode <= 0);
        var useStabi = (isPen || self.mode === 5);
        if(useStabi){
          if(hasSnap){
            self.xy0 = xy1;
          }
          else{
            self.update_xy(e, xy0, xy1);
            xy1 = self.xy0;
            x1 = xy1.x;
            y1 = xy1.y;
          }
          self.update_w(e, xy0, xy1);
          w1 = self.w0;
        }
        /* -> Ver.1.56.10 */
        /* Ver.1.32.7 -> */
        if(isPen){  // Ver.1.34.7  // Ver.1.56.10
          /* Ver.1.4.1 -> */
          var dx = xy1.x-xy0.x;
          var dy = xy1.y-xy0.y;
          var len = Math.sqrt(dx*dx+dy*dy);
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
          /* Ver.1.62.11 -> */
          if(w0+w1){
            data = {xy0: xy0, xy1: xy1, w0: w0, w1: w1, xym0: xym0, xyp0: xyp0, xym1: xym1, xyp1: xyp1};  // Ver.1.2.0  // Ver.1.56.10
            /* Ver.1.35.7 */
            if(self.mode === 0){
              self.arr_vec.push({x: x1, y: y1});
            }
          }
          /* -> Ver.1.62.11 */
          /* -> Ver.1.4.1 */
          var isFrame_update = w0+w1 && (self.counter++)%options.df === 0;  // Ver.1.62.11  // Ver.1.64.12
          if(isFrame_update){  // Ver.1.62.11
            set_ctx();  // Ver.1.20.4
            /* Ver.1.46.8 -> */
            /* Ver.1.4.1 -> */
            /* Ver.1.61.11 -> */
            /* Ver.1.64.12 */
            /* Ver.1.63.11 */
            var draw_interp = function(callback){
              var len_p = Math.ceil(len/(options.dlen || 1));  // || not0
              var dw01 = (w1-w0)/len_p;
              var dx01 = (x1-x0)/len_p;
              var dy01 = (y1-y0)/len_p;
              for(var p=0; p<len_p; ++p){
                var wp = w0+dw01*p;
                var xp = x0+dx01*p;
                var yp = y0+dy01*p;
                callback(wp, xp, yp, wp+dw01, xp+dx01, yp+dy01);
              }
            };
            var hasImg = self.base64s[0];  // Ver.1.63.11
            var useImgPen = options.stripe !== "img" && hasImg;
            if(useImgPen){
              var base64 = self.base64s[0];  // Ver.1.63.11
              var theta = Math.atan2(dy, dx);
              /* Ver.1.64.12 */
              draw_interp(function(w0, x0, y0, w1, x1, y1){
                fg.draw_base64(base64, null, null, null, [theta, (x0+x1)/2, (y0+y1)/2, (w0+w1)/2, options.clip]);
              });
            }
            /* Ver.1.61.11 -> */
            else if(Math.min(w0, w1) < options.w_th){
              ctx.beginPath();
              ctx.moveTo(xym0.x, xym0.y);
              ctx.lineTo(xyp0.x, xyp0.y);
              ctx.lineTo(xyp1.x, xyp1.y);
              ctx.lineTo(xym1.x, xym1.y);
              ctx.fill();
            }
            else{
              /* Ver.1.64.12 */
              /* Ver.1.63.11 */
              draw_interp(function(w0, x0, y0, w1, x1, y1){
                ctx.beginPath();
                ctx.moveTo(x0, y0);
                ctx.lineWidth = w1;
                ctx.lineTo(x1, y1);
                ctx.stroke();
              });
            }
            /* Ver.1.58.10 -> */
            if(options.dash && len > 1.5 && Math.random() > (100-options.dash)/100){
              var kw = w1/(options.W || 1);  // || not0
              ctx.save();
              ctx.lineWidth = (w1/2)*kw*kw || 1e-3;  // not0
              ctx.globalCompositeOperation = "destination-out";
              ctx.beginPath();
              ctx.moveTo(x0, y0);
              ctx.lineTo(x1, y1);
              ctx.stroke();
              ctx.restore();
            }
            /* -> Ver.1.58.10 */
            /* Ver.1.59.10 -> */
            if(!(useImgPen) && options.stripe && len > 1.5){  // Ver.1.61.11
              var base64 = "";
              switch(options.stripe){
                // W=8,A=50,canvas=64,grid=4,pressure
                case 3:
                case 5:
                case 7:
                  base64 = self.base64s[options.stripe];  // Ver.1.63.11
                  break;
                default:
                  base64 = self.base64s[0];  // Ver.1.61.11  // Ver.1.63.11
                  break;
              }
              var theta = Math.atan2(dy, dx);
              /* Ver.1.64.12 */
              draw_interp(function(w0, x0, y0, w1, x1, y1){
                fg.draw_base64(base64, null, null, "destination-out", [theta, (x0+x1)/2, (y0+y1)/2, (w0+w1)/2, options.clip]);  // Ver.1.60.10  // Ver.1.61.11
              });
            }
            /* -> Ver.1.59.10 */
            /* -> Ver.1.4.1 */
            /* -> Ver.1.46.8 */
          }
        }
        else{
          fg.clear();
          var r = (hasGrid)? Math.min(6, Math.min(dxg, dyg)/2): 6;
          switch(self.mode){
            case 2:
            case 3:
              fg.draw.marker_circle({x: x0, y: y0}, r/2, r, "#000000", "#ffffff");
              break;
            /* Ver.1.55.10 */
            case 5:
              data = {xy0: xy0, xy1: xy1};  // Ver.1.56.10
              var s = Math.min(Math.sqrt(w1), 10);  // Ver.1.56.10
              var sk = 4;
              bg.putID(self.filter.run_gblur(bg.ctx, x1, y1, s, sk));
              break;
            default:
              break;
          }
          fg.draw.marker_circle({x: x1, y: y1}, r/2, r, "#000000", "#ffffff");
        }
        /* -> Ver.1.32.7 */
        /* Ver.1.56.10 -> */
        if(data){
          self.arr_data.push(data);
        }
        /* -> Ver.1.56.10 */
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
      var dxg = options["grid-width"];
      var dyg = options["grid-height"];
      var dxyg = {x: dxg, y: dyg};
      var hasLimit_A = (options.A < 0);  // Ver.1.49.9
      var hasGrid = (dxg > 0 && dyg > 0);
      var hasSnap = (options.snap && hasGrid);
      var hasMosaic = (options.mosaic && hasGrid);  // Ver.1.49.9
      var xy1 = get_offset(e);  // Ver.1.54.10
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
            var text_filter = "fiin["+(x1)+","+(y1)+","+rgba.r+","+rgba.g+","+rgba.b+","+rgba.a+","+(options.Nwrap || 16);  // text=""+(x)+""
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
            ctx.arc(x0, y0, len, 0, Math.PI*2);
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
            ctx.fillRect(x, y, width, height);
            if(hasStyle){
              ctx.strokeRect(x, y, width, height);
            }
            self.arr_data = {x: x, y: y, width: width, height: height};
            break;
          case 4:
            var ID_picked = bg.getID_xy(x1, y1);
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
          /* Ver.1.56.10 */
          case 5:
            self.arr_data = [];
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
      self.isDragging = false;  // sync
      /* -> Ver.1.21.5 */
    }
  };
  /* -> Ver.1.54.10 */
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
    $._id("input-W").onchange(e);  // Ver.1.53.10
    self.reset_canvas();
    self.update_options();  // Ver.1.35.7 re-update
    /* Ver.1.64.11 -> */
    if(options.image){
      self.base64s[0] = self.base64s[7];
    }
    /* -> Ver.1.64.11 */
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    if(self.isLocked) return false;  // Ver.1.28.7 all-buttons
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
      /* Ver.1.61.11 */
      case "input-file-pen":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          self.base64s[0] = base64;  // Ver.1.63.11
          $._id("input-dash").value = 0;
          $.set_selectVal_id("select-stripe", "0");
        });
        if(!(file)){
          elem.value = null;
          /* Ver.1.64.11 -> */
          if(options.image){
            self.base64s[0] = self.base64s[7];
          }
          else{
            self.base64s[0] = null;  // Ver.1.63.11
          }
          /* -> Ver.1.64.11 */
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
