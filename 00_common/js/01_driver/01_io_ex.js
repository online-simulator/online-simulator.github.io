// online-simulator.github.io

My_entry.io_ex = function(){
};

My_entry.io_ex.prototype.onclick_C = function(elems){
  var self = this;
  self.clear_memory();
  self.clear_all_text(elems.i, elems.o);
  return self;
};
My_entry.io_ex.prototype.onclick_BS = function(elems){
  var self = this;
  self.pop_text(elems.i);
  return self;
};
My_entry.io_ex.prototype.onclick_DEL = function(elems){
  var self = this;
  return self;
};
My_entry.io_ex.prototype.onclick_ans = function(elems){
  var self = this;
  var text = self.read_text(elems.o);
  text = (self.entry.def.isNumber(text))? text: "ans";
  self.clear_memory();
  self.push_text(elems.i, text);
  return self;
};
My_entry.io_ex.prototype.onclick_default = function(elems, text){
  var self = this;
  self.push_text(elems.i, text);
  return self;
};
