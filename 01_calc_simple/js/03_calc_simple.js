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
  self.elems = {};
  self.elems.i = self.entry.$._id("input");
  self.elems.o = self.entry.$._id("output");
  self.elems.h = self.entry.$._id("history");
  self.entry.$.set_elem(self.elems.i, "readOnly", null);
  self.entry.$.setup_elems_readonly$("input,textarea");
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  return self;
};
My_entry.calc_simple.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
    var self = this;
    self.io = new self.constructors.io();
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt by double-click"}, name: "download", ext: "txt"};
    self.handler_link = new self.constructors.handler_link(json);
    self.handler_link.setter.callback(function(){return self.logh});
    self.handler_drag = new self.constructors.handler_drag("div-drag", "checkbox-drag", {});
    self.entry.$.change_elems$("input[type='checkbox']");
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
    var text = elem[self.entry.$.config.REFERRER.text];
    var val = elem[self.entry.$.config.REFERRER.value];
    var text_half = self.entry.reference.fullStr2half(text);
    switch(text_half){
      case "=":
        if(self.handler_worker && self.handler_worker.isLocked) return false;
        var arr_data_in = [];
        var data = self.entry.DATA.data();
        data.vars = self.vars;  // restore vars
        data.eqns = self.eqns;  // restore eqns
        data.in = self.io.read_text(self.elems.i);
        data.options.makeLog = 2;
        self.entry.$.get_elemProps("input[type='checkbox']", "checkbox-", "checked", data.options);
        self.entry.$.get_elemProps("select", "select-", "value", data.options);
        self.entry.$.get_urlParams(data.options);
        if(data.options.checkError !== false) data.options.checkError = true;
        arr_data_in.push(data);
        self.run_worker(arr_data_in, self.entry.$.checkbox_id("checkbox-useWorker"));
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
        var isChecked = self.entry.$.checkbox_elem(elem);
        self.entry.def.mix_over(self.constructors.io, ((isChecked)? self.constructors.io_ex1: self.constructors.io_ex));
        self.entry.$.set_elem(self.elems.i, "readOnly", ((isChecked)? null: "readonly"));
        self.entry.$.setup_elems_readonly$("input,textarea");
        if(!(isChecked)){
          var text = self.io.read_text(self.elems.i);
          self.io.write_text(self.elems.i, "");
          self.io.clear_memory();
          self.io.push_text(self.elems.i, text);
        }
        break;
      case "checkbox-0x":
        var isChecked = self.entry.$.checkbox_elem(elem);
        self.entry.$.show(".ex-0x", isChecked, true);
        break;
      case "checkbox-useComplex":
        var isChecked = self.entry.$.checkbox_elem(elem);
        self.entry.$.show(".ex-com", isChecked);
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
    if(Object.keys(self.arr_data_out).length === self.arr_data_in.length){
      var vars = data.vars;
      var eqns = data.eqns;
      for(var name in vars){
        self.vars[name] = vars[name];  // store vars
      }
      for(var name in eqns){
        self.eqns[name] = eqns[name];  // store eqns
      }
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
