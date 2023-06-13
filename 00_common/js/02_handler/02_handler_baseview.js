// online-simulator.github.io

My_entry.handler_baseview = function(arr_prop, useBigInt){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

/*
// OK
BigInt("0xe010f800574156454c4953") -> 270879516274493291185850707n
270879516274493291185850707n.toString(16) -> 'e010f800574156454c4953'
0xe010f800574156454c4953n.toString(16) -> 'e010f800574156454c4953'
// NG
BigInt(0xe010f800574156454c4953) -> 270879516274493298613157888n
270879516274493298613157888n.toString(16) -> 'e010f80057415800000000'

  var useBigInt = true;
  var n = 10;
  var i0 = 0;
  var isLE = false;
  var handler_baseview = new My_entry.handler_baseview(null, useBigInt).make_view(null, n);
  var view = handler_baseview.arr_view[n];
  var val_set = -591679316083633416238336n;
  handler_baseview.setInt8n(view, n, i0, val_set, isLE);
  var val_get = handler_baseview.getInt8n(view, n, i0, isLE);
  var val_set = 617246503530995758467840n;
  handler_baseview.setUint8n(view, n, i0, val_set, isLE);
  var val_get = handler_baseview.getUint8n(view, n, i0, isLE);

  var useBigInt = false;
  var n = 3;
  var i0 = 0;
  var isLE = true;
  var handler_baseview = new My_entry.handler_baseview(null, useBigInt).make_view(null, n);
  var view = handler_baseview.arr_view[n];
  var val_set = -8388608;
  handler_baseview.setInt8n(view, n, i0, val_set, isLE);
  var val_get = handler_baseview.getInt8n(view, n, i0, isLE);
  var val_set = 8388608*2-1;
  handler_baseview.setUint8n(view, n, i0, val_set, isLE);
  var val_get = handler_baseview.getUint8n(view, n, i0, isLE);
*/
My_entry.handler_baseview.prototype.init = function(arr_prop, useBigInt){
  var self = this;
  self.val2dec = (My_entry.flag.hasBigInt && useBigInt)?
    function(val){return BigInt(val);}:
    function(val){return parseInt(val);};
  self.arr_buffer = [];
  self.arr_view = [];
  self.offset = [];
  self.set = [];
  self.get = [];
  if(arr_prop && arr_prop.length){
    arr_prop.forEach(function(Prop, n){
      self.make_view(Prop, n);
    });
  }
  return self;
};
My_entry.handler_baseview.prototype.get_offset = function(n){
  var self = this;
  var hex = "0x0";
  for(var i=0; i<n; ++i){
    hex += (i === 0)? "80": "00";
  }
  return self.val2dec(hex);
};
My_entry.handler_baseview.prototype.make_view = function(Prop, n){
  var self = this;
  self.arr_buffer[n] = new ArrayBuffer(n);
  self.arr_view[n] = new DataView(self.arr_buffer[n], 0);
  self.offset[n] = self.get_offset(n);
  self.offset0 = self.val2dec(0);
  var view = self.arr_view[n];
  var isUnsigned = (Prop === "Uint");
  var Prop = (Prop || "Int")+String(n*8);
  self.set[n] = (view["set"+Prop])?
    function(){
      return view["set"+Prop].apply(view, arguments);
    }:
    function(){
      return self[(isUnsigned)? "setUint8n": "setInt8n"](view, n, arguments[0], arguments[1], arguments[2]);
    };
  self.get[n] = (view["get"+Prop])?
    function(){
      return view["get"+Prop].apply(view, arguments);
    }:
    function(){
      return self[(isUnsigned)? "getUint8n": "getInt8n"](view, n, arguments[0], arguments[1]);
    };
  return self;
};
/*
                  int8       uint8
0x00~7f:         0~127
0x80~ff:       -128~-1     128~255

                 int16      uint16
0x0000~7fff:   0~32767
0x8000~ffff: -32768~-1 32768~65535
*/
My_entry.handler_baseview.prototype.setInt8n = function(view, nByte, iByteOffset, val10, isLE){
  var self = this;
  var offset = self.offset[nByte];
  var val16 = (self.val2dec(val10)+offset).toString(16);  // val16 >= 0
  var len16 = val16.length;
  for(var i=0; i<nByte; ++i){
    var isMSB = (i === nByte-1);
    var ie = len16-i*2;
    var val16i = val16.substring(ie-2, ie) || "0";
    var val10i = parseInt("0x"+val16i);  // 0~255
    val10i -= (isMSB)? 128: ((val10i < 128)? 0: 256);  // 0x80=128
    view.setInt8(iByteOffset+((isLE)? i: nByte-1-i), val10i);  // -128~127
  }
  return self;
};
My_entry.handler_baseview.prototype.setUint8n = function(view, nByte, iByteOffset, val10, isLE){
  var self = this;
  var offset = self.offset0;
  var val16 = (self.val2dec(val10)+offset).toString(16);  // val16 >= 0
  var len16 = val16.length;
  for(var i=0; i<nByte; ++i){
    var ie = len16-i*2;
    var val16i = val16.substring(ie-2, ie) || "0";
    var val10i = parseInt("0x"+val16i);  // 0~255
    view.setUint8(iByteOffset+((isLE)? i: nByte-1-i), val10i);  // 0~255
  }
  return self;
};
My_entry.handler_baseview.prototype.getInt8n = function(view, nByte, iByteOffset, isLE){
  var self = this;
  var offset = self.offset[nByte];
  var val16 = "";
  for(var i=0; i<nByte; ++i){
    var val10i = view.getUint8(iByteOffset+((isLE)? i: nByte-1-i));  // 0~255
    var val16i = "0"+parseInt(val10i).toString(16);  // val16i >= 0
    var ie = val16i.length;
    val16i = val16i.substring(ie-2, ie);  // 0x00~ff
    val16 = val16i+val16;
  }
  var val10 = self.val2dec("0x"+val16);
  var _val10 = (val10 < offset)? val10: (val10-offset)-offset;  // for BigInt
  return _val10;
};
My_entry.handler_baseview.prototype.getUint8n = function(view, nByte, iByteOffset, isLE){
  var self = this;
  var offset = self.offset0;
  var val16 = "";
  for(var i=0; i<nByte; ++i){
    var val10i = view.getUint8(iByteOffset+((isLE)? i: nByte-1-i));  // 0~255
    var val16i = "0"+parseInt(val10i).toString(16);  // val16i >= 0
    var ie = val16i.length;
    val16i = val16i.substring(ie-2, ie);  // 0x00~ff
    val16 = val16i+val16;
  }
  var val10 = self.val2dec("0x"+val16);
  var _val10 = val10;
  return _val10;
};
