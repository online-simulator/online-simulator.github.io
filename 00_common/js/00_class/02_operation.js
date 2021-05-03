// online-simulator.github.io

My_entry.operation = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.operation.config =
My_entry.operation.prototype.config = {
  precedence: [
                 // comments and white-spaces are removed by parser
    [
      [
        /* following delimiter */
                 // SeparatoR semi-colon; are removed by parser
        "SRr",   // SeparatoR colon:
        "SRt"    // SeparatoR comma,
      ],
      [
        /* following store */
        "SEe"    // StorE obvious equation including bracket
      ],
      [
        /* following delimiter */
        "BT2",   // BrackeT {
        "BT1",   // BrackeT (
        "BT0"    // BrackeT [
      ],
      [
        /* following restore */
        "REe",   // RestorE obvious equation
        "REv"    // RestorE variable first, equation second
      ],
      [
        /* following function */
        "FNmh",  // FunctioN for matrix high-order
        "FNm",   // FunctioN for matrix
        "FNh",   // FunctioN high-order
        "FN",    // FunctioN 1~4-arguments
        "FNn"    // FunctioN n-arguments
      ]
    ],
    [
      [
        /* following operator */
        "URi",   // post-Unary operatoR imaginary unit i
        "URf"    // factorial mark ! || !!... operand is only natural number
      ],
      [
        "BRp",   // Binary operatoR ** || ^ -> pow(left, right)
        "BRr"    // Binary operatoR %       -> mod(left, right)
      ],
      [
        "BRmo"   // omitted multiplication sign
      ],
      [
        "BRdm"   // Binary operatoR / || *
      ],
      [
        "BRsa"   // Binary operatoR - || + including Pre-Unary operator - || +
      ],
      [
        "BRbs",  // Binary operatoR bit shift << || >> || >>>
        "BRba",  // Binary operatoR bit   and &
        "BRbx",  // Binary operatoR bit   xor @
        "BRbo"   // Binary operatoR bit    or |
      ],
      [
        "BRcn",  // Binary operatoR comparison < || <= || >= || >
        "BRrl"   // Binary operatoR relational == || <>
      ]
    ],
    [
      [
        "BRe"    // Binary operatoR = including Pre-Unary operator =
      ],
      [
        /* following store */
        "SEv"    // StorE variable
      ]
    ]
  ],
  BT: {
    row2col: "BT2",
    ref:     "BT0",
    SEe:     "BTe",
    REe:     "BT1"
  },
  params: {
    dxJ: 1e-5,
    dxD: 1e-3,
    NI: 100
  }
};
My_entry.operation.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "def", "math", "math_mat", "DATA", "unit"]);
  My_entry.def.mix_in_props(My_entry.operation, My_entry.def, ["isNotNull", "isNotNullStr"]);
  My_entry.def.mix_in_props(My_entry.operation, My_entry.DATA, ["arr2num", "arr2args", "arr2obj_i"]);
  self.arr_precedence = [];
  self.options = {};
  self.isLocked_eqns = {};
  self.params = {};
  self.vars = null;
  self.eqns = null;
  return self;
};
My_entry.operation.prototype.throw_tree = function(tree){
  var self = this;
  var key = Object.keys(tree)[0];
  var obj = tree[key];
  var val = obj.val || obj;
  throw "Invalid "+key+"("+val+")";
  return self;
};
My_entry.operation.prototype.init_callbacks = function(options){
  var self = this;
  self.callbacks = {};
  self.arr_precedence.forEach(function(tagName){
    self.init_callback(options, tagName);
  });
  return self;
};
My_entry.operation.prototype.init_callback = function(options, tagName){
  var self = this;
  var type = tagName.substr(0, 2);
  var tagName_comp = tagName;
  var sw_tagName = tagName;
  var isRAandBR = (options.isRightAssociativityBR && (type === "BR"));
  var isBTref = (tagName === self.config.BT.ref);
  var isSEv = (tagName === "SEv");
  if(isBTref){
    sw_tagName = "BTref";
  }
  else if(isSEv){
    tagName_comp = "BRe";
  }
  if(isRAandBR || isBTref){
    self.callbacks[tagName] = function(data){
      var trees = data.trees;
      var len_i = trees.length;
      for(var i=len_i-1; i>=0; --i){
        var tree = trees[i];
        if(tree){
          var tagObj = tree[tagName_comp];
          if(tagObj){
            self[sw_tagName](data, i, tagName, tagObj);
          }
        }
      }
    };
  }
  else{
    self.callbacks[tagName] = function(data){
      var trees = data.trees;
      var len_i = trees.length;
      for(var i=0; i<len_i; ++i){
        var tree = trees[i];
        if(tree){
          var tagObj = tree[tagName_comp];
          if(tagObj){
            self[sw_tagName](data, i, tagName, tagObj);
          }
        }
      }
    };
  }
if(tagName === "BRmo"){
  if(isRAandBR){
    self.callbacks[tagName] = function(data){
      var trees = data.trees;
      var len_i = trees.length;
      for(var i=len_i-1; i>=0; --i){
        var tree = trees[i];
        if(tree){
          self[sw_tagName](data, i, tagName);
        }
      }
    };
  }
  else{
    self.callbacks[tagName] = function(data){
      var trees = data.trees;
      var len_i = trees.length;
      for(var i=0; i<len_i; ++i){
        var tree = trees[i];
        if(tree){
          self[sw_tagName](data, i, tagName);
        }
      }
    };
  }
}
  return self;
};
My_entry.operation.prototype.prepare = function(data){
  var self = this;
  var options = data.options;
  self.options.dxJ = options.dxJ || self.config.params.dxJ;
  self.options.dxD = options.dxD || self.config.params.dxD;
  self.options.NI = options.NI || self.config.params.NI;
  var arr_precedence = self.entry.def.newClone(self.config.precedence);
  if(options.precedence){
    arr_precedence[1] = options.precedence.split(",");
  }
  else{
    if(options.isDIVprior2OMUL){
      self.entry.math.switch_arr(arr_precedence[1], 2, 3);
    }
  }
  self.arr_precedence = arr_precedence.join().split(",").filter(self.isNotNullStr);
  self.init_callbacks(options);
  self.init_callbacks_mat(options);
  return self;
};
My_entry.operation.prototype.clear = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  data.vars = {};
  data.eqns = {};
  data.trees = DATA.tree2trees(DATA.tree_tag("out", "local storage cleared"));
  return self;
};
/* Ver.1.6.3 */
My_entry.operation.prototype.store = function(data){
  var self = this;
  var def = self.entry.def;
  var DATA = self.entry.DATA;
  self.vars = def.newClone(data.vars);
  self.eqns = def.newClone(data.eqns);
  data.trees = DATA.tree2trees(DATA.tree_tag("out", "local storage stored"));
  return self;
};
/* Ver.1.6.3 */
My_entry.operation.prototype.restore = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var buffer = (self.vars && self.eqns);
  if(buffer){
    data.vars = self.vars;
    data.eqns = self.eqns;
  }
  var msg = (buffer)? "local storage restored": "null buffer";
  data.trees = DATA.tree2trees(DATA.tree_tag("out", msg));
  return self;
};
My_entry.operation.prototype.stop = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  self.options.isStopped = true;
  data.trees = DATA.tree2trees(DATA.tree_tag("out", "operation stopped"));
  return self;
};
My_entry.operation.prototype.run = function(_data){
  var self = this;
  var trees2d = _data.trees2d;
  try{
    self.prepare(_data);
    for(var j=0, len=trees2d.length; j<len; ++j){
      var trees = trees2d[j];
      _data.trees = trees;
      if(Array.isArray(trees)){
        self.init_flags();
        self.remake_trees(_data);
        self.SEans(_data, 0);
      }
      else{
        var command = trees;
        self[command](_data);
        if(self.options.isStopped){
          var trees = _data.trees;
          for(var jj=j; jj<len; ++jj){
            _data.trees2d[jj] = trees;
          }
          break;
        }
      }
      trees2d[j] = _data.trees;
    }
//    _data.options.depth_max = self.params.depth_max;
  }
  catch(e){
    self.init_buffers();
    throw e;
  }
  return _data;
};
My_entry.operation.prototype.init_buffers = function(){
  var self = this;
  self.init_flags();
  self.init_params();
  self.vars = null;
  self.eqns = null;
  return self;
};
My_entry.operation.prototype.init_flags = function(){
  var self = this;
  self.isLocked_eqns = {};
  return self;
};
My_entry.operation.prototype.init_params = function(){
  var self = this;
  self.params.BT = null;
  self.params.depth = 0;
  self.params.hasUndefVars = 0;
  return self;
};
My_entry.operation.prototype.remake_trees = function(data){
  var self = this;
  // store params
  var BT = self.params.BT;
  var depth = self.params.depth;
  var hasUndefVars = self.params.hasUndefVars;
  // init params
  self.init_params();  // here for mdx=Newton(<=f,<=x)
  // remake
  self.data2trees(data);
  // restore params
  self.params.BT = BT;
  self.params.depth = depth;
  self.params.hasUndefVars = hasUndefVars;
  // return
  return data.trees;
};
My_entry.operation.prototype.data2trees = function(data){
  var self = this;
  var depth = self.params.depth++;
  data.trees = self.entry.def.newClone(data.trees);  // tree_eqn is re-used
  self.arr_precedence.forEach(function(tagName){
    self.callbacks[tagName](data);
    data.trees = data.trees.filter(self.isNotNull);
  });
//  self.params.depth_max = Math.max((self.params.depth_max || 0), depth);
  self.params.depth = depth;
  return data.trees;
};
My_entry.operation.prototype.feedback2trees = function(data, is, ie, tree, isRightAssociativity){
  var self = this;
  var trees = data.trees;
  for(var i=is; i<=ie; ++i){
    trees[i] = null;
  }
  var i_feedback = (isRightAssociativity)? Math.max(0, is): ie;  // i >= 0
  trees[i_feedback] = tree;
  return self;
};
My_entry.operation.prototype.get_tag = function(tree, tagName){
  var self = this;
  return ((tree)? tree[tagName]: null);
};
My_entry.operation.prototype.get_tagVal = function(tree, tagName, valName){
  var self = this;
  return ((tree)? ((tree[tagName])? tree[tagName][valName]: null): null);
};
My_entry.operation.prototype.get_newData = function(data, trees){
  var self = this;
  return self.entry.DATA.data(trees, data.options, data.vars, data.eqns);
};
My_entry.operation.prototype.tree2tree_mat = function(tree){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = null;
  if(!(tree) || tree.out){  // (,x=1) -> (0,0)
    _tree = DATA.tree_num(0, 0);
  }
  else if(tree.mat){
    _tree = tree;
  }
  else{
    /* Ver.2.19.6 -> */
/*
    _tree = (self.isType(tree, "FN"))? tree: DATA.tree_mat(DATA.obj2arr(tree));
*/
    _tree = DATA.tree_mat(DATA.obj2arr(tree));
    /* -> Ver.2.19.6 */
  }
/*
  else if(tree.out){
    var arr = tree.out.val.arr;
    if(arr){
      var math_mat = self.entry.math_mat;
      _tree = DATA.tree_mat(math_mat.zeros2d_arr(arr));  // x=(1,2:),1 -> troublesome error
    }
  }
*/
  return _tree;
};
My_entry.operation.prototype.BT2 =
My_entry.operation.prototype.BT1 =
My_entry.operation.prototype.BT0 = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  self.params.BT = tagName;
  var newTrees = self.data2trees(self.get_newData(data, tagObj.val));
  var tree = self.tree2tree_mat(DATA.trees2tree(newTrees));
  self.feedback2trees(data, is, ie, tree);
  return self;
};
My_entry.operation.prototype.BTref = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  self.params.BT = tagName;
  var newTrees = self.data2trees(self.get_newData(data, tagObj.val));
  var tree = self.tree2tree_mat(DATA.trees2tree(newTrees));
  var arr = tree.mat.arr;
  var arr0 = arr[0];
  var len_i = arr.length;
  var len_j = arr0.length;
  var isVal = (len_i === 1 && len_j === 1);
  var leftTree = trees[i0-1];
  var thisTree = trees[i0];
  var ref0 = thisTree[tagName].ref;
  /* Ver.1.4.3 */
  if(isVal){  // [1,2:3,4][0][1,2:3,4][0] -> (1,2)
    var ref = [];
    for(var j=0; j<len_j; ++j){
      /* Ver.1.5.3 */
      var num = arr0[j];
      if(num.com){
        ref[j] = num.com.r;
      }
      else{
        self.throw_tree(num);
      }
    }
    if(ref0){
      Array.prototype.push.apply(ref, ref0);
    }
    if(leftTree){
      if(leftTree["REv"]){
        leftTree["REv"]["ref"] = ref;
        tree = null;
      }
      else if(leftTree[tagName]){
        leftTree[tagName]["ref"] = ref;
        tree = null;
      }
      else if(leftTree["mat"]){
        var mat = leftTree.mat;
        mat.arr = self.restore_arr(mat.arr, ref);
        tree = null;
      }
      else{
        self.throw_tree(leftTree);
      }
    }
    else{
      throw "Invalid reference";
    }
  }
  else{
    if(ref0){
      var mat = tree.mat;
      mat.arr = self.restore_arr(mat.arr, ref0);
    }
  }
  self.feedback2trees(data, is, ie, tree, true);
  return self;
};
My_entry.operation.prototype.SRr_or_SRt = function(data, i0, tagName, tagObj, isSRt){
  var self = this;
  var trees = data.trees;
  var DATA = self.entry.DATA;
  var len = trees.length;
  var leftTrees = trees.slice(0, i0);
  var rightTrees = trees.slice(i0+1, len);
  var leftTree = null;
  var rightTree = null;
  var BT = self.params.BT;  // store BT
  var isBTrow2col = (BT === self.config.BT.row2col);
  /* in only one direction, left to right */
  leftTrees = self.data2trees(self.get_newData(data, leftTrees));
  leftTree = DATA.trees2tree(leftTrees);
  self.params.BT = BT;      // restore BT
  rightTrees = self.data2trees(self.get_newData(data, rightTrees));
  rightTree = DATA.trees2tree(rightTrees);
  leftTree = self.tree2tree_mat(leftTree);
  rightTree = self.tree2tree_mat(rightTree);
  var leftMat = leftTree.mat;
  var leftArr = leftMat.arr;
  var rightArr = rightTree.mat.arr;
  if(isBTrow2col^isSRt){  // xor
    var len_i = Math.max(leftArr.length, rightArr.length);
    var len_j = 0;
    for(var i=0; i<len_i; ++i){
      var leftArri = leftArr[i];
      var rightArri = rightArr[i];
      /* Ver.1.4.2 */  // {:1,2} || {0:1,2} -> (0,1:0,2)
      /* Ver.1.4.3 */  // (1,2),{3,4:5:6,7:8,9,10} -> (1,2,3,5,6,8:0,0,4,0,7,9:0,0,0,0,0,10)
      if(leftArri){
        len_j = leftArri.length;
      }
      else{
        leftArri = [];
        for(var j=0; j<len_j; ++j){
          leftArri[j] = DATA.num(0, 0);
        }
      }
      if(rightArri){
        leftArr[i] = leftArri.concat(rightArri);  // col: mat.arr[i]
      }
    }
  }
  else{
    if(rightArr){
      leftMat.arr = leftArr.concat(rightArr);     // row: mat.arr
    }
  }
  var tree = leftTree;
  var is = 0;
  var ie = len-1;
  self.feedback2trees(data, is, ie, tree);
  return self;
};
My_entry.operation.prototype.SRr = function(data, i0, tagName, tagObj){
  var self = this;
  self.SRr_or_SRt(data, i0, tagName, tagObj, false);
  return self;
};
My_entry.operation.prototype.SRt = function(data, i0, tagName, tagObj){
  var self = this;
  self.SRr_or_SRt(data, i0, tagName, tagObj, true);
  return self;
};
My_entry.operation.prototype.isType = function(tree, type_comp){
  var self = this;
  var tagName = Object.keys(tree)[0];
  var type = tagName.substr(0, 2);
  return ((type === type_comp)? tagName: null);
};
My_entry.operation.prototype.tree_BT2tree = function(data, tree){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = null;
  var tagName = self.isType(tree, "BT");
  if(tagName){
    var newData = DATA.data(DATA.tree2trees(tree), data.options);
    var obj = DATA.tag(tagName, self.get_tagVal(tree, tagName, "val"));
    self[tagName](newData, 0, tagName, obj[tagName]);
    _tree = DATA.trees2tree(newData.trees);
  }
  else{
    self.throw_tree(tree);
  }
  return _tree;
};
My_entry.operation.prototype.tree2tree_eqn = function(data, tree){
  var self = this;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  var trees = self.get_tagVal(tree, BT.SEe, "val");
  if(trees){
    _tree = DATA.trees2tree(trees);
    var name_eqn = self.get_tagVal(_tree, "REv", "val");
    if(name_eqn){
      _tree = self.restore_eqn(eqns, name_eqn);
      /* Ver.1.6.3 */  // _rn(<={run},,1) -> _rn(<=run,,1) allowed -> _rn(<=(run),,1)
/*
      if(_tree){
        _tree = DATA.trees2tree(self.get_tagVal(_tree, BT.REe, "val"));
      }
*/
    }
  }
  if(!(_tree)){
    self.throw_tree(tree);
  }
  return _tree;
};
My_entry.operation.prototype.get_dxJ = function(x, h){
  var self = this;
  var DATA = self.entry.DATA;
  var hc = h.com;
  var hcr = hc.r;
  var hci = hc.i;
  return DATA.com(hcr, hci);
};
My_entry.operation.prototype.get_dxD = function(x, h){
  var self = this;
  var DATA = self.entry.DATA;
  /* Ver.1.3.1 */
  var xc = x.com;
  var hc = h.com;
  var hcr = Math.max(1, Math.abs(xc.r))*hc.r;
  var hci = Math.max(1, Math.abs(xc.i))*hc.i;
  return DATA.com(hcr, hci);
};
My_entry.operation.prototype.get_hc = function(options, x, dx, sw_name){
  var self = this;
  var DATA = self.entry.DATA;
  var isFixed = (dx && dx.com);
  var dxo = self.options[sw_name];
  var dx0 = (isFixed)? dx: DATA.num(dxo, dxo);
  var h = DATA.num(dx0.com.r, ((options.useComplex)? dx0.com.i: 0));
  var _hc = (isFixed)? h.com: self["get_"+sw_name](x, h);
  return _hc;
};
My_entry.operation.prototype.jacobian = function(data, rightArr, isNewtonian){
  var self = this;
  var options = data.options;
  var vars = data.vars;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _tree = null;
  var msgErr = "Invalid J arguments";
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  var get_tree = function(j){
    return self.tree2tree_eqn(data, args[j]);
  };
  var get_names = function(j){
    var _names = [];
    var tree_BT = get_tree(j);
    var tree = self.tree_BT2tree(data, tree_BT);
    var arr = self.get_tagVal(tree, "mat", "arr");
    if(arr){
      var len_i = arr.length;
      for(var i=0; i<len_i; ++i){
        var name = self.get_tagVal(self.arr2obj_i(arr, i), "REv", "val");
        if(name){
          _names.push(name);
        }
        else{
          throw msgErr;
        }
      }
    }
    else{
      throw msgErr;
    }
    return _names;
  };
  var get_arr = function(j){
    var _arr = [];
    var tree = self.tree_eqn2tree(data, get_tree(j));
    if(tree.mat){
      _arr = tree.mat.arr;
    }
    else{
      throw msgErr;
    }
    return _arr;
  };
  if(len_j > 1){
    var tree_eqn = get_tree(0);
    var names = get_names(1);
    var len_i = names.length;
    var arr_x = null;
    if(len_j > 2){
      arr_x = get_arr(2);
      if(arr_x.length-len_i) throw msgErr;
    }
    else{
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    /* Ver.1.3.1 */
    var hc = self.get_hc(options, null, args[3], "dxJ");
    var hcr = hc.r;
    var hci = hc.i;
    var h0 = DATA.num(hcr, hci);
    var isFound_x0 = [];
    var dx = [];
    var x0 = [];
    var x1 = [];
    var f0 = [];
    var i0 = [];
    var j0 = [];
    var J = math_mat.init2d(len_i, len_i);
    // x0
    for(var i=0; i<len_i; ++i){
      var name_var = names[i];
      var num = null;
      if(vars[name_var]){
        isFound_x0[i] = true;
        var tree = self.restore_var(vars, name_var);
        num = self.arr2num(tree.mat.arr);
      }
      else{
        isFound_x0[i] = false;
        num = self.arr2obj_i(arr_x, i);
        if(num.com){
          self.store_var(vars, name_var, DATA.num2tree(num));
        }
        else{
          self.throw_tree(num);
        }
      }
      x0[i] = num;
    }
    // x1
    for(var i=0; i<len_i; ++i){
      var x0ic = x0[i].com;
      dx[i] = h0;
      x1[i] = DATA.num(x0ic.r+hcr, x0ic.i+hci);
    }
    // f0
    var tree = self.tree_eqn2tree(data, tree_eqn);
    var arr_f0 = tree.mat.arr;
    /* Ver.1.5.3 */  // f<={A(x)=b}
    var len_fi = arr_f0.length;
    var len_fj = arr_f0[len_fi-1].length;
    var get_f = null;
    if(len_fi === len_i){
      get_f = function(arr_f, i){
        return self.arr2obj_i(arr_f, i);
      };
    }
    else if(len_fi*len_fj === len_i){
      for(var i=0; i<len_i; ++i){
        var ii = Math.floor(i/len_fi);
        var jj = i-ii*len_fi;
        var arr_f0ii = arr_f0[ii];
        if(!(arr_f0ii && arr_f0ii[jj])) throw msgErr;
        i0[i] = ii;
        j0[i] = jj;
      }
      get_f = function(arr_f, i){
        return arr_f[i0[i]][j0[i]];
      };
    }
    else{
      throw msgErr;
    }
    for(var i=0; i<len_i; ++i){
      f0[i] = get_f(arr_f0, i);
    }
    // J
    for(var j=0; j<len_i; ++j){
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        var num = (i === j)? x1[i]: x0[i];
        self.store_var(vars, name_var, DATA.num2tree(num));
      }
      var tree = self.tree_eqn2tree(data, tree_eqn);
      var arr_f1 = tree.mat.arr;
      for(var i=0; i<len_i; ++i){
        var f1i = get_f(arr_f1, i);
        J[i][j] = unit["BRd"](options, unit["BRs"](options, f1i, f0[i]), dx[i]);
      }
    }
    if(isNewtonian){
      for(var i=0; i<len_i; ++i){
        J[i].push(f0[i]);
      }
      var arr_mdx = math_mat.gaussian(options, J);
      _tree = DATA.tree_mat(arr_mdx);
      // store x_next
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        var mdxi = self.arr2obj_i(arr_mdx, i);
        self.store_var(vars, name_var, DATA.num2tree(unit["BRs"](options, x0[i], mdxi)));
      }
    }
    else{
      _tree = DATA.tree_mat(J);
      // restore x0
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        if(isFound_x0[i]){
          self.store_var(vars, name_var, DATA.num2tree(x0[i]));
        }
        else{
          delete vars[name_var];
        }
      }
    }
  }
  else{
    throw msgErr;
  }
  return _tree;
};
My_entry.operation.prototype.FNmh = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var is = i0;
  var ie = i0+1;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var prop = tagObj.val;
    var tree = self.jacobian(data, rightArr, (prop === "newtonian"));
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
My_entry.operation.prototype.FNm = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0+1;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var prop = tagObj.val;
    var tree = DATA.tree_mat(math_mat[prop](options, rightArr));
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
My_entry.operation.prototype.arr_tree2tree = function(data, i0, tagName, tagObj, arr_tree){
  var self = this;
  var DATA = self.entry.DATA;
  var newData = self.get_newData(data, DATA.make_trees(arr_tree));
  self[tagName](newData, i0, tagName, tagObj);
  return DATA.trees2tree(newData.trees.filter(self.isNotNull));
};
My_entry.operation.prototype.RX = function(data, rightArr, tagObj){
  var self = this;
  var vars = data.vars;
  var DATA = self.entry.DATA;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 2){
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var br = Math.floor(b.com.r);
      var RX = function(callback){
        for(var i=1; i<=br; ++i){  // i=1
          callback(i);
        }
      };
      var name_var = tagObj.val.name;
      var tree_var = self.restore_var(vars, name_var);
      var tree = DATA.num2tree(a);
      RX(function(i){
        self.store_var(vars, name_var, tree);
        tree = self.tree_eqn2tree(data, tree_eqn);
      });
      _tree = tree;
      if(tree_var){
        self.store_var(vars, name_var, tree_var);
      }
      else{
        delete vars[name_var];
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.DX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var vars = data.vars;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 0){
    var name_var = tagObj.val.name;
    var tree_var = self.restore_var(vars, name_var);
    var a0 = (tree_var)? self.arr2num(tree_var.mat.arr): null;
    /* Ver.1.3.1 */
    var a = args[2] || a0;
    if(a && a.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var nthd = args[1];
      nthd = (nthd && nthd.com)? Math.abs(Math.floor(nthd.com.r)): 1;  // nthd >= 0
      var h0c = self.get_hc(options, a, args[3], "dxD");
      var h0cr = h0c.r;
      var h0ci = h0c.i;
      var num_8 = DATA.num(8, 0);
      var get_newX = function(x, cr, ci){
        var _newX = DATA.newNum(x);
        var com = _newX.com;
        com.r += cr;
        com.i += ci;
        return _newX;
      };
      var calc_f = function(x, cr, ci){
        self.store_var(vars, name_var, DATA.num2tree(get_newX(x, cr, ci)));
        return self.arr2num(self.tree_eqn2tree(data, tree_eqn).mat.arr);
      };
      var DX_order2 = function(x, n){
        var xm0, xp0;
        var fm0, fp0;
        var p = 1<<(n-1);
        var hcr = h0cr*p;
        var hci = h0ci*p;
        var hcrp2 = hcr*hcr;
        var hcip2 = hci*hci;
        if(n === 1){
          fm0 = calc_f(x, -hcr, -hci);
          fp0 = calc_f(x, hcr, hci);
        }
        else{
          fm0 = DX_order2(get_newX(x, -hcr, -hci), n-1);
          fp0 = DX_order2(get_newX(x, hcr, hci), n-1);
        }
        var df = unit["BRs"](options, fp0, fm0);
        var _num = unit["BRd"](options, df, DATA.num(hcr*2, hci*2));
        _num.err.r = Math.max(hcrp2, df.err.r);
        _num.err.i = Math.max(hcip2, df.err.i);
        return _num;
      };
      var DX_order4 = function(x, n){
        var xm1, xm0, xp0, xp1;
        var fm1, fm0, fp0, fp1;
        var p = 1<<(n-1);  // extend order2
        var hcr = h0cr*p;
        var hci = h0ci*p;
        var hcrp2 = hcr*hcr;
        var hcip2 = hci*hci;
        var hcr2 = hcr*2;
        var hci2 = hci*2;
        if(n === 1){
          fm1 = calc_f(x, -hcr2, -hci2);
          fm0 = calc_f(x, -hcr, -hci);
          fp0 = calc_f(x, hcr, hci);
          fp1 = calc_f(x, hcr2, hci2);
        }
        else{
          fm1 = DX_order4(get_newX(x, -hcr2, -hci2), n-1);
          fm0 = DX_order4(get_newX(x, -hcr, -hci), n-1);
          fp0 = DX_order4(get_newX(x, hcr, hci), n-1);
          fp1 = DX_order4(get_newX(x, hcr2, hci2), n-1);
        }
        var df0 = unit["BRs"](options, fp0, fm0);
        var df1 = unit["BRs"](options, fp1, fm1);
        var df = unit["BRs"](options, unit["BRm"](options, num_8, df0), df1);
        var _num = unit["BRd"](options, df, DATA.num(hcr*12, hci*12));
        _num.err.r = Math.max(hcrp2*hcrp2, df.err.r);
        _num.err.i = Math.max(hcip2*hcip2, df.err.i);
        return _num;
      };
      var num = null;
      if(nthd === 0){
        num = calc_f(a, 0, 0);
      }
      else{
        var DX = (nthd < 3)? DX_order4: DX_order2;
        if(options.orderD === 2){
          DX = DX_order2;
        }
        else if(options.orderD === 4){
          DX = DX_order4;
        }
        num = DX(a, nthd);
      }
      _tree = DATA.num2tree(num);
    }
    if(tree_var){
      self.store_var(vars, name_var, tree_var);
    }
    else{
      delete vars[name_var];
    }
  }
  return _tree;
};
My_entry.operation.prototype.IX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var vars = data.vars;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 2){
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var N = args[3];
      N = (N && N.com)? N.com.r: null;
      N = Math.abs(Math.floor(N || self.options.NI));  // N > 0
      N = (N%2)? N+1: N;
      var acr = a.com.r;
      var aci = a.com.i;
      var bcr = b.com.r;
      var bci = b.com.i;
      var hcr = (bcr-acr)/N;
      var hci = (bci-aci)/N;
      var hcrp2 = hcr*hcr;
      var hcip2 = hci*hci;
      var h0 = DATA.num(hcr, ((options.useComplex)? hci: 0));
      var h0cr = h0.com.r;
      var h0ci = h0.com.i;
      var name_var = tagObj.val.name;
      var tree_var = self.restore_var(vars, name_var);
      var calc_f = function(cr, ci){
        self.store_var(vars, name_var, DATA.tree_num(cr, ci));
        return self.arr2num(self.tree_eqn2tree(data, tree_eqn).mat.arr);
      };
      var DI_order2 = function(){
        var sume = DATA.num(0, 0);
        for(var i=1; i<N; ++i){
          sume = unit["BRa"](options, sume, calc_f(acr+i*hcr, aci+i*hci));
        }
        var sum0 = unit["BRa"](options, calc_f(acr, aci), calc_f(bcr, bci));
        var _sum = sum0;
        _sum = unit["BRd"](options, _sum, DATA.num(2, 0));
        _sum = unit["BRa"](options, _sum, sume);
        _sum = unit["BRm"](options, _sum, h0);
        _sum.err.r = Math.max(hcrp2, _sum.err.r);
        _sum.err.i = Math.max(hcip2, _sum.err.i);
        return _sum;
      };
      var DI_order4 = function(){
        var sume_odd = DATA.num(0, 0);
        for(var i=1; i<N; i+=2){
          sume_odd = unit["BRa"](options, sume_odd, calc_f(acr+i*hcr, aci+i*hci));
        }
        var sume_even = DATA.num(0, 0);
        for(var i=2; i<N; i+=2){
          sume_even = unit["BRa"](options, sume_even, calc_f(acr+i*hcr, aci+i*hci));
        }
        var sum0 = unit["BRa"](options, calc_f(acr, aci), calc_f(bcr, bci));
        var _sum = sum0;
        _sum = unit["BRa"](options, _sum, unit["BRm"](options, sume_odd, DATA.num(4, 0)));
        _sum = unit["BRa"](options, _sum, unit["BRm"](options, sume_even, DATA.num(2, 0)));
        _sum = unit["BRm"](options, _sum, DATA.num(h0cr/3, h0ci/3));
        _sum.err.r = Math.max(hcrp2*hcrp2, _sum.err.r);
        _sum.err.i = Math.max(hcip2*hcip2, _sum.err.i);
        return _sum;
      };
      var DI = (options.orderI === 2)? DI_order2: DI_order4;
      _tree = DATA.num2tree(DI());
      if(tree_var){
        self.store_var(vars, name_var, tree_var);
      }
      else{
        delete vars[name_var];
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.PX = function(data, rightArr, tagObj){
  var self = this;
  var vars = data.vars;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 2){
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var di = args[3];
      di = (di && di.com)? Math.abs(Math.floor(di.com.r) || 1): 1;  // di > 0
      var ar = Math.floor(a.com.r);
      var br = Math.floor(b.com.r);
      var sign = "*";
      var PX = null;
      if(ar > br){
        PX = function(callback){
          for(var i=ar; i>=br; i-=di){
            callback(i);
          }
        };
      }
      else{
        PX = function(callback){
          for(var i=ar; i<=br; i+=di){
            callback(i);
          }
        };
      }
      var name_var = tagObj.val.name;
      var tree_var = self.restore_var(vars, name_var);
      /* Ver.1.5.3 */  // "BRm" -> "BRdm"
      var tagName = "BRdm";
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      PX(function(i){
        self.store_var(vars, name_var, DATA.tree_num(i, 0));
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.Imat_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
      if(tree_var){
        self.store_var(vars, name_var, tree_var);
      }
      else{
        delete vars[name_var];
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.SX = function(data, rightArr, tagObj){
  var self = this;
  var vars = data.vars;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 2){
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var di = args[3];
      di = (di && di.com)? Math.abs(Math.floor(di.com.r) || 1): 1;  // di > 0
      var ar = Math.floor(a.com.r);
      var br = Math.floor(b.com.r);
      var sign = "+";
      var SX = null;
      if(ar > br){
        /* Ver.1.5.3 */  //        sign = "-";
        SX = function(callback){
          for(var i=ar; i>=br; i-=di){
            callback(i);
          }
        };
      }
      else{
        SX = function(callback){
          for(var i=ar; i<=br; i+=di){
            callback(i);
          }
        };
      }
      var name_var = tagObj.val.name;
      var tree_var = self.restore_var(vars, name_var);
      var tagName = "BRsa";
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      SX(function(i){
        self.store_var(vars, name_var, DATA.tree_num(i, 0));
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.zeros2d_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
      if(tree_var){
        self.store_var(vars, name_var, tree_var);
      }
      else{
        delete vars[name_var];
      }
    }
  }
  return _tree;
};
/* Ver.1.6.3 */
My_entry.operation.prototype.switch = function(data, rightArr, tagObj){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = DATA.tree_num(0, 0);
  var len_i = rightArr.length;
  for(var i=0; i<len_i; ++i){
    var args = rightArr[i];
    var com0 = args[0].com;
    if(com0){
      var sw = com0.r;
      if(sw){
        var arg1 = args[1];
        if(arg1){
          if(arg1.com){
            _tree = DATA.num2tree(arg1);
          }
          else{
            var tree_eqn = self.tree2tree_eqn(data, arg1);
            _tree = self.tree_eqn2tree(data, tree_eqn);
          }
        }
        break;
      }
    }
    else{
      self.throw_tree(args[0]);
      break;
    }
  }
  return _tree;
};
/* Ver.1.1.0 */
My_entry.operation.prototype.FNh = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var is = i0;
  var ie = i0+1;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var prop = tagObj.val.key;
    var tree = self[prop](data, rightArr, tagObj);
    if(tree){
      self.feedback2trees(data, is, ie, tree);
    }
    else{
      throw "Invalid "+prop+" arguments";
    }
  }
  return self;
};
My_entry.operation.prototype.FN =
My_entry.operation.prototype.FNn = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var prop = tagObj.val;
    var args = self.arr2args(rightArr);
    var tree = DATA.num2tree(unit[tagName].apply(unit, [prop, options].concat(args)));  // arguments.length < O(10000)
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
My_entry.operation.prototype.URi = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0-1;
  var ie = i0;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var left = (leftArr)? self.arr2num(leftArr): DATA.num(1, 0);
  var right = DATA.num(0, 1);
  var tree = DATA.num2tree(unit["BRm"](options, left, right));
  var is = (leftArr)? is: i0;
  self.feedback2trees(data, is, ie, tree);
  return self;
};
My_entry.operation.prototype.URf = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0-1;
  var ie = i0;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var left = (leftArr)? self.arr2num(leftArr): DATA.num(1, 0);
  var arg0 = left;
  var arg1 = DATA.num(Number(tagObj.val), 0);
  var tree = DATA.num2tree(unit["FN"]("fact_m", options, arg0, arg1));
  var is = (leftArr)? is: i0;
  self.feedback2trees(data, is, ie, tree);
  return self;
};
My_entry.operation.prototype.PU = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var is = i0;
  var ie = i0+1;
  var leftArr = self.get_tagVal(trees[is-1], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(!(leftArr) && rightArr){
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
My_entry.operation.prototype.BRmo = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(leftArr && rightArr){
    var tree = self.switch_unitBR("BRm", options, leftArr, rightArr);
    self.feedback2trees(data, is, ie, tree, options.isRightAssociativityBR);
  }
  return self;
};
My_entry.operation.prototype.switch_unitBR = function(tagName, options, leftArr, rightArr){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _tree = null;
  if(options.useMatrix){
    _tree = DATA.tree_mat(math_mat[tagName](options, leftArr, rightArr));
  }
  else{
    var left = self.arr2num(leftArr);
    var right = self.arr2num(rightArr);
    _tree = DATA.num2tree(unit[tagName](options, left, right));
  }
  return _tree;
};
My_entry.operation.prototype.init_callbacks_mat = function(options){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  self.callbacks_mat = {};
  self.callbacks_mat.BRs =
  self.callbacks_mat.BRa = function(tagName, tagObj, leftArr, rightArr){
    var _tree = null;
    if(rightArr){
      var leftArr = leftArr || math_mat.zeros2d_arr(rightArr);
      _tree = self.switch_unitBR(tagName, options, leftArr, rightArr);
    }
    return _tree;
  };
  self.callbacks_mat.BRe = function(tagName, tagObj, leftArr, rightArr){
    var _tree = null;
    if(!(self.params.hasUndefVars)){
      if(rightArr){
        var leftArr = leftArr || math_mat.zeros2d_arr(rightArr);
        _tree = self.switch_unitBR(tagName, options, leftArr, rightArr);
      }
    }
    return _tree;
  };
  self.callbacks_mat.BRm = function(tagName, tagObj, leftArr, rightArr){
    var _tree = null;
    if(leftArr && rightArr){
      _tree = self.switch_unitBR(tagName, options, leftArr, rightArr);
    }
    return _tree;
  };
  self.callbacks_mat.BRbs =
  self.callbacks_mat.BRba =
  self.callbacks_mat.BRbx =
  self.callbacks_mat.BRbo =
  self.callbacks_mat.BRcn =
  self.callbacks_mat.BRrl = function(tagName, tagObj, leftArr, rightArr){
    var _tree = null;
    if(leftArr && rightArr){
      var left = self.arr2num(leftArr);
      var right = self.arr2num(rightArr);
      _tree = DATA.num2tree(unit["FN"](tagObj.val, options, left, right));
    }
    return _tree;
  };
  self.callbacks_mat.BRp =
  self.callbacks_mat.BRr =
  self.callbacks_mat.BRd = function(tagName, tagObj, leftArr, rightArr){
    var _tree = null;
    if(leftArr && rightArr){
      var left = self.arr2num(leftArr);
      var right = self.arr2num(rightArr);
      _tree = DATA.num2tree(unit[tagName](options, left, right));
    }
    return _tree;
  };
  return self;
};
My_entry.operation.prototype.BR_original = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var is = i0-1;
  var ie = i0+1;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  var isLeftVar = self.get_tag(trees[is], "REv");
  var _tree = (!(isLeftVar))? self.callbacks_mat[tagName](tagName, tagObj, leftArr, rightArr): null;
  if(_tree){
    var is = (leftArr)? is: i0;
    self.feedback2trees(data, is, ie, _tree, options.isRightAssociativityBR);
  }
  return _tree;
};
My_entry.operation.prototype.BRp =
My_entry.operation.prototype.BRr =
My_entry.operation.prototype.BRbs =
My_entry.operation.prototype.BRba =
My_entry.operation.prototype.BRbx =
My_entry.operation.prototype.BRbo =
My_entry.operation.prototype.BRcn =
My_entry.operation.prototype.BRrl = function(data, i0, tagName, tagObj){
  var self = this;
  var tree = self.BR_original(data, i0, tagName, tagObj);
  if(!(tree)){
    throw "Invalid binary operation";
  }
  return self;
};
/* Ver.1.2.0 */
My_entry.operation.prototype.BRdm = function(data, i0, tagName, tagObj){
  var self = this;
  var sw_tagName = (tagObj.val === "/")? "BRd": "BRm";
  var tree = self.BR_original(data, i0, sw_tagName, tagObj);
  if(!(tree)){
    throw "Invalid binary operation";
  }
  return self;
};
My_entry.operation.prototype.BRsa = function(data, i0, tagName, tagObj){
  var self = this;
  var sw_tagName = (tagObj.val === "-")? "BRs": "BRa";
  var tree = self.BR_original(data, i0, sw_tagName, tagObj);
  if(!(tree)){
    throw "Invalid binary operation";
  }
  return self;
};
My_entry.operation.prototype.BRe = function(data, i0, tagName, tagObj){
  var self = this;
  var tree = self.BR_original(data, i0, tagName, tagObj);
  return self;
};
My_entry.operation.prototype.restore_var = function(vars, name){
  var self = this;
  var tree = vars[name];
  var _tree = (tree)? self.entry.def.newClone(tree): null;  // clone for concatination x=2;(x,2x:3x,4x)
  return _tree;
};
My_entry.operation.prototype.store_var = function(vars, name, tree){
  var self = this;
  vars[name] = self.entry.def.newClone(tree);  // separate from trees
  return self;
};
My_entry.operation.prototype.restore_arr = function(arr, ref){
  var self = this;
  var _arr = [];
  var _arri = _arr;
  var arri = arr;
  var len_ref = ref.length;
  ref.forEach(function(i_ref, i){
    if(!(Array.isArray(arri)) ||  typeof arri[i_ref] === "undefined") throw "Invalid reference of array";
    _arri[0] = (i === len_ref-1)? arri[i_ref]: [];
    _arri = _arri[0];
    arri = arri[i_ref];
  });
  return _arr;
};
My_entry.operation.prototype.store_arr = function(_arr, ref, arr){
  var self = this;
  var _arri = _arr;
  var arri = arr;
  var len_ref = ref.length;
  var arr_stored = null;
  if(len_ref === 1){
    arr_stored = self.arr2args(arr);
  }
  else if(len_ref === 2){
    arr_stored = self.arr2num(arr);
  }
  else{
    throw "Invalid store array";
  }
  ref.forEach(function(i_ref, i){
    if(!(Array.isArray(_arri)) ||  typeof _arri[i_ref] === "undefined") throw "Invalid reference of array";
    if(i === len_ref-1){
      if(_arri[i_ref].length === arr_stored.length){
        _arri[i_ref] = arr_stored;
      }
      else{
        throw "Invalid store array";
      }
    }
    _arri = _arri[i_ref];
  });
  return _arr;
};
My_entry.operation.prototype.tree_eqn2tree = function(data, tree){
  var self = this;
  var DATA = self.entry.DATA;
  var newData = self.get_newData(data, DATA.tree2trees(tree));
  var trees = self.remake_trees(newData);
  var _tree = DATA.trees2tree(trees);
  return _tree;
};
My_entry.operation.prototype.tree2tree_ref = function(tree, ref){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = null;
  var arr = self.get_tagVal(tree, "mat", "arr");
  if(arr){
    _tree = DATA.tree_mat(self.restore_arr(arr, ref));
  }
  else{
    self.throw_tree(tree);
  }
  return _tree;
};
My_entry.operation.prototype.REv = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var vars = data.vars;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  var hasUV = false;
  var isStorE = function(tree){
    return (self.get_tag(tree, "BRe") || self.get_tag(tree, "SEe"));
  };
  var isSE = (i0 === 0 && isStorE(trees[i0+1]));
  var ref = trees[is]["REv"]["ref"];
  var tree = null;
  var name = tagObj.val;
  if(vars[name]){
    if(!(isSE)){
      tree = self.restore_var(vars, name);
      if(ref){
        tree = self.tree2tree_ref(tree, ref);
      }
    }
    else{
      hasUV = true;
    }
  }
  else{
    if(eqns[name]){
      if(!(isSE)){
        var tree_eqn = self.restore_eqn(eqns, name);
        var isREe = tree_eqn[self.config.BT.REe];
        if(isREe){
          if(self.isLocked_eqns[name]){
            self.isLocked_eqns[name] = false;
            throw "Invalid circular("+name+")";
          }
          self.isLocked_eqns[name] = true;
          tree = self.tree_eqn2tree(data, tree_eqn);
          self.isLocked_eqns[name] = false;
        }
        else{
          tree = tree_eqn;
        }
        if(ref){
          tree = self.tree2tree_ref(tree, ref);
        }
      }
      else{
        hasUV = true;
      }
    }
    else{
      hasUV = true;
    }
  }
  if(tree){
    self.feedback2trees(data, is, ie, tree);
  }
  if(hasUV){
    ++self.params.hasUndefVars;
  }
  return self;
};
My_entry.operation.prototype.SEv = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var vars = data.vars;
  var DATA = self.entry.DATA;
  var is = i0-1;
  var ie = i0+1;
  var leftTree = trees[is];
  if(i0 === 1){
    var tree = null;
    if(trees.length === 3){
      var name_var = self.get_tagVal(leftTree, "REv", "val");  // clear; f<={(x)=1}; f
      if(name_var){
        tree = trees[ie];
        if(self.get_tag(tree, "mat")){  // only matrix is stored
          var ref = self.get_tagVal(leftTree, "REv", "ref");
          if(ref){
            if(ref.length < 3){
              tree_var = self.restore_var(vars, name_var);
              if(tree_var){
                self.store_arr(tree_var.mat.arr, ref, tree.mat.arr);
                tree = tree_var;
              }
              else{
                throw "Undef var("+name_var+")";
              }
            }
            else{
              throw "Invalid substitution";
            }
          }
          self.store_var(vars, name_var, tree);
          tree = DATA.tag("out", {name: name_var, arr: tree.mat.arr});
        }
        else{
          self.throw_tree(tree);
        }
      }
      else{
        throw "Invalid substitution";
      }
    }
    if(tree){
      --self.params.hasUndefVars;
      self.feedback2trees(data, is, ie, tree);
    }
  }
  return self;
};
My_entry.operation.prototype.restore_eqn = function(eqns, name){
  var self = this;
  var _tree = null;
  var tree = eqns[name];
  if(tree){
    var BT = self.config.BT;
    var isSEe = tree[BT.SEe];
    if(isSEe){
      _tree = {};
      _tree[BT.REe] = self.entry.def.newClone(isSEe);
    }
    else{
      _tree = self.entry.def.newClone(tree);
    }
  }
  return _tree;
};
My_entry.operation.prototype.tree2restore_eqn = function(tree){
  var self = this;
  var _tree = null;
  var tree = self.arr2num(self.get_tagVal(tree, "mat", "arr"));
  if(tree){
    var BT = self.config.BT;
    var isSEe = tree[BT.SEe];
    if(isSEe){
      _tree = {};
      _tree[BT.REe] = isSEe;
    }
  }
  return _tree;
};
My_entry.operation.prototype.store_eqn = function(eqns, name, tree){
  var self = this;
  eqns[name] = self.entry.def.newClone(tree);
  return self;
};
My_entry.operation.prototype.REe = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var vars = data.vars;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  var is = i0-1;
  var ie = i0+1;
  var leftTree = trees[is];
  var name_eqn = self.get_tagVal(leftTree, "REv", "val");
  var tree_eqn = (name_eqn)? self.restore_eqn(eqns, name_eqn): self.tree2restore_eqn(leftTree);
  if(tree_eqn){
    var isREe = tree_eqn[self.config.BT.REe];
    var tree = (isREe)? self.tree_eqn2tree(data, tree_eqn): tree_eqn;
    if(tree){
      var name_var = self.get_tagVal(trees[ie], "REv", "val");
      if(name_var){
        self.store_var(vars, name_var, tree);
      }
      var ie = (name_var)? ie: i0;
      self.feedback2trees(data, is, ie, tree);
    }
  }
  else{
    self.throw_tree(leftTree);
  }
  return self;
};
My_entry.operation.prototype.SEe = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var vars = data.vars;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  var len = trees.length;
  var is = i0-1;
  var ie = len-1;
  if(i0 < 2){  // <=f || f<=x
    var tree = null;
    if(trees.length > 1){
      var name_eqn = self.get_tagVal(trees[is], "REv", "val");
      var newTrees = trees.slice(is+2, len);
      /* Ver.2.19.6 -> */
/*
      if(newTrees.length === 1){
        var newTree = DATA.trees2tree(newTrees);
        if(self.isType(newTree, "FN")){
          tree = newTree;
        }
      }
      tree = tree || DATA.tree_tag(self.config.BT.SEe, newTrees);
*/
      tree = DATA.tree_tag(self.config.BT.SEe, newTrees);
      /* -> Ver.2.19.6 */
      if(name_eqn){
        self.store_eqn(eqns, name_eqn, tree);
        tree = DATA.tree_tag("out", "stored_eqn("+name_eqn+")");
      }
    }
    else{
      throw "Invalid eqn<=";
    }
    if(tree){
      self.feedback2trees(data, is, ie, tree);
    }
  }
  return self;
};
My_entry.operation.prototype.SEans = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  if(i0 === 0){
    if(trees.length < 2){
      var tree = DATA.trees2tree(trees);
      if(tree){
        if(tree.out){
        }
        else if(tree.mat){
          self.store_var(data.vars, "ans", tree);
/*
          tree = DATA.tree_tag("out", {name: "ans", arr: tree.mat.arr});
*/
        }
        else{
          self.throw_tree(tree);
        }
      }
      if(tree){
        self.feedback2trees(data, is, ie, tree);
      }
    }
    else{
      throw "Invalid ans isFound";
    }
  }
  return self;
};
