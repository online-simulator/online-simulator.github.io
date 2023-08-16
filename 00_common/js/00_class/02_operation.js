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
        "SEe",   // StorE obvious equation including bracket =<
        "BTe"    // StorE obvious equation with scope =< || (args)=<
      ],
      [
        /* following short-circuit */
        "BRlAOs" // Binary operatoR logical ANDs || ORs || ANDss || ORss &&& || ||| || &&&& || ||||
      ],
      [
        /* following function */
        "FNc"    // FunctioN for command prior to bracket
      ],
      [
        /* following delimiter */
        "BT2",   // BrackeT {
        "BT1",   // BrackeT (
        "BT0"    // BrackeT [
      ],
      [
        /* following restore */
        "REe",   // RestorE obvious equation => || ==>
        "REv"    // RestorE variable first, equation second
      ],
      [
        /* following function */
        "FNmh",  // FunctioN for matrix high-order
        "FNm",   // FunctioN for matrix
        "FNh",   // FunctioN high-order
        "FN",    // FunctioN 0~4-arguments
        "FNn"    // FunctioN n-arguments
      ]
    ],
    [
      [
        /* following post-Unary operatoR */
        "UR"     //  . || ' -> transpose(left) || htranspose(left)
                 // post-Unary operatoR imaginary unit i
                 // factorial mark ! || !!... operand is only natural number
      ],
      [
        "BRpp",  // Binary operatoR ** -> pow(left, right)@Right-Associativity
        "BRp",   // Binary operatoR ^  -> pow(left, right)
      ],
      [
        "BRmo"   // omitted multiplication sign
      ],
      [
        "BRdm"   // Binary operatoR % || %% || / || *
      ],
      [
        "BRsa"   // Binary operatoR - || + including Pre-Unary operator - || +
      ],
      [
        "PUbn",  // Pre-Unary operator bit not ~
        "BRbs",  // Binary operatoR bit  shift << || >> || >>>
        "BRba",  // Binary operatoR bit    and &
        "BRbx",  // Binary operatoR bit    xor @
        "BRbo"   // Binary operatoR bit     or |
      ],
      [
        "BRcn",  // Binary operatoR comparison < || <= || >= || >
        "BRrl",  // Binary operatoR relational === || == || <>
        "PUlN",  // Pre-Unary operator logical NOT ~~
        "BRlA",  // Binary operatoR logical    AND &&
        "BRlX",  // Binary operatoR logical    XOR @@
        "BRlO"   // Binary operatoR logical     OR ||
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
    isRelative_epsN: false,
    epsN: 1e-16,
    dxT: 1e-3,
    dxJ: 1e-5,
    dxD: 1e-3,
    NI: 100
  },
  /* Ver.2.32.17 */
  symbol: {
    escape: "$"
  },
  /* Ver.2.27.15 */
  isEscaped: function(name){
    return (name.charAt(0) === "$");
  },
  /* Ver.2.156.38 filter for csv-format */
  isNested: function(tagName){
    var type = tagName.substring(0, 2);
    return (type === "BT");
  },
  /* Ver.2.157.38 filter for short-circuit */
  isSubstitution: function(tagName){
    var type = tagName.substring(0, 2);
    return (type === "SE" || tagName === "BRe");
  }
};
My_entry.operation.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$", "def", "math", "math_mat", "DATA", "unit"]);
  My_entry.def.mix_in_props(My_entry.operation, My_entry.DATA, ["arr2num", "arr2args", "arr2obj_i"]);
  self.useTest = null;
  self.useStrict = null;
  self.useEmpty = null;
  self.useScopeWith = null;  // Ver.2.213.47
  self.arr_precedence = [];
  self.options = {};
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
  var type = tagName.substring(0, 2);
  var tagName_comp = tagName;
  var sw_tagName = tagName;
  var isRAandBR = (options.isRightAssociativityBR && (type === "BR"));
  var isBRpp = (tagName === "BRpp");  // Ver.2.87.32
  var isBTref = (tagName === self.config.BT.ref);
  var isSEv = (tagName === "SEv");
  if(isBTref){
    sw_tagName = "BTref";
  }
  else if(isSEv){
    tagName_comp = "BRe";
  }
  if(isRAandBR || isBRpp || isBTref){
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
/* Ver.2.193.44 */
My_entry.operation.prototype.switch_method = function(options){
  var self = this;
  var math = self.constructors.math;
  var math_com = self.constructors.math_com;
  var sw_LR = (options.isRightAssociativityBR)? "RA": "LA";
  /* Ver.2.193.45 -> */
  if(math){
    math.prototype.and = math.prototype["and_"+sw_LR];
    math.prototype.or = math.prototype["or_"+sw_LR];
  }
  if(math_com){
    math_com.prototype.cand = math_com.prototype["cand_"+sw_LR];
    math_com.prototype.cor = math_com.prototype["cor_"+sw_LR];
  }
  /* -> Ver.2.193.45 */
  return self;
};
My_entry.operation.prototype.prepare = function(data){
  var self = this;
  var options = data.options;
  self.switch_method(options);  // Ver.2.193.44
  /* Ver.2.24.11 -> */
  self.useTest = options.useTest;
  self.useStrict = options.useStrict;
  self.useEmpty = (options.checkError === 0 || options.checkError < 0)? false: true;  // Ver.2.84.32
  self.useScopeWith = options.useScopeWith;  // Ver.2.213.47
  self.options.isRelative_epsN = options.isRelative_epsN || self.config.params.isRelative_epsN;
  self.options.epsN = options.epsN || self.config.params.epsN;
  self.options.dxT = options.dxT || self.config.params.dxT;
  self.options.dxJ = options.dxJ || self.config.params.dxJ;
  self.options.dxD = options.dxD || self.config.params.dxD;
  self.options.NI = options.NI || self.config.params.NI;
  var arr_precedence = self.entry.def.newClone(self.config.precedence);
  if(options.precedence){
    arr_precedence[1] = options.precedence.split(",");
  }
  else{
    if(options.useStrict){
      arr_precedence[1][2] = null;
    }
  /* -> Ver.2.24.11 */
    if(options.isDIVprior2OMUL){
      self.entry.math.switch_arr(arr_precedence[1], 2, 3);
    }
  }
  self.arr_precedence = arr_precedence.join().split(",").filter(Boolean);  // Ver.2.43.21
  /* Ver.2.212.46 -> */
  var hasTag = data.hasTag;
  if(hasTag){
    hasTag["SRr"] = true;
    hasTag["SRt"] = true;
    if(options.useScopeWith) hasTag["BTe"] = true;  // Ver.2.213.47
    hasTag["BT1"] = true;  // Ver.2.212.47
    hasTag["BRmo"] = true;
    hasTag["SEv"] = true;
    self.arr_precedence = self.arr_precedence.filter(function(tag){return hasTag[tag];});
  }
  /* -> Ver.2.212.46 */
  self.init_callbacks(options);
  self.init_callbacks_mat(options);
  return self;
};
/* Ver.2.30.17 -> original reference to local storage object saved */
My_entry.operation.prototype.clear = function(data){
  var self = this;
  var vars = data.vars;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  for(var name in vars){
    delete vars[name];
  }
  for(var name in eqns){
    delete eqns[name];
  }
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
  var def = self.entry.def;
  var vars = data.vars;
  var eqns = data.eqns;
  var DATA = self.entry.DATA;
  var buffer = (self.vars && self.eqns);
  if(buffer){
    self.clear(data);
    for(var name in self.vars){
      vars[name] = def.newClone(self.vars[name]);
    }
    for(var name in self.eqns){
      eqns[name] = def.newClone(self.eqns[name]);
    }
  }
  var msg = (buffer)? "local storage restored": "null buffer";
  data.trees = DATA.tree2trees(DATA.tree_tag("out", msg));
  return self;
};
/* -> Ver.2.30.17 */
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
  var scopes2d = _data.scopes2d;
  try{
    self.prepare(_data);
    for(var j=0, len=trees2d.length; j<len; ++j){
      var trees = trees2d[j];
      _data.trees = trees;
      _data.scopes = scopes2d;
      if(Array.isArray(trees)){
        self.remake_trees(_data);
        self.SEans(_data, 0);
        delete _data.eqns["no-name"];  // Ver.2.195.46
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
  }
  catch(e){
    self.init_buffers();
    throw e;
  }
  return _data;
};
My_entry.operation.prototype.init_buffers = function(){
  var self = this;
  self.init_params();
  self.vars = null;
  self.eqns = null;
  return self;
};
My_entry.operation.prototype.init_params = function(){
  var self = this;
  self.params.BT = null;
  self.params.depth = 0;
  self.params.hasUndefVars = 0;
  return self;
};
My_entry.operation.prototype.remake_trees = function(data, isReUsed){  // Ver.2.160.38
  var self = this;
  // store params
  var BT = self.params.BT;
  var depth = self.params.depth;
  var hasUndefVars = self.params.hasUndefVars;
  // init params
  self.init_params();  // here for mdx=Newton(=<f,=<x)
  // remake
  data.trees = (isReUsed)? self.entry.def.newClone(data.trees): data.trees;  // tree_eqn is re-used  // Ver.2.160.38
  self.data2trees(data);
  // restore params
  self.params.BT = BT;
  self.params.depth = depth;
  self.params.hasUndefVars = hasUndefVars;
  // return
  return data.trees;
};
My_entry.operation.prototype.data2trees = function(data, tagName_BT){  // Ver.2.164.39
  var self = this;
  var depth = self.params.depth++;
  /* Ver.2.144.36 -> */
  if(depth > data.options.depthMax){
    throw "Nesting depthMax over";
  }
  /* -> Ver.2.144.36 */
  self.params.BT = tagName_BT || self.params.BT;  // Ver.2.164.39
  self.arr_precedence.forEach(function(tagName){
    self.callbacks[tagName](data);
    data.trees = data.trees.filter(Boolean);  // Ver.2.43.21
  });
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
My_entry.operation.prototype.get_newData = function(data, trees, opt_ids){
  var self = this;
  /* Ver.2.31.17 -> */
  var _data = self.entry.DATA.data(trees, data.options, data.vars, data.eqns);
  _data.scopes = data.scopes;  // made in parser
  if(opt_ids){
    _data.ids = opt_ids;
  }
  return _data;
  /* -> Ver.2.31.17 */
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
    _tree = DATA.tree_mat(DATA.obj2arr(tree));  // Ver.2.19.6
  }
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
  /* Ver.2.31.17 -> */
  var tree_BT = trees[is];
  var ids = tree_BT[tagName].ids;  // inherit_ids_AtSEe
  var newTrees = self.data2trees(self.get_newData(data, tagObj.val, ids), tagName);  // Ver.2.164.39
  /* -> Ver.2.31.17 */
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
  /* Ver.2.31.17 -> */
  var tree_BT = trees[is];
  var ids = tree_BT[tagName].ids;  // inherit_ids_AtSEe
  var newTrees = self.data2trees(self.get_newData(data, tagObj.val, ids), tagName);  // Ver.2.164.39
  /* -> Ver.2.31.17 */
  var tree = self.tree2tree_mat(DATA.trees2tree(newTrees));
  /* Ver.2.170.41 -> */
  var leftTree = trees[i0-1];
  var thisTree = trees[i0];
  var ref0 = thisTree[tagName].ref;
  var isEmpty4ref = (tree.mat.arr.length === 0 && ref0);
  if(isEmpty4ref){
    tree = DATA.tree_num(Math.E, 0);
  }
  /* -> Ver.2.170.41 */
  var arr = tree.mat.arr;
  var arr0 = arr[0];
  var len_i = arr.length;
  var len_j = (arr0)? arr0.length: 0;  // Ver.2.170.41
  var isVal = (len_i === 1 && len_j === 1 && !(arr0[0][self.config.BT.SEe]));  // Ver.2.31.17
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
  var ids = data.ids;
  var DATA = self.entry.DATA;
  /* Ver.2.157.38 -> */
  /* Ver.2.156.38 -> */
  var i1 = self.get_i1(trees, i0, tagName);
  var leftTrees = trees.slice(0, i0);
  var rightTrees = trees.slice(i0+1, i1);
  /* -> Ver.2.156.38 */
  var BT = self.params.BT;  // store BT
  var isBTrow2col = (BT === self.config.BT.row2col);
  /* in only one direction, left to right */
  var leftTree = self.trees2tree_mat(data, leftTrees, ids);
  self.params.BT = BT;      // restore BT
  var rightTree = self.trees2tree_mat(data, rightTrees, ids);
  /* -> Ver.2.157.38 */
  var leftMat = leftTree.mat;
  var leftArr = leftMat.arr;
  var rightArr = rightTree.mat.arr;
  if(isBTrow2col^isSRt){  // xor
    var len_i = Math.max(leftArr.length, rightArr.length);
    var len_j = 0;
    for(var i=0; i<len_i; ++i){
      /* Ver.2.156.38 -> */
      var leftArri = leftArr[i] || [];
      var rightArri = rightArr[i];
      if(rightArri){
        leftArr[i] = leftArri.concat(rightArri);  // col: mat.arr[i]
      }
      /* -> Ver.2.156.38 */
    }
  }
  else{
    if(rightArr){
      leftMat.arr = leftArr.concat(rightArr);     // row: mat.arr
    }
  }
  var tree = leftTree;
  var is = 0;
  var ie = i1-1;  // Ver.2.156.38
  self.feedback2trees(data, is, ie, tree);
  return self;
};
My_entry.operation.prototype.SRr = function(data, i0, tagName, tagObj){
  var self = this;
  return self.SRr_or_SRt(data, i0, tagName, tagObj, false);  // Ver.2.192.44
};
My_entry.operation.prototype.SRt = function(data, i0, tagName, tagObj){
  var self = this;
  return self.SRr_or_SRt(data, i0, tagName, tagObj, true);  // Ver.2.192.44
};
/* Ver.2.157.38 -> */
My_entry.operation.prototype.trees2tree_mat = function(data, trees, ids){
  var self = this;
  var DATA = self.entry.DATA;
  var isEmpty = (trees.length === 0);
  var newTrees = (isEmpty)? []: self.data2trees(self.get_newData(data, trees, ids));
  var tree = DATA.trees2tree(newTrees);
  return self.tree2tree_mat(tree);
};
My_entry.operation.prototype.get_i1 = function(trees, i0, tagName){
  var self = this;
  var len = trees.length;
  var _i1 = len;
  for(var i=i0+1; i<len; ++i){
    var prop = Object.keys(trees[i])[0];
    if(self.config.isNested(prop)){
      break;
    }
    else if(prop === tagName){
      _i1 = i;  // ~len-1
      break;
    }
  }
  return _i1;
};
My_entry.operation.prototype.get_il = function(trees, i0, tagName){
  var self = this;
  var _il = 0;
  for(var i=i0-1; i>=0; --i){
    var tree = trees[i];
    var prop = (tree)? Object.keys(tree)[0]: tagName;
    if(self.config.isSubstitution(prop) || prop === tagName){
      _il = i+1;  // 0+1~
      break;
    }
  }
  return _il;
};
My_entry.operation.prototype.get_ir = function(trees, i0, tagName){
  var self = this;
  var len = trees.length;
  var _ir = len;
  for(var i=i0+1; i<len; ++i){
    var tree = trees[i];
    var prop = (tree)? Object.keys(tree)[0]: tagName;
    if(self.config.isSubstitution(prop) || prop === tagName){
      _ir = i;  // ~len-1
      break;
    }
  }
  return _ir;
};
My_entry.operation.prototype.BRlAOs = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var islO = (tagObj.val === "|||" || tagObj.val === "||||");  // Ver.2.196.46
  var hasS = (tagObj.val.length === 4);  // Ver.2.196.46
  var sw_tagName = (islO)? "": tagName;
  var sw_prop = (hasS)? "isStrictFalse_arr": "isFalse_arr";  // Ver.2.196.46
  var il = self.get_il(trees, i0, sw_tagName);
  var ir = self.get_ir(trees, i0, sw_tagName);
  var leftTrees = trees.slice(il, i0);
  var rightTrees = trees.slice(i0+1, ir);
  if(leftTrees.length === 0 || rightTrees.length === 0){
    throw "Invalid binary operation";
  }
  var is0D = !(options.useMatrix);  // Ver.2.158.38
  var tree = null;
  if(options.isRightAssociativityBR){
    var rightTree = self.trees2tree_mat(data, rightTrees, ids);
    var rightArr = rightTree.mat.arr;
    /* Ver.2.158.38 -> */
    if(is0D){
      rightArr = DATA.arr2arr00(rightArr);
    }
    /* -> Ver.2.158.38 */
    if(DATA.hasVar_arr(rightArr)){  // first
      throw "Undef "+tagObj.val+"var";  // hasVar(a|||b) disabled
    }
    else if((DATA[sw_prop](rightArr))^islO){  // xor  // Ver.2.196.46
      tree = rightTree;
    }
    else{
      tree = self.trees2tree_mat(data, leftTrees, ids);
    }
  }
  else{
    var leftTree = self.trees2tree_mat(data, leftTrees, ids);
    var leftArr = leftTree.mat.arr;
    /* Ver.2.158.38 -> */
    if(is0D){
      leftArr = DATA.arr2arr00(leftArr);
    }
    /* -> Ver.2.158.38 */
    if(DATA.hasVar_arr(leftArr)){  // first
      throw "Undef var"+tagObj.val;  // hasVar(a|||b) disabled
    }
    else if((DATA[sw_prop](leftArr))^islO){  // xor  // Ver.2.196.46
      tree = leftTree;
    }
    else{
      tree = self.trees2tree_mat(data, rightTrees, ids);
    }
  }
  /* Ver.2.158.38 -> */
  if(is0D){
    var arr = tree.mat.arr;  // leftTree || rightTree
    var arr00 = DATA.arr2arr00(arr);
    tree = DATA.tree_mat(arr00);
  }
  /* -> Ver.2.158.38 */
  var is = il;
  var ie = ir-1;
  self.feedback2trees(data, is, ie, tree, options.isRightAssociativityBR);
  return self;
};
/* -> Ver.2.157.38 */
/* Ver.2.195.45 */
My_entry.operation.prototype.isType = function(tree, type_comp){
  var self = this;
  var _type = null;
  if(tree){
    var tagName = Object.keys(tree)[0];
    var type = tagName.substring(0, 2);
    if(type === type_comp){
      _type = tagName;
    }
  }
  return _type;
};
/* Ver.2.32.17 -> */
My_entry.operation.prototype.tree_BT2tree = function(data, tree, opt_ids){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = null;
  var tagName = self.isType(tree, "BT");
  if(tagName){
    /* Ver.2.102.33 -> */
    var hasUndefVars = self.params.hasUndefVars;
    var newData = self.get_newData(data, DATA.tree2trees(tree), opt_ids);
    if(!(opt_ids)){  // get_names
      newData.scopes = null;
      newData.vars = {};
      newData.eqns = {};
    }
    var obj = DATA.tag(tagName, self.get_tagVal(tree, tagName, "val"));
    self[tagName](newData, 0, tagName, obj[tagName]);
    _tree = DATA.trees2tree(newData.trees);
    self.params.hasUndefVars = hasUndefVars;
    /* -> Ver.2.102.33 */
  }
  return _tree;
};
My_entry.operation.prototype.get_symbol = function(treeTagName){
  var self = this;
  var tagVal = treeTagName.val;
  var tagName_REv = (tagVal.length === 1)? tagVal[0]["REv"]: null;
  var _symbol = (tagName_REv)? tagName_REv.val: "";
  if(self.config.isEscaped(_symbol)) throw "Invalid symbol("+_symbol+")";
  return _symbol;
};
/* Ver.2.27.15 -> */
My_entry.operation.prototype.get_names = function(data, tree_BT, isRow){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _names = [];
  var tree = self.tree_BT2tree(data, tree_BT);
  var arr = self.get_tagVal(tree, "mat", "arr");
  if(arr){
    if(isRow){
      arr = math_mat.transpose(data.options, arr);
    }
    var len_i = arr.length;
    for(var i=0; i<len_i; ++i){
      var tree = self.arr2obj_i(arr, i);
      var isSEe = tree[BT.SEe];
      var name = "";
      var name_checked = "";
      if(isSEe){
        var trees = isSEe.val;
        name = (trees && trees.length === 1)? self.get_tagVal(DATA.trees2tree(trees), "REv", "val"): null;
        if(name){
          name_checked = name;
          name = self.config.symbol.escape+name;
        }
      }
      else{
        name = self.get_tagVal(tree, "REv", "val");
        name_checked = name;
      }
      if(name){
        if(self.config.isEscaped(name_checked)) throw "Invalid REv("+name_checked+")";  // Ver.2.32.17
        _names.push(name);
      }
      else{
        _names = [];
        break;
      }
    }
  }
  return _names;
};
My_entry.operation.prototype.get_name_escaped = function(tree){
  var self = this;
  var _name = "";
  var name_checked = "";
  var name = self.get_tagVal(tree, "REv", "val");
  if(name && self.config.isEscaped(name)){
    _name = name.substring(1);
    name_checked = _name;
  }
  if(self.config.isEscaped(name_checked)) throw "Invalid SEv("+name_checked+")";  // Ver.2.30.16  // Ver.2.32.17
  return _name;
};
/* -> Ver.2.27.15 */
/* -> Ver.2.32.17 */
/* Ver.2.28.15 */
My_entry.operation.prototype.FNc = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var vars = data.vars;
  var eqns = data.eqns;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0+1;
  var rightTree = trees[ie];
  if(rightTree){
    var prop = tagObj.val;
    var msgErr = "Invalid "+prop+" arguments";
    var names = self.get_names(data, rightTree);
    if(!(names.length)) throw msgErr;
    var name = names[names.length-1];
    if(name){
      var tree = null;
      var get_tree_sw = function(sw){
        return DATA.tree_num(((sw)? true: false), 0);  // Ver.2.196.46
      };
      switch(prop){
        /* Ver.2.31.17 -> */
        case "hasv":
          tree = get_tree_sw(self.get_scope_RE_sw("vars", name, scopes, ids));
          break;
        case "hase":
          tree = get_tree_sw(self.get_scope_RE_sw("eqns", name, scopes, ids));
          break;
        case "addvar":
          var scope = self.get_scope0_RE_sw("vars", name, scopes, ids);
          tree = get_tree_sw(scope);  // first
          if(scope){
            vars[name] = self.entry.def.newClone(scope[name]);
          }
          break;
        case "addeqn":
          var scope = self.get_scope0_RE_sw("eqns", name, scopes, ids);
          tree = get_tree_sw(scope);  // first
          if(scope){
            eqns[name] = self.entry.def.newClone(scope[name]);
          }
          break;
        /* -> Ver.2.31.17 */
        case "hasvar":
          tree = get_tree_sw(vars[name]);
          break;
        case "haseqn":
          tree = get_tree_sw(eqns[name]);
          break;
        case "delvar":
          tree = get_tree_sw(vars[name]);  // first
          if(vars[name]){
            delete vars[name];
          }
          break;
        case "deleqn":
          var ids_del = ids || [[0, 0]];  // || sentence without bracket including command
          var id0 = ids_del[0];
          var j = id0[0];
          var n = id0[1];
          tree = get_tree_sw(eqns[name]);  // first
          if(eqns[name]){
            delete eqns[name];
          }
          break;
        default:
          break;
      }
      self.feedback2trees(data, is, ie, tree);
    }
  }
  return self;
};
My_entry.operation.prototype.tree2tree_eqn = function(data, tree){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  /* Ver.2.30.15 -> */
  var isSEe = tree[BT.SEe];
  if(isSEe){
    var trees = isSEe.val;
    var name_eqn = (trees && trees.length === 1)? self.get_tagVal(DATA.trees2tree(trees), "REv", "val"): null;
    if(name_eqn){
      _tree = self.restore_eqn(name_eqn, scopes, ids);  // trees.length === 1  // Ver.2.31.17
    }
    else{
      _tree = self.tree_SEe2REe(tree);  // Ver.2.32.17
    }
  }
  if(!(_tree)){
    throw "Invalid =<Call-by-Equation";
  }
  /* -> Ver.2.30.15 */
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
/* differential step */
My_entry.operation.prototype.get_hc = function(options, x, dx, sw_name){
  var self = this;
  var DATA = self.entry.DATA;
  /* Ver.2.29.15 -> isFixed excluding 0 */
  var isFixed = (dx && dx.com && (dx.com.r || dx.com.i));
  /* -> Ver.2.29.15 */
  var dxo = self.options[sw_name];
  var dx0 = (isFixed)? dx: DATA.num(dxo, dxo);
  var h = DATA.num(dx0.com.r, ((options.useComplex)? dx0.com.i: 0));
  var _hc = (isFixed)? h.com: self["get_"+sw_name](x, h);
  return _hc;
};
My_entry.operation.prototype.jacobian = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
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
  var get_arr = function(j){
    var _arr = null;
    var tree = self.tree_eqn2tree(data, get_tree(j));
    if(tree.mat){
      _arr = tree.mat.arr;
    }
    else{
      throw msgErr;
    }
    return _arr;
  };
  /* Ver.2.21.10 -> */
  var prop = tagObj.val;
  var init_x0 = function(arr, names, isFound){
    var _x0 = [];
    var get_num_i = function(i, name_var){
      var _num = null;
      var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
      if(tree_var){
        isFound[i] = true;
        _num = self.arr2num(tree_var.mat.arr);
      }
      else{
        isFound[i] = false;
        _num = self.arr2obj_i(arr, i);
        if(_num.com){
          self.store_var(name_var, DATA.num2tree(_num), scopes, ids);  // Ver.2.31.17
        }
        else{
          self.throw_tree(_num);
        }
      }
      return _num;
    };
    for(var i=0; i<len_i; ++i){
      var name_var = names[i];
      _x0[i] = get_num_i(i, name_var);
    }
    return _x0;
  };
  var make_get_f_from_arr_f0 = function(arr_f0, len_i, i0, j0){
    var _get_f = null;
    /* Ver.1.5.3 -> f<={A(x)=b} */
    var len_fi = arr_f0.length;
    var len_fj = arr_f0[len_fi-1].length;
    if(len_fi === len_i){
      _get_f = function(arr_f, i){
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
      _get_f = function(arr_f, i){
        return arr_f[i0[i]][j0[i]];
      };
    }
    else{
      throw msgErr;
    }
    /* -> Ver.1.5.3 */
    return _get_f;
  };
if(prop.key){
  /* Ver.2.23.11 -> */
  prop = prop.key;
  msgErr = "Invalid "+prop+" arguments";
  // symbolic
  if(prop === "EX"){
    if(len_j > 2){
      /* Ver.2.32.17 */
      var get_names = function(j){
        var isSEe = args[j][self.config.BT.SEe];
        var symbol = (isSEe)? self.get_symbol(isSEe): "";
        var _names = (symbol)? [symbol]: self.get_names(data, get_tree(j));
        return _names;
      };
      /* Ver.2.27.15 -> */
      var names = get_names(0);
      if(!(names.length)) throw msgErr;
      /* -> Ver.2.27.15 */
      var name_var = names[names.length-1];
      var name_eqn = tagObj.val.name;
      if(self.config.isEscaped(name_var)) throw "Invalid REv("+name_var+")";  // Ver.2.29.15
      var len_i = math_mat.num2size(options, args[1]);
      var len_j = math_mat.num2size(options, args[2]);
      var counter = 0;
      var trees = [];
      for(var i=0; i<len_i; ++i){
        if(i){
          trees.push(DATA.tree_tag("SRr", ":"));
        }
        for(var j=0; j<len_j; ++j){
          if(j){
            trees.push(DATA.tree_tag("SRt", ","));
          }
          trees.push(DATA.tree_tag("REv", name_var+String(counter++)));
        }
      }
      var tree = self.inherit_ids_AtSEe(trees, ids);  // Ver.2.31.17
      self.store_eqn(name_eqn, tree, scopes, ids);  // Ver.2.31.17
      _tree = DATA.tree_num(0, 0);
    }
    else{
      throw msgErr;
    }
  }
  // ODE
  else if(len_j > 1){
  /* -> Ver.2.23.11 */
    var tree_eqn = get_tree(0);
    /* Ver.2.27.15 -> */
    var tree_BT = get_tree(1);
    var names = self.get_names(data, tree_BT);
    if(!(names.length)) throw msgErr;
    /* -> Ver.2.27.15 */
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    if(args[2] && !(args[2].com)){
      arr_x = get_arr(2);
      if(arr_x.length-len_i) throw msgErr;
    }
    if(!(arr_x)){
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    /* -> Ver.2.29.15 */
    // t0
    var name_var = tagObj.val.name;
    var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
    var t0 = (tree_var)? self.arr2num(tree_var.mat.arr): args[3] || DATA.num(0, 0);
    // dt
    var dt = args[4] || DATA.num(self.options.dxT, 0);
    /* Ver.2.29.15 -> */
    // Niteration
    var argN = args[5];
    var Niteration = (argN && argN.com)? Math.round(argN.com.r): 1;  // 0 enabled  // Ver.2.205.46 floor -> round
    /* -> Ver.2.29.15 */
    // orderT
    var orderT = (options.orderT === 2)? 2: 4;
    // x0
    var x0 = init_x0(arr_x, names, []);
    // functions
    var get_dt = function(kcr){
      return unit["BRm"](options, dt, DATA.num(kcr, 0));
    };
    var store_t = function(dt){
      var t = (dt)? unit["BRa"](options, t0, dt): t0;
      self.store_var(name_var, DATA.num2tree(t), scopes, ids);  // Ver.2.31.17
    };
    var store_x = function(x){
      for(var i=0; i<len_i; ++i){
        self.store_var(names[i], DATA.num2tree(x[i]), scopes, ids);  // Ver.2.31.17
      }
    };
    var step_x = function(x, f, dt){
      var _x = [];
      for(var i=0; i<len_i; ++i){
        _x[i] = unit["BRa"](options, x[i], unit["BRm"](options, f[i], dt));
      }
      return _x;
    };
    var get_f = null;
    var i0 = [];
    var j0 = [];
    var calc_f = function(){
      var _f = [];
      var tree = self.tree_eqn2tree(data, tree_eqn);
      var arr_f = tree.mat.arr;
      get_f = get_f || make_get_f_from_arr_f0(arr_f, len_i, i0, j0);
      for(var i=0; i<len_i; ++i){
        _f[i] = get_f(arr_f, i);
      }
      return _f;
    };
    var combinate = function(arr_f, arr_kcr){
      var _f = [];
      var len_j = arr_f.length;
      for(var i=0; i<len_i; ++i){
        _f[i] = DATA.num(0, 0);
        for(var j=0; j<len_j; ++j){
          _f[i] = unit["BRa"](options, _f[i], unit["BRm"](options, arr_f[j][i], DATA.num(arr_kcr[j], 0)));
        }
      }
      return _f;
    };
    var set_error = function(x){
      var dtcr = dt.com.r;
      var dtci = dt.com.i;
      var dtcrpo = Math.pow(dtcr, orderT);
      var dtcipo = Math.pow(dtci, orderT);
      for(var i=0; i<len_i; ++i){
        /* Ver.2.22.10 -> */
        var xie = x[i].err;
        xie.r = Math.max(dtcrpo, xie.r);
        xie.i = Math.max(dtcipo, xie.i);
        /* -> Ver.2.22.10 */
      }
    };
    // improved Euler method
    var OX_order2 = function(){
      var _xc = null;
      // t0
      store_t();
      var f1 = calc_f();
      var x1 = step_x(x0, f1, dt);
      store_t(dt);
      store_x(x1);
      var f2 = calc_f();
      var fc = combinate([f1, f2], [0.5, 0.5]);
      _xc = step_x(x0, fc, dt);
      if(options.checkError){
        set_error(_xc);
      }
      store_x(_xc);
      return _xc;
    };
    // classical Runge-Kutta method
    var OX_order4 = function(){
      var _xc = null;
      var dtr2 = get_dt(0.5);
      var kcr_1r6 = 1/6;
      var kcr_1r3 = 1/3;
      // t0
      store_t();
      var f1 = calc_f();
      var x1 = step_x(x0, f1, dtr2);
      store_t(dtr2);
      store_x(x1);
      var f2 = calc_f();
      var x2 = step_x(x0, f2, dtr2);
      store_x(x2);
      var f3 = calc_f();
      var x3 = step_x(x0, f3, dt);
      store_t(dt);
      store_x(x3);
      var f4 = calc_f();
      var fc = combinate([f1, f2, f3, f4], [kcr_1r6, kcr_1r3, kcr_1r3, kcr_1r6]);
      _xc = step_x(x0, fc, dt);
      if(options.checkError){
        set_error(_xc);
      }
      store_x(_xc);
      return _xc;
    };
    var OX = (orderT === 2)? OX_order2: OX_order4;
/* Ver.2.29.15 -> */
    var vec = x0;  // initialize
for(var n=0; n<Niteration; ++n){
      vec = OX();
      // update
      t0 = unit["BRa"](options, t0, dt);
      x0 = init_x0(arr_x, names, []);
}
    _tree = DATA.tree_mat(DATA.vec2arr(vec));
/* -> Ver.2.29.15 */
  }
  else{
    throw msgErr;
  }
}
else{
  var isNewtonian = (prop === "newtonian");
  if(len_j > 1){
    var tree_eqn = get_tree(0);
    /* Ver.2.27.15 -> */
    var tree_BT = get_tree(1);
    var names = self.get_names(data, tree_BT);
    if(!(names.length)) throw msgErr;
    /* -> Ver.2.27.15 */
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    if(args[2] && !(args[2].com)){
      arr_x = get_arr(2);
      if(arr_x.length-len_i) throw msgErr;
    }
    if(!(arr_x)){
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    /* -> Ver.2.29.15 */
    /* Ver.1.3.1 */
    var hc = self.get_hc(options, null, args[3], "dxJ");
    var hcr = hc.r;
    var hci = hc.i;
    var h0 = DATA.num(hcr, hci);
/* Ver.2.29.15 -> */
    var J = null;
    // x0
    var isFound_x0 = [];
    var x0 = init_x0(arr_x, names, isFound_x0);
    // x1
    var dx = [];
    var x1 = [];
    // f0
    var get_f = null;
    var i0 = [];
    var j0 = [];
    var f0 = [];
var step = function(){
    // x1
    for(var i=0; i<len_i; ++i){
      var x0ic = x0[i].com;
      dx[i] = h0;
      x1[i] = DATA.num(x0ic.r+hcr, x0ic.i+hci);
    }
    // f0
    var tree = self.tree_eqn2tree(data, tree_eqn);
    var arr_f = tree.mat.arr;
    get_f = get_f || make_get_f_from_arr_f0(arr_f, len_i, i0, j0);
    for(var i=0; i<len_i; ++i){
      f0[i] = get_f(arr_f, i);
    }
    // J
    J = math_mat.init2d(len_i, len_i);
    for(var j=0; j<len_i; ++j){
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        var num = (i === j)? x1[i]: x0[i];
        self.store_var(name_var, DATA.num2tree(num), scopes, ids);  // Ver.2.31.17
      }
      var tree = self.tree_eqn2tree(data, tree_eqn);
      var arr_f1 = tree.mat.arr;
      for(var i=0; i<len_i; ++i){
        var f1i = get_f(arr_f1, i);
        J[i][j] = unit["BRd"](options, unit["BRs"](options, f1i, f0[i]), dx[i]);
      }
    }
};
    if(isNewtonian){
      // Niteration
      var argN = args[4];
      var Niteration = (argN && argN.com)? Math.round(argN.com.r): 1;  // 0 enabled  // Ver.2.205.46 floor -> round
      // epsN
      var arg5 = args[5];
      var epsN = (arg5 && arg5.com)? arg5.com.r: self.options.epsN;  // 0 enabled
      // isRelative_epsN
      var arg6 = args[6];
      var isRelative_epsN = (arg6 && arg6.com)? arg6.com.r: self.options.isRelative_epsN;  // 0||not0
      _tree = DATA.tree_mat(DATA.vec2arr(x0));  // initialize
      var arr_mdx = null;
for(var n=0; n<Niteration; ++n){
      step();
      for(var i=0; i<len_i; ++i){
        J[i].push(f0[i]);
      }
      arr_mdx = math_mat.gaussian(options, J);
      // store x_next
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        var mdxi = self.arr2obj_i(arr_mdx, i);
        self.store_var(name_var, DATA.num2tree(unit["BRs"](options, x0[i], mdxi)), scopes, ids);  // Ver.2.31.17
      }
      // update
      x0 = init_x0(arr_x, names, []);
      // check convergence
      if(isRelative_epsN){
        // relative error
        var normdx = math_mat.euclidean(options, arr_mdx);
        var normx0 = math_mat.euclidean(options, DATA.vec2arr(x0));
        if(self.arr2num(normdx).com.r < epsN*self.arr2num(normx0).com.r) break;
      }
      else{
        // absolute error
        var normdx = math_mat.euclidean(options, arr_mdx);
        if(self.arr2num(normdx).com.r < epsN) break;
      }
}
      if(arr_mdx){
        if(options.checkError && argN && argN.com){
          for(var i=0; i<len_i; ++i){
            var name_var = names[i];
            var mdxi = self.arr2obj_i(arr_mdx, i);
            var x0ie = x0[i].err;
            x0ie.r = Math.max(Math.abs(mdxi.com.r), x0ie.r);
            x0ie.i = Math.max(Math.abs(mdxi.com.i), x0ie.i);
            self.store_var(name_var, DATA.num2tree(x0[i]), scopes, ids);  // Ver.2.31.17
          }
        }
        _tree = DATA.tree_mat(arr_mdx);
      }
    }
    else{
      step();
/* -> Ver.2.29.15 */
      _tree = DATA.tree_mat(J);
      // restore x0
      for(var i=0; i<len_i; ++i){
        var name_var = names[i];
        if(isFound_x0[i]){
          self.store_var(name_var, DATA.num2tree(x0[i]), scopes, ids);  // Ver.2.31.17
        }
        else{
          self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
        }
      }
    }
  }
  else{
    throw msgErr;
  }
}
  /* -> Ver.2.21.10 */
  return _tree;
};
My_entry.operation.prototype.FNmh = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var is = i0;
  var ie = i0+1;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    /* Ver.2.21.10 -> */
    var tree = self.jacobian(data, rightArr, tagObj);
    /* -> Ver.2.21.10 */
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
    /* Ver.2.176.43 -> */
    /* Ver.2.179.44 -> */
    var prop = tagObj.val;
    var i_key = tagObj.i;
    var hasKey = (typeof i_key !== "undefined");
    if(hasKey){
      prop += i_key;
    }
    /* -> Ver.2.179.44 */
    if(math_mat[prop]){
      var tree = DATA.tree_mat(math_mat[prop](options, rightArr));
    }
    else{
      throw "Undef FNm("+prop+")";
    }
    /* -> Ver.2.176.43 */
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
My_entry.operation.prototype.arr_tree2tree = function(data, i0, tagName, tagObj, arr_tree){
  var self = this;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var newData = self.get_newData(data, DATA.make_trees(arr_tree), ids);  // Ver.2.31.17
  self[tagName](newData, i0, tagName, tagObj);
  return DATA.trees2tree(newData.trees.filter(Boolean));  // Ver.2.43.21
};
My_entry.operation.prototype.RX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 2){
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var br = Math.round(b.com.r);  // Ver.2.205.46 floor -> round
      /* Ver.2.30.15 -> */
      var arg3 = args[3];
      var tree_eqn_break = (arg3)? self.tree2tree_eqn(data, arg3): null;
      var RX = (tree_eqn_break)?
        function(callback){
          for(var i=1; i<=br; ++i){  // i=1
            callback(i);
            var tree_break = self.tree_eqn2tree(data, tree_eqn_break);
            var num = DATA.tree2num(tree_break);
            if(num && num.com.r) break;
          }
        }:
        function(callback){
          for(var i=1; i<=br; ++i){  // i=1
            callback(i);
          }
        };
      /* -> Ver.2.30.15 */
      var name_var = tagObj.val.name;
      var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
      var tree = DATA.num2tree(a);
      RX(function(i){
        self.store_var(name_var, tree, scopes, ids);  // Ver.2.31.17
        tree = self.tree_eqn2tree(data, tree_eqn);
      });
      _tree = tree;
      if(tree_var){
        self.store_var(name_var, tree_var, scopes, ids);  // Ver.2.31.17
      }
      else{
        self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.DX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > 0){
    var name_var = tagObj.val.name;
    var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
    var a0 = (tree_var)? self.arr2num(tree_var.mat.arr): null;
    /* Ver.1.3.1 */
    var a = args[2] || a0;
    if(a && a.com){
      var tree_eqn = self.tree2tree_eqn(data, args[0]);
      var nthd = args[1];
      nthd = (nthd && nthd.com)? Math.abs(Math.round(nthd.com.r)): 1;  // nthd >= 0  // Ver.2.205.46 floor -> round
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
        self.store_var(name_var, DATA.num2tree(get_newX(x, cr, ci)), scopes, ids);  // Ver.2.31.17
        return self.arr2num(self.tree_eqn2tree(data, tree_eqn).mat.arr);
      };
      var DX_order2 = function(x, n){
        var xm0, xp0;
        var fm0, fp0;
        var p = 1<<(n-1);
        var hcr = h0cr*p;
        var hci = h0ci*p;
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
        /* Ver.2.20.10 -> */
        if(options.checkError){
          var hcrp2 = hcr*hcr;
          var hcip2 = hci*hci;
          /* Ver.2.22.10 -> */
          _num.err.r = Math.max(hcrp2, _num.err.r);
          _num.err.i = Math.max(hcip2, _num.err.i);
          /* -> Ver.2.22.10 */
        }
        /* -> Ver.2.20.10 */
        return _num;
      };
      var DX_order4 = function(x, n){
        var xm1, xm0, xp0, xp1;
        var fm1, fm0, fp0, fp1;
        var p = 1<<(n-1);  // extend order2
        var hcr = h0cr*p;
        var hci = h0ci*p;
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
        /* Ver.2.20.10 -> */
        if(options.checkError){
          var hcrp2 = hcr*hcr;
          var hcip2 = hci*hci;
          /* Ver.2.22.10 -> */
          _num.err.r = Math.max(hcrp2*hcrp2, _num.err.r);
          _num.err.i = Math.max(hcip2*hcip2, _num.err.i);
          /* -> Ver.2.22.10 */
        }
        /* -> Ver.2.20.10 */
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
      self.store_var(name_var, tree_var, scopes, ids);  // Ver.2.31.17
    }
    else{
      self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
    }
  }
  return _tree;
};
My_entry.operation.prototype.IX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
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
      N = Math.abs(Math.round(N) || self.options.NI);  // N > 0  // Ver.2.29.15  // Ver.2.205.46 floor -> round
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
      var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
      var calc_f = function(cr, ci){
        self.store_var(name_var, DATA.tree_num(cr, ci), scopes, ids);  // Ver.2.31.17
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
        /* Ver.2.20.10 -> */
        if(options.checkError){
          _sum.err.r = Math.max(hcrp2, _sum.err.r);
          _sum.err.i = Math.max(hcip2, _sum.err.i);
        }
        /* -> Ver.2.20.10 */
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
        /* Ver.2.20.10 -> */
        if(options.checkError){
          _sum.err.r = Math.max(hcrp2*hcrp2, _sum.err.r);
          _sum.err.i = Math.max(hcip2*hcip2, _sum.err.i);
        }
        /* -> Ver.2.20.10 */
        return _sum;
      };
      var DI = (options.orderI === 2)? DI_order2: DI_order4;
      _tree = DATA.num2tree(DI());
      if(tree_var){
        self.store_var(name_var, tree_var, scopes, ids);  // Ver.2.31.17
      }
      else{
        self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.PX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
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
      di = (di && di.com)? Math.abs(Math.round(di.com.r) || 1): 1;  // di > 0  // Ver.2.205.46 floor -> round
      var ar = Math.round(a.com.r);  // Ver.2.205.46 floor -> round
      var br = Math.round(b.com.r);  // Ver.2.205.46 floor -> round
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
      var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
      var tagName = "BRdm";  // Ver.1.5.3
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      PX(function(i){
        self.store_var(name_var, DATA.tree_num(i, 0), scopes, ids);  // Ver.2.31.17
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.Imat_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
      if(tree_var){
        self.store_var(name_var, tree_var, scopes, ids);  // Ver.2.31.17
      }
      else{
        self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
      }
    }
  }
  return _tree;
};
My_entry.operation.prototype.SX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
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
      di = (di && di.com)? Math.abs(Math.round(di.com.r) || 1): 1;  // di > 0  // Ver.2.205.46 floor -> round
      var ar = Math.round(a.com.r);  // Ver.2.205.46 floor -> round
      var br = Math.round(b.com.r);  // Ver.2.205.46 floor -> round
      var sign = "+";
      var SX = null;
      if(ar > br){
        /* Ver.1.5.3 */
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
      var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.31.17
      var tagName = "BRsa";
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      SX(function(i){
        self.store_var(name_var, DATA.tree_num(i, 0), scopes, ids);  // Ver.2.31.17
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.zeros2d_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
      if(tree_var){
        self.store_var(name_var, tree_var, scopes, ids);  // Ver.2.31.17
      }
      else{
        self.del_scope_sw("vars", name_var, scopes, ids);  // Ver.2.31.17
      }
    }
  }
  return _tree;
};
/* Ver.1.6.3 */
My_entry.operation.prototype.switch = function(data, rightArr, tagObj){
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = DATA.tree_num(false, 0);  // Ver.2.167.40
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
My_entry.operation.prototype.FN = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  /* Ver.2.30.15 -> */
  var prop = tagObj.val;
  var isFN0 = (prop === "random");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(isFN0){
    var tree = DATA.tree_num(Math[prop](), 0);
    ie = is;
    self.feedback2trees(data, is, ie, tree);
  }
  else if(rightArr){
  /* -> Ver.2.30.15 */
    /* Ver.2.74.29 -> */
    /* Ver.2.73.29 -> */
    var tree = null;
    var len_i = rightArr.length;
    var i_sw = (options.useMatrix && len_i > 1)? 0: len_i-1;
    var arr = [];
    for(var i=i_sw; i<len_i; ++i){
      var args = rightArr[i];
      arr.push([unit[tagName].apply(unit, [prop, options].concat(args))]);  // arguments.length < O(10000)
    }
    tree = DATA.tree_mat(arr);
    /* -> Ver.2.73.29 */
    /* -> Ver.2.74.29 */
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
/* Ver.2.125.34 -> */
My_entry.operation.prototype.FN_statistics0 = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  var prop = tagObj.val;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var tree = null;
    var len_i = rightArr.length;
    var i_sw = (options.useMatrix)? 0: len_i-1;
    var arr = [];
    for(var i=i_sw; i<len_i; ++i){
      var args = rightArr[i];
      var len_j = args.length;
      if(prop === "mean" || prop === "sum"){
        var num = DATA.num(0, 0);
        for(var j=0; j<len_j; ++j){
          num = unit["BRa"](options, num, args[j]);
        }
        if(prop === "mean"){
          num = unit["BRd"](options, num, DATA.num(len_j, 0));
        }
      }
      else if(prop === "prod"){
        var num = DATA.num(1, 0);
        for(var j=0; j<len_j; ++j){
          num = unit["BRm"](options, num, args[j]);
        }
      }
      arr.push([num]);
    }
    tree = DATA.tree_mat(arr);
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
/* Ver.2.128.34 */
My_entry.operation.prototype.FN_statistics1 = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  var prop = tagObj.val;
  var i_key = tagObj.i;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr){
    var sort_bubble = function(args){
      var _arr_key = [];
      var len_j = args.length;
      for(var j=0; j<len_j; ++j){
        _arr_key.push(j);
      }
      for(var j=0; j<len_j-1; ++j){
        for(var jj=1; jj<len_j-j; ++jj){
          var left = args[jj-1];
          var right = args[jj];
          var lcr = left.com.r;
          var lci = left.com.i;
          var rcr = right.com.r;
          var rci = right.com.i;
          var isSorted = (isComplex)? (lcr*lcr+lci*lci > rcr*rcr+rci*rci): (lcr > rcr);
          if(isSorted){
            var w = left;
            args[jj-1] = args[jj];
            args[jj] = w;
            var w = _arr_key[jj-1];
            _arr_key[jj-1] = _arr_key[jj];
            _arr_key[jj] = w;
          }
        }
      }
      return _arr_key;
    };
    var isComplex = (prop === "cmedian" || prop === "csort" || prop === "creverse");
    var hasKey = (typeof i_key !== "undefined");
    var tree = null;
    var len_i = rightArr.length;
    var i_sw = (options.useMatrix)? 0: len_i-1;
    var arr = [];
    if(hasKey){
      var args_key = rightArr[i_key];
      var len_j_key = (args_key)? args_key.length: 0;
      for(var i=0; i<len_i; ++i){  // i=0
        var args = rightArr[i];
        var len_j = args.length;
        if(len_j !== len_j_key) throw "Invalid table size";
      }
      var arr_key = sort_bubble(args_key);
      for(var i=i_sw; i<len_i; ++i){
        var args = [];
        var args0 = rightArr[i];
        var len_j = args0.length;
        if(i === i_key){
          args = args_key;
        }
        else{
          for(var j=0; j<len_j; ++j){
            args[j] = args0[arr_key[j]];
          }
        }
        if(prop === "reverse" || prop === "creverse"){
          args = args.reverse();
        }
        arr.push(args);
      }
    }
    else{
      for(var i=i_sw; i<len_i; ++i){
        var args = rightArr[i];
        var len_j = args.length;
        sort_bubble(args);
        if(prop === "median" || prop === "cmedian"){
          args = [args[Math.floor(len_j/2)]];
        }
        else if(prop === "reverse" || prop === "creverse"){
          args = args.reverse();
        }
        arr.push(args);
      }
    }
    tree = DATA.tree_mat(arr);
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
/* Ver.2.90.32 */
My_entry.operation.prototype.FNn = function(data, i0, tagName, tagObj){
  var self = this;
  var prop = tagObj.val;
  switch(prop){
    case "mean":
    case "sum":
    case "prod":
      self.FN_statistics0(data, i0, tagName, tagObj);
      break;
    /* Ver.2.91.32 */
    case "median":
    case "sort":
    case "reverse":
    case "cmedian":
    case "csort":
    case "creverse":
      self.FN_statistics1(data, i0, tagName, tagObj);
      break;
    default:
      self.FN(data, i0, tagName, tagObj);
      break;
  }
  return self;
};
/* -> Ver.2.125.34 */
/* Ver.2.214.49 -> */
My_entry.operation.prototype.has1elem_tag = function(arr, tagName){
  var self = this;
  var has1elem = (arr && arr.length === 1 && arr[0].length === 1);
  return (has1elem && arr[0][0][tagName]);
};
My_entry.operation.prototype.arr2tree_eqn = function(data, arr){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree_eqn = null;
  var has1elem_tag = self.has1elem_tag(arr, BT.SEe);
  if(has1elem_tag){
    _tree_eqn = self.tree_SEe2REe(arr[0][0]);
    var isREe = _tree_eqn[BT.REe];
    if(!(isREe.arg)){
      var names = self.get_names(data, _tree_eqn);
      var name_eqn = names[names.length-1];
      if(name_eqn){
        _tree_eqn = self.restore_eqn(name_eqn, scopes, ids);
      }
    }
  }
  return _tree_eqn;
};
My_entry.operation.prototype.URh = function(data, i0, tagName, tagObj, dot_prop){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  var is = i0-1;
  var ie = i0+2;
  var leftTree = trees[is];
  var rightTree = trees[ie];
  var leftArr = self.get_tagVal(leftTree, "mat", "arr");
  var rightArr = self.get_tagVal(rightTree, "mat", "arr");
  var tree_eqn = self.arr2tree_eqn(data, rightArr);
  var isREe = (tree_eqn)? tree_eqn[BT.REe]: null;
  var args_eqn = (isREe)? isREe.arg: null;
  if(leftArr && args_eqn){
    var sw_names = ["x", "i", "j", "s"];
    var names = {
      x: args_eqn[0],
      i: args_eqn[1],  // Ver.2.215.50
      j: args_eqn[2],  // Ver.2.215.50
      s: args_eqn[3]  // Ver.2.215.50
    };
    var buffer_vars = {};
    sw_names.forEach(function(sw){
      var name = names[sw];
      if(name){  // Ver.2.215.50
        buffer_vars[name] = self.restore_var(name, scopes, ids);
      }
    });
    var arr = leftArr;
    math_mat.fill_arr(null, arr, DATA.num(NaN, NaN));  // common reference
    var lens = math_mat.get_lens(arr);
    var len_i = lens.i;
    var len_j = lens.j;
    var _arr = null;
    var callback = null;
    if(dot_prop === "map"){
      _arr = [];
      for(var i=0; i<len_i; ++i){
        _arr[i] = [];
      }
      callback = function(_arr, arr, arr_, i, j){
        _arr[i][j] = self.arr2num(arr_);
      };
    }
    else if(dot_prop === "filter"){
      _arr = [[], [], []];
      callback = function(_arr, arr, arr_, i, j){
        if(!(DATA.isStrictFalse_arr(arr_))){
          _arr[0].push(arr[i][j]);
          _arr[1].push(DATA.num(i, 0));
          _arr[2].push(DATA.num(j, 0));
        }
      };
    }
    if(names.s){  // Ver.2.215.50
      self.store_var(names.s, leftTree, scopes, ids);  // clone
    }
    for(var i=0; i<len_i; ++i){
      if(names.i){  // Ver.2.215.50
        self.store_var(names.i, DATA.tree_num(i, 0), scopes, ids);
      }
      for(var j=0; j<len_j; ++j){
        if(names.j){  // Ver.2.215.50
          self.store_var(names.j, DATA.tree_num(j, 0), scopes, ids);
        }
        self.store_var(names.x, DATA.num2tree(arr[i][j]), scopes, ids);
        callback(_arr, arr, self.tree_eqn2tree(data, tree_eqn).mat.arr, i, j);
      }
    }
    _tree = DATA.tree_mat(DATA.arr2arr_r(_arr));  // Ver.2.217.50
    sw_names.forEach(function(sw){
      var name = names[sw];
      if(name){  // Ver.2.215.50
        var tree = buffer_vars[name];
        if(tree){
          self.store_var(name, tree, scopes, ids);
        }
        else{
          self.del_scope_sw("vars", name, scopes, ids);
        }
      }
    });
    self.feedback2trees(data, is, ie, _tree);
  }
  if(!(_tree)){
    throw "Invalid ."+dot_prop+"("+args_eqn+")";
  }
  return self;
};
/* -> Ver.2.214.49 */
/* Ver.2.192.44 -> */
My_entry.operation.prototype.UR = function(data, i0, tagName, tagObj){
  var self = this;
  var prop = tagObj.val;
  var hasD = (prop === "." || prop === "'");
  return self[(hasD)? "URd": "URif"](data, i0, tagName, tagObj);
};
My_entry.operation.prototype.URd = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  /* Ver.2.214.49 -> */
  var name_var = self.get_tagVal(trees[i0+1], "REv", "val");
  var hasProp = (name_var)? (name_var[0] === "."): false;
if(hasProp){
  var dot_prop = name_var.substring(1);
  self.URh(data, i0, tagName, tagObj, dot_prop);
}
else{
  var is = i0-1;
  var ie = i0;
  var prop = tagObj.val;
  var tree = null;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  if(leftArr){
    var hasH = (prop === "'")? "h": "";
    var tarr = math_mat[hasH+"transpose"](options, leftArr);
    tree = DATA.tree_mat(tarr);
  }
  else{
    throw "Invalid null"+prop;
  }
  self.feedback2trees(data, is, ie, tree);
}
  /* -> Ver.2.214.49 */
  return self;
};
/* -> Ver.2.192.44 */
/* Ver.2.74.29 -> */
My_entry.operation.prototype.URif = function(data, i0, tagName, tagObj){  // Ver.2.192.44
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0-1;
  var ie = i0;
  /* Ver.2.73.29 -> */
  var prop = tagObj.val;
  var hasI = (prop === "i");  // Ver.2.192.44
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var right = (hasI)?  // Ver.2.192.44
    DATA.num(0, 1):
    DATA.num(Number(prop), 0);
  var tree = null;
  var callback = (hasI)?  // Ver.2.192.44
    function(left, right){
      return unit["BRm"](options, left, right);
    }:
    function(left, right){
      return unit["FN"]("fact_m", options, left, right);
    };
  if(leftArr){
    if(options.useMatrix){
      var arr = [];
      var len_i = leftArr.length;
      if(options.useComma){
        for(var i=0; i<len_i; ++i){
          var left = self.arr2obj_i(leftArr, i);
          arr[i] = [callback(left, right)];
        }
      }
      else{
        for(var i=0; i<len_i; ++i){
          arr[i] = [];
          for(var j=0, len_j=leftArr[i].length; j<len_j; ++j){
            var left = leftArr[i][j];
            arr[i][j] = callback(left, right);
          }
        }
      }
      tree = DATA.tree_mat(arr);
    }
    else{
      var left = self.arr2num(leftArr);
      tree = DATA.num2tree(callback(left, right));
    }
  }
  else{
    var left = DATA.num(1, 0);
    tree = DATA.num2tree(callback(left, right));
  }
  /* -> Ver.2.73.29 */
  var is = (leftArr)? is: i0;
  self.feedback2trees(data, is, ie, tree);
  return self;
};
/* -> Ver.2.74.29 */
/* Ver.2.71.28 */
My_entry.operation.prototype.PUbn =
/* Ver.2.81.32 -> */
My_entry.operation.prototype.PUlN = function(data, i0, tagName, tagObj){
/* -> Ver.2.81.32 */
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var is = i0;
  var ie = i0+1;
  var leftArr = self.get_tagVal(trees[is-1], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(!(leftArr) && rightArr){
    /* Ver.2.74.29 -> */
    /* Ver.2.73.29 -> */
    var prop = tagObj.val;
    var tree = null;
    var callback = function(right){
      return unit["FN"](prop, options, right);
    };
    if(options.useMatrix){
      var arr = [];
      var len_i = rightArr.length;
      if(options.useComma){
        for(var i=0; i<len_i; ++i){
          var right = self.arr2obj_i(rightArr, i);
          arr[i] = [callback(right)];
        }
      }
      else{
        for(var i=0; i<len_i; ++i){
          arr[i] = [];
          for(var j=0, len_j=rightArr[i].length; j<len_j; ++j){
            var right = rightArr[i][j];
            arr[i][j] = callback(right);
          }
        }
      }
      tree = DATA.tree_mat(arr);
    }
    else{
      var right = self.arr2num(rightArr);
      tree = DATA.num2tree(callback(right));
    }
    /* -> Ver.2.73.29 */
    /* -> Ver.2.74.29 */
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
    /* Ver.2.88.32 -> */
    var isNotDefined_BRmsa = !(tree.mat.arr);
    if(isNotDefined_BRmsa){
      tree = self.callbacks_mat.BRd("BRm", tagObj, leftArr, rightArr);
    }
    /* -> Ver.2.88.32 */
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
  /* Ver.2.74.29 -> */
  self.callbacks_mat.BRelse = function(tagName, tagObj, leftArr, rightArr, callback){
    var _tree = null;
    if(leftArr && rightArr){
      /* Ver.2.73.29 -> */
      if(options.useMatrix){
        var arr = [];
        var len_i = Math.max(leftArr.length, rightArr.length);
        if(options.useComma){
          var il = 0;
          var ir = 0;
          for(var i=0; i<len_i; ++i){
            il = (leftArr[i])? i: il;
            ir = (rightArr[i])? i: ir;
            var left = self.arr2obj_i(leftArr, il);
            var right = self.arr2obj_i(rightArr, ir);
            arr[i] = [callback(left, right)];
          }
        }
        else{
          var lArri = null;
          var rArri = null;
          for(var i=0; i<len_i; ++i){
            lArri = leftArr[i] || lArri;
            rArri = rightArr[i] || rArri;
            arr[i] = [];
            var left = null;
            var right = null;
            for(var j=0, len_j=Math.max(lArri.length, rArri.length); j<len_j; ++j){
              left = lArri[j] || left;
              right = rArri[j] || right;
              arr[i][j] = callback(left, right);
            }
          }
        }
        _tree = DATA.tree_mat(arr);
      }
      else{
        var left = self.arr2num(leftArr);
        var right = self.arr2num(rightArr);
        _tree = DATA.num2tree(callback(left, right));
      }
      /* -> Ver.2.73.29 */
    }
    return _tree;
  };
  self.callbacks_mat.BRlX =  // Ver.2.168.41
  self.callbacks_mat.BRbs =
  self.callbacks_mat.BRba =
  self.callbacks_mat.BRbx =
  self.callbacks_mat.BRbo =
  self.callbacks_mat.BRcn =
  self.callbacks_mat.BRrl = function(tagName, tagObj, leftArr, rightArr){
    var callback = function(left, right){
      var prop = tagObj.val;
      return unit["FN"](prop, options, left, right);
    };
    return self.callbacks_mat.BRelse(tagName, tagObj, leftArr, rightArr, callback);
  };
  self.callbacks_mat.BRp =
  self.callbacks_mat.BRr =
  /* Ver.2.87.32 -> */
  self.callbacks_mat.BRpp =
  self.callbacks_mat.BRrr =
  /* -> Ver.2.87.32 */
  self.callbacks_mat.BRd =
  /* Ver.2.59.26 -> */
  self.callbacks_mat.BRlA =
  self.callbacks_mat.BRlO = function(tagName, tagObj, leftArr, rightArr){
  /* -> Ver.2.59.26 */
    var callback = function(left, right){
      return unit[tagName](options, left, right);
    };
    return self.callbacks_mat.BRelse(tagName, tagObj, leftArr, rightArr, callback);
  };
  /* -> Ver.2.74.29 */
  return self;
};
/* Ver.2.87.32 -> */
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
    /* Ver.2.88.32 -> */
    var isNotDefined_BRmsa = !(_tree.mat.arr);
    if(isNotDefined_BRmsa){
      _tree = self.callbacks_mat.BRd(tagName, tagObj, leftArr, rightArr);
    }
    /* -> Ver.2.88.32 */
    var is = (leftArr)? is: i0;
    var isRightAssociativity = options.isRightAssociativityBR;
    self.feedback2trees(data, is, ie, _tree, isRightAssociativity);
  }
  return _tree;
};
My_entry.operation.prototype.BR_original_RA = function(data, i0, tagName, tagObj){
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
    var isRightAssociativity = true;
    self.feedback2trees(data, is, ie, _tree, isRightAssociativity);
  }
  return _tree;
};
My_entry.operation.prototype.BRpp = function(data, i0, tagName, tagObj){
  var self = this;
  var tree = self.BR_original_RA(data, i0, tagName, tagObj);
  if(!(tree)){
    throw "Invalid binary operation";
  }
  return self;
};
/* -> Ver.2.87.32 */
My_entry.operation.prototype.BRp =
My_entry.operation.prototype.BRbs =
My_entry.operation.prototype.BRba =
My_entry.operation.prototype.BRbx =
My_entry.operation.prototype.BRbo =
My_entry.operation.prototype.BRcn =
My_entry.operation.prototype.BRrl =
/* Ver.2.59.26 -> */
My_entry.operation.prototype.BRlA =
My_entry.operation.prototype.BRlX =  // Ver.2.168.41
My_entry.operation.prototype.BRlO = function(data, i0, tagName, tagObj){
/* -> Ver.2.59.26 */
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
  var tree = null;
  /* Ver.2.87.32 -> */
  switch(tagObj.val){
    case "*":
      tree = self.BR_original(data, i0, "BRm", tagObj);
      break;
    case "/":
      tree = self.BR_original(data, i0, "BRd", tagObj);
      break;
    case "%":
      tree = self.BR_original(data, i0, "BRr", tagObj);
      break;
    case "%%":
      tree = self.BR_original(data, i0, "BRrr", tagObj);
      break;
    default:
      break;
  }
  /* -> Ver.2.87.32 */
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
/* Ver.2.31.17 -> */
My_entry.operation.prototype.restore_var = function(name, scopes, ids){
  var self = this;
  var _tree = null;
  var vars = self.get_scope_RE_sw("vars", name, scopes, ids);
  if(vars){
    var tree = vars[name];
    _tree = (tree)? self.entry.def.newClone(tree): null;  // clone for concatination x=2;(x,2x:3x,4x)
  }
  return _tree;
};
My_entry.operation.prototype.store_var = function(name, tree, scopes, ids){
  var self = this;
  var vars = self.get_scope_SE_sw("vars", scopes, ids);
  vars[name] = self.entry.def.newClone(tree);  // separate from trees
  return self;
};
/* -> Ver.2.31.17 */
/* Ver.2.76.29 -> */
My_entry.operation.prototype.restore_arr = function(arr, ref){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var _arr = [];
  var _arri = _arr;
  var arri = arr;
  var len_ref = ref.length;
  if(len_ref === 2 && ref[0] === Math.E){  // Ver.2.79.31
    var tarr = math_mat.transpose(null, arr);
    /* Ver.2.78.31 -> */
    var _j = ref[1];
    var dj = tarr.length;
    var j_ref = (_j+dj)%dj;
    var tarrj = tarr[j_ref];
    var hasArea0 = (_j%1 === 0);
    var isInArea = (_j >= -dj && _j < dj);
    if(hasArea0 && isInArea){
    /* -> Ver.2.78.31 */
      for(var i=0, len_i=tarrj.length; i<len_i; ++i){
        _arr[i] = [tarrj[i]];
      }
    }
    else{
      throw "Invalid reference of array(column)";
    }
  }
  /* Ver.2.79.32 -> */
  /* Ver.2.78.31 -> */
  else if(len_ref < 3){
    ref.forEach(function(i_ref0, i){
      var _i = i_ref0;
      var di = arri.length;
      var i_ref = (_i+di)%di;
      var hasArea0 = (_i%1 === 0);
      var isInArea = (_i >= -di && _i < di);
      if(hasArea0 && isInArea){
        _arri[0] = (i === len_ref-1)? arri[i_ref]: [];
      }
      else{
        throw "Invalid reference of array";
      }
      _arri = _arri[0];
      arri = arri[i_ref];
    });
  }
  /* -> Ver.2.78.31 */
  /* -> Ver.2.79.32 */
  /* Ver.2.77.30 -> */
  else if(len_ref === 4){
    /* Ver.2.84.32 -> */
    var ttarr = arr;
    if(self.useEmpty){
      ttarr = math_mat.transpose(null, math_mat.transpose(null, arr));
    }
    /* -> Ver.2.84.32 */
    var _di = ttarr.length;
    var _dj = ttarr[0].length;
    var _i = ref[0];
    var _j = ref[1];
    var di = ref[2] || _di;  // || not0
    var dj = ref[3] || _dj;  // || not0
    var _di2 = _di*2;
    var _dj2 = _dj*2;
    var hasArea0 = (_i%1 === 0 && _j%1 === 0 && di%1 === 0 && dj%1 === 0 && _di >= di && _dj >= dj && di > 0 && dj > 0);  // Ver.2.77.31  // Ver.2.79.32
    var isInArea = (_i >= -_di && _i < _di && _j >= -_dj && _j < _dj);  // Ver.2.78.31
    if(hasArea0 && isInArea){
      for(var i=0; i<di; ++i){
        _arr[i] = [];
        for(var j=0; j<dj; ++j){
          var ii = (_i < 0)? (_i-i+_di2)%_di: (_i+i)%_di;
          var jj = (_j < 0)? (_j-j+_dj2)%_dj: (_j+j)%_dj;
          _arr[i][j] = ttarr[ii][jj];
        }
      }
    }
    else{
      throw "Invalid reference of array(area)";
    }
  }
  /* -> Ver.2.77.30 */
  /* Ver.2.80.32 -> */
  else if((len_ref+1)%2 === 0){
    var tarr = math_mat.transpose(null, arr);
    /* Ver.2.84.32 -> */
    var ttarr = arr;
    if(self.useEmpty){
      ttarr = math_mat.transpose(null, tarr);
    }
    /* -> Ver.2.84.32 */
    var len_i = ttarr.length;
    var len_j = ttarr[0].length;
    var len_min = Math.min(len_i, len_j);
    var hasArea0 = true;
    var isInArea = true;
    for(var i=0; i<len_ref; ++i){
      var refi = ref[i];
      hasArea0 = hasArea0 && (refi%1 === 0);
      isInArea = isInArea && ((refi < 0)? (-refi < len_i): (refi < len_j));
    }
    if(hasArea0 && isInArea){
      for(var i=0; i<len_min; ++i){
        _arr[i] = [];
      }
      var num0 = DATA.num(0, 0);
      for(var j=0; j<len_ref; ++j){
        var refj = ref[j];
        var abs_refj = Math.abs(refj);
        var arr_sw = (refj < 0)? ttarr: tarr;
        for(var i=0; i<len_min; ++i){
          var ji = abs_refj+i;
          var right = ((arr_sw[ji])? arr_sw[ji][i]: null) || num0;  // cloned@self.store_var()
          _arr[i][j] = right;
        }
      }
    }
    else{
      throw "Invalid reference of array(band)";
    }
  }
  /* -> Ver.2.80.32 */
  /* Ver.2.79.32 -> */
  else{
    throw "Invalid reference";
  }
  /* -> Ver.2.79.32 */
  return _arr;
};
/* Ver.2.80.32 -> */
My_entry.operation.prototype.store_arr_band = function(_arr, ref, arr){
  var self = this;
  var math_mat = self.entry.math_mat;
  /* Ver.2.84.32 -> */
  var _ttarr = _arr;
  var ttarr = arr;
  if(self.useEmpty){
    _ttarr = math_mat.transpose(null, math_mat.transpose(null, _arr));
    ttarr = math_mat.transpose(null, math_mat.transpose(null, arr));
  }
  /* -> Ver.2.84.32 */
  var len_ref = ref.length;
  var len_i = _ttarr.length;
  var len_j = _ttarr[0].length;
  var len_min = Math.min(len_i, len_j);
  var hasArea0 = true;
  var isInArea = true;
  for(var i=0; i<len_ref; ++i){
    var refi = ref[i];
    hasArea0 = hasArea0 && (refi%1 === 0);
    isInArea = isInArea && ((refi < 0)? (-refi < len_i): (refi < len_j));
  }
  if(hasArea0 && isInArea){
    var hasArea1 = (ttarr[0].length === len_ref);
    if(hasArea1){
      for(var i=0, len_i=_ttarr.length; i<len_i; ++i){
        for(var j=0, len_j=_ttarr[i].length; j<len_j; ++j){
          _arr[i][j] = _ttarr[i][j];
        }
      }
      for(var j=0; j<len_ref; ++j){
        var refj = ref[j];
        var abs_refj = Math.abs(refj);
        var right = null;
        for(var i=0; i<len_min; ++i){
          right = (ttarr[i])? ttarr[i][j]: right;  // cloned@self.store_var()
          var ji = abs_refj+i;
          if(refj < 0){
            if(ji < len_i && i < len_j){
              _arr[ji][i] = right;
            }
          }
          else{
            if(i < len_i && ji < len_j){
              _arr[i][ji] = right;
            }
          }
        }
      }
    }
    else{
      throw "Invalid store array(band)";
    }
  }
  else{
    throw "Invalid reference of array(band)";
  }
  return _arr;
};
/* -> Ver.2.80.32 */
/* Ver.2.77.30 -> */
My_entry.operation.prototype.store_arr_area = function(_arr, ref, arr){
  var self = this;
  var math_mat = self.entry.math_mat;
  /* Ver.2.84.32 -> */
  var _ttarr = _arr;
  var ttarr = arr;
  if(self.useEmpty){
    _ttarr = math_mat.transpose(null, math_mat.transpose(null, _arr));
    ttarr = math_mat.transpose(null, math_mat.transpose(null, arr));
  }
  /* -> Ver.2.84.32 */
  var _di = _ttarr.length;
  var _dj = _ttarr[0].length;
  var _i = ref[0];
  var _j = ref[1];
  var di = ref[2] || _di;  // || not0
  var dj = ref[3] || _dj;  // || not0
  var _di2 = _di*2;
  var _dj2 = _dj*2;
  /* Ver.2.78.31 -> */
  var hasArea0 = (_i%1 === 0 && _j%1 === 0 && di%1 === 0 && dj%1 === 0 && _di >= di && _dj >= dj && di > 0 && dj > 0);  // Ver.2.77.31  // Ver.2.79.32
  var isInArea = (_i >= -_di && _i < _di && _j >= -_dj && _j < _dj);
  if(hasArea0 && isInArea){
    var hasArea1 = (ttarr.length === di && ttarr[0].length === dj);
    if(hasArea1){
      for(var i=0, len_i=_ttarr.length; i<len_i; ++i){
        for(var j=0, len_j=_ttarr[i].length; j<len_j; ++j){
          _arr[i][j] = _ttarr[i][j];
        }
      }
      for(var i=0; i<di; ++i){
        for(var j=0; j<dj; ++j){
          var ii = (_i < 0)? (_i-i+_di2)%_di: (_i+i)%_di;
          var jj = (_j < 0)? (_j-j+_dj2)%_dj: (_j+j)%_dj;
          _arr[ii][jj] = ttarr[i][j];
        }
      }
    }
    else{
      throw "Invalid store array(area)";
    }
  }
  else{
    throw "Invalid reference of array(area)";
  }
  /* -> Ver.2.78.31 */
  return _arr;
};
/* -> Ver.2.77.30 */
My_entry.operation.prototype.store_arr_col = function(_arr, ref, arr){
  var self = this;
  var math_mat = self.entry.math_mat;
  var _tarr = math_mat.transpose(null, _arr);
  var tarr = math_mat.transpose(null, arr);
  var tarr_stored = self.arr2args(tarr);
  /* Ver.2.78.31 -> */
  var _j = ref[1];
  var _dj = _tarr.length;
  var j_ref = (_j+_dj)%_dj;
  var _tarrj = _tarr[j_ref];
  var di = (_tarrj)? _tarrj.length: 0;
  var hasArea0 = (_j%1 === 0);
  var isInArea = (_j >= -_dj && _j < _dj);
  if(hasArea0 && isInArea){
    var hasArea1 = (tarr_stored.length === di);
    if(hasArea1){
      _tarr[j_ref] = tarr_stored;
      var _ttarr = math_mat.transpose(null, _tarr);
      for(var i=0, len_i=_ttarr.length; i<len_i; ++i){
        for(var j=0, len_j=_ttarr[i].length; j<len_j; ++j){
          _arr[i][j] = _ttarr[i][j];
        }
      }
    }
    else{
      throw "Invalid store array(column)";
    }
  }
  else{
    throw "Invalid reference of array(column)";
  }
  /* -> Ver.2.78.31 */
  return _arr;
};
/* -> Ver.2.76.29 */
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
  /* Ver.2.78.31 -> */
  ref.forEach(function(i_ref0, i){
    var _i = i_ref0;
    var _di = (_arri)? _arri.length: 0;
    var i_ref = (_i+_di)%_di;
    var _arrii = _arri[i_ref];
    var hasArea0 = (_i%1 === 0);
    var isInArea = (_i >= -_di && _i < _di);
    if(hasArea0 && isInArea){
      if(i === len_ref-1){
        var _dj = _arrii.length;
        var hasArea1 = (arr_stored.length === _dj);
        if(hasArea1){
          _arri[i_ref] = arr_stored;
        }
        else{
          throw "Invalid store array";
        }
      }
      _arri = _arri[i_ref];
    }
    else{
      throw "Invalid reference of array";
    }
  });
  /* -> Ver.2.78.31 */
  return _arr;
};
My_entry.operation.prototype.tree_eqn2tree = function(data, tree, isREe){  // Ver.2.202.46
  var self = this;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var newData = self.get_newData(data, DATA.tree2trees(tree), ids);  // Ver.2.31.17
  var trees = self.remake_trees(newData, !(isREe));  // Ver.2.160.38  // Ver.2.202.46
  var _tree = DATA.trees2tree(trees);
  return _tree;
};
/* Ver.2.202.46 arguments arranged */
/* Ver.2.194.45 isLocked_eqns deleted */
/* Ver.2.32.17 clear; add(A,=<B)=<[A+B=>],A=(,:,),B=<(,:,),add[0](=<A,=<B) */
/* Ver.2.20.8 */
My_entry.operation.prototype.tree_eqn2tree_AtREe = function(data, tree){
  var self = this;
  var _tree = self.tree_eqn2tree(data, tree, true);
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
  /* Ver.2.31.17 -> [a=1,a[0][0]=2,(a,3)] */
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  var isStorE = function(tree){
    return (self.get_tag(tree, "BRe") || self.get_tag(tree, "SEe"));
  };
  var ref = trees[is]["REv"]["ref"];
  var tree = null;
  var isSE = (i0 === 0 && isStorE(trees[i0+1]));
  if(!(isSE)){
    var name = tagObj.val;
    tree = self.restore_var(name, scopes, ids);
    /* Ver.2.24.11 -> */
    if(tree){
    }
    else if(!(self.useStrict)){
      tree = self.restore_eqn(name, scopes, ids);
      if(tree){
        /* Ver.2.20.8 -> */
        var isREe = tree[self.config.BT.REe];
        if(isREe){
          tree = (isREe.arg)? self.REe(data, i0+2, tagName, tagObj): self.tree_eqn2tree_AtREe(data, tree);  // Ver.2.32.17  // Ver.2.202.46
          if(isREe.arg && tree){
            ie = i0+1;
          }
        }
        /* -> Ver.2.20.8 */
      }
    }
    /* -> Ver.2.24.11 */
  }
  if(tree){
    if(ref){
      tree = self.tree2tree_ref(tree, ref);
    }
    self.feedback2trees(data, is, ie, tree);
  }
  else{
    ++self.params.hasUndefVars;
  }
  /* -> Ver.2.31.17 */
  return self;
};
/* Ver.2.20.6 */
My_entry.operation.prototype.SEv_pattern_matching = function(data, is, ie){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var tree = null;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  var store_var = function(leftArrij, rightNum){
    var _out = "";
    var name_var = self.get_tagVal(leftArrij, "REv", "val");
    if(name_var){
      var name_var_escaped = self.get_name_escaped(leftArrij);  // Ver.2.27.15
      if(name_var_escaped){
        self.store_var(name_var_escaped, DATA.num2tree(rightNum), scopes, ids);  // Ver.2.31.17
        _out += "stored_var("+name_var_escaped+") ";
        --self.params.hasUndefVars;
      }
      else{
        self.throw_tree(leftArrij);
      }
    }
    return _out;
  };
  if(leftArr && rightArr){
    var out = "";
    var len_i = Math.max(leftArr.length, rightArr.length);
    for(var i=0; i<len_i; ++i){
      var leftArri = leftArr[i];
      var rightArri = rightArr[i];
      if(leftArri && rightArri){
        var len_j = Math.max(leftArri.length, rightArri.length);
        for(var j=0; j<len_j; ++j){
          var leftArrij = leftArri[j];
          var rightArrij = rightArri[j];
          if(leftArrij && rightArrij){
            if(leftArrij.com){
              out += store_var(rightArrij, leftArrij);
            }
            else if(rightArrij.com){
              out += store_var(leftArrij, rightArrij);
            }
            else{
              throw "Invalid matching(LR)";
            }
          }
        }
      }
    }
    if(out){
      tree = DATA.tree_tag("out", out);
    }
  }
  if(tree){
    self.feedback2trees(data, is, ie, tree);
  }
  else{
    throw "Invalid matching";
  }
  return self;
};
/* Ver.2.31.17 -> */
My_entry.operation.prototype.del_scope_sw = function(sw, name, scopes, opt_ids){
  var self = this;
  var _scope = self.get_scope_RE_sw(sw, name, scopes, opt_ids);
  if(_scope){
    delete _scope[name];
  }
  return _scope;
};
My_entry.operation.prototype.get_scope0_RE_sw = function(sw, name, scopes, opt_ids){
  var self = this;
  var _scope = null;
  var ids = opt_ids || [[0, 0]];  // || sentence without bracket including command
  var id0 = ids[0];
  ids = [[].concat(id0)];
  return self.get_scope_RE_sw(sw, name, scopes, ids);
};
My_entry.operation.prototype.get_scope_RE_sw = function(sw, name, scopes, opt_ids){
  var self = this;
  var _scope = null;
  var ids = opt_ids || [[0, 0]];  // || sentence without bracket including command
  if(scopes){
    var len = ids.length;
    for(var i=0; i<len; ++i){
      var idi = ids[i];
      var j = idi[0];
      var n = idi[1];
      var scope = scopes[j][n][sw];
      if(scope[name]){
        _scope = scope;
        break;
      }
    }
  }
  return _scope;
};
My_entry.operation.prototype.get_scope_SE_sw = function(sw, scopes, opt_ids){
  var self = this;
  var _scope = null;
  var ids = opt_ids || [[0, 0]];  // || sentence without bracket including command
  if(scopes){
    var id0 = ids[0];
    var j = id0[0];
    var n = id0[1];
    _scope = scopes[j][n][sw];
  }
  return _scope;
};
/* -> Ver.2.31.17 */
My_entry.operation.prototype.SEv = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var is = i0-1;
  var ie = i0+1;
  var leftTree = trees[is];
  if(i0 === 1){
    var tree = null;
    if(trees.length === 3){
      var name_var = self.get_tagVal(leftTree, "REv", "val");
      if(name_var){
        if(self.config.isEscaped(name_var)) throw "Invalid SEv("+name_var+")";  // Ver.2.27.15
        tree = trees[ie];
        if(self.get_tag(tree, "mat")){  // only matrix is stored
          var ref = self.get_tagVal(leftTree, "REv", "ref");
          if(ref){
            /* Ver.2.76.29 -> */
            /* Ver.2.31.17 -> */
            var scope = self.get_scope0_RE_sw("vars", name_var, scopes, ids);
            if(!(scope)) throw "Invalid SEv-scope("+name_var+")";  // x=(,),[x[0][0]=1,]
            var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.30.16
            /* -> Ver.2.31.17 */
            if(tree_var){
              var len_ref = ref.length;
              if(len_ref === 2 && ref[0] === Math.E){  // Ver.2.79.31
                self.store_arr_col(tree_var.mat.arr, ref, tree.mat.arr);
              }
              else if(len_ref < 3){
                self.store_arr(tree_var.mat.arr, ref, tree.mat.arr);
              }
              /* Ver.2.77.30 -> */
              else if(len_ref === 4){
                self.store_arr_area(tree_var.mat.arr, ref, tree.mat.arr);
              }
              /* -> Ver.2.77.30 */
              /* Ver.2.80.32 -> */
              else if((len_ref+1)%2 === 0){
                self.store_arr_band(tree_var.mat.arr, ref, tree.mat.arr);
              }
              /* -> Ver.2.80.32 */
              else{
                throw "Invalid substitution";
              }
              tree = tree_var;
            }
            else{
              throw "Undef var("+name_var+")";
            }
            /* -> Ver.2.76.29 */
          }
          self.store_var(name_var, tree, scopes, ids);  // Ver.2.31.17
          tree = DATA.tag("out", {name: name_var, arr: tree.mat.arr});
        }
        else{
          self.throw_tree(tree);
        }
      }
      else{
        self.SEv_pattern_matching(data, is, ie);  // Ver.2.20.6
      }
    }
    if(tree){
      --self.params.hasUndefVars;
      self.feedback2trees(data, is, ie, tree);
    }
  }
  return self;
};
/* Ver.2.32.17 -> */
My_entry.operation.prototype.tree_SEe2REe = function(tree){
  var self = this;
  var BT = self.config.BT;
  var _tree = {};
  _tree[BT.REe] = self.entry.def.newClone(tree[BT.SEe]);
  return _tree;
};
My_entry.operation.prototype.tree_REe2SEe = function(tree){
  var self = this;
  var BT = self.config.BT;
  var _tree = {};
  _tree[BT.SEe] = self.entry.def.newClone(tree[BT.REe]);
  return _tree;
};
/* Ver.2.200.46 */
My_entry.operation.prototype.inherit_ids_sw = function(sw, tree, opt_ids_upper){  // Ver.2.204.46
  var self = this;
  var isEqn = tree[sw];
  var ids_self = isEqn.ids;  // cloned ids
  if(ids_self){
    var N_pop = ids_self.length;  // pop overlapped ids
    var ids_upper = opt_ids_upper || [[0, 0]];  // Ver.2.204.46
    self.entry.def.join_arr(isEqn, "ids", ids_upper, function(arr){for(var n=0; n<N_pop; ++n){arr.pop();}});  // inherit caller-self-upper-ids
  }
  return self;
};
/* Ver.2.31.17 -> */
My_entry.operation.prototype.restore_eqn = function(name, scopes, ids, isREee){
  var self = this;
  var _tree = null;
  var eqns = self.get_scope_RE_sw("eqns", name, scopes, ids);
  if(eqns){
    var tree = eqns[name];
    var BT = self.config.BT;
    var isSEe = tree[BT.SEe];
    if(isSEe){
      _tree = self.tree_SEe2REe(tree);
      if(isREee){
        self.inherit_ids_sw(BT.REe, _tree, ids);  // Ver.2.204.46 [=<f]==>f
      }
    }
    else{
      _tree = self.entry.def.newClone(tree);
    }
  }
  return _tree;
};
/* Ver.2.30.15 name changed */
My_entry.operation.prototype.tree_no_name2restore_eqn = function(tree){
  var self = this;
  var _tree = null;
  /* Ver.2.27.15 -> */
  /* Ver.2.119.34 -> */
  var arr = self.get_tagVal(tree, "mat", "arr");
  var tree_ = (arr)? self.arr2num(arr): null;
  /* -> Ver.2.119.34 */
  if(tree_){
    var BT = self.config.BT;
    var isSEe = tree_[BT.SEe];
  /* -> Ver.2.27.15 */
    if(isSEe){
      _tree = self.tree_SEe2REe(tree_);
    }
  }
  return _tree;
};
My_entry.operation.prototype.store_eqn = function(name, tree, scopes, ids){
  var self = this;
  var eqns = self.get_scope_SE_sw("eqns", scopes, ids);
  eqns[name] = self.entry.def.newClone(tree);
  return self;
};
/* -> Ver.2.31.17 */
My_entry.operation.prototype.REe = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  var leftTree = trees[i0-1];
  var rightTree = trees[i0+1];
  if(!(leftTree)) throw "Invalid null=>";  // Ver.2.27.15
  /* add(=<a,b)=<a=>+b; add(=<2,3)=> */
  var buffer_vars = {};
  var buffer_eqns = {};
  var ids_buffer = null;
  var tree_eqn = null;
  /* Ver.2.204.46 -> */
  var isREee = (tagObj.val === "==>");
  var arr = self.get_tagVal(trees[i0-1], "mat", "arr");
  var name_eqn = self.get_tagVal(trees[(arr)? i0-2: i0-1], "REv", "val");
  /* -> Ver.2.204.46 */
  /* Ver.2.195.45 -> */
  var isNoName = !(name_eqn);
  if(isNoName && arr){
    var arr0 = self.get_tagVal(trees[i0-2], "mat", "arr");
    if(arr0){  // [f(x)=<x,f(1),[(x)=<x](1)=>];
      var tree = self.arr2num(arr0);
      var isSEe = tree[BT.SEe];  // Ver.2.200.46
      if(isSEe){
        name_eqn = "no-name";
        self.store_eqn(name_eqn, tree, scopes, ids);
      }
      else{
        throw "Invalid no-name equation";
      }
    }
  }
  var hasArgs = (name_eqn && arr);
  // initialize
  var is = (hasArgs)? i0-2: i0-1;
  var name_var = self.get_tagVal(rightTree, "REv", "val");
  var ie = (name_var)? i0+1: i0;
  var ref = (isNoName)? null: trees[is]["REv"]["ref"];
  /* -> Ver.2.195.45 */
  if(hasArgs){
    tree_eqn = self.restore_eqn(name_eqn, scopes, ids, isREee);  // Ver.2.31.17  // Ver.2.204.46
    if(!(tree_eqn)) throw "Undef eqn("+name_eqn+")";
    var isREe = tree_eqn[BT.REe];
    var args_eqn = isREe.arg;
    var len_args_eqn = (args_eqn)? args_eqn.length: 0;
    var args = self.arr2args(arr);
    var len_args = args.length;
    if(len_args_eqn === len_args){
      /* Ver.2.33.18 -> [conv(=<a_)=<last(b=4,a_=>),[a=3,conv(=<(a))==>,b]] */
      var ids_args_eqn = isREe.ids || [[0, 0]];
      var id0 = ids_args_eqn[0];  // ids[0]
      /* -> Ver.2.33.18 */
      /* Ver.2.210.46 -> */
      /* solvex_Gauss()=<[inherit scope here]=> */
      var inherit_id0 = function(){
        var N_BT = 0;
        var i_BT = -1;
        var tagName_BT = null;
        var isREeVal = isREe.val;
        var len_isREe = isREeVal.length;
        for(var i=0; i<len_isREe; ++i){
          var tagName = self.isType(isREeVal[i], "BT");
          if(tagName){
            ++N_BT;
            i_BT = i;
            tagName_BT = tagName;
          }
        }
        if(N_BT === 1){
          var tree_BT = isREe.val[i_BT];
          ids_args_eqn = tree_BT[tagName_BT].ids || ids_args_eqn;  // Ver.2.33.18
          id0 = ids_args_eqn[0];
        }
      };
      if(!(self.useScopeWith)){  // Ver.2.213.47
        inherit_id0();
      }
      /* -> Ver.2.210.46 */
      /* Ver.2.71.29 -> */
      var args_eqns = [];
      var args_vars = [];
      /* -> Ver.2.71.29 */
      ids_buffer = [[].concat(id0)];
      for(var i=0; i<len_args; ++i){
        var argi_eqn = args_eqn[i];
        var argi = args[i];
        var tree = null;  // Ver.2.71.29
        if(self.config.isEscaped(argi_eqn)){
          var name = argi_eqn.substring(1);
          if(name){  // Ver.2.215.50
            buffer_eqns[name] = self.restore_eqn(name, scopes, ids_buffer);
          }
          var isSEe = argi[BT.SEe];
          if(isSEe){
            var symbol = self.get_symbol(isSEe);
            if(symbol){
              var ids_SEe = isSEe.ids;
              var tree_symbol = self.restore_eqn(symbol, scopes, ids_SEe);
              if(tree_symbol){
                tree = self.tree_REe2SEe(tree_symbol);
              }
              else{
                throw "Undef eqn("+symbol+")";
              }
            }
            else{
              tree = argi;
            }
            if(ids_args_eqn){
              self.inherit_ids_sw(BT.SEe, tree, ids_args_eqn);  // solvex_non_linear
            }
          }
          else{
            throw "Invalid args."+name+"("+name_eqn+")";
          }
          args_eqns.push([name, tree]);  // Ver.2.71.29
        }
        else{
          var name = argi_eqn;
          if(name){  // Ver.2.215.50
            buffer_vars[name] = self.restore_var(name, scopes, ids_buffer);
          }
          var isSEe = argi[BT.SEe];
          if(isSEe){
            var tree_eqn_call = self.tree_SEe2REe(argi);
            tree = self.tree_eqn2tree_AtREe(data, tree_eqn_call);  // Ver.2.202.46
            if(!(tree && tree.mat)){
              throw "Undef args.var||eqn("+name+")";
            }
          }
          else{
            tree = DATA.num2tree(argi);
          }
          args_vars.push([name, tree]);  // Ver.2.71.29
        }
      }
      /* Ver.2.71.29 -> */
      var store_args = function(args, isVars){
        var store_sw = (isVars)? self.store_var: self.store_eqn;
        for(var i=0, len=args.length; i<len; ++i){
          var argsi = args[i];
          var name = argsi[0];
          var tree = argsi[1];
          if(tree){
            store_sw.call(self, name, tree, scopes, ids_buffer);  // .call
          }
        }
      };
      store_args(args_eqns, false);
      store_args(args_vars, true);
      /* -> Ver.2.71.29 */
    }
    else{
      throw "Invalid args.length="+len_args_eqn+"("+name_eqn+")";
    }
  }
  /* Ver.2.204.46 -> */
  else if(name_eqn && name_var){
    _tree = self.restore_eqn(name_eqn, scopes, ids, isREee);
  }
  /* -> Ver.2.204.46 */
  else{
    /* Ver.2.43.22 -> */
    if(tagName === "REv"){
      throw "Invalid null args("+name_eqn+")";
    }
    else{
      name_eqn = self.get_tagVal(leftTree, "REv", "val");
      tree_eqn = (name_eqn)? self.restore_eqn(name_eqn, scopes, ids, isREee): self.tree_no_name2restore_eqn(leftTree);  // Ver.2.31.17  // Ver.2.204.46
    }
    /* -> Ver.2.43.22 */
  }
  if(tree_eqn){
    var isREe = tree_eqn[BT.REe];  // Ver.2.200.46
    /* Ver.2.204.46 -> */
    var tree_var = null;
    var has1name = isREe && isREe.val.length === 1 && self.get_tagVal(isREe.val[0], "REv", "val");
    if(has1name){
      var ids_REe = isREe.ids;
      tree_var = self.restore_var(has1name, scopes, ids_REe);
      if(name_var){
        /* [f(x)=<x,f=>f,=<f]=>f,f(3)=> */
        tree_var = tree_var || self.restore_eqn(has1name, scopes, ids_REe, isREee);
      }
      else{
        tree_var = tree_var || self.restore_eqn(name_eqn, scopes, ids, isREee);
      }
    }
    if(tree_var){
      _tree = tree_var;
    }
    else{
      _tree = (isREe)? self.tree_eqn2tree_AtREe(data, tree_eqn): tree_eqn;  // Ver.2.20.8  // Ver.2.32.17  // Ver.2.202.46
      /* Ver.2.211.46 -> */
      var arr = _tree.mat && _tree.mat.arr;
      /* Ver.2.214.49 -> */
      var has1elem_tag = self.has1elem_tag(arr, BT.SEe);
      if(has1elem_tag){
        _tree = self.tree_SEe2REe(arr[0][0]);
      }
      /* -> Ver.2.214.49 */
      /* -> Ver.2.211.46 */
    }
    /* -> Ver.2.204.46 */
    if(hasArgs){
      for(var name in buffer_vars){
        if(name){  // check undefined
          var tree = buffer_vars[name];
          if(tree){
            self.store_var(name, tree, scopes, ids_buffer);
          }
          else if(!(self.useScopeWith)){  // Ver.2.213.47
            self.del_scope_sw("vars", name, scopes, ids_buffer);
          }
        }
      }
      for(var name in buffer_eqns){
        if(name){  // check undefined
          var tree = buffer_eqns[name];
          if(tree){
            self.store_eqn(name, tree, scopes, ids_buffer);
          }
          else if(!(self.useScopeWith)){  // Ver.2.213.47
            self.del_scope_sw("eqns", name, scopes, ids_buffer);
          }
        }
      }
    }
    /* Ver.2.174.42 -> */
    else if(self.useStrict && isREe.arg){
      throw "Invalid args.length="+isREe.arg.length+"("+name_eqn+")";
    }
    /* -> Ver.2.174.42 */
  }
  if(_tree){
    if(tagName === "REe"){
      /* a(a)=<(a,2:3,4); a[0][0](-1)=> */
      if(ref){
        _tree = self.tree2tree_ref(_tree, ref);  // Ver.2.32.17 
      }
      /* a(a)=<(a,2:3,4); a[0][0](-1)=>b; b */
      if(name_var){
        /* Ver.2.203.46 -> */
        /* Ver.2.204.46 -> */
        var tree_var = null;
        var isREe = _tree[BT.REe];
        if(isREe){
          if(isREee){
            self.inherit_ids_sw(BT.REe, _tree, ids);
          }
          tree_var = self.tree_REe2SEe(_tree);
        }
        else{
          tree_var = self.inherit_ids_AtSEe(DATA.tree2trees(_tree), ids);
        }
        /* -> Ver.2.204.46 */
        self.store_eqn(name_var, tree_var, scopes, ids);
//        _tree = DATA.tree_tag("out", "stored_eqn("+name_var+")");
        _tree = DATA.tree_num(0, 0);
        /* -> Ver.2.203.46 */
      }
      self.feedback2trees(data, is, ie, _tree);
    }
  }
  /* Ver.2.204.46 -> */
  else{
    self.throw_tree(leftTree);
  }
  /* -> Ver.2.204.46 */
  if(tagName === "REv") return _tree;
  return self;
};
/* Ver.2.31.17 */
My_entry.operation.prototype.inherit_ids_AtSEe = function(trees, opt_ids, opt_arg){  // Ver.2.209.46
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = DATA.tree_tag(BT.SEe, trees);
  _tree[BT.SEe].ids = opt_ids || [[0, 0]];  // b=1,[a=<b,=<a=>]=> || a=<b+1; [b=1,a==>]  // || reference to local storage object
  /* Ver.2.209.46 -> */
  if(opt_arg){
    _tree[BT.SEe].arg = opt_arg;  // Ver.2.32.17
  }
  /* -> Ver.2.209.46 */
  return _tree;
};
My_entry.operation.prototype.BTe =  // Ver.2.213.47  // Ver.2.213.48
My_entry.operation.prototype.SEe = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;  // Ver.2.213.48
  var len = trees.length;
  var isSEe = (tagName === "SEe");  // Ver.2.213.48
  /* Ver.2.209.46 -> */
  /* Ver.2.27.15 -> */
  var leftTree = trees[i0-1];
  var tree = trees[i0];  // Ver.2.213.48
  var rightTree = trees[i0+1];
  var hasArgs = self.isType(leftTree, "BT");  // f(x)=<x || (x)=<x
  var is = (hasArgs)? i0-2: i0-1;
  var ie = len-1;
  var name_eqn = self.get_tagVal(trees[is], "REv", "val");
  if(!(name_eqn)){
    is += 1;  // Ver.2.213.49
  }
  /* Ver.2.195.45 -> */
  var names = (hasArgs)? self.get_names(data, leftTree, true): null;  // NG: (x=1)=<x
  /* Ver.2.213.48 -> */
  if(isSEe){
    if(!(rightTree)) throw "Invalid =<null";
    var rightTrees = trees.slice(i0+1, len);
    tree = self.inherit_ids_AtSEe(rightTrees, ids, names);  // Ver.2.31.17
  }
  else if(names){
    tree[BT.SEe].arg = names;
  }
  /* -> Ver.2.213.48 */
  if(name_eqn){
    if(self.config.isEscaped(name_eqn)) throw "Invalid SEe("+name_eqn+")";  // Ver.2.27.15
    self.store_eqn(name_eqn, tree, scopes, ids);  // Ver.2.31.17
    tree = DATA.tree_tag("out", "stored_eqn("+name_eqn+")");
  }
  /* -> Ver.2.195.45 */
  /* -> Ver.2.27.15 */
  /* -> Ver.2.209.46 */
  if(tree){
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
/* -> Ver.2.32.17 */
My_entry.operation.prototype.SEans = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0;
  if(i0 === 0){
    /* Ver.2.29.15 -> pattern matching nesting enabled */
    if((self.params.hasUndefVars || 0) !== 0){
      throw "Invalid var isFound";
    }
    /* -> Ver.2.29.15 */
    if(trees.length < 2){
      var tree = DATA.trees2tree(trees);
      if(tree){
        if(tree.out){
        }
        else if(tree.mat){
          data.vars.ans = self.entry.def.newClone(tree);  // Ver.2.31.17
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
