// online-simulator.github.io

"use strict";

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
function My$bind(self, fn){
  return fn.bind(self);
}
function My$bind_objs(self, objs){
  for(var prop in objs){
    objs[prop] = objs[prop].bind(self);
  }
  return self;
}
function My$set_elem(elem, prop, val){
  if(typeof elem[prop] !== "undefined"){
    elem[prop] = val;
  }
  else if(typeof elem.style[prop] !== "undefined"){
    elem.style[prop] = val;
  }
  return elem;
}
function My$set_id(id, prop, val){
  var elem = My$_id(id);
  if(elem){
    My$set_elem(elem, prop, val);
  }
  return elem;
}
function My$select_elem(elem){
  return elem.options[elem.selectedIndex];
}
function My$select_id(id){
  var elem = My$_id(id);
  return My$select_elem(elem);
}
function My$selectText_elem(elem){
  return My$select_elem(elem).textContent;
}
function My$selectText_id(id){
  var elem = My$_id(id);
  return My$selectText_elem(elem);
}
function My$selectVal_elem(elem){
  return My$select_elem(elem).value;
}
function My$selectVal_id(id){
  var elem = My$_id(id);
  return My$selectVal_elem(elem);
}
function My$selectNum_elem(elem){
  return Number(My$selectVal_elem(elem));
}
function My$selectNum_id(id){
  var elem = My$_id(id);
  return My$selectNum_elem(elem);
}
function My$inputVal_elem(elem){
  return elem.value;
}
function My$inputVal_id(id){
  var elem = My$_id(id);
  return My$inputVal_elem(elem);
}
function My$inputNum_elem(elem){
  return Number(My$inputVal_elem(elem));
}
function My$inputNum_id(id){
  var elem = My$_id(id);
  return My$inputNum_elem(elem);
}
function My$checkbox_elem(elem){
  return elem.checked;
}
function My$checkbox_id(id){
  var elem = My$_id(id);
  return My$checkbox_elem(elem);
}
function My$add_first_elem(elem, elem_p){
  return elem_p.insertBefore(elem, elem_p.firstChild);
}
function My$add_first_id(elem, id){
  var elem_p = My$_id(id);
  return My$add_first_elem(elem, elem_p);
}
function My$add_last_elem(elem, elem_p){
  return elem_p.appendChild(elem);
}
function My$add_last_id(elem, id){
  var elem_p = My$_id(id);
  return My$add_last_elem(elem, elem_p);
}
