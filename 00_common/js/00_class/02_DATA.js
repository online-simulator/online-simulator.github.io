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
/* calc-Ver.2.222.50 */
My_entry.DATA.prototype.trees_msg = function(msg){
  var self = this;
  return self.tree2trees(self.tree_tag("out", msg));
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
/* calc-Ver.2.196.46 */
My_entry.DATA.prototype.isStrictFalse_arr = function(arr){
  var self = this;
  var has1elem = (arr.length === 1 && arr[0].length === 1 && arr[0][0].com);
  return (has1elem && ((arr[0][0].com.r === false && Number(arr[0][0].com.i) === 0) || (isNaN(arr[0][0].com.r) || isNaN(arr[0][0].com.i))));
};
My_entry.DATA.prototype.isFalse_arr = function(arr){
  var self = this;
  var has1elem = (arr.length === 1 && arr[0].length === 1 && arr[0][0].com);
  return (has1elem && ((Number(arr[0][0].com.r) === 0 && Number(arr[0][0].com.i) === 0) || (isNaN(arr[0][0].com.r) || isNaN(arr[0][0].com.i))));  // calc-Ver.2.165.40
};
My_entry.DATA.prototype.hasVar_arr = function(arr, opt_tagName){  // calc-Ver.2.283.67
  var self = this;
  var _hasVar = false;
  /* calc-Ver.2.283.67 -> */
  var callback = (opt_tagName)?
    function(arrij){
      return (arrij && !(arrij.com || arrij[opt_tagName]));
    }:
    function(arrij){
      return (arrij && !(arrij.com));
    };
  /* -> calc-Ver.2.283.67 */
  for(var i=0, len_i=arr.length; i<len_i; ++i){
    for(var j=0, len_j=arr[i].length; j<len_j; ++j){
      _hasVar = _hasVar || callback(arr[i][j]);  // calc-Ver.2.224.51  // calc-Ver.2.283.67
    }
    if(_hasVar) break;
  }
  return _hasVar;
};
/* calc-Ver.2.302.73 -> */
My_entry.DATA.prototype.delProp_tree = function(_tree, prop){
  var self = this;
  if(_tree){
    var tagName = Object.keys(_tree)[0];
    delete _tree[tagName][prop];
  }
  return _tree;
};
/* calc-Ver.2.276.65 */
My_entry.DATA.prototype.setProp_tree = function(_tree, prop, val){
  var self = this;
  if(_tree){
    var tagName = Object.keys(_tree)[0];
    _tree[tagName][prop] = val;
  }
  return _tree;
};
My_entry.DATA.prototype.getProp_tree = function(tree, prop){
  var self = this;
  var _prop = null;
  if(tree){
    var tagName = Object.keys(tree)[0];
    _prop = tree[tagName][prop];
  }
  return _prop;
};
/* -> calc-Ver.2.302.73 */
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
/* Ver.2.823.135 */
My_entry.DATA.prototype.arr2args = function(arr){
  var self = this;
  var _arri = null;
  var len_i = arr.length;
  if(len_i === 1){
    _arri = arr[0];
  }
  else{
    _arri = [];
    for(var i=0; i<len_i; ++i){
      _arri.push.apply(_arri, arr[i]);  // serialize
    }
  }
  return _arri;
};
My_entry.DATA.prototype.arr2obj_i = function(arr, i){
  var self = this;
  var _arri = arr[i];
  return _arri[_arri.length-1];
};
My_entry.DATA.prototype.vec2arr = function(vec, isRow){  // Ver.2.237.56
  var self = this;
  var _arr = [];
  /* Ver.2.237.56 -> */
  var len = vec.length;
  if(isRow){
    _arr[0] = [];
    for(var i=0; i<len; ++i){
      _arr[0][i] = vec[i];
    }
  }
  else{
    for(var i=0; i<len; ++i){
      _arr[i] = [vec[i]];
    }
  }
  /* -> Ver.2.237.56 */
  return _arr;
};
/* calc-Ver.2.217.50 */
/* calc-Ver.2.214.49 */
My_entry.DATA.prototype.arr2arri_NaN = function(_arr){
  var self = this;
  for(var i=0, len=_arr.length; i<len; ++i){
    var arri = _arr[i];
    if(arri.length === 0){
      arri[0] = self.num(NaN, NaN);
    }
  }
  return _arr;
};
/* calc-Ver.2.777.123 */
My_entry.DATA.prototype.arr2table = function(arr){
  var self = this;
  var _table = [];
  var len_i = arr.length;
  for(var i=0; i<len_i; ++i){
    _table.push([]);
    var len_j = arr[i].length;
    for(var j=0; j<len_j; ++j){
      _table[_table.length-1].push(arr[i][j].com.r);
    }
  }
  return _table;
};
