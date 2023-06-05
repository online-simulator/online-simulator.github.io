// online-simulator.github.io

My_entry.handler_baseview = function(arr_prop_baseview){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

/*
                  int8       uint8
0x00~7f:         0~127
0x80~ff:       -128~-1     128~255

                 int16      uint16
0x0000~7fff:   0~32767
0x8000~ffff: -32768~-1 32768~65535

  var n = 3;
  var i0 = 0;
  var isLE = true;
  var val_set = -8388608;
  var view = self.arr_view[n];
  self.setInt8n(view, n, i0, val_set, isLE);
  var val_get = self.getInt8n(view, n, i0, isLE);

  var n = 3;
  var i0 = 0;
  var isLE = false;
  var val_set = 8388608*2-1;
  var view = self.arr_view[n];
  self.setUint8n(view, n, i0, val_set, isLE);
  var val_get = self.getUint8n(view, n, i0, isLE);
*/
My_entry.handler_baseview.prototype.setInt8n = function(view, nByte, iByteOffset, val10, isLE){
  var self = this;
  var offset = self.offset[nByte];
  var val16 = parseInt(val10+offset).toString(16);  // val16 >= 0
  var len16 = val16.length;
  for(var i=0; i<nByte; ++i){
    var isMSB = (i === nByte-1);
    var ie = len16-i*2;
    var val16i = val16.substring(ie-2, ie) || "0";
    var val10i = Number("0x"+val16i);  // 0~255
    val10i -= (isMSB)? 128: ((val10i < 128)? 0: 256);  // 0x80=128
    view.setInt8(iByteOffset+((isLE)? i: nByte-1-i), val10i);  // -128~127
  }
  return self;
};
My_entry.handler_baseview.prototype.setUint8n = function(view, nByte, iByteOffset, val10, isLE){
  var self = this;
  var offset = 0;
  var val16 = parseInt(val10+offset).toString(16);  // val16 >= 0
  var len16 = val16.length;
  for(var i=0; i<nByte; ++i){
    var ie = len16-i*2;
    var val16i = val16.substring(ie-2, ie) || "0";
    var val10i = Number("0x"+val16i);  // 0~255
    view.setUint8(iByteOffset+((isLE)? i: nByte-1-i), val10i);  // 0~255
  }
  return self;
};
My_entry.handler_baseview.prototype.getInt8n = function(view, nByte, iByteOffset, isLE){
  var self = this;
  var offset = self.offset[nByte];
  var val16 = "";
  for(var i=0; i<nByte; ++i){
    var val10i = view.getUint8(iByteOffset+((isLE)? i: nByte-1-i));
    var val16i = "0"+parseInt(val10i).toString(16);  // val16i >= 0
    var ie = val16i.length;
    val16i = val16i.substring(ie-2, ie);  // 0x00~ff
    val16 = val16i+val16;
  }
  var val10 = Number("0x"+val16);
  var _val10 = (val10 < offset)? val10: val10-offset*2;
  return _val10;
};
My_entry.handler_baseview.prototype.getUint8n = function(view, nByte, iByteOffset, isLE){
  var self = this;
  var offset = 0;
  var val16 = "";
  for(var i=0; i<nByte; ++i){
    var val10i = view.getUint8(iByteOffset+((isLE)? i: nByte-1-i));
    var val16i = "0"+parseInt(val10i).toString(16);  // val16i >= 0
    var ie = val16i.length;
    val16i = val16i.substring(ie-2, ie);  // 0x00~ff
    val16 = val16i+val16;
  }
  var val10 = Number("0x"+val16);
  var _val10 = val10;
  return _val10;
};
My_entry.handler_baseview.prototype.init = function(arr_prop_baseview){
  var self = this;
  self.arr_buffer = [];
  self.arr_view = [];
  self.offset = [];
  self.set = [];
  self.get = [];
  arr_prop_baseview.forEach(function(Prop, n){
    self.arr_buffer[n] = new ArrayBuffer(n);
    self.arr_view[n] = new DataView(self.arr_buffer[n], 0);
    self.offset[n] = Math.pow(2, n*8-1);
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
  });
  return self;
};
