// online-simulator.github.io

My_entry.test_number = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.def.mix_in(My_entry.test_number, My_entry.original_main);

My_entry.test_number.prototype.init = function(){
  var self = this;
  self.init_main.call(self, ["$"]);
  /* Ver.0.32.4 */
  self.val2dec = (My_entry.flag.hasBigInt)?
    function(val){
      var num = Number(val);
      return ((num%1 || isNaN(num))? NaN: BigInt(val));
    }:
    function(val){
      return "not supported";
    };
  return self;
};
My_entry.test_number.prototype.init_elems = function(){
  var self = this;
  self.entry.$.setup_elems_readonly$("input,textarea");
  self.entry.$.setup_elems$_tag("button", self.handlers, "onclick");
  self.entry.$.setup_elems$_tag("input", self.handlers, "onchange");
  return self;
};
My_entry.test_number.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    var id = elem.id || elem.innerText;
    switch(id){
      case "solve0":  // Ver.0.32.4
      case "solve1":  // Ver.0.32.4
      case "clear":
      case "convert":
        self[id]();
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    var id = elem.id || elem.innerText;
    switch(id){
      case "input-radix":
      case "input-string":
        self.convert();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_entry.test_number.prototype.clear = function(){
  var self = this;
  var $ = self.entry.$;
  $._id("input-parseInt").value = "";
  $._id("input-parseFloat").value = "";
  $._id("input-Number").value = "";
  $._id("input-string").value = "";
  $._id("input-radix").value = "";  // Ver.0.29.4
  /* Ver.0.32.4 -> */
  $._id("input-BigInt").value = "";
  $._id("output-log").innerHTML = "";
  $._id("output-html").innerHTML = "";
  /* -> Ver.0.32.4 */
  return self;
};
My_entry.test_number.prototype.convert = function(){
  var self = this;
  var $ = self.entry.$;
  var str = $._id("input-string").value;
  var radix = $._id("input-radix").value;  // Ver.0.29.4
  $._id("input-parseInt").value = parseInt(str, radix);
  $._id("input-parseFloat").value = parseFloat(str);
  $._id("input-Number").value = Number(str);
  /* Ver.0.32.4 -> */
  $._id("input-BigInt").value = self.val2dec(str);
  $._id("output-log").innerHTML = "";
  $._id("output-html").innerHTML = "";
  /* -> Ver.0.32.4 */
  return self;
};
/* Ver.0.32.4 -> */
My_entry.test_number.prototype.solve = function(isMinus){
  var self = this;
  var $ = self.entry.$;
  self.convert();
  var str = $._id("input-string").value;
  var num = self.val2dec(str);
  if(isNaN(Number(num))) return false;
  var len_m = 4;
  var freq2d = new Array(len_m);
  for(var m=1; m<len_m; ++m){
    var len = Math.pow(2, m-1);
    freq2d[m] = new Array(len);
    for(var i=0; i<len; ++i){
      freq2d[m][i] = 0;
    }
  }
  var save_freq = function(num){
    for(var m=1; m<len_m; ++m){
      var n2 = "00000000"+num.toString(2);
      var len = n2.length;
      if(len-m >= 0){
        var n2sub = n2.substring(len-m, len-1) || "0";
        var n2num = Number("0b"+n2sub);
        freq2d[m][n2num] += 1;
      }
    }
  };
  var output = function(){
    var _html = "";
    var hasClass = arguments[0];
    _html += "<tr";
    _html += (hasClass)? " class="+hasClass: "";
    _html += ">";
    for(var i=1, len=arguments.length; i<len; ++i){
      _html += "<td>";
      _html += arguments[i];
      _html += "</td>";
    }
    _html += "</tr>";
    return _html;
  };
  var calc_Nrshift = (isMinus)?
    function(i){
      return (freq2d[3][0]*1+freq2d[3][1]*3+freq2d[3][2]*1+freq2d[3][3]*2)/freq2d[1][0];
    }:
    function(i){
      return (freq2d[3][0]*2+freq2d[3][1]*1+freq2d[3][2]*3+freq2d[3][3]*1)/freq2d[1][0];
    };
  var left_shift = (isMinus)?
    function(num){
      return (num*2n+(num-1n));
    }:
    function(num){
      return ((num*2n+1n)+num);
    };
  var isBreak = (isMinus)?
    function(num, i){
      var _msg = "";
      if(num === 17n || num === 5n){
        _msg = "n -> "+num+"-circular";
      }
      else if(num === 1n){
        _msg = "n -> 1";
      }
      else if(num <= 0n){
        _msg = "n <= 0";
      }
      if(_msg){
        _msg += "<br>with No.="+i;
        $._id("output-log").innerHTML = "<caption class='selection'>"+_msg+"</caption>";
      }
      return _msg;
    }:
    function(num, i){
      var _msg = "";
      if(num === 1n){
        _msg = "n -> 1";
      }
      else if(num <= 0n){
        _msg = "n <= 0";
      }
      if(_msg){
        _msg += "<br>with No.="+i;
        $._id("output-log").innerHTML = "<caption class='run'>"+_msg+"</caption>";
      }
      return _msg;
    };
  var run = function(num, N){
    var _html = "";
    _html += output("", "No.", "dec", "hex", "oct", "bin", "frequency ls3bit=001,011,101,111", "<a title='Graphing Calculator' href='../02_calc_graphing/index.html'>Nrshift</a>");
    for(var i=0; i<N; ++i){
      if(num%2n === 0n){
        _html += output("", i, num, num.toString(16), num.toString(8), num.toString(2));
        if(isBreak(num, i)){
          break;
        }
        num /= 2n;
      }
      else{
        save_freq(num);
        _html += output("condition", i, num, num.toString(16), num.toString(8), num.toString(2), freq2d[3], calc_Nrshift(i));
        if(isBreak(num, i)){
          break;
        }
        num = left_shift(num);
      }
    }
    return _html;
  };
  $._id("output-html").innerHTML = run(num, 1e6);
  return self;
};
My_entry.test_number.prototype.solve0 = function(){
  var self = this;
  self.solve();
  return self;
};
My_entry.test_number.prototype.solve1 = function(){
  var self = this;
  self.solve(true);
  return self;
};
/* -> Ver.0.32.4 */
