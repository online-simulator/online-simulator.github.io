"use strict";

function My_str2base64(){
  var input = My$_id("input").value;
  var output_BE = "";
  var output_LE = "";
  var output_native = "";
  try{
    var binary = My_conv.str2binary(input);
    output_BE = btoa(binary);
  }
  catch(e){
    output_BE = e.message;
  }
  My$_id("output_BE").value = output_BE;
  try{
    var binary = My_conv.str2binary(input, true);
    output_LE = btoa(binary);
  }
  catch(e){
    output_LE = e.message;
  }
  My$_id("output_LE").value = output_LE;
  try{
    output_native = btoa(input);
  }
  catch(e){
    output_native = e.message;
  }
  My$_id("output_native").value = output_native;
}
function My_base64_2str(){
  var input = My$_id("input").value;
  var output_BE = "";
  var output_LE = "";
  var output_native = "";
  try{
    var binary = atob(input);
    output_BE = My_conv.binary2str(binary);
  }
  catch(e){
    output_BE = e.message;
  }
  My$_id("output_BE").value = output_BE;
  try{
    var binary = atob(input);
    output_LE = My_conv.binary2str(binary, true);
  }
  catch(e){
    output_LE = e.message;
  }
  My$_id("output_LE").value = output_LE;
  try{
    output_native = atob(input);
  }
  catch(e){
    output_native = e.message;
  }
  My$_id("output_native").value = output_native;
}
function My_postset_BE(){
  My$_id("input").value = My$_id("output_BE").value;
}
function My_postset_LE(){
  My$_id("input").value = My$_id("output_LE").value;
}
function My_postset_native(){
  My$_id("input").value = My$_id("output_native").value;
}
function My_clear(){
  My$_id("input").value = "";
  My$_id("output_BE").value = "";
  My$_id("output_LE").value = "";
  My$_id("output_native").value = "";
}
