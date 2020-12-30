function My_browser(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_browser.prototype.init = function(){
  var self = this;
  self.UA = window.navigator.userAgent;
  self.sws = {};
  self.sws.isIE = (window.navigator.msSaveBlob)? true: false;
  return self;
};
// <a> do not use href="#" target="_blank"
My_browser.prototype.save_file = function(link, isOnclick){
  var self = this;
  if(self.sws.isIE && isOnclick){
    navigator.msSaveBlob(link.blob, link.name);
  }
  else{
    My$set_id(link.id, "download", link.name);
    My$set_id(link.id, "href", link.url);
  }
  return self;
};
