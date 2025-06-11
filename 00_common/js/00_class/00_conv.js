// online-simulator.github.io

My_entry.conv = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.conv.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.conv.prototype.arr_str2arr_num = function(arr_str, num_NaN, num_min, num_max){
  var self = this;
  var _arr_num = [];
  arr_str.forEach(function(str, i){
    var num = Number(str);
    if(isNaN(num)){
      num = num_NaN;
    }
    else if(num < num_min){
      num = num_min;
    }
    else if(num > num_max){
      num = num_max;
    }
    _arr_num[i] = num;
  });
  return _arr_num;
};
My_entry.conv.prototype.dec2round_sw = function(dec, sw, opt_digit){
  var self = this;
  var _dec = Number(dec);
  var digit = (typeof opt_digit === "undefined")? 1: Number(opt_digit);  // calc-Ver.2.852.157
  var mc = (_dec%1 === 0 || isNaN(_dec))? null: _dec.toExponential(digit+1).split("e");  // Ver.2.770.117
  if(mc && mc.length === 2){
    _dec = Math[sw || "floor"](Number(mc[0])*Math.pow(10, digit))*Math.pow(10, Number(mc[1])-digit);
  }
  return _dec;
};
My_entry.conv.prototype.dec2n = function(val, n){
  var self = this;
  return parseInt(val).toString(parseInt(n));
};
My_entry.conv.prototype.n2dec = function(val, n){
  var self = this;
  return parseInt(val, parseInt(n));
};
My_entry.conv.prototype.blob2url = function(blob){
  var self = this;
  var _url = null;
  var URL = window.URL || window.webkitURL;
  if(URL){
    _url = URL.createObjectURL(blob);
  }
  return _url;
};
My_entry.conv.prototype.text2url = function(text){
  var self = this;
  var blob = new Blob([text], {type: "text/plain"});
  return self.blob2url(blob);
};
My_entry.conv.prototype.base2img = function(base64, opt_callback){
  var self = this;
  var _img = new Image();
  _img.onload = function(e){
    if(opt_callback){
      opt_callback(e, _img);
    }
  };
  _img.src = base64;
  return _img;
};
My_entry.conv.prototype.num2not = function(num, decDigit, opt_expDigit){  // calc-Ver.2.852.157
  var self = this;
  /* calc-Ver.2.601.94 -> */
  var _not = null;
  var expDigit = opt_expDigit || 0;  // calc-Ver.2.852.157
  var isDecimal = (expDigit === -1);
  var isRound = (expDigit < -1);
  if(isRound){
    var dec = Math.pow(10, -(expDigit+2));
    _not = Math.round(num*dec)/dec;
  }
  else{
    var len_str = (num < 0)? decDigit+1: decDigit;
    _not = (isDecimal && num.toString().length < len_str)? num: num.toExponential(Math.abs(expDigit));
  }
  /* -> calc-Ver.2.601.94 */
  return _not;
};
My_entry.conv.prototype.arrb_uint8_2binary = function(arrb_uint8){
  var self = this;
  var _binary = "";
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    _binary += String.fromCharCode(uint8);
  });
  return _binary;
};
My_entry.conv.prototype.binary2arrb_uint8 = function(binary){
  var self = this;
  var _arrb_uint8 = new Uint8Array(binary.length);
  Array.prototype.forEach.call(_arrb_uint8, function(uint8, i){
    _arrb_uint8[i] = binary.charCodeAt(i);
  });
  return _arrb_uint8;
};
My_entry.conv.prototype.binary2buffer = function(binary){
  var self = this;
  var _buffer = self.binary2arrb_uint8(binary).buffer;
  return _buffer;
};
My_entry.conv.prototype.buffer2binary = function(buffer){
  var self = this;
  var _binary = "";
  var arrb_uint8 = new Uint8Array(buffer);
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    _binary += String.fromCharCode(uint8);
  });
  return _binary;
};
/* else-Ver.0.76.8 -> */
My_entry.conv.prototype.str2base = function(str){
  var self = this;
  var arrb_uint8 = new TextEncoder().encode(str);
  return ((window.btoa)? btoa(self.arrb_uint8_2binary(arrb_uint8)): "");
};
My_entry.conv.prototype.base2str = function(base64){
  var self = this;
  var binary = (window.atob)? atob(base64): "";
  var arrb_uint8 = self.binary2arrb_uint8(binary);
  return new TextDecoder().decode(arrb_uint8);
};
/* -> else-Ver.0.76.8 */
My_entry.conv.prototype.base2binary = function(base64){
  var self = this;
  var arr_data = base64.split(",");
  var _binary = (window.atob)? atob(arr_data[1]): "";
//  var _binary = self.buffer2binary(self.base2buffer(base64));  // calc-Ver.2.161.38
  return _binary;
};
My_entry.conv.prototype.base2buffer = function(base64){
  var self = this;
  var binary = self.base2binary(base64);
  var _buffer = self.binary2buffer(binary);
  return _buffer;
};
My_entry.conv.prototype.base2blob = function(base64){
  var self = this;
  var arr_data = base64.split(",");
  var type = arr_data[0].split(":")[1].split(";")[0];
  var buffer = self.base2buffer(base64);
  var _blob = new Blob([buffer], {type: type});
  return _blob;
};
My_entry.conv.prototype.base2url = function(base64){
  var self = this;
  return self.blob2url(self.base2blob(base64));
};
My_entry.conv.prototype.str2code_utf16 = function(str, n, isLE){
  var self = this;
  var _arr_num_n = [];
  var buffer = new ArrayBuffer(2);
  var view = new DataView(buffer, 0);
  for(var i=0, len=str.length; i<len; ++i){
/*
    var uint16 = str.codePointAt(i);
*/
    var uint16 = str.charCodeAt(i);
    if(isLE){
      view.setUint16(0, uint16, false);
      uint16 = view.getUint16(0, isLE);
    }
    _arr_num_n[i] = self.dec2n(uint16, n);
  }
  return _arr_num_n;
};
My_entry.conv.prototype.str2code_utf16BE = function(str, n){
  var self = this;
  return self.str2code_utf16(str, n, false);
};
My_entry.conv.prototype.str2code_utf16LE = function(str, n){
  var self = this;
  return self.str2code_utf16(str, n, true);
};
My_entry.conv.prototype.str2code_utf8 = function(str, n){
  var self = this;
  var _arr_num_n = [];
  var arrb_uint8 = new TextEncoder().encode(str);
  // object.forEach for IE
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i, arr_uint8){
    _arr_num_n[i] = self.dec2n(uint8, n);
  });
  return _arr_num_n;
};
My_entry.conv.prototype.binary2code_utf8 = function(str, n){
  var self = this;
  var _arr_num_n = [];
  for(var i=0, len=str.length; i<len; ++i){
    var uint8 = str.charCodeAt(i);
    _arr_num_n[i] = self.dec2n(uint8, n);
  }
  return _arr_num_n;
};
My_entry.conv.prototype.arr_num2arr_uint = function(arr_num_n, n, n_uint){
  var self = this;
  var _arr_uint_ = [];
  var uint_max = Math.pow(2, n_uint)-1;
  arr_num_n.forEach(function(num_n, i){
    var num_10 = self.n2dec(num_n, n);
    var uint_ = num_10;
    if(isNaN(num_10)){
      uint_ = uint_max;
    }
    else{
      uint_ = Math.min(uint_, uint_max);
    }
    _arr_uint_[i] = uint_;
  });
  return _arr_uint_;
};
My_entry.conv.prototype.arr_uint16_2str = function(arr_uint16, isLE){
  var self = this;
  var _str = "";
  var buffer = new ArrayBuffer(2);
  var view = new DataView(buffer, 0);
  arr_uint16.forEach(function(uint16){
    var uint16 = uint16;
    if(isLE){  // and if arr_uint16 is BE
      view.setUint16(0, uint16, false);
      uint16 = view.getUint16(0, isLE);
    }
/*
    _str += String.fromCodePoint(uint16);
*/
    _str += String.fromCharCode(uint16);
  });
  return _str;
};
My_entry.conv.prototype.arr_uint16BE_2str = function(arr_uint16){
  var self = this;
  return self.arr_uint16_2str(arr_uint16, false);
};
My_entry.conv.prototype.arr_uint16LE_2str = function(arr_uint16){
  var self = this;
  return self.arr_uint16_2str(arr_uint16, true);
};
My_entry.conv.prototype.arr_uint8_2str = function(arr_uint8){
  var self = this;
  var _str = "";
  _str = new TextDecoder().decode(new Uint8Array(arr_uint8));
  return _str;
};
My_entry.conv.prototype.arr_uint8_2binary = function(arr_uint8){
  var self = this;
  var _str = "";
  arr_uint8.forEach(function(uint8){
    _str += String.fromCharCode(uint8);
  });
  return _str;
};
My_entry.conv.prototype.str2binary_old = function(str){
  var self = this;
  var _binary = "";
  var arr_uint16 = self.str2code_utf16(str, 10);
  var arrb_uint16 = new Uint16Array(arr_uint16);
  var arrb_uint8 = new Uint8Array(arrb_uint16.buffer);
  _binary = self.arrb_uint8_2binary(arrb_uint8);
  return _binary;
};
My_entry.conv.prototype.binary2str_old = function(binary){
  var self = this;
  var _str = "";
  var buffer = self.binary2arrb_uint8(binary).buffer;
  var arrb_uint16 = new Uint16Array(buffer);
  Array.prototype.forEach.call(arrb_uint16, function(uint16, i){
    _str += String.fromCharCode(uint16);
  });
  return _str;
};
My_entry.conv.prototype.str2binary = function(str, isLE){
  var self = this;
  var _binary = "";
  var buffer = new ArrayBuffer(2);
  var view = new DataView(buffer, 0);
  var arr_uint16 = self.str2code_utf16(str, 10);
  arr_uint16.forEach(function(uint16){
    view.setUint16(0, uint16, isLE);
    var arrb_uint8 = new Uint8Array(buffer);
    Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
      _binary += String.fromCharCode(uint8);
    });
  });
  return _binary;
};
My_entry.conv.prototype.binary2str = function(binary, isLE){
  var self = this;
  var _str = "";
  var buffer = new ArrayBuffer(binary.length+1);
  var view = new DataView(buffer, 0);
  Array.prototype.forEach.call(binary, function(byte, i){
    view.setUint8(i, binary.charCodeAt(i));
  });
  var arr_uint16 = [];
  for(var i=0, len=(binary.length+1)>>1; i<len; ++i){
    arr_uint16[i] = view.getUint16(i<<1, isLE);
  }
  arr_uint16.forEach(function(uint16, i){
    _str += String.fromCharCode(uint16);
  });
  return _str;
};
My_entry.conv.prototype.csv2arr = function(text, opt_callback, opt_i0){
  var self = this;
  var _arr = [];  // [index_col][index_row]
  var sc_line = text.replace(/[,]+$/gm, "").split("\n");
  var i0 = opt_i0 || 0;
  var callback = (opt_callback)?
    function(num){
      return opt_callback(num);
    }:
    function(num){
      return num;
    };
  if(sc_line && sc_line.length){
    var len_j = 0;
    var len_i = sc_line.length;
    /* calc-Ver.2.852.158 -> */
    if(sc_line[len_i-1].replace(/\s/g, "") === ""){
      len_i -= 1;
    }
    for(var i=i0; i<len_i; ++i){
      var linei = sc_line[i];
      var sc_linei = linei.split(",");
      len_j = Math.max(len_j, sc_linei.length);
    }
    for(var i=i0; i<len_i; ++i){
      var linei = sc_line[i];
      var sc_linei = linei.split(",");
      for(var j=0; j<len_j; ++j){
        var num_ij = NaN;
        var csv_ij = sc_linei[j];
        var isEmpty = (typeof csv_ij === "undefined") || csv_ij.replace(/\s/g, "") === "";
        if(!(isEmpty)){
          num_ij = Number(csv_ij);
          /* calc-Ver.2.848.156 -> */
          if(isNaN(num_ij)){
            var csv_ij_lower = csv_ij.toLowerCase();
            if(csv_ij_lower === "false"){
              num_ij = false;
            }
            else if(csv_ij_lower === "true"){
              num_ij = true;
            }
          }
          /* -> calc-Ver.2.848.156 */
        }
        _arr[j] = _arr[j] || [];
        _arr[j][i-i0] = callback(num_ij);
      }
    }
    /* -> calc-Ver.2.852.158 */
  }
  return _arr;
};
