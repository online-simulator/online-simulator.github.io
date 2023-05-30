// online-simulator.github.io

My_entry.test_regexp = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_regexp, My_entry.original_main);

My_entry.test_regexp.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  /* Ver.0.24.4 -> */
  self.regex = {};
  self.regex.s = /\s/g;
  self.regex.macros = /\$[0-9a-zA-Z_\-]+\(.*?\)/g;
  self.regex.macro = /^(\$[0-9a-zA-Z\-_]+)\((.*)?\)$/;
  /* -> Ver.0.24.4 */
  return self;
};
My_entry.test_regexp.prototype.init_elems = function(){
  var self = this;
  self.elem_input = self.entry.$._id("textarea-input");
  self.elem_output = self.entry.$._id("textarea-output");
  self.elem_macro = self.entry.$._id("textarea-macro");  // Ver.0.24.4
  self.entry.$.setup_elems_readonly$("input,textarea");
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  self.entry.$.setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_entry.test_regexp.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(e){
    var self = this;
    self.output_command();
    var json = {p: {id: "wrapper-link"}, a: {id: "a", it: "download-txt@double-click"}, o: {id: "textarea-output"}, name: "download", ext: "txt"};  // Ver.0.22.4
    self.handler_link = new self.constructors.handler_link(json);
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "clear":
      case "postset":
      case "replace":
      case "macro":  // Ver.0.24.4
        self[elem.id]();
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    switch(elem.id){
      case "select-flag":
      case "input-pattern":
      case "input-string":
        self.output_command();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_regexp.prototype.clear = function(){
  var self = this;
  self.elem_input.value = "";
  self.elem_output.value = "";
  return self;
};
My_entry.test_regexp.prototype.postset = function(){
  var self = this;
  self.elem_input.value = self.elem_output.value;
  return self;
};
My_entry.test_regexp.prototype.replace = function(){
  var self = this;
  var output = "";
  try{
    var re = new RegExp(self.entry.$._id("input-pattern").value, self.entry.$._id("select-flag").value);
    var str = self.entry.$._id("input-string").value;
    var text = self.elem_input.value;
    output = text.replace(re, str);
  }
  catch(e){
    output = e.message;
  }
  self.elem_output.value = output;
  return self;
};
/* Ver.0.24.4 */
My_entry.test_regexp.prototype.macro = function(){
  var self = this;
  var output = "";
  try{
    var input = self.elem_input.value;
    var macros = self.elem_macro.value;
    if(input && macros){
      var input_ = input;
      macros = macros.replace(self.regex.s, "");
      var mc_macros = macros.match(self.regex.macros);
      if(mc_macros && mc_macros.length){
        for(var i=0, len=mc_macros.length; i<len; ++i){
          var macro = mc_macros[i];
          var mc_macro = macro.match(self.regex.macro);
          if(mc_macro && mc_macro[1]){
            var dtag = "\\"+mc_macro[1];
            var dataset = mc_macro[2] || "";
            var re = new RegExp(dtag, "gm");
            input_ = input_.replace(re, dataset);
          }
        }
      }
      output = input_;
    }
    else{
      output = input;
    }
  }
  catch(e){
    output = e.message;
  }
  self.elem_output.value = output;
  return self;
};
My_entry.test_regexp.prototype.output_command = function(){
  var self = this;
  var command = "";
  try{
    var re = new RegExp(self.entry.$._id("input-pattern").value, self.entry.$._id("select-flag").value);
    var str = self.entry.$._id("input-string").value;
    command = "out=text.replace("+re+",\""+str+"\")\;";
  }
  catch(e){
    command = e.message;
  }
  self.entry.$._id("input-command").value = command;
  return self;
};
