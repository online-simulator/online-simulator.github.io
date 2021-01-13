// online-simulator.github.io

function My_link(id, name, ext){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_link.prototype.init = function(id, name, ext){
  var self = this;
  self.id = id;
  self.name = name;
  self.ext = ext;
  self.type = "";
  self.blob = null;
  self.url;
  return self;
};
My_link.prototype.set_url = function(content){
  var self = this;
  var type = "";
  switch(self.ext){
    case "":
      type = "application/octet-stream";
      break;
    case "mp4":
      type = "video/mp4";
      break;
    case "svg":
      type = "image/svg+xml";
      break;
    case "bmp":
      type = "image/bmp";
      break;
    case "png":
      type = "image/png";
      break;
    case "jpg":
    case "jpeg":
      type = "image/jpeg";
      break;
    case "gif":
      type = "image/gif";
      break;
    case "mpg":
    case "mpeg":
      type = "audio/mpeg";
      break;
    case "wav":
    case "wave":
      type = "audio/wav";
      break;
    case "csv":
      type = "text/csv";
      break;
    case "htm":
    case "html":
      type = "text/html";
      break;
    case "css":
      type = "text/css";
      break;
    case "js":
      type = "text/javascript";
      break;
    case "txt":
      type = "text/plain";
      break;
    default:
      break;
  }
  self.type = type;
  if(self.name && self.type){
    var dot = ".";
    if(self.name.split(dot).length === 1){
      self.name += dot;
      self.name += self.ext;
    }
    if(content){
      self.blob = new Blob([content], {type: self.type});
      self.url = My_conv.blob2url(self.blob);
    }
  }
  return self;
};
