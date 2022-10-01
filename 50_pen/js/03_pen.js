// online-simulator.github.io

My_entry.pen = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.pen, My_entry.original_main);

My_entry.pen.prototype.init = function(){
  var self = this;
  self.objs = {};
  self.options = {};
  self.keys = {modes: {}, buttons: {}};  // 1.15.4  // 1.16.4  // 1.19.4
  self.init_main.call(self, ["$", "conv", "def"]);
  self.filter = new self.constructors.filter();  // 1.17.4
  return self;
};
/* 1.16.4 */
My_entry.pen.prototype.init_keys = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var keys = self.keys;
  var modes = keys.modes;
  var buttons = keys.buttons;
  /* 1.19.4 -> */
  self.mode = 0;
  ["bucket", "circle", "rectangle"].forEach(function(id, i){
    modes[id] = options[id] || ["KeyB", "KeyG", "KeyT"][i];
  });
  ["<<", ">>", "clear", "run"].forEach(function(id, i){
    buttons[id] = options[id] || ["KeyS", "KeyD", "KeyA", "KeyW"][i];  // 1.17.4
  });
  /* 1.15.4 -> */
  document.onkeydown = function(e){
    keys.code = e.code;
    keys.keyCode = e.keyCode;
    keys.ctrlKey = e.ctrlKey;
    keys.shiftKey = e.shiftKey;
    var TAG = document.activeElement.tagName.toUpperCase();
    var isNG_fire = (self.mode || self.isDragging || e.ctrlKey || e.shiftKey || TAG === "INPUT" || TAG === "SELECT");
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
  /* 1.17.4 */
  document.onkeyup = function(e){
    keys.code = e.code;
    keys.keyCode = e.keyCode;
    keys.ctrlKey = e.ctrlKey;
    keys.shiftKey = e.shiftKey;
    self.mode = 0;
  };
  /* -> 1.15.4 */
  /* -> 1.19.4 */
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
/* 1.2.0 -> */
My_entry.pen.prototype.make_svg = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // 1.7.1
  var _svg = "";
  var fg = self.objs.fg;
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  var i_header = -1;
  for(var i=len-1; i>=0; --i){
    if(rev[i].substring(0, 5) === "<?xml"){
      i_header = i;
      break;
    }
  }
  if(i_header >= 0){
    for(var i=i_header; i<len; ++i){
      _svg += rev[i];
    }
    _svg += fg.draw.footer();
  }
  return _svg;
};
My_entry.pen.prototype.make_svg_header = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // 1.7.1
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
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_svg);  // 1.7.1
  var _svg = "";
  var options = self.options;
  var fg = self.objs.fg;
  /* 1.3.0 -> */
  var rev = self.handler_history_svg.rev;
  var len = rev.length;
  /* 1.12.4 -> */
  var hasFilter = self.arr_data.data;
  var sw_method = "lines_pen"+((hasFilter)? "_mosaic": "");
  _svg += fg.draw[sw_method]("id"+(len-1), self.arr_data, options);
  /* -> 1.12.4 */
  /* -> 1.3.0 */
  return _svg;
};
/* -> 1.2.0 */
/* 1.11.4 */
My_entry.pen.prototype.change_size = function(px_w, px_h){
  var self = this;
  var $ = self.entry.$;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // 1.10.2
  var bg = self.objs.bg;  // 1.7.1
  $.set_id("div-canvas", "width", (1+px_w+1)+"px");  // 1.10.3
  $.set_id("div-canvas", "height", (1+px_h+1)+"px");
  fg.change_size(px_w, px_h);
  mg.change_size(px_w, px_h);  // 1.10.2
  bg.change_size(px_w, px_h);
  return self;
};
My_entry.pen.prototype.reset_canvas = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);  // 1.7.1
  var $ = self.entry.$;
  var options = self.options;
  /* 1.7.1 -> */
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // 1.10.2
  var bg = self.objs.bg;  // 1.7.1
  var px_w = options["canvas-width"];
  var px_h = options["canvas-height"];
  var bgcolor = options.bgcolor;
  self.change_size(px_w, px_h);  // 1.11.4
  if(bgcolor){
    bg.fill(bgcolor);
  }
  else{
    bg.clear();
  }
  self.handler_history_ID.save(bg.getID());  // 1.1.0
  fg.clear();
  /* -> 1.7.1 */
  self.handler_history_svg.save(self.make_svg_header());  // 1.2.0
  $._id("input-file-fg").value = null;  // 1.11.4
  $._id("input-file-bg").value = null;  // 1.8.1
  self.reset_canvas_grid();  // 1.10.2
  return self;
};
/* 1.10.2 */
My_entry.pen.prototype.reset_canvas_grid = function(){
  var self = this;
  var options = self.options;
  var mg = self.objs.mg;
  mg.clear();
  mg.draw_lines_grid(options["grid-width"], options["grid-height"], 0.5, "#00000033");  // 1.10.4
  return self;
};
/* 1.17.4 */
My_entry.pen.prototype.run_filter = function(obj_canvas, text_filter){
  var self = this;
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
        params.content = content;  // 1.13.7
        obj_canvas.putID_xy(self.filter.run(obj_canvas.ctx, params), params.is, params.js);
      });
    };
    callback_filter();
  }
  return self;
};
My_entry.pen.prototype.make_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
  var mg = self.objs.mg;  // 1.10.2
  var bg = self.objs.bg;  // 1.7.1
  var ctx = fg.draw.ctx;
  var _handlers = {
    onmousedown: function(e){
      self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);  // 1.7.1
      e.preventDefault();
      e.stopPropagation();
      self.isDragging = true;
      /* 1.4.1 -> */
      var xy1 = fg.get_offset(e);
      self.xy0 = xy1;
      self.xym0 = xy1;
      self.xyp0 = xy1;
      /* -> 1.4.1 */
      self.w0 = 0;
      self.arr_data = [];  // 1.2.0
      /* 1.19.4 -> */
      if(options.W <= 0){
        var iW = Math.floor(options.W);
        self.mode = self.mode || Math.abs(iW)+1;  // Key first
      }
      if(self.mode){
        switch(self.mode){
          /* 1.15.4 */
          case 1:
            var rgba = fg.draw.color2rgba(options.RGB);
            var alpha = Math.abs(options.A)/100;
            rgba.a = 255*alpha;
            var color_hex = fg.draw.rgba2color_hex(rgba);
            self.run_filter(bg, "fiin["+xy1.x+","+xy1.y+","+color_hex+","+(options.Nwrap || 16)+"]");  // 1.17.4
            break;
          case 2:
            break;
          case 3:
            break;
          default:
            break;
        }
        self.isDragging = false;
      }
      /* -> 1.19.4 */
    },
    onmousemove: function(e){
      var w_p = function(p){
        return options.W*p;
      };
      /* 1.5.1 */
      var w_len = function(len){
        var dw = 0;
        var dlen = len-options.len_th;  // 1.4.1
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
        var xy1 = fg.get_offset(e);
        var x1 = xy1.x;
        var y1 = xy1.y;
        /* 1.18.4 -> */
        /* 1.13.4 -> */
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
        /* -> 1.13.4 */
        /* -> 1.18.4 */
        var xy0 = self.xy0 || xy1;
        var x0 = xy0.x;
        var y0 = xy0.y;
        self.xy0 = xy1;
        /* 1.4.1 -> */
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
          self.arr_data.push({xy0: xy0, xy1: xy1, w0: w0, w1: w1, xym0: xym0, xyp0: xyp0, xym1: xym1, xyp1: xyp1});  // 1.2.0
        /* -> 1.4.1 */
          /* 1.5.1 -> */
          var ox = options.ox;
          var oy = options.oy;
          /* -> 1.5.1 */
          var alpha = Math.abs(options.A)/100;  // 1.6.1
          ctx.shadowBlur = options.sh;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = options.RGB;
          ctx.fillStyle = ctx.strokeStyle = options.RGB;
          ctx.globalAlpha = alpha;
          ctx.globalCompositeOperation = options.composite;
          ctx.lineCap = options.cap;
          ctx.lineWidth = w1;  // 1.4.1
          ctx.beginPath();
          /* 1.4.1 -> */
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
          /* -> 1.4.1 */
        }
      }
    },
    onmouseup: function(e){
      e.preventDefault();
      e.stopPropagation();
      /* 1.7.1 -> */
      /* 1.6.1 -> */
      /* 1.12.4 -> */
      var ID = null;
      var alpha = Math.abs(options.A)/100;
      if(options.A < 0){
        ID = fg.getID_alpha(alpha);
      }
      if(options.mosaic){
        var hasGrid = (options["grid-width"] > 0 && options["grid-height"] > 0);
        if(hasGrid){
          var rgba = fg.draw.color2rgba(options.RGB);
          ID = fg.draw.filter_mosaic(ID, options["grid-width"], options["grid-height"], options.mosaic, [rgba.r, rgba.g, rgba.b, 255*alpha]);
          if(options["with-svg"]){
            self.arr_data = ID;
          }
        }
      }
      if(ID){
        fg.putID(ID);
      }
      /* -> 1.12.4 */
      var base64_fg = fg.get_base64();
      var callback = function(){
        self.handler_history_ID.save(bg.getID());  // 1.1.0
        fg.clear();
      }
      bg.draw_base64(base64_fg, null, callback, options.composite);  // 1.11.4
      /* -> 1.6.1 */
      /* -> 1.7.1 */
      self.handler_history_svg.save(self.make_svg_lines());  // 1.2.0
      self.mode = 0;  // 1.19.4
      self.isDragging = false;
    }
  };
  return _handlers;
};
My_entry.pen.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  /* 1.14.4 */
  self.handlers.onload = function(e){
    var self = this;
    self.update_options();
    self.init_keys();  // 1.16.4
    var json = {p: {id: "wrapper-link-png"}, a: {id: "a-png", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.objs.bg.get_base64());});  // 1.7.1
    /* 1.2.0 -> */
    var json = {p: {id: "wrapper-link-svg"}, a: {id: "a-svg", it: "-svg(src-over)"}, name: "download", ext: "svg"};
    self.handler_link_svg = new self.constructors.handler_link(json);
    self.handler_link_svg.setter.callback(function(){return self.make_svg();});
    self.handler_history_ID = new self.constructors.handler_history(options.history_len_max);  // 1.1.0
    self.handler_history_svg = new self.constructors.handler_history(10000);  // about 10000 lines
    /* -> 1.2.0 */
    self.drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    /* 1.7.1 -> */
    self.objs.fg = new self.constructors.canvas($._id("canvas-fg"));
    self.objs.mg = new self.constructors.canvas($._id("canvas-mg"));  // 1.10.2
    self.objs.bg = new self.constructors.canvas($._id("canvas-bg"));
    /* -> 1.7.1 */
    self.objs.fg.attach_point(self.make_handlers());
    self.objs.fg.draw.setter.decDigit((isNaN(options.decDigit)? 1: options.decDigit));  // 1.2.0
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
    var fg = self.objs.fg;
    var mg = self.objs.mg;  // 1.10.2
    var bg = self.objs.bg;  // 1.7.1
    self.update_options();
    switch(elem.id){
      /* 1.7.1 -> */
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
      /* -> 1.7.1 */
      /* 1.17.4 */
      case "run":
        var label0 = elem.innerText;
        elem.innerText = label0+"...";
        setTimeout(function(){
          self.run_filter(bg, $.inputVal_id("input-text-filter"));
          self.handler_history_ID.save(bg.getID());
          self.handler_history_svg.save("");
          $._id("run").innerText = label0;
        }, 50);
        break;
      /* 1.1.0 -> */
      case "<<":
        var ID = self.handler_history_ID.reverse();
        if(ID){
          bg.putID(ID);  // 1.7.1
          self.handler_history_svg.reverse();  // 1.2.0  // 1.3.1
        }
        break;
      case ">>":
        var ID = self.handler_history_ID.forward();
        if(ID){
          bg.putID(ID);  // 1.7.1
          self.handler_history_svg.forward();  // 1.2.0  // 1.3.1
        }
        break;
      /* -> 1.1.0 */
      case "clear":
        self.reset_canvas();
        break;
      /* 1.17.4 */
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var fg = self.objs.fg;
    var mg = self.objs.mg;  // 1.10.2
    var bg = self.objs.bg;  // 1.7.1
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
        $.set_elem($._id("div-canvas"), "background", ((options.black)? "black": "white"));  // options.black
        break;
      case "select-canvas-width":
      case "select-canvas-height":
      case "select-bgcolor":  // 1.7.1
        self.reset_canvas();
        break;
      /* 1.10.2 */
      case "input-grid-width":
      case "input-grid-height":
        self.reset_canvas_grid();
        break;
      /* 1.11.4 -> */
      case "input-file-fg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          fg.draw_base64(base64, null, null, options.composite);
        });
        if(!(file)){
          elem.value = null;
        }
        break;
      /* 1.8.1 */
      case "input-file-bg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          // self.entry.conv.base2img
          var callback_first = function(e){
            var px_w = e.target.width;
            var px_h = e.target.height;
            self.change_size(px_w, px_h);  // 1.11.4
          };
          var callback_last = function(){
            self.handler_history_ID.save(bg.getID());
          };
          bg.draw_base64(base64, callback_first, callback_last, options.composite);
          self.handler_history_svg.save("");
        });
        if(!(file)){
          elem.value = null;
        }
        break;
      /* -> 1.11.4 */
      default:
        break;
    }
    return self;
  };
  return self;
};
