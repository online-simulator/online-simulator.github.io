// online-simulator.github.io

My_entry.calc_simple = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.calc_simple, My_entry.original_main, My_entry.original_worker);

My_entry.calc_simple.prototype.config = {
  LOG: {
    numberChars: 5000
  }
};
My_entry.calc_simple.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["reference", "$", "def", "DATA"]);
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
  return self;
};
My_entry.calc_simple.prototype.init_handlers = function(){
  var self = this;
  var $ = self.entry.$;
  self.handlers.onload = function(args){
    var self = this;
    self.io = new self.constructors.io();
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt by double-click"}, name: "download", ext: "txt"};
    self.handler_link = new self.constructors.handler_link(json);
    self.handler_link.setter.callback(function(){return self.logh});
    self.handler_drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    $.change_elems$("input[type='checkbox']");
    self.io.write_stamp(self.elems.h);
    self.logh = self.io.getter.stamp();
    self.logo = "";
    self.log_bar = "--------------------------------\n";
    self.vars = {};  // global storage
    self.eqns = {};  // global storage
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    self.stop_worker();
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
        var input = self.io.read_text(self.elems.i);
        var options = {};
        options.makeLog = 2;
        $.get_elemProps("input[type='checkbox']", "checkbox-", "checked", options);
        $.get_elemProps("select", "select-", "value", options);
        $.get_urlParams(options);
        if(options.checkError !== false) options.checkError = true;
        var arr_data_in = [];
        var len_i = 1;
        for(var i=0; i<len_i; ++i){
          var data = self.entry.DATA.data();
          data.in = input;
          data.options = options;
          data.vars = self.entry.def.newClone(self.vars);  // restore vars
          data.eqns = self.entry.def.newClone(self.eqns);  // restore eqns
          arr_data_in.push(data);
        }
        self.run_worker(arr_data_in, $.checkbox_id("checkbox-useWorker"));
        break;
      case "C":
        self.stop_worker();
        var sw = text_half;
        self.io["onclick_"+sw](self.elems, text_half);
        self.vars = {};  // delete vars
        self.eqns = {};  // delete eqns
        var logh = "storage cleared\n\n";
        logh += self.log_bar;
        logh += self.logh;
        self.logh = logh;
        self.io.write_text(self.elems.h, self.logh.substr(0, self.config.LOG.numberChars));
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
        break;
      case "checkbox-useComplex":
        var isChecked = $.checkbox_elem(elem);
        $.show(".ex-com", isChecked);
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
  var store = function(data){
    var vars = data.vars;
    var eqns = data.eqns;
    for(var name in vars){
      self.vars[name] = vars[name];  // store vars
    }
    for(var name in eqns){
      self.eqns[name] = eqns[name];  // store eqns
    }
  };
  var output = function(data){
    if(data.log){
      self.io.write_text(self.elems.o, data.log);
      var logh = "";
      if(data.logh){
        var bar = self.log_bar;
        logh += data.logh;
        logh += bar;
        if(self.logo !== data.logo){
          self.logo = data.logo;
          logh += data.logo;
          logh += "\n";
          logh += bar+bar;
          logh += "\n";
        }
        logh += self.logh;
        self.logh = logh;
        self.io.write_text(self.elems.h, self.logh.substr(0, self.config.LOG.numberChars));
      }
    }
  };
  self.callbacks_worker.onmessage = function(e){
    var self = this;
    var data = e.data;
    self.arr_data_out[data.i] = data;
    var len_in = self.arr_data_in.length;
    var len_out = Object.keys(self.arr_data_out).length;
    if(len_in === 1){
      store(data);
      output(data);
    }
    if(len_out === len_in){
      self.stop_worker();
    }
    return self;
  };
  self.callbacks_worker.onerror = function(e){
    var self = this;
    self.io.write_text(self.elems.o, e.message.replace("Uncaught Error: ", ""));
    self.stop_worker();
    return self;
  };
  return self;
};
