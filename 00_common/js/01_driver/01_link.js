function My_link(id, name){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_link.prototype.init = function(id, name){
  var self = this;
  self.id = id;
  self.name = name;
  self.blob = null;
  self.url = null;
  return self;
};
My_link.prototype.set_url = function(text, type){
  var self = this;
  switch(type){
    default:
      self.name = self.name || "download.txt";
      self.blob = new Blob([text], {type: "text/plain"});
      self.url = My_conv.text2url(text);
      break;
  }
  return self;
};
