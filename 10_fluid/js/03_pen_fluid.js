// online-simulator.github.io

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
/* fluid-Ver.1.18.0 */
My_entry.pen.prototype.make_csv = function(){
  var self = this;
  var $ = self.entry.$;
  var ds = My_entry.$.config.DELIMITER;
  var dq = ds.dq;
  var ca = ds.ca;
  var rn = ds.rn;
  var _csv = "";
  var uvp = self.uvp;
  if(uvp){
    _csv += My_entry.VERSION;
    _csv += ca;
    _csv += My_entry.Ver.fluid;
    _csv += rn;
    _csv += rn;
    _csv += "t";
    _csv += ca;
    _csv += uvp.t;
    _csv += rn;
    _csv += rn;
    ["u", "v", "p"].forEach(function(sw_uvp){
      var out = uvp[sw_uvp];
      /* fluid-Ver.1.41.0 -> */
      _csv += sw_uvp+"(y|x->)";
      _csv += ca;
      for(var i=0; i<uvp.Ni; ++i){
        _csv += uvp.dx*(i+0.5);
        _csv += ca;
      }
      _csv += rn;
      for(var j=0; j<uvp.Nj; ++j){
        _csv += uvp.dy*(j+0.5);
        _csv += ca;
        for(var i=0; i<uvp.Ni; ++i){
          _csv += (typeof out[i][j] === "undefined")? "": out[i][j];
          _csv += ca;
        }
        _csv += rn;
      }
      _csv += rn;
      /* -> fluid-Ver.1.41.0 */
    });
  }
  return _csv;
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
/* fluid-Ver.1.24.0 -> */
My_entry.pen.prototype.update_arr2d_vec = function(){
  var self = this;
  var options = self.options;  // fluid-Ver.1.30.0
  var uvp = self.uvp;
  if(uvp){
    var t = uvp.t;
    var c = uvp.cmax;
    var q = uvp.qtotal;
    /* fluid-Ver.1.23.0 -> */
    uvp._arr_t = uvp._arr_t || [];
    uvp._arr_c = uvp._arr_c || [];
    uvp._arr_q = uvp._arr_q || [];
    uvp._arr_t.push([t]);
    uvp._arr_c.push([c]);
    uvp._arr_q.push([q]);
    /* fluid-Ver.1.34.0 -> */
    ["Re", "sx", "sy"].forEach(function(sw_plot){
      var prop = "_arr_"+sw_plot;
      uvp[prop] = uvp[prop] || [];
      uvp[prop].push([uvp[sw_plot]]);
    });
    /* -> fluid-Ver.1.34.0 */
    ["umin", "umax", "vmin", "vmax", "pmin", "pmax"].forEach(function(sw_plot){
      var prop = "_arr_"+sw_plot;
      uvp[prop] = uvp[prop] || [];
    /* -> fluid-Ver.1.23.0 */
      uvp[prop].push([uvp["_"+sw_plot]]);
    });
    /* fluid-Ver.1.30.0 -> */
    ["uij", "vij", "pij"].forEach(function(sw_plot){
      var prop = "_arr_"+sw_plot;
      uvp[prop] = uvp[prop] || [];
      var i_plot = self.entry.def.limit(options.i_plot, 0, uvp.Ni-1, uvp.Ni-1);
      var j_plot = self.entry.def.limit(options.j_plot, 0, uvp.Nj-1, uvp.Nj-1);
      uvp[prop].push([uvp[sw_plot.charAt(0)][i_plot][j_plot]]);
    });
    /* -> fluid-Ver.1.30.0 */
  }
  return self;
};
My_entry.pen.prototype.make_csv1 = function(){
  var self = this;
  var $ = self.entry.$;
  var ds = My_entry.$.config.DELIMITER;
  var dq = ds.dq;
  var ca = ds.ca;
  var rn = ds.rn;
  var _csv = "";
  var uvp = self.uvp;
  if(uvp){
    var props = ["t", "c", "q", "Re", "sx", "sy", "umin", "umax", "vmin", "vmax", "pmin", "pmax", "uij", "vij", "pij"];  // fluid-Ver.1.30.0  // fluid-Ver.1.34.0
    props.forEach(function(sw_plot){
      _csv += sw_plot;
      _csv += ca;
    });
    _csv += My_entry.VERSION;
    _csv += ca;
    _csv += My_entry.Ver.fluid;
    _csv += rn;
    var len_n = uvp._arr_t.length;
    for(var n=0; n<len_n; ++n){
      props.forEach(function(sw_plot, i){
        if(i > 0){
          _csv += ca;
        }
        _csv += uvp["_arr_"+sw_plot][n];
      });
      _csv += rn;
    }
  }
  return _csv;
};
/* -> fluid-Ver.1.24.0 */
/* fluid-Ver.1.21.0 -> */
My_entry.pen.prototype.init_plot2d = function(){
  var self = this;
  var options = self.options;
  options["plot-canvas-width"] = self.entry.def.limit(options["plot-canvas-width"], 16, 2560, 512);
  options["plot-canvas-height"] = self.entry.def.limit(options["plot-canvas-height"], 16, 2560, 256);
  self.plot2d = new self.constructors.plot2d("div-plot2d", options["plot-canvas-width"], options["plot-canvas-height"]);
  return self;
};
My_entry.pen.prototype.update_plot2d = function(isFinal){  // fluid-Ver.1.23.0
  var self = this;
  var _svg = null;  // fluid-Ver.1.23.0
  /* fluid-Ver.1.22.0 -> */
  var $ = self.entry.$;
  var options = self.options;
  var uvp = self.uvp;
  var temp = self.plot2d.objs.temp;  // fluid-Ver.1.23.0
  if(uvp){
    var toSVG = (isFinal === "SVG");  // fluid-Ver.1.23.0
    self.entry.def.mix_over(self.constructors.draw, self.constructors["draw_"+((toSVG)? "svg": "canvas")]);
    /* fluid-Ver.1.24.0 -> */
    if(!(isFinal)){
      self.update_arr2d_vec();
    }
    /* -> fluid-Ver.1.24.0 */
    var sw_plot = $._id("select-plot").value;
    var arr_plot = uvp["_arr_"+sw_plot];
    var arr2d_vec = {x: uvp._arr_t, y: arr_plot, len_n: uvp._arr_t.length, len_j: 1, gxmin: Math.min.apply(Math, uvp._arr_t), gxmax: Math.max.apply(Math, uvp._arr_t), gymin: Math.min.apply(Math, arr_plot), gymax: Math.max.apply(Math, arr_plot)};
    var options_plot = {
      decDigit: 1,
      expDigit: -1,
      "marker-size": 0,
      "marker-line-width": 0,
      "plot-line-width": 2,
      "grid-line-width": 0.5,
      "grid-line-color": "gray",
      "bg-color": "black",
      globalCompositeOperationAll: "source-over",  // fluid-Ver.1.24.0
      "canvas-globalCompositeOperationLayer": "source-over",  // fluid-Ver.1.24.0
      "log-x": false,
      "log-y": false,
      "imag-x": false,
      "imag-y": false,
      legend: false,
      "axis-x": true,
      "axis-y": true,
      "axis-z": true,
      "font-size": 12,
      "grid-x-Ni": 0,
      "grid-y-Nj": 0,
      "kx-adjust": 2.5,
      "legend-kx": 0.25,
      "legend-ky": 0.1,
      "marker-colors": "red-blue",
      "input-z": "ORIGIN{2,yellow,17}XLABEL{t}YLABEL{"+sw_plot+"}"
    };
  /* -> fluid-Ver.1.22.0 */
    for(var prop in options_plot){
      var option = options[prop];
      if(typeof option !== "undefined"){
        options_plot[prop] = option;
      }
    }
    options_plot.arr_x = [];
    options_plot.arr_y = [];
    /* fluid-Ver.1.23.0 -> */
    if(toSVG){
      _svg = "";
      _svg += temp.draw.header(options["plot-canvas-width"], options["plot-canvas-height"]);
      _svg += temp.draw.comment(My_entry.VERSION);
      _svg += self.plot2d.final(arr2d_vec, options_plot, toSVG);
      _svg += temp.draw.footer();
    }
    else{
      _svg = self.plot2d[(isFinal)? "final": "run"](arr2d_vec, options_plot, toSVG);
    }
    temp.detach();
    /* -> fluid-Ver.1.23.0 */
  }
  return _svg;
};
/* -> fluid-Ver.1.21.0 */
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
    /* fluid-Ver.1.18.0 -> */
    var json = {p: {id: "wrapper-link-csv"}, a: {id: "a-csv", it: "download-csv"}, name: "download", ext: "csv"};
    self.handler_link_csv = new self.constructors.handler_link(json);
    self.handler_link_csv.setter.callback(function(){return self.make_csv();});
    /* -> fluid-Ver.1.18.0 */
    /* fluid-Ver.1.23.0 -> */
    var json = {p: {id: "wrapper-link-png1"}, a: {id: "a-png1", it: "download-png"}, name: "download", ext: "png"};
    self.handler_link_png = new self.constructors.handler_link(json);
    self.handler_link_png.setter.callback(function(){return self.entry.conv.base2buffer(self.plot2d.objs.all.get_base64());});
    var json = {p: {id: "wrapper-link-svg1"}, a: {id: "a-svg1", it: "-svg(src-over)"}, name: "download", ext: "svg"};
    self.handler_link_svg = new self.constructors.handler_link(json);
    self.handler_link_svg.setter.callback(function(){return self.update_plot2d("SVG");});
    /* -> fluid-Ver.1.23.0 */
    /* fluid-Ver.1.24.0 -> */
    var json = {p: {id: "wrapper-link-csv1"}, a: {id: "a-csv1", it: "download-csv"}, name: "download", ext: "csv"};
    self.handler_link_csv = new self.constructors.handler_link(json);
    self.handler_link_csv.setter.callback(function(){return self.make_csv1();});
    /* -> fluid-Ver.1.24.0 */
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
    /* fluid-Ver.1.0.0 -> */
    var fg = self.objs.fg;  // fluid-Ver.1.25.0
    var base64 = "";
    /* fluid-Ver.1.12.0 svg -> png */
    /* fluid-Ver.1.3.0 */
    switch(self.options.testcase){
      /* fluid-Ver.1.15.0 */
      case -1:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA+gAAABkCAYAAAAVORraAAAAAXNSR0IArs4c6QAACRlJREFUeF7t3VGO6zgMRUFn/4vOQ88swCacC1FU9bdalor+OUiAfK7r+l7+CBAgQIAAAQIECBAgQIAAgaUCH4G+1N/DCRAgQIAAAQIECBAgQIDAfwIC3YtAgAABAgQIECBAgAABAgQaCAj0BkNwBAIECBAgQIAAAQIECBAgINC9AwQIECBAgAABAgQIECBAoIGAQG8wBEcgQIAAAQIECBAgQIAAAQIC3TtAgAABAgQIECBAgAABAgQaCAj0BkNwBAIECBAgQIAAAQIECBAgINC9AwQIECBAgAABAgQIECBAoIGAQG8wBEcgQIAAAQIECBAgQIAAAQKf73V9nzB8/v/NdH8ECBAgQIAAAQIECBAgQIBAQECgB1BtSYAAAQIECBAgQIAAAQIEqgICvSpmPQECBAgQIECAAAECBAgQCAgI9ACqLQkQIECAAAECBAgQIECAQFVAoFfFrCdAgAABAgQIECBAgAABAgEBgR5AtSUBAgQIECBAgAABAgQIEKgKCPSqmPUECBAgQIAAAQIECBAgQCAgINADqLYkQIAAAQIECBAgQIAAAQJVAYFeFbOeAAECBAgQIECAAAECBAgEBAR6ANWWBAgQIECAAAECBAgQIECgKiDQq2LWEyBAgAABAgQIECBAgACBgIBAD6DakgABAgQIECBAgAABAgQIVAUEelXMegIECBAgQIAAAQIECBAgEBAQ6AFUWxIgQIAAAQIECBAgQIAAgaqAQK+KWU+AAAECBAgQIECAAAECBAICAj2AaksCBAgQIECAAAECBAgQIFAVEOhVMesJECBAgAABAgQIECBAgEBAQKAHUG1JgAABAgQIECBAgAABAgSqAgK9KmY9AQIECBAgQIAAAQIECBAICAj0AKotCRAgQIAAAQIECBAgQIBAVUCgV8WsJ0CAAAECBAgQIECAAAECAQGBHkC1JQECBAgQIECAAAECBAgQqAoI9KqY9QQIECBAgAABAgQIECBAICAg0AOotiRAgAABAgQIECBAgAABAlUBgV4Vs54AAQIECBAgQIAAAQIECAQEBHoA1ZYECBAgQIAAAQIECBAgQKAqINCrYtYTIECAAAECBAgQIECAAIGAgEAPoNqSAAECBAgQIECAAAECBAhUBQR6Vcx6AgQIECBAgAABAgQIECAQEBDoAVRbEiBAgAABAgQIECBAgACBqoBAr4pZT4AAAQIECBAgQIAAAQIEAgICPYBqSwIECBAgQIAAAQIECBAgUBUQ6FUx6wkQIECAAAECBAgQIECAQEBAoAdQbUmAAAECBAgQIECAAAECBKoCAr0qZj0BAgQIECBAgAABAgQIEAgICPQAqi0JECBAgAABAgQIECBAgEBVQKBXxawnQIAAAQIECBAgQIAAAQIBAYEeQLUlAQIECBAgQIAAAQIECBCoCgj0qpj1BAgQIECAAAECBAgQIEAgICDQA6i2JECAAAECBAgQIECAAAECVYHPdV3f6j9Zv5XA34z9ESBAgAABAgQIECBAgEBzAYHefEA/OJ5A/wGiLQgQIECAAAECBAgQIJAWEOhp4fX7C/T1M3ACAgQIECBAgAABAgQI3AoI9Fui7RcI9O1H6AIECBAgQIAAAQIECJwgINDnT1mgz5+xGxIgQIAAAQIECBAgMEBAoA8Y4s0VBPr8GbshAQIECBAgQIAAAQIDBAT6gCEK9PlDdEMCBAgQIECAAAECBOYLCPQzZjz/lm5IgAABAgQIECBAgACBzQUE+uYDfHB8X3F/gGQJAQIECBAgQIAAAQIEVgsI9NUTyD9foOeNPYEAAQIECBAgQIAAAQKvBQT6a8L2Gwj09iNyQAIECBAgQIAAAQIECFyXQJ//Fgj0+TN2QwIECBAgQIAAAQIEBggI9AFDvLmCQJ8/YzckQIAAAQIECBAgQGCAgEAfMESBPn+IbkiAAAECBAgQIECAwHwBgX7GjOff0g0JECBAgAABAgQIECCwuYBA33yAD47vK+4PkCwhQIAAAQIECBAgQIDAagGBvnoC+ecL9LyxJxAgQIAAAQIECBAgQOC1gEB/Tdh+A4HefkQOSIAAAQIECBAgQIAAAT+zdsI7INBPmLI7EiBAgAABAgQIECCwvYBP0Lcf4e0FBPotkQUECBAgQIAAAQIECBBYLyDQ188gfQKBnha2PwECBAgQIECAAAECBH4gINB/gNh8C4HefECOR4AAAQIECBAgQIAAgT8BgT7/PRDo82fshgQIECBAgAABAgQIDBAQ6AOGeHMFgT5/xm5IgAABAgQIECBAgMAAAYE+YIgCff4Q3ZAAAQIECBAgQIAAgfkCAv2MGc+/pRsSIECAAAECBAgQIEBgcwGBvvkAHxzfV9wfIFlCgAABAgQIECBAgACB1QICffUE8s8X6HljTyBAgAABAgQIECBAgMBrAYH+mrD9BgK9/YgckAABAgQIECBAgAABAn5m7YR3QKCfMGV3JECAAAECBAgQIEBgewGfoG8/wtsLCPRbIgsIECBAgAABAgQIECCwXkCgr59B+gQCPS1sfwIECBAgQIAAAQIECPxAQKD/ALH5FgK9+YAcjwABAgQIECBAgAABAn8CAn3+eyDQ58/YDQkQIECAAAECBAgQGCAg0AcM8eYKAn3+jN2QAAECBAgQIECAAIEBAgJ9wBAF+vwhuiEBAgQIECBAgAABAvMFBPoZM55/SzckQIAAAQIECBAgQIDA5gICffMBPji+r7g/QLKEAAECBAgQIECAAAECqwUE+uoJ5J8v0PPGnkCAAAECBAgQIECAAIHXAgL9NWH7DQR6+xE5IAECBAgQIECAAAECBPzMmneAAAECBAgQIECAAAECBAi0EPAJeosxOAQBAgQIECBAgAABAgQInC4g0E9/A9yfAAECBAgQIECAAAECBFoICPQWY3AIAgQIECBAgAABAgQIEDhdQKCf/ga4PwECBAgQIECAAAECBAi0EBDoLcbgEAQIECBAgAABAgQIECBwuoBAP/0NcH8CBAgQIECAAAECBAgQaCEg0FuMwSEIECBAgAABAgQIECBA4HQBgX76G+D+BAgQIECAAAECBAgQINBCQKC3GINDECBAgAABAgQIECBAgMDpAv8AZc6MUa6hcncAAAAASUVORK5CYII=";
        break;
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
      /* fluid-Ver.1.34.0 */
      case -5:
      /* fluid-Ver.1.7.0 */
      case 5:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAB+JJREFUeF7t1zFuZDEMRMGZ+x/amzrZBdGtgMSW429CKOoBo+/P5/Pzefj3/Xy+D8cZRYDAPwS+AnY/CNwVEPDd3Tk5gY+AXQIChwUEfHh5jk5AwO4AgcMCAj68PEcnIGB3gMBhAQEfXp6jExCwO0DgsICADy/P0QkI2B0gcFhAwIeX5+gEBOwOEDgsIODDy3N0AgJ2BwgcFhDw4eU5OgEBuwMEDgsI+PDyHJ2AgN0BAocFBHx4eY5OQMDuAIHDAgI+vDxHJyBgd4DAYQEBH16eoxMQsDtA4LCAgA8vz9EJCNgdIHBYQMCHl+foBATsDhA4LCDgw8tzdAICdgcIHBYQ8OHlOToBAbsDBA4LCPjw8hydgIDdAQKHBQR8eHmOTkDA7gCBwwICPrw8RycgYHeAwGEBAR9enqMTELA7QOCwgIAPL8/RCQjYHSBwWEDAh5fn6AQE7A4QOCwg4MPLc3QCAnYHCBwWEPDh5Tk6AQG7AwQOCwj48PIcnYCA3QEChwUEfHh5jk5AwO4AgcMCAj68PEcnIGB3gMBhAQEfXp6jExCwO0DgsICADy/P0QkI2B0gcFhAwIeX5+gEBOwOEDgsIODDy3N0AgJ2BwgcFhDw4eU5OgEBuwMEDgsI+PDyHJ2AgN0BAocFBHx4eY5OQMDuAIHDAgI+vDxHJyBgd4DAYQEBH16eoxMQsDtA4LCAgA8vz9EJCNgdIHBYQMCHl+foBATsDhA4LCDgw8tzdAICdgcIHBb4HwP+ebyv7+N5xhEYCwh4TPXXDwXcG5oQCgg4hPv1bwLuDU0IBQQcwgm4hzOhFxDwA8N+hAkEMgEBZ26//8tP6N7QhFBAwCGcn9A9nAm9gIAfGPYjTCCQCQg4c/MTuncz4YGAgHtEb+De0IRQQMAhnDdwD2dCLyDgB4b9CBMIZAICzty8gXs3Ex4ICLhH9AbuDU0IBQQcwnkD93Am9AICfmDYjzCBQCYg4MzNG7h3M+GBgIB7RG/g3tCEUEDAIZw3cA9nQi8g4AeG/QgTCGQCAs7cvIF7NxMeCAi4R/QG7g1NCAUEHMJ5A/dwJvQCAn5g2I8wgUAmIODMzRu4dzPhgYCAe0Rv4N7QhFBAwCGcN3APZ0IvIOAHhv0IEwhkAgLO3LyBezcTHggIuEf0Bu4NTQgFBBzCeQP3cCb0AgJ+YNiPMIFAJiDgzM0buHcz4YGAgHtEb+De0IRQQMAhnDdwD2dCLyDgB4b9CBMIZAICzty8gXs3Ex4ICLhH9AbuDU0IBQQcwnkD93Am9AICfmDYjzCBQCYg4MzNG7h3M+GBgIB7RG/g3tCEUEDAIZw3cA9nQi8g4AeG/QgTCGQCAs7cvIF7NxMeCAi4R/QG7g1NCAUEHMJ5A/dwJvQCAn5g2I8wgUAmIODMzRu4dzPhgYCAe0Rv4N7QhFBAwCGcN3APZ0IvIOAHhv0IEwhkAgLO3LyBezcTHggIuEf0Bu4NTQgFBBzCeQP3cCb0AgJ+YNiPMIFAJiDgzM0buHcz4YGAgHtEb+De0IRQQMAhnDdwD2dCLyDgB4b9CBMIZAICzty8gXs3Ex4ICLhH9AbuDU0IBQQcwnkD93Am9AICfmDYjzCBQCYg4MzNG7h3M+GBgIB7RG/g3tCEUEDAIZw3cA9nQi8g4AeG/QgTCGQCAs7cvIF7NxMeCAi4R/QG7g1NCAUEHMJ5A/dwJvQCAn5g2I8wgUAmIODMzRu4dzPhgYCAe0Rv4N7QhFBAwCGcN3APZ0IvIOAHhv0IEwhkAgLO3LyBezcTHggIuEf0Bu4NTQgFBBzCeQP3cCb0AgJ+YNiPMIFAJvA/BpxJ+S8CCwUEvHApjkRgKiDgqZTvCCwUEPDCpTgSgamAgKdSviOwUEDAC5fiSASmAgKeSvmOwEIBAS9ciiMRmAoIeCrlOwILBQS8cCmORGAqIOCplO8ILBQQ8MKlOBKBqYCAp1K+I7BQQMALl+JIBKYCAp5K+Y7AQgEBL1yKIxGYCgh4KuU7AgsFBLxwKY5EYCog4KmU7wgsFBDwwqU4EoGpgICnUr4jsFBAwAuX4kgEpgICnkr5jsBCAQEvXIojEZgKCHgq5TsCCwUEvHApjkRgKiDgqZTvCCwUEPDCpTgSgamAgKdSviOwUEDAC5fiSASmAgKeSvmOwEIBAS9ciiMRmAoIeCrlOwILBQS8cCmORGAqIOCplO8ILBQQ8MKlOBKBqYCAp1K+I7BQQMALl+JIBKYCAp5K+Y7AQgEBL1yKIxGYCgh4KuU7AgsFBLxwKY5EYCog4KmU7wgsFBDwwqU4EoGpgICnUr4jsFBAwAuX4kgEpgICnkr5jsBCAQEvXIojEZgKCHgq5TsCCwUEvHApjkRgKiDgqZTvCCwUEPDCpTgSgamAgKdSviOwUEDAC5fiSASmAgKeSvmOwEIBAS9ciiMRmAoIeCrlOwILBQS8cCmORGAqIOCplO8ILBQQ8MKlOBKBqYCAp1K+I7BQQMALl+JIBKYCAp5K+Y7AQgEBL1yKIxGYCgh4KuU7AgsFBLxwKY5EYCog4KmU7wgsFBDwwqU4EoGpgICnUr4jsFBAwAuX4kgEpgICnkr5jsBCAQEvXIojEZgKCHgq5TsCCwUEvHApjkRgKiDgqZTvCCwUEPDCpTgSgamAgKdSviOwUEDAC5fiSASmAgKeSvmOwEIBAS9ciiMRmAr8AaMjMQ9/rDw1AAAAAElFTkSuQmCC";
        break;
      /* fluid-Ver.1.7.0 */
      case 6:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.42.0 */
      case -7:
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
      /* fluid-Ver.1.38.0 */
      case -9:
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
      /* fluid-Ver.1.14.0 */
      case 16:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.14.0 */
      case 17:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.20.0 */
      case 18:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.20.0 */
      case 19:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAACF9JREFUeF7t3EFuHEcURMEZ3//MosCt4YU+XgNOcULrykYxio9LvV+v19fLPwJ/KuC35U+l/vvcu83/vf7+nCd51vRnf81vS3tfATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyss8DDv4L5Pn/bBx79E+j/xPrbnv//v6+A2xsIuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBijg5mcdBQTcAAXc/KyjgIAboICbn3UUEHADFHDzs44CAm6AAm5+1lFAwA1QwM3POgoIuAEKuPlZRwEBN0ABNz/rKCDgBvh0wF+PfvD1envg9sDWP1vg0d7er5eAf/bvi59uTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTEDAYw/iOgQuAgK+aDlLYExAwGMP4joELgICvmg5S2BMQMBjD+I6BC4CAr5oOUtgTODpgF+PfnAMy3WeF3g//8mP+uKjvX0/xqMf/Kin+MwfVsDt3R/tTcDtMT5xLeD26gJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoKCLgBCrj5WUcBATdAATc/6ygg4AYo4OZnHQUE3AAF3Pyso4CAG6CAm591FBBwAxRw87OOAgJugAJuftZRQMANUMDNzzoJfP2T5h8/fv96lOD7r+mjfxEevZ2P7QkIuL2JgJufdRQQcAMUcPOzjgICboACbn7WUUDADVDAzc86Cgi4AQq4+VlHAQE3QAE3P+soIOAGKODmZx0FBNwABdz8rKOAgBuggJufdRQQcAMUcPOzjgICboACbn7WUUDADVDAzc86Cgi4AQq4+VlHAQE3QAE3P+soIOAGKODmZx0FBNwABdz8rKOAgBuggJufdRQQcAMUcPOzjgICboAPB/wbyDBEHxumfA8AAAAASUVORK5CYII=";
        break;
      /* fluid-Ver.1.20.0 */
      case 20:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAABqpJREFUeF7t3MFxgDAAA0GY9F8zqSB5+cGhpQCPfNL5yf0813Md/O77ug8e5ygEPkbgOesbgT+2D9d5OQECv7wg8RD4jwCB7QOBMAECh8sTHQEC2wACYQIEDpcnOgIEtgEEwgQIHC5PdAQIbAMIhAkQOFye6AgQ2AYQCBMgcLg80REgsA0gECZA4HB5oiNAYBtAIEyAwOHyREeAwDaAQJgAgcPliY4AgW0AgTCBwwKHSYiOwDwBP6CbnwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTIDA5fZknydA4PkJAFAmQOBye7LPEyDw/AQAKBMgcLk92ecJEHh+AgCUCRC43J7s8wQIPD8BAMoECFxuT/Z5AgSenwAAZQIELrcn+zwBAs9PAIAyAQKX25N9ngCB5ycAQJkAgcvtyT5PgMDzEwCgTOC+ruc5e4Hbo3AWqNM+ROB5fo76RuAPjcNV3k+AwO/vSEIE/iRAYONAIEyAwOHyREeAwDaAQJgAgcPliY4AgW0AgTABAofLEx0BAtsAAmECBA6XJzoCBLYBBMIECBwuT3QECGwDCIQJEDhcnugIENgGEAgTIHC4PNERILANIBAmQOBweaIjQGAbQCBM4LTAv7aEyMkpua2dAAAAAElFTkSuQmCC";
        break;
      /* fluid-Ver.1.20.0 */
      case 21:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.20.0 */
      case 22:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.26.0 */
      case 23:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.26.0 */
      case 24:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.43.0 -> */
      /* fluid-Ver.1.42.0 */
      case -22:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAAB71JREFUeF7t3MGVGzcQRdEexzdhKCyHofgsH81aRxLZv6vxG9frIVC8hWfu9HEcx4/DfwQIVAp8CLhyb4Ym8CUgYA+BQLGAgIuXZ3QCAvYGCBQLCLh4eUYnIGBvgECxgICLl2d0AgL2BggUCwi4eHlGJyBgb4BAsYCAi5dndAIC9gYIFAsIuHh5RicgYG+AQLGAgIuXZ3QCAvYGCBQLCLh4eUYnIGBvgECxgICLl2d0AlcE/PNM/xEg8GuB6L9BJ2DPjMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzAoIeNbbbQSiAgKOcjqMwKyAgGe93UYgKiDgKKfDCMwKCHjW220EogICjnI6jMCsgIBnvd1GICog4CinwwjMCgh41tttBKICAo5yOozArICAZ73dRiAqIOAop8MIzArsFfC340f0C8/u6vXb/j0+Xv/Q4Ce+f/8netvn539rf+Hot/06LPqef+JFDzyO7AsUcP4FnTlRwGf0BHxab/UD/AKvvqHT80V/MP0Cn95H9gABZz0XPE3ACy4lNpKAY5SrHiTgVTeTmEvACcWlzxDw0us5OZyATwKu/3EBr7+j9ycU8Pt2JZ8UcMmi3hpTwG+xNX1IwE3benVWAb8qVvf3Aq5b2QsDC/gFrM4/FXDn3v5uagH/nVPxXwm4eHl/HF3AfyRq/wMBt2/wd/ML+Mnb/fpuAn7yigX85O0K+PHbFfDjV+wX+MkrFvCTt+sX+PHbFfDjV+wX+MkrFvCTt+sX+PHbFfDjV+wX+MkrXj/grP7nZ/afYMpOd8lpAr6EdZFDBbzIIq4bQ8DX2d5/soDv38HFEwj4YuBbjxfwrfwTlwt4QvmuOwR8l/zYvQIeo77hIgHfgD57pYBnvWdvE/Cs9w23CfgG9LErBTxGfddFAr5LfuJeAU8o33qHgG/lv/hyAV8MfP/xAr5/B9dNIODrbBc5WcCLLOKSMQR8CetKhwp4pW2kZxFwWnS58wS83EqCAwk4iLnmUQJecy+ZqQSccVz4FAEvvJzTown4NOHqBwh49Q2dmU/AZ/QqPivgijW9OaSA34Tr+ZiAe3b1+qQCft2s7BMCLlvYS+MK+CWuxj/eK+DGDZmZwG8EBOx5ECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYgEBFy/P6AQE7A0QKBYQcPHyjE5AwN4AgWIBARcvz+gEBOwNECgWEHDx8oxOQMDeAIFiAQEXL8/oBATsDRAoFhBw8fKMTkDA3gCBYoHlAy62NTqBLoGP4zii/0fo+vqmJdAtIODu/Zl+cwEBb/4AfP1uAQF378/0mwsIePMH4Ot3Cwi4e3+m31xAwJs/AF+/W0DA3fsz/eYCAt78Afj63QIC7t6f6TcXEPDmD8DX7xYQcPf+TL+5gIA3fwC+freAgLv3Z/rNBQS8+QPw9bsFBNy9P9NvLiDgzR+Ar98tIODu/Zl+cwEBb/4AfP1ugf8BNuaUH0PHANYAAAAASUVORK5CYII=";
        break;
      case -23:
        base64 = "data:image/png;base64,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";
        break;
      case -24:
        base64 = "data:image/png;base64,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";
        break;
      case -25:
        base64 = "data:image/png;base64,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";
        break;
      case -26:
        base64 = "data:image/png;base64,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";
        break;
      /* -> fluid-Ver.1.43.0 */
      /* fluid-Ver.1.29.0 */
      case 25:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.29.0 */
      case 26:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.42.0 */
      case -27:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.38.0 */
      case 27:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.39.0 */
      case 28:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.39.0 */
      case 29:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.39.0 */
      case 30:
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.44.0 */
      case 31:
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAAAXNSR0IArs4c6QAACXRJREFUeF7t3EGS3LYSRVGWt+KN9ka1FbdDGtrhMKmXTIKJ43ERIE7ifoYGvz/HcXwf/iNA4JUCHwG/cm5emsAvAQG7CAReLCDgFw/PqxMQsDtA4MUCAn7x8Lw6AQG7AwReLCDgFw/PqxMQsDtA4MUCAn7x8Lw6AQG7AwReLCDgFw/PqxMQsDtA4MUCAn7x8Lw6AQG7AwReLCDgFw/PqxMQsDtA4MUCAn7x8Lw6AQG7AwReLCDgFw/PqxPYMeCfZ/bfXIGt/sabgOde5F1PJuDhk/cFnj1gAc+e768/5Oe/uQICnjvbXycT8OwBC3j2fAU8fL4CHj5gX+DZAxbw7Pn6Ag+fr4CHD9gXePaABTx7vr7Aw+cr4OED9gWePWABz56vL/Dw+Qp4+IB9gWcPWMCz5+sLPHy+Ah4+YF/g2QMW8Oz5+gIPn6+Ahw/YF3j2gAU8e76+wMPnK+DhA/YFnj1gAc+ery/w8PkKeLEBl34xf3x9Sgf859d36fstZn/76/z4OornUf4/0KXvVw36hr+JVRqIgKuvULaegDM/AWd+hy9wBijgzE/AmZ+AQz8BZ4ACzvwEHPoJOAMUcOYn4NBPwBmggDM/AYd+As4ABZz5CTj0E3AGKODMT8Chn4AzQAFnfgIO/QScAQo48xNw6CfgDFDAmZ+AQz8BZ4ACzvwEHPoJOAMUcOYn4NBPwBmggDM/AYd+As4ABZz5CTj0E3AGKODMT8Chn4AzQAFnfgIO/QScAQo48xNw6CfgDFDAmZ+AQz8BZ4B3BFz6J3Cy43mawHICpX9jS8DLzdcLDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcQ8PABO95sAQHPnq/TDRcoDvj7j9IFj89f/ibW8BvoeIFAcW+fo3hBAQfD9eh8geLeBDz/yjjhSgICXmka3oXARQEBXwTzcwIrCQh4pWl4FwIXBQR8EczPCawkIOCVpuFdCFwUEPBFMD8nsJKAgFeahnchcFFAwBfB/JzASgICXmka3oXARQEBXwTzcwIrCQh4pWl4FwIXBQR8EczPCawkIOCVpuFdCFwUEPBFMD8nsJKAgFeahnchcFFAwBfB/JzASgICXmka3oXARYHygI+j9m9iff9x8UT/83N/Y6vW02rXBIqDOz5/Xdv///I4BFwKarFhAgIOB+oLHAJ6PBIQcMR3+CuXoZ/HMwEBZ34CDv08ngkIOPMTcOjn8UxAwJmfgEM/j2cCAs78BBz6eTwTEHDmJ+DQz+OZgIAzPwGHfh7PBASc+Qk49PN4JiDgzE/AoZ/HMwEBZ34CDv08ngkIOPMTcOjn8UxAwJmfgEM/j2cCAs78BBz6eTwTEHDmJ+DQz+OZgIAzPwGHfh7PBASc+Qk49PN4JiDgzE/AoZ/HM4HtAj6OTyb2sqe/P7V/U+zzvbbfbuetv46l9+XnZSld8BBwNnIBZ37rP13am4DTge/2RdrtvOn9+PfzAq43DVbc7ULvdt7gavzHowKuNw1W3O1C73be4GoIuB6vfsXdLvRu573hxlQu6d/AqeZuF3q386b3w7+B6wVLV9ztQu923tLL8msx/wauNw1W3O1C73be4Gr4N3A9Xv2Ku13o3c57w42pXNK/gVPN3S70budN74d/A9cLlq6424Xe7byll8W/ges50xV3u9C7nTe9H77A9YKlK+52oXc7b+ll8QWu50xX3O1C73be9H74AtcLlq6424Xe7byll8UXuJ4zXXG3C73bedP74QtcL1i64m4Xerfzll4WX+B6znTF3S70budN74cvcL1g6Yq7Xejdzlt6WXyB6zmtSKBXwP+ZodfbbgRKBQRcymkxAr0CAu71thuBUgEBl3JajECvgIB7ve1GoFRAwKWcFiPQKyDgXm+7ESgVEHApp8UI9AoIuNfbbgRKBQRcymkxAr0CAu71thuBUgEBl3JajECvgIB7ve1GoFRAwKWcFiPQKyDgXm+7ESgVEHApp8UI9AoIuNfbbgRKBQRcymkxAr0CAu71thuBUgEBl3JajECvgIB7ve1GoFRAwKWcFiPQKyDgXm+7ESgVEHApp8UI9AoIuNfbbgRKBQRcymkxAr0CAu71thuBUgEBl3JajECvgIB7ve1GoFRAwKWcFiPQKyDgXm+7ESgVEHApp8UI9AoIuNfbbgRKBQRcymkxAr0CAu71thuBUgEBl3JajECvgIB7ve1GoFRAwKWcFiPQKyDgXm+7ESgVWD7g0tMex/GpXPDH11EK+OdX7ftVnvUNa/34+hTP47v0vhxH7X2pnsnPw5YCVr+ggG8QXWhJAWfDEHDmd/gCZ4ACzvwEnPkJOPQTcAYo4MxPwKGfgDNAAWd+Ag79BJwBCjjzE3DoJ+AMUMCZn4BDPwFngALO/AQc+gk4AxRw5ifg0E/AGaCAMz8Bh34CzgAFnPkJOPQTcAYo4MxPwKGfgDNAAWd+Ag79BJwBCjjzE3DoJ+AMUMCZn4BDPwFngALO/AQc+gk4AxRw5ifg0E/AGaCAMz8Bh34CzgAFnPkJOPQTcAb4hoCzE/776eq/mVT9ftbLBFb/E1HZ6f7xtIBLOS22gICAFxjCna/gC3yn7vNrC/j5Gdz6BgK+lffxxQX8+AjufQEB3+v79OoCfnoCN+8v4JuBH15ewA8P4O7tBXy38LPrC/hZ/9t3F/DtxI9uIOBH+e/fXMD3Gz+5g4Cf1G/YW8ANyA9uIeAH8Tu2FnCH8nN7CPg5+5adBdzC/NgmAn6MvmdjAfc4P7WLgJ+Sb9pXwE3QD20j4Ifgu7YVcJf0M/sI+Bn3tl0F3Eb9yEYCfoS9b1MB91k/sZOAn1Bv3FPAjdgPbCXgB9A7txRwp3b/XgLuN2/dUcCt3O2bCbid3IYECPyWwI5/E+u3oDxEYEUBAa84Fe9E4KSAgE9C+RmBFQUEvOJUvBOBkwICPgnlZwRWFBDwilPxTgROCgj4JJSfEVhRQMArTsU7ETgpIOCTUH5GYEUBAa84Fe9E4KSAgE9C+RmBFQUEvOJUvBOBkwICPgnlZwRWFBDwilPxTgROCgj4JJSfEVhRQMArTsU7ETgpIOCTUH5GYEUBAa84Fe9E4KSAgE9C+RmBFQX+BqIq1EIU7AA+AAAAAElFTkSuQmCC";
        break;
      /* fluid-Ver.1.39.0 */
      case 32:  // fluid-Ver.1.44.0
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.40.0 */
      case 33:  // fluid-Ver.1.44.0
        base64 = "data:image/png;base64,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";
        break;
      /* fluid-Ver.1.40.0 */
      case 34:  // fluid-Ver.1.45.0
        base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAeAAAADwCAYAAADYdbe6AAAAAXNSR0IArs4c6QAADTdJREFUeF7t2UuOG0kQREFy7n/moTYjYBaCWq2IhCfppnVXfiwKfCjo+fCPAAECBAgQ+FLg9Xi+vvyjb/zB8xt/608JECBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsTIECAQK2AANeO3sUJECBAICkgwEl9exMgQIBArYAA147exQkQIEAgKSDASX17EyBAgECtgADXjt7FCRAgQCApIMBJfXsT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";
        break;
      default:
        break;
    }
    if(base64){
      /* fluid-Ver.1.3.0 -> */
      var callback_last = function(){
        var w = options.mosaic;
        options.mosaic = "min";
        fg.tap_point({mysvg: ""});
        options.mosaic = w;
      };
      fg.draw_base64(base64, null, callback_last);
      /* -> fluid-Ver.1.3.0 */
    }
    self.init_plot2d();  // fluid-Ver.1.21.0
    /* fluid-Ver.1.25.0 -> */
    fg.elem.addEventListener("pointerup", function(e){
      self.init_config();
    });
    /* -> fluid-Ver.1.25.0 */
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
          var handler_calc = self.handler_calc || new My_entry.handler_calc();  // fluid-Ver.1.34.0
          var solver = self.solver || new My_entry.solver_NS();
          var uvp = self.uvp || self.objs.bg.make_uvp(options);  // fluid-Ver.1.10.0
          $._id("input-Lx").value = uvp.Lx;  // fluid-Ver.1.10.0
          self.handler_calc = handler_calc;  // fluid-Ver.1.34.0
          self.solver = solver;
          self.uvp = uvp;
          var n = 0;
          /* fluid-Ver.1.24.0 -> */
          if(uvp.t === 0){
            var svg = mg.draw.uvp(uvp);
            self.update_plot2d();
          }
          /* -> fluid-Ver.1.24.0 */
          var callback = function(){
            var hasError = false;
            var nmax = options.nmax || 1000;
            /* fluid-Ver.1.34.0 -> */
            var obj_t = {t: uvp.t};
            var obj_f = {};
            ["Re", "sx", "sy"].forEach(function(prop){
              obj_f[prop] = $._id("input-"+prop).value;
            });
            handler_calc.update(obj_t, obj_f, uvp);
            /* -> fluid-Ver.1.34.0 */
            try{
              solver.FS2d({
                Re: uvp.Re,  // fluid-Ver.1.34.0
                sx: uvp.sx,  // fluid-Ver.1.27.0  // fluid-Ver.1.34.0
                sy: uvp.sy,  // fluid-Ver.1.27.0  // fluid-Ver.1.34.0
                Ndt: options.Ndt,  // fluid-Ver.1.11.0
                Nnt: options.Nnt,  // fluid-Ver.1.12.0
                order_conv: options.order_conv,  // fluid-Ver.1.32.0
                alpha_upstream: options.alpha_upstream,  // fluid-Ver.1.17.0
                order_diff: options.order_diff,  // fluid-Ver.1.32.0
                order_time: options.order_time,  // fluid-Ver.1.32.0
                type_bound: options.type_bound  // fluid-Ver.1.7.0
              }, uvp);
            }
            catch(e){
              hasError = "No solution";  // fluid-Ver.1.3.0
            }
            if(uvp){
//              if(n === 0) console.log(uvp.Ni*uvp.Nj+","+uvp.msec_int+","+uvp.msec_sol);  // fluid-Ver.1.33.0
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
                uvp._color = options["color-arrow"];  // fluid-Ver.1.16.0
                var svg = mg.draw.uvp(uvp);
                self.update_plot2d();  // fluid-Ver.1.21.0
                setTimeout(function(){
                  /* fluid-Ver.1.23.0 -> */
                  if(self.isLocked){
                    callback();
                  }
                  else{
                    self.update_plot2d(true);
                  }
                  /* -> fluid-Ver.1.23.0 */
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
