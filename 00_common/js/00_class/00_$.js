// online-simulator.github.io

"use strict";

function My$(selector, element){
  var element = element || document;
  return element.querySelector(selector);
}

My$.config = {
  REFERRER: {
    html: "innerHTML",
    text: "textContent",
    value: "value"
  }
};
My$._id = function(id){
  return document.getElementById(id);
};
My$.list_tag = function(selector){
  return document.getElementsByTagName(selector);
};
My$.arr_tag = function(selector){
  return Array.prototype.slice.call(document.getElementsByTagName(selector));
};
My$.list = function(selector, element){
  var element = element || document;
  return element.querySelectorAll(selector);
};
My$.arr = function(selector, element){
  var element = element || document;
  return Array.prototype.slice.call(element.querySelectorAll(selector));
};
My$.bind_objs = function(self, objs){
  for(var prop in objs){
    objs[prop] = objs[prop].bind(self);
  }
  return self;
};
My$.set_elem = function(elem, prop, val){
  if(typeof elem[prop] !== "undefined"){
    elem[prop] = val;
  }
  else if(typeof elem.style[prop] !== "undefined"){
    elem.style[prop] = val;
  }
  return elem;
};
My$.set_id = function(id, prop, val){
  var elem = My$._id(id);
  if(elem){
    My$.set_elem(elem, prop, val);
  }
  return elem;
};
My$.get_elem = function(elem, prop){
  var _val;
  if(typeof elem[prop] !== "undefined"){
    _val = elem[prop];
  }
  else if(typeof elem.style[prop] !== "undefined"){
    _val = elem.style[prop];
  }
  return _val;
};
My$.get_id = function(id, prop){
  var _val;
  if(elem){
    _val = My$.get_elem(elem, prop);
  }
  return _val;
};
My$.select_elem = function(elem){
  return elem.options[elem.selectedIndex];
};
My$.select_id = function(id){
  var elem = My$._id(id);
  return My$.select_elem(elem);
};
My$.selectText_elem = function(elem){
  return My$.select_elem(elem).textContent;
};
My$.selectText_id = function(id){
  var elem = My$._id(id);
  return My$.selectText_elem(elem);
};
My$.selectVal_elem = function(elem){
  return My$.select_elem(elem).value;
};
My$.selectVal_id = function(id){
  var elem = My$._id(id);
  return My$.selectVal_elem(elem);
};
My$.selectNum_elem = function(elem){
  return Number(My$.selectVal_elem(elem));
};
My$.selectNum_id = function(id){
  var elem = My$._id(id);
  return My$.selectNum_elem(elem);
};
My$.inputVal_elem = function(elem){
  return elem.value;
};
My$.inputVal_id = function(id){
  var elem = My$._id(id);
  return My$.inputVal_elem(elem);
};
My$.inputNum_elem = function(elem){
  return Number(My$.inputVal_elem(elem));
};
My$.inputNum_id = function(id){
  var elem = My$._id(id);
  return My$.inputNum_elem(elem);
};
My$.checkbox_elem = function(elem){
  return elem.checked;
};
My$.checkbox_id = function(id){
  var elem = My$._id(id);
  return My$.checkbox_elem(elem);
};
My$.add_first_elem = function(elem, elem_p){
  return elem_p.insertBefore(elem, elem_p.firstChild);
};
My$.add_first_id = function(elem, id){
  var elem_p = My$._id(id);
  return My$.add_first_elem(elem, elem_p);
};
My$.add_last_elem = function(elem, elem_p){
  return elem_p.appendChild(elem);
};
My$.add_last_id = function(elem, id){
  var elem_p = My$._id(id);
  return My$.add_last_elem(elem, elem_p);
};
My$.setup_elems = function(_arr_elem, handlers, opt_onevent){
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
};
My$.setup_elems$ = function(selector, handlers, opt_onevent){
  return My$.setup_elems(My$.arr(selector), handlers, opt_onevent);
};
My$.setup_elems$_tag = function(tagName, handlers, opt_onevent){
  return My$.setup_elems(My$.arr_tag(tagName), handlers, opt_onevent);
};
My$.setup_elem$_id = function(id, handlers, opt_onevent){
  return My$.setup_elems([My$._id(id)], handlers, opt_onevent);
};
My$.setup_elems_readonly = function(_arr_elem){
  _arr_elem.forEach(function(elem){
    if(My$.get_elem(elem, "readOnly")){
      elem.onfocus = function(e){
        elem.select();
      };
    }
  });
  return _arr_elem;
};
My$.setup_elems_readonly$ = function(selector){
  return My$.setup_elems_readonly(My$.arr(selector));
};
My$.setup_elems_readonly$_tag = function(tagName){
  return My$.setup_elems_readonly(My$.arr_tag(tagName));
};
My$.setup_elem_readonly$_id = function(id){
  return My$.setup_elems_readonly([My$._id(id)]);
};
My$.get_elems = function(arr_elem){
  var _elems = {};
  arr_elem.forEach(function(elem){
    elem.id = elem.id || (elem.tagName+"-"+elem[My$.config.REFERRER.text]).toUpperCase();  // use toUpperCase for UTF-8
    _elems[elem.id] = elem;
  });
  return _elems;
};
My$.get_elems$ = function(selector){
  return My$.get_elems(My$.arr(selector));
};
My$.get_elems$_tag = function(tagName){
  return My$.get_elems(My$.arr_tag(tagName));
};
My$.get_elem$_id = function(id){
  return My$.get_elems([My$._id(id)]);
};
