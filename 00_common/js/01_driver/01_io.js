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
My_io.prototype.clear_text = function(dom){
  var self = this;
  self.write_text(dom, "");
  return self;
};
My_io.prototype.read_text = function(dom){
  var self = this;
  var _text = "";
  if(dom){
    switch(dom.tagName.toUpperCase()){
      case "INPUT":
      case "TEXTAREA":
      case "SELECT":
////////////////////////////////////////////////////////////
        _text = dom[My_config.REFERRER.value];
////////////////////////////////////////////////////////////
        break;
      default:
////////////////////////////////////////////////////////////
        _text = dom[My_config.REFERRER.text];
////////////////////////////////////////////////////////////
        break;
    }
  }
  return _text;
};
My_io.prototype.write_text = function(dom, text){
  var self = this;
  if(dom){
    switch(dom.tagName.toUpperCase()){
      case "INPUT":
      case "TEXTAREA":
      case "SELECT":
////////////////////////////////////////////////////////////
        dom[My_config.REFERRER.value] = text;
////////////////////////////////////////////////////////////
        break;
      default:
////////////////////////////////////////////////////////////
        dom[My_config.REFERRER.text] = text;
////////////////////////////////////////////////////////////
        break;
    }
  }
  return self;
};
My_io.prototype.write_arr_text = function(dom){
  var self = this;
  var text = self.arr_text.join("");
  self.write_text(dom, text);
  return self;
};
My_io.prototype.push_text = function(dom, text){
  var self = this;
  self.arr_text.push(text);
  self.write_arr_text(dom);
  return self;
};
My_io.prototype.pop_text = function(dom){
  var self = this;
  if(self.arr_text.length){
    self.arr_text.pop();
  }
  self.write_arr_text(dom);
  return self;
};
