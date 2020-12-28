"use strict";

function My_str2code(){
  var n = My$select_id("select-n").textContent;
  var input = My$_id("input").value;
  var output_utf16 = "";
  var output_utf8 = "";
  try{
    output_utf16 = My_conv.str2code_utf16(input, n);
  }
  catch(e){
    output_utf16 = e.message;
  }
  My$_id("output_utf16").value = output_utf16;
  try{
    output_utf8 = My_conv.str2code_utf8(input, n);
  }
  catch(e){
    output_utf8 = e.message;
  }
  My$_id("output_utf8").value = output_utf8;
}
function My_code2str(){
  var n = My$select_id("select-n").textContent;
  var input = My$_id("input").value;
  var output_utf16 = "";
  var output_utf8 = "";
  var arr_num_n = input.split(",");
  try{
    var arr_uint16 = My_conv.arr_num2arr_uint(arr_num_n, n, 16);
    output_utf16 = My_conv.arr_uint16_2str(arr_uint16);
  }
  catch(e){
    output_utf16 = e.message;
  }
  My$_id("output_utf16").value = output_utf16;
  try{
    var arr_uint8 = My_conv.arr_num2arr_uint(arr_num_n, n, 8);
    output_utf8 = My_conv.arr_uint8_2str(arr_uint8);
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
