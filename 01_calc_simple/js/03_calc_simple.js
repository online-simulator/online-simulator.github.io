// online-simulator.github.io

My_entry.calc_simple = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.calc_simple, My_entry.original_main, My_entry.original_worker);

My_entry.calc_simple.prototype.config = {
  LOG: {
    sizeMax: 5000
  },
  /* Ver.2.22.11 */
  MAT: {
    sizeMax: 1000
  },
  /* Ver.2.144.36 */
  LIMIT: {
    depthMax: 300
  }
};
My_entry.calc_simple.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "def", "DATA", "parser"]);
  self.init_worker();
  return self;
};
My_entry.calc_simple.prototype.init_elems = function(){
  var self = this;
  var $ = self.entry.$;
  self.elems = {};
  self.elems.i = $._id("input");
  self.elems.o = $._id("output");
  self.elems.h = $._id("history");
  $.set_elem(self.elems.i, "readOnly", null);
  $.setup_elems_readonly$("input,textarea");
  $.setup_elems$_tag("button", self.handlers, "onclick");
  $.setup_elems$_tag("input", self.handlers, "onchange");
  $.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.calc_simple.prototype.output_logh = function(log, logo){
  var self = this;
  var ds = My_entry.$.config.DELIMITER;
  var br = ds.br;
  var rn = ds.rn;
  if(log){
    var logh = log;
    logh += br;
    if(logo && self.logo !== logo){
      self.logo = logo;
      logh += logo;
      logh += rn;
      logh += br+br;
      logh += rn;
    }
    logh += self.logh;
    self.logh = logh;
    self.io.write_text(self.elems.h, self.logh.substring(0, self.config.LOG.sizeMax));
  }
  return self;
};
My_entry.calc_simple.prototype.output_log = function(data){
  var self = this;
  if(data.log){
    /* Ver.2.22.11 -> */
/*
    self.io.write_text(self.elems.o, data.log.split(";").join(";\n"));
*/
    self.io.write_text(self.elems.o, data.log.split(";").join(";\n").substring(0, self.config.LOG.sizeMax));
    /* -> Ver.2.22.11 */
    self.output_logh(data.logh, data.logo);
  }
  else{
    self.io.write_text(self.elems.o, "");
  }
  return self;
};
My_entry.calc_simple.prototype.re_output_log = function(){
  var self = this;
  var $ = self.entry.$;
  if(self.arr_data_out){
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;
    if(len_in === 1 && len_out === 1){  // finished
      var data = self.arr_data_out[0];
      // Ver.1.7.3
      data.options.makeLog = data.options.makeLog || 2;  // || not0  // Ver.2.76.30
      data.options.expDigit = $.selectNum_id("select-expDigit");
      try{
        self.entry.parser.post_try(data);
        self.output_log(data);  // Ver.2.20.7 moved from out of try{}
      }
      catch(e){
        self.callbacks_worker.onerror(e);
      }
    }
  }
  return self;
};
My_entry.calc_simple.prototype.get_options = function(){
  var self = this;
  var $ = self.entry.$;
  var _options = {};
  $.get_elemProps("input[type='checkbox']", "checkbox-", "checked", _options);
  $.get_elemProps("select", "select-", "value", _options);
  $.get_urlParams(_options);
  if(_options.checkError !== false) _options.checkError = true;
  /* Ver.2.22.11 -> */
  _options.matSizeMax = (isNaN(_options.matSizeMax)? null: _options.matSizeMax) || self.config.MAT.sizeMax;
  _options.depthMax = (isNaN(_options.depthMax)? null: _options.depthMax) || self.config.LIMIT.depthMax;  // Ver.2.144.36
  /* -> Ver.2.22.11 */
  return _options;
};
My_entry.calc_simple.prototype.get_data = function(input, options){
  var self = this;
  var _data = self.entry.DATA.data();
  _data.in = input;
  _data.options = options;
  self.storage.global2local(_data);
  return _data;
};
My_entry.calc_simple.prototype.init_storage = function(){
  var self = this;
  self.storage = {};
  self.storage.clear = function(){
    self.vars0 = null;
    self.eqns0 = null;
    self.vars = {};
    self.eqns = {};
  };
  self.storage.store = function(){
    self.vars0 = self.entry.def.newClone(self.vars);
    self.eqns0 = self.entry.def.newClone(self.eqns);
  };
  self.storage.restore = function(){
    self.vars = self.vars0;
    self.eqns = self.eqns0;
  };
  self.storage.global2local = function(data){
    data.vars = self.entry.def.newClone(self.vars);
    data.eqns = self.entry.def.newClone(self.eqns);
  };
  self.storage.local2global = function(data){
    var vars = data.vars;
    var eqns = data.eqns;
    for(var name in vars){
      self.vars[name] = vars[name];
    }
    for(var name in eqns){
      self.eqns[name] = eqns[name];
    }
  };
  return self;
};
My_entry.calc_simple.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  self.handlers.onload = function(e){
    var self = this;
    self.io = new self.constructors.io();
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt@double-click"}, name: "download", ext: "txt"};  // Ver.2.138.35
    self.handler_link = new self.constructors.handler_link(json);
    self.handler_link.setter.callback(function(){return self.logh;});
    self.handler_drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    $.change_elems$("input[type='checkbox']");
    self.io.write_stamp(self.elems.h);
    self.logh = self.io.getter.stamp();
    self.logo = "";
    self.init_storage();
    self.storage.clear();
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.stop_worker(true);
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    var id = elem.id;
    var TAG = elem.tagName.toUpperCase();
    var text = elem[$.config.REFERRER.text];
    var val = elem[$.config.REFERRER.value];
    var text_half = self.entry.reference.fullStr2half(text);
    switch(text_half){
      case "=":
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        self.storage.store();
        var input = self.io.read_text(self.elems.i);
        var options = self.get_options();
        var arr_data_in = [];
        var len_n = 1;
        for(var n=0; n<len_n; ++n){
          var data = self.get_data(input, options);
          arr_data_in.push(data);
        }
        // Ver.2.10.3
        self.io.write_text(self.elems.o, "Now calculating...");
        setTimeout(function(){
          self.run_worker(arr_data_in, $.checkbox_id("checkbox-useWorker"));
        }, 50);
        break;
      case "C":
        self.stop_worker();
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        self.storage.clear();
        self.output_logh("storage cleared\n\n");
        break;
      case "BS":
      case "DEL":
      case "ans":
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        break;
      default:
        var sw = "default";
        self.io["onclick_"+sw](self.elems, text_half);
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id;
    switch(id){
      case "checkbox-drag":
        self.handler_drag.switch();
        break;
      case "checkbox-sw":
        var isChecked = $.checkbox_elem(elem);
        self.entry.def.mix_over(self.constructors.io, ((isChecked)? self.constructors.io_ex1: self.constructors.io_ex));
        $.set_elem(self.elems.i, "readOnly", ((isChecked)? null: "readonly"));
        $.setup_elems_readonly$("input,textarea");
        if(!(isChecked)){
          var text = self.io.read_text(self.elems.i);
          self.io.write_text(self.elems.i, "");
          self.io.clear_memory();
          self.io.push_text(self.elems.i, text);
        }
        break;
      case "checkbox-0x":
        var isChecked = $.checkbox_elem(elem);
        $.show(".ex-0x", isChecked, true);
        /* Ver.2.146.37 -> */
        var useES6 = (Number("0b0") === 0 && Number("0o0") === 0);
        $.show(".ex-0b0o", (isChecked && useES6), true);
        /* -> Ver.2.146.37 */
        break;
      case "checkbox-useComplex":
        var isChecked = $.checkbox_elem(elem);
        $.show(".ex-com", isChecked);
        break;
      case "select-expDigit":
        self.re_output_log();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.calc_simple.prototype.set_callbacks_worker = function(){
  var self = this;
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;
    if(len_in === 1){
      self.storage.local2global(data);
      self.re_output_log();  // last
    }
    if(len_out === len_in){
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.stop_worker(true);
    var msg = self.entry.def.get_msgError(e, "Invalid operation");
    self.io.write_text(self.elems.o, msg.replace("Uncaught Error: ", ""));
    self.storage.restore();  // clear; f=<x; f -> error@re_output_log
    return self;
  };
  return self;
};
