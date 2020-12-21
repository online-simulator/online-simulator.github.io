"use strict";

function My_output_command(){
  var command = "";
  try{
    var re = new RegExp(My$_id("pattern").value, My$_id("flag").value);
    var str = My$_id("string").value;
    command = "out=text.replace("+re+",\""+str+"\")\;";
  }
  catch(e){
    command = e.message;
  }
  My$_id("command").value = command;
}
function My_run_replace(){
  var output = "";
  try{
    var re = new RegExp(My$_id("pattern").value, My$_id("flag").value);
    var str = My$_id("string").value;
    var text = My$_id("input").value;
    output = text.replace(re, str);
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
