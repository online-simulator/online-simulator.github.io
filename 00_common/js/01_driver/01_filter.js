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
/* Ver.2.48.24 -> */
My_entry.filter.prototype.get_yd = function(r, g, b){
  var self = this;
  return 0.29891*r+0.58661*g+0.11448*b;
};
My_entry.filter.prototype.get_y = function(r, g, b){
  var self = this;
  return 0.2126*r+0.7152*g+0.0722*b;
};
My_entry.filter.prototype.get_l = function(r, g, b){
  var self = this;
  var min = Math.min.apply(Math, [r, g, b]);
  var max = Math.max.apply(Math, [r, g, b]);
  return (min+max)/2;
};
My_entry.filter.prototype.make_get_y = function(sw){
  var self = this;
  var _get_y = self.get_yd;
  switch(sw){
    case 1:
      _get_y = self.get_y;
      break;
    case 2:
      _get_y = self.get_l;
      break;
    case 3:
      _get_y = function(r, g, b){
        return (r+g+b)/3;
      };
      break;
    case 4:
      _get_y = function(r, g, b){
        var min = Math.min.apply(Math, [r, g, b]);
        return min;
      };
      break;
    case 5:
      _get_y = function(r, g, b){
        var max = Math.max.apply(Math, [r, g, b]);
        return max;
      };
      break;
    default:
      break;
  }
  return _get_y;
};
/* -> Ver.2.48.24 */
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
  return _sum/(sum_w || 1);  // || not0
};
/* -> Ver.2.44.23 */
/* Ver.2.47.24 */
My_entry.filter.prototype.composite_sw = function(arr_w, data0, px_w0, is, js, di, dj, i0, j0, n0){
  var self = this;
  var _t = 0;
  var slope = arr_w[0];
  var offset = arr_w[1] || 0;
  var gamma = arr_w[2] || 1;
  var th = arr_w[3] || 0;
  if(slope === -1){
    offset += 255;
  }
  var ired0 = 4*(px_w0*(js+j0)+is+i0);
  var data0i = data0[ired0+n0];
  _t = data0i;
  var t0 = (_t-th < 0)? 0: 255;
  _t = Math.pow((_t-th)/(t0-th || 1), gamma)*(t0-th)+th;  // || not0
  _t *= slope;
  _t += offset;
  return _t;
};
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
/* Ver.2.48.24 */
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
  var len_w = arr_w.length;
  if(len_w){
    var sw_re = function(re){
      return ((params.rgba)? Boolean(params.rgba.match(re)): false);
    };
    var isFx = sw_re(/fx/i);
    var isFy = sw_re(/fy/i);
    var isDot = sw_re(/dot/i);
    var isTo2 = sw_re(/to2/i);
    var isMono = sw_re(/mono/i);
    var isPost = isFx || isFy || isDot || isTo2 || isMono;
    var isConical = sw_re(/cone/i);
    var sws_hsv = [sw_re(/h/i), sw_re(/s/i), sw_re(/v/i)];
    var sws_rgba = [sw_re(/r/i), sw_re(/g/i), sw_re(/b/i), sw_re(/a/i)];
    var hasHSV = sws_hsv[0] || sws_hsv[1] || sws_hsv[2];
    var hasRGBA = sws_rgba[0] || sws_rgba[1] || sws_rgba[2] || sws_rgba[3];
    var filter_callback = function(callback){
      for(var j=0; j<px_h; ++j){
        for(var i=0; i<px_w; ++i){
          var ired = 4*(px_w*j+i);
          var ired0 = 4*(px_w0*(js+j)+is+i);
          callback(i, j, ired, ired0);
        }
      }
    };
    if(isPost){
      var w0 = Math.floor(arr_w[0]);
      var w1 = Math.floor(arr_w[1] || 0);
      var ID1 = ctx.getImageData(is, js, px_w, px_h);
      var data1 = ID1.data;
      if(isFx){
        filter_callback(function(i, j, ired, ired0){
          var i1 = (px_w-1-i+w0)%px_w;
          if(i1 < 0){
            i1 += px_w;
          }
          var ired1 = 4*(px_w*j+i1);
          for(var n=0; n<4; ++n){
            if(sws_rgba[n]){
              _data[ired+n] = data1[ired1+n];
            }
          }
        });
      }
      else if(isFy){
        filter_callback(function(i, j, ired, ired0){
          var j1 = (px_h-1-j+w0)%px_h;
          if(j1 < 0){
            j1 += px_h;
          }
          var ired1 = 4*(px_w*j1+i);
          for(var n=0; n<4; ++n){
            if(sws_rgba[n]){
              _data[ired+n] = data1[ired1+n];
            }
          }
        });
      }
      else if(isDot){
        w0 = Math.abs(w0 || 1);
        w1 = Math.abs(w1 || w0);
        var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
        var data0 =  ID0.data;
        filter_callback(function(i, j, ired, ired0){
          if(i%w0 === 0 && j%w1 === 0){
            for(var n=0; n<4; ++n){
              if(sws_rgba[n]){
                var sum = 0;
                var sum_w = 0;
                for(var j0=js+j; j0<js+j+w1; ++j0){
                  for(var i0=is+i; i0<is+i+w0; ++i0){
                    var ired0 = 4*(px_w0*j0+i0);
                    var data0i = data0[ired0+n];
                    if(!(isNaN(data0i))){
                      sum += data0i;
                      ++sum_w;
                    }
                  }
                }
                sum /= (sum_w || 1);  // || not0
                for(var jj=j; jj<j+w1; ++jj){
                  for(var ii=i; ii<i+w0; ++ii){
                    var ired = 4*(px_w*jj+ii);
                    var _datai = _data[ired+n];
                    if(!(isNaN(_datai))){
                      _data[ired+n] = sum;
                    }
                  }
                }
              }
            }
          }
        });
      }
      else if(isTo2){
        if(hasRGBA){
          filter_callback(function(i, j, ired, ired0){
            var ired1 = ired;
            for(var n=0; n<4; ++n){
              if(sws_rgba[n]){
                var rgba = (data1[ired1+n] > w0)? 255: 0;
                _data[ired+n] = rgba;
              }
            }
          });
        }
        else{
          var get_y = self.make_get_y(w1);
          filter_callback(function(i, j, ired, ired0){
            var ired1 = ired;
            var r = data1[ired1+0];
            var g = data1[ired1+1];
            var b = data1[ired1+2];
            var a = data1[ired1+3];
            var rgb = (get_y(r, g, b) > w0)? 255: 0;
            _data[ired+0] = rgb;
            _data[ired+1] = rgb;
            _data[ired+2] = rgb;
            _data[ired+3] = a;
          });
        }
      }
      else if(isMono){
        var get_y = self.make_get_y(w0);
        filter_callback(function(i, j, ired, ired0){
          var ired1 = ired;
          var r = data1[ired1+0];
          var g = data1[ired1+1];
          var b = data1[ired1+2];
          var rgb = get_y(r, g, b);
          _data[ired+0] = rgb;
          _data[ired+1] = rgb;
          _data[ired+2] = rgb;
        });
      }
    }
    else{
      var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
      var data0 =  ID0.data;
      var composite = (len_w < 9)? self.composite_sw: self.composite;  // Ver.2.47.24
      var di = self.get_di(len_w);
      var dj = di;
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
              _data[ired+n] = composite(arr_w, data1, px_w0, is, js, di, dj, i, j, n);
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
              _data[ired+n] = composite(arr_w, data0, px_w0, is, js, di, dj, i, j, n);
            }
          }
        });
      }
    }
  }
  return _ID;
};
