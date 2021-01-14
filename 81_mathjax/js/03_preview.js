// online-simulator.github.io

function My_test_mathjax(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_mathjax, My_original_main);

My_test_mathjax.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_mathjax.prototype.init_elems = function(){
  var self = this;
  My_setup_elems$_tag("button", self.handlers, "onclick");
  return self;
};
My_test_mathjax.prototype.init_handlers = function(){
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
My_test_mathjax.prototype.clear = function(){
  var self = this;
  My$_id("textarea-input").value = "";
  My$_id("p-output").textContent = "";
  return self;
};
My_test_mathjax.prototype.preview = function(){
  var self = this;
  My$_id("p-output").textContent = My$_id("textarea-input").value;
  if(typeof MathJax !== "undefined"){
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "p-output"]);
  }
  return self;
};
