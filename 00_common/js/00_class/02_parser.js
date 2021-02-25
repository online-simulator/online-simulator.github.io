// online-simulator.github.io

My_entry.parser = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.parser.config =
My_entry.parser.prototype.config = {
  ERROR: {
    title: "[MyErr]"
  },
  SYNTAX: {
    pairs: [
      {s: "{", e: "}"},
      {s: "(", e: ")"},
      {s: "[", e: "]"}
    ],
    bs: {
      FNh: {
        RX: /^_r(.*)$/,
        IX: /^_i(.*)$/,
        DX: /^_d(.*)$/,
        PX: /^_p(.*)$/,
        SX: /^_s(.*)$/
      }
    },
    bas: [
      // StorE equation
      {b: /<=/, a: "SEe"},
      // RestorE equation
      {b: /=>/, a: "REe"},
      // fact -> "URf"
      {b: /!+/, a: function(str){
        return "URf"+","+str.length;
      }},
      // ** -> ^
      {b: /[\*]{2}/, a: "BRp"},
      // bit shift
      {b: /[\<]{2}|[\>]{2,3}/, a: "BRbs"}
    ],
    tagNames: {
      // delimiter
      // SeparatoR: "SR"
      ";": "SRs",  // sentence;sentence
      ":": "SRr",  // record:record
      ",": "SRt",  // tokens,tokens
      // BrackeT: "BT"
      "{": "BT2",
      "(": "BT1",
      "[": "BT0",
      // FunctioN: "FN?"
      // post-Unary operatoR: "UR?"
      "i": "URi",
      // Binary operatoR: "BR?"
      "^": "BRp",
      "%": "BRr",
      "*": "BRm",
      // omitted multiplication sign: "BRmo"
      "/": "BRd",
      // Pre-Unary operator minus or plus: "PUmp"
      "-": "BRsa", "+": "BRsa",
      // bit shift: "BRbs"
      "&": "BRba",  // bit and
      "@": "BRbx",  // bit xor
      "|": "BRbo",  // bit  or
      "=": "BRe"  // x+3=1 -> x=1-3 prior to substitution
    }
  }
};
My_entry.parser.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["reference", "$", "def", "math", "DATA", "operation"]);
  return self;
};
My_entry.parser.prototype.script2arr = function(script){
  var self = this;
  return script.split(";").filter(function(arg){return !(arg === "");});  // semi-colon; is removed
};
My_entry.parser.prototype.replace_series = function(str, bas){
  var self = this;
  var _str = str;
  bas.forEach(function(ba){
    _str = _str.replace(ba.b, ba.a);
  });
  return _str;
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
My_entry.parser.prototype.compare2bs = function(tokens, i, re){
  var self = this;
  var _tree = null;
  var token = tokens[i];
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
        if(tagName === "FNh"){
          var mc1 = mc[1];
          var trees = self.make_trees(mc1, re);
          if(trees && trees.length === 1){
            var tree = DATA.trees2tree(trees);
            if(tree["REv"]){
              _tree = DATA.tree_tag(tagName, {key: key, name: tree["REv"]["val"]});
            }
            else{
              throw "Invalid "+mc1+" called";
            }
          }
        }
        if(!(_tree)){
          throw "Invalid "+tagName+" called";
        }
      }
    }
  }
  return _tree;
};
My_entry.parser.prototype.compare2bas = function(tokens, i){
  var self = this;
  var _tree = null;
  var token = tokens[i];
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
  var DATA = self.entry.DATA;
  var tokens = sentence.match(re);
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
      if(ip_e-(ip_s+1)){  // () is removed
        var str_tokens = tokens.slice(ip_s+1, ip_e).join("");
        tree = DATA.tree_tag(tagName, self.make_trees(str_tokens, re));
      }
    }
    else if(tagName){
      tree = DATA.tree_tag(tagName, token_lower);
    }
    else if(self.entry.def.isNumber(token)){
      tree = DATA.tree_num(self.entry.def.Number(token), 0);
    }
    else{
      tree = self.compare2bas(tokens, i) || self.compare2bs(tokens, i, re);
    }
    if(ip_e || tree){
    }
    else switch(token_lower){
      // reserved word
      case "clear":
      case "stop":
        throw "Invalid "+token+" called";
        break;
      case "ans":
        tree = DATA.tree_tag("REv", token_lower);
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
      case "gauss":
      case "gaussian":
        tree = DATA.tree_tag("FNm", "gaussian");
        break;
      case "first":
      case "last":
        tree = DATA.tree_tag("FNm", token_lower);
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
      // "FN0orCT"
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
        tree = DATA.tree_num(Math.random(), 0);
        break;
      // "FN1"
      case "ln":
        tree = DATA.tree_tag("FN", "log");
        break;
      case "int":
        tree = DATA.tree_tag("FN", "floor");
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
      // My defined
      case "sin_deg":
      case "cos_deg":
      case "tan_deg":
      case "deg_asin":
      case "deg_acos":
      case "deg_atan":
      case "deg2rad":
      case "rad2deg":
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
      // "FN3or4"
      // My defined
      case "star":
      case "poly":
      case "polygon":
        tree = DATA.tree_tag("FN", token_lower);
        break;
      // "FNn" n<256 in Excel
      // Excel defined
      case "lcm":
      case "gcd":
      // Both defined
      case "min":
      case "max":
        tree = DATA.tree_tag("FNn", token_lower);
        break;
      default:
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
My_entry.parser.prototype.get_msgError = function(e, msg){
  var self = this;
  return (e === false)?
    self.config.ERROR.title+(msg || ""):
    (typeof e === "string")?
      self.config.ERROR.title+e:
      e.message;
};
My_entry.parser.prototype.isCommand = function(sentence){
  var self = this;
  var _command = null;
  var sentence_lower = sentence.toLowerCase();
  switch(sentence_lower){
    case "clear":
    case "stop":
      _command = sentence_lower;
      break;
    default:
      break;
  }
  return _command;
};
My_entry.parser.prototype.script2trees = function(script){
  var self = this;
  var _trees2d = [];
  var script = self.remove_commentAndWspace(script);
  var arr_sentence = self.script2arr(script);
  arr_sentence.forEach(function(sentence){
    var isOK = self.check_syntax(sentence);
    if(isOK){
      var trees = null;
      var command = self.isCommand(sentence);
      if(command){
        trees = command;
      }
      else{
        var re = new RegExp(self.get_pattern(), "g");
        trees = self.make_trees(sentence, re);
      }
      _trees2d.push(trees);
    }
  });
  return _trees2d;
};
My_entry.parser.prototype.run = function(_data){
  var self = this;
  var _data = _data;
  var ans = _data.vars.ans;  // store
  var trees2d = [];
  try{
    if(_data && _data.in){
      trees2d = self.script2trees(_data.in);
    }
  }
  catch(e){
    throw new Error(self.get_msgError(e, "Invalid {([])}"));
  }
  try{
    if(trees2d.length){
      _data.trees2d = trees2d;
      _data = self.entry.operation.run(_data);
      _data.out = trees2d;
      if(_data.options.makeLog){
        _data.log = self.make_log(_data);
        _data.logh = self.make_logh(_data);
        _data.logo = self.make_logo(_data);
      }
    }
  }
  catch(e){
    _data.vars.ans = ans;    // restore
    throw new Error(self.get_msgError(e, "Invalid operation"));
  }
  return _data;
};
My_entry.parser.prototype.make_log_num = function(num, options){
  var self = this;
  var _log = "";
  var useComplex = options.useComplex;
  var ed = options.expDigit;
  var checkError = options.checkError;
  if(num.com){
    var cr = num.com.r;
    var ci = num.com.i;
    if(num.isL.r || num.isL.i){
      _log += "infoLost!! ";
    }
    cre = (ed>=0)? cr.toExponential(ed): cr;
    if(useComplex){
      cie = (ed>=0)? ci.toExponential(ed): ci;
      _log += (cr)? cre: ((ci)? "": cre);
      _log += (cr&&ci)? ((ci>0)? "+": ""): "";
      _log += (ci)?
         (ci=== 1)?  "i":
         (ci===-1)? "-i":
                 cie+"i":
                      "";
    }
    else{
      _log += cre;
    }
  }
  else{
    throw "Invalid "+self.entry.operation.throw_tree(num);
  }
  return _log;
};
My_entry.parser.prototype.make_log_mat = function(arr, options){
  var self = this;
  var _log = "";
  var is0d = (arr.length === 1 && arr[0].length === 1);
  _log += (is0d)? "": "(";
  for(var n=0, len_n=arr.length; n<len_n; ++n){
    if(n > 0) _log += ":";
    for(var m=0, len_m=arr[n].length; m<len_m; ++m){
      if(m > 0) _log += ",";
      _log += self.make_log_num(arr[n][m], options);
    }
  }
  _log += (is0d)? "": ")";
  return _log;
};
My_entry.parser.prototype.make_log = function(data){
  var self = this;
  var _log = "";
  var options = data.options;
  data.trees2d.forEach(function(trees, j){
    if(j > 0) _log += ";";
    trees.forEach(function(tree, i){
      if(i > 0) _log += ":";
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
            _log += (is0d && isAns)? "": name+"=";
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
  if(len_in === len_out){
    var len = arr_in.length;
    for(var i=len-1; i>=0; --i){
      var str_in = arr_in[i];
      var str_out = arr_out[i];
      _log += make_line(str_in, str_out);
    };
  }
  else{
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
