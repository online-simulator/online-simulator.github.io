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
function My$_id(id){
  return document.getElementById(id);
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
function My$set_id(id, prop, val){
  var elem = My$_id(id);
  if(elem){
    if(typeof elem[prop] !== "undefined"){
      elem[prop] = val;
    }
    if(typeof elem.style[prop] !== "undefined"){
      elem.style[prop] = val;
    }
  }
}
function My$select_id(id){
  var elem = My$_id(id);
  return elem.options[elem.selectedIndex];
}
function My$add_first_id(elem, id){
  parent.insertBefore(elem, My$_id(id).firstChild);
}
function My$add_first_elem(elem, elem_p){
  parent.insertBefore(elem, elem_p.firstChild);
}
function My$add_last_id(elem, id){
  My$_id(id).appendChild(elem);
}
function My$add_last_elem(elem, elem_p){
  elem_p.appendChild(elem);
}
function My$bind(self, fn){
  return fn.bind(self);
}
