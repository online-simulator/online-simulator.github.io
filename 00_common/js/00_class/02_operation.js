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
        "BTe"    // StorE obvious equation =< || (args)=<
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
        "BRrl",  // Binary operatoR relational === || == || <> || <<>>
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
  /* Ver.2.225.53 common reference to ids of local storage object for sentence without bracket including command */
  ids0: [[0, 0]],
  params: {
    isRelative_epsN: false,
    epsN: 1e-16,
    dxT: 1e-3,
    dxJ: 1e-5,
    dxD: 1e-3,
    NI: 100
  },
  /* Ver.2.245.57 -> */
  /* Ver.2.32.17 */
  symbol: {
    anonymous: "no-name",  // Ver.2.253.59
    escape_eqn1: "@",
    escape_eqn2: "@@"  // Ver.2.219.50
  },
  /* Ver.2.27.15 */
  isEscaped: function(name){
    return (name[0] === "$");
  },
  /* Ver.2.219.50 */
  isEscaped_eqn: function(name){
    var _num_escape = 0;
    if(name[0] === "@") _num_escape++;
    if(name[1] === "@") _num_escape++;
    return _num_escape;
  },
  /* -> Ver.2.245.57 */
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
  My_entry.def.mix_in_props(My_entry.operation, My_entry.parser, ["loop_callback"]);  // Ver.2.246.57
  self.useStrict = null;
  self.useEmpty = null;
  self.useScopeWith = null;  // Ver.2.213.47
  self.use$let = null;  // Ver.2.249.57
  self.useMutex = null;  // Ver.2.250.57
  self.arr_precedence = [];
  self.options = {};
  self.params = {};
  /* Ver.2.222.50 -> */
  self.scopes2d0 = null;
  self.scopes2d = null;
  /* -> Ver.2.222.50 */
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
/* Ver.2.227.55 */
My_entry.operation.prototype.init_scopes2d = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var scopes2d = self.entry.def.newClone(data.scopes2d);  // Ver.2.222.50
  var scope0 = scopes2d[0][0];
  /* Ver.2.226.54 -> */
  var scope = DATA.scope();
  scope0.vars = scope.vars;
  scope0.eqns = scope.eqns;
  /* -> Ver.2.226.54 */
  /* Ver.2.222.50 -> */
  for(var j=1, len=scopes2d.length; j<len; ++j){
    scopes2d[j][0] = scope0;  // common local storage including re-use of data.eqns
  }
  /* -> Ver.2.222.50 */
  self.scopes2d0 = scopes2d;
  return self;
};
My_entry.operation.prototype.prepare = function(data){
  var self = this;
  var options = data.options;
  self.switch_method(options);  // Ver.2.193.44
  /* Ver.2.24.11 -> */
  self.useStrict = options.useStrict;
  self.useEmpty = (options.checkError === 0 || options.checkError < 0)? false: true;  // Ver.2.84.32
  self.useScopeWith = options.useScopeWith;  // Ver.2.213.47
  self.use$let = options.use$let;  // Ver.2.249.57
  self.useMutex = options.useMutex;  // Ver.2.250.57
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
    hasTag["BTe"] = true;  // Ver.2.213.47  // Ver.2.228.56
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
/* Ver.2.222.50 -> original reference to scopes2d array saved */
/* Ver.2.30.17 -> original reference to local storage object saved */
My_entry.operation.prototype.clear = function(data){
  var self = this;
  return self.restore(data, true);
};
/* Ver.1.6.3 */
My_entry.operation.prototype.store = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var msg = "local storage stored";
  var scopes2d = data.scopes2d;
  self.scopes2d = self.entry.def.newClone(scopes2d);
  data.trees = DATA.trees_msg(msg);
  return self;
};
/* Ver.1.6.3 */
My_entry.operation.prototype.restore = function(data, isClear){
  var self = this;
  var DATA = self.entry.DATA;
  var msg = "null buffer";
  var scopes2d = data.scopes2d;
  var scopes2d0 = (isClear)? self.scopes2d0: self.scopes2d;
  if(scopes2d && scopes2d0){
    delete data.vars;
    delete data.eqns;
    scopes2d.length = 0;
    scopes2d.push.apply(scopes2d, self.entry.def.newClone(scopes2d0));
    var scope0 = scopes2d[0][0];
    for(var j=1, len=scopes2d.length; j<len; ++j){
      scopes2d[j][0] = scope0;
    }
    data.vars = scope0.vars;
    data.eqns = scope0.eqns;
    msg = "local storage ";
    msg += (isClear)? "cleared": "restored";
  }
  data.trees = DATA.trees_msg(msg);
  return self;
};
/* -> Ver.2.30.17 */
My_entry.operation.prototype.stop = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var msg = "operation stopped";
  self.options.isStopped = true;
  data.trees = DATA.trees_msg(msg);
  return self;
};
/* -> Ver.2.222.50 */
My_entry.operation.prototype.run = function(_data){
  var self = this;
  var trees2d = _data.trees2d;
  var scopes2d = _data.scopes2d;
  var j = 0;  // Ver.2.274.65
  try{
    self.init_scopes2d(_data);  // Ver.2.227.55
    self.prepare(_data);
    for(var len=trees2d.length; j<len; ++j){  // Ver.2.274.65
      var trees = trees2d[j];
      _data.trees = trees;
      _data.scopes = scopes2d;
      if(Array.isArray(trees)){
        self.remake_trees(_data);
        self.SEans(_data, 0);
        delete _data.eqns[self.config.symbol.anonymous];  // Ver.2.195.46  // Ver.2.253.59
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
    throw {message: e, j: j};  // Ver.2.224.50
  }
  return _data;
};
My_entry.operation.prototype.init_buffers = function(){
  var self = this;
  self.init_params();
  /* Ver.2.222.50 -> */
  self.scopes2d0 = null;
  self.scopes2d = null;
  /* -> Ver.2.222.50 */
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
  var tree_BT = trees[is];  // Ver.2.31.17
  /* Ver.2.272.63 -> */
  var tree = null;
  if(self.isEmpty_tree(tree_BT)){
    tree = DATA.tree_mat([]);
  }
  else{
    /* Ver.2.31.17 -> */
    var ids = tree_BT[tagName].ids;  // inherit_ids_AtSEe
    var newTrees = self.data2trees(self.get_newData(data, tagObj.val, ids), tagName);  // Ver.2.164.39
    /* -> Ver.2.31.17 */
    tree = self.tree2tree_mat(DATA.trees2tree(newTrees));
  }
  /* -> Ver.2.272.63 */
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
  var BT = self.config.BT;
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
  /* Ver.2.258.60 -> */
  var get_tree_mat = function(trees){
    var _tree = self.trees2tree_mat(data, trees, ids);
    /* Ver.2.158.38 -> */
    if(is0D){
      _tree = DATA.tree_mat(DATA.arr2arr00(_tree.mat.arr));
    }
    /* -> Ver.2.158.38 */
    return _tree;
  };
  var tree = get_tree_mat((options.isRightAssociativityBR)? rightTrees: leftTrees);
  var isFalse = !((DATA[sw_prop](tree.mat.arr))^islO);
  if(isFalse){
    tree = get_tree_mat((options.isRightAssociativityBR)? leftTrees: rightTrees);
  }
  /* -> Ver.2.258.60 */
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
/* Ver.2.232.56 */
My_entry.operation.prototype.check_symbol = function(symbol){
  var self = this;
  if(symbol && self.config.isEscaped(symbol)) throw "Invalid symbol("+symbol+")";
  return self;
};
/* Ver.2.229.56 */
My_entry.operation.prototype.get_symbol = function(obj, hasArgs){  // Ver.2.251.58  // Ver.2.260.61
  var self = this;
  /* Ver.2.260.61 -> */
  var prop = obj && obj.val;
  var prop0 = (prop && prop.length === 1 && prop[0]);
  var _symbol = prop0 && !(hasArgs && obj.arg) && self.get_tagVal(prop0, "REv", "val");  // Ver.2.251.58
  /* -> Ver.2.260.61 */
  self.check_symbol(_symbol);  // Ver.2.232.56
  return _symbol;
};
/* Ver.2.230.56 */
My_entry.operation.prototype.get_symbols = function(data, tree, isRow){
  var self = this;
  var BT = self.config.BT;
  var _names = [];
  var isSEe = tree[BT.SEe];
  var symbol = (isSEe)? self.get_symbol(isSEe, false): "";  // Ver.2.251.58 _e((f)=<x,1,1) -> x
  if(symbol){
    _names.push(symbol);
  }
  else{
    _names = self.get_symbols_expanded(data, tree, isRow);  // Ver.2.233.56
  }
  return _names;
};
/* Ver.2.233.56 */
My_entry.operation.prototype.get_symbols_expanded = function(data, tree, isRow){
  var self = this;
  var tree_BT = self.tree2tree_eqn(data, tree);
  var _names = self.get_names(data, tree_BT, isRow);
  return _names;
};
/* Ver.2.251.58 */
My_entry.operation.prototype.get_name = function(tree){
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _name = "";
  var isSEe = tree[BT.SEe];
  if(isSEe){
    if(isSEe.arg){
      throw "Invalid args("+isSEe.arg+")=<name";  // Ver.2.251.58 (args)=<name disabled
    }
    var isSEee = isSEe.isSEee;  // Ver.2.219.50
    var name = self.get_symbol(isSEe, false);  // Ver.2.251.58
    if(name){
      /* Ver.2.219.50 -> */
      var prefix = self.config.symbol["escape_eqn"+((isSEee)? 2: 1)];  // Ver.2.245.57
      _name = prefix+name;
      /* -> Ver.2.219.50 */
    }
  }
  else{
    _name = self.get_tagVal(tree, "REv", "val");
  }
  return _name;
};
My_entry.operation.prototype.get_name_escaped = function(tree){
  var self = this;
  var _name = "";
  var name = self.get_tagVal(tree, "REv", "val");
  if(name && self.config.isEscaped(name)){
    _name = name.substring(1);
  }
  return _name;
};
/* Ver.2.27.15 -> */
My_entry.operation.prototype.get_names = function(data, tree_BT, isRow){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _names = [];
  /* Ver.2.230.56 -> */
  var name = self.get_name(tree_BT);  // Ver.2.251.58
  if(name){
    _names.push(name);
  }
  else{
    var tree = self.tree_BT2tree(data, tree_BT);
    var arr = self.get_tagVal(tree, "mat", "arr");
  /* -> Ver.2.230.56 */
    if(isRow){
      arr = math_mat.transpose(data.options, arr);
    }
    var len_i = arr.length;
    for(var i=0; i<len_i; ++i){
      var tree = self.arr2obj_i(arr, i);
      var name = self.get_name(tree);  // Ver.2.251.58
      if(name){
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
    /* Ver.2.268.62 -> */
    var sw = "vars";
    var num_escape = self.config.isEscaped_eqn(name);
    if(num_escape){
      sw = "eqns";
      name = name.substring(num_escape);
    }
    var isEqn = (sw === "eqns");
    /* -> Ver.2.268.62 */
    if(name){
      var tree = null;
      var get_tree_sw = function(sw){
        return DATA.tree_num(((sw)? true: false), 0);  // Ver.2.196.46
      };
      switch(prop){
        /* Ver.2.268.62 -> */
        /* Ver.2.243.56 -> */
        case "hass":
          tree = get_tree_sw(self.get_scope0_RE_sw(sw, name, scopes, ids));
          break;
        /* -> Ver.2.243.56 */
        /* Ver.2.31.17 -> */
        case "has":
          tree = get_tree_sw(self.get_scope_RE_sw(sw, name, scopes, ids));
          break;
        case "add__":
          var scope = self.get_scope0_RE_sw(sw, name, scopes, ids);
          tree = get_tree_sw(scope);  // first
          if(scope){
            var tree_checked = scope[name];
            if(tree_checked){
              var tree_added = self.entry.def.newClone(tree_checked);
              if(isEqn){
                eqns[name] = tree_added;
              }
              else{
                vars[name] = tree_added;
              }
            }
          }
          break;
        /* -> Ver.2.31.17 */
        case "has__":
          var tree_checked = (isEqn)? eqns[name]: vars[name];
          tree = get_tree_sw(tree_checked);  // first
          break;
        case "del__":
          var tree_checked = (isEqn)? eqns[name]: vars[name];
          tree = get_tree_sw(tree_checked);  // first
          if(tree_checked){
            if(isEqn){
              delete eqns[name];
            }
            else{
              delete vars[name];
            }
          }
          break;
        /* -> Ver.2.268.62 */
        default:
          break;
      }
      self.feedback2trees(data, is, ie, tree);
    }
  }
  return self;
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
/* Ver.2.233.56 */
My_entry.operation.prototype.FNmhX = function(data, rightArr, tagObj, len_j0, msgErr, callback_names, callback_FNmh){  // Ver.2.234.56 isOverwrite deleted
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > len_j0){  // Ver.2.233.56
    /* Ver.2.225.53 -> */
    var id0 = (ids || self.config.ids0)[0];
    var ids_buffer = [id0];
    /* -> Ver.2.225.53 */
    /* Ver.2.231.56 -> */
    var tree_eqn = null;
    var tree_eqn = (callback_FNmh)? self.tree2tree_eqn(data, args[0]): args[0];
    var args_eqn = self.get_args(tree_eqn);
    var name_arg = (args_eqn)? args_eqn[args_eqn.length-1]: "";
    var name_bar = tagObj.val.name;
    /* -> Ver.2.231.56 */
    if(callback_FNmh){
      var obj = callback_names(args, args_eqn, name_arg, name_bar);  // Ver.2.233.56
      var name_var = obj.name_var;
      var names = obj.names;
      var buffer_vars = {};
      buffer_vars[name_var] = self.restore_var(name_var, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53  // Ver.2.256.59
      names.forEach(function(name){
        if(name){  // Ver.2.215.50
          buffer_vars[name] = self.restore_var(name, scopes, ids_buffer);  // Ver.2.226.55
        }
      });
      _tree = callback_FNmh(args, ids_buffer, name_var, names, tree_eqn);  // Ver.2.233.56
      self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer, true);  // Ver.2.256.59
    }
    else{
      _tree = callback_names(args, args_eqn, name_arg, name_bar);  // Ver.2.233.56
    }
  }
  else{
    throw msgErr;
  }
  return _tree;
};
My_entry.operation.prototype.jacobian = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var BT = self.config.BT;  // Ver.2.230.56
  var _tree = null;
  var prop = tagObj.val;
  prop = (prop && prop.key)? prop.key: prop;  // Ver.2.233.56
  var msgErr = "Invalid "+prop+" arguments";  // Ver.2.233.56
  /* Ver.2.21.10 -> */
  /* Ver.2.234.56 -> */
  var init_x0 = function(arr, names, ids_buffer){  // Ver.2.233.56
    var _x0 = [];
    var len_i = names.length;  // Ver.2.233.56
    for(var i=0; i<len_i; ++i){
      var name_var = names[i];
      var num = self.arr2obj_i(arr, i);
      if(num.com){
        self.store_var(name_var, DATA.num2tree(num), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
      }
      else{
        self.throw_tree(num);
      }
      _x0[i] = num;
    }
    return _x0;
  };
  var update_x0 = function(names, ids_buffer){  // Ver.2.233.56  // Ver.2.234.56
    var _x0 = [];
    var len_i = names.length;  // Ver.2.233.56
    for(var i=0; i<len_i; ++i){
      var name_var = names[i];
      var tree_var = self.restore_var(name_var, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
      _x0[i] = self.arr2num(tree_var.mat.arr);
    }
    return _x0;
  };
  /* -> Ver.2.234.56 */
  /* Ver.2.237.56 -> */
  var isRow = true;  // default: hasArgs=true
  var get_names = function(argj){
    var names_col = self.get_symbols_expanded(data, argj);
    var names_row = self.get_symbols_expanded(data, argj, true);
    isRow = (names_row.length > names_col.length);
    return ((isRow)? names_row: names_col);
  };
  var get_arr_x = function(argj, len_i){  // Ver.2.233.56  // Ver.2.237.56
    var _arr_x = null;
    var tree = self.tree_eqn2tree(data, self.tree2tree_eqn(data, argj));  // Ver.2.233.56
    if(tree.mat){
      _arr_x = tree.mat.arr;
    }
    else{
      throw msgErr;
    }
    var len_xi = _arr_x.length;
    var len_xj = _arr_x[len_xi-1].length;
    if(len_xi === len_i){
      isRow = false;
    }
    else if(len_xj === len_i){
      isRow = true;
      _arr_x = DATA.vec2arr(_arr_x[len_xi-1]);
    }
    else{
      throw msgErr;
    }
    return _arr_x;
  };
  /* -> Ver.2.237.56 */
  var make_get_f_from_arr_f0 = function(arr_f0, len_i, i0, j0){
    var _get_f = null;
    /* Ver.1.5.3 -> f<={A(x)=b} */
    var len_fi = arr_f0.length;
    var len_fj = arr_f0[len_fi-1].length;
    if(len_fi === len_i){
      isRow = false;  // Ver.2.237.56
      _get_f = function(arr_f, i){
        return self.arr2obj_i(arr_f, i);
      };
    }
    /* Ver.2.237.56 -> */
    else if(len_fj === len_i){
      isRow = true;
      _get_f = function(arr_f, i){
        return arr_f[len_fi-1][i];
      };
    }
    /* -> Ver.2.237.56 */
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
/* Ver.2.230.56 -> */
if(prop === "EX"){  // symbolic
  var callback_names = function(args, args_eqn, name_arg, name_bar){  // Ver.2.233.56
    /* Ver.2.27.15 -> */
    var names = self.get_symbols(data, args[0]);  // Ver.2.230.56  // Ver.2.231.56
    if(!(names.length)) throw msgErr;
    /* -> Ver.2.27.15 */
    var name_var = names[names.length-1];
    self.check_symbol(name_var);  // Ver.2.29.15  // Ver.2.232.56
    var name_eqn = name_arg || name_bar;
    /* Ver.2.268.62 -> */
    var num_escape = self.config.isEscaped_eqn(name_eqn);
    if(num_escape){
      name_eqn = name_eqn.substring(num_escape);
    }
    /* -> Ver.2.268.62 */
    if(!(name_eqn) || (name_arg && name_bar) || (args_eqn && args_eqn.length !== 1)) throw msgErr;
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
    return _tree;
  };
  _tree = self.FNmhX(data, rightArr, tagObj, 2, msgErr, callback_names, null);  // Ver.2.233.56
}
else if(prop === "OX" || prop === "TX"){  // ODE  // Ver.2.23.11  // Ver.2.231.56  // Ver.2.233.56  // Ver.2.238.56
  var isTX = (prop === "TX");  // Ver.2.238.56
  var callback_names = function(args, args_eqn, name_arg, name_bar){  // Ver.2.233.56
    /* Ver.2.238.56 -> */
    /* Ver.2.27.15 -> */
    /* Ver.2.231.56 -> */
    var name_arg = "";
    var names = null;
    if(args_eqn){
      if(isTX){
        name_arg = args_eqn[0];
      }
      else{
        name_arg = args_eqn.shift();
        if(args_eqn.length === 0){
          args_eqn = null;
        }
      }
      names = args_eqn || get_names(args[1]);  // Ver.2.233.56  // Ver.2.237.56
    }
    else{
      names = get_names(args[1]);  // Ver.2.233.56  // Ver.2.237.56
      if(isTX){
        name_arg = names[0];
      }
    }
    var name_var = name_arg || name_bar;
    if(!(name_var) || (name_arg && name_bar)) throw msgErr;
    self.check_symbol(name_var);  // Ver.2.29.15  // Ver.2.232.56
    /* -> Ver.2.231.56 */
    if(!(names.length)) throw msgErr;
    /* -> Ver.2.27.15 */
    /* -> Ver.2.238.56 */
    return {name_var: name_var, names: names};  // Ver.2.233.56
  };
  var callback_FNmh = function(args, ids_buffer, name_var, names, tree_eqn){  // Ver.2.233.56
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    var arg2 = args[2];  // Ver.2.233.56
    if(arg2 && !(arg2.com)){  // Ver.2.233.56
      arr_x = get_arr_x(arg2, len_i);  // Ver.2.233.56  // Ver.2.237.56
    }
    if(!(arr_x)){
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    /* Ver.2.238.56 -> */
    var t0ini = null;
    if(isTX){
      t0ini = (arr_x.shift())[0];
      names.shift();
    }
    else{
      t0ini = args[3] || DATA.num(0, 0);  // Ver.2.234.56
    }
    var t0 = t0ini;  // Ver.2.234.56
    len_i = names.length;  // tree_eqn change allowed
    // dt
    var dt = args[(isTX)? 3: 4] || DATA.num(self.options.dxT, 0);
    /* Ver.2.29.15 -> */
    // Niteration
    var argN = args[(isTX)? 4: 5];
    /* -> Ver.2.238.56 */
    var Niteration = (argN && argN.com)? Math.round(argN.com.r): 1;  // 0 enabled  // Ver.2.205.46 floor -> round
    /* -> Ver.2.29.15 */
    // orderT
    var orderT = (options.orderT === 2)? 2: 4;
    // x0
    var x0 = init_x0(arr_x, names, ids_buffer);  // Ver.2.233.56
    // functions
    var get_dt = function(kcr){
      return unit["BRm"](options, dt, DATA.num(kcr, 0));
    };
    var store_t = function(dt){
      var t = (dt)? unit["BRa"](options, t0, dt): t0;
      self.store_var(name_var, DATA.num2tree(t), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
    };
    var store_x = function(x){
      for(var i=0; i<len_i; ++i){
        self.store_var(names[i], DATA.num2tree(x[i]), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
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
      t0 = unit["BRa"](options, t0ini, unit["BRm"](options, DATA.num(n+1, 0), dt));  // Ver.2.234.56 t0ini+Niteration*dt not returned
      x0 = update_x0(names, ids_buffer);  // Ver.2.233.56  // Ver.2.234.56
    }
    if(isTX){
      vec.unshift(t0);  // Ver.2.238.56 t0 returned
    }
    _tree = DATA.tree_mat(DATA.vec2arr(vec, isRow));  // Ver.2.237.56
    /* -> Ver.2.29.15 */
    return _tree;
  };
  _tree = self.FNmhX(data, rightArr, tagObj, 0, msgErr, callback_names, callback_FNmh);  // Ver.2.233.56  // Ver.2.234.56
}
else{
  var isNewtonian = (prop === "newtonian");
  var callback_names = function(args, args_eqn, name_arg, name_bar){  // Ver.2.233.56
    /* Ver.2.27.15 -> */
    /* Ver.2.231.56 -> */
    var names = args_eqn || get_names(args[1]);  // Ver.2.233.56  // Ver.2.237.56
    /* -> Ver.2.231.56 */
    if(!(names.length)) throw msgErr;
    /* -> Ver.2.27.15 */
    return {names: names};  // Ver.2.233.56
  };
  var callback_FNmh = function(args, ids_buffer, name_var, names, tree_eqn){  // Ver.2.233.56
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    var arg2 = args[2];  // Ver.2.233.56
    if(arg2 && !(arg2.com)){  // Ver.2.233.56
      arr_x = get_arr_x(arg2, len_i);  // Ver.2.233.56  // Ver.2.237.56
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
    var x0 = init_x0(arr_x, names, ids_buffer);  // Ver.2.233.56
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
          self.store_var(name_var, DATA.num2tree(num), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
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
      _tree = DATA.tree_mat(DATA.vec2arr(x0, isRow));  // initialize
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
          self.store_var(name_var, DATA.num2tree(unit["BRs"](options, x0[i], mdxi)), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        }
        // update
        x0 = update_x0(names, ids_buffer);  // Ver.2.233.56  // Ver.2.234.56
        // check convergence
        var isBreak = false;  // Ver.2.271.62
        if(isRelative_epsN){
          // relative error
          var normdx = math_mat.normc(options, arr_mdx);  // Ver.2.237.56
          var normx0 = math_mat.normc(options, DATA.vec2arr(x0));  // Ver.2.237.56 x0: vectorc
          if(self.arr2num(normdx).com.r < epsN*self.arr2num(normx0).com.r){
            isBreak = true;  // Ver.2.271.62
          }
        }
        else{
          // absolute error
          var normdx = math_mat.normc(options, arr_mdx);  // Ver.2.237.56
          if(self.arr2num(normdx).com.r < epsN){
            isBreak = true;  // Ver.2.271.62
          }
        }
        if(isBreak) break;  // last to share static_scopes2d_array  // Ver.2.271.62
      }
      if(arr_mdx){
        if(options.checkError && argN && argN.com){
          for(var i=0; i<len_i; ++i){
            var name_var = names[i];
            var mdxi = self.arr2obj_i(arr_mdx, i);
            var x0ie = x0[i].err;
            x0ie.r = Math.max(Math.abs(mdxi.com.r), x0ie.r);
            x0ie.i = Math.max(Math.abs(mdxi.com.i), x0ie.i);
          }
        }
        _tree = DATA.tree_mat(DATA.vec2arr(x0, isRow));  // Ver.2.234.56  // Ver.2.237.56
      }
    }
    else{
      step();
    /* -> Ver.2.29.15 */
      _tree = DATA.tree_mat(J);
    }
    return _tree;
  };
  _tree = self.FNmhX(data, rightArr, tagObj, 0, msgErr, callback_names, callback_FNmh);  // Ver.2.233.56  // Ver.2.234.56
}
/* -> Ver.2.230.56 */
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
/* Ver.2.231.56 -> */
My_entry.operation.prototype.get_args = function(tree){
  var self = this;
  var BT = self.config.BT;
  var _args = null;
  var isSEe = tree[BT.SEe];
  var isREe = tree[BT.REe];
  if(isSEe){
    _args = isSEe.arg;
  }
  else if(isREe){
    _args = isREe.arg;
  }
  return _args;
};
/* Ver.2.251.57 -> */
My_entry.operation.prototype.tree2tree_SEe = function(tree){
  var self = this;
  var BT = self.config.BT;
  var arr = self.get_tagVal(tree, "mat", "arr");
  return ((self.has1elem_tag(arr, BT.SEe))? arr[0][0]: null);
};
My_entry.operation.prototype.tree2tree_eqn = function(data, tree){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var BT = self.config.BT;
  /* Ver.2.260.61 -> */
  var _tree = null;
  var isMat = tree.mat;
  var get_tree_SEe2tree_eqn = function(tree){
    var msgErr = (isMat)? "": "Invalid =<Call-by-Equation";
    var _tree = self.restore_eqn_tree(tree, scopes, null, null, null, true, msgErr);
    return _tree;
  };
  if(isMat){
    var tree_SEe = self.tree2tree_SEe(tree);
    if(tree_SEe){
      _tree = get_tree_SEe2tree_eqn(tree_SEe);  // =<f || =<f(x)=> -> tree_eqn
    }
    else{
      _tree = tree;
    }
  }
  else{  // nesting NG: =<(x)=<f(x)
    _tree = get_tree_SEe2tree_eqn(tree);  // (args)=<tree_eqn || ()=<tree_eqn
  }
  /* -> Ver.2.260.61 */
  return _tree;
};
My_entry.operation.prototype.tree2tree_eqn_AtREe = function(data, tree, isREee){  // Ver.2.253.59 independent of names
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var BT = self.config.BT;
  var _tree = null;  // Ver.2.253.59
  /* Ver.2.204.46 -> */
  var isREe = tree[BT.REe];  // Ver.2.200.46
  var isSEe_arr = tree.mat && self.has1elem_tag(tree.mat.arr, BT.SEe);  // Ver.2.255.59
  if(isREe){
    /* f(x)=<[(x)=<a*x](x)=>,make_g(a0)=<[a=a0,=<=<f]=>,a=1,make_g(-a)=>g,g(3)=> */
    /* make_g(a0)=<[a=a0,f(x)=<[(x)=<a*x](x)=>,=<f]=>,a=1,make_g(-a)=>g,g(3)=> */
    /* Ver.2.260.61 -> */
    var withVar = true;
    var callback_AtREe = function(){
      return self.tree2tree_eqn(data, self.tree_eqn2tree_AtREe(data, tree));
    };
    /* -> Ver.2.260.61 */
    _tree = self.restore_eqn_tree(tree, scopes, null, isREee, withVar, callback_AtREe);  // Ver.2.20.8  // Ver.2.32.17  // Ver.2.202.46  // Ver.2.211.46  // Ver.2.214.49  // Ver.2.229.56  // Ver.2.231.56  // Ver.2.253.59  // Ver.2.260.61
  }
  /* Ver.2.255.59 -> */
  else if(isSEe_arr){
    /* f(x)=<x,g(x)=<-x,h(x)=<x*x; A=<((x)=<x,(x)=<-x,(x)=<x*x:=<f,=<g,=<h); A[0][1]=>f,f(3)=>:A[1][1]=>f,f(3)=>; */
    var tree_REe = self.tree_SEe2REe(tree.mat.arr[0][0]);
    _tree = (self.get_symbol(isSEe_arr, true))? self.tree2tree_eqn_AtREe(data, tree_REe, isREee): tree_REe;
  }
  /* -> Ver.2.255.59 */
  else{
    _tree = tree;  // Ver.2.253.59
  }
  /* -> Ver.2.204.46 */
  /* Ver.2.253.59 -> */
  var isREe = _tree[BT.REe];
  if(isREe && isREee){
    self.inherit_ids_sw(BT.REe, _tree, ids);
  }
  /* -> Ver.2.253.59 */
  return _tree;
};
/* -> Ver.2.251.57 */
My_entry.operation.prototype.FNhX = function(data, rightArr, tagObj, len_j0, callback_FNh, isRX){  // Ver.2.242.56
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var _tree = null;
  var args = self.arr2args(rightArr);
  var len_j = args.length;
  if(len_j > len_j0){  // Ver.2.231.56
    /* Ver.2.225.53 -> */
    var id0 = (ids || self.config.ids0)[0];
    var ids_buffer = [id0];
    /* -> Ver.2.225.53 */
    /* Ver.2.231.56 -> */
    var tree_eqn = null;
    var tree_eqn = self.tree2tree_eqn(data, args[0]);
    var args_eqn = self.get_args(tree_eqn);
    var name_arg = (args_eqn)? args_eqn[args_eqn.length-1]: "";
    var name_bar = tagObj.val.name;
    var name_var = name_arg || name_bar;
    /* Ver.2.242.56 -> */
    var hasBooking = (name_arg && name_bar);
    if(isRX){
      if(hasBooking || (args_eqn && args_eqn.length > 1)) throw "Invalid RX(=<args.length<=1)";
    }
    else{
      if(!(name_var) || hasBooking || (args_eqn && args_eqn.length !== 1)) throw "Invalid FNh(=<args.length=1)";
    }
    /* -> Ver.2.242.56 */
    /* -> Ver.2.231.56 */
    /* Ver.2.256.59 -> */
    var buffer_vars = {};
    if(name_var){
      buffer_vars[name_var] = self.restore_var(name_var, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53  // Ver.2.242.56
    }
    /* -> Ver.2.256.59 */
    _tree = callback_FNh(args, ids_buffer, name_var, tree_eqn);  // Ver.2.231.56  // Ver.2.234.56 tree_var deleted
    self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer, true);  // Ver.2.256.59
  }
  return _tree;
};
/* -> Ver.2.231.56 */
My_entry.operation.prototype.RX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    var tree = self.tree_eqn2tree_AtREe(data, args[1]);  // Ver.2.271.62
    var b = args[2];
    if(tree && b.com){  // Ver.2.271.62
      var br = Math.round(b.com.r);  // Ver.2.205.46 floor -> round
      /* Ver.2.30.15 -> */
      var arg3 = args[3];
      var tree_eqn_break = (arg3)? self.tree2tree_eqn(data, arg3): null;
      var RX = (tree_eqn_break)?
        function(callback){
          for(var i=1; i<=br; ++i){  // i=1
            if(callback(i)) break;  // Ver.2.271.62
          }
        }:
        function(callback){
          for(var i=1; i<=br; ++i){  // i=1
            callback(i);
          }
        };
      /* -> Ver.2.30.15 */
      RX(function(i){
        var _isBreak = false;  // Ver.2.271.62
        self.store_var(name_var, tree, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        tree = self.tree_eqn2tree(data, tree_eqn);  // deep-copy
        /* Ver.2.271.62 -> */
        if(tree_eqn_break){  // last to share static_scopes2d_array
          var tree_break_last = self.tree_eqn2tree_AtREe(data, tree_eqn_break);  // not-cloned
          var num = DATA.tree2num(tree_break_last);
          if(num && num.com.r){
            _isBreak = true;
          }
        }
        return _isBreak;
        /* -> Ver.2.271.62 */
      });
      _tree = tree;
    }
    return _tree;
  };
  return self.FNhX(data, rightArr, tagObj, 2, callback_FNh, true);  // Ver.2.231.56  // Ver.2.242.56
};
My_entry.operation.prototype.DX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    /* Ver.1.3.1 */
    var a = args[2];
    /* Ver.2.234.56 -> */
    if(!a){
      var tree_var = self.restore_var(name_var, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
      a = (tree_var)? self.arr2num(tree_var.mat.arr): null;
    }
    /* -> Ver.2.234.56 */
    if(a && a.com){
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
        self.store_var(name_var, DATA.num2tree(get_newX(x, cr, ci)), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
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
    return _tree;
  };
  return self.FNhX(data, rightArr, tagObj, 0, callback_FNh);  // Ver.2.231.56
};
My_entry.operation.prototype.IX = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
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
      var calc_f = function(cr, ci){
        self.store_var(name_var, DATA.tree_num(cr, ci), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
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
    }
    return _tree;
  };
  return self.FNhX(data, rightArr, tagObj, 2, callback_FNh);  // Ver.2.231.56
};
My_entry.operation.prototype.PX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
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
      var tagName = "BRdm";  // Ver.1.5.3
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      PX(function(i){
        self.store_var(name_var, DATA.tree_num(i, 0), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.Imat_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
    }
    return _tree;
  };
  return self.FNhX(data, rightArr, tagObj, 2, callback_FNh);  // Ver.2.231.56
};
My_entry.operation.prototype.SX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    var a = args[1];
    var b = args[2];
    if(a.com && b.com){
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
      var tagName = "BRsa";
      var centerTree = DATA.tree_tag(tagName, sign);
      var tagObj = centerTree[tagName];
      var leftTree = null;
      SX(function(i){
        self.store_var(name_var, DATA.tree_num(i, 0), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        var rightTree = self.tree_eqn2tree(data, tree_eqn);
        leftTree = leftTree || DATA.tree_mat(math_mat.zeros2d_arr(rightTree.mat.arr));
        leftTree = self.arr_tree2tree(data, 1, tagName, tagObj, [leftTree, centerTree, rightTree]);
      });
      _tree = leftTree;
    }
    return _tree;
  };
  return self.FNhX(data, rightArr, tagObj, 2, callback_FNh);  // Ver.2.231.56
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
  var tree = null;  // Ver.2.272.63
  var is = i0;
  var ie = i0+1;
  /* Ver.2.30.15 -> */
  var prop = tagObj.val;
  var isFN0 = (prop === "random");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
if(rightArr){
  var len_i = rightArr.length;
  if(isFN0){
    if(len_i) throw "Invalid args.length=0(random)";  // Ver.2.272.63
    tree = DATA.tree_num(Math[prop](), 0);
  }
  else{
  /* -> Ver.2.30.15 */
    /* Ver.2.74.29 -> */
    /* Ver.2.73.29 -> */
    var i_sw = (options.useMatrix && len_i > 1)? 0: len_i-1;
    var arr = [];
    for(var i=i_sw; i<len_i; ++i){
      var args = rightArr[i];
      arr.push([unit[tagName].apply(unit, [prop, options].concat(args))]);  // arguments.length < O(10000)
    }
    tree = DATA.tree_mat(arr);
    /* -> Ver.2.73.29 */
    /* -> Ver.2.74.29 */
  }
}
  if(tree){
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
/* Ver.2.257.59 */
My_entry.operation.prototype.store4URh_sw = function(data, num_escape, name, argi, scopes, ids_buffer){  // Ver.2.257.60
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  if(num_escape){
    var isSEe = argi[BT.SEe];
    if(isSEe){
      var tree = self.tree_eqn2tree_AtSEe(data, argi);  // Ver.2.255.59  // Ver.2.257.60 inherit_ids not-supported
      self.store_eqn(name, tree, scopes, ids_buffer);
    }
    else{
      throw "Invalid URh-args."+name;
    }
  }
  else{
    self.store_var(name, DATA.num2tree(argi), scopes, ids_buffer);  // Ver.2.226.55
  }
  return self;
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
  var tree_eqn = self.tree2tree_eqn(data, rightTree);  // Ver.2.229.56  // Ver.2.231.56
  var args_eqn = self.get_args(tree_eqn);  // Ver.2.251.57
  if(leftArr && args_eqn){
    /* Ver.2.226.55 -> */
    var id0 = (ids || self.config.ids0)[0];
    var ids_buffer = [id0];
    /* -> Ver.2.226.55 */
    var sw_names = ["x", "i", "j", "s"];
    /* Ver.2.257.59 -> */
    var name_x = args_eqn[0];
    var num_escape = self.config.isEscaped_eqn(name_x);
    if(num_escape){
      name_x = name_x.substring(num_escape);
    }
    var names = {
      x: name_x,
    /* -> Ver.2.257.59 */
      i: args_eqn[1],  // Ver.2.215.50
      j: args_eqn[2],  // Ver.2.215.50
      s: args_eqn[3]  // Ver.2.215.50
    };
    var buffer_vars = {};
    var buffer_eqns = {};  // Ver.2.257.59
    sw_names.forEach(function(sw){
      var name = names[sw];
      if(name){  // Ver.2.215.50
        buffer_vars[name] = self.restore_var(name, scopes, ids_buffer);  // Ver.2.226.55
      }
    });
    buffer_eqns[name_x] = self.tree_REe2SEe(self.restore_eqn(name_x, scopes, ids_buffer));  // Ver.2.257.59  // Ver.2.273.65
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
    /* Ver.2.263.62 -> */
    else if(dot_prop === "filter0"){
      _arr = [[]];
      callback = function(_arr, arr, arr_, i, j){
        if(!(DATA.isStrictFalse_arr(arr_))){
          _arr[0].push(arr[i][j]);
        }
      };
    }
    /* -> Ver.2.263.62 */
    if(names.s){  // Ver.2.215.50
      self.store_var(names.s, leftTree, scopes, ids_buffer);  // clone  // Ver.2.226.55
    }
    for(var i=0; i<len_i; ++i){
      if(names.i){  // Ver.2.215.50
        self.store_var(names.i, DATA.tree_num(i, 0), scopes, ids_buffer);  // Ver.2.226.55
      }
      for(var j=0; j<len_j; ++j){
        if(names.j){  // Ver.2.215.50
          self.store_var(names.j, DATA.tree_num(j, 0), scopes, ids_buffer);  // Ver.2.226.55
        }
        self.store4URh_sw(data, num_escape, names.x, arr[i][j], scopes, ids_buffer);  // Ver.2.257.59  // Ver.2.257.60
        callback(_arr, arr, self.tree_eqn2tree(data, tree_eqn).mat.arr, i, j);
      }
    }
    if(dot_prop === "filter" || dot_prop === "filter0"){  // Ver.2.263.62
      _arr = DATA.arr2arri_NaN(_arr);  // Ver.2.217.50
    }
    _tree = DATA.tree_mat(_arr);
    self.store_buffer_sw("eqns", buffer_eqns, scopes, ids_buffer, true);  // Ver.2.257.59
    self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer, true);  // Ver.2.256.59
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
/* Ver.2.261.61 id_tree=1~ filtering */
/* Ver.2.254.59 escape -> constant */
/* Ver.2.249.57 */
My_entry.operation.prototype.inherit_constant = function(sw, name, scopes, ids, tree, opt_isEscaped){
  var self = this;
  var isEscaped = (typeof opt_isEscaped === "undefined")? self.use$let: opt_isEscaped;
  var isConstant = (self.use$let)? !(isEscaped): isEscaped;  // Ver.2.254.59
  /* Ver.2.261.61 -> */
  var tagName = Object.keys(tree)[0];
  var obj = tree[tagName];
  var scope = self.get_scope0_RE_sw(sw, name, scopes, ids);
  if(scope){
    var tree0 = scope[name];
    var tagName0 = Object.keys(tree0)[0];
    var obj0 = tree0[tagName0];
    var isConstant0 = obj0.isConstant;  // Ver.2.254.59
    var check_error = function(){
      var get_msgErr = function(i){
        var sw_tagName = (sw === "eqns")? "SEe": "SEv";
        return "Invalid "+sw_tagName+"-scope-"+["duplicate", "existed", "const"][i]+"("+name+")";
      };
      if(isConstant0 && isConstant){  // Ver.2.254.59
        throw get_msgErr(0);
      }
      else{
        if(isConstant0){
          throw get_msgErr((isConstant)? 1: 2);
        }
        else if(isConstant){  // Ver.2.254.59
          throw get_msgErr(1);
        }
      }
    };
    var isDefine_id = (obj.id === obj0.id);
    if(!(isDefine_id)){
      check_error();
    }
    isConstant = isConstant0;  // Ver.2.254.59
  }
  obj.isConstant = isConstant;  // Ver.2.254.59
  /* -> Ver.2.261.61 */
  return self;
};
/* Ver.2.262.62 */
My_entry.operation.prototype.inherit_id_tree = function(left, right){
  var self = this;
  var DATA = self.entry.DATA;  // Ver.2.276.65
  DATA.setProp_tree(left, "id", self.get_tagVal(right, "REv", "id"));  // Ver.2.276.65
  return self;
};
/* Ver.2.31.17 -> */
My_entry.operation.prototype.restore_var = function(name, scopes, ids){
  var self = this;
  var _tree = null;
  var vars = self.get_scope_RE_sw("vars", name, scopes, ids);
  if(vars){
    var tree = vars[name];
    _tree = (tree)? self.entry.def.newClone(tree): null;  // separate from trees  // clone for concatination x=2;(x,2x:3x,4x)
  }
  return _tree;
};
My_entry.operation.prototype.store_var = function(name, tree, scopes, ids, isEscaped){  // Ver.2.249.57
  var self = this;
  /* Ver.2.250.57 -> */
  if(self.useMutex && self.get_scope0_RE_sw("eqns", name, scopes, ids)){
    throw "Invalid SEv-scope-mutex("+name+")";
  }
  /* -> Ver.2.250.57 */
  self.inherit_constant("vars", name, scopes, ids, tree, isEscaped);  // Ver.2.249.57  // Ver.2.254.59
  var vars = self.get_scope_SE_sw("vars", scopes, ids);
  vars[name] = tree;  // Ver.2.266.62
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
/* Ver.2.255.59 -> */
/* Ver.2.202.46 arguments arranged */
/* Ver.2.194.45 isLocked_eqns deleted */
/* Ver.2.32.17 clear; add(A,=<B)=<[A+B=>],A=(,:,),B=<(,:,),add[0](=<A,=<B) */
/* Ver.2.20.8 */
My_entry.operation.prototype.tree_eqn2tree_AtREe = function(data, tree_eqn, opt_name){  // Ver.2.271.62
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  var isNum = tree_eqn.com;
  var isSEe = tree_eqn[BT.SEe];
  if(isNum){
    _tree = DATA.num2tree(tree_eqn);
  }
  else{
    _tree = (isSEe)? self.tree_SEe2REe(tree_eqn): tree_eqn;
    _tree = self.tree_eqn2tree(data, _tree, true);
  }
  /* Ver.2.271.62 -> */
  if(opt_name){
    if(_tree && _tree.mat){
      var arr = _tree.mat.arr;
      if(DATA.hasVar_arr(arr)) throw "Invalid matching var("+opt_name+")";
    }
    else{
      throw "Undef args.var||eqn("+opt_name+")";  // Ver.2.255.59
    }
  }
  /* -> Ver.2.271.62 */
  return _tree;
};
My_entry.operation.prototype.tree_eqn2tree_AtSEe = function(data, tree_eqn, opt_ids_SEe){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var BT = self.config.BT;
  var _tree = null;
  var isSEe = tree_eqn[BT.SEe];
  if(isSEe){
    var tree_REe = self.restore_eqn_tree(tree_eqn, scopes, null, null, null, null, true);  // Ver.2.260.61
    if(tree_REe){
      _tree = self.tree_REe2SEe(tree_REe);  // Ver.2.260.61  // Ver.2.266.62
    }
    else{
      _tree = tree_eqn;
    }
    var ids_SEe = opt_ids_SEe;
    if(ids_SEe){
      self.inherit_ids_sw(BT.SEe, _tree, ids_SEe);  // solvex_non_linear
    }
  }
  return _tree;
};
/* -> Ver.2.255.59 */
My_entry.operation.prototype.tree2tree_ref = function(tree, ref, isREv){  // Ver.2.277.65
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;  // Ver.2.277.65
  var _tree = null;
  var arr = self.get_tagVal(tree, "mat", "arr");
  if(arr){
    /* Ver.2.277.65 -> */
    var arr_ref = self.restore_arr(arr, ref);
    _tree = DATA.tree_mat(arr_ref);
    if(isREv){
      var isSEe_arr = self.has1elem_tag(arr_ref, BT.SEe);  // Ver.2.255.59
      if(isSEe_arr){
        _tree = self.tree2tree_SEe(_tree);
      }
    }
    /* -> Ver.2.277.65 */
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
  var BT = self.config.BT;
  var rightTree = trees[i0+1];  // Ver.2.272.63
  var is = i0;
  var ie = i0;
  var isStorE = function(tree){
    return (self.get_tag(tree, "BRe") || self.get_tag(tree, "SEe"));
  };
  var ref = trees[is]["REv"]["ref"];
  var tree = null;
  var isSE = (i0 === 0 && isStorE(rightTree));  // Ver.2.272.63
  /* Ver.2.260.61 -> */
  var name = tagObj.val;
  if(!(isSE) && !(self.config.isEscaped(name))){  // Ver.2.260.61
    tree = (self.useStrict)? self.restore_var(name, scopes, ids): self.restore_eqn(name, scopes, ids, null, true);  // Ver.2.260.61
    /* Ver.2.24.11 -> */
    if(tree){
      /* Ver.2.20.8 -> */
      var isREe = tree[BT.REe];
      if(isREe){
        var isCall = rightTree && (isREe.arg || self.isEmpty_tree(rightTree));  // Ver.2.247.57  // Ver.2.272.63  // Ver.2.273.64
        if(isCall){  // Ver.2.272.63
          tree = self.REe(data, i0+2, tagName, tagObj);  // Ver.2.32.17
          if(tree){
            ie = i0+1;
          }
        }
        else{
//          tree = self.tree_eqn2tree_AtREe(data, tree);  // Ver.2.202.46  // Ver.2.275.65 auto-run disabled
//          throw "Invalid call("+name+")";  // last{set_x=<(x=1),x=0,set_x,x} -> error  // Ver.2.275.65 pending
          tree = self.tree_REe2SEe(tree);  // last{set_x=<(x=1),x=0,set_x,x} -> 0  // Ver.2.275.65
        }
      }
      /* -> Ver.2.20.8 */
    }
    /* -> Ver.2.24.11 */
  }
  /* -> Ver.2.260.61 */
  if(tree){
    if(ref){
      tree = self.tree2tree_ref(tree, ref, true);  // Ver.2.277.65
    }
    DATA.setProp_tree(tree, "isREv", true);  // Ver.2.276.65  // Ver.2.277.65 last to support isSEe@SEv
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
  var BT = self.config.BT;  // Ver.2.269.62
  var tree = null;
  var leftArr = self.get_tagVal(trees[is], "mat", "arr");
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  var store_elem = function(leftArrij, rightObj){  // Ver.2.269.62
    var _out = "";
    /* Ver.2.269.62 -> */
    var isSEe = rightObj[BT.SEe];
    if(isSEe && isSEe.arg) throw "Invalid args isFound("+isSEe.arg+")";
    /* -> Ver.2.269.62 */
    var name_var = self.get_tagVal(leftArrij, "REv", "val");
    if(name_var){
      var name_var_escaped = self.get_name_escaped(leftArrij);  // Ver.2.27.15
      if(name_var_escaped){
        /* Ver.2.269.62 -> */
        var tree = self.tree_eqn2tree_AtREe(data, rightObj, name_var_escaped);  // Ver.2.271.62
        self.store_var(name_var_escaped, tree, scopes, ids);  // Ver.2.31.17
        /* -> Ver.2.269.62 */
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
            /* Ver.2.269.62 -> */
            if(leftArrij.com || leftArrij[BT.SEe]){
              out += store_elem(rightArrij, leftArrij);
            }
            else if(rightArrij.com || rightArrij[BT.SEe]){
              out += store_elem(leftArrij, rightArrij);
            }
            /* -> Ver.2.269.62 */
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
/* Ver.2.254.59 */
My_entry.operation.prototype.get_scope0 = function(scopes, opt_ids){
  var self = this;
  var _scope = null;
  var id0 = (opt_ids || self.config.ids0)[0];
  if(scopes){
    var j = id0[0];
    var n = id0[1];
    _scope = scopes[j][n];
  }
  return _scope;
};
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
  /* Ver.2.225.53 -> */
  var id0 = (opt_ids || self.config.ids0)[0];
  var ids_buffer = [id0];
  /* -> Ver.2.225.53 */
  return self.get_scope_RE_sw(sw, name, scopes, ids_buffer);  // Ver.2.225.53
};
My_entry.operation.prototype.get_scope_RE_sw = function(sw, name, scopes, opt_ids){
  var self = this;
  var _scope = null;
  var ids = opt_ids || self.config.ids0;  // Ver.2.225.53
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
  var ids = opt_ids || self.config.ids0;  // Ver.2.225.53
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
  var BT = self.config.BT;  // Ver.2.277.65
  var is = i0-1;
  var ie = i0+1;
  var leftTree = trees[is];
  if(i0 === 1){
    var tree = null;
    if(trees.length === 3){
      var name_var = self.get_tagVal(leftTree, "REv", "val");
      if(name_var){
        tree = trees[ie];
        /* Ver.2.249.57 -> */
        var isEscaped = self.config.isEscaped(name_var);
        if(isEscaped){
          name_var = name_var.substring(1);
        }
        /* -> Ver.2.249.57 */
        var isSEe = tree[BT.SEe];  // Ver.2.277.65
        if(tree.mat){
          var arr = tree.mat.arr;  // Ver.2.277.65
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
                self.store_arr_col(tree_var.mat.arr, ref, arr);  // Ver.2.277.65
              }
              else if(len_ref < 3){
                self.store_arr(tree_var.mat.arr, ref, arr);  // Ver.2.277.65
              }
              /* Ver.2.77.30 -> */
              else if(len_ref === 4){
                self.store_arr_area(tree_var.mat.arr, ref, arr);  // Ver.2.277.65
              }
              /* -> Ver.2.77.30 */
              /* Ver.2.80.32 -> */
              else if((len_ref+1)%2 === 0){
                self.store_arr_band(tree_var.mat.arr, ref, arr);  // Ver.2.277.65
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
          self.inherit_id_tree(tree, leftTree);  // Ver.2.262.62
          self.store_var(name_var, tree, scopes, ids, isEscaped);  // Ver.2.31.17  // Ver.2.249.57
          tree = DATA.tag("out", {name: name_var, arr: tree.mat.arr});
        }
        else if(isSEe){  // Ver.2.277.65
          self.inherit_id_tree(tree, leftTree);  // Ver.2.262.62
          self.store_eqn(name_var, tree, scopes, ids, isEscaped);  // Ver.2.277.65
          tree = DATA.tree_tag("out", "stored_eqn("+name_var+")");  // Ver.2.277.65
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
My_entry.operation.prototype.tree_SEe2REe = function(tree, isReUsed){  // Ver.2.266.62
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  if(tree){  // Ver.2.273.65
    var isSEe = tree[BT.SEe];
    _tree = {};
    _tree[BT.REe] = (isReUsed)? self.entry.def.newClone(isSEe): isSEe;  // Ver.2.266.62
  }
  return _tree;
};
My_entry.operation.prototype.tree_REe2SEe = function(tree){
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  if(tree){  // Ver.2.273.65
    _tree = {};
    _tree[BT.SEe] = tree[BT.REe];  // Ver.2.266.62
  }
  return _tree;
};
/* Ver.2.200.46 */
My_entry.operation.prototype.inherit_ids_sw = function(sw, tree, opt_ids_upper){  // Ver.2.204.46
  var self = this;
  var isEqn = tree[sw];
  var ids_self = isEqn.ids;  // cloned ids
  if(ids_self){
    var N_pop = ids_self.length;  // pop overlapped ids
    var ids_upper = opt_ids_upper || self.config.ids0;  // Ver.2.204.46  // Ver.2.225.53
    self.entry.def.join_arr(isEqn, "ids", ids_upper, function(arr){for(var n=0; n<N_pop; ++n){arr.pop();}});  // inherit caller-self-upper-ids
  }
  return self;
};
/* Ver.2.31.17 -> */
/* Ver.2.273.64 */
My_entry.operation.prototype.tree_SEe2REe_isREee = function(tree, ids, isREee, isReUsed){
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  if(tree){
    var isSEe = tree[BT.SEe];
    if(isSEe){
      _tree = self.tree_SEe2REe(tree, isReUsed);
      if(isREee){
        self.inherit_ids_sw(BT.REe, _tree, ids);
      }
    }
    else{
      _tree = (isReUsed)? self.entry.def.newClone(tree): tree;
    }
  }
  return _tree;
};
My_entry.operation.prototype.restore_eqn = function(name, scopes, ids, isREee, withVar){  // Ver.2.260.61
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  var tree_var = (withVar)? self.restore_var(name, scopes, ids): null;  // Ver.2.260.61
  if(tree_var){
    _tree = tree_var;  // Ver.2.260.61
  }
  else{
    var eqns = self.get_scope_RE_sw("eqns", name, scopes, ids);  // Ver.2.260.61
    if(eqns){
      _tree = self.tree_SEe2REe_isREee(eqns[name], ids, isREee, true);  // Ver.2.273.64
    }
  }
  return _tree;
};
/* Ver.2.260.61 */
My_entry.operation.prototype.restore_eqn_tree = function(tree, scopes, opt_ids, isREee, withVar, opt_callback_AtREe, msgErr){
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  var name = "";
  var ids = opt_ids;
  var ids_SEee = null;
  var tree_SEe = null;
  var isSEe = tree[BT.SEe];
  var isREe = tree[BT.REe];
  if(isSEe){
    tree_SEe = tree;
  }
  var obj = isSEe || isREe;
  if(obj){
    var hasArgs = (isSEe)? true: false;
    name = self.get_symbol(obj, hasArgs);  // Ver.2.247.57  // Ver.2.251.58
    ids = obj.ids;  // overwrite
    ids_SEee = (obj.isSEee)? ids: null;
  }
  if(name){
    _tree = self.restore_eqn(name, scopes, ids, isREee, withVar);
    if(!(_tree) && msgErr){
      throw ((msgErr === true)? "Undef eqn("+name+")": msgErr);
    }
  }
  if(!(_tree) && opt_callback_AtREe){
    _tree = (opt_callback_AtREe === true)? ((tree_SEe)? self.tree_SEe2REe(tree_SEe, true): null): opt_callback_AtREe();  // Ver.2.266.62
  }
  /* Ver.2.253.59 -> */
  /* Ver.2.219.50 -> */
  if(_tree && _tree[BT.REe] && ids_SEee){
    self.inherit_ids_sw(BT.REe, _tree, ids_SEee);
  }
  /* -> Ver.2.219.50 */
  /* -> Ver.2.253.59 */
  return _tree;
};
My_entry.operation.prototype.store_eqn = function(name, tree, scopes, ids, isEscaped){  // Ver.2.249.57
  var self = this;
  /* Ver.2.250.57 -> */
  if(self.useMutex && self.get_scope0_RE_sw("vars", name, scopes, ids)){
    throw "Invalid SEe-scope-mutex("+name+")";
  }
  /* -> Ver.2.250.57 */
  self.inherit_constant("eqns", name, scopes, ids, tree, isEscaped);  // Ver.2.249.57  // Ver.2.254.59
  var eqns = self.get_scope_SE_sw("eqns", scopes, ids);
  eqns[name] = tree;  // Ver.2.266.62
  return self;
};
/* -> Ver.2.31.17 */
/* Ver.2.256.59 -> */
/* Ver.2.246.57 */
My_entry.operation.prototype.replace_REv = function(trees, bas){
  var self = this;
  var replace = function(name_b, callback){
    for(var name_comp in bas){  // Ver.2.256.59
      if(name_b === name_comp){
        var name_a = bas[name_comp];  // Ver.2.256.59
        callback(name_a);
        break;
      }
    }
  };
  var loop_tree_BT = function(tree_BT){
    var tagName = "REv";
    var name_b = self.get_tagVal(tree_BT, tagName, "val");
    if(name_b){
      replace(name_b, function(name_a){
        var obj = tree_BT[tagName];
        obj.val = name_a;
      });
    }
    var tagName = self.isType(tree_BT, "BT");
    if(tagName){
      var obj = tree_BT[tagName];
      var args = obj.arg;
      if(args){
        for(var i=0, len=args.length; i<len; ++i){
          var name_b = args[i];
          replace(name_b, function(name_a){
            args[i] = name_a;
          });
        }
      }
      var trees_lower = self.get_tagVal(tree_BT, tagName, "val");
      self.replace_REv(trees_lower, bas);
    }
  };
  self.loop_callback(trees, loop_tree_BT);  // Ver.2.218.50
  return self;
};
My_entry.operation.prototype.get_name_eqn_AtREe = function(trees, i0){  // Ver.2.272.63  // Ver.2.273.64
  var self = this;
  var BT = self.config.BT;
  /* Ver.2.273.64 -> */
  var name0 = self.config.symbol.anonymous;
  var name1 = self.get_tagVal(trees[i0-1], "REv", "val");
  var name2 = self.get_tagVal(trees[i0-2], "REv", "val");
  var arr1 = self.get_tagVal(trees[i0-1], "mat", "arr");
  var arr2 = self.get_tagVal(trees[i0-2], "mat", "arr");
  var hasArgs = (name2 && arr1) || (arr2 && arr1);  // f() || []()
  var arr_eqn = (hasArgs)? arr2: arr1;
  var name_eqn = (hasArgs)? name2: name1;
  var tree_eqn = (arr_eqn)? self.arr2num(arr_eqn): null;
  var isNoName = !(name_eqn);
  if(isNoName && hasArgs && arr_eqn){  // Ver.2.272.63
    // [f(x)=<x,f(1),[(x)=<x](1)=>]
    // a0=-1,make_f(a)=<[g(x)=<a0*x,==<==<g]==>f,make_f(a0)=>,f(3)=>
    var isSEe = tree_eqn[BT.SEe];  // Ver.2.200.46
    if(isSEe){
      name_eqn = name0;  // Ver.2.253.59
    }
    else{
      throw "Invalid "+name0+" equation";  // Ver.2.253.59
    }
  }
  /* -> Ver.2.273.64 */
  return {hasArgs: hasArgs, name_eqn: name_eqn, tree_eqn: tree_eqn};  // Ver.2.273.64
};
/* Ver.2.276.65 */
My_entry.operation.prototype.switch_type_tree = function(data, tree){
  var self = this;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var _tree = null;
  var tagName = Object.keys(tree)[0];
  var obj = tree[tagName];
  if((obj && obj.isREv)){
    _tree = tree;
  }
  else{
    var tree_var = self.tree_eqn2tree_AtREe(data, tree);
    if(tree_var && tree_var.mat){
      var arr = tree_var.mat.arr;
      if(!(DATA.hasVar_arr(arr))){
        _tree = tree_var;
      }
    }
  }
  if(!(_tree)){
    _tree = self.tree_eqn2tree_AtSEe(data, tree);
  }
  return _tree;
};
/* Ver.2.269.62 */
My_entry.operation.prototype.restore_args_AtREe = function(data, name_eqn, args_eqn, args, ids_args_eqn, args_eqns, args_vars, args_bas, buffer_vars, buffer_eqns, ids_buffer){  // Ver.2.271.63
  var self = this;
  var scopes = data.scopes;
  var BT = self.config.BT;  // Ver.2.276.65
  var len_args = args.length;
  /* Ver.2.275.65 -> */
  var set_var = function(name, tree, opt_name, opt_tree){  // Ver.2.276.65
    if(buffer_vars && name){  // Ver.2.215.50
      buffer_vars[name] = self.restore_var(name, scopes, ids_buffer);
    }
    var tree_var = opt_tree || self.tree_eqn2tree_AtREe(data, tree, opt_name);  // Ver.2.202.46  // Ver.2.255.59  // Ver.2.271.62  // Ver.2.276.65
    args_vars[name] = tree_var;  // Ver.2.71.29  // Ver.2.256.59
  };
  var set_eqn = function(name, tree, isSEee_argi, opt_tree){  // Ver.2.276.65
    /* Ver.2.219.50 -> */
    if(buffer_eqns && name){  // Ver.2.215.50
      buffer_eqns[name] = self.tree_REe2SEe(self.restore_eqn(name, scopes, ids_buffer));  // Ver.2.273.65
    }
    var tree_eqn = opt_tree || self.tree_eqn2tree_AtSEe(data, tree, ((isSEee_argi)? ids_args_eqn: null));  // Ver.2.255.59  // Ver.2.276.65
    /* -> Ver.2.219.50 */
    if(!(tree_eqn)){  // Ver.2.255.59
      throw "Invalid args."+name+"("+name_eqn+")";
    }
    args_eqns[name] = tree_eqn;  // Ver.2.71.29  // Ver.2.256.59
  };
  /* Ver.2.276.65 -> */
  var set_type = function(name, tree){
    var sw_tree = self.switch_type_tree(data, tree);
    var isSEe = sw_tree[BT.SEe];
    if(isSEe){
      set_eqn(name, null, null, sw_tree);
    }
    else{
      set_var(name, null, null, sw_tree);
    }
  };
  var callback = (self.useStrict)?
    function(name, right){
      set_var(name, right, name);
    }:
    function(name, right){
      set_type(name, right);
    };
  /* -> Ver.2.276.65 */
  /* -> Ver.2.275.65 */
  for(var i=0; i<len_args; ++i){
    var left = args_eqn[i];
    var right = args[i];
    /* Ver.2.245.57 -> */
    var num_escape = self.config.isEscaped_eqn(left);
    if(num_escape){
      var isSEee_argi = (num_escape === 2);
      var name = left.substring(num_escape);
    /* -> Ver.2.245.57 */
      set_eqn(name, right, isSEee_argi);  // Ver.2.275.65
    }
    /* Ver.2.246.57 -> */
    else if(self.config.isEscaped(left)){
      var name_b0 = left;
      var name_b1 = name_b0.substring(1);
      var name_a0 = self.get_tagVal(right, "REv", "val");
      if(name_a0 === name_b0){
      }
      else if(name_a0 && self.config.isEscaped(name_a0)){
        var name_a1 = name_a0.substring(1);
        args_bas[name_b0] = name_a0;
        args_bas[name_b1] = name_a1;
      }
      else{
        throw "Invalid matching args."+left;
      }
    }
    /* -> Ver.2.246.57 */
    else{
      callback(left, right);  // Ver.2.276.65
    }
  }
  return self;
};
My_entry.operation.prototype.get_args_AtREe = function(data, name_eqn, arr, isREee){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var buffer_vars = {};
  var buffer_eqns = {};
  var ids_buffer = null;
  var tree_eqn = null;
  /* Ver.2.71.29 -> */
  var args_eqns = {};  // Ver.2.256.59 [] -> {}
  var args_vars = {};  // Ver.2.256.59 [] -> {}
  var args_bas = {};  // Ver.2.246.57  // Ver.2.256.59 [] -> {}
  /* -> Ver.2.71.29 */
  if(name_eqn){
    tree_eqn = self.restore_eqn(name_eqn, scopes, ids, isREee);  // Ver.2.31.17  // Ver.2.204.46
    if(!(tree_eqn)) throw "Undef eqn("+name_eqn+")";
    var isREe = tree_eqn[BT.REe];
    var args_eqn = isREe.arg;
    var len_args_eqn = (args_eqn)? args_eqn.length: 0;
    var args = self.arr2args(arr);
    var len_args = args.length;
    if(len_args_eqn === len_args){
      /* Ver.2.33.18 -> [conv(=<a_)=<last(b=4,a_=>),[a=3,conv(=<(a))==>,b]] */
      var ids_args_eqn = isREe.ids || self.config.ids0;  // Ver.2.225.53
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
      ids_buffer = [id0];  // Ver.2.225.53
      self.restore_args_AtREe(data, name_eqn, args_eqn, args, ids_args_eqn, args_eqns, args_vars, args_bas, buffer_vars, buffer_eqns, ids_buffer);  // Ver.2.269.62  // Ver.2.271.63
    }
    else{
      throw "Invalid args.length="+len_args_eqn+"("+name_eqn+")";
    }
  }
  return {buffer_vars: buffer_vars, buffer_eqns: buffer_eqns, ids_buffer: ids_buffer, tree_eqn: tree_eqn, args_eqns: args_eqns, args_vars: args_vars, args_bas: args_bas};
};
My_entry.operation.prototype.store_buffer_sw = function(sw, buffer, scopes, ids_buffer, isClear){
  var self = this;
  var store_sw = (sw === "eqns")? self.store_eqn: self.store_var;
  for(var name in buffer){  // Ver.2.256.59
    var tree = buffer[name];  // Ver.2.256.59
    if(tree){
      store_sw.call(self, name, tree, scopes, ids_buffer);  // .call
    }
    else if(isClear){  // Ver.2.256.59
      self.del_scope_sw(sw, name, scopes, ids_buffer);  // Ver.2.226.55
    }
  }
  return self;
};
/* -> Ver.2.256.59 */
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
  var arr = self.get_tagVal(leftTree, "mat", "arr");  // Ver.2.272.63
  /* Ver.2.256.59 -> */
  var obj = self.get_name_eqn_AtREe(trees, i0);  // Ver.2.272.63
  var hasArgs = obj.hasArgs;
  var name_eqn = obj.name_eqn;
  var tree_eqn0 = obj.tree_eqn;
  if(name_eqn && tree_eqn0){
    self.store_eqn(name_eqn, tree_eqn0, scopes, ids);
  }
  var isNoName = !(name_eqn) || (name_eqn === self.config.symbol.anonymous);
  /* -> Ver.2.256.59 */
  /* -> Ver.2.204.46 */
  /* Ver.2.195.45 -> */
  // initialize
  hasArgs = hasArgs && name_eqn;  // Ver.2.272.63
  var is = (hasArgs)? i0-2: i0-1;
  hasArgs = hasArgs && arr.length;  // Ver.2.272.63
  var name_var = self.get_tagVal(rightTree, "REv", "val");
  var ie = (name_var)? i0+1: i0;
  var ref = (isNoName)? null: trees[is]["REv"]["ref"];
  /* -> Ver.2.195.45 */
  if(hasArgs){
    /* Ver.2.256.59 -> */
    var obj = self.get_args_AtREe(data, name_eqn, arr, isREee);
    buffer_vars = obj.buffer_vars;
    buffer_eqns = obj.buffer_eqns;
    ids_buffer = obj.ids_buffer;
    tree_eqn = obj.tree_eqn;
    var args_eqns = obj.args_eqns;
    var args_vars = obj.args_vars;
    var args_bas = obj.args_bas;
    if(Object.keys(args_bas).length){  // Ver.2.256.59
      self.replace_REv(DATA.tree2trees(tree_eqn), args_bas);  // Ver.2.246.57
    }
    /* Ver.2.71.29 -> */
    self.store_buffer_sw("eqns", args_eqns, scopes, ids_buffer);
    self.store_buffer_sw("vars", args_vars, scopes, ids_buffer);
    /* -> Ver.2.71.29 */
    /* -> Ver.2.256.59 */
  }
  /* Ver.2.43.22 -> */
  else{
    tree_eqn = (name_eqn)? self.restore_eqn(name_eqn, scopes, ids, isREee): self.tree_SEe2REe_isREee(tree_eqn0);  // Ver.2.31.17  // Ver.2.204.46  // Ver.2.272.63  // Ver.2.273.64
  }
  /* -> Ver.2.43.22 */
  if(tree_eqn){
    var isREe = tree_eqn[BT.REe];  // Ver.2.200.46
    /* Ver.2.247.57 -> */
    var args_eqn = isREe.arg;
    /* Ver.2.174.42 -> */
    if(args_eqn && !(hasArgs)){  // Ver.2.253.59 disabled: f(x)=<x; f=>g
      throw "Invalid args.length="+args_eqn.length+"("+name_eqn+")";
    }
    /* -> Ver.2.174.42 */
    /* -> Ver.2.247.57 */
    _tree = self.tree2tree_eqn_AtREe(data, tree_eqn, isREee);  // Ver.2.211.46  // Ver.2.214.49  // Ver.2.229.56  // Ver.2.231.56  // Ver.2.251.57  // Ver.2.253.59
  }
  /* Ver.2.256.59 -> */
  if(hasArgs){
    self.store_buffer_sw("eqns", buffer_eqns, scopes, ids_buffer);
    self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer);
  }
  /* -> Ver.2.256.59 */
  if(_tree){
    var REe2SEe = function(tree){  // Ver.2.272.63
      var _tree = tree;  // Ver.2.272.63
      /* a(a)=<(a,2:3,4); a[0][0](-1)=> */
      if(ref){
        _tree = self.tree2tree_ref(_tree, ref);  // Ver.2.32.17
        _tree = self.tree2tree_eqn_AtREe(data, _tree, isREee);  // Ver.2.255.59
      }
      /* a(a)=<(a,2:3,4); a[0][0](-1)=>b; b */
      /* Ver.2.229.56 -> */
      /* Ver.2.203.46 -> */
      /* Ver.2.204.46 -> */
      var tree_var = null;
      var isREe = _tree[BT.REe];
      // REe -> SEe
      if(isREe){
        tree_var = self.tree_REe2SEe(_tree);
      }
      else if(name_var){
        tree_var = self.inherit_ids_AtSEe(DATA.tree2trees(_tree), ids);
      }
      /* -> Ver.2.204.46 */
      if(tree_var){
        if(name_var){
          /* Ver.2.262.61 -> */
          var isEscaped = self.config.isEscaped(name_var);
          if(isEscaped){
            name_var = name_var.substring(1);
          }
          self.inherit_id_tree(tree_var, rightTree);  // Ver.2.262.62
          self.store_eqn(name_var, tree_var, scopes, ids, isEscaped);
          /* -> Ver.2.262.61 */
          _tree = DATA.tree_num(0, 0);
        }
        else{
          _tree = tree_var;
        }
      }
      /* -> Ver.2.203.46 */
      /* -> Ver.2.229.56 */
      return _tree;  // Ver.2.272.63
    };
    if(tagName === "REe"){
      _tree = REe2SEe(_tree);  // Ver.2.272.63
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
  _tree[BT.SEe].ids = opt_ids || self.config.ids0;  // b=1,[a=<b,=<a=>]=> || a=<b+1; [b=1,a==>]  // Ver.2.225.53
  /* Ver.2.209.46 -> */
  if(opt_arg){
    _tree[BT.SEe].arg = opt_arg;  // Ver.2.32.17
  }
  /* -> Ver.2.209.46 */
  return _tree;
};
/* Ver.2.272.63 */
My_entry.operation.prototype.isEmpty_tree = function(tree){
  var self = this;
  var tagName = (Object.keys(tree))[0];
  return ((self.get_tagVal(tree, tagName, "val") || []).length === 0);
};
My_entry.operation.prototype.BTe = function(data, i0, tagName, tagObj){  // Ver.2.213.47  // Ver.2.213.48  // Ver.2.228.56
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;  // Ver.2.213.48
  var len = trees.length;
  /* Ver.2.209.46 -> */
  /* Ver.2.27.15 -> */
  var leftTree = trees[i0-1];
  var tree = trees[i0];  // Ver.2.213.48
  var rightTree = trees[i0+1];
  var hasArgs = self.isType(leftTree, "BT");  // f(x)=<x || (x)=<x
  var is = (hasArgs)? i0-2: i0-1;
  hasArgs = hasArgs && !(self.isEmpty_tree(leftTree));  // Ver.2.272.63
  var ie = len-1;
  var name_eqn = self.get_tagVal(trees[is], "REv", "val");
  if(!(name_eqn)){
    is += 1;  // Ver.2.213.49
  }
  var isSEe = tree[BT.SEe];  // Ver.2.249.57
  /* Ver.2.195.45 -> */
  var names = (hasArgs)? self.get_names(data, leftTree, true): null;  // NG: (x=1)=<x
  /* Ver.2.213.48 -> */
  if(names){
    if(names.length === 0) throw "Invalid args isFound("+name_eqn+")";  // Ver.2.252.59
    isSEe.arg = names;  // Ver.2.249.57
  }
  /* -> Ver.2.213.48 */
  if(name_eqn){
    /* Ver.2.249.57 -> */
    var isEscaped = self.config.isEscaped(name_eqn);
    if(isEscaped){
      name_eqn = name_eqn.substring(1);
    }
    /* -> Ver.2.249.57 */
    self.inherit_id_tree(tree, trees[is]);  // Ver.2.262.62
    self.store_eqn(name_eqn, tree, scopes, ids, isEscaped);  // Ver.2.31.17  // Ver.2.249.57
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
          data.vars.ans = tree;  // Ver.2.31.17  // Ver.2.266.62
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
