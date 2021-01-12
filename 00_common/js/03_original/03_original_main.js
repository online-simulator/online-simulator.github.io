function My_original_main(){
}

My_original_main.prototype.init_main = function(){
  var self = this;
  self.handlers = {};
  self.handlers.onload = function(e){
    var self = this;
    console.log("onload");
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    console.log("onbeforeunload");
    return self;
  };
  self.init_handlers.apply(self, arguments);
  My$bind_objs(self, self.handlers);
  self.init_elems.apply(self, arguments);
  return self;
};
My_original_main.prototype.init_elems = function(){
  var self = this;
  return self;
};
My_original_main.prototype.init_handlers = function(){
  var self = this;
  return self;
};
My_original_main.prototype.onload = function(){
  var self = this;
  self.handlers.onload.apply(self, arguments);
  document.body.onbeforeunload = function(e){
    self.handlers.onbeforeunload(e);
  };
  return self;
};
My_original_main.prototype.setup_elems = function(arr_elem, onevent, handlers){
  var self = this;
  var handlers = handlers || self.handlers;
  arr_elem.forEach(function(elem){
    if(typeof elem[onevent] !== "undefined"){
      elem[onevent] = function(e){
        handlers[onevent](e, elem);
      };
      // use toUpperCase for UTF-8
//      elem.id = elem.id || (elem.tagName+"-"+elem[My_config.REFERRER.text]).toUpperCase();
    }
  });
  return self;
};
My_original_main.prototype.setup_elems_readonly = function(arr_tagName){
  var self = this;
  var arr_selector = [];
  arr_tagName.forEach(function(tagName, i){
    arr_selector[i] = tagName+"[readonly]";
  });
  My$arr(arr_selector.join()).forEach(function(elem){
    elem.onfocus = function(e){
      elem.select();
    };
  });
  return self;
};
