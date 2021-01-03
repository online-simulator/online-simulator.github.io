// online-simulator.github.io

function My_link(id, name, type){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_link.prototype.init = function(id, name, type){
  var self = this;
  self.id = id;
  self.name = name;
  self.type = type;
  self.blob = null;
  self.url;
  return self;
};
My_link.prototype.set_url = function(content){
  var self = this;
  var ext = "";
  switch(self.type){
    case "application/octet-stream":
      break;
    case "video/mp4":
      ext = ".mp4";
      break;
    case "image/svg+xml":
      ext = ".svg";
      break;
    case "image/bmp":
      ext = ".bmp";
      break;
    case "image/png":
      ext = ".png";
      break;
    case "image/jpeg":
      ext = ".jpg";
      break;
    case "image/gif":
      ext = ".gif";
      break;
    case "audio/mpeg":
      ext = ".mpeg";
      break;
    case "audio/wave":
    case "audio/wav":
      ext = ".wav";
      break;
    case "text/csv":
      ext = ".csv";
      break;
    case "text/html":
      ext = ".html";
      break;
    case "text/css":
      ext = ".css";
      break;
    case "text/javascript":
      ext = ".js";
      break;
    case "text/plain":
      ext = ".txt";
      break;
    default:
      break;
  }
  if(self.name && self.type){
    if(self.name.split(".").length === 1){
      self.name += ext;
    }
    if(content){
      self.blob = new Blob([content], {type: self.type});
      self.url = My_conv.blob2url(self.blob);
    }
  }
  return self;
};
