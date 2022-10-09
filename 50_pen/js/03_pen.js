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
  self.keys = {modes: {}, buttons: {}};  // Ver.1.15.4  // Ver.1.16.4  // Ver.1.19.4
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
  var modes = keys.modes;
  var buttons = keys.buttons;
  /* Ver.1.19.4 -> */
  self.mode = 0;
  ["bucket", "circle", "rectangle", "picker"].forEach(function(id, i){
    modes[id] = options[id] || ["KeyB", "KeyG", "KeyT", "KeyY"][i];  // Ver.1.31.7
  });
  ["<<", ">>", "clear", "run"].forEach(function(id, i){
    buttons[id] = options[id] || ["KeyS", "KeyD", "KeyA", "KeyW"][i];  // Ver.1.17.4
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
      Object.keys(modes).forEach(function(id, i){
        if(modes[id] === e.code){
          mode = i+1;
        }
      });
      Object.keys(buttons).forEach(function(id){
        if(buttons[id] === e.code){
          var elem = $._id(id);
          if(elem){
            elem.onclick(e);
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
My_entry.pen.prototype.update_options = function(){
  var self = this;
  var $ = self.entry.$;
  $.get_elemProps("input[type='checkbox']", "checkbox-", "checked", self.options);
  $.get_elemProps("input[type='color']", "input-", "value", self.options);
  $.get_elemProps("input[type='number']", "input-", "value", self.options);
  $.get_elemProps("select", "select-", "value", self.options);
  $.get_urlParams(self.options);
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
  var options = self.options;
  var mg = self.objs.mg;
  mg.clear();
  mg.draw_lines_grid(options["grid-width"], options["grid-height"], 0.5, "#00000033");  // Ver.1.10.4
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
    var alpha = Math.abs(options.A)/100;  // Ver.1.6.1
    var sh = Math.abs(options.sh);  // Ver.1.21.4
    ctx.shadowBlur = sh;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowColor = options.RGB;
    ctx.fillStyle = ctx.strokeStyle = options.RGB;
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = options.composite;
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
      /* Ver.1.19.4 -> */
      if(options.W <= 0){
        self.mode = self.mode || 1+Math.ceil(-options.W);  // Key first
      }
      /* -> Ver.1.19.4 */
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
      /* Ver.1.32.7 -> */
      if(self.mode === 0){
        var xy1 = fg.get_offset(e);
        var x1 = xy1.x;
        var y1 = xy1.y;
        /* Ver.1.18.4 -> */
        /* Ver.1.13.4 -> */
        var stabi = options.stabi;
        var istabi = Math.floor(stabi);
        if(istabi > 0){
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
        var xy0 = self.xy0 || xy1;
        var x0 = xy0.x;
        var y0 = xy0.y;
        self.xy0 = xy1;
        /* Ver.1.4.1 -> */
        var dx = x1-x0;
        var dy = y1-y0;
        var len = Math.sqrt(dx*dx+dy*dy);
        var w0 = self.w0 || 0;  // || 0
        var w1 = (options.pressure)? w_p(e.pressure): w_len(len);
        self.w0 = w1;
        var k = (w1/2)/len;
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
          /* Ver.1.5.1 -> */
          var ox = options.ox;
          var oy = options.oy;
          /* -> Ver.1.5.1 */
          set_ctx();  // Ver.1.20.4
          ctx.lineWidth = w1;  // Ver.1.4.1
          ctx.beginPath();
          /* Ver.1.4.1 -> */
          if(Math.min(w0, w1) < options.w_th){
            ctx.moveTo(xym0.x+ox, xym0.y+oy);
            ctx.lineTo(xyp0.x+ox, xyp0.y+oy);
            ctx.lineTo(xyp1.x+ox, xyp1.y+oy);
            ctx.lineTo(xym1.x+ox, xym1.y+oy);
            ctx.fill();
          }
          else{
            ctx.moveTo(x0+ox, y0+oy);
            ctx.lineTo(x1+ox, y1+oy);
            ctx.stroke();
          }
          /* -> Ver.1.4.1 */
        }
      }
      else{
        /* pasted -> */
        var dxg = options["grid-width"];
        var dyg = options["grid-height"];
        var dxyg = {x: dxg, y: dyg};
        var hasGrid = (dxg > 0 && dyg > 0);
        if(self.mode){
          fg.clear();
          var ox = options.ox;
          var oy = options.oy;
          var xy1 = fg.get_offset(e);
          var xy0 = self.xy0 || xy1;
          if(hasGrid){
            xy0 = fg.draw.xy2xy_snapped(xy0, dxyg);
            xy1 = fg.draw.xy2xy_snapped(xy1, dxyg);
          }
          var x0 = xy0.x;
          var y0 = xy0.y;
          var x1 = xy1.x;
          var y1 = xy1.y;
        /* -> pasted */
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
      }
      /* -> Ver.1.32.7 */
      }
    },
    onmouseup: function(e){
      e.preventDefault();
      e.stopPropagation();
      if(self.isRunning) return false;  // Ver.1.29.7 down failed
      /* Ver.1.7.1 -> */
      /* Ver.1.6.1 -> */
      /* Ver.1.12.4 -> */
      var ID = null;
      var alpha = Math.abs(options.A)/100;  // Ver.1.30.7
      /* Ver.1.32.7 -> */
      /* Ver.1.20.4 -> */
      var dxg = options["grid-width"];
      var dyg = options["grid-height"];
      var dxyg = {x: dxg, y: dyg};
      var hasGrid = (dxg > 0 && dyg > 0);
      if(self.mode){
        fg.clear();  // Ver.1.32.7
        var ox = options.ox;
        var oy = options.oy;
        var xy1 = fg.get_offset(e);
        var xy0 = self.xy0 || xy1;
        if(hasGrid){
          xy0 = fg.draw.xy2xy_snapped(xy0, dxyg);
          xy1 = fg.draw.xy2xy_snapped(xy1, dxyg);
        }
        var x0 = xy0.x;
        var y0 = xy0.y;
        var x1 = xy1.x;
        var y1 = xy1.y;
        var dx = x1-x0;
        var dy = y1-y0;
        var len = Math.sqrt(dx*dx+dy*dy);
        switch(self.mode){
          /* Ver.1.30.7 */
          case 1:
            var rgba = fg.draw.color2rgba(options.RGB);
            /* Ver.1.26.7 -> */
            rgba.a = Math.round(255*alpha);  // round(float)@ID -> 0~255
//            var color_hex = fg.draw.rgba2color_hex(rgba);
//            var color_rgba = "rgba("+rgba.r+","+rgba.g+","+rgba.b+","+alpha+")";
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
            set_ctx();
            ctx.beginPath();
            ctx.arc(x0+ox, y0+oy, len, 0, Math.PI*2);
            ctx.fill();
            self.arr_data = {cx: cx, cy: cy, r: r};
            break;
          case 3:
            var x = Math.min(x0, x1);
            var y = Math.min(y0, y1);
            var width = Math.max(x0, x1)-x;
            var height = Math.max(y0, y1)-y;
            set_ctx();
            ctx.fillRect(x+ox, y+oy, width, height);
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
      }
      /* -> Ver.1.20.4 */
      /* -> Ver.1.32.7 */
    /* Ver.1.26.7 -> */
    if(self.mode !== 1){
      if(options.A < 0){
        ID = fg.getID_alpha(alpha);
      }
      if(options.mosaic){
        if(hasGrid){
          var rgba = fg.draw.color2rgba(options.RGB);
          ID = fg.draw.filter_mosaic(ID, options["grid-width"], options["grid-height"], options.mosaic, [rgba.r, rgba.g, rgba.b, 255*alpha]);
          if(options["with-svg"]){
            self.arr_data = {ID: ID};
          }
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
      var callback = function(){
        self.handler_history_ID.save(bg.getID());  // Ver.1.1.0
        fg.clear();
        self.handler_history_svg.save(self.make_svg_lines());  // Ver.1.2.0
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
      /* Ver.1.21.4 -> */
      if(options.sh < 0){
        var len_sh = Math.min(100, -options.sh);
        var arr_base64 = [];
        for(var nsh=0; nsh<len_sh+1; ++nsh){
          arr_base64.push(base64_fg);
        }
        bg.draw_base64s(arr_base64, callback, options.composite);
      }
      else{
        bg.draw_base64(base64_fg, null, callback, options.composite);  // Ver.1.11.4
      }
      /* -> Ver.1.21.4 */
      /* -> Ver.1.6.1 */
      /* -> Ver.1.7.1 */
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
    self.objs.fg.draw.setter.decDigit((isNaN(options.decDigit)? 1: options.decDigit));  // Ver.1.2.0
    $.change_elems$("input[type='checkbox']");
    self.reset_canvas();
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
          self.run_filter(bg, $.inputVal_id("input-text-filter"), true);  // Ver.1.26.7
          self.handler_history_ID.save(bg.getID());
          self.handler_history_svg.save("");
          $._id("run").innerText = label0;
          self.isRunning = false;  // Ver.1.29.7
          self.isLocked = false;  // Ver.1.28.7
        }, 50);
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
          $._id("input-w_th").value = (1-Math.pow(Math.E, -0.04332169878499659*W))*8;
          $._id("input-len_th").value = 5+Math.max(0, 5*(W-16)/(128-16));
          $._id("input-in").value = 0.4*W/16;
          $._id("input-out").value = (W < 32)? Math.max(0.8, W/8): -W/32;
          self.update_options();  // including URL-parameter
        }
        break;
      case "select-canvas-width":
      case "select-canvas-height":
      case "select-bgcolor":  // Ver.1.7.1
        self.reset_canvas();
        break;
      /* Ver.1.10.2 */
      case "input-grid-width":
      case "input-grid-height":
        self.reset_canvas_grid();
        break;
      /* Ver.1.11.4 -> */
      case "input-file-fg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          fg.draw_base64(base64, null, null, options.composite);
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
