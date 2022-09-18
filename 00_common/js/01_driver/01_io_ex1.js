// online-simulator.github.io

My_entry.io_ex1 = function(){
};

My_entry.io_ex1.prototype.onclick_C = function(elems){
  var self = this;
  self.clear_all_text(elems.i, elems.o);
  return self;
};
My_entry.io_ex1.prototype.get_selection_caret = function(elem){
  var self = this;
  var _ip = 0;
  var len = 0;
  if(elem){
    len = self.read_text(elem).length;
    if(self.entry.def.isDef(elem.selectionStart)){
      _ip = elem.selectionStart;
    }
    else if(self.entry.def.isDef(document.selection)){  // ~IE10
      _ip = document.selection.createRange();
    }
  }
  _ip = Math.min(len, _ip);
  return {l: _ip, r: _ip};
};
My_entry.io_ex1.prototype.get_selection_deleted = function(text, ips, opt_isDEL){
  var self = this;
  var _ips = {l: ips.l, r: ips.r};
  if(opt_isDEL){
    _ips.r = (_ips.l < text.length)? _ips.l+1: _ips.l;
  }
  else{
    _ips.l = (_ips.r > 0)? _ips.r-1: _ips.r;
  }
  return _ips;
};
My_entry.io_ex1.prototype.set_selection = function(elem, ip){
  var self = this;
  if(elem){
    if(self.entry.def.isDef(elem.setSelectionRange)){
      var abs_ip = Math.max(0, ip);
      elem.setSelectionRange(abs_ip, abs_ip);
    }
    elem.focus();  // last
  }
  return self;
};
My_entry.io_ex1.prototype.insert_sw = function(elem, _text_, opt_isDEL, opt_ip_offset){
  var self = this;
  if(elem){
    elem.focus();  // first
    var sw_isDEL = (_text_ === null);
    var _text_ = _text_ || "";
    var text = self.read_text(elem);
    var ips = self.get_selection_caret(elem);
    if(sw_isDEL){
      ips = self.get_selection_deleted(text, ips, opt_isDEL);
    }
    var newText = text.substring(0, ips.l)+_text_+text.substring(ips.r);
    self.write_text(elem, newText);
    var ip = ips.l+_text_.length;
    if(opt_ip_offset){
      ip += opt_ip_offset;
    }
    self.set_selection(elem, ip);
  }
  return self;
};
My_entry.io_ex1.prototype.onclick_BS = function(elems){
  var self = this;
  self.insert_sw(elems.i, null, false);
  return self;
};
My_entry.io_ex1.prototype.onclick_DEL = function(elems){
  var self = this;
  self.insert_sw(elems.i, null, true);
  return self;
};
My_entry.io_ex1.prototype.onclick_ans = function(elems){
  var self = this;
  var text = self.read_text(elems.o);
  text = (self.entry.def.isNumber(text))? text: "ans";
  self.write_text(elems.i, "");
  self.insert_sw(elems.i, text);
  return self;
};
My_entry.io_ex1.prototype["onclick_"+"<<"] = function(elems){
  var self = this;
  self.set_selection(elems.i, 0);
  return self;
};
My_entry.io_ex1.prototype["onclick_"+">>"] = function(elems){
  var self = this;
  self.set_selection(elems.i, self.read_text(elems.i).length);
  return self;
};
My_entry.io_ex1.prototype.onclick_default = function(elems, text, opt_ip_offset){
  var self = this;
  self.insert_sw(elems.i, text, null, opt_ip_offset);
  return self;
};
