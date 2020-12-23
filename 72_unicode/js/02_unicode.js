"use strict";

function My_str2code(){
  var n = My$select_id("select-n").innerText;
  var input = My$_id("input").value;
  var output_utf16 = "";
  var output_utf8 = "";
  try{
    var str = input;
    var arr_num_n = [];
    for(var i=0, len=str.length; i<len; ++i){
      var token = str[i];
      var uint16 = token.charCodeAt(0)
      arr_num_n.push(My_conv.dec2n(uint16, n));
    }
    output_utf16 = arr_num_n;
  }
  catch(e){
    output_utf16 = e.message;
  }
  My$_id("output_utf16").value = output_utf16;
  try{
    if(typeof TextEncoder !== "undefined"){
      var buf_uint8 = new TextEncoder().encode(input);
      var arr_num_n = [];
      buf_uint8.forEach(function(uint8, i){
        arr_num_n[i] = My_conv.dec2n(uint8, n);
      });
      output_utf8 = arr_num_n;
    }
  }
  catch(e){
    output_utf8 = e.message;
  }
  My$_id("output_utf8").value = output_utf8;
}
function My_code2str(){
  var n = My$select_id("select-n").innerText;
  var input = My$_id("input").value;
  var output_utf16 = "";
  var output_utf8 = "";
  var arr_uint16 = [];
  var arr_uint8 = [];
  var arr_token = input.split(",");
  arr_token.forEach(function(token){
    var num_10 = My_conv.n2dec(token, n);
    if(!isNaN(num_10)){
      if(num_10 < 65536){
        arr_uint16.push(num_10);
      }
      if(num_10 <256){
        arr_uint8.push(num_10);
      }
    }
  });
  try{
    var str = "";
    arr_uint16.forEach(function(uint16){
      str += String.fromCharCode(uint16);
    });
    output_utf16 = str;
  }
  catch(e){
    output_utf16 = e.message;
  }
  My$_id("output_utf16").value = output_utf16;
  try{
    if(typeof TextDecoder !== "undefined"){
      output_utf8 = new TextDecoder().decode(new Uint8Array(arr_uint8));
    }
  }
  catch(e){
    output_utf8 = e.message;
  }
  My$_id("output_utf8").value = output_utf8;
}
function My_postset_utf16(){
  My$_id("input").value = My$_id("output_utf16").value;
}
function My_postset_utf8(){
  My$_id("input").value = My$_id("output_utf8").value;
}
function My_clear(){
  My$_id("input").value = "";
  My$_id("output_utf16").value = "";
  My$_id("output_utf8").value = "";
}
