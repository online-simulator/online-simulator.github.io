// online-simulator.github.io

My_entry.browser = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.browser.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["$"]);
  self.UA = window.navigator.userAgent;
  self.sws = {};
  self.sws.isIE = (window.navigator.msSaveBlob)? true: false;
  return self;
};
// <a> do not use href="#" target="_blank"
My_entry.browser.prototype.save_file = function(link, isOnclick){
  var self = this;
  if(self.sws.isIE && isOnclick){
    navigator.msSaveBlob(link.blob, link.name);
  }
  else{
    self.entry.$.set_id(link.id, "download", link.name);
    self.entry.$.set_id(link.id, "href", link.url);
  }
  return self;
};
