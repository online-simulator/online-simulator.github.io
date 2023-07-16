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
  self.len_m = 12;  // Ver.0.33.4
  /* Ver.0.35.4 -> */
  self.log = function(num){return Math.log(Number(num));};
  self.len_mf = 5;
  self.len_p = 14;
  var results_m = [];
  results_m[1] = "=(1){1}/1;";
  results_m[2] = "=(1,2){1,1}/2;";
  results_m[3] = "=(1,2,3){2,1,1}/4;";
  results_m[4] = "=(1,2,3,4){4,2,1,1}/8;";
  results_m[5] = "=(1,2,3,4,5){8,4,2,1,1}/16;";
  results_m[6] = "=(1,2,3,4,5,6){16,8,4,2,1,1}/32;";
  results_m[7] = "=(1,2,3,4,5,6,7){32,16,8,4,2,1,1}/64;";
  results_m[8] = "=(1,2,3,4,5,6,7,8){64,32,16,8,4,2,1,1}/128;";
  results_m[9] = "=(1,2,3,4,5,6,7,8,9){128,64,32,16,8,4,2,1,1}/256;";
  results_m[10] = "=(1,2,3,4,5,6,7,8,9,10){256,128,64,32,16,8,4,2,1,1}/512;";
  results_m[11] = "=(1,2,3,4,5,6,7,8,9,10,11){512,256,128,64,32,16,8,4,2,1,1}/1024;";
  self.results_m = results_m;
  /* -> Ver.0.35.4 */
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
      case "solve2":  // Ver.0.33.4
      case "solve3":  // Ver.0.35.4
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
/* Ver.0.33.4 */
My_entry.test_number.prototype.output_line = function(){
  var self = this;
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
/* Ver.0.35.4 -> */
My_entry.test_number.prototype.init_freq = function(){
  var self = this;
  var freq2d = [];
  for(var m=1; m<self.len_mf; ++m){
    var len = Math.pow(2, m-1);
    freq2d[m] = new Array(len);
    for(var i=0; i<len; ++i){
      freq2d[m][i] = 0;
    }
  }
  self.freq2d = freq2d;
  return self;
};
My_entry.test_number.prototype.save_freq = function(num){
  var self = this;
  for(var m=1; m<self.len_mf; ++m){
    var n2 = "00000000"+num.toString(2);
    var len = n2.length;
    if(len-m >= 0){
      var n2sub = n2.substring(len-m, len-1) || "0";
      var n2num = Number("0b"+n2sub);
      self.freq2d[m][n2num] += 1;
    }
  }
  return self;
};
/* -> Ver.0.35.4 */
My_entry.test_number.prototype.solve = function(isMinus){
  var self = this;
  var $ = self.entry.$;
  self.convert();
  var str = $._id("input-string").value;
  var num = self.val2dec(str);
  if(isNaN(Number(num))) return false;
  var num0 = num;  // Ver.0.34.4
  var nmax = num;  // Ver.0.34.4
//  var m0 = num.toString(2).length;  // Ver.0.35.4
  var m0 = self.log(num);  // Ver.0.35.4
  var mmax = m0;  // Ver.0.35.4
  var isCircular = false;  // Ver.0.33.4
  /* Ver.0.33.4 */
  self.init_freq();  // Ver.0.35.4
  var freq2d = self.freq2d;  // Ver.0.35.4
  var get_Nrshift = function(i){
    return (-1+(i+1)/freq2d[1][0]);
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
  /* Ver.0.34.4 */
  var output_log = function(msg){
    msg += "<br>floor(nmax/n)="+nmax/num0;
    msg += "<br>quality="+mmax/m0;  // Ver.0.35.4
    $._id("output-log").innerHTML = "<caption class="+((isMinus)? "selection": "run")+">"+msg+"</caption>";
  };
  var isBreak = (isMinus)?
    function(num, i){
      var _msg = "";
      if(num === 17n || num === 5n){
        /* Ver.0.33.4 -> */
        if(isCircular){
          _msg = "n -> "+num+"-circular";
          i = isCircular-1;
        }
        else{
          isCircular = i+1;
        }
        /* -> Ver.0.33.4 */
      }
      else if(num === 1n){
        _msg = "n -> 1";
      }
      else if(num <= 0n){
        _msg = "n <= 0";
      }
      if(_msg){
        /* Ver.0.34.4 -> */
        _msg += " @No.="+i;
        output_log(_msg);
        /* -> Ver.0.34.4 */
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
        /* Ver.0.34.4 -> */
        _msg += " @No.="+i;
        output_log(_msg);
        /* -> Ver.0.34.4 */
      }
      return _msg;
    };
  var run = function(num, N){
    var _html = "";
    _html += self.output_line("wF", "No.<br>&lt;1e6", "dec", "hex", "oct", "bin", "frequency distribution<br>ls3bit=001,011,101,111", "Nrshift(3)", "-1+(No.+1)/sum(frequency)");  // Ver.0.33.4
    for(var i=0; i<N; ++i){
      /* Ver.0.34.4 -> */
      if(num > nmax){
        nmax = num;
//        mmax = num.toString(2).length;  // Ver.0.35.4
        mmax = self.log(num);  // Ver.0.35.4
      }
      /* -> Ver.0.34.4 */
      if(num%2n === 0n){
        _html += self.output_line(((isCircular)? "wF": ""), i, num, num.toString(16), num.toString(8), num.toString(2));  // Ver.0.33.4
        if(isBreak(num, i)){
          break;
        }
        num /= 2n;
      }
      else{
        self.save_freq(num);  // Ver.0.35.4
        _html += self.output_line("condition", i, num, num.toString(16), num.toString(8), num.toString(2), freq2d[3], calc_Nrshift(i), get_Nrshift(i));  // Ver.0.33.4
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
/* Ver.0.33.4 */
My_entry.test_number.prototype.solve2 = function(){
  var self = this;
  var $ = self.entry.$;
  self.convert();
  var count_N0 = function(bin, m){
    var _N0 = 0;
    var len = bin.length;
    for(var i=len-1; i>=len-m; --i){
      if(bin.charAt(i) === "0"){
        _N0++;
      }
      else{
        break;
      }
    }
    return _N0;
  };
  var get_lsmbit = function(bin, m){
    var len = bin.length;
    return bin.substring(len-m, len);
  };
  var run = function(){
    var header0 = self.output_line("wF", "m", "3*n-1", "3*n+1", "=Nrshift(m)");  // Ver.0.35.4
    var header1 = self.output_line("wF", "m", "n", "n&lt;&lt;1", "3*n<br>=n+(n&lt;&lt;1)", "3*n-1<br>=(3*n+1)-2", "3*n+1<br>=(3*n-1)+2");  // Ver.0.34.4
    var html0 = "";
    var html1 = "";
    var len_m = self.len_m;
    for(var m=1; m<len_m; ++m){
      var len_n = Math.pow(2, m);
      var len_n2 = len_n/2;
      var N0m = 0;
      var N0p = 0;
      for(var n=1; n<len_n; n+=2){
        var binm = (3*n-1).toString(2);
        var binp = (3*n+1).toString(2);
        N0m += count_N0(binm, m);
        N0p += count_N0(binp, m);
        html1 += self.output_line((m%2)? "condition": "wF", m, n.toString(2), (n<<1).toString(2), (n+(n<<1)).toString(2), get_lsmbit(binm, m), get_lsmbit(binp, m));  // Ver.0.34.4 32bit  // Ver.0.35.4
      }
      html0 += self.output_line("", m, N0m+"/"+len_n2, N0p+"/"+len_n2, self.results_m[m]);  // Ver.0.35.4
    }
  /* Ver.0.35.4 -> */
    var _logs = {};
    _logs.log0 = "<caption class='condition'>simple expected value<br>Nrshift(m) with zeros counted<br>from bit string</caption>"+header0+html0;
    _logs.log1 = "<caption class='condition'>bit string</caption>"+header1+html1;
    return _logs;
  };
  self.logs2 = self.logs2 || run();
  $._id("output-log").innerHTML = self.logs2.log0;
  $._id("output-html").innerHTML = self.logs2.log1;
  /* -> Ver.0.35.4 */
  return self;
};
/* -> Ver.0.32.4 */
/* Ver.0.35.4 */
My_entry.test_number.prototype.solve3 = function(){
  var self = this;
  var $ = self.entry.$;
  self.convert();
  self.init_freq();
  var freq2d = self.freq2d;
  var isPrime = function(n){
    var _isPrime = (n > 1);
    var len = Math.sqrt(n);
    for(var i=2; i<=len; ++i){
      if(n%i === 0){
        _isPrime = false;
        break;
      }
    }
    return _isPrime;
  };
  var run = function(){
    var header1 = self.output_line("clear", "radix", "=10", "=6", "=4", "=10", "=2", "frequency distribution<br>ls3bit=<br>001,011,101,111", "frequency distribution<br>ls4bit=<br>0001,0011,0101,0111,1001,1011,1101,1111");
    var html1 = "";
    var len_n = Math.pow(2, self.len_p);
    for(var n=1; n<len_n; ++n){
      if(isPrime(n)){
        var isOdd = n%2;
        if(isOdd){
          self.save_freq(n);
        }
        html1 += self.output_line((isOdd)? "condition": "wF", "", n, n.toString(6), n.toString(4), n, n.toString(2), (isOdd)? freq2d[3]: "", (isOdd)? freq2d[4]: "");
      }
    }
    var _logs = {};
    _logs.log1 = "<caption class='condition'>prime numbers<br>n&lt;"+len_n+"</caption>"+header1+html1;
    return _logs;
  };
  self.logs3 = self.logs3 || run();
  $._id("output-html").innerHTML = self.logs3.log1;
  return self;
};
