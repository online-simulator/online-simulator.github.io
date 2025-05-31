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
        "UR",    //  . || ' -> transpose(left) || htranspose(left)
                 // post-Unary operatoR imaginary unit i
                 // factorial mark ! || !!... -> fact_m(left, m)
        /* following Pre-Unary operator */
        "PU"     // Pre-Unary operator # || ## || ### -> sizer(right) || sizec(right) || Nelements
      ],
      [
        "BRpp",  // Binary operatoR ** -> pow(left, right)@Right-Associativity
        "BRp"    // Binary operatoR ^  -> pow(left, right)
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
        "BRrl",  // Binary operatoR relational ==== || === || == || <> || <<>> || <<<>>>
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
    useRetry: false,  // Ver.2.408.86
    isRelative_epsN: false,
    epsN: Number.EPSILON,  // Ver.2.835.141
    dxT: 1e-3,
    dxJ: Math.pow(2, -16),  // Ver.2.835.141
    dxD: Math.pow(2, -10),  // Ver.2.835.141
    NI: 100
  },
  /* Ver.2.245.57 -> */
  /* Ver.2.32.17 */
  symbol: {
    const: "const ",  // Ver.2.296.72
    anonymous: "no-name",  // Ver.2.253.59
    escape_mac: "$",  // Ver.2.791.126
    escape_ref: "?",  // Ver.2.791.126
    escape_eqn1: "@",
    escape_eqn2: "@@"  // Ver.2.219.50
  },
  /* Ver.2.296.72 */
  get_out: function(isEqn, name, isConstant){
    return ("stored_"+((isEqn)? "eqn": "var")+"("+((isConstant)? "const ": "")+name+")");
  },
  /* Ver.2.27.15 */
  isEscaped: function(name){
    return (name && name[0] === "$");  // Ver.2.294.72
  },
  /* Ver.2.303.73 */
  isEscaped_ref: function(name){
    return (name && name[0] === "?");
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
  self.useStrict = null;
  self.useEmpty = null;
  self.useScopeWith = null;  // Ver.2.213.47
  self.use$let = null;  // Ver.2.249.57
  self.useMutex = null;  // Ver.2.250.57
  self.useStatic = null;  // Ver.2.741.109
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
  self.useStatic = 0;  // Ver.2.741.109
  self.options.useRetry = options.useRetry || self.config.params.useRetry;  // Ver.2.408.86
  self.options.isRelative_epsN = options.isRelative_epsN || self.config.params.isRelative_epsN;
  self.options.epsN = options.epsN || self.config.params.epsN;
  self.options.dxT = options.dxT || self.config.params.dxT;
  self.options.dxJ = options.dxJ || self.config.params.dxJ;
  self.options.dxD = options.dxD || self.config.params.dxD;
  self.options.NI = options.NI || self.config.params.NI;
  var precedence = self.config.precedence;  // Ver.2.304.75
  var arr_precedence = self.entry.def.newClone(precedence);  // Ver.2.304.75
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
  self.arr_precedence4args = [precedence[0][0], precedence[0][4]].join().split(",");  // Ver.2.304.75
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
    self.arr_precedence4args = self.arr_precedence4args.filter(function(tag){return hasTag[tag];});  // Ver.2.304.75
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
    /* Ver.2.409.86 -> */
    var message = e;
    if(typeof e === "object" && e.length){  // Ver.2.411.87
      var math_mat = self.entry.math_mat;
      var data = e[0];
      var i0 = e[1];
      var tagName = e[2];
      var tagObj = e[3];
      var trees = data.trees;
      var tagVal = (tagObj)? tagObj.val: null;
      var len = trees.length;
      var check_tree = function(i){
        var _tagVal = "";
        var tree = trees[i];
        if(tree){
          if(tree.mat){
            var arr = tree.mat.arr;
            var lens = math_mat.get_lens(arr);
            var len_i = lens.i;
            var len_j = lens.j;
            /* Ver.2.433.90 -> */
            if(len_i === 1 && len_j === 1){
              _tagVal = (arr[0][0][self.config.BT.SEe])? "=<": "number";
            }
            /* -> Ver.2.433.90 */
            else if(len_i === 1){
              _tagVal = "(,)";
            }
            else if(len_j === 1){
              _tagVal = "{,}";
            }
            else{
              _tagVal = "(,:,)";
            }
          }
          else{
            var tagName = Object.keys(tree)[0];
            var tagVal = self.get_tagVal(tree, tagName, "val");
            _tagVal = (typeof tagVal === "string")? tagVal: "'"+tagName+"'";
          }
        }
        return _tagVal;
      };
      if(tagVal){
        message = "Invalid operation "+check_tree(i0-1)+tagVal+check_tree(i0+1);
      }
      else{
        var arr = [];
        for(var i=0; i<len; ++i){
          arr.push(check_tree(i));
        }
        message = "Invalid ans("+arr+")";
      }
    }
    throw {message: message, j: j};  // Ver.2.224.50
    /* -> Ver.2.409.86 */
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
  var arr_precedence = self["arr_precedence"+((self.isBT2tree)? "4args": "")];  // Ver.2.304.75
  arr_precedence.forEach(function(tagName){  // Ver.2.304.75
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
My_entry.operation.prototype.get_newData = function(data, trees, opt_ids, isClear_scopes){  // Ver.2.304.75
  var self = this;
  /* Ver.2.304.75 -> */
  var DATA = self.entry.DATA;
  /* Ver.2.31.17 -> */
  var _data = null;
  if(isClear_scopes){
    _data = DATA.data(trees, data.options);
    _data.scopes = null;
  }
  else{
    _data = DATA.data(trees, data.options, data.vars, data.eqns);
    _data.scopes = data.scopes;
    if(opt_ids){
      _data.ids = opt_ids;
    }
  }
  return _data;
  /* -> Ver.2.31.17 */
  /* -> Ver.2.304.75 */
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
  var isEmpty4ref = (tree.mat.arr.length === 0 && (ref0 || (leftTree && leftTree[tagName])));  // Ver.2.373.86 A[][0] || A[0][0][][]
  if(isEmpty4ref){
    tree = DATA.tree_num(undefined, 0);  // Ver.2.747.112  // Ver.2.768.117
  }
  /* -> Ver.2.170.41 */
  var arr = tree.mat.arr;
  var arr0 = arr[0];
  var len_i = arr.length;
  var len_j = (arr0)? arr0.length: 0;  // Ver.2.170.41
  var isVal = (len_i === 1 && len_j === 1 && !(arr0[0][self.config.BT.SEe]));  // Ver.2.31.17
  /* Ver.1.4.3 */
  if(isVal){  // [1,2:3,4][0] -> (1,2)
    var ref = [];
    for(var j=0; j<len_j; ++j){
      /* Ver.1.5.3 */
      var num = arr0[j];
      /* Ver.2.747.112 -> */
      if(num.com){
        var ncr = num.com.r;
        var nci = num.com.i;
        if(ncr%1){
          throw "Invalid reference of array["+ncr+"]";
        }
        else if(nci){
          throw "Invalid reference of array["+nci+"i"+"]";
        }
        else{
          ref[j] = ncr;
        }
      }
      /* -> Ver.2.747.112 */
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
    throw arguments;  // Ver.2.409.86
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
My_entry.operation.prototype.tree_BT2tree = function(data, tree){  // Ver.2.304.75
  var self = this;
  var DATA = self.entry.DATA;
  var _tree = null;
  var tagName = self.isType(tree, "BT");
  if(tagName){
    self.isBT2tree = true;  // Ver.2.280.66
    /* Ver.2.102.33 -> */
    var hasUndefVars = self.params.hasUndefVars;
    var newData = self.get_newData(data, DATA.tree2trees(tree), null, true);  // Ver.2.304.75
    var obj = DATA.tag(tagName, self.get_tagVal(tree, tagName, "val"));
    self[tagName](newData, 0, tagName, obj[tagName]);
    _tree = DATA.trees2tree(newData.trees);
    self.params.hasUndefVars = hasUndefVars;
    /* -> Ver.2.102.33 */
    self.isBT2tree = false;  // Ver.2.280.66
  }
  return _tree;
};
/* Ver.2.303.73 */
My_entry.operation.prototype.isEscaped_symbol = function(symbol){
  var self = this;
  return (self.config.isEscaped(symbol) || self.config.isEscaped_ref(symbol));
};
/* Ver.2.232.56 */
My_entry.operation.prototype.check_symbol = function(symbol){
  var self = this;
  if(self.isEscaped_symbol(symbol)) throw "Invalid symbol("+symbol+")";  // Ver.2.294.72  // Ver.2.303.73
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
  return _symbol;
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
  if(self.config.isEscaped(name)){  // Ver.2.294.72
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
    /* Ver.2.824.138 -> */
    /* Ver.2.823.135 -> */
    var isBreak = false;
    var len_i = arr.length;
    if(isRow){
      for(var i=0; i<len_i; ++i){
        for(var j=0, len_j=arr[i].length; j<len_j; ++j){
          var name = self.get_name(arr[i][j]);  // Ver.2.251.58
          if(name){
            _names.push(name);  // serialize
          }
          else{
            _names.length = 0;
            isBreak = true;
            break;
          }
        }
        if(isBreak){
          break;
        }
      }
    }
    else{
      var len_j = arr[0].length;  // fixed by transpose
      for(var j=0; j<len_j; ++j){
        for(var i=0; i<len_i; ++i){
          var name = self.get_name(arr[i][j]);  // Ver.2.251.58
          if(name){
            _names.push(name);  // serialize
          }
          else{
            _names.length = 0;
            isBreak = true;
            break;
          }
        }
        if(isBreak){
          break;
        }
      }
    }
    /* -> Ver.2.823.135 */
    /* -> Ver.2.824.138 */
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
      self.check_symbol(name);  // Ver.2.294.72
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
  return self.get_dxD(x, h);  // Ver.2.321.78
};
My_entry.operation.prototype.get_dxD = function(x, h){
  var self = this;
  var DATA = self.entry.DATA;
  /* Ver.1.3.1 */
  var xc = x.com;
  var hc = h.com;
  var hcr = (xc.r || 1)*hc.r;  // Ver.2.321.78
  var hci = (xc.i || 1)*hc.i;  // Ver.2.321.78
  return DATA.com(hcr, hci);
};
/* differential step */
My_entry.operation.prototype.get_hc = function(options, x, dx, sw_name){
  var self = this;
  var DATA = self.entry.DATA;
  /* Ver.2.404.86 -> */
  /* Ver.2.29.15 -> */
  var dx0 = null;
  var dxo = self.options[sw_name];
  var dxc = (dx && dx.com);
  var isFixed = false;
  if(dxc){
    var dxcr = dxc.r;
    var dxci = dxc.i;
    if(dxcr === false && dxci === 0){
      dx0 = DATA.num(dxo, 0);
    }
    else if(dxcr || dxci){
      isFixed = true;  // not0
      dx0 = dx;
    }
/*
    else{
      isFixed = false;
      // false+0 -> 0
      // (false)i -> 0
      // false*(1+i) -> 0
    }
*/
  }
  if(!(dx0)){
    dx0 = DATA.num(dxo, dxo);
  }
  /* -> Ver.2.29.15 */
  /* -> Ver.2.404.86 */
  var h = DATA.num(dx0.com.r, ((options.useComplex)? dx0.com.i: 0));
  var _hc = (isFixed)? h.com: self["get_"+sw_name](x, h);
  return _hc;
};
/* Ver.2.233.56 */
My_entry.operation.prototype.FNmhX = function(data, rightArr, tagObj, len_j0, msgErr, callback_names, callback_FNmh){  // Ver.2.234.56 isOverwrite deleted
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;  // Ver.2.757.114
  var _tree = null;
  var args = DATA.arr2args(rightArr);
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
    /* -> Ver.2.231.56 */
    if(callback_FNmh){
      var obj = callback_names(args, args_eqn, name_arg);  // Ver.2.233.56  // Ver.2.812.131
      var name_var = obj.name_var;
      var names = obj.names;
      var buffer_vars = {};
      /* Ver.2.736.107 -> */
      var vars2buffer = function(name){
        if(name){
          buffer_vars[name] = self.restore_var(name, scopes, ids_buffer);
        }
      };
      vars2buffer(name_var);  // Ver.2.31.17  // Ver.2.225.53  // Ver.2.256.59
      names.forEach(function(name){
        vars2buffer(name);  // Ver.2.215.50  // Ver.2.226.55
      });
      /* -> Ver.2.736.107 */
      _tree = callback_FNmh(args, ids_buffer, name_var, names, tree_eqn);  // Ver.2.233.56
      self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer, true);  // Ver.2.256.59
    }
    else{
      _tree = callback_names(args, args_eqn, name_arg);  // Ver.2.233.56  // Ver.2.812.131
    }
  }
  else{
    throw msgErr;
  }
  return _tree;
};
/* Ver.2.735.107 -> */
My_entry.operation.prototype.hasEqn_arg = function(arg){
  return (arg && !(arg.com));
};
My_entry.operation.prototype.has0_arg = function(arg){
  return (arg && arg.com && arg.com.r === 0 && arg.com.i === 0);
};
My_entry.operation.prototype.isUndef_arg = function(arg){
  return (typeof arg === "undefined");
};
/* Ver.2.815.132 */
My_entry.operation.prototype.hasVars = function(){
  var self = this;
  var _hasVars = true;
  for(var i=0, len=arguments.length; i<len; ++i){
    var argi = arguments[i];
    if(_hasVars && argi){
      _hasVars = (argi.com)? true: false;
    }
  }
  return _hasVars;
};
/* -> Ver.2.735.107 */
My_entry.operation.prototype.jacobian = function(data, rightArr, tagObj){
  var self = this;
  var options = data.options;
  var scopes = data.scopes;
  var ids = data.ids;
  var math = self.entry.math;  // Ver.2.836.141
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var unit = self.entry.unit;
  var BT = self.config.BT;  // Ver.2.230.56
  var _tree = null;
  var prop = tagObj.val;
  prop = (prop && prop.key)? prop.key: prop;  // Ver.2.233.56
  var msgErr = "Invalid "+prop+" arguments";  // Ver.2.233.56
  /* Ver.2.736.107 -> */
  var isAuto_args = false;
  var name_t = "__t__";
  var name_x = "__x__";
  /* -> Ver.2.736.107 */
  /* Ver.2.21.10 -> */
  /* Ver.2.234.56 -> */
  var init_x0 = function(arr, names, ids_buffer){  // Ver.2.233.56
    var _x0 = [];
    var len_i = arr.length;  // Ver.2.233.56  // Ver.2.736.107
    for(var i=0; i<len_i; ++i){
      var name_var = names[i];
      var num = DATA.arr2obj_i(arr, i);
      /* Ver.2.736.107 -> */
      if(!(num.com)){
        self.throw_tree(num);
      }
      if(name_var){
        self.store_var(name_var, DATA.num2tree(num), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
      }
      /* -> Ver.2.736.107 */
      _x0[i] = num;
    }
    return _x0;
  };
  /* -> Ver.2.234.56 */
  /* Ver.2.237.56 -> */
  var isRow = true;  // default: hasArgs=true
  var get_names = function(argj){
    /* Ver.2.735.105 -> */
    if(argj){
      var names_col = self.get_symbols_expanded(data, argj);
      var names_row = self.get_symbols_expanded(data, argj, true);
      isRow = (names_row.length > names_col.length);
    }
    else{
      throw msgErr;
    }
    /* -> Ver.2.735.105 */
    return ((isRow)? names_row: names_col);
  };
  var get_arr_x = function(argj, len_i){  // Ver.2.233.56  // Ver.2.237.56
    var _arr_x = null;
    /* Ver.2.823.137 -> */
    var arg = self.get_args(argj);
    if(arg && arg.length){
      throw msgErr;
    }
    /* -> Ver.2.823.137 */
    var tree = self.tree_eqn2tree(data, self.tree2tree_eqn(data, argj));  // Ver.2.233.56
    if(tree.mat){
      _arr_x = tree.mat.arr;
    }
    else{
      throw msgErr;
    }
    /* Ver.2.823.136 -> */
    var lens = math_mat.get_lens(_arr_x);
    var len_xi = lens.i;
    var len_xj = lens.j;
    /* -> Ver.2.823.136 */
    /* Ver.2.735.106 -> */
    if(len_i && !(Math.min(len_xi, len_xj) === 1 && Math.max(len_xi, len_xj) === len_i)){  // Ver.2.736.107
      throw msgErr;
    }
    isRow = (len_i)? (len_xj === len_i): (len_xi < len_xj);  // Ver.2.736.107
    if(isRow){
      _arr_x = DATA.vec2arr(_arr_x[len_xi-1]);
    }
    /* -> Ver.2.735.106 */
    return _arr_x;
  };
  /* -> Ver.2.237.56 */
  var isDefined_x0 = false;  // Ver.2.843.149
  var make_get_f_from_arr_f0 = function(arr_f0, len_i, i0, j0){
    var _get_f = null;
    /* Ver.1.5.3 -> f<={A(x)=b} */
    var len_fi = arr_f0.length;
    var len_fj = arr_f0[len_fi-1].length;
    if(len_fi === len_i){
      if(len_fi > 1){  // Ver.2.776.123
        if(isDefined_x0 && isRow === true) throw msgErr+"(RC)";  // Ver.2.843.149
        isRow = false;  // Ver.2.237.56
      }
      _get_f = function(arr_f, i){
        return DATA.arr2obj_i(arr_f, i);
      };
    }
    /* Ver.2.237.56 -> */
    else if(len_fj === len_i){
      if(isDefined_x0 && isRow === false) throw msgErr+"(RC)";  // Ver.2.843.149
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
if(prop === "OX" || prop === "TX"){  // ODE  // Ver.2.23.11  // Ver.2.231.56  // Ver.2.233.56  // Ver.2.238.56
  var isTX = (prop === "TX");  // Ver.2.238.56
  var callback_names = function(args, args_eqn, name_arg){  // Ver.2.233.56  // Ver.2.812.131
    /* Ver.2.238.56 -> */
    /* Ver.2.27.15 -> */
    /* Ver.2.231.56 -> */
    var name_arg = "";
    var names = [];  // Ver.2.736.107
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
      isAuto_args = true;  // Ver.2.735.107  // Ver.2.736.107  // Ver.2.816.132
    }
    /* Ver.2.736.107 -> */
    var name_var = name_arg;  // Ver.2.812.131
    if(!(isAuto_args)){
      if(!(name_var)) throw msgErr;  // Ver.2.812.131
      if(!(names.length)) throw msgErr;
    }
    /* -> Ver.2.736.107 */
    /* -> Ver.2.231.56 */
    /* -> Ver.2.27.15 */
    /* -> Ver.2.238.56 */
    return {name_var: name_var, names: names};  // Ver.2.233.56
  };
  var callback_FNmh = function(args, ids_buffer, name_var, names, tree_eqn){  // Ver.2.233.56
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    /* Ver.2.816.132 -> */
    var arg1 = args[1];  // Ver.2.233.56
    /* Ver.2.735.107 -> */
    if(self.hasEqn_arg(arg1)){  // Ver.2.233.56
      isDefined_x0 = true;  // Ver.2.843.149
      arr_x = get_arr_x(arg1, len_i);  // Ver.2.233.56  // Ver.2.237.56
    }
    else if(self.has0_arg(arg1)){
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    else{
      throw msgErr;
    }
    /* -> Ver.2.735.107 */
    /* -> Ver.2.816.132 */
    /* Ver.2.238.56 -> */
    /* Ver.2.815.132 -> */
    // args
    var is = 3;
    is -= 1;  // Ver.2.816.132
    var argI = args[is+0];
    var argT = args[is+1-isTX];
    var argN = args[is+2-isTX];
    var argD = args[is+3-isTX];
    var argB = args[is+4-isTX];  // Ver.2.777.123
    if(!(self.hasVars(argI, argT, argN, argD))){
      throw msgErr;
    }
    /* Ver.2.774.121 -> */
    if(isTX){
      names.shift();
      var arr_x0 = arr_x.shift();
      argI = arr_x0 && arr_x0[0];
    }
    len_i = arr_x.length;  // tree_eqn change allowed  // Ver.2.736.107
    // t0
    var t0ini = (argI && argI.com)? argI: DATA.num(0, 0);  // Ver.2.234.56
    /* -> Ver.2.774.121 */
    /* -> Ver.2.815.132 */
    var t0 = t0ini;  // Ver.2.234.56
    // dt
    var dt = (argT && argT.com)? argT: DATA.num(self.options.dxT, 0);  // Ver.2.815.132
    /* Ver.2.821.134 -> */
    var dtcr = dt.com.r;
    var dtci = dt.com.i;
    /* Ver.2.29.15 -> */
    // Niteration
    var Niteration = (argN && argN.com)? Math.round(argN.com.r): 1;  // 0 enabled  // Ver.2.205.46 floor -> round
    if(dtcr === 0 && dtci === 0){
      Niteration = 0;
    }
    /* -> Ver.2.29.15 */
    /* -> Ver.2.821.134 */
    /* Ver.2.774.119 -> */
    // delta
    var delta = ((argD && argD.com)? argD.com.r: null) || 1e-3;  // Ver.2.777.123 not0
    var hdelta = Math.sqrt(Math.pow(dtcr, 2)+Math.pow(dtci, 2))*delta;  // Ver.2.821.134
    /* -> Ver.2.774.119 */
    /* -> Ver.2.238.56 */
    // orderT
    /* Ver.2.369.86 -> */
    var orderT = 4;
    if(tagObj.val.order || tagObj.val.order === 0){  // Ver.2.777.123
      orderT = tagObj.val.order;
    }
    else if(options.orderT === 2 || options.orderT === 5 || options.orderT === 45 || options.orderT === 3 || options.orderT === 23 || options.orderT === 1 || options.orderT === 12 || options.orderT === 0){  // Ver.2.774.119  // Ver.2.775.121  // Ver.2.777.123
      orderT = options.orderT;
    }
    /* -> Ver.2.369.86 */
    // x0
    var x0 = init_x0(arr_x, names, ids_buffer);  // Ver.2.233.56
    // functions
    var get_dt = function(kcr){
      return unit["BRm"](options, dt, DATA.num(kcr, 0));
    };
    var sw_name_t = (isAuto_args)? name_t: name_var;  // Ver.2.736.107
    var store_t = function(dt){
      var t = (dt)? unit["BRa"](options, t0, dt): t0;
      self.store_var(sw_name_t, DATA.num2tree(t), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53  // Ver.2.736.107
    };
    /* Ver.2.773.117 -> */
    var step_t = function(n, opt_t0){
      var _t = unit["BRa"](options, opt_t0 || t0ini, unit["BRm"](options, DATA.num(n, 0), dt));
      return _t;
    };
    /* -> Ver.2.773.117 */
    var store_x = function(x){
      /* Ver.2.736.107 -> */
      if(isAuto_args){
        self.store_var(name_x, DATA.tree_mat(DATA.vec2arr(x, false)), scopes, ids_buffer);
      }
      else{
        for(var i=0; i<len_i; ++i){
          self.store_var(names[i], DATA.num2tree(x[i]), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        }
      }
      /* -> Ver.2.736.107 */
    };
    var step_x = function(x, f, dt){
      var _x = [];
      for(var i=0; i<len_i; ++i){
        _x[i] = unit["BRa"](options, x[i], unit["BRm"](options, f[i], dt));
      }
      return _x;
    };
    /* Ver.2.369.86 */
    var step_x_sum = function(x, arr2d){
      var _x = [];
      for(var i=0; i<len_i; ++i){
        _x[i] = x[i];
      }
      var len_n = arr2d.length;
      for(var n=0; n<len_n; ++n){
        var f = arr2d[n][0];
        var dt = arr2d[n][1];
        for(var i=0; i<len_i; ++i){
          _x[i] = unit["BRa"](options, _x[i], unit["BRm"](options, f[i], dt));
        }
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
    /* Ver.2.776.122 -> */
    var get_arr_f = function(table){
      var _arr_f = [];
      var x = x0;
      var len_s = table[table.length-1].length;
      for(var i=0; i<len_s; ++i){
        var tablei = table[i];
        var arr_ft = [];
        var len_j = _arr_f.length;
        for(var j=0; j<len_j; ++j){
          arr_ft.push([_arr_f[j], get_dt(tablei[j+1])]);
        }
        if(arr_ft.length){
          x = step_x_sum(x0, arr_ft);
        }
        store_t(get_dt(tablei[0]));
        store_x(x);
        _arr_f.push(calc_f());
      }
      return _arr_f;
    };
    /* Ver.2.775.121 -> */
    /* Ver.2.774.119 -> */
    var calc_norm = function(fc_o5, fc_o4){
      var vec_df = [];  // Ver.2.845.152
      for(var i=0; i<len_i; ++i){
        vec_df[i] = unit["BRs"](options, fc_o4[i], fc_o5[i]);  // Ver.2.845.152
      }
      return math_mat.vec2norm(options, vec_df);  // Ver.2.237.56  // Ver.2.845.152
    };
    var dt0 = dt;
    var adapt_step = function(table){
      var _pNdt = 0;
      var len_t = table.length;
      var arr_o5 = table[len_t-2];
      var arr_o4 = table[len_t-1];
      var cr_norm = null;
      var t00 = t0;  // Ver.2.774.120
      dt = get_dt(1/Ndt);
      for(var n=0; n<Ndt; ++n){
        var arr_f = get_arr_f(table);
        var fc_o5 = combinate(arr_f, arr_o5);
        var fc_o4 = combinate(arr_f, arr_o4);
        cr_norm = calc_norm(fc_o5, fc_o4);
        if(cr_norm >= hdelta){
          _pNdt = 1;
          break;
        }
        else{
          x0 = step_x(x0, fc_o5, dt);
          t0 = step_t(n+1, t00);  // Ver.2.774.120
        }
      }
      dt = dt0;
      if(cr_norm <= hdelta/10){
        _pNdt = -1;
      }
      return _pNdt;
    };
    var Ndt = 1;
    var OX_adaptive = function(table){
      var t00 = t0;
      var x00 = x0;
      var pNdt = adapt_step(table);
      Ndt *= Math.pow(2, pNdt);
      Ndt = Math.max(1, Ndt);
      if(pNdt === 1){
        t0 = t00;
        x0 = x00;
        store_x(x0);
        OX_adaptive(table);
      }
    };
    /* -> Ver.2.774.119 */
    var OX = function(n, table){
      var len_t = table.length;
      var len_s = table[len_t-1].length;
      var isFixed = (len_t === len_s+1);
      var isAdaptive = (len_t === len_s+2);
      if(isFixed){
        var fc = combinate(get_arr_f(table), table[len_t-1]);
        x0 = step_x(x0, fc, dt);  // Ver.2.773.117
      }
      else if(isAdaptive){
        OX_adaptive(table);
      }
      else{
        throw msgErr+"(Butcher-table)";
      }
      if(options.checkError){
        set_error(x0);
      }
      store_x(x0);
      if(Ndt%1 === 0){
        t0 = step_t(n+1);  // Ver.2.773.117
      }
    };
    /* -> Ver.2.775.121 */
    /* Ver.2.369.86 -> */
    // classical Runge-Kutta method
    var table = [[0], [1/2, 1/2], [1/2, 0, 1/2], [1, 0, 0, 1], [1/6, 1/3, 1/3, 1/6]];
    // improved Euler method
    if(orderT === 2){
      table = [[0], [1/2, 1/2], [0, 1]];
    }
    // Runge-Kutta-Fehlberg method
    else if(orderT === 5){
      table = [[0], [1/4, 1/4], [3/8, 3/32, 9/32], [12/13, 1932/2197, -7200/2197, 7296/2197], [1, 439/216, -8, 3680/513, -845/4104], [1/2, -8/27, 2, -3544/2565, 1859/4104, -11/40], [16/135, 0, 6656/12825, 28561/56430, -9/50, 2/55]];
    }
    else if(orderT === 45){
      table = [[0], [1/4, 1/4], [3/8, 3/32, 9/32], [12/13, 1932/2197, -7200/2197, 7296/2197], [1, 439/216, -8, 3680/513, -845/4104], [1/2, -8/27, 2, -3544/2565, 1859/4104, -11/40], [16/135, 0, 6656/12825, 28561/56430, -9/50, 2/55], [25/216, 0, 1408/2565, 2197/4104, -1/5, 0]];
//      table = [[0], [1/5, 1/5], [3/10, 3/40, 9/40], [3/5, 3/10, -9/10, 6/5], [1, -11/54, 5/2, -70/27, 35/27], [7/8, 1631/55296, 175/512, 575/13824, 44275/110592, 253/4096], [37/378, 0, 250/621, 125/594, 0, 512/1771], [2825/27648, 0, 18575/48384, 13525/55296, 277/14336, 1/4]];  // Cash-Karp method
//      table = [[0], [1/5, 1/5], [3/10, 3/40, 9/40], [4/5, 44/45, -56/15, 32/9], [8/9, 19372/6561, -25360/2187, 64448/6561, -212/729], [1, 9017/3168, -355/33, 46732/5247, 49/176, -5103/18656], [1, 35/384, 0, 500/1113, 125/192, -2187/6784, 11/84], [35/384, 0, 500/1113, 125/192, -2187/6784, 11/84, 0], [5179/57600, 0, 7571/16695, 393/640, -92097/339200, 187/2100, 1/40]];  // Dormand-Prince method
    }
    // Bogacki-Shampine method
    else if(orderT === 3){
      table = [[0], [1/2, 1/2], [3/4, 0, 3/4], [1, 2/9, 1/3, 4/9], [2/9, 1/3, 4/9, 0]];
    }
    else if(orderT === 23){
      table = [[0], [1/2, 1/2], [3/4, 0, 3/4], [1, 2/9, 1/3, 4/9], [2/9, 1/3, 4/9, 0], [7/24, 1/4, 1/3, 1/8]];
    }
    // Euler method
    else if(orderT === 1){
      table = [[0], [1]];
    }
    // Heun-Euler method
    else if(orderT === 12){
      table = [[0], [1, 1], [1/2, 1/2], [1, 0]];
    }
    /* Ver.2.777.123 -> */
    else if(orderT === 0){
      var tree_table = (argB)? self.tree_eqn2tree_AtREe(data, argB): null;
      var arr = self.get_tagVal(tree_table, "mat", "arr");
      if(arr){
        table = DATA.arr2table(arr);
        orderT = table[table.length-1].length;
      }
      else{
        table.length = 0;
      }
    }
    /* -> Ver.2.777.123 */
    if(!(table && table.length > 1)){
      throw msgErr+"(Butcher-table)";
    }
    /* -> Ver.2.369.86 */
    /* -> Ver.2.776.122 */
    /* Ver.2.775.121 -> */
    if(orderT === 45 || orderT === 23 || orderT === 12){
      orderT = Number(String(orderT).charAt(1));
    }
    /* -> Ver.2.775.121 */
    /* Ver.2.736.107 -> */
    if(isAuto_args){
      store_x(x0);  // Ver.2.740.107
    }
    /* -> Ver.2.736.107 */
    /* Ver.2.29.15 -> */
    for(var n=0; n<Niteration; ++n){
      OX(n, table);  // Ver.2.233.56  // Ver.2.234.56 t0ini+Niteration*dt not returned  // Ver.2.738.107  // Ver.2.773.117  // Ver.2.776.122
    }
    /* Ver.2.736.107 -> */
    if(isAuto_args){
      self.del_scope_sw("vars", name_t, scopes, ids_buffer);
      self.del_scope_sw("vars", name_x, scopes, ids_buffer);
    }
    /* -> Ver.2.736.107 */
    if(isTX){
      x0.unshift(t0);  // Ver.2.238.56 t0 returned
    }
    _tree = DATA.tree_mat(DATA.vec2arr(x0, isRow));  // Ver.2.237.56
    /* -> Ver.2.29.15 */
    return _tree;
  };
  _tree = self.FNmhX(data, rightArr, tagObj, 0, msgErr, callback_names, callback_FNmh);  // Ver.2.233.56  // Ver.2.234.56
}
else{
  var isNewtonian = (prop === "newtonian");
  var callback_names = function(args, args_eqn, name_arg){  // Ver.2.233.56  // Ver.2.812.131
    /* Ver.2.27.15 -> */
    /* Ver.2.739.107 -> */
    var names = [];  // Ver.2.736.107
    if(args_eqn){
      names = args_eqn;
    }
    else{
      isAuto_args = true;  // Ver.2.735.107  // Ver.2.736.107  // Ver.2.816.132
    }
    if(!(isAuto_args)){
      if(!(names.length)) throw msgErr;
    }
    /* -> Ver.2.739.107 */
    /* -> Ver.2.27.15 */
    return {names: names};  // Ver.2.233.56
  };
  var callback_FNmh = function(args, ids_buffer, name_var, names, tree_eqn){  // Ver.2.233.56
    var len_i = names.length;
    var arr_x = null;
    /* Ver.2.29.15 -> */
    /* Ver.2.816.132 -> */
    var arg1 = args[1];  // Ver.2.233.56
    /* Ver.2.735.107 -> */
    if(self.hasEqn_arg(arg1)){  // Ver.2.233.56
      isDefined_x0 = true;  // Ver.2.843.149
      arr_x = get_arr_x(arg1, len_i);  // Ver.2.233.56  // Ver.2.237.56
    }
    else if(self.has0_arg(arg1) || self.isUndef_arg(arg1)){
      arr_x = math_mat.zeros2d(len_i, 1);
    }
    else{
      throw msgErr;
    }
    /* -> Ver.2.816.132 */
    /* Ver.2.815.132 -> */
    // args
    var is = 3;
    is -= 1;  // Ver.2.816.132
    var argH = args[is+0];
    var argN = args[is+1];
    var argE = args[is+2];
    var argF = args[is+3];
    var argR = args[is+4];
    if(isNewtonian){
      if(!(self.hasVars(argH, argN, argE, argF, argR))){
        throw msgErr;
      }
    }
    else{
      if(!(self.hasVars(argH))){
        throw msgErr;
      }
    }
    /* -> Ver.2.815.132 */
    len_i = arr_x.length;  // Ver.2.739.107
    /* -> Ver.2.735.107 */
    var len_j = (isNewtonian)? len_i+1: len_i;  // Ver.2.844.152
    var J = math_mat.init2d(len_i, len_j);  // Ver.2.844.152
    // x0
    var x0 = init_x0(arr_x, names, ids_buffer);  // Ver.2.233.56
    /* Ver.2.740.107 -> */
    var store_x = function(j){
      var hasJ = !(isNaN(j));
      if(isAuto_args){
        var arr = DATA.vec2arr(x0, false);
        if(hasJ){
          arr[j][0] = x1[j];
        }
        self.store_var(name_x, DATA.tree_mat(arr), scopes, ids_buffer);
      }
      else{
        for(var i=0; i<len_i; ++i){
          var name_var = names[i];
          var num = (hasJ && i === j)? x1[i]: x0[i];
          self.store_var(name_var, DATA.num2tree(num), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        }
      }
    };
    /* -> Ver.2.740.107 */
    // x1
    var dx = [];
    var x1 = [];
    // f0
    var get_f = null;
    var i0 = [];
    var j0 = [];
    var f0 = [];
    var checkError = options.checkError && !(isNewtonian);  // Ver.2.323.78
    var step = function(){
      // x0
      store_x();  // Ver.2.740.107
      /* Ver.2.844.152 -> */
      // dx
      for(var i=0; i<len_i; ++i){
        /* Ver.2.321.78 -> */
        /* Ver.1.3.1 */
        var hc = self.get_hc(options, x0[i], argH, "dxJ");  // Ver.2.815.132
        var hcr = hc.r;
        var hci = hc.i;
        dx[i] = DATA.num(hcr, hci);
        /* -> Ver.2.321.78 */
      }
      // x1
      for(var i=0; i<len_i; ++i){
        var x0ic = x0[i].com;
        var dxic = dx[i].com;
        x1[i] = DATA.num(x0ic.r+dxic.r, x0ic.i+dxic.i);
      }
      /* -> Ver.2.844.152 */
      // f0
      var tree = self.tree_eqn2tree(data, tree_eqn);
      var arr_f = tree.mat.arr;
      get_f = get_f || make_get_f_from_arr_f0(arr_f, len_i, i0, j0);
      for(var i=0; i<len_i; ++i){
        f0[i] = get_f(arr_f, i);
      }
      // J
      for(var j=0; j<len_i; ++j){
        store_x(j);  // Ver.2.740.107
        var tree = self.tree_eqn2tree(data, tree_eqn);
        var arr_f1 = tree.mat.arr;
        for(var i=0; i<len_i; ++i){
          var f1i = get_f(arr_f1, i);
          /* Ver.2.323.78 -> */
          var num = unit["BRd"](options, unit["BRs"](options, f1i, f0[i]), dx[j]);  // Ver.2.321.78
          if(checkError){
            var dxj = dx[j];
            num.err.r = dxj.com.r;
            num.err.i = dxj.com.i;
          }
          J[i][j] = num;
          /* -> Ver.2.323.78 */
        }
      }
    };
    if(isNewtonian){
      // Niteration
      var Niteration = (argN && argN.com)? Math.round(argN.com.r): 1;  // 0 enabled  // Ver.2.205.46 floor -> round
      // epsN
      var epsN = (argE && argE.com)? argE.com.r: self.options.epsN;  // 0 enabled  // Ver.2.815.132
      // isRelative_epsN
      var isRelative_epsN = (argF && argF.com)? argF.com.r: self.options.isRelative_epsN;  // 0||not0  // Ver.2.815.132
      /* Ver.2.408.86 -> */
      // useRetry
      var useRetry = (argR && argR.com)? argR.com.r: self.options.useRetry;  // 0||not0  // Ver.2.815.132
      var x0_retry = (useRetry)? self.entry.def.newClone(x0): null;  // Ver.2.740.108
      var counter_retry = 0;
      /* -> Ver.2.408.86 */
      /* Ver.2.834.140 -> */
      var reset_x0 = function(){
        for(var i=0; i<len_i; ++i){
          var num = x0[i];
          var ncr = num.com.r || 1;  // Ver.2.740.108
          var nci = num.com.i || ((options.useComplex)? 1: 0);  // Ver.2.740.108
          if(ncr){
            num.com.r = ncr*(Math.random()*2-1)*counter_retry;
          }
          if(nci){
            num.com.i = nci*(Math.random()*2-1)*counter_retry;
          }
        }
      };
      /* -> Ver.2.834.140 */
      var arr_mdx = null;
      for(var n=0; n<Niteration; ++n){
        step();
        for(var i=0; i<len_i; ++i){
          J[i][len_i] = f0[i];  // Ver.2.844.152
        }
        /* Ver.2.834.140 -> */
        if(counter_retry){
          math.shuffle_FY(J);  // Ver.2.836.141
        }
        /* -> Ver.2.834.140 */
        arr_mdx = math_mat.gaussian(options, J);
        /* Ver.2.739.107 -> */
        // update
        for(var i=0; i<len_i; ++i){
          var mdxi = DATA.arr2obj_i(arr_mdx, i);
          x0[i] = unit["BRs"](options, x0[i], mdxi);
        }
        /* -> Ver.2.739.107 */
        // check convergence
        /* Ver.2.309.77 -> */
        /* Ver.2.271.62 -> */
        var cr_norm = math_mat.arr2norm(options, arr_mdx);  // Ver.2.237.56  // Ver.2.845.152
        var epsn = (isRelative_epsN)? epsN*math_mat.vec2norm(options, x0): epsN;  // Ver.2.237.56 x0: vectorc  // Ver.2.845.152
        /* Ver.2.408.86 -> */
        var isBreak = false;
        if(isNaN(cr_norm)){
          var isLast_iteration = (n === Niteration-1);  // Ver.2.410.86
          if(useRetry && !(isLast_iteration)){  // Ver.2.410.86
            ++counter_retry;
            x0 = self.entry.def.newClone(x0_retry);
            reset_x0();  // Ver.2.834.140
          }
          else{
            isBreak = true;
          }
        }
        else if(cr_norm < epsn){
          isBreak = true;
        }
        /* -> Ver.2.408.86 */
        if(isBreak) break;  // last to share static_scopes2d_array
        /* -> Ver.2.271.62 */
        /* -> Ver.2.309.77 */
      }
      if(arr_mdx){
        if(options.checkError && argN && argN.com){
          for(var i=0; i<len_i; ++i){
            var mdxi = DATA.arr2obj_i(arr_mdx, i);
            var x0ie = x0[i].err;
            x0ie.r = Math.max(Math.abs(mdxi.com.r), x0ie.r);
            x0ie.i = Math.max(Math.abs(mdxi.com.i), x0ie.i);
          }
        }
      }
      _tree = DATA.tree_mat(DATA.vec2arr(x0, isRow));  // Ver.2.234.56  // Ver.2.237.56  // Ver.2.844.152
    }
    else{
      step();
    /* -> Ver.2.29.15 */
      _tree = DATA.tree_mat(J);
    }
    /* Ver.2.739.107 -> */
    if(isAuto_args){
      self.del_scope_sw("vars", name_x, scopes, ids_buffer);
    }
    /* -> Ver.2.739.107 */
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
  if(rightArr && self.hasElem_arr(rightArr)){  // Ver.2.286.69
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
  var prop = tagObj.val;  // Ver.2.286.69
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  if(rightArr && ((prop.substring(0, 4) === "size")? true: self.hasElem_arr(rightArr))){  // Ver.2.286.69
    /* Ver.2.176.43 -> */
    /* Ver.2.179.44 -> */
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
/* Ver.2.285.67 -> */
My_entry.operation.prototype.get_arr00_isSEe = function(arr){
  var self = this;
  var BT = self.config.BT;
  return ((self.has1elem_tag(arr, BT.SEe))? arr[0][0]: null);
};
My_entry.operation.prototype.get_tree_SEe_arr00 = function(tree){
  var self = this;
  var BT = self.config.BT;
  var arr = self.get_tagVal(tree, "mat", "arr");
  return self.get_arr00_isSEe(arr);
};
/* -> Ver.2.285.67 */
My_entry.operation.prototype.tree2tree_eqn = function(data, tree){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var BT = self.config.BT;
  /* Ver.2.260.61 -> */
  var _tree = null;
  var isMat = tree.mat;
  /* Ver.2.288.71 -> */
  var tree_eqn = ((isMat)? self.get_tree_SEe_arr00(tree): null) || tree;  // (=<f || =<f(x)=>) || ((args)=<tree_eqn || ()=<tree_eqn) -> tree_eqn
  var isSEe = tree_eqn[BT.SEe];
  if(isSEe){
    var msgErr = (isMat)? "": "Invalid =<eqn";
    _tree = self.restore_eqn_tree(tree_eqn, scopes, null, null, null, true, msgErr);  // NG: =<(x)=<f(x)
  }
  else if(isMat){
    _tree = tree;
  }
  else{
    throw "Invalid =<eqn";
  }
  /* -> Ver.2.288.71 */
  /* -> Ver.2.260.61 */
  return _tree;
};
/* Ver.2.289.71 */
My_entry.operation.prototype.tree_mat2tree_REe = function(data, tree, isREee){
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  var tree_SEe = self.get_tree_SEe_arr00(tree);  // Ver.2.284.67  // Ver.2.285.67
  if(tree_SEe){
    /* f(x)=<x,g(x)=<-x,h(x)=<x*x; A=<((x)=<x,(x)=<-x,(x)=<x*x:=<f,=<g,=<h); A[0][1]=>f,f(3)=>:A[1][1]=>f,f(3)=>; */
    var tree_REe = self.tree_SEe2REe(tree_SEe);
    var symbol = self.get_symbol(tree_REe[BT.REe], true);  // Ver.2.288.70
    _tree = (symbol)? self.tree2tree_eqn_AtREe(data, tree_REe, isREee): tree_REe;  // Ver.2.288.70
  }
  else{
    _tree = tree;  // Ver.2.284.67
  }
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
  var isMat = tree.mat;  // Ver.2.284.67
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
  else if(isMat){  // Ver.2.284.67
    _tree = self.tree_mat2tree_REe(data, tree, isREee);  // Ver.2.289.71
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
/* Ver.2.833.140 -> */
My_entry.operation.prototype.tree2tree_eqn_AtSEe = function(tree, scopes){
  var self = this;
  var BT = self.config.BT;
  var _tree = null;
  var isSEe = tree[BT.SEe];
  var hasArgs = true;
  var name = self.get_symbol(isSEe, hasArgs);
  if(name){
    var ids = isSEe.ids;
    var eqns = self.get_scope_RE_sw("eqns", name, scopes, ids);
    _tree = eqns && eqns[name];
    if(_tree){
      if(isSEe.isSEee){
        _tree = self.entry.def.newClone(_tree);
        self.inherit_ids_sw(BT.SEe, _tree, ids);
      }
    }
    else{
      throw "Undef eqn("+name+")";
    }
  }
  return _tree;
};
My_entry.operation.prototype.resolve_tree = function(tree, scopes){
  var self = this;
  var BT = self.config.BT;
  var arr = tree.mat.arr;
  for(var i=0, len_i=arr.length; i<len_i; ++i){
    var arri = arr[i];
    for(var j=0, len_j=arri.length; j<len_j; ++j){
      var isSEe = arri[j][BT.SEe];
      if(isSEe){
        var tree_eqn = self.tree2tree_eqn_AtSEe(arri[j], scopes);
        if(tree_eqn){
          arri[j] = tree_eqn;
        }
      }
    }
  }
  return self;
};
/* -> Ver.2.833.140 */
My_entry.operation.prototype.FNhX = function(data, rightArr, tagObj, len_j0, callback_FNh, isRX){  // Ver.2.242.56
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;  // Ver.2.757.114
  var _tree = null;
  var args = DATA.arr2args(rightArr);
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
    var name_var = name_arg;  // Ver.2.812.131
    /* Ver.2.242.56 -> */
    if(isRX){
      if(args_eqn && args_eqn.length > 1) throw "Invalid RX(=<args.length<=1)";  // Ver.2.812.131
    }
    else{
      if(!(name_var) || (args_eqn && args_eqn.length !== 1)) throw "Invalid FNh(=<args.length=1)";  // Ver.2.812.131
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
/* Ver.2.381.86 */
My_entry.operation.prototype.wrapper_useDummy = function(name_var, scopes, ids_buffer, callback){
  var self = this;
  var DATA = self.entry.DATA;
  var scope0 = self.get_scope0(scopes, ids_buffer);
  var tree_var = scope0.vars[name_var];
  scope0.vars[name_var] = DATA.tree_num(0, 0);
  callback(scope0.vars[name_var]);
  if(tree_var){
    scope0.vars[name_var] = tree_var;
  }
  else{
    delete scope0.vars[name_var];
  }
  return self;
};
My_entry.operation.prototype.RX = function(data, rightArr, tagObj){
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var callback_FNh = function(args, ids_buffer, name_var, tree_eqn){  // Ver.2.231.56  // Ver.2.234.56
    var _tree = null;
    var tree = self.tree_eqn2tree_AtREe(data, args[1]);  // Ver.2.271.62
    var b = args[2];
    /* Ver.2.823.137 -> */
    var arg3 = args[3];
    var tree_eqn_break = (arg3)? self.tree2tree_eqn(data, arg3): null;
    if(tree_eqn_break){
      var arg = self.get_args(tree_eqn_break);
      if(arg && arg.length){
        tree = null;
      }
    }
    /* -> Ver.2.823.137 */
    if(tree && b.com){  // Ver.2.271.62
      var br = Math.round(b.com.r);  // Ver.2.205.46 floor -> round
      /* Ver.2.30.15 -> */
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
      self.wrapper_useDummy("__n__", scopes, ids_buffer, function(tree_dummy){  // Ver.2.381.86
        RX(function(i){
          var _isBreak = false;  // Ver.2.271.62
          tree_dummy.mat.arr[0][0].com.r = i;  // Ver.2.381.86 change_scopes_directly
          if(name_var){  // Ver.2.741.110
            self.store_var(name_var, tree, scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
          }
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
    /* Ver.2.857.158 -> */
    /* Ver.1.3.1 */
    var a = args[1];
    var nd = args[2] || DATA.num(1, 0);
    if(a && a.com && nd && nd.com && (nd.com.r >= 0 && nd.com.r%1 === 0 && nd.com.i === 0)){
      var nthd = nd.com.r;
    /* -> Ver.2.857.158 */
      var h0c = self.get_hc(options, a, args[3], "dxD");
      var h0cr = h0c.r;
      var h0ci = h0c.i;
      var num_8 = DATA.num(8, 0);
      /* Ver.2.369.86 -> */
      var orderD = (nthd < 3)? 4: 2;
      if(tagObj.val.order){
        orderD = tagObj.val.order;
      }
      else if(options.orderD === 2 || options.orderD === 4){
        orderD = options.orderD;
      }
      /* -> Ver.2.369.86 */
      var get_newX = function(x, cr, ci){
        var _newX = DATA.newNum(x);
        var com = _newX.com;
        com.r += cr;
        com.i += ci;
        return _newX;
      };
      var calc_f = function(x, cr, ci){
        self.store_var(name_var, DATA.num2tree(get_newX(x, cr, ci)), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        return DATA.arr2num(self.tree_eqn2tree(data, tree_eqn).mat.arr);
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
        /* Ver.2.369.86 -> */
        var DX = DX_order4;
        if(orderD === 2){
          DX = DX_order2;
        }
        /* -> Ver.2.369.86 */
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
  var math = self.entry.math;  // Ver.2.806.130
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
      /* Ver.2.806.130 -> */
      var type = args[4];
      type = (type && type.com)? type.com.r: null;
      type = type || 0;
      /* -> Ver.2.806.130 */
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
      /* Ver.2.369.86 -> */
      var orderI = 4;
      if(tagObj.val.order || tagObj.val.order === 0){  // Ver.2.806.130
        orderI = tagObj.val.order;
      }
      else if(options.orderI === 2 || options.orderI === 4){
        orderI = options.orderI;
      }
      /* -> Ver.2.369.86 */
      var calc_f = function(cr, ci){
        self.store_var(name_var, DATA.tree_num(cr, ci), scopes, ids_buffer);  // Ver.2.31.17  // Ver.2.225.53
        return DATA.arr2num(self.tree_eqn2tree(data, tree_eqn).mat.arr);
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
      /* Ver.2.806.130 -> */
      var DI_quadrature_DE = function(){
        var _sum = DATA.num(0, 0);
        var pih = Math.PI/2;
        var Nh = Math.round(N/2);
        var hq = 10/N;
        var arr_x = [
          [],
          [function(t){return math.tanh(pih*math.sinh(t));}, function(t){return pih*math.cosh(t)/Math.pow(math.cosh(pih*math.sinh(t)), 2);}],
          [function(t){return Math.exp(t-Math.exp(-t));}, function(t){return x(t)*(1+Math.exp(-t));}],
          [function(t){return Math.exp(pih*math.sinh(t));}, function(t){return x(t)*pih*math.cosh(t);}],
          [function(t){return math.sinh(pih*math.sinh(t));}, function(t){return math.cosh(pih*math.sinh(t))*pih*math.cosh(t);}]
        ];
        /* Ver.2.806.131 -> */
        if(!(arr_x[type])){
          throw "Invalid _i0(,,,,type)";
        }
        /* -> Ver.2.806.131 */
        else{
          var hasM = math.isFIm(acr, bcr) || math.isIFm(acr, bcr) || math.isIIm(acr, bcr);
          if(hasM){
            var wcr = acr;
            var wci = aci;
            acr = bcr;
            aci = bci;
            bcr = wcr;
            bci = wci;
          }
          if(type === 0){
            if(math.isFI(acr, bcr) || math.isIF(acr, bcr)){
              type = 3;
            }
            else if(math.isII(acr, bcr)){
              type = 4;
            }
            else{
              type = 1;
            }
          }
          /* Ver.2.814.131 -> */
          var aqcr = 0;
          var aqci = 0;
          var bqcr = 0;
          var bqci = 0;
          var wq = null;
          if(math.isIF(acr, bcr)){
            aqcr = -1;
            bqcr = bcr;
            bqci = bci;
          }
          else if(type === 2 || type === 3){
            aqcr = 1;
            bqcr = acr;
            bqci = aci;
          }
          else if(type === 4){
            aqcr = 1;
          }
          else{
            aqcr = (bcr-acr)/2;
            aqci = (bci-aci)/2;
            bqcr = (bcr+acr)/2;
            bqci = (bci+aci)/2;
            wq = DATA.num(aqcr, aqci);
          }
          /* -> Ver.2.814.131 */
          var x = arr_x[type][0];
          var xd = arr_x[type][1];
          var err = 0;
          for(var k=-Nh; k<=Nh; ++k){
            var t = k*hq;
            /* Ver.2.814.131 -> */
            var xt = x(t);
            var phi = calc_f(aqcr*xt+bqcr, aqci*xt+bqci);
            var y = unit["BRm"](options, phi, DATA.num(xd(t), 0));
            if(wq){
              y = unit["BRm"](options, y, wq);
            }
            /* -> Ver.2.814.131 */
            var ycr = y.com.r;
            var yci = y.com.i;
            if(isFinite(ycr) && isFinite(yci)){
              _sum = unit["BRa"](options, _sum, y);
              if(k === -Nh || k === Nh){
                err += ycr;
              }
            }
          }
          _sum = unit["BRm"](options, _sum, DATA.num(hq, 0));
          if(hasM){
            _sum.com.r = -_sum.com.r;
            _sum.com.i = -_sum.com.i;
          }
          if(options.checkError){
            _sum.err.r = Math.max(Math.abs(err*hq), _sum.err.r);
          }
        }
        return _sum;
      };
      /* -> Ver.2.806.130 */
      /* Ver.2.819.132 -> */
      var DI_equal = function(){
        var fa = calc_f(acr, aci);
        var facr = fa.com.r;
        var faci = fa.com.i;
        var isI_a = math.isInf(acr) || math.isInf(aci);
        var isI_f = math.isInf(facr) || math.isInf(faci);
        return ((isI_a && isI_f)? DATA.num(NaN, NaN): DATA.num(0, 0));
      };
      /* -> Ver.2.819.132 */
      /* Ver.2.369.86 -> */
      var DI = DI_order4;
      /* Ver.2.819.132 -> */
      if(acr === bcr && aci === bci){
        DI = DI_equal;
      }
      /* -> Ver.2.819.132 */
      else if(orderI === 2){
        DI = DI_order2;
      }
      /* Ver.2.806.130 -> */
      else if(orderI === 0){
        DI = DI_quadrature_DE;
      }
      /* -> Ver.2.806.130 */
      /* -> Ver.2.369.86 */
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
  if(rightArr && self.hasElem_arr(rightArr)){  // Ver.2.286.69
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
if(rightArr && ((isFN0)? true: self.hasElem_arr(rightArr))){  // Ver.2.286.69
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
  if(rightArr && self.hasElem_arr(rightArr)){  // Ver.2.286.69
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
  if(rightArr && self.hasElem_arr(rightArr)){  // Ver.2.286.69
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
          /* Ver.2.304.77 -> */
          var leftCom = left.com;
          var rightCom = right.com;
          if(leftCom && rightCom){
            var lcr = leftCom.r;
            var lci = leftCom.i;
            var rcr = rightCom.r;
            var rci = rightCom.i;
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
          else{
            throw "Invalid operation("+prop+")";
          }
          /* -> Ver.2.304.77 */
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
  /* Ver.2.279.65 -> */
/*
  var buffer_vars = {};
  var buffer_eqns = {};
  var args_eqns = {};
  var args_vars = {};
  var args_bas = {};
  var obj = self.restore_args_AtREe(data, self.config.symbol.anonymous, [name], [argi], null, args_eqns, args_vars, args_bas, null, null, ids_buffer);
*/
  var _isEqn = false;  // Ver.2.286.68
  var store_eqn = function(isSEe){
    _isEqn = true;  // Ver.2.286.68
    if(isSEe){
      var tree = self.tree_eqn2tree_AtSEe(data, argi);  // Ver.2.255.59  // Ver.2.257.60 inherit_ids not-supported
      self.store_eqn(name, tree, scopes, ids_buffer);
    }
    else{
      throw "Invalid URh-args."+name;
    }
  };
  var isSEe = argi[BT.SEe];
  if(num_escape){
    store_eqn(isSEe);
  }
  else{
    if(isSEe){
      var isSEe_dynamic = (self.useStrict)? false: isSEe;
      store_eqn(isSEe_dynamic);
    }
    else{
      var tree = DATA.num2tree(argi);  // Ver.2.279.65
      self.store_var(name, tree, scopes, ids_buffer);  // Ver.2.226.55
    }
  }
  /* -> Ver.2.279.65 */
  return _isEqn;  // Ver.2.286.68
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
  if(leftArr && self.hasElem_arr(leftArr) && args_eqn){  // Ver.2.286.69
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
    if(name_x){  // Ver.2.736.107
      buffer_eqns[name_x] = self.tree_REe2SEe(self.restore_eqn(name_x, scopes, ids_buffer));  // Ver.2.257.59  // Ver.2.273.65
    }
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
        _arr[i][j] = DATA.arr2num(arr_);
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
    /* Ver.2.286.68 -> f=<x,x=1,(x,=<x+1).map((f)=<f),(x,=<x+1,-x,=<-x+1).filter0((f)=<hass(=<f)),x,f,f() */
    var scope0 = self.get_scope0(scopes, ids_buffer);
    var update_scope0 = function(isEqn_stored){
      var sw = (isEqn_stored)? "vars": "eqns";
      var buffer = (sw === "eqns")? buffer_eqns: buffer_vars;
      var name = names.x;
      var sw_tree = buffer[name];
      if(sw_tree){
        scope0[sw][name] = sw_tree;  // cloned@restore
      }
      else{
        delete scope0[sw][name];
      }
    };
    /* -> Ver.2.286.68 */
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
        var isEqn_stored = self.store4URh_sw(data, num_escape, names.x, arr[i][j], scopes, ids_buffer);  // Ver.2.257.59  // Ver.2.257.60  // Ver.2.286.68
        update_scope0(isEqn_stored);  // Ver.2.286.68
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
  if(leftArr && self.hasElem_arr(leftArr)){  // Ver.2.286.69
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
  if(leftArr && self.hasElem_arr(leftArr)){  // Ver.2.286.69
    if(options.useMatrix){
      var arr = [];
      var len_i = leftArr.length;
      if(options.useComma){
        for(var i=0; i<len_i; ++i){
          var left = DATA.arr2obj_i(leftArr, i);
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
      var left = DATA.arr2num(leftArr);
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
/* Ver.2.752.113 */
My_entry.operation.prototype.PU = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var is = i0;
  var ie = i0+1;
  var prop = tagObj.val;
  var rightArr = self.get_tagVal(trees[ie], "mat", "arr");
  /* Ver.2.756.114 -> */
  if(rightArr){
    var Np = Number(prop);
    if(Np === 1){
      len = rightArr.length;
    }
    else if(Np === 2){
      var lens = math_mat.get_lens(rightArr);
      len = lens.j;
    }
    else if(Np === 3){
      len = math_mat.get_Nelements(rightArr);
    }
    else{
      throw "Invalid ####";
    }
    tree = DATA.tree_num(len, 0);
  }
  /* -> Ver.2.756.114 */
  else{
    throw "Invalid #null";
  }
  self.feedback2trees(data, is, ie, tree);
  return self;
};
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
  if(!(leftArr) && rightArr && self.hasElem_arr(rightArr)){  // Ver.2.286.69
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
          var right = DATA.arr2obj_i(rightArr, i);
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
      var right = DATA.arr2num(rightArr);
      tree = DATA.num2tree(callback(right));
    }
    /* -> Ver.2.73.29 */
    /* -> Ver.2.74.29 */
    self.feedback2trees(data, is, ie, tree);
  }
  return self;
};
/* Ver.2.286.69 -> */
My_entry.operation.prototype.hasElem_arr = function(arr){
  var self = this;
  if(arr && arr.length === 0) throw "Invalid () operation";
  return arr;
};
My_entry.operation.prototype.hasElems_LR = function(leftArr, rightArr){
  var self = this;
  return (self.hasElem_arr(leftArr) && self.hasElem_arr(rightArr));
};
/* -> Ver.2.286.69 */
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
  if(leftArr && rightArr && self.hasElems_LR(leftArr, rightArr)){  // Ver.2.286.69
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
    var left = DATA.arr2num(leftArr);
    var right = DATA.arr2num(rightArr);
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
    if(leftArr && rightArr && self.hasElems_LR(leftArr, rightArr)){  // Ver.2.286.69
      _tree = self.switch_unitBR(tagName, options, leftArr, rightArr);
    }
    return _tree;
  };
  /* Ver.2.74.29 -> */
  self.callbacks_mat.BRelse = function(tagName, tagObj, leftArr, rightArr, callback){
    var _tree = null;
    if(leftArr && rightArr && self.hasElems_LR(leftArr, rightArr)){  // Ver.2.286.69
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
            var left = DATA.arr2obj_i(leftArr, il);
            var right = DATA.arr2obj_i(rightArr, ir);
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
        var left = DATA.arr2num(leftArr);
        var right = DATA.arr2num(rightArr);
        _tree = DATA.num2tree(callback(left, right));
      }
      /* -> Ver.2.73.29 */
    }
    return _tree;
  };
  /* Ver.2.847.153 */
  self.callbacks_mat.BRrl_mat = function(tagName, tagObj, leftArr, rightArr){
    var prop = tagObj.val;
    var isEqual = math_mat.check_size(options, leftArr, rightArr);
    if(isEqual){
      var len_i = leftArr.length;
      for(var i=0; i<len_i; ++i){
        for(var j=0, len_j=leftArr[i].length; j<len_j; ++j){
          isEqual = unit["FN"]("===", options, leftArr[i][j], rightArr[i][j]).com.r;
          if(!(isEqual)) break;
        }
        if(!(isEqual)) break;
      }
    }
    return DATA.num2tree(DATA.num((prop === "====")? isEqual: !(isEqual), 0));
  };
  self.callbacks_mat.BRlX =  // Ver.2.168.41
  self.callbacks_mat.BRbs =
  self.callbacks_mat.BRba =
  self.callbacks_mat.BRbx =
  self.callbacks_mat.BRbo =
  self.callbacks_mat.BRcn =
  self.callbacks_mat.BRrl = function(tagName, tagObj, leftArr, rightArr){
    var prop = tagObj.val;  // Ver.2.847.153
    var callback = function(left, right){
      return unit["FN"](prop, options, left, right);
    };
    return self.callbacks_mat[(prop === "====" || prop === "<<<>>>")? "BRrl_mat": "BRelse"](tagName, tagObj, leftArr, rightArr, callback);  // Ver.2.847.153
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
  /* Ver.2.409.86 -> */
  if(!(_tree) && tagName !== "BRe"){
    throw arguments;
  }
  /* -> Ver.2.409.86 */
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
  /* Ver.2.409.86 -> */
  if(!(_tree)){
    throw arguments;
  }
  /* -> Ver.2.409.86 */
  return _tree;
};
My_entry.operation.prototype.BRpp = function(data, i0, tagName, tagObj){
  var self = this;
  var tree = self.BR_original_RA(data, i0, tagName, tagObj);
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
  return self;
};
My_entry.operation.prototype.BRsa = function(data, i0, tagName, tagObj){
  var self = this;
  var sw_tagName = (tagObj.val === "-")? "BRs": "BRa";
  var tree = self.BR_original(data, i0, sw_tagName, tagObj);
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
My_entry.operation.prototype.inherit_constant = function(sw, name, tree, scopes, ids, opt_isEscaped){  // Ver.2.350.86
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
/* Ver.2.291.71 */
My_entry.operation.prototype.store_mutex = function(sw, name, tree, scopes, ids, isEscaped){  // Ver.2.249.57
  var self = this;
  var DATA = self.entry.DATA;  // Ver.2.284.67
  var scope0 = self.get_scope0(scopes, ids);
  var isEqn = (sw === "eqns");
  /* Ver.2.797.127 -> */
  if(!(scope0)){
    throw "Invalid reference of scopes."+sw+"."+name;
  }
  /* -> Ver.2.797.127 */
  /* Ver.2.250.57 -> */
  if(self.useMutex){
    delete scope0[(isEqn)? "vars": "eqns"][name];
  }
  /* -> Ver.2.250.57 */
  /* Ver.2.303.73 -> */
  var isReset = true;
  var isArray = false;  // Ver.2.303.74
  var isExisted = scope0[sw][name];
  if(isExisted){
    var obj_ref = DATA.getProp_tree(isExisted, "obj_ref");
    if(obj_ref){
      sw = obj_ref.sw;
      name = obj_ref.name;
      ids = [obj_ref.id0];
      scope0 = self.get_scope0(scopes, ids);
    }
    if(tree){
      var isBuffer4ref = DATA.getProp_tree(tree, "isBuffer");
      if(isBuffer4ref){
        isReset = false;
      }
      else{
        isArray = DATA.getProp_tree(tree, "isArray");  // Ver.2.303.74
        DATA.setProp_tree(tree, "obj_ref", obj_ref);  // inherit obj_ref
      }
    }
  }
  if(isReset){
    /* Ver.2.303.74 -> */
    self.check_symbol(name);  // Ver.2.294.72
    self.inherit_constant(sw, name, tree, scopes, ids, isEscaped);  // Ver.2.249.57  // Ver.2.254.59  // Ver.2.350.86
    if(isArray){
      scope0[sw][name].mat.arr = tree.mat.arr;
    }
    else{
      DATA.setProp_tree(tree, "isSE", true);  // Ver.2.284.67 representation of reference
      scope0[sw][name] = tree;  // Ver.2.266.62
    }
    /* -> Ver.2.303.74 */
  }
  /* -> Ver.2.303.73 */
  return self;
};
/* Ver.2.31.17 -> */
My_entry.operation.prototype.restore_var = function(name, scopes, ids){
  var self = this;
  var _tree = null;
  var vars = self.get_scope_RE_sw("vars", name, scopes, ids);
  if(vars){
    var tree = vars[name];
    _tree = (tree)? self.entry.def.newClone(tree): null;  // separate from trees  // clone for concatenation x=2;(x,2x:3x,4x)
  }
  return _tree;
};
My_entry.operation.prototype.store_var = function(name, tree, scopes, ids, isEscaped){  // Ver.2.249.57
  var self = this;
  self.resolve_tree(tree, scopes);  // Ver.2.833.140
  return self.store_mutex("vars", name, tree, scopes, ids, isEscaped);  // Ver.2.291.71
};
/* -> Ver.2.31.17 */
/* Ver.2.297.72 */
My_entry.operation.prototype.get_index_arr = function(i, len, isColumn){
  var self = this;
  var _i = null;
  var hasArea0 = (i%1 === 0);
  var isInArea = (i >= -len && i < len);
  if(hasArea0 && isInArea){
    _i = (i+len)%len;
  }
  else{
    throw "Invalid reference of array"+((isColumn)? "[]": "")+"["+i+"]";  // Ver.2.421.88
  }
  return _i;
};
/* Ver.2.76.29 -> */
My_entry.operation.prototype.restore_arr = function(arr, ref){
  var self = this;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var _arr = [];
  var _arri = _arr;
  var arri = arr;
  var len_ref = ref.length;
  if(len_ref === 2 && typeof ref[0] === "undefined"){  // Ver.2.79.31  // Ver.2.747.112  // Ver.2.768.117
    /* Ver.2.768.116 -> */
    if(arr.length === 1){
      var j_ref = self.get_index_arr(ref[1], arr[0].length, true);  // Ver.2.297.72
      _arr[0] = [arr[0][j_ref]];
    }
    else{
      var tarr = math_mat.transpose(null, arr);
      /* Ver.2.78.31 -> */
      var j_ref = self.get_index_arr(ref[1], tarr.length, true);  // Ver.2.297.72
      var tarrj = tarr[j_ref];
      /* -> Ver.2.78.31 */
      for(var i=0, len_i=tarrj.length; i<len_i; ++i){
        _arr[i] = [tarrj[i]];
      }
    }
    /* -> Ver.2.768.116 */
  }
  /* Ver.2.79.32 -> */
  /* Ver.2.78.31 -> */
  else if(len_ref < 3){
    ref.forEach(function(i_ref0, i){
      var i_ref = self.get_index_arr(i_ref0, arri.length, (i === 1));  // Ver.2.297.72  // Ver.2.421.88
      _arri[0] = (i === len_ref-1)? arri[i_ref]: [];
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
    var di = (typeof ref[2] === "undefined")? _di: ref[2];  // Ver.2.373.86  // Ver.2.747.112  // Ver.2.768.117
    var dj = (typeof ref[3] === "undefined")? _dj: ref[3];  // Ver.2.373.86  // Ver.2.747.112  // Ver.2.768.117
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
  var di = (typeof ref[2] === "undefined")? _di: ref[2];  // Ver.2.373.86  // Ver.2.747.112  // Ver.2.768.117
  var dj = (typeof ref[3] === "undefined")? _dj: ref[3];  // Ver.2.373.86  // Ver.2.747.112  // Ver.2.768.117
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
  var DATA = self.entry.DATA;  // Ver.2.757.114
  var _tarr = math_mat.transpose(null, _arr);
  var tarr = math_mat.transpose(null, arr);
  /* Ver.2.421.88 -> */
  var tarr_stored = null;
  if(tarr.length === 1){
    tarr_stored = DATA.arr2args(tarr);
  }
  else{
    throw "Invalid store array[]["+ref[1]+"]";
  }
  /* -> Ver.2.421.88 */
  /* Ver.2.78.31 -> */
  var j_ref = self.get_index_arr(ref[1], ((_tarr)? _tarr.length: 0), true);  // Ver.2.421.88
  if(_tarr[j_ref].length === tarr_stored.length){  // Ver.2.421.88
    _tarr[j_ref] = tarr_stored;
    var _ttarr = math_mat.transpose(null, _tarr);
    for(var i=0, len_i=_ttarr.length; i<len_i; ++i){
      for(var j=0, len_j=_ttarr[i].length; j<len_j; ++j){
        _arr[i][j] = _ttarr[i][j];
      }
    }
  }
  else{
    throw "Invalid store size of array[]["+ref[1]+"]";  // Ver.2.421.88
  }
  /* -> Ver.2.78.31 */
  return _arr;
};
/* -> Ver.2.76.29 */
My_entry.operation.prototype.store_arr = function(_arr, ref, arr){
  var self = this;
  var DATA = self.entry.DATA;  // Ver.2.757.114
  var _arri = _arr;
  var len_ref = ref.length;
  var arr_stored = null;
  if(len_ref === 1 && arr.length === 1){  // Ver.2.421.88
    arr_stored = DATA.arr2args(arr);
  }
  else if(len_ref === 2 && self.has1elem_tag(arr, "com")){  // Ver.2.421.88
    arr_stored = DATA.arr2num(arr);
  }
  else{
    throw "Invalid store array["+ref.join("][")+"]";  // Ver.2.421.88
  }
  /* Ver.2.78.31 -> */
  for(var i=0; i<len_ref; ++i){
    var i_ref = self.get_index_arr(ref[i], ((_arri)? _arri.length: 0), (i === 1));  // Ver.2.421.88
    if(i === len_ref-1){
      if(_arri[i_ref].length === arr_stored.length){  // including undefined  // Ver.2.421.88
        _arri[i_ref] = arr_stored;
      }
      else{
        throw "Invalid store size of array["+ref.join("][")+"]";  // Ver.2.421.88
      }
    }
    _arri = _arri[i_ref];
  }
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
    _tree = (isSEe && !(isSEe.arg))? self.tree_SEe2REe(tree_eqn): tree_eqn;  // Ver.2.304.74
    _tree = self.tree_eqn2tree(data, _tree, true);
  }
  if(opt_name){
    _tree = self.get_tree_isSE(_tree, opt_name);  // Ver.2.271.62  // Ver.2.282.66  // Ver.2.284.67
  }
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
      _tree = self.get_tree_SEe_arr00(_tree) || _tree;  // Ver.2.284.67  // Ver.2.285.67
    }
    /* -> Ver.2.277.65 */
  }
  else{
    self.throw_tree(tree);
  }
  return _tree;
};
/* Ver.2.289.71 */
My_entry.operation.prototype.restore_sw = function(name, scopes, ids, isREee){
  var self = this;
  var _tree = self.restore_var(name, scopes, ids);
  if(!(self.useStrict)){
    _tree = _tree || self.restore_eqn(name, scopes, ids, isREee);  // Ver.2.260.61
  }
  return _tree;
};
/* Ver.2.298.72 */
My_entry.operation.prototype.change_scopes_directly = function(data, i0, name, prop, ref){
  var self = this;
  var trees = data.trees;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var _tree = DATA.tree_num(NaN, NaN);
  var rightTree = trees[i0+2];
  var rightArr = self.get_tagVal(rightTree, "mat", "arr");
  var scope = self.get_scope0_RE_sw("vars", name, scopes, ids);  // Ver.2.301.73 first
  if(scope){
    var dot_prop = prop.substring(1);
    var hasArgs = (dot_prop === "unshift" || dot_prop === "push");  // Ver.2.829.139
    if(!(hasArgs)){  // Ver.2.829.139  // Ver.2.830.139
      if(!(rightArr && rightArr.length === 0)){
        throw "Invalid "+dot_prop+"()";
      }
    }
    if(ref && ref.length !== 1){
      throw "Invalid "+dot_prop+"(ref.length<=1)";
    }
    var tree0 = scope[name];
    var isMat0 = tree0.mat;
    if(isMat0){
      /* Ver.2.301.73 -> */
      if(isMat0.isConstant){
        throw "Invalid const var("+name+prop+")";
      }
      /* -> Ver.2.301.73 */
      var arr0 = tree0.mat.arr;
      var len_i0 = arr0.length;
      var i0 = undefined;
      var j0 = undefined;
      if(ref){
        i0 = ref[0];
        j0 = ref[1];
      }
      /* Ver.2.829.139 -> */
      if(hasArgs && rightArr){  // Ver.2.833.140
        if(dot_prop === "unshift" && i0 === -(len_i0+1)){
          arr0.unshift([]);
          i0 = 0;
        }
        else if(dot_prop === "push" && i0 === len_i0){
          arr0.push([]);
          i0 = arr0.length-1;
        }
        else{
          if(len_i0 === 0){
            arr0.push([]);
            len_i0 = arr0.length;
          }
          if(typeof i0 === "undefined"){
            i0 = (dot_prop === "unshift")? 0: len_i0-1;
          }
          else{
            i0 = self.get_index_arr(i0, len_i0);
          }
        }
        /* Ver.2.833.140 -> */
        self.resolve_tree(rightTree, scopes);
        var arr = rightArr;  // Ver.2.830.139
        var len_i = arr.length;  // Ver.2.830.139
        for(var i=0; i<len_i; ++i){
          var arr0i = arr0[i0+i] || [];
          arr0i[dot_prop].apply(arr0i, arr[i]);
          arr0[i0+i] = arr0i;
        }
        /* -> Ver.2.833.140 */
      }
      /* -> Ver.2.829.139 */
      else if(dot_prop === "shift"){
        if(len_i0){
          if(typeof i0 === "undefined"){
            i0 = 0;
          }
          else{
            i0 = self.get_index_arr(i0, len_i0);
          }
          var num = arr0[i0].shift();
          if(num){
            _tree = DATA.num2tree(num);
          }
        }
      }
      else if(dot_prop === "pop"){
        if(len_i0){
          if(typeof i0 === "undefined"){
            i0 = len_i0-1;
          }
          else{
            i0 = self.get_index_arr(i0, len_i0);
          }
          var num = arr0[i0].pop();
          if(num){
            _tree = DATA.num2tree(num);
          }
        }
      }
      /* Ver.2.372.86 */
      else if(dot_prop === "flip"){
        if(len_i0){
          if(typeof i0 === "undefined"){
            arr0.reverse();
            for(var i=0, len=arr0.length; i<len; ++i){
              arr0[i].reverse();
            }
          }
          else{
            i0 = self.get_index_arr(i0, len_i0);
            arr0[i0].reverse();
          }
        }
      }
    }
    else{
      throw "Invalid "+name+prop;
    }
  }
  else{
    throw "Undef var("+name+prop+")";
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
  var isName = !(self.isEscaped_symbol(name));  // Ver.2.280.66  // Ver.2.303.73
  if(!(isSE) && isName){  // Ver.2.260.61  // Ver.2.280.66
    /* Ver.2.298.72 -> */
    var prop = self.get_tagVal(rightTree, "REv", "val");
    if(prop && prop[0] === "."){
      tree = self.change_scopes_directly(data, i0, name, prop, ref);
      ie = i0+2;
      ref = null;
    }
    /* -> Ver.2.298.72 */
    else{
      tree = self.restore_sw(name, scopes, ids);  // Ver.2.289.71
    }
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
        /* Ver.2.277.65 -> div=(x,y)=<x/y,div_curried=(x)=<(y)=<div(x,y),inv_y=div_curried(1) */
        var isREe_dynamic = tree[BT.REe];  // Ver.2.279.65
        if(isREe_dynamic){  // Ver.2.279.65
          tree = self.tree_REe2SEe(tree);  // Ver.2.275.65
        }
        /* -> Ver.2.277.65 */
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
    self.feedback2trees(data, is, ie, tree);
  }
  /* Ver.2.280.66 -> */
  else if(!(self.isBT2tree) && trees.length === 1 && isName){
    throw "Undef var("+name+")";
  }
  /* -> Ver.2.280.66 */
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
        /* Ver.2.350.86 -> */
        var ref = self.get_tagVal(leftArrij, "REv", "ref");
        if(ref){
          tree = self.get_tree_ref(name_var_escaped, tree, ref, scopes, ids);
        }
        /* -> Ver.2.350.86 */
        self.SE_common("vars", tree, leftArrij);  // Ver.2.346.85
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
  if(leftArr && rightArr && self.hasElems_LR(leftArr, rightArr)){  // Ver.2.286.69
    var out = "";
    if(leftArr.length !== rightArr.length) throw "Invalid matching-size(LR)";  // Ver.2.440.90
    var len_i = Math.max(leftArr.length, rightArr.length);
    for(var i=0; i<len_i; ++i){
      var leftArri = leftArr[i];
      var rightArri = rightArr[i];
      if(leftArri && rightArri){
        if(leftArri.length !== rightArri.length) throw "Invalid matching-size(LR)";  // Ver.2.440.90
        var len_j = Math.max(leftArri.length, rightArri.length);
        for(var j=0; j<len_j; ++j){
          var leftArrij = leftArri[j];
          var rightArrij = rightArri[j];
          if(leftArrij && rightArrij){
            /* Ver.2.269.62 -> */
            if((leftArrij.com || leftArrij[BT.SEe]) && self.get_tagVal(rightArrij, "REv", "val")){  // Ver.2.441.90
              out += store_elem(rightArrij, leftArrij);
            }
            else if(self.get_tagVal(leftArrij, "REv", "val") && (rightArrij.com || rightArrij[BT.SEe])){  // Ver.2.441.90
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
    if(scopes[j]){  // Ver.2.797.127
      _scope = scopes[j][n];
    }
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
/* Ver.2.291.71 */
My_entry.operation.prototype.get_ids_RE = function(name, scopes, opt_ids){
  var self = this;
  var _ids = null;
  var ids = opt_ids || self.config.ids0;  // Ver.2.225.53
  if(scopes){
    var len = ids.length;
    for(var i=0; i<len; ++i){
      var idi = ids[i];
      var scopei = self.get_scope0(scopes, [idi]);  // Ver.2.302.73
      if(scopei && (scopei.vars[name] || scopei.eqns[name])){  // Ver.2.797.127
        _ids = [idi];
        break;
      }
    }
  }
  return _ids;
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
      var scopei = self.get_scope0(scopes, [idi]);  // Ver.2.302.73
      if(scopei && scopei[sw] && scopei[sw][name]){  // Ver.2.797.127
        _scope = scopei[sw];
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
    var scope0 = self.get_scope0(scopes, [id0]);  // Ver.2.302.73
    _scope = scope0[sw];
  }
  return _scope;
};
/* -> Ver.2.31.17 */
/* Ver.2.346.85 */
My_entry.operation.prototype.SE_common = function(sw, tree, opt_tree){
  var self = this;
  var DATA = self.entry.DATA;
  if(opt_tree){
    self.inherit_id_tree(tree, opt_tree);  // Ver.2.262.62
  }
  DATA.delProp_tree(tree, "obj_ref");  // Ver.2.343.83
  DATA.delProp_tree(tree, "isBuffer");  // Ver.2.303.74
  if(sw === "vars"){
    DATA.setProp_tree(tree, "isArray", true);  // Ver.2.303.74
  }
  return self;
};
/* Ver.2.350.86 */
My_entry.operation.prototype.get_tree_ref = function(name_var, tree, ref, scopes, ids){
  var self = this;
  var _tree = tree;
  var arr = tree.mat.arr;  // Ver.2.277.65
  /* Ver.2.76.29 -> */
  /* Ver.2.31.17 -> */
  var scope = self.get_scope0_RE_sw("vars", name_var, scopes, ids);
  if(!(scope)) throw "Invalid SEv-scope("+name_var+")";  // x=(,),[x[0][0]=1,]
  var tree_var = self.restore_var(name_var, scopes, ids);  // Ver.2.30.16
  /* -> Ver.2.31.17 */
  if(tree_var){
    var len_ref = ref.length;
    if(len_ref === 2 && typeof ref[0] === "undefined"){  // Ver.2.79.31  // Ver.2.747.112  // Ver.2.768.117
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
    _tree = tree_var;
  }
  else{
    throw "Undef var("+name_var+")";
  }
  /* -> Ver.2.76.29 */
  return _tree;
};
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
        var isSEe_dynamic = tree[BT.SEe];  // Ver.2.277.65  // Ver.2.279.65
        if(tree.mat){
          var ref = self.get_tagVal(leftTree, "REv", "ref");
          if(ref){
            tree = self.get_tree_ref(name_var, tree, ref, scopes, ids);  // Ver.2.350.86
          }
          self.SE_common("vars", tree, leftTree);  // Ver.2.346.85
          self.store_var(name_var, tree, scopes, ids, isEscaped);  // Ver.2.31.17  // Ver.2.249.57
          tree = DATA.tag("out", {name: ((tree.mat.isConstant)? self.config.symbol.const: "")+name_var, arr: tree.mat.arr});  // Ver.2.296.72
        }
        else if(isSEe_dynamic){  // Ver.2.277.65  // Ver.2.279.65
          self.SE_common("eqns", tree, leftTree);  // Ver.2.346.85
          self.store_eqn(name_var, tree, scopes, ids, isEscaped);  // Ver.2.277.65
          tree = DATA.tree_tag("out", self.config.get_out(true, name_var, isSEe_dynamic.isConstant));  // Ver.2.277.65  // Ver.2.296.72
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
  if(withVar){
    ids = self.get_ids_RE(name, scopes, ids);  // Ver.2.291.71
    if(ids){
      _tree = self.restore_var(name, scopes, ids);  // Ver.2.260.61
    }
  }
  if(!(_tree)){
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
  return self.store_mutex("eqns", name, tree, scopes, ids, isEscaped);  // Ver.2.291.71
};
/* -> Ver.2.31.17 */
/* Ver.2.293.71 moved from parser.js -> */
/* Ver.2.261.61 */
My_entry.operation.prototype.wrapper_loop = function(trees, callback_pre, callback){
  var self = this;
  var loop_tree_BT = function(tree_BT){
    callback_pre(tree_BT);
    var tagName = self.isType(tree_BT, "BT");
    if(tagName){
      var trees_lower = self.get_tagVal(tree_BT, tagName, "val");
      callback(trees_lower);
    }
  };
  self.loop_callback(trees, loop_tree_BT);  // Ver.2.218.50
  return self;
};
/* Ver.2.218.50 */
My_entry.operation.prototype.loop_callback = function(trees, callback){
  var self = this;
  var DATA = self.entry.DATA;  // Ver.2.304.76
  var isDataEqn = self.entry.def.isObject(trees);
  var isBT = (trees && trees.length);
  if(isDataEqn){
    for(var name in trees){
      var tree = trees[name];
      DATA.delProp_tree(tree, "obj_ref");  // Ver.2.304.76
      /* Ver.2.277.65 -> */
      if(tree && tree.mat){
        var arr = tree.mat.arr;
        for(var i=0, len_i=arr.length; i<len_i; ++i){
          for(var j=0, len_j=arr[i].length; j<len_j; ++j){
            callback(arr[i][j]);
          }
        }
      }
      /* -> Ver.2.277.65 */
      else{
        callback(tree);
      }
    }
  }
  else if(isBT){
    trees.forEach(function(tree){
      callback(tree);
    });
  }
  return self;
};
My_entry.operation.prototype.make_scopes = function(callback_hasScope, trees, scopes_upper, ids2d_upper, j){
  var self = this;
  var DATA = self.entry.DATA;
  var loop_tree_BT = function(tree_BT){
    var tagName = self.isType(tree_BT, "BT");
    if(tagName){
      var obj = tree_BT[tagName];
      var trees_lower = self.get_tagVal(tree_BT, tagName, "val");  // Ver.2.216.50
      var scopes = scopes_upper;
      var ids2d = [];  // new
      /* [a=1,a[0][0]=2,[(3,3)]] */
      if(trees_lower && trees_lower.length){
        /* Ver.2.299.72 -> */
        var hasScope = (callback_hasScope)? callback_hasScope(tagName, obj): obj.hasScope;  // Ver.2.213.48  // Ver.2.216.50  // Ver.2.228.56
        if(hasScope){
          if(callback_hasScope){
            obj.hasScope = true;
          }
        /* -> Ver.2.299.72 */
          var scope = DATA.scope();
          var n = scopes.length;
          scopes[n] = scope;
          var ids1d = [j, n];
          ids2d.push(ids1d);
        }
      }
      if(ids2d_upper && ids2d_upper.length){
        Array.prototype.push.apply(ids2d, ids2d_upper);  // FIFO-queue
      }
      if(ids2d.length){
        obj.ids = ids2d;  // scope ids cloned without Circular Reference at remake_trees
      }
      self.make_scopes(callback_hasScope, trees_lower, scopes, ids2d, j);
    }
  };
  self.loop_callback(trees, loop_tree_BT);  // Ver.2.218.50
  return self;
};
/* -> Ver.2.293.71 */
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
  var DATA = self.entry.DATA;  // Ver.2.757.114
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
  /* Ver.2.287.70 -> */
  var tree_eqn_anonymous = (arr_eqn)? DATA.arr2num(arr_eqn): null;
  if(tree_eqn_anonymous){
    // [f(x)=<x,f(1),[(x)=<x](1)=>]
    // a0=-1,make_f(a)=<[g(x)=<a0*x,==<==<g]==>f,make_f(a0)=>,f(3)=>
    var isSEe = tree_eqn_anonymous[BT.SEe];  // Ver.2.200.46
    if(isSEe){
      if(hasArgs){  // Ver.2.272.63
        name_eqn = name0;  // Ver.2.253.59
      }
    }
    else{
      throw "Invalid "+name0+" equation";  // Ver.2.253.59
    }
  }
  /* -> Ver.2.287.70 */
  /* -> Ver.2.273.64 */
  return {hasArgs: hasArgs, name_eqn: name_eqn, tree_eqn: tree_eqn_anonymous};  // Ver.2.273.64  // Ver.2.287.70
};
/* Ver.2.282.66 -> */
My_entry.operation.prototype.get_tree_isSE = function(tree, opt_name){  // Ver.2.284.67
  var self = this;
  var DATA = self.entry.DATA;  // Ver.2.302.73
  var _tree = null;
  if(DATA.getProp_tree(tree, "isSE") || (opt_name && tree.mat)){  // Ver.2.284.67  // Ver.2.302.73
    _tree = tree;
  }
  return _tree;
};
/* Ver.2.290.71 -> */
My_entry.operation.prototype.isResolved_tree = function(tree){
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var isSEe = tree[BT.SEe];
  var isREe = tree[BT.REe];
  var isNotResolved = tree.mat && (tree.mat.isNotResolved || DATA.hasVar_arr(tree.mat.arr));
  return !(isSEe || isREe || isNotResolved);
};
My_entry.operation.prototype.isEqn_obj = function(obj){
  var self = this;
  return (obj && (typeof obj.arg !== "undefined"));
};
/* -> Ver.2.290.71 */
/* Ver.2.276.65 */
My_entry.operation.prototype.switch_type_tree = function(data, tree){
  var self = this;
  var BT = self.config.BT;  // Ver.2.283.66
  var _tree = self.get_tree_isSE(tree);  // Ver.2.284.67
  var isSEe = tree[BT.SEe];  // Ver.2.283.66
  if(!(_tree) && !(self.isEqn_obj(isSEe))){  // Ver.2.283.66 f=(h)=<h(3),f((x)=<(1,2)):g=(x)=<x,f((x)=<x),f(g)  // Ver.2.290.71
    var tree_var = self.tree_eqn2tree_AtREe(data, tree);
    if(tree_var){
      _tree = self.get_tree_isSE(tree_var, true);  // Ver.2.284.67
    }
  }
  /* Ver.2.283.67 -> */
  if(_tree && _tree.mat){
    _tree = self.get_tree_SEe_arr00(_tree) || _tree;  // Ver.2.284.67  // Ver.2.285.67
  }
  /* -> Ver.2.283.67 */
  if(!(_tree)){
    _tree = self.tree_eqn2tree_AtSEe(data, tree);
  }
  return _tree;
};
/* -> Ver.2.282.66 */
/* Ver.2.303.73 */
My_entry.operation.prototype.inherit_obj_ref = function(sw, name, tree, ids){
  var self = this;
  var DATA = self.entry.DATA;
  var obj_ref = DATA.getProp_tree(tree, "obj_ref") || {sw: sw, name: name, id0: (ids || self.config.ids0)[0]};
  DATA.setProp_tree(tree, "obj_ref", obj_ref);
  return self;
};
/* Ver.2.269.62 */
My_entry.operation.prototype.restore_args_AtREe = function(data, name_eqn, args_eqn, args, ids_args_eqn, args_eqns, args_vars, args_bas, buffer_vars, buffer_eqns, ids_buffer){  // Ver.2.271.63
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;  // Ver.2.303.73
  var DATA = self.entry.DATA;  // Ver.2.303.73
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
    /* Ver.2.791.125 -> */
    if(!(sw_tree)){
      throw "Invalid matching args."+name+"("+name_eqn+")";
    }
    /* -> Ver.2.791.125 */
    var isSEe_dynamic = sw_tree[BT.SEe];  // Ver.2.279.65
    if(isSEe_dynamic){
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
    /* Ver.2.303.73 -> */
    else if(self.config.isEscaped_ref(left)){  // f(?name_left)=<eqn,f(?name_right)=>
      var name_left = left.substring(1);
      var name_a0 = self.get_tagVal(right, "REv", "val");
      if(name_a0 && self.config.isEscaped_ref(name_a0)){
        var name_right = name_a0.substring(1);
        var scope_right = self.get_scope0(scopes, ids);  // scope only
        var sw_tree = scope_right.vars[name_right] || scope_right.eqns[name_right];  // vars first
        if(sw_tree){
          var id0 = ids_buffer[0];
          var scope_left = self.get_scope0(scopes, [id0]);
          var sw = (scope_right.vars[name_right])? "vars": "eqns";  // vars first
          if(name_left){
            var tree_left = scope_left[sw][name_left];
            DATA.setProp_tree(tree_left, "isBuffer", true);
            var isEqn = (sw === "eqns");
            if(isEqn){
              if(buffer_eqns){
                buffer_eqns[name_left] = tree_left;  // not cloned
              }
            }
            else{
              if(buffer_vars){
                buffer_vars[name_left] = tree_left;  // not cloned
              }
            }
          }
          var tree_right = scope_right[sw][name_right];
          self.inherit_obj_ref(sw, name_right, tree_right, ids);
          scope_left[sw][name_left] = tree_right;
        }
        else{
          throw "Undef scope-var("+name_right+")";
        }
      }
      else{
        throw "Invalid matching args."+left;
      }
    }
    /* -> Ver.2.303.73 */
    else{
      callback(left, right);  // Ver.2.276.65
    }
  }
  return self;
};
/* Ver.2.292.71 f=(args)=<[independent scope ids0]=> || [not ids0]()=> || [not ids0](args)=> */
/* Ver.2.210.46 */
My_entry.operation.prototype.get_ids0 = function(tree){
  var self = this;
  var BT = self.config.BT;
  var _ids0 = null;
  var isREe = tree[BT.REe];
  var isREeVal = isREe.val;
  var N_BT = 0;
  for(var i=0, len=isREeVal.length; i<len; ++i){
    var tree_i = isREeVal[i];
    var tagName = self.isType(tree_i, "BT");
    if(tagName){
      if(++N_BT > 1){
        _ids0 = null;
        break;
      }
      else{
        _ids0 = tree_i[tagName].ids;
      }
    }
  }
  return _ids0;
};
My_entry.operation.prototype.get_args_AtREe = function(data, name_eqn, tree_eqn, arr, isREee){  // Ver.2.289.71
  var self = this;
  var scopes = data.scopes;
  var ids = data.ids;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var buffer_vars = {};
  var buffer_eqns = {};
  var ids_buffer = null;
  /* Ver.2.71.29 -> */
  var args_eqns = {};  // Ver.2.256.59 [] -> {}
  var args_vars = {};  // Ver.2.256.59 [] -> {}
  var args_bas = {};  // Ver.2.246.57  // Ver.2.256.59 [] -> {}
  /* -> Ver.2.71.29 */
  var isREe = tree_eqn[BT.REe];
  var args_eqn = isREe && isREe.arg;  // Ver.2.287.70
  var len_args_eqn = (args_eqn)? args_eqn.length: 0;
  var args = DATA.arr2args(arr);
  var len_args = args.length;
  if(len_args_eqn === len_args){
    var ids0 = (self.useScopeWith)? null: self.get_ids0(tree_eqn);  // Ver.2.33.18  // Ver.2.213.47  // Ver.2.292.71
    var ids_args_eqn = ids0 || isREe.ids || self.config.ids0;  // Ver.2.33.18 [conv(=<a_)=<last(b=4,a_=>),[a=3,conv(=<(a))==>,b]]  // Ver.2.225.53  // Ver.2.292.71
    var id0 = ids_args_eqn[0];
    ids_buffer = [id0];  // Ver.2.225.53
    self.restore_args_AtREe(data, name_eqn, args_eqn, args, ids_args_eqn, args_eqns, args_vars, args_bas, buffer_vars, buffer_eqns, ids_buffer);  // Ver.2.269.62  // Ver.2.271.63
  }
  else{
    throw "Invalid args.length="+len_args_eqn+"("+name_eqn+")";
  }
  return {buffer_vars: buffer_vars, buffer_eqns: buffer_eqns, ids_buffer: ids_buffer, args_eqns: args_eqns, args_vars: args_vars, args_bas: args_bas};
};
My_entry.operation.prototype.store_buffer_sw = function(sw, buffer, scopes, ids_buffer, isClear){
  var self = this;
  var store_sw = (sw === "eqns")? self.store_eqn: self.store_var;
  for(var name in buffer){  // Ver.2.256.59
    var tree = buffer[name];  // Ver.2.256.59
    if(tree){
//      self.SE_common(sw, tree, null);  // Ver.2.346.85
      store_sw.call(self, name, tree, scopes, ids_buffer);  // .call
    }
    else if(isClear){  // Ver.2.256.59
      self.del_scope_sw(sw, name, scopes, ids_buffer);  // Ver.2.226.55
    }
  }
  return self;
};
/* -> Ver.2.256.59 */
/* Ver.2.299.72 */
My_entry.operation.prototype.update_ids = function(tree_eqn, scopes){
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.config.BT;
  var isREe = tree_eqn[BT.REe];
  if(isREe){
    var trees = DATA.tree2trees(tree_eqn);
    var scopes_new = [scopes[0][0]];
    var ids0 = isREe.ids || self.config.ids0;
    var j = scopes.length;
/*
    var scopes_new = [scopes[0][0], DATA.scope()];
    var ids0 = isREe.ids || self.entry.def.newClone(self.config.ids0);
    ids0.unshift([j, 1]);
*/
    self.make_scopes(null, trees, scopes_new, ids0, j);
    scopes.push(scopes_new);
  }
  return self;
};
My_entry.operation.prototype.REe = function(data, i0, tagName, tagObj){
  var self = this;
  var trees = data.trees;
  var options = data.options;  // Ver.2.299.72
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
  /* Ver.2.204.46 -> */
  var isREee = (tagObj.val === "==>");
  var arr = self.get_tagVal(leftTree, "mat", "arr");  // Ver.2.272.63
  /* Ver.2.256.59 -> */
  var obj = self.get_name_eqn_AtREe(trees, i0);  // Ver.2.272.63
  var hasArgs = obj.hasArgs;
  var name_eqn = obj.name_eqn;
  var tree_eqn0 = obj.tree_eqn;
  if(name_eqn && tree_eqn0){
    self.SE_common("eqns", tree_eqn0, null);  // Ver.2.346.85
    self.store_eqn(name_eqn, tree_eqn0, scopes, ids);
  }
  var hasName = (name_eqn && name_eqn !== self.config.symbol.anonymous);  // Ver.2.299.72
  var isNoName = !(hasName);  // Ver.2.299.72
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
  /* Ver.2.289.71 -> */
  /* Ver.2.299.72 -> */
  var tree_eqn = (name_eqn)?
    self.restore_eqn(name_eqn, scopes, ids, isREee):  // Ver.2.31.17  // Ver.2.204.46
    self.tree_SEe2REe_isREee(tree_eqn0, ids, isREee);  // Ver.2.43.22  // Ver.2.272.63  // Ver.2.273.64  // Ver.2.830.140
  if(!(tree_eqn)) throw "Undef eqn("+name_eqn+")";
  /* Ver.2.741.109 -> */
  var isREe = tree_eqn[BT.REe];  // Ver.2.200.46
  var useStatic = options.useStaticScopes2dArray || (isREe && isREe.isConstant);
  if(useStatic){
    self.useStatic++;
  }
  if(!(self.useStatic)){
    self.update_ids(tree_eqn, scopes);
  }
  /* -> Ver.2.741.109 */
  /* -> Ver.2.299.72 */
  if(name_eqn && hasArgs){
    /* Ver.2.256.59 -> */
    var obj = self.get_args_AtREe(data, name_eqn, tree_eqn, arr, isREee);
    buffer_vars = obj.buffer_vars;
    buffer_eqns = obj.buffer_eqns;
    ids_buffer = obj.ids_buffer;
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
  /* -> Ver.2.289.71 */
  if(tree_eqn){
    /* Ver.2.247.57 -> */
    var args_eqn = isREe && isREe.arg;  // Ver.2.287.70
    /* Ver.2.174.42 -> */
    if(args_eqn && !(hasArgs)){  // Ver.2.253.59 disabled: f(x)=<x; f=>g
      throw "Invalid args.length="+args_eqn.length+"("+name_eqn+")";
    }
    /* -> Ver.2.174.42 */
    /* -> Ver.2.247.57 */
    _tree = self.tree2tree_eqn_AtREe(data, tree_eqn, isREee);  // Ver.2.211.46  // Ver.2.214.49  // Ver.2.229.56  // Ver.2.231.56  // Ver.2.251.57  // Ver.2.253.59
  }
  /* Ver.2.256.59 -> */
  var isClear = self.isResolved_tree(_tree);  // check arr  // Ver.2.299.72
  if(hasArgs){
    /* Ver.2.290.71 -> */
    self.store_buffer_sw("eqns", buffer_eqns, scopes, ids_buffer, isClear);
    self.store_buffer_sw("vars", buffer_vars, scopes, ids_buffer, isClear);
    /* -> Ver.2.290.71 */
  }
  /* Ver.2.299.72 -> */
  if(!(self.useStatic)){  // Ver.2.741.109
    var hasNotObjRef = (Object.keys(buffer_eqns).length === 0);  // Ver.2.303.73
    if(hasNotObjRef && isClear){  // Ver.2.303.73 not optimized
      scopes.pop();
    }
  }
  /* Ver.2.741.109 -> */
  if(useStatic){
    self.useStatic--;
  }
  /* -> Ver.2.741.109 */
  /* -> Ver.2.299.72 */
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
          self.SE_common("eqns", tree_var, rightTree);  // Ver.2.346.85
          self.store_eqn(name_var, tree_var, scopes, ids, isEscaped);
          /* -> Ver.2.262.61 */
          _tree = DATA.tree_num(0, 0);  // Ver.2.296.72 resolved for flag
          DATA.setProp_tree(_tree, "isNotResolved", true);  // Ver.2.290.71
        }
        else{
          _tree = tree_var;
        }
      }
      /* -> Ver.2.203.46 */
      /* -> Ver.2.229.56 */
      return _tree;  // Ver.2.272.63
    };
    if(tagName === "REe"){  // Ver.2.295.72 REe -> (f[ref](args)=>)=> || (f(args)=>)[ref]=> -> SEe -> store_eqn(name_var, tree_var
      /* f=<(=<1,=<2),(f[][1]()=>)=>,(f()=>)[][1]=> */
      _tree = REe2SEe(_tree);  // Ver.2.272.63
      self.feedback2trees(data, is, ie, _tree);
    }
    else if(tagName === "REv"){  // Ver.2.295.72 REe -> SEe4SEv -> A[ref]
      /* A=(=<1,=<2),(A[][1])=> */
      return _tree;
    }
  }
  /* Ver.2.204.46 -> */
  else{
    self.throw_tree(leftTree);
  }
  /* -> Ver.2.204.46 */
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
/* Ver.2.302.73 */
/* Ver.2.272.63 */
My_entry.operation.prototype.isEmpty_tree = function(tree){
  var self = this;
  var DATA = self.entry.DATA;
  var arr = DATA.getProp_tree(tree, "val");
  var len = (arr)? arr.length: 0;
  return (len === 0);
};
/* Ver.2.791.126 */
My_entry.operation.prototype.check_names = function(names, name_eqn){
  var self = this;
  var list_name = {};
  if(names.length === 0) throw "Invalid args isFound("+name_eqn+")";  // Ver.2.252.59
  for(var i=0, len=names.length; i<len; ++i){
    var name = names[i];
    name = name.replace(self.config.symbol.escape_eqn2, "");  // first
    name = name.replace(self.config.symbol.escape_eqn1, "");
    name = name.replace(self.config.symbol.escape_ref, "");
    name = name.replace(self.config.symbol.escape_mac, "");
    if(list_name[name]) throw "Invalid duplicate-args."+name+"("+name_eqn+")";
    list_name[name] = true;
  }
  list_name = null;
  return self;
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
  var ie = len-1;
  var name_eqn = self.get_tagVal(trees[is], "REv", "val");
  if(!(name_eqn)){
    is += 1;  // Ver.2.213.49
  }
  var isSEe = tree[BT.SEe];  // Ver.2.249.57
  /* Ver.2.195.45 -> */
  /* Ver.2.288.70 -> */
  if(hasArgs){
    if(self.isEmpty_tree(leftTree)){
      isSEe.arg = null;
    }
    else{
      var names = self.get_names(data, leftTree, true);  // NG: (x=1)=<x
      /* Ver.2.213.48 -> */
      if(names){
        self.check_names(names, name_eqn);  // Ver.2.791.126
        isSEe.arg = names;  // Ver.2.249.57
      }
      /* -> Ver.2.213.48 */
    }
  }
  /* -> Ver.2.288.70 */
  if(name_eqn){
    /* Ver.2.249.57 -> */
    var isEscaped = self.config.isEscaped(name_eqn);
    if(isEscaped){
      name_eqn = name_eqn.substring(1);
    }
    /* -> Ver.2.249.57 */
    self.SE_common("eqns", tree, trees[is]);  // Ver.2.346.85
    self.store_eqn(name_eqn, tree, scopes, ids, isEscaped);  // Ver.2.31.17  // Ver.2.249.57
    tree = DATA.tree_tag("out", self.config.get_out(true, name_eqn, isSEe.isConstant));  // Ver.2.277.65  // Ver.2.296.72
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
          self.throw_tree(tree);  // Ver.2.279.65 including BTe
        }
      }
      if(tree){
        self.feedback2trees(data, is, ie, tree);
      }
    }
    else{
      throw arguments;  // Ver.2.409.86
    }
  }
  return self;
};
