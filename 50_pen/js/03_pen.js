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
  self.init_main.call(self, ["$", "conv", "def"]);
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
  _svg += fg.draw.lines_pen("id"+(len-1), self.arr_data, options);
  /* -> 1.3.0 */
  return _svg;
};
/* -> 1.2.0 */
My_entry.pen.prototype.reset_canvas = function(){
  var self = this;
  self.entry.def.mix_over(self.constructors.draw, self.constructors.draw_canvas);  // 1.7.1
  var $ = self.entry.$;
  var options = self.options;
  /* 1.7.1 -> */
  var fg = self.objs.fg;
  var bg = self.objs.bg;
  var px_w = options["canvas-width"];
  var px_h = options["canvas-height"];
  var bgcolor = options.bgcolor;
  $.set_id("div-canvas", "width", "100%");
  $.set_id("div-canvas", "height", (1+px_h+1)+"px");
  fg.change_size(px_w, px_h);
  bg.change_size(px_w, px_h);
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
  $._id("input-file-bg").value = null;  // 1.8.1
  return self;
};
My_entry.pen.prototype.make_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
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
      if(options.A < 0){
        var alpha = Math.abs(options.A)/100;
        fg.putID(fg.getID_alpha(alpha));
      }
      var base64_fg = fg.get_base64();
      var callback = function(){
        self.handler_history_ID.save(bg.getID());  // 1.1.0
        fg.clear();
      }
      bg.draw_base64(base64_fg, callback, options.composite);
      /* -> 1.6.1 */
      /* -> 1.7.1 */
      self.handler_history_svg.save(self.make_svg_lines());  // 1.2.0
      self.isDragging = false;
    }
  };
  return _handlers;
};
My_entry.pen.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  self.handlers.onload = function(e){
    var self = this;
    var json = {p: {id: "wrapper-link-png"}, a: {id: "a-png", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.objs.bg.get_base64());});  // 1.7.1
    /* 1.2.0 -> */
    var json = {p: {id: "wrapper-link-svg"}, a: {id: "a-svg", it: "-svg(src-over)"}, name: "download", ext: "svg"};
    self.handler_link_svg = new self.constructors.handler_link(json);
    self.handler_link_svg.setter.callback(function(){return self.make_svg();});
    self.handler_history_ID = new self.constructors.handler_history();  // 1.1.0
    self.handler_history_svg = new self.constructors.handler_history(10000);  // about 10000 lines
    /* -> 1.2.0 */
    self.drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    /* 1.7.1 -> */
    self.objs.fg = new self.constructors.canvas($._id("canvas-fg"));
    self.objs.bg = new self.constructors.canvas($._id("canvas-bg"));
    /* -> 1.7.1 */
    self.objs.fg.attach_point(self.make_handlers());
    self.objs.fg.draw.setter.decDigit(1);  // 1.2.0
    $.change_elems$("input[type='checkbox']");
    self.update_options();
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
    var bg = self.objs.bg;
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
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var fg = self.objs.fg;
    var bg = self.objs.bg;
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
      /* 1.8.1 -> */
      case "input-file-bg":
        var file = $.readFile_elem(elem, /^image/, function(e){
          var base64 = e.target.result;
          var callback = function(){
            self.handler_history_ID.save(bg.getID());
          };
          bg.draw_base64(base64, callback, options.composite);
          self.handler_history_svg.save("");
        });
        if(!(file)){
          elem.value = null;
        }
        break;
      /* -> 1.8.1 */
      default:
        break;
    }
    return self;
  };
  return self;
};
