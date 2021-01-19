// online-simulator.github.io

function My_io(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_io.prototype.init = function(){
  var self = this;
  // define
  // setter function
  self.setter = {
  };
  // getter function
  self.getter = {
    stamp: function(){return new Date();}
  };
  // initialize
  self.str_alert = {
    input: "入力が不正です。"
  };
  // re-initialize
  self.re_init.apply(self, arguments);
  return self;
};
My_io.prototype.re_init = function(){
  var self = this;
  self.clear_memory();
  return self;
};
My_io.prototype.clear_memory = function(){
  var self = this;
  self.arr_text = [];
  return self;
};
My_io.prototype.clear_text = function(elem){
  var self = this;
  self.write_text(elem, "");
  return self;
};
My_io.prototype.clear_all_text = function(arg){
  var self = this;
  if(Array.isArray(arg)){
    arg.forEach(function(elem){
      self.clear_text(elem);
    });
  }
  else{
    Array.prototype.forEach.call(arguments, function(elem){
      self.clear_text(elem);
    });
  }
  return self;
};
My_io.prototype.read_text = function(elem){
  var self = this;
  var _text = "";
  if(elem){
    switch(elem.tagName.toUpperCase()){
      case "INPUT":
      case "TEXTAREA":
      case "SELECT":
        _text = elem[My$.config.REFERRER.value];
        break;
      default:
        _text = elem[My$.config.REFERRER.text];
        break;
    }
  }
  return _text;
};
My_io.prototype.write_text = function(elem, text){
  var self = this;
  if(elem){
    switch(elem.tagName.toUpperCase()){
      case "INPUT":
      case "TEXTAREA":
      case "SELECT":
        elem[My$.config.REFERRER.value] = text;
        break;
      default:
        elem[My$.config.REFERRER.text] = text;
        break;
    }
  }
  return self;
};
My_io.prototype.write_arr_text = function(elem){
  var self = this;
  var text = self.arr_text.join("");
  self.write_text(elem, text);
  return self;
};
My_io.prototype.push_text = function(elem, text){
  var self = this;
  self.arr_text.push(text);
  self.write_arr_text(elem);
  return self;
};
My_io.prototype.pop_text = function(elem){
  var self = this;
  if(self.arr_text.length){
    self.arr_text.pop();
  }
  self.write_arr_text(elem);
  return self;
};
