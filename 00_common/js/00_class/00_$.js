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
function My$get_elem(elem, prop){
  var _val;
  if(typeof elem[prop] !== "undefined"){
    _val = elem[prop];
  }
  else if(typeof elem.style[prop] !== "undefined"){
    _val = elem.style[prop];
  }
  return _val;
}
function My$get_id(id, prop){
  var _val;
  if(elem){
    _val = My$get_elem(elem, prop);
  }
  return _val;
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
function My_setup_elems(_arr_elem, handlers, opt_onevent){
  var handlers = handlers || {};
  var set_handler = function(elem, onevent){
    if(typeof elem[onevent] !== "undefined"){
      elem[onevent] = (handlers[onevent])?
        function(e){
          handlers[onevent](e, elem);
        }:
        null;  // null
    }
  };
  _arr_elem.forEach(function(elem){
    if(opt_onevent){
      set_handler(elem, opt_onevent);
    }
    else{
      for(var onevent in handlers){
        set_handler(elem, onevent);
      }
    }
  });
  return _arr_elem;
}
function My_setup_elems$(selector, handlers, opt_onevent){
  return My_setup_elems(My$arr(selector), handlers, opt_onevent);
}
function My_setup_elems$_tag(tagName, handlers, opt_onevent){
  return My_setup_elems(My$arr_tag(tagName), handlers, opt_onevent);
}
function My_setup_elem$_id(id, handlers, opt_onevent){
  return My_setup_elems([My$_id(id)], handlers, opt_onevent);
}
function My_setup_elems_readonly(_arr_elem){
  _arr_elem.forEach(function(elem){
    if(My$get_elem(elem, "readOnly")){
      elem.onfocus = function(e){
        elem.select();
      };
    }
  });
  return _arr_elem;
}
function My_setup_elems_readonly$(selector){
  return My_setup_elems_readonly(My$arr(selector));
}
function My_setup_elems_readonly$_tag(tagName){
  return My_setup_elems_readonly(My$arr_tag(tagName));
}
function My_setup_elem_readonly$_id(id){
  return My_setup_elems_readonly([My$_id(id)]);
}
function My_get_elems(arr_elem){
  var _elems = {};
  arr_elem.forEach(function(elem){
    elem.id = elem.id || (elem.tagName+"-"+elem[My_config.REFERRER.text]).toUpperCase();  // use toUpperCase for UTF-8
    _elems[elem.id] = elem;
  });
  return _elems;
}
function My_get_elems$(selector){
  return My_get_elems(My$arr(selector));
}
function My_get_elems$_tag(tagName){
  return My_get_elems(My$arr_tag(tagName));
}
function My_get_elem$_id(id){
  return My_get_elems([My$_id(id)]);
}
