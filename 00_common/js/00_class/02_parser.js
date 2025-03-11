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
    /* Ver.2.389.86 */
    _bs: {
      /* Ver.2.21.10 -> */
      FNmh: {
        EX: /^_e(.*)$/i,  // Ver.2.23.11
        OX: /^_o(.*)$/i,
        TX: /^_t(.*)$/i  // Ver.2.238.56
      },
      /* -> Ver.2.21.10 */
      /* Ver.2.20.9 -> */
      FNh: {
        RX: /^_r(.*)$/i,
        IX: /^_i(.*)$/i,
        DX: /^_d(.*)$/i,
        PX: /^_p(.*)$/i,
        SX: /^_s(.*)$/i
      }
      /* -> Ver.2.20.9 */
    },
    bs: {
      /* Ver.2.176.43 */
      FNm: {
        interp: /^interp(\d+)$/i
      },
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
      {b: /[=]{1,2}</, a: "SEe"},  // Ver.2.219.50
      // RestorE equation
      {b: /[=]{1,2}>/, a: "REe"},  // Ver.2.31.17
      // fact -> "UR"  // Ver.2.192.44
      {b: /!+/, a: function(str){
        return "UR"+","+str.length;
      }},
      // size -> "PU"  // Ver.2.752.113
      {b: /#+/, a: function(str){
        return "PU"+","+str.length;
      }},
      // ** -> ^
      {b: /[*]{2}/, a: "BRpp"},  // Ver.2.87.32
      {b: /[%]{1,2}/, a: "BRdm"},  // Ver.2.87.32
      // check prior to bit shift
      {b: /<<>>/, a: "BRrl"},  // Ver.2.225.52
      // bit shift
      {b: /[<]{2}|[>]{2,3}/, a: "BRbs"},
      // relational operator check first
      {b: /[=]{2,3}/, a: "BRrl"},  // Ver.2.167.40
      {b: /<>/, a: "BRrl"},
      // comparison operator check second
      {b: /<[=]{0,1}/, a: "BRcn"},
      {b: />[=]{0,1}/, a: "BRcn"},
      /* Ver.2.59.26 -> */
      // logical operator
      {b: /[&]{3,4}|[|]{3,4}/, a: "BRlAOs"},  // Ver.2.157.38 short-circuit  // Ver.2.196.46
      {b: /[~]{2}/, a: "PUlN"},  // Ver.2.81.32
      {b: /[&]{2}/, a: "BRlA"},
      {b: /[@]{2}/, a: "BRlX"},  // Ver.2.168.41
      {b: /[|]{2}/, a: "BRlO"}
      /* -> Ver.2.59.26 */
    ],
    tagNames: {
      // escape
      "$": "null string",  // Ver.2.301.72
      "?": "null string",  // Ver.2.303.73
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
      // post-Unary operatoR: "UR"  // Ver.2.192.44
      "'": "UR",  // Ver.2.192.44
      ".": "UR",  // Ver.2.192.44
//      "i": "UR",  // Ver.2.192.44  // Ver.2.390.86 moved to self.switch_token()
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
    props: ["map", "filter", "filter0"],  // props for iterable with ref  // Ver.2.214.49  // Ver.2.263.62
    props_method: ["unshift", "push", "shift", "pop", "flip"],  // prototype method using ref  // Ver.2.298.72  // Ver.2.372.86
    word: {
      escape: "$",  // Ver.2.294.72
      prifix: ((My_entry.flag.useES6)? /^0[xXbBoO]/: /^0[xX]/)  // Ver.2.146.37
    }
  },
  /* Ver.2.216.50 moved from operation.js */
  BT: {
    SEe: "eqn",  // Ver.2.292.71
    /* Ver.2.31.17 */
    hasScope: function(useScope, tagName, opt_useScopeWith){  // Ver.2.213.48
      var _sw = false;
      var isBTe = (tagName === "BTe");  // Ver.2.213.48 data.eqns re-used
      /* Ver.2.32.17 */
      var get_sw = function(notBT){
        return (tagName.substring(0, 2) === "BT" && !(isBTe) && tagName !== notBT);  // Ver.2.213.48
      };
      switch(useScope){
        case false:
          break;
        case true:
          _sw = get_sw("");
          break;
        case "notBT2":
        case "notBT1":
        case "notBT0":
          _sw = get_sw(useScope.substring(3));
          break;
        case "BT2":
        case "BT1":
          _sw = (tagName === useScope);
          break;
        default:
          _sw = (tagName === "BT0");
          break;
      }
      /* Ver.2.213.48 -> */
      if(opt_useScopeWith){
        _sw = _sw || isBTe;
      }
      /* -> Ver.2.213.48 */
      return _sw;
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
  else{
    throw "Invalid tokens("+token+")";  // Ver.2.294.72
  }
  return _tree;
};
/* Ver.2.146.37 */
My_entry.parser.prototype.check_varName_prifix = function(token, re){
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  /* Ver.2.294.72 -> */
  if(token.match(SYNTAX.word.prifix)){
    throw "Invalid varName("+token+")";
  }
  /* -> Ver.2.294.72 */
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
My_entry.parser.prototype.compare2bs = function(token, token_lower, token_upper, re){  // Ver.2.390.86
  var self = this;
  var _tree = null;
  var SYNTAX = self.config.SYNTAX;
  var DATA = self.entry.DATA;
  /* Ver.2.389.86 -> */
  var hasBar = (token[0] === "_");
  /* Ver.2.390.86 -> */
  var check_hasRule = (hasBar)?
    function(){
      return self.check_hasRule4FNh(token, token_lower, token_upper);
    }:
    function(){
      return self.check_hasRule(token, token_lower, token_upper);
    };
  /* -> Ver.2.390.86 */
  var callback = (hasBar)?
    // Ver.2.21.10
    function(mc1){
      var _tree = null;
      /* Ver.2.369.86 -> */
      var obj = {key: key};
      var num = Number(mc1);
      if(num){
        if(key === "OX" || key === "TX"){
          if(num === 2 || num === 4 || num === 5){
            mc1 = "";
            obj["order"] = num;
          }
          else{
            throw "Invalid order=4||2||5("+key+")";
          }
        }
        else if(key === "DX" || key === "IX"){
          if(num === 2 || num === 4){
            mc1 = "";
            obj["order"] = num;
          }
          else{
            throw "Invalid order="+((key === "DX")? "auto||4||2(": "4||2(")+key+")";
          }
        }
      }
      /* Ver.2.231.56 -> */
      var name = (mc1)? self.check_varName(mc1, re): mc1;  // mc1="" enabled  // Ver.2.389.86
      obj["name"] = name;
      _tree = DATA.tree_tag(tagName, obj);  // Ver.2.24.12
      /* -> Ver.2.231.56 */
      /* -> Ver.2.369.86 */
      return _tree;
    }:
    // Ver.2.176.43
    function(mc1){
      var _tree = DATA.tree_tag(tagName, key);
      _tree[tagName].i = Number(mc1);
      return _tree;
    };
  var bs = (hasBar)? SYNTAX._bs: SYNTAX.bs;
  /* -> Ver.2.389.86 */
  for(var tagName in bs){
    if(_tree) break;
    var bstagName = bs[tagName];
    for(var key in bstagName){
      if(_tree) break;
      var b = bstagName[key];
      var mc = token.match(b);
      if(mc && mc.length > 1 && !(check_hasRule())){  // Ver.2.390.86
        var mc1 = mc[1];
        _tree = callback(mc1);  // Ver.2.389.86
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
/* Ver.2.213.47 */
My_entry.parser.prototype.SEe2BTe = function(trees){
  var self = this;
  var _trees = trees;
  var DATA = self.entry.DATA;
  var operation = self.entry.operation;
  var BT = operation.config.BT;  // Ver.2.219.50
  var len = trees.length;
  var ip_s = -1;
  var ip_e = len;
  var isSEe = false;  // Ver.2.228.56
  var hasArgs = false;
  for(var i=0; i<len; ++i){
    var tree = trees[i];
    var tagName = Object.keys(tree)[0];  // Ver.2.302.73
    if(tagName === "SEe"){
      isSEe = true;  // Ver.2.228.56
      hasArgs = operation.isType(trees[i-1], "BT");  // Ver.2.228.56
      ip_s = i;  // i
      for(var ip=ip_s+1; ip<len; ++ip){  // Ver.2.228.56  // Ver.2.244.57
        var tree = trees[ip];
        var tagName = Object.keys(tree)[0];  // Ver.2.302.73
        if(tagName === "SRr" || tagName === "SRt"){
          ip_e = ip;
          break;
        }
      }
      break;
    }
  }
  if(ip_s+1 === ip_e) throw "Invalid =<null";  // f(=<)=>  // Ver.2.244.57 f(=<,)=>
  if(isSEe){
    /* Ver.2.228.56 -> */
    /* Ver.2.219.50 -> */
    var isSEee = (operation.get_tagVal(trees[ip_s], "SEe", "val") === "==<");  // first
    var useScopeWith = (self.useScopeWith === "SEe" || (self.useScopeWith && hasArgs))? true: false;  // bool
    trees[ip_s] = DATA.tree_tag(BT.SEe, self.SEe2BTe(trees.slice(ip_s+1, ip_e)));  // feedback2trees
    var obj = trees[ip_s][BT.SEe];
    obj.isSEee = isSEee;
    obj.useScopeWith = useScopeWith;
    /* -> Ver.2.219.50 */
    /* -> Ver.2.228.56 */
    for(var i=ip_s+1; i<ip_e; ++i){
      trees[i] = null;
    }
    _trees = self.SEe2BTe(trees.filter(Boolean));
  }
  return _trees;
};
/* Ver.2.390.86 -> */
My_entry.parser.prototype.check_hasRule = function(token, token_lower, token_upper){
  var self = this;
  var hasRule1 = (self.useFunc === 1 && !(token === token_lower));
  var hasRule2 = (self.useFunc === 2 && !(token === token_upper));
  var hasRule3 = (self.useFunc === 3 && !(token[0] === token_upper[0] && token.substring(1) === token_lower.substring(1)));
  return (hasRule1 || hasRule2 || hasRule3);
};
My_entry.parser.prototype.check_hasRule4FNh = function(token, token_lower, token_upper){
  var self = this;
  var hasRule1 = (self.useFunc === 1 && !(token[1] === token_lower[1]));
  var hasRule2 = (self.useFunc === 2 && !(token[1] === token_upper[1]));
  var hasRule3 = (self.useFunc === 3 && !(token[1] === token_upper[1]));
  return (hasRule1 || hasRule2 || hasRule3);
};
My_entry.parser.prototype.wrapper_useFunc = function(token, token_lower, token_upper, callback){
  var self = this;
  var _tree = null;
  if(!(self.check_hasRule(token, token_lower, token_upper))){
    _tree = callback();
  }
  return _tree;
};
/* -> Ver.2.390.86 */
/* Ver.2.230.56 */
My_entry.parser.prototype.switch_token = function(tokens, token, token_lower, token_upper, re){  // Ver.2.300.72
  var self = this;
  var _tree = null;
  var math = self.entry.math;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  switch(token_lower){
    // reserved word
    // token
    case "\\":
    case "\"":
    case "`":
      throw "reserved token("+token+")";
      break;
    // unary operator
    case "i":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("UR", token_lower);});
      break;
    // literal
    case "nan":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(NaN, 0);});
      break;
    case "false":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(false, 0);});
      break;
    case "true":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(true, 0);});
      break;
    // variable
    case "ans":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("REv", token_lower);});
      break;
    // command
    case "clear":
    case "store":
    case "restore":
    case "stop":
      throw "Invalid "+token+" called";
      break;
    // "FNc"
    case "hass":
    case "has":
    case "has__":
    case "del__":
    case "add__":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNc", token_lower);});
      break;
    // "FNhn"
    case "switch":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNh", {key: token_lower});});
      break;
    // "FN2"
    // real number
    // relational
    case "seq":
    case "sne":
    case "eq":
    case "ne":
    // comparison
    case "lt":
    case "le":
    case "gt":
    case "ge":
    // logical
    case "bitnot":
    case "bitand":
    case "bitxor":
    case "bitor":
    case "not":
    case "and":
    case "nand":
    case "xor":
    case "xnor":
    case "or":
    case "nor":
    // complex number
    // relational
    case "cseq":
    case "csne":
    case "ceq":
    case "cne":
    // logical
    case "cnot":
    case "cand":
    case "cnand":
    case "cxor":
    case "cxnor":
    case "cor":
    case "cnor":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", token_lower);});
      break;
    // "FNmh"
    case "jacobi":
    case "jacobian":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNmh", "jacobian");});
      break;
    case "newton":
    case "newtonian":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNmh", "newtonian");});
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
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_mat(math_mat[token_lower]());});
      break;
    // "FNm1"
    case "vectorr":
    case "vectorc":
    case "identity":
    case "isfalse":
    case "istrue":
    case "first":
    case "last":
    case "rotationx":
    case "rotationy":
    case "rotationz":
    case "sizer":
    case "size":
    case "sizec":
    case "normr":
    case "norm":
    case "normc":
    case "euclidean":
    case "normalizer":
    case "normalize":
    case "normalizec":
    case "trans":
    case "transpose":
    case "htrans":
    case "htranspose":
    case "hermitian":
    case "fft1d":
    case "ifft1d":
    // "FNm2"
    case "scalars":
    case "zeros":
    case "ones":
    case "coo2mat":
    case "mat2coo":
    case "interp":
    case "gauss_coo":
    case "gaussian_coo":
    case "gauss":
    case "gaussian":
    // "FNm2or3"
    // Matlab defined
    // Python defined
    case "linspace":
    // "FNm3"
    case "reshaper":
    case "reshape":
    case "reshapec":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNm", token_lower);});
      break;
    // "CT"
    // JavaScript defined
    case "epsilon":
    case "min_safe_integer":
    case "max_safe_integer":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(math.config[token_upper], 0);});
      break;
    case "min_value":
    case "max_value":
    case "positive_infinity":
    case "negative_infinity":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(Number[token_upper], 0);});
      break;
    // My defined
    case "eps":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(math.config["EPSILON"], 0);});
      break;
    case  "inf":
    case  "infinity":
    case "pinf":
    case "pinfinity":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(Number.POSITIVE_INFINITY, 0);});
      break;
    case "ninf":
    case "ninfinity":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(Number.NEGATIVE_INFINITY, 0);});
      break;
    case  "infi":
    case  "infinityi":
    case "pinfinityi":
    case "pinfi":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(0, Number.POSITIVE_INFINITY);});
      break;
    case "ninfinityi":
    case "ninfi":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(0, Number.NEGATIVE_INFINITY);});
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
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_num(Math[token_upper], 0);});
      break;
    // "FN0"
    // JavaScript defined
    case "random":
    // Excel defined
    case "rand":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", "random");});
      break;
    // "FN1"
    case "ln":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", "log");});
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
    case "isnan":
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
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", token_lower);});
      break;
    // "FN1or2"
    // Excel defined
    case "log_ex":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", token_lower);});
      break;
    // "FN2"
    case "power":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", "pow");});
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
    case "fquot":
    // "FN3or4"
    // My defined
    case "star":
    case "poly":
    case "polygon":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FN", token_lower);});
      break;
    // "FNn"
    // Excel defined@n<256
    case "lcm":
    case "gcd":
    // Both defined
    // real number
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
    case "camin":
    case "camax":
    case "cmedian":
    case "csort":
    case "creverse":
      _tree = self.wrapper_useFunc(token, token_lower, token_upper, function(){return DATA.tree_tag("FNn", token_lower);});
      break;
    default:
      break;
  }
  /* Ver.2.390.86 -> */
  if(!(_tree)){
    self.check_varName_prifix(token, re);  // Ver.2.24.12  // Ver.2.146.37
    _tree = DATA.tree_tag("REv", token);
  }
  /* -> Ver.2.390.86 */
  return _tree;
};
/* Ver.2.298.72 */
My_entry.parser.prototype.hasProp_token = function(token, isMethod){
  var self = this;
  var SYNTAX = self.config.SYNTAX;
  var _prop = "";
  var hasProp = false;
  SYNTAX[(isMethod)? "props_method": "props"].forEach(function(prop){
    hasProp = hasProp || (prop === token);
  });
  if(hasProp){
    _prop = "."+token;
  }
  return _prop;
};
/*
            j-th sentence
  trees2d: [j][i]{tag || num}
  trees1d,     i-th token
    trees: [i]{}
  trees0d,
     tree: {}
      tag: {"name": {id, val: val}}
         : {"BT?":  {id, val: [], ref: [], ids: [], arg: [], flag}}
      num: {mat:    {id, arr: arr, flag}}
      1+i: arr [0] [0] {com: {r: 1, i: 1}}
   matrix:     row col {complex number   }
(i,2:3,4): arr [0] [0] {com: {r: 0, i: 1}}
               [0] [1] {com: {r: 2, i: 0}}
               [1] [0] {com: {r: 3, i: 0}}
               [1] [1] {com: {r: 4, i: 0}}
*/
My_entry.parser.prototype.make_trees = function(sentence, opt_re){  // Ver.2.158.38
  var self = this;
  var _trees = [];  // [i]
  var SYNTAX = self.config.SYNTAX;
  var math_mat = self.entry.math_mat;
  var DATA = self.entry.DATA;
  var operation = self.entry.operation;
  var re = opt_re || new RegExp(self.get_pattern(), "g");  // Ver.2.158.38
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
    var tree = null;  // Ver.2.230.56
    var leftTree = _trees[_trees.length-1];  // Ver.2.272.63
    var token_left = tokens[i-1];  // Ver.2.230.56
    var token = tokens[i];
    var token_lower = token.toLowerCase();
    var token_upper = token.toUpperCase();
    var tagName = SYNTAX.tagNames[token_lower];
    var ip_e = self.compare2pairs(tokens, i);
    /* Ver.2.158.38 -> */
    if(ip_e){
      i_next = ip_e;
      var ip_s = i;
      var hasElem = ip_e-(ip_s+1);
      if(hasElem){
        var str_tokens = tokens.slice(ip_s+1, ip_e).join("");
        tree = self.check_csv(str_tokens, tagName) || DATA.tree_tag(tagName, self.make_trees(str_tokens, re));  // Ver.2.142.36
      }
      /* Ver.2.272.63 -> */
      else if(token === "{"){
        throw "Invalid {}";
      }
      else if(token === "["){
        tree = DATA.tree_tag(tagName, [DATA.tree_mat([])]);  // [] -> empty array  // Ver.2.170.41
      }
      else if(leftTree && leftTree.mat && operation.has1elem_tag(leftTree.mat.arr, "com")){  // CT() -> removed
      }
      else if(token === "("){
        tree = DATA.tree_tag(tagName, []);  // () -> empty tree
      }
      /* -> Ver.2.272.63 */
    }
    else if(tagName){
      tree = DATA.tree_tag(tagName, token_lower);
    }
    /* -> Ver.2.158.38 */
    else if(self.entry.def.isNumber(token)){
      tree = DATA.tree_num(self.entry.def.Number(token), 0);
    }
    else{
      tree = self.compare2bas(token) || self.compare2bs(token, token_lower, token_upper, re);  // Ver.2.20.9  // Ver.2.390.86
      tree = tree || self.switch_token(tokens, token, token_lower, token_upper, re);  // Ver.2.230.56  // Ver.2.300.72  // Ver.2.390.86
    }
    if(tree){
      tree = self.check_token_left(tree, token_left, token, token_lower, token_upper);  // Ver.2.300.72
      /* Ver.2.298.72 -> */
      if(tree.isReplaced){  // Ver.2.300.72
        tree = tree.isReplaced;  // Ver.2.300.72
        self.set_id_tree(tree);  // last
        _trees[_trees.length-1] = tree;
      }
      /* -> Ver.2.298.72 */
      else{
        /* Ver.2.264.62 -> */
        self.set_id_tree(tree);  // last
        _trees.push(tree);  // Ver.2.221.50  // Ver.2.228.56
        /* -> Ver.2.264.62 */
      }
    }
    i = i_next;
  }
  return self.SEe2BTe(_trees);  // Ver.2.213.47  // Ver.2.228.56
};
/* Ver.2.300.72 */
My_entry.parser.prototype.check_token_left = function(tree, token_left, token, token_lower, token_upper){
  var self = this;
  var DATA = self.entry.DATA;
  var operation = self.entry.operation;
  var _tree = tree;
  /* Ver.2.301.72 -> */
  var isEscape = (token_left === "$" || token_left === "?");  // Ver.2.303.73
  if(isEscape){
    var symbol = operation.get_tagVal(tree, "REv", "val");
    if(symbol){
      _tree = {isReplaced: DATA.tree_tag("REv", token_left+symbol)};
    }
    else{
      throw "Invalid "+token_left+"symbol";
    }
  }
  /* -> Ver.2.301.72 */
  /* Ver.2.298.72 -> */
  /* Ver.2.214.49 -> */
  else if(token_left === "."){  // Ver.2.230.56
    var prop = operation.get_tagVal(tree, "REv", "val");  // Ver.2.300.72
    if(prop){
      var token_method = self.hasProp_token(token_lower, true);
      if(token_method){
        _tree = {isReplaced: DATA.tree_tag("REv", token_method)};  // Ver.2.300.72
      }
      else{
        var hasProp = self.hasProp_token(token_lower);
        if(hasProp){
          _tree = DATA.tree_tag("REv", hasProp);
        }
        else{
          throw "Undef .prop("+prop+")";  // Ver.2.300.72
        }
      }
    }
  }
  /* -> Ver.2.214.49 */
  /* -> Ver.2.298.72 */
  return _tree;
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
/* Ver.2.214.50 -> */
My_entry.parser.prototype.set_hasTag = function(tree){
  var self = this;
  if(tree){
    self.hasTag[Object.keys(tree)[0]] = true;  // Ver.2.302.73
  }
  return self;
};
My_entry.parser.prototype.check_hasTag = function(trees){
  var self = this;
  var callback_pre = function(tree){
    self.set_hasTag(tree);
  };
  var callback = function(trees){
    self.check_hasTag(trees);
  };
  self.entry.operation.wrapper_loop(trees, callback_pre, callback);  // Ver.2.293.71
  return self;
};
/* -> Ver.2.214.50 */
/* Ver.2.264.62 delete -> restore -> */
/* Ver.2.261.61 delete -> */
My_entry.parser.prototype.restore_id_tree = function(tree){
  var self = this;
  var tagName = Object.keys(tree)[0];  // Ver.2.302.73
  if(tagName){  // no filter
    var obj = tree[tagName];
    self.id_tree = Math.max(self.id_tree, obj.id || 0);
  }
  return self;
};
My_entry.parser.prototype.check_id_trees = function(trees){
  var self = this;
  var callback_pre = function(tree){
    self.restore_id_tree(tree);
  };
  var callback = function(trees){
    self.check_id_trees(trees);
  };
  self.entry.operation.wrapper_loop(trees, callback_pre, callback);  // Ver.2.293.71
  return self;
};
My_entry.parser.prototype.init_id_tree = function(data){
  var self = this;
  self.id_tree = 0;
  if(data.vars){
    self.check_id_trees(data.vars);
  }
  if(data.eqns){
    self.check_id_trees(data.eqns);
  }
  self.id_tree += 1;  // Ver.2.261.61 id_tree=1~
  return self;
};
/* -> Ver.2.261.61 */
My_entry.parser.prototype.set_id_tree = function(tree){
  var self = this;
  var tagName = Object.keys(tree)[0];  // Ver.2.302.73
  if(tagName === "REv"){  // filter
    tree[tagName].id = self.id_tree++;
  }
  return self;
};
My_entry.parser.prototype.check_id_tree_max = function(){
  var self = this;
  if(self.id_tree > Number.MAX_SAFE_INTEGER){
    throw "id_tree is over limit";
  }
  return self;
};
/* -> Ver.2.264.62 */
/* Ver.2.293.71 */
/* Ver.2.200.46 */
/* Ver.2.32.17 */
/* Ver.2.31.17 (1,[2,{3,4}]) -> */
My_entry.parser.prototype.make_scopes = function(useScope, trees, scopes_upper, ids2d_upper, j){
  var self = this;
  var DATA = self.entry.DATA;
  var callback_hasScope = function(tagName, obj){
    return self.config.BT.hasScope(useScope, tagName, obj.useScopeWith);
  };
  self.entry.operation.make_scopes(callback_hasScope, trees, scopes_upper, ids2d_upper, j);
  return self;
};
My_entry.parser.prototype.script2objs2d = function(data){
  var self = this;
  var DATA = self.entry.DATA;
  var trees2d = null;
  var scopes2d = null;
  if(data && data.in){
    self.hasTag = {};  // Ver.2.286.67
    self.init_id_tree(data);  // Ver.2.264.62
    data.in = String(data.in);  // Ver.2.30.15
    var script = self.remove_commentAndWspace(self.entry.reference.fullStr2half(data.in));
    var arr_sentence = self.script2arr(script);
    var scope0 = DATA.scope(data.vars, data.eqns);
    if(arr_sentence && arr_sentence.length){
      var j = 0;
    try{
      trees2d = [];
      scopes2d = [];
      for(var len_j=arr_sentence.length; j<len_j; ++j){
        var sentence = arr_sentence[j];
        var isOK = self.check_syntax(sentence);
        if(isOK){
          var trees = null;
          var scopes = [scope0];  // including command
          var command = self.isCommand(sentence);
          if(command){
            trees = command;
          }
          else{
            self.useFunc = data.options.useFunc;  // Ver.2.221.50
            self.useScopeWith = data.options.useScopeWith;  // Ver.2.213.47
            trees = self.make_trees(sentence);  // Ver.2.158.38
            var ids2d = [[j, 0]];
            self.make_scopes(data.options.useScope, trees, scopes, ids2d, j);
            self.check_hasTag(trees);  // Ver.2.212.46  // Ver.2.214.50  // Ver.2.218.50
          }
          trees2d.push(trees);
          scopes2d.push(scopes);
        }
      }
      /* Ver.2.32.17 re-use of equations with static scope supported -> */
      if(data.eqns){
        var j = scopes2d.length;
        var scopes = [scope0];
        var ids2d = [[j, 0]];
        self.make_scopes(data.options.useScope, data.eqns, scopes, ids2d, j);
        scopes2d.push(scopes);
        self.check_hasTag(data.eqns);  // Ver.2.214.50
        self.check_hasTag(data.vars);  // Ver.2.277.65
      }
      /* -> Ver.2.32.17 */
    }
    catch(e){
      throw {message: e, j: j, process: "pre"};  // Ver.2.278.65
    }
    }
    self.check_id_tree_max();  // Ver.2.264.62
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
  data.options.useComplex = (My_entry.math_com)? -1: false;  // Ver.2.184.44  // Ver.2.189.44
  data.options.useMatrix = (My_entry.math_mat)? true: false;  // Ver.2.189.44
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
      _data.hasTag = self.hasTag;  // Ver.2.212.46
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
  try{
    trees.forEach(function(tree, i){
      // Ver.2.11.4
      var num = null;
      var mat = tree.mat;
      var out = tree.out;
      if(mat){
        /* Ver.2.224.51 -> */
        var arr = mat.arr;
        /* Ver.2.158.38 -> */
        var isEmpty = (arr.length === 0);
        num = (isEmpty || DATA.hasVar_arr(arr))? DATA.num(NaN, NaN): DATA.arr2num(arr);  // Ver.2.279.65 0 -> NaN
        /* -> Ver.2.158.38 */
        /* -> Ver.2.224.51 */
      }
      else if(out){
        num = DATA.num(0, 0);
      }
      _arr_num.push(num);
    });
  }
  catch(e){
    throw {message: e, j: j, process: "post"};  // Ver.2.274.65  // Ver.2.278.65
  }
  });
  return _arr_num;
};
My_entry.parser.prototype.make_log_num = function(num, options){
  var self = this;
  var DATA = self.entry.DATA;
  var BT = self.entry.operation.config.BT;  // Ver.2.277.65
  var _log = "";
  var useComplex = options.useComplex;
  var ed = options.expDigit;
  var checkError = options.checkError;
  var hasEd = (ed >= 0);  // Ver.2.161.39
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
    /* Ver.2.163.39 -> */
    var isNaN_cr = isNaN(cr);
    var isNaN_ci = isNaN(ci);
    var is0_cr = (hasToLocaleString && !(cr) && !(isNaN_cr));
    /* -> Ver.2.163.39 */
    var str_cr = (is0_cr)? cr.toLocaleString(): String(cr);
    var cre = (hasEd && self.entry.def.isNumber(cr))? cr.toExponential(ed): str_cr;  // Ver.2.161.39
    if(useComplex){
      var is0_ci = (hasToLocaleString && !(ci) && !(isNaN_ci));  // Ver.2.163.39
      var str_ci = (is0_ci)? ci.toLocaleString(): String(ci);
      var cie = (hasEd && self.entry.def.isNumber(ci))? ci.toExponential(ed): str_ci;  // Ver.2.161.39
      /* Ver.2.163.39 -> */
    /* Ver.2.167.41 -> */
    if(isNaN_cr){
      _log += cre;
    }
    else{
      _log += (cr)? cre: ((ci)? "": cre);
      _log += (cr&&ci)? ((ci>0)? "+": ""): "";
      _log += (ci)?
         (ci=== 1)?  "i":
         (ci===-1)? "-i":
                 cie+"i":
                      "";
    }
    /* -> Ver.2.167.41 */
      if(options.checkComplex){
        if(str_ci === "-0"){
          _log += "-0i";  // Ver.2.151.38
        }
        else if(isNaN_ci){
          _log += "+(NaN)i";
        }
      }
      /* -> Ver.2.163.39 */
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
  /* Ver.2.277.65 -> */
  else if(num[BT.SEe]){
    _log += self.get_log_arr(null, options, num);  // Ver.2.288.70
  }
  /* -> Ver.2.277.65 */
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
  /* Ver.2.158.38 -> */
  var isEmpty = (arr.length === 0);
  _log = (isEmpty)? "[]": _log;
  /* -> Ver.2.158.38 */
  return _log;
};
/* Ver.2.288.70 */
My_entry.parser.prototype.get_log_arr = function(arr, options, opt_arr00){
  var self = this;
  var BT = self.entry.operation.config.BT;  // Ver.2.285.67
  var _log = "";
  var arr00 = opt_arr00 || self.entry.operation.get_arr00_isSEe(arr);
  var isSEe = arr00 && arr00[BT.SEe];
  if(isSEe){
    var isEqn = self.entry.operation.isEqn_obj(isSEe);  // Ver.2.290.71
    var symbol = (isEqn)? null: self.entry.operation.get_symbol(isSEe, true);  // Ver.2.290.71
    _log += (opt_arr00)? "": "(";
    if(symbol){
      _log += self.config.SYNTAX.word.escape+symbol;  // Ver.2.294.72
    }
    else{
      _log += self.config.BT.SEe;  // Ver.2.292.71
      if(isEqn){  // Ver.2.290.71
        _log += "(";
        _log += isSEe.arg || "";
        _log += ")";
      }
    }
    _log += (opt_arr00)? "": ")";
  }
  else{
    _log = self.make_log_mat(arr, options);  // Ver.2.285.67
  }
  return _log;
};
My_entry.parser.prototype.make_log = function(data){
  var self = this;
  var options = data.options;
  var _log = "";
  var get_log_arr = function(arr){
    return (self.entry.operation.get_arr00_isSEe(arr))? "("+BT.SEe+")": self.make_log_mat(arr, options);  // Ver.2.285.67
  };
  data.trees2d.forEach(function(trees, j){
  try{
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
          _log += self.get_log_arr(arr, options);  // Ver.2.285.67  // Ver.2.288.70
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
            _log += self.get_log_arr(arr, options);  // Ver.2.285.67  // Ver.2.288.70
          }
        }
      }
    });
  }
  catch(e){
    throw {message: e, j: j, process: "post"};  // Ver.2.274.65  // Ver.2.278.65
  }
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
