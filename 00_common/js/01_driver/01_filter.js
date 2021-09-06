// online-simulator.github.io

My_entry.filter = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.filter.prototype.init = function(){
  var self = this;
  self.draw = new My_entry.draw();  // Ver.2.46.24
  return self;
};
/* Ver.2.44.23 -> */
My_entry.filter.prototype.get_di = function(len){
  var self = this;
  return Math.floor((Math.sqrt(len)-1)/2);
};
My_entry.filter.prototype.get_len = function(di){
  var self = this;
  return ((2*di+1)*(2*di+1));
};
My_entry.filter.prototype.composite = function(arr_w, data0, px_w0, is, js, di, dj, i0, j0, n0){
  var self = this;
  var _sum = 0;
  var sum_w = 0;
  var iw = 0;
  for(var j=-dj; j<=dj; ++j){
    for(var i=-di; i<=di; ++i){
      var ired0 = 4*(px_w0*(js+j0+j)+is+i0+i);
      var data0i = data0[ired0+n0];
      var wi = arr_w[iw++] || 0;
      if(!(isNaN(data0i))){  // exclude undefined  // Ver.2.46.24
        _sum += wi*data0i;   // wi first
        sum_w += wi;
      }
    }
  }
  return ((sum_w)? _sum/sum_w: _sum);
};
/* -> Ver.2.44.23 */
/* Ver.2.46.24 */
My_entry.filter.prototype.convID_hsv = function(ID, isHSV2RGB, isConical){
  var self = this;
  var conv = self.draw[(isHSV2RGB)? "hsv2rgb": "rgb2hsv"];
  var px_w = ID.width;
  var px_h = ID.height;
  var data = ID.data;
  for(var j=0; j<px_h; ++j){
    for(var i=0; i<px_w; ++i){
      var ired = 4*(px_w*j+i);
      var r = data[ired+0];
      var g = data[ired+1];
      var b = data[ired+2];
      var rgb = conv([r, g, b], 255, isConical);
      data[ired+0] = rgb[0];
      data[ired+1] = rgb[1];
      data[ired+2] = rgb[2];
    }
  }
  return self;
};
/* Ver.2.46.24 */
/* Ver.2.44.23 */
/* Ver.2.44.22 */
/* not optimized */
My_entry.filter.prototype.run = function(ctx, params){
  var self = this;
  var px_w0 = ctx.canvas.width;
  var px_h0 = ctx.canvas.height;
  var is = params.is || 0;
  var js = params.js || 0;
  var px_w = params.px_w || px_w0-is;
  var px_h = params.px_h || px_h0-js;
  var _ID = ctx.getImageData(is, js, px_w, px_h);
  var _data = _ID.data;
  var arr_w = params.arr_w || [];
  var len = arr_w.length;
  if(len){
    var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
    var data0 =  ID0.data;
    var sw_re = function(re){
      return ((params.rgba)? Boolean(params.rgba.match(re)): false);
    };
    var isConical = sw_re(/cone/i);
    var sws_hsv = [sw_re(/h/i), sw_re(/s/i), sw_re(/v/i)];
    var sws_rgba = [sw_re(/r/i), sw_re(/g/i), sw_re(/b/i), sw_re(/a/i)];
    var hasHSV = sws_hsv[0] || sws_hsv[1] || sws_hsv[2];
    var hasRGBA = sws_rgba[0] || sws_rgba[1] || sws_rgba[2] || sws_rgba[3];
    var di = self.get_di(len);
    var dj = di;
    var filter_callback = function(callback){
      for(var j=0; j<px_h; ++j){
        for(var i=0; i<px_w; ++i){
          var ired = 4*(px_w*j+i);
          var ired0 = 4*(px_w0*(js+j)+is+i);
          callback(i, j, ired, ired0);
        }
      }
    };
    if(hasHSV){
      // make data1
      var ID1 = ctx.getImageData(0, 0, px_w0, px_h0);
      var data1 =  ID1.data;
      // rgb2hsv
      self.convID_hsv(ID1, false, isConical);
      // hsv-color-space
      filter_callback(function(i, j, ired, ired0){
        for(var n=0; n<3; ++n){  // exclude a
          if(sws_hsv[n]){
            _data[ired+n] = self.composite(arr_w, data1, px_w0, is, js, di, dj, i, j, n);
          }
          else{
            _data[ired+n] = data1[ired0+n];
          }
        }
      });
      // hsv2rgb
      self.convID_hsv(_ID, true, isConical);
      // update data0
      filter_callback(function(i, j, ired, ired0){
        for(var n=0; n<3; ++n){  // exclude a
          data0[ired0+n] = _data[ired+n];
        }
      });
    }
    if(hasRGBA){
      // rgba-color-space
      filter_callback(function(i, j, ired, ired0){
        for(var n=0; n<4; ++n){  // include a
          if(sws_rgba[n]){
            _data[ired+n] = self.composite(arr_w, data0, px_w0, is, js, di, dj, i, j, n);
          }
        }
      });
    }
  }
  return _ID;
};
