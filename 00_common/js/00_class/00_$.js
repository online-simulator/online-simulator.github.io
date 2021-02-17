// online-simulator.github.io

My_entry.$ = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.$.config =
My_entry.$.prototype.config = {
  REFERRER: {
    html: "innerHTML",
    text: "textContent",
    value: "value"
  }
};
My_entry.$.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.$.prototype._id = function(id){
  var self = this;
  return document.getElementById(id);
};
My_entry.$.prototype.list_tag = function(selector){
  var self = this;
  return document.getElementsByTagName(selector);
};
My_entry.$.prototype.arr_tag = function(selector){
  var self = this;
  return Array.prototype.slice.call(document.getElementsByTagName(selector));
};
My_entry.$.prototype.list0 = function(selector, element){
  var self = this;
  var element = element || document;
  return element.querySelector(selector);
};
My_entry.$.prototype.list = function(selector, element){
  var self = this;
  var element = element || document;
  return element.querySelectorAll(selector);
};
My_entry.$.prototype.arr = function(selector, element){
  var self = this;
  var element = element || document;
  return Array.prototype.slice.call(element.querySelectorAll(selector));
};
My_entry.$.prototype.bind_objs = function(_self, objs){
  var self = this;
  for(var prop in objs){
    objs[prop] = objs[prop].bind(_self);
  }
  return _self;
};
My_entry.$.prototype.set_elem = function(_elem, prop, val){
  var self = this;
  if(typeof _elem[prop] !== "undefined"){
    _elem[prop] = val;
  }
  else if(typeof _elem.style[prop] !== "undefined"){
    _elem.style[prop] = val;
  }
  return _elem;
};
My_entry.$.prototype.set_id = function(id, prop, val){
  var self = this;
  var elem = self._id(id);
  return self.set_elem(elem, prop, val);
};
My_entry.$.prototype.get_elem = function(elem, prop){
  var self = this;
  var _val = undefined;
  if(typeof elem[prop] !== "undefined"){
    _val = elem[prop];
  }
  else if(typeof elem.style[prop] !== "undefined"){
    _val = elem.style[prop];
  }
  return _val;
};
My_entry.$.prototype.get_id = function(id, prop){
  var self = this;
  var elem = self._id(id);
  return self.get_elem(elem, prop);
};
My_entry.$.prototype.select_elem = function(elem){
  var self = this;
  return elem.options[elem.selectedIndex];
};
My_entry.$.prototype.select_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.select_elem(elem);
};
My_entry.$.prototype.selectText_elem = function(elem){
  var self = this;
  return self.select_elem(elem).textContent;
};
My_entry.$.prototype.selectText_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.selectText_elem(elem);
};
My_entry.$.prototype.selectVal_elem = function(elem){
  var self = this;
  return self.select_elem(elem).value;
};
My_entry.$.prototype.selectVal_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.selectVal_elem(elem);
};
My_entry.$.prototype.selectNum_elem = function(elem){
  var self = this;
  return Number(self.selectVal_elem(elem));
};
My_entry.$.prototype.selectNum_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.selectNum_elem(elem);
};
My_entry.$.prototype.inputVal_elem = function(elem){
  var self = this;
  return elem.value;
};
My_entry.$.prototype.inputVal_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.inputVal_elem(elem);
};
My_entry.$.prototype.inputNum_elem = function(elem){
  var self = this;
  return Number(self.inputVal_elem(elem));
};
My_entry.$.prototype.inputNum_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.inputNum_elem(elem);
};
My_entry.$.prototype.checkbox_elem = function(elem){
  var self = this;
  return elem.checked;
};
My_entry.$.prototype.checkbox_id = function(id){
  var self = this;
  var elem = self._id(id);
  return self.checkbox_elem(elem);
};
My_entry.$.prototype.add_first_elem = function(elem, elem_p){
  var self = this;
  return elem_p.insertBefore(elem, elem_p.firstChild);
};
My_entry.$.prototype.add_first_id = function(elem, id){
  var self = this;
  var elem_p = self._id(id);
  return self.add_first_elem(elem, elem_p);
};
My_entry.$.prototype.add_last_elem = function(elem, elem_p){
  var self = this;
  return elem_p.appendChild(elem);
};
My_entry.$.prototype.add_last_id = function(elem, id){
  var self = this;
  var elem_p = self._id(id);
  return self.add_last_elem(elem, elem_p);
};
My_entry.$.prototype.setup_elems = function(_arr_elem, handlers, opt_onevent){
  var self = this;
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
My_entry.$.prototype.setup_elems$ = function(selector, handlers, opt_onevent){
  var self = this;
  return self.setup_elems(self.arr(selector), handlers, opt_onevent);
};
My_entry.$.prototype.setup_elems$_tag = function(tagName, handlers, opt_onevent){
  var self = this;
  return self.setup_elems(self.arr_tag(tagName), handlers, opt_onevent);
};
My_entry.$.prototype.setup_elem$_id = function(id, handlers, opt_onevent){
  var self = this;
  return self.setup_elems([self._id(id)], handlers, opt_onevent);
};
My_entry.$.prototype.setup_elems_readonly = function(_arr_elem){
  var self = this;
  _arr_elem.forEach(function(elem){
    if(self.get_elem(elem, "readOnly")){
      elem.onfocus = function(e){
        elem.select();
      };
    }
    else{
      if(elem.onfocus){
        elem.onfocus = null;
      }
    }
  });
  return _arr_elem;
};
My_entry.$.prototype.setup_elems_readonly$ = function(selector){
  var self = this;
  return self.setup_elems_readonly(self.arr(selector));
};
My_entry.$.prototype.setup_elems_readonly$_tag = function(tagName){
  var self = this;
  return self.setup_elems_readonly(self.arr_tag(tagName));
};
My_entry.$.prototype.setup_elem_readonly$_id = function(id){
  var self = this;
  return self.setup_elems_readonly([self._id(id)]);
};
My_entry.$.prototype.get_elems = function(arr_elem){
  var self = this;
  var _elems = {};
  arr_elem.forEach(function(elem){
    elem.id = elem.id || (elem.tagName+"-"+elem[self.config.REFERRER.text]).toUpperCase();  // use toUpperCase for UTF-8
    _elems[elem.id] = elem;
  });
  return _elems;
};
My_entry.$.prototype.get_elems$ = function(selector){
  var self = this;
  return self.get_elems(self.arr(selector));
};
My_entry.$.prototype.get_elems$_tag = function(tagName){
  var self = this;
  return self.get_elems(self.arr_tag(tagName));
};
My_entry.$.prototype.get_elem$_id = function(id){
  var self = this;
  return self.get_elems([self._id(id)]);
};
My_entry.$.prototype.show = function(selector, isChecked, isDisplay){
  var self = this;
  var _arr = self.arr(selector);
  var prop = (isDisplay)? "display": "visibility";
  var val = (isDisplay)?
    (isChecked? "block": "none"):
    (isChecked? "visible": "hidden");
  _arr.forEach(function(elem){
    self.set_elem(elem, prop, val);
  });
  return _arr;
};
My_entry.$.prototype.hide = function(selector, isChecked, isDisplay){
  var self = this;
  return self.show(selector, !(isChecked), isDisplay);
};
My_entry.$.prototype.val2literal = function(val){
  var self = this;
  var _val = val;
  switch(val.toUpperCase()){
    case "UNDEFINED":
      _val = undefined;
      break;
    case "NULL":
      _val = null;
      break;
    case "FALSE":
      _val = false;
      break;
    case "TRUE":
      _val = true;
      break;
    case "DEFAULT":
      _val = "";
      break;
    default:
      break;
  }
  return _val;
};
My_entry.$.prototype.get_urlParam = function(key_comp){
  var self = this;
  var _str = "";
  if(location && location.search){
    var params = location.search.split("?")[1].split("&");
    for(var i=0, len=params.length; i<len; ++i){
      var arr = params[i].split("=");
      var key = arr[0];
      var val = arr[1];
      if(key && val){
        if(key.toUpperCase() === key_comp.toUpperCase()){
          _str = self.val2literal(val);
          break;
        }
      }
    }
  }
  return _str;
};
My_entry.$.prototype.get_urlParams = function(obj){
  var self = this;
  var _obj = obj || {};
  if(location && location.search){
    var params = location.search.split("?")[1].split("&");
    for(var i=0, len=params.length; i<len; ++i){
      var arr = params[i].split("=");
      var key = arr[0];
      var val = arr[1];
      if(key && val){
        _obj[key] = self.val2literal(val);
      }
    }
  }
  return _obj;
};
My_entry.$.prototype.get_elemProps = function(selector, separator, prop, obj){
  var self = this;
  var _obj = obj || {};
  self.arr(selector).forEach(function(elem){
    var val = elem[prop];
    if(prop === "value"){
      val = (isNaN(Number(val)))? val: Number(val);
    }
    _obj[elem.id.split(separator)[1]] = val;
  });
  return _obj;
};
