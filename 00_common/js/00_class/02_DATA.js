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
My_entry.DATA.prototype.newNum = function(num){
  var self = this;
  var com = num.com;
  var err = num.err;
  var isL = num.isL;
  return {com: self.com(com.r, com.i), err: self.com(err.r, err.i), isL: self.com(isL.r, isL.i)};
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
My_entry.DATA.prototype.make_trees = function(_arr_tree){
  var self = this;
  return _arr_tree;
};
My_entry.DATA.prototype.data = function(trees, options, vars, eqns){
  var self = this;
  return {trees: trees, options: options || {}, vars: vars || {}, eqns: eqns || {}};
};
My_entry.DATA.prototype.scope = function(vars, eqns){
  var self = this;
  return {vars: vars || {}, eqns: eqns || {}};
};
My_entry.DATA.prototype.arr2num = function(arr){
  var self = this;
  var arri = arr[arr.length-1];
  return arri[arri.length-1];
};
My_entry.DATA.prototype.arr2arr00 = function(arr){
  var self = this;
  return self.obj2arr(self.arr2num(arr));
};
My_entry.DATA.prototype.isFalse_arr = function(arr){
  var self = this;
  var has1Com = (arr.length === 1 && arr[0].length === 1 && arr[0][0].com);
  return (has1Com && ((arr[0][0].com.r === 0 && arr[0][0].com.i === 0) || isNaN(arr[0][0].com.r && arr[0][0].com.i)));
};
My_entry.DATA.prototype.hasVar_arr = function(arr){
  var self = this;
  var _hasVar = false;
  for(var i=0, len_i=arr.length; i<len_i; ++i){
    for(var j=0, len_j=arr[i].length; j<len_j; ++j){
      _hasVar = _hasVar || !(arr[i][j].com);
    }
    if(_hasVar) break;
  }
  return _hasVar;
};
My_entry.DATA.prototype.tree2num = function(tree){
  var self = this;
  var mat = (tree)? tree.mat: null;
  var arr = (mat)? mat.arr: null;
  var _num = (arr)? self.arr2num(arr): null;
  return _num;
};
My_entry.DATA.prototype.out2num = function(out){
  var self = this;
  var tree = (out.length)? out[out.length-1][0]: null;
  return self.tree2num(tree);
};
My_entry.DATA.prototype.arr2args = function(arr){
  var self = this;
  var arri = arr[arr.length-1];
  return arri;
};
My_entry.DATA.prototype.arr2obj_i = function(arr, i){
  var self = this;
  var _arri = arr[i];
  return _arri[_arri.length-1];
};
My_entry.DATA.prototype.vec2arr = function(vec){
  var self = this;
  var _arr = [];
  for(var i=0, len=vec.length; i<len; ++i){
    _arr[i] = [vec[i]];
  }
  return _arr;
};
