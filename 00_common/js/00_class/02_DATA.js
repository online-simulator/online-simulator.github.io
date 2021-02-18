// online-simulator.github.io

My_entry.DATA = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.DATA.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.DATA.prototype.com = function(r, i){
  var self = this;
  return {r: r, i: i};
};
My_entry.DATA.prototype.num = function(r, i){
  var self = this;
  return {com: self.com(r, i), err: self.com(0, 0), isL: self.com(false, false)};
};
My_entry.DATA.prototype.numFull = function(cr, ci, er, ei, ir, ii){
  var self = this;
  return {com: self.com(cr, ci), err: self.com(er, ei), isL: self.com(ir, ii)};
};
My_entry.DATA.prototype.tag = function(name, val){
  var self = this;
  var _obj = {};
  _obj[name] = {val: val};
  return _obj;
};
My_entry.DATA.prototype.mat = function(arr){
  var self = this;
  var _obj = {};
  _obj.mat = {arr: arr};
  return _obj;
};
My_entry.DATA.prototype.tree_num = function(r, i){
  var self = this;
  var obj = self.num(r, i);
  return self.tree_mat(self.obj2arr(obj));
};
My_entry.DATA.prototype.tree_numFull = function(cr, ci, er, ei, ir, ii){
  var self = this;
  var obj = self.numFull(cr, ci, er, ei, ir, ii);
  return self.tree_mat(self.obj2arr(obj));
};
My_entry.DATA.prototype.tree_tag = function(name, val){
  var self = this;
  var _obj = self.tag(name, val);
  return _obj;
};
My_entry.DATA.prototype.obj2arr = function(obj){
  var self = this;
  return [[obj]];
};
My_entry.DATA.prototype.tree_mat = function(arr){
  var self = this;
  var _obj = self.mat(arr);
  return _obj;
};
My_entry.DATA.prototype.num2tree = function(num){
  var self = this;
  return self.tree_mat(self.obj2arr(num));
};
My_entry.DATA.prototype.tree2trees = function(tree){
  var self = this;
  return [tree];
};
My_entry.DATA.prototype.trees2tree = function(trees){
  var self = this;
  if(trees.length > 1) throw false;
  return trees[0];
};
My_entry.DATA.prototype.data = function(trees, options, vars, eqns){
  var self = this;
  return {trees: trees, options: options || {}, vars: vars || {}, eqns: eqns || {}};
};
