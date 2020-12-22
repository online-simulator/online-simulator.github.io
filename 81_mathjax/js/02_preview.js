"use strict";

function My_preview(){
  My$_id("output").innerText = My$_id("input").value;
  if(typeof MathJax !== "undefined"){
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "output"]);
  }
}

function My_clear(){
  My$_id("input").value = "";
  My$_id("output").innerText = "";
}
