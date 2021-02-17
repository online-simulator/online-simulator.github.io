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
My_entry.io_ex1.prototype.get_selection_deleted = function(text, ips, isDEL){
  var self = this;
  var _ips = {l: ips.l, r: ips.r};
  if(isDEL){
    _ips.r = (_ips.l < text.length)? _ips.l+1: _ips.l;
  }
  else{
    _ips.l = (_ips.r > 0)? _ips.r-1: _ips.r;
  }
  return _ips;
};
My_entry.io_ex1.prototype.insert_sw = function(elem, _text_, isDEL){
  var self = this;
  if(elem){
    elem.focus();
    var sw_isDEL = (_text_ === null);
    var _text_ = _text_ || "";
    var text = self.read_text(elem);
    var ips = self.get_selection_caret(elem);
    ips = (sw_isDEL)? self.get_selection_deleted(text, ips, isDEL): ips;
    var newText = text.substr(0, ips.l)+_text_+text.substr(ips.r);
    self.write_text(elem, newText);
    if(self.entry.def.isDef(elem.setSelectionRange)){
      var ip = ips.l+_text_.length;
      elem.setSelectionRange(ip, ip);
    }
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
My_entry.io_ex1.prototype.onclick_default = function(elems, text){
  var self = this;
  self.insert_sw(elems.i, text);
  return self;
};
