"use strict";

function My_uri2code(){
  var input = My$_id("input").value;
  var output_uri = "";
  var output_uriCom = "";
  try{
    output_uri = encodeURI(input);
  }
  catch(e){
    output_uri = e.message;
  }
  My$_id("output_uri").value = output_uri;
  try{
    output_uriCom = encodeURIComponent(input);
  }
  catch(e){
    output_uriCom = e.message;
  }
  My$_id("output_uriCom").value = output_uriCom;
}
function My_code2uri(){
  var input = My$_id("input").value;
  var output_uri = "";
  var output_uriCom = "";
  try{
    output_uri = decodeURI(input);
  }
  catch(e){
    output_uri = e.message;
  }
  My$_id("output_uri").value = output_uri;
  try{
    output_uriCom = decodeURIComponent(input);
  }
  catch(e){
    output_uriCom = e.message;
  }
  My$_id("output_uriCom").value = output_uriCom;
}
function My_postset_uri(){
  My$_id("input").value = My$_id("output_uri").value;
}
function My_postset_uriCom(){
  My$_id("input").value = My$_id("output_uriCom").value;
}
function My_clear(){
  My$_id("input").value = "";
  My$_id("output_uri").value = "";
  My$_id("output_uriCom").value = "";
}
