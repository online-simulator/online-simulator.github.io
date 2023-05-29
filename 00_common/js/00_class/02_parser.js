// online-simulator.github.io

My_entry.parser = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.parser.config =
My_entry.parser.prototype.config = {
  SYNTAX: {
    pairs: [
      {s: "{", e: "}"},
      {s: "(", e: ")"},
      {s: "[", e: "]"}
    ],
    bs: {
      /* Ver.2.21.10 -> */
      FNmh: {
        /* Ver.2.23.11 -> */
        EX: /^_e(.*)$/i,
        /* -> Ver.2.23.11 */
        OX: /^_o(.*)$/i
      },
      /* -> Ver.2.21.10 */
      /* Ver.2.20.9 -> */
      FNh: {
        RX: /^_r(.*)$/i,
        IX: /^_i(.*)$/i,
        DX: /^_d(.*)$/i,
        PX: /^_p(.*)$/i,
        SX: /^_s(.*)$/i
      },
      /* -> Ver.2.20.9 */
      /* Ver.2.128.34 */
      FNn: {
        sort: /^sort(\d+)$/i,
        reverse: /^reverse(\d+)$/i,
        csort: /^csort(\d+)$/i,
        creverse: /^creverse(\d+)$/i
      }
    },
    bas: [
      // StorE equation
      {b: /=</, a: "SEe"},
      // RestorE equation
      {b: /[=]{1,2}>/, a: "REe"},  // Ver.2.31.17
      // fact -> "URf"
      {b: /!+/, a: function(str){
        return "URf"+","+str.length;
      }},
      // ** -> ^
      {b: /[*]{2}/, a: "BRpp"},  // Ver.2.87.32
      {b: /[%]{1,2}/, a: "BRdm"},  // Ver.2.87.32
      // bit shift
      {b: /[<]{2}|[>]{2,3}/, a: "BRbs"},
      // relational operator check first
      {b: /==/, a: "BRrl"},
      {b: /<>/, a: "BRrl"},
      // comparison operator check second
      {b: /<[=]{0,1}/, a: "BRcn"},
      {b: />[=]{0,1}/, a: "BRcn"},
      /* Ver.2.59.26 -> */
      // logical operator
      {b: /[~]{2}/, a: "PUlN"},  // Ver.2.81.32
      {b: /[&]{2}/, a: "BRlA"},
      {b: /[|]{2}/, a: "BRlO"}
      /* -> Ver.2.59.26 */
    ],
    tagNames: {
      // delimiter
      // SeparatoR: "SR"
      ";": "SRs",  // sentence;sentence
      ":": "SRr",  // record:record
      ",": "SRt",  // tokens,tokens
      // FunctioN command: "FNc"
      // BrackeT: "BT"
      "{": "BT2",
      "(": "BT1",
      "[": "BT0",
      // FunctioN: "FN?"
      // post-Unary operatoR: "UR?"
      "i": "URi",
      // Binary operatoR: "BR?"
      "^": "BRp",
      // omitted multiplication sign: "BRmo"
      "/": "BRdm", "*": "BRdm",
      // Pre-Unary operator minus or plus: "PUmp"
      "-": "BRsa", "+": "BRsa",
      "~": "PUbn",  // bit not
      // bit shift: "BRbs"
      "&": "BRba",  // bit and
      "@": "BRbx",  // bit xor
      "|": "BRbo",  // bit  or
      // comparison operator: "BRcn"
      // relational operator: "BRrl"
      // logical NOT: "PUlN"
      // logical AND: "BRlA"
      // logical  OR: "BRlO"
      "=": "BRe"  // x+3=1 -> x=1-3 prior to substitution
    },
    word: {
      prifix: ((My_entry.flag.useES6)? /^0[xXbBoO]/: /^0[xX]/)  // Ver.2.146.37
    }
  }
};
My_entry.parser.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["reference", "$", "def", "math", "math_mat", "DATA", "operation"]);
  return self;
};
My_entry.parser.prototype.script2arr = function(script){
  var self = this;
  return script.split(";").filter(function(arg){return !(arg === "");});  // semi-colon; removed
};
My_entry.parser.prototype.replace_series = function(str, bas){
  var self = this;
  var _str = str;
  bas.forEach(function(ba){
    _str = _str.replace(ba.b, ba.a);
  });
  return _str;
};
My_entry.parser.prototype.remove_comment = function(script){
  var self = this;
  var bas = [];
  bas.push({b: /\/\*[\s\S]*?\*\//g, a: ""});
  bas.push({b: /[\/]{2}.*$/gm,      a: ""});
  return self.replace_series(script, bas);
};
My_entry.parser.prototype.remove_commentAndWspace = function(script){
  var self = this;
  var bas = [];
  bas.push({b: /\/\*[\s\S]*?\*\//g, a: ""});
  bas.push({b: /[\/]{2}.*$/gm,      a: ""});
  bas.push({b: /\s/g,               a: ""});
  return self.replace_series(script, bas);
};
My_entry.parser.prototype.check_syntax = function(sentence){
  var self = this;
  self.config.SYNTAX.pairs.forEach(function(pair, i){
    var cp0 = sentence.indexOf(pair.s);
    var cp1 = sentence.indexOf(pair.e);
    if(cp1 < cp0) throw false;
    var cp2 = sentence.split(pair.s).length;
    var cp3 = sentence.split(pair.e).length;
    if(cp2 !== cp3) throw false;
  });
  return true;
};
My_entry.parser.prototype.get_pattern = function(){
  var self = this;
  var patterns = [];
  self.config.SYNTAX.bas.forEach(function(ba){
    patterns.push(ba.b);
  });
  patterns.push(self.entry.reference.get_pattern_token());
  patterns.forEach(function(pattern, i){
    patterns[i] = pattern.toString().replace(/^\/|\/$/g, "");
  });
  return "("+patterns.join("|")+")";
};
My_entry.parser.prototype.search_pairE = function(pair, tokens, ip_s){
  var self = this;
  // tokens = [(,1,+,(,2,+,(,3,+,4,),+,5,),+,6,)]
  //       ip_s|            depth=3            |ip_e
  var depth = {s: 0, e: 0};
  for(var i=ip_s, len=tokens.length; i<len; ++i){
    var token = tokens[i];
    if(token === pair.s){
      ++depth.s;
    }
    else if(token === pair.e){
      if(++depth.e === depth.s){
        return i;
      }
    }
  }
  throw false;
};
My_entry.parser.prototype.compare2pairs = function(tokens, i){
  var self = this;
  var _ip_e = null;
  var token = tokens[i];
  self.config.SYNTAX.pairs.forEach(function(pair, j){
    if(token === pair.s){
      _ip_e = self.search_pairE(pair, tokens, i);
    }
  });
  return _ip_e;
};
/* Ver.2.24.12 */
My_entry.parser.prototype.check_varName = function(token, re){
  var self = this;
  var _tree = null;
  var DATA = self.entry.DATA;
  var trees = self.make_trees(token, re);
  if(trees.length === 1){
    var tree = DATA.trees2tree(trees);
    if(tree["REv"]){
      _tree = tree["REv"]["val"];
    }
    else{
      throw "Invalid "+token+" called";
    }
  }
  return _tree;
};
/* Ver.2.146.37 */
My_entry.parser.prototype.check_varName_prifix = function(token, re){
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  if(token.match(SYNTAX.word.prifix)){
    throw "Invalid varName("+token+")";
  }
  return _tree;
};
/* Ver.2.142.36 */
My_entry.parser.prototype.check_csv = function(str_tokens, tagName){
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  var DATA = self.entry.DATA;
  var sc = str_tokens.split(",");
  var len_n = sc.length;
  /* Ver.2.151.38 -> */
  var isIndex = (len_n === 1 && tagName);
  var isCsv = true;
  /* Ver.2.145.36 -> */
//  var hasNullStr = false;
  for(var n=0; n<len_n; ++n){
    var scn = sc[n];
//    hasNullStr = hasNullStr || (scn === "");
    var num = Number(scn || 0);
    sc[n] = num;
    isCsv = isCsv && !(isNaN(num));
    if(!(isCsv)) break;  // Ver.2.145.36
  }
  if(isCsv){
    var isVectorc = (tagName === SYNTAX.tagNames["{"]);
    var arr = [];
    for(var n=0; n<len_n; ++n){
      var i = 0;
      var j = 0;
      if(isVectorc){
        i = n;
      }
      else{
        j = n;
      }
      arr[i] = arr[i] || [];
      arr[i][j] = DATA.num(sc[n], 0);
    }
    var tree = DATA.tree_mat(arr);
    _tree = (isIndex)? DATA.tree_tag(tagName, [tree]): tree;
  }
  /* -> Ver.2.145.36 */
  return _tree;
};
My_entry.parser.prototype.compare2bs = function(token, re){
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  var DATA = self.entry.DATA;
  var bs = SYNTAX.bs;
  for(var tagName in bs){
    if(_tree) break;
    var bstagName = bs[tagName];
    for(var key in bstagName){
      if(_tree) break;
      var b = bstagName[key];
      var mc = token.match(b);
      if(mc && mc.length > 1){
        var mc1 = mc[1];
        if(tagName === "FNmh" || tagName === "FNh"){  // Ver.2.21.10
          if(mc1){
            /* Ver.2.29.15 -> */
            if(self.entry.operation.config.isEscaped(mc1)){
              throw "Invalid dummy("+mc1+")";
            }
            /* -> Ver.2.29.15 */
            _tree = DATA.tree_tag(tagName, {key: key, name: self.check_varName(mc1, re)});  // Ver.2.24.12
          }
        }
        /* Ver.2.128.34 */
        else if(tagName === "FNn"){
          _tree = DATA.tree_tag(tagName, key);
          _tree[tagName].i = Number(mc1);
        }
        if(!(_tree)){
          throw "Invalid "+tagName+" called";
        }
      }
    }
  }
  return _tree;
};
My_entry.parser.prototype.compare2bas = function(token){
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  var DATA = self.entry.DATA;
  for(var j=0, len_j=SYNTAX.bas.length; j<len_j; ++j){
    if(_tree) break;
    var ba = SYNTAX.bas[j];
    if(token.match(ba.b)){
      var as = token.replace(ba.b, ba.a).split(",");
      _tree = DATA.tree_tag(as[0], (as[1] || token));
    }
  }
  return _tree;
};
/*
            j-th sentence
  trees2d: [j][i]{tag || num}
  trees1d,     i-th token
    trees: [i]{}
  trees0d,
     tree: {}
      tag: {"name": {val: val}}
      num: {mat:    {arr: arr}}
      1+i: arr [0] [0] {com: {r: 1, i: 1}}
   matrix:     row col {complex number   }
(i,2:3,4): arr [0] [0] {com: {r: 0, i: 1}}
               [0] [1] {com: {r: 2, i: 0}}
               [1] [0] {com: {r: 3, i: 0}}
               [1] [1] {com: {r: 4, i: 0}}
*/
My_entry.parser.prototype.make_trees = function(sentence, re){
  var self = this;
  var _trees = [];  // [i]
  var SYNTAX = self.config.SYNTAX;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var tokens = sentence.match(re);
  if(!(tokens)) throw "Invalid null string";  // Ver.2.25.13
  /* Ver.2.143.36 -> */
  var tree_csv = self.check_csv(sentence, "");
  if(tree_csv){
    _trees.push(tree_csv);
    tokens.length = 0;
  }
  /* -> Ver.2.143.36 */
  for(var i=0, len_i=tokens.length; i<len_i; ++i){
    var i_next = i;
    var tree = undefined;
    var token = tokens[i];
    var token_lower = token.toLowerCase();
    var token_upper = token.toUpperCase();
    var tagName = SYNTAX.tagNames[token_lower];
    var ip_e = self.compare2pairs(tokens, i);
    if(ip_e){  // difficult to make matrix here "(()(1,2:3(),4))"
      i_next = ip_e;
      var ip_s = i;
      if(ip_e-(ip_s+1)){  // () removed
        var str_tokens = tokens.slice(ip_s+1, ip_e).join("");
        tree = self.check_csv(str_tokens, tagName) || DATA.tree_tag(tagName, self.make_trees(str_tokens, re));  // Ver.2.142.36
      }
    }
    else if(tagName){
      tree = DATA.tree_tag(tagName, token_lower);
    }
    else if(self.entry.def.isNumber(token)){
      tree = DATA.tree_num(self.entry.def.Number(token), 0);
    }
    else{
      /* Ver.2.20.9 -> */
      tree = self.compare2bas(token) || self.compare2bs(token, re);
      /* -> Ver.2.20.9 */
    }
    if(ip_e || tree){
    }
    else switch(token_lower){
      // reserved word
      // variable
      case "ans":
        tree = DATA.tree_tag("REv", token_lower);
        break;
      // command
      case "clear":
      case "store":
      case "restore":
      case "stop":
        throw "Invalid "+token+" called";
        break;
      // "FNc"
      // storage
      case "hasvar":
      case "haseqn":
      case "delvar":
      case "deleqn":
      case "addvar":
      case "addeqn":
      // scopes+storage
      case "hasv":
      case "hase":
        tree = DATA.tree_tag("FNc", token_lower);
        break;
      // "FNhn"
      case "switch":
        tree = DATA.tree_tag("FNh", {key: token_lower});
        break;
      // "FN2"
      // only real number
      // relational
      case "eq":
      case "ne":
      // comparison
      case "lt":
      case "le":
      case "gt":
      case "ge":
      // complex number
      // relational
      case "ceq":
      case "cne":
        tree = DATA.tree_tag("FN", token_lower);
        break;
      // "FNmh"
      case "jacobi":
      case "jacobian":
        tree = DATA.tree_tag("FNmh", "jacobian");
        break;
      case "newton":
      case "newtonian":
        tree = DATA.tree_tag("FNmh", "newtonian");
        break;
      // "FNm"
      // "FNm0"
      case "vector2r":
      case "vector3r":
      case "vector4r":
      case "vector2c":
      case "vector3c":
      case "vector4c":
      case "zeros2":
      case "zeros3":
      case "zeros4":
      case "ones2":
      case "ones3":
      case "ones4":
      case "identity2":
      case "identity3":
      case "identity4":
        tree = DATA.tree_mat(math_mat[token_lower]());
        break;
      // "FNm1"
      case "vectorr":
      case "vectorc":
      case "identity":
      case "first":
      case "last":
      case "rotationx":
      case "rotationy":
      case "rotationz":
      case "sizer":
      case "normalizer":
        tree = DATA.tree_tag("FNm", token_lower);
        break;
      case "size":
      case "sizec":
        tree = DATA.tree_tag("FNm", "sizec");
        break;
      case "normalize":
      case "normalizec":
        tree = DATA.tree_tag("FNm", "normalizec");
        break;
      case "trans":
      case "transpose":
        tree = DATA.tree_tag("FNm", "transpose");
        break;
      case "htrans":
      case "htranspose":
      case "hermitian":
        tree = DATA.tree_tag("FNm", "hermitian");
        break;
      case "norm":
      case "euclidean":
        tree = DATA.tree_tag("FNm", "euclidean");
        break;
      // "FNm2"
      case "scalars":
      case "zeros":
      case "ones":
      case "coo2mat":
      case "mat2coo":
        tree = DATA.tree_tag("FNm", token_lower);
        break;
      case "gauss_coo":
      case "gaussian_coo":
        tree = DATA.tree_tag("FNm", "gaussian_coo");
        break;
      case "gauss":
      case "gaussian":
        tree = DATA.tree_tag("FNm", "gaussian");
        break;
      // "CT"
      // JavaScript defined
      case "epsilon":
      case "min_safe_integer":
      case "max_safe_integer":
        tree = DATA.tree_num(self.entry.math.config[token_upper], 0);
        break;
      case "min_value":
      case "max_value":
      case "positive_infinity":
      case "negative_infinity":
        tree = DATA.tree_num(Number[token_upper], 0);
        break;
      // My defined
      case "eps":
        tree = DATA.tree_num(self.entry.math.config["EPSILON"], 0);
        break;
      case  "inf":
      case  "infinity":
      case "pinf":
      case "pinfinity":
        tree = DATA.tree_num(Number.POSITIVE_INFINITY, 0);
        break;
      case "ninf":
      case "ninfinity":
        tree = DATA.tree_num(Number.NEGATIVE_INFINITY, 0);
        break;
      case  "infi":
      case  "infinityi":
      case "pinfinityi":
      case "pinfi":
        tree = DATA.tree_num(0, Number.POSITIVE_INFINITY);
        break;
      case "ninfinityi":
      case "ninfi":
        tree = DATA.tree_num(0, Number.NEGATIVE_INFINITY);
        break;
      // JavaScript defined
      case "ln2":
      case "ln10":
      case "log2e":
      case "log10e":
      case "sqrt1_2":
      case "sqrt2":
      // Both defined
      case "e":
      case "pi":  // pi || PI() in Excel
        tree = DATA.tree_num(Math[token_upper], 0);
        break;
      // "FN0"
      // JavaScript defined
      case "random":
      // Excel defined
      case "rand":
        tree = DATA.tree_tag("FN", "random");
        break;
      // "FN1"
      case "ln":
        tree = DATA.tree_tag("FN", "log");
        break;
      // JavaScript defined
      case "ceil":
      case "floor":
      case "round":
      case "log":
      // Excel defined
      case "sinh":
      case "cosh":
      case "tanh":
      case "asinh":
      case "acosh":
      case "atanh":
      case "csch":
      case "sech":
      case "coth":
      case "acsch":
      case "asech":
      case "acoth":
      case "sign":
      case "fact":
      case "degrees":
      case "radians":
      // Both defined
      case "abs":
      case "sqrt":
      case "exp":
      case "sin":
      case "cos":
      case "tan":
      case "asin":
      case "acos":
      case "atan":
      case "log10":
      // Python defined
      case "log2":
      case "int":
      // My defined
      case "sin_deg":
      case "cos_deg":
      case "tan_deg":
      case "deg_asin":
      case "deg_acos":
      case "deg_atan":
      case "rad2deg":
      case "deg2rad":
      case "cdot":
      case "ecomp":
      case "ecomplex":
      case "real":
      case "imag":
      case "imaginary":
      case "conj":
      case "conjugate":
      case "arg":
      case "argument":
      case "deg_arg":
      case "deg_argument":
        tree = DATA.tree_tag("FN", token_lower);
        break;
      // "FN1or2"
      // Excel defined
      case "log_ex":
        tree = DATA.tree_tag("FN", token_lower);
        break;
      // "FN2"
      case "power":
        tree = DATA.tree_tag("FN", "pow");
        break;
      // JavaScript defined
      case "pow":
      case "atan2":
      case "imul":
      // Excel defined
      case "combin":
      case "combination":
      // My defined
      case "permut":
      case "permutation":
      case "deg_atan2":
      case "atan2_ex":  // Excel spec
      case "deg_atan2_ex":
      case "comp":
      case "complex":
      case "pcomp":
      case "pcomplex":
      case "kdelta":
      case "mod":
      case "fmod":
      case "quot":
      // "FN3or4"
      // My defined
      case "star":
      case "poly":
      case "polygon":
        tree = DATA.tree_tag("FN", token_lower);
        break;
      // "FNn"
      // Excel defined@n<256
      case "lcm":
      case "gcd":
      // Both defined
      // only real number
      case "min":
      case "max":
      // Python defined
      case "mean":
      case "sum":
      case "prod":
      case "median":
      case "sort":
      case "reverse":
      // My defined
      // |complex number|
      case "cmin":
      case "cmax":
      case "cmedian":
      case "csort":
      case "creverse":
        tree = DATA.tree_tag("FNn", token_lower);
        break;
      default:
        /* Ver.2.24.12 -> */
        if(self.entry.operation.config.isEscaped(token)){
          self.check_varName(token.substring(1), re);
        }
        else{
          self.check_varName_prifix(token, re);  // Ver.2.146.37
        }
        /* -> Ver.2.24.12 */
        tree = DATA.tree_tag("REv", token);
        break;
    }
    if(tree){
      _trees.push(tree);
    }
    i = i_next;
  }
  return _trees;
};
My_entry.parser.prototype.isCommand = function(sentence){
  var self = this;
  var _command = null;
  var sentence_lower = sentence.toLowerCase();
  switch(sentence_lower){
    case "clear":
    case "store":
    case "restore":
    case "stop":
      _command = sentence_lower;
      break;
    default:
      break;
  }
  return _command;
};
/* Ver.2.32.17 */
/* Ver.2.31.17 (1,[2,{3,4}]) -> */
My_entry.parser.prototype.make_scopes = function(useScope, trees, scopes_parent, ids2d_parent, j){
  var self = this;
  var DATA = self.entry.DATA;
  var operation = self.entry.operation;
  var loop_tree_BT = function(tree_BT){
    var tagName = operation.isType(tree_BT, "BT");
    if(tagName){
      var obj = tree_BT[tagName];
      var trees_child = obj.val;
      var scopes = scopes_parent;
      var ids2d = [];  // new
      /* [a=1,a[0][0]=2,[(3,3)]] */
      if(trees_child && trees_child.length){
        if(operation.config.BT.hasScope(useScope, tagName)){
          var scope = DATA.scope();
          var n = scopes.length;
          scopes[n] = scope;
          var ids1d = [j, n];
          ids2d.push(ids1d);
        }
      }
      if(ids2d_parent && ids2d_parent.length){
        Array.prototype.push.apply(ids2d, ids2d_parent);  // FIFO-queue
      }
      if(ids2d.length){
        obj.ids = ids2d;  // scope ids cloned without Circular Reference at remake_trees
      }
      self.make_scopes(useScope, trees_child, scopes, ids2d, j);
    }
  };
  if(trees && trees.length){
    trees.forEach(function(tree){
      loop_tree_BT(tree);
    });
  }
  else if(self.entry.def.isObject(trees)){
    for(var name in trees){
      loop_tree_BT(trees[name]);
    }
  }
  return self;
};
My_entry.parser.prototype.script2objs2d = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var trees2d = null;
  var scopes2d = null;
  if(data && data.in){
    data.in = String(data.in);  // Ver.2.30.15
    var script = self.remove_commentAndWspace(self.entry.reference.fullStr2half(data.in));
    var arr_sentence = self.script2arr(script);
    var scope0 = DATA.scope(data.vars, data.eqns);
    if(arr_sentence && arr_sentence.length){
      trees2d = [];
      scopes2d = [];
      arr_sentence.forEach(function(sentence, j){
        var isOK = self.check_syntax(sentence);
        if(isOK){
          var trees = null;
          var scopes = [scope0];  // including command
          var command = self.isCommand(sentence);
          if(command){
            trees = command;
          }
          else{
            var re = new RegExp(self.get_pattern(), "g");
            trees = self.make_trees(sentence, re);
            var ids2d = [[j, 0]];
            self.make_scopes(data.options.useScope, trees, scopes, ids2d, j);
          }
          trees2d.push(trees);
          scopes2d.push(scopes);
        }
      });
      /* Ver.2.32.17 re-use of equations with static scope supported -> */
      if(data.eqns){
        var j = scopes2d.length;
        var scopes = [scope0];
        var ids2d = [[j, 0]];
        self.make_scopes(data.options.useScope, data.eqns, scopes, ids2d, j);
        scopes2d.push(scopes);
      }
      /* -> Ver.2.32.17 */
    }
  }
  return {trees: trees2d, scopes: scopes2d};
};
/* Ver.2.30.15 default eval() -> */
My_entry.eval = function(script){
  return new My_entry.parser().eval(script);
};
My_entry.parser.prototype.eval = function(script){
  var self = this;
  var DATA = self.entry.DATA;
  var _msg = "";
  var data = DATA.data();  // Ver.2.30.16
  data.in = script;
  data.options.useComplex = true;
  data.options.useMatrix = true;
  data.options.makeLog = true;
  try{
    self.run(data);
    _msg = data.log;
  }
  catch(e){
    _msg = self.entry.def.get_msgError(e, "Invalid operation");
  }
  return _msg;
};
/* -> Ver.2.30.15 */
My_entry.parser.prototype.run = function(data){
  var self = this;
  var _data = data;
  var trees2d = null;
  var scopes2d = null;
  try{
    var objs2d = self.script2objs2d(_data);
    trees2d = objs2d.trees;
    scopes2d = objs2d.scopes;
  }
  catch(e){
    throw new Error(self.entry.def.get_msgError(e, "Invalid {([])}"));
  }
  try{
    if(trees2d && trees2d.length){
      _data.trees2d = trees2d;
      _data.scopes2d = scopes2d;
      _data = self.entry.operation.run(_data);
      _data.out = trees2d;
    }
  }
  catch(e){
    throw new Error(self.entry.def.get_msgError(e, "Invalid operation"));
  }
  self.post_try(_data);
  return _data;
};
/* -> Ver.2.31.17 */
My_entry.parser.prototype.post_try = function(data){
  var self = this;
  var trees2d = data.trees2d;
  try{
    if(trees2d && trees2d.length){
      if(data.options.makeLog){
        data.log = self.make_log(data);
        data.logh = self.make_logh(data);
        data.logo = self.make_logo(data);
        data.arr_num = self.make_arr_num(data);
      }
    }
  }
  catch(e){
    throw new Error(self.entry.def.get_msgError(e, "Invalid post"));
  }
  return self;
};
My_entry.parser.prototype.make_arr_num = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var _arr_num = [];
  data.trees2d.forEach(function(trees, j){
    trees.forEach(function(tree, i){
      // Ver.2.11.4
      var num = null;
      var mat = tree.mat;
      var out = tree.out;
      if(mat){
        num = DATA.arr2num(mat.arr);
      }
      else if(out){
        num = DATA.num(0, 0);
      }
      _arr_num.push(num);
    });
  });
  return _arr_num;
};
My_entry.parser.prototype.make_log_num = function(num, options){
  var self = this;
  var DATA = self.entry.DATA;
  var _log = "";
  var useComplex = options.useComplex;
  var ed = options.expDigit;
  var checkError = options.checkError;
  if(num.com){
    var cr = num.com.r;
    var ci = num.com.i;
    var lr = num.isL.r;
    var li = num.isL.i;
    if(lr && li){
      _log += "infoLost[ri] ";
    }
    else if(lr){
      _log += "infoLost[r ] ";
    }
    else if(li){
      _log += "infoLost[ i] ";
    }
    /* Ver.2.151.38 -> */
    var hasToLocaleString = (typeof("".toLocaleString) === "function");
    var is0_cr = (hasToLocaleString && !(cr));
    var str_cr = (is0_cr)? cr.toLocaleString(): String(cr);
    var cre = (ed>=0)? cr.toExponential(ed): str_cr;
    if(useComplex){
      var is0_ci = (hasToLocaleString && !(ci));
      var str_ci = (is0_ci)? ci.toLocaleString(): String(ci);
      var cie = (ed>=0)? ci.toExponential(ed): str_ci;
      var isM0_ci = (options.checkComplex && str_ci === "-0");
      var hasI = (ci || isM0_ci);
      _log += (cr)? cre: ((hasI)? "": cre);
      _log += (cr&&ci)? ((ci>0)? "+": ""): "";
      _log += (hasI)?
         (ci=== 1)?  "i":
         (ci===-1)? "-i":
                 cie+"i":
                      "";
    }
    else{
      _log += cre;
    }
    /* -> Ver.2.151.38 */
    if(num.err.r || num.err.i){
      _log += "+O(";
      var ed = options.expDigit;
      options.expDigit = 0;
      _log += self.make_log_num(DATA.num(num.err.r, num.err.i), options);
      options.expDigit = ed;
      _log += ")";
    }
  }
  else{
    self.entry.operation.throw_tree(num);
  }
  return _log;
};
My_entry.parser.prototype.make_log_mat = function(arr, options){
  var self = this;
  var _log = "";
  var is0d = (arr.length === 1 && arr[0].length === 1);
  /* Ver.1.5.3 */
  if(!(is0d)){
    _log += "(";
    if(options.makeLog === 2){
      _log += "\n";
    }
  }
  for(var n=0, len_n=arr.length; n<len_n; ++n){
    if(n > 0){
      _log += ":";
      if(options.makeLog === 2){
        _log += "\n";
      }
    }
    for(var m=0, len_m=arr[n].length; m<len_m; ++m){
      if(m > 0) _log += ",";
      _log += self.make_log_num(arr[n][m], options);
    }
  }
  if(!(is0d)){
    if(options.makeLog === 2){
      _log += "\n";
    }
    _log += ")";
  }
  return _log;
};
My_entry.parser.prototype.make_log = function(data){
  var self = this;
  var _log = "";
  var options = data.options;
  data.trees2d.forEach(function(trees, j){
    if(j > 0){
      _log += ";";
    }
    trees.forEach(function(tree, i){
      if(i > 0){
        _log += ":";
      }
      if(tree){
        var mat = tree.mat;
        var out = tree.out;
        if(mat){
          var arr = mat.arr;
          _log += self.make_log_mat(arr, options);
        }
        else if(out){
          var tagVal = out.val;
          if(typeof tagVal === "string"){
            _log += tagVal;
          }
          else{
            var name = tagVal.name;
            var arr = tagVal.arr;
            var is0d = (arr.length === 1 && arr[0].length === 1);
            var isAns = (name === "ans");
            if(!(is0d && isAns)){
              _log += name+"=";
            }
            _log += self.make_log_mat(arr, options);
          }
        }
      }
    });
  });
  return _log;
};
My_entry.parser.prototype.make_logh = function(data){
  var self = this;
  var _log = "";
  var str_in = data.in;
  var str_out = data.log;
  var make_line = function(str_in, str_out){
    return ((str_in && str_out)? (str_in+"\n"+str_out+"\n\n"): "");
  };
  var arr_in = self.script2arr(str_in);
  var arr_out = self.script2arr(str_out);
  var len_in = arr_in.length;
  var len_out = arr_out.length;
  if(!(len_in === len_out)){
    arr_in = self.script2arr(self.remove_commentAndWspace(str_in));
  }
  for(var i=len_out-1; i>=0; --i){
    var str_in = arr_in[i];
    var str_out = arr_out[i];
    _log += make_line(str_in, str_out);
  }
  return _log;
};
My_entry.parser.prototype.make_logo = function(data){
  var self = this;
  var _log = "";
  var options = data.options;
  for(var prop in options){
    if(_log) _log += "&";
    _log += prop+"="+options[prop];
  }
  return _log;
};
