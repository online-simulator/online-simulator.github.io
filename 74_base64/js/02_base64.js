"use strict";

function My_str2base64(){
  var input = My$_id("input").value;
  var output = "";
  try{
    var binary = My_conv.str2binary(input);
    output = btoa(binary);
  }
  catch(e){
    output = e.message;
  }
  My$_id("output").value = output;
}
function My_base64_2str(){
  var input = My$_id("input").value;
  var output = "";
  try{
    var binary = atob(input);
    output = My_conv.binary2str(binary);
  }
  catch(e){
    output = e.message;
  }
  My$_id("output").value = output;
}
function My_postset(){
  My$_id("input").value = My$_id("output").value;
}
function My_clear(){
  My$_id("input").value = "";
  My$_id("output").value = "";
}
