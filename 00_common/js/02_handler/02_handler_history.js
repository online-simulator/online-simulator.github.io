// online-simulator.github.io

My_entry.handler_history = function(opt_len_max){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_history.prototype.init = function(opt_len_max){
  var self = this;
  self.len_max = opt_len_max || 10;
  self.fwd = [];
  self.rev = [];
  return self;
};
My_entry.handler_history.prototype.save = function(data){
  var self = this;
  self.fwd = [];
  self.rev.push(data);
  if(self.rev.length-1 > self.len_max){
    self.rev[0] = null;
    self.rev.shift();
  }
  return self;
};
My_entry.handler_history.prototype.forward = function(){
  var self = this;
  var _data = self.fwd.pop();
  if(_data || _data === ""){
    self.rev.push(_data);
  }
  return _data;
};
My_entry.handler_history.prototype.reverse = function(){
  var self = this;
  var _data = null;
  if(self.rev.length-1 > 0){
    var data = self.rev.pop();
    if(data || data === ""){
      self.fwd.push(data);
    }
    _data = self.rev[self.rev.length-1];
  }
  return _data;
};
