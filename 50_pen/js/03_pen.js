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
  self.init_main.call(self, ["$", "conv"]);
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
My_entry.pen.prototype.reset_canvas = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
  var ctx = fg.draw.ctx;
  var px_w = options["canvas-width"];
  var px_h = options["canvas-height"];
  var bg = options.bg;
  fg.change_size(px_w, px_h);
  ctx.save();
  if(bg){
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, px_w, px_h);
    ctx.fill();
  }
  else{
    ctx.clearRect(0, 0, px_w, px_h);
  }
  ctx.restore();
  self.handler_history_ID.save(fg.getID());
  return self;
};
My_entry.pen.prototype.make_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  var options = self.options;
  var fg = self.objs.fg;
  var ctx = fg.draw.ctx;
  var _handlers = {
    onmousedown: function(e){
      e.preventDefault();
      e.stopPropagation();
      self.isDragging = true;
      self.xy0 = fg.get_offset(e);
      self.w0 = 0;
    },
    onmousemove: function(e){
      var w_p = function(p){
        return options.W*p;
      };
      var w_len = function(len){
        var _w = self.w0;
        var dlen = len-options.th;
        if(dlen > 0){
          _w += (options.out < 0)? dlen*options.out: -options.out;
        }
        else{
          _w += (options.in < 0)? dlen*options.in: options.in;
        }
        return Math.min(options.W, Math.max(0, _w));
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
        var len = Math.sqrt((x1-x0)*(x1-x0)+(y1-y0)*(y1-y0));
        var w = (options.pressure)? w_p(e.pressure): w_len(len);
        self.w0 = w;
        if(w){
          var dx = options.dx;
          var dy = options.dy;
          ctx.shadowBlur = options.sh;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          ctx.shadowColor = options.RGB;
          ctx.fillStyle = ctx.strokeStyle = options.RGB;
          ctx.globalAlpha = options.A/100;
          ctx.globalCompositeOperation = options.composite;
          ctx.lineCap = options.cap;
          ctx.lineWidth = w;
          ctx.beginPath();
          ctx.moveTo(x0+dx, y0+dy);
          ctx.lineTo(x1+dx, y1+dy);
          ctx.stroke();
        }
      }
    },
    onmouseup: function(e){
      e.preventDefault();
      e.stopPropagation();
      self.handler_history_ID.save(fg.getID());
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
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.objs.fg.get_base64());});
    self.handler_history_ID = new self.constructors.handler_history();
    self.drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    self.objs.fg = new self.constructors.canvas($._id("canvas"));
    self.objs.fg.attach_point(self.make_handlers());
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
    self.update_options();
    switch(elem.id){
      case "<<":
        var ID = self.handler_history_ID.reverse();
        if(ID){
          self.objs.fg.putID(ID);
        }
        break;
      case ">>":
        var ID = self.handler_history_ID.forward();
        if(ID){
          self.objs.fg.putID(ID);
        }
        break;
      case "clear":
        self.reset_canvas();
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
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
      case "select-bg":
        self.reset_canvas();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
