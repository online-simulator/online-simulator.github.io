// online-simulator.github.io

function My_conv(){
}

// static
My_conv.dec2n = function(val, n){
  return parseInt(val).toString(parseInt(n));
};
My_conv.n2dec = function(val, n){
  return parseInt(val, parseInt(n));
};
My_conv.blob2url = function(blob){
  var _url = null;
  var URL = window.URL || window.webkitURL;
  if(URL){
    _url = URL.createObjectURL(blob);
  }
  return _url;
};
My_conv.fn2url = function(fn){
  var str_fn = "("+fn.toString()+")()";
  var blob = new Blob([str_fn], {type: "application/javascript"});
  return My_conv.blob2url(blob);
};
My_conv.text2url = function(text){
  var blob = new Blob([text], {type: "text/plain"});
  return My_conv.blob2url(blob);
};
My_conv.arrb_uint8_2binary = function(arrb_uint8){
  var _binary = "";
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    _binary += String.fromCharCode(uint8);
  });
  return _binary;
};
My_conv.binary2arrb_uint8 = function(binary){
  var _arrb_uint8 = new Uint8Array(binary.length);
  Array.prototype.forEach.call(_arrb_uint8, function(uint8, i){
    _arrb_uint8[i] = binary.charCodeAt(i);
  });
  return _arrb_uint8;
};
My_conv.binary2buffer = function(binary){
  var _buffer = My_conv.binary2arrb_uint8(binary).buffer;
  return _buffer;
};
My_conv.base2buffer = function(base64){
  var arr_data = base64.split(",");
  var binary = (window.atob)? atob(arr_data[1]): "";
  var _buffer = My_conv.binary2buffer(binary);
  return _buffer;
};
My_conv.base2blob = function(base64){
  var arr_data = base64.split(",");
  var type = arr_data[0].split(":")[1].split(";")[0];
  var buffer = My_conv.base2buffer(base64);
  var _blob = new Blob([buffer], {type: type});
  return _blob;
};
My_conv.base2url = function(base64){
  return My_conv.blob2url(My_conv.base2blob(base64));
};
My_conv.str2code_utf16 = function(str, n, isLE){
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
    _arr_num_n[i] = My_conv.dec2n(uint16, n);
  }
  return _arr_num_n;
};
My_conv.str2code_utf16BE = function(str, n){
  return My_conv.str2code_utf16(str, n, false);
};
My_conv.str2code_utf16LE = function(str, n){
  return My_conv.str2code_utf16(str, n, true);
};
My_conv.str2code_utf8 = function(str, n){
  var _arr_num_n = [];
  if(typeof TextEncoder !== "undefined"){
    var arrb_uint8 = new TextEncoder().encode(str);
    // object.forEach for IE
    Array.prototype.forEach.call(arrb_uint8, function(uint8, i, arr_uint8){
      _arr_num_n[i] = My_conv.dec2n(uint8, n);
    });
  }
  return _arr_num_n;
};
My_conv.binary2code_utf8 = function(str, n){
  var _arr_num_n = [];
  for(var i=0, len=str.length; i<len; ++i){
    var uint8 = str.charCodeAt(i);
    _arr_num_n[i] = My_conv.dec2n(uint8, n);
  }
  return _arr_num_n;
};
My_conv.arr_num2arr_uint = function(arr_num_n, n, n_uint){
  var _arr_uint_ = [];
  const uint_MAX = Math.pow(2, n_uint)-1;
  arr_num_n.forEach(function(num_n, i){
    var num_10 = My_conv.n2dec(num_n, n);
    var uint_ = num_10;
    if(isNaN(num_10)){
      uint_ = uint_MAX;
    }
    else{
      uint_ = Math.min(uint_, uint_MAX);
    }
    _arr_uint_[i] = uint_;
  });
  return _arr_uint_;
};
My_conv.arr_uint16_2str = function(arr_uint16, isLE){
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
My_conv.arr_uint16BE_2str = function(arr_uint16){
  return My_conv.arr_uint16_2str(arr_uint16, false);
};
My_conv.arr_uint16LE_2str = function(arr_uint16){
  return My_conv.arr_uint16_2str(arr_uint16, true);
};
My_conv.arr_uint8_2str = function(arr_uint8){
  var _str = "";
  if(typeof TextDecoder !== "undefined"){
    _str = new TextDecoder().decode(new Uint8Array(arr_uint8));
  }
  return _str;
};
My_conv.arr_uint8_2binary = function(arr_uint8){
  var _str = "";
  arr_uint8.forEach(function(uint8){
    _str += String.fromCharCode(uint8);
  });
  return _str;
};
My_conv.str2binary_old = function(str){
  var _binary = "";
  var arr_uint16 = My_conv.str2code_utf16(str, 10);
  var arrb_uint16 = new Uint16Array(arr_uint16);
  var arrb_uint8 = new Uint8Array(arrb_uint16.buffer);
  _binary = My_conv.arrb_uint8_2binary(arrb_uint8);
  return _binary;
};
My_conv.binary2str_old = function(binary){
  var _str = "";
  var buffer = My_conv.binary2arrb_uint8(binary).buffer;
  var arrb_uint16 = new Uint16Array(buffer);
  Array.prototype.forEach.call(arrb_uint16, function(uint16, i){
    _str += String.fromCharCode(uint16);
  });
  return _str;
};
My_conv.str2binary = function(str, isLE){
  var _binary = "";
  var buffer = new ArrayBuffer(2);
  var view = new DataView(buffer, 0);
  var arr_uint16 = My_conv.str2code_utf16(str, 10);
  arr_uint16.forEach(function(uint16){
    view.setUint16(0, uint16, isLE);
    var arrb_uint8 = new Uint8Array(buffer);
    Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
      _binary += String.fromCharCode(uint8);
    });
  });
  return _binary;
};
My_conv.binary2str = function(binary, isLE){
  var _str = "";
  var buffer = new ArrayBuffer(binary.length);
  var view = new DataView(buffer, 0);
  Array.prototype.forEach.call(binary, function(byte, i){
    view.setUint8(i, binary.charCodeAt(i));
  });
  var arr_uint16 = [];
  for(var i=0, len=binary.length/2; i<len; ++i){
    arr_uint16[i] = view.getUint16(i*2, isLE);
  }
  arr_uint16.forEach(function(uint16, i){
    _str += String.fromCharCode(uint16);
  });
  return _str;
};
My_conv.buffer2binary = function(buffer){
  var _binary = "";
  var arrb_uint8 = new Uint8Array(buffer);
  Array.prototype.forEach.call(arrb_uint8, function(uint8, i){
    _binary += String.fromCharCode(uint8);
  });
  return _binary;
};
My_conv.int2binary = function(dec, n_byte, isLE, isUnsigned){
  var _binary = "";
  var idec = Math.floor(dec);
  var buffer = new ArrayBuffer(n_byte);
  var view = new DataView(buffer, 0);
  var prop_  = "set"
      prop_ += (isUnsigned)? "Uint": "Int";
  switch(Number(n_byte)){
    case 4:
      view[prop_+"32"](0, idec, isLE);
      break;
    case 2:
      view[prop_+"16"](0, idec, isLE);
      break;
    case 1:
      view[prop_+"8"](0, idec);
      break;
    default:
      break;
  }
  return My_conv.buffer2binary(buffer);
};
