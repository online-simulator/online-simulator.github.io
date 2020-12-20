"use strict";

// func.apply(thisArg[, argsArray])
// func.bind (thisArg[, arg0[, arg1[, ...argN]]])
// func.call([thisArg[, arg0[, arg1[, ...argN]]]])

function My$(selector, element){
  var element = element || document;
  return element.querySelector(selector);
}
function My$0(selector, element){
  return My$(selector, element);
}
function My$_id(selector){
  return document.getElementById(selector);
}
function My$0_tag(selector){
  return My$list_tag(selector)[0];
}
function My$list_tag(selector){
  return document.getElementsByTagName(selector);
}
function My$arr_tag(selector){
  return Array.prototype.slice.call(document.getElementsByTagName(selector));
}
function My$list(selector, element){
  var element = element || document;
  return element.querySelectorAll(selector);
}
function My$arr(selector, element){
  var element = element || document;
  return Array.prototype.slice.call(element.querySelectorAll(selector));
}
function My$set(selector, prop, val){
  var _hasProp = false;
  var dom = My$_id(selector);
  if(dom){
    if(My_def.hasProp(dom, prop)){
      dom[prop] = val;
      _hasProp = true;
    }
    if(My_def.hasProp(dom.style, prop)){
      dom.style[prop] = val;
      _hasProp = true;
    }
  }
  return _hasProp;
}
function My$select_id(id){
  var dom = My$_id(id);
  return dom.options[dom.selectedIndex];
}
