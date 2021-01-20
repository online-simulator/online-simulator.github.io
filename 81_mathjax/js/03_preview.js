// online-simulator.github.io

My_entry.test_mathjax = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_mathjax, My_entry.original_main);

My_entry.test_mathjax.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  return self;
};
My_entry.test_mathjax.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  return self;
};
My_entry.test_mathjax.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
    var self = this;
    self.preview();
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
      case "preview":
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
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_mathjax.prototype.clear = function(){
  var self = this;
  self.entry.$._id("textarea-input").value = "";
  self.entry.$._id("p-output").textContent = "";
  return self;
};
My_entry.test_mathjax.prototype.preview = function(){
  var self = this;
  self.entry.$._id("p-output").textContent = self.entry.$._id("textarea-input").value;
  if(typeof MathJax !== "undefined"){
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "p-output"]);
  }
  return self;
};
