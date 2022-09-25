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
  var rev = self.rev;
  var fwd = self.fwd;
  fwd.length = 0;
  if(rev.length > self.len_max){
    rev[0] = null;
    rev.shift();
  }
  rev.push(data);
  return self;
};
My_entry.handler_history.prototype.forward = function(){
  var self = this;
  var _data = null;
  var rev = self.rev;
  var fwd = self.fwd;
  if(fwd.length > 0){  // > 0
    rev.push(fwd.pop());
    _data = rev[rev.length-1];
  }
  return _data;
};
My_entry.handler_history.prototype.reverse = function(){
  var self = this;
  var _data = null;
  var rev = self.rev;
  var fwd = self.fwd;
  if(rev.length > 1){  // > 1
    fwd.push(rev.pop());
    _data = rev[rev.length-1];
  }
  return _data;
};
