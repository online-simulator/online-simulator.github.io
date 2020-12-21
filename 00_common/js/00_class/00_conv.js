function My_conv(){
}

// class method
My_conv.fn2url = function(fn){
  var _url = null;
  var str_fn = "("+fn.toString()+")()";
  var blob = new Blob([str_fn], {type: "application/javascript"});
  var URL = window.URL || window.webkitURL;
  if(URL){
    _url = URL.createObjectURL(blob);
  }
  return _url;
};
My_conv.text2url = function(text){
  var _url = null;
  var blob = new Blob([text], {"type":"text/plain"});
  var URL = window.URL || window.webkitURL;
  if(URL){
    _url = URL.createObjectURL(blob);
  }
  return _url;
};
My_conv.dec2n = function(val, n){
  return parseInt(val).toString(parseInt(n));
};
My_conv.n2dec = function(val, n){
  return parseInt(val, parseInt(n));
};
