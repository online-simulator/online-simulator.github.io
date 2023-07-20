// online-simulator.github.io

My_entry.filter = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.filter.prototype.init = function(){
  var self = this;
  self.reference = new My_entry.reference();  // Ver.2.62.27
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
    case 6:
      _get_y = function(r, g, b){
        var _median = g;
        var min = Math.min.apply(Math, [r, g, b]);
        var max = Math.max.apply(Math, [r, g, b]);
        if(min === r){
          _median = (g < b)? g: b;
        }
        else if(min === g){
          _median = (b < r)? b: r;
        }
        else{
          _median = (r < g)? r: g;
        }
        return _median;
      };
      break;
    /* Ver.2.49.25 */
    case -1:
      _get_y = function(r, g, b, wr, wg, wb){
        return (wr*r+wg*g+wb*b)/(wr+wg+wb || 1);  // || not0
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
/* Ver.2.62.27 -> */
My_entry.filter.prototype.sort_random = function(_arr){
  var self = this;
  return self.reference.sort_random.call(self, _arr);
};
My_entry.filter.prototype.switch_arr = function(_arr, i, j){
  var self = this;
  var w = _arr[i];
  _arr[i] = _arr[j];
  _arr[j] = w;
  return _arr;
};
My_entry.filter.prototype.gen_irand = function(len){
  var self = this;
  return Math.floor(Math.random()*len);
};
/* -> Ver.2.62.27 */
/* Ver.2.48.25 */
My_entry.filter.prototype.composite = function(arr_w, data0, px_w0, px_h0, di, dj, i0, j0, n0){
  var self = this;
  var _sum = 0;
  var sum_w = 0;
  var iw = 0;
  var is = Math.max(i0-di, 0);
  var js = Math.max(j0-dj, 0);
  var ie = Math.min(i0+di, px_w0-1);
  var je = Math.min(j0+dj, px_h0-1);
  for(var j=j0-dj; j<=j0+dj; ++j){
    for(var i=i0-di; i<=i0+di; ++i){
      var wi = arr_w[iw++] || 0;
      if(i >= is && i <= ie && j >= js && j <= je){
        var ired0 = 4*(px_w0*j+i);
        var data0i = data0[ired0+n0];
        _sum += wi*data0i;  // wi first
        sum_w += wi;
      }
    }
  }
  return _sum/(sum_w || 1);  // || not0
};
/* -> Ver.2.44.23 */
/* Ver.2.47.24 */
My_entry.filter.prototype.composite_sw = function(arr_w, data0, px_w0, px_h0, di, dj, i0, j0, n0){
  var self = this;
  var _t = 0;
  var slope = arr_w[0];
  var offset = arr_w[1] || 0;
  var gamma = arr_w[2] || 1;
  var th = arr_w[3] || 0;
  if(slope === -1){
    offset += 255;
  }
  var ired0 = 4*(px_w0*j0+i0);
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
/* pen-Ver.1.55.10 */
My_entry.filter.prototype.run_gblur = function(ctx, x0, y0, s0, ks0){
  var self = this;
  var px_w0 = ctx.canvas.width;
  var px_h0 = ctx.canvas.height;
  var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
  var ID1 = ctx.getImageData(0, 0, px_w0, px_h0);
  var data0 = ID0.data;
  var data1 = ID1.data;
  var i0 = Math.round(x0);
  var j0 = Math.round(y0);
  var s = Math.ceil(s0);
  var s2 = s*s;
  var di = s*ks0;
  var dj = di;
  var is = Math.max(i0-di, 0);
  var js = Math.max(j0-dj, 0);
  var ie = Math.min(i0+di, px_w0-1);
  var je = Math.min(j0+dj, px_h0-1);
  var run = function(i0, j0, sk){
    var s = Math.ceil(sk);
    var s2 = s*s;
    var di = s*ks0;
    var dj = di;
    var is = Math.max(i0-di, 0);
    var js = Math.max(j0-dj, 0);
    var ie = Math.min(i0+di, px_w0-1);
    var je = Math.min(j0+dj, px_h0-1);
    var sum_r = 0;
    var sum_g = 0;
    var sum_b = 0;
    var sum_a = 0;
    var sum_w = 0;
    for(var j=js; j<=je; ++j){
      for(var i=is; i<=ie; ++i){
        var ired = 4*(px_w0*j+i);
        var a = data0[ired+3];
        if(a){
          var di = i-i0;
          var dj = j-j0;
          var r2 = di*di+dj*dj;
          var t2 = r2/s2;
          if(t2 < ks0){
            var w = Math.exp(-0.5*t2);
            sum_r += data0[ired+0]*w;
            sum_g += data0[ired+1]*w;
            sum_b += data0[ired+2]*w;
            sum_a += data0[ired+3]*w;
            sum_w += w;
          }
        }
      }
    }
    if(sum_w){
      var ired = 4*(px_w0*j0+i0);
      data1[ired+0] = sum_r/sum_w;
      data1[ired+1] = sum_g/sum_w;
      data1[ired+2] = sum_b/sum_w;
      data1[ired+3] = sum_a/sum_w;
    }
  };
  for(var j=js; j<=je; ++j){
    for(var i=is; i<=ie; ++i){
      var di = i-i0;
      var dj = j-j0;
      var r2 = di*di+dj*dj;
      var t2 = r2/s2;
      if(t2 < ks0){
        var ks = Math.exp(-0.5*t2);
        run(i, j, s0*ks);
      }
    }
  }
  var _ID = ID1;
  return _ID;
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
  /* Ver.2.60.27 -> */
  /* limiter -> */
  var is = Math.min(Math.max(Math.floor(params.is || 0), 0), px_w0-1);
  var js = Math.min(Math.max(Math.floor(params.js || 0), 0), px_h0-1);
  var px_w = Math.min(Math.max(Math.floor(params.px_w || px_w0-is), 1), px_w0-is);
  var px_h = Math.min(Math.max(Math.floor(params.px_h || px_h0-js), 1), px_h0-js);
  /* -> limiter */
  /* -> Ver.2.60.27 */
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
    var isEncode = sw_re(/encode/i);  // Ver.2.62.27
    var isFiin = sw_re(/fiin/i);  // Ver.2.61.27
    var isTo2 = sw_re(/to2/i);
    var isMono = sw_re(/mono/i);
    var isPost = isFx || isFy || isDot || isEncode || isFiin || isTo2 || isMono;
    /* Ver.2.65.27 -> */
    var isFFT = false;
    var isDFT = sw_re(/dft/i);
    var isDWT = sw_re(/dwt/i);
    isPost = isPost || isFFT || isDFT || isDWT;
    /* -> Ver.2.65.27 */
    var isConical = sw_re(/cone/i);
    var sws_hsv = [sw_re(/h/i), sw_re(/s/i), sw_re(/v/i)];
    var sws_rgba = [sw_re(/r/i), sw_re(/g/i), sw_re(/b/i), sw_re(/a/i)];
    var hasHSV = sws_hsv[0] || sws_hsv[1] || sws_hsv[2];
    var hasRGBA = sws_rgba[0] || sws_rgba[1] || sws_rgba[2] || sws_rgba[3];
    var filter_callback = function(callback){
      for(var j=0; j<px_h; ++j){
        for(var i=0; i<px_w; ++i){
          var ired = 4*(px_w*j+i);
          var ired0 = 4*(px_w0*(js+j)+(is+i));
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
        var dx = Math.abs(w0 || 1);
        var dy = Math.abs(w1 || dx);
        var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
        var data0 = ID0.data;
        filter_callback(function(i, j, ired, ired0){
          if(i%dx === 0 && j%dy === 0){
            /* Ver.2.48.25 -> */
            var len_i0 = Math.min(is+i+dx, px_w0);
            var len_j0 = Math.min(js+j+dy, px_h0);
            var len_ii = Math.min(i+dx, px_w);
            var len_jj = Math.min(j+dy, px_h);
            for(var n=0; n<4; ++n){
              if(sws_rgba[n]){
                var sum = 0;
                var sum_w = 0;
                for(var j0=js+j; j0<len_j0; ++j0){
                  for(var i0=is+i; i0<len_i0; ++i0){
                    var ired0 = 4*(px_w0*j0+i0);
                    var data0i = data0[ired0+n];
                    sum += data0i;
                    ++sum_w;
                  }
                }
                sum /= (sum_w || 1);  // || not0
                for(var jj=j; jj<len_jj; ++jj){
                  for(var ii=i; ii<len_ii; ++ii){
                    var ired = 4*(px_w*jj+ii);
                    _data[ired+n] = sum;
                  }
                }
              }
            }
            /* -> Ver.2.48.25 */
          }
        });
      }
      /* Ver.2.62.27 -> */
      else if(isEncode){
        var dx = Math.abs(w0 || 1);
        var dy = Math.abs(w1 || dx);
        var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
        var data0 = ID0.data;
        filter_callback(function(i, j, ired, ired0){
          if(i%dx === 0 && j%dy === 0){
            var len_i0 = Math.min(is+i+dx, px_w0);
            var len_j0 = Math.min(js+j+dy, px_h0);
            var len_ii = Math.min(i+dx, px_w);
            var len_jj = Math.min(j+dy, px_h);
            var arr_str_ij = [];
            for(var j0=js+j; j0<len_j0; ++j0){
              for(var i0=is+i; i0<len_i0; ++i0){
                arr_str_ij.push(i0+","+j0);
              }
            }
            self.sort_random(arr_str_ij);
            for(var n=0; n<4; ++n){
              if(sws_rgba[n]){
                var ij = 0;
                for(var jj=j; jj<len_jj; ++jj){
                  for(var ii=i; ii<len_ii; ++ii){
                    var str_ij = arr_str_ij[ij++];
                    if(str_ij){
                      var i1j1 = str_ij.split(",");
                      var i1 = Number(i1j1[0]);
                      var j1 = Number(i1j1[1]);
                      var ired = 4*(px_w*jj+ii);
                      var ired1 = 4*(px_w0*j1+i1);
                      _data[ired+n] = data0[ired1+n];
                    }
                  }
                }
              }
            }
          }
        });
      }
      /* -> Ver.2.62.27 */
      /* Ver.2.61.27 -> */
      else if(isFiin){
        var i0 = w0;
        var j0 = w1;
        /* 1.37.8 -> */
        var forPen = (arr_w.length > 6);
        var rgba2 = null;
        if(forPen){
          var isColor = true;
          rgba2 = {r: arr_w[2], g: arr_w[3], b: arr_w[4], a: arr_w[5]};
          var Nwrap = arr_w[6];
        }
        else{
          var i1 = Math.floor(arr_w[2] || 0);
          var j1 = Math.floor(arr_w[3] || 0);
          var color = (params.content || "").split(",")[2];
          var isColor = (color && isNaN(color));
          var Nwrap = ((isColor)? arr_w[3]: arr_w[4]) || 0;
        }
        Nwrap = Math.min(Math.max(Nwrap, 1), 256);
        var dw = 16;
        var dh = 16;
        if(i0 >= 0 && i0 < px_w && j0 >= 0 && j0 < px_h){
          var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
          var data0 = ID0.data;
          var ID1 = ctx.createImageData(px_w, px_h);
          var data1 = ID1.data;
          var rgba0 = ctx.getImageData(is+i0, js+j0, 1, 1).data;
          var r0 = rgba0[0];
          var g0 = rgba0[1];
          var b0 = rgba0[2];
          var a0 = rgba0[3];
          var r1 = 0;
          var g1 = 0;
          var b1 = 0;
          var a1 = 0;
          if(forPen && arr_w[7]){
            _ID = ID1;
          }
          if(isColor){
            var rgba1 = rgba2 || new My_entry.draw(ctx).color2rgba(color);
        /* -> 1.37.8 */
            r1 = rgba1.r;
            g1 = rgba1.g;
            b1 = rgba1.b;
            a1 = rgba1.a;
          }
          else{
            var rgba1 = ctx.getImageData(is+i1, js+j1, 1, 1).data;
            r1 = rgba1[0];
            g1 = rgba1[1];
            b1 = rgba1[2];
            a1 = rgba1[3];
          }
          r0 = r0 || 0;
          g0 = g0 || 0;
          b0 = b0 || 0;
          a0 = a0 || 0;
          r1 = r1 || 0;
          g1 = g1 || 0;
          b1 = b1 || 0;
          a1 = a1 || 0;
          var set_color = function(i0, j0){
            if(i0 >= 0 && i0 < px_w && j0 >= 0 && j0 < px_h){
              var ired = 4*(px_w*j0+i0);
              var isOver = data1[ired+0];
              if(!(isOver)){
                var ired0 = 4*(px_w0*(js+j0)+(is+i0));
                var r = data0[ired0+0];
                var g = data0[ired0+1];
                var b = data0[ired0+2];
                var a = data0[ired0+3];
                var isTarget = (r === r0 && g === g0 && b === b0 && a === a0);
                if(isTarget){
                  data1[ired+0] = 1;
                  _data[ired+0] = r1;
                  _data[ired+1] = g1;
                  _data[ired+2] = b1;
                  _data[ired+3] = a1;
                  var nw0 = Math.floor(i0/dw);
                  var nh0 = Math.floor(j0/dh);
                  var i0s = nw0*dw;
                  var j0s = nh0*dh;
                  var i = i0-1;
                  var j = j0;
                  if(i >= i0s && i < i0s+dw && j >= j0s && j < j0s+dh){
                    set_color(i, j);
                  }
                  var i = i0+1;
                  var j = j0;
                  if(i >= i0s && i < i0s+dw && j >= j0s && j < j0s+dh){
                    set_color(i, j);
                  }
                  var i = i0;
                  var j = j0-1;
                  if(i >= i0s && i < i0s+dw && j >= j0s && j < j0s+dh){
                    set_color(i, j);
                  }
                  var i = i0;
                  var j = j0+1;
                  if(i >= i0s && i < i0s+dw && j >= j0s && j < j0s+dh){
                    set_color(i, j);
                  }
                }
              }
            }
          };
          var set_colors = function(nw, nh){
            var i0s = nw*dw;
            var j0s = nh*dh;
            for(var j=0; j<dh; ++j){
              for(var i=0; i<dw; ++i){
                var i0 = i0s+i;
                var j0 = j0s+j;
                var isBoundX = (i === 0 || i === dw-1);
                var isBoundY = (j === 0 || j === dh-1);
                if(isBoundX || isBoundY){
                  if(i0 >= 0 && i0 < px_w && j0 >= 0 && j0 < px_h){
                    var ired = 4*(px_w*j0+i0);
                    var isOver = data1[ired+0];
                    if(isOver){
                      /* Ver.2.120.34 -> */
                      if(isBoundX){
                        set_color(((i === 0)? i0-1: i0+1), j0);
                      }
                      if(isBoundY){
                        set_color(i0, ((j === 0)? j0-1: j0+1));
                      }
                      /* -> Ver.2.120.34 */
                    }
                  }
                }
              }
            }
          };
          set_color(i0, j0);
          var nws = 0;
          var nhs = 0;
          var nwe = Math.floor(px_w/dw);
          var nhe = Math.floor(px_h/dh);
          for(var n=0; n<Nwrap; ++n){
            for(var nh=nhs; nh<=nhe; ++nh){
              for(var nw=nws; nw<=nwe; ++nw){
                set_colors(nw, nh);
              }
            }
            for(var nw=nws; nw<=nwe; ++nw){
              for(var nh=nhs; nh<=nhe; ++nh){
                set_colors(nw, nh);
              }
            }
            for(var nh=nhe; nh>=nhs; --nh){
              for(var nw=nwe; nw>=nws; --nw){
                set_colors(nw, nh);
              }
            }
            for(var nw=nwe; nw>=nws; --nw){
              for(var nh=nhe; nh>=nhs; --nh){
                set_colors(nw, nh);
              }
            }
          }
        }
      }
      /* -> Ver.2.61.27 */
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
          /* Ver.2.49.25 -> */
          var wr = arr_w[2] || 0;
          var wg = arr_w[3] || 0;
          var wb = arr_w[4] || 0;
          /* -> Ver.2.49.25 */
          var get_y = self.make_get_y(w1);
          filter_callback(function(i, j, ired, ired0){
            var ired1 = ired;
            var r = data1[ired1+0];
            var g = data1[ired1+1];
            var b = data1[ired1+2];
            var a = data1[ired1+3];
            var rgb = (get_y(r, g, b, wr, wg, wb) > w0)? 255: 0;  // Ver.2.49.25
            _data[ired+0] = rgb;
            _data[ired+1] = rgb;
            _data[ired+2] = rgb;
            _data[ired+3] = a;
          });
        }
      }
      else if(isMono){
        /* Ver.2.49.25 -> */
        var wr = arr_w[1] || 0;
        var wg = arr_w[2] || 0;
        var wb = arr_w[3] || 0;
        /* -> Ver.2.49.25 */
        var get_y = self.make_get_y(w0);
        filter_callback(function(i, j, ired, ired0){
          var ired1 = ired;
          var r = data1[ired1+0];
          var g = data1[ired1+1];
          var b = data1[ired1+2];
          var rgb = get_y(r, g, b, wr, wg, wb);  // Ver.2.49.25
          _data[ired+0] = rgb;
          _data[ired+1] = rgb;
          _data[ired+2] = rgb;
        });
      }
      /* Ver.2.65.27 -> */
      else if(isFFT || isDFT || isDWT){
        var pi2 = Math.PI*2;
        var N = px_w;
        var M = px_h;
        /* limiter -> */
        N = Math.min(N, 256);
        M = Math.min(M, 256);
        /* -> limiter */
        var get_power = function(radix, val, power){
          var _power = power || 0;
          var _val = val/radix;
          if(_val < 1){
            return _power;
          }
          else{
            return get_power(radix, _val, ++_power);
          }
        };
        var init_arr = function(N, M, hasID){
          var _arr = [];
          var data = (hasID)? ctx.getImageData(is, js, N, M).data: null;
          for(var i=0; i<N; ++i){
            _arr[i] = [];
            for(var j=0; j<M; ++j){
              var ired = 4*(N*j+i);  // N
              _arr[i][j] = [];
              for(var n=0; n<4; ++n){
                _arr[i][j][n] = (data)? data[ired+n]: 0;
              }
            }
          }
          return _arr;
        };
        var forward_DFT = function(ijr, iji, uvr, uvi, N, M, Nf, Mf, cutoffU, cutoffV, isInverse){
          var ujr = init_arr(N, M);
          var uji = init_arr(N, M);
          // (i,j) -> (u,j)
          for(var j=0; j<M; ++j){
            for(var u=0; u<N; ++u){
              var arr_sumr = [0, 0, 0, 0];
              var arr_sumi = [0, 0, 0, 0];
              for(var i=0; i<N; ++i){
                var theta0 = u*i*pi2/N;
                var theta = (isInverse)? theta0: -theta0;
                var rcr = Math.cos(theta);
                var rci = Math.sin(theta);
                var ijrij = ijr[i][j];
                var ijiij = iji[i][j];
                for(var n=0; n<4; ++n){
                  var lcr = ijrij[n];
                  var lci = ijiij[n];
                  arr_sumr[n] += lcr*rcr-lci*rci;
                  arr_sumi[n] += lcr*rci+lci*rcr;
                }
              }
              for(var n=0; n<4; ++n){
                ujr[u][j][n] = arr_sumr[n]*Nf;
                uji[u][j][n] = arr_sumi[n]*Nf;
              }
            }
          }
          // (u,j) -> (u,v)
          var threshold_u = cutoffU*N;
          var threshold_v = cutoffV*M;
          for(var u=0; u<N; ++u){
            for(var v=0; v<M; ++v){
              var isCutOff = (u >= threshold_u && v >= threshold_v);
              if(isCutOff){
                for(var n=0; n<4; ++n){
                  uvr[u][v][n] = 0;
                  uvi[u][v][n] = 0;
                }
              }
              else{
                var arr_sumr = [0, 0, 0, 0];
                var arr_sumi = [0, 0, 0, 0];
                for(var j=0; j<M; ++j){
                  var theta0 = v*j*pi2/M;
                  var theta = (isInverse)? theta0: -theta0;
                  var rcr = Math.cos(theta);
                  var rci = Math.sin(theta);
                  var ujruj = ujr[u][j];
                  var ujiuj = uji[u][j];
                  for(var n=0; n<4; ++n){
                    var lcr = ujruj[n];
                    var lci = ujiuj[n];
                    arr_sumr[n] += lcr*rcr-lci*rci;
                    arr_sumi[n] += lcr*rci+lci*rcr;
                  }
                }
                for(var n=0; n<4; ++n){
                  uvr[u][v][n] = arr_sumr[n]*Mf;
                  uvi[u][v][n] = arr_sumi[n]*Mf;
                }
              }
            }
          }
        };
        var inverse_DFT = function(ijr, iji, uvr, uvi, N, M, Nf, Mf, cutoffU, cutoffV){
          Array.prototype.push.apply(arguments, [true]);
          return forward_DFT.apply(self, arguments);
        };
        /* Ver.2.72.29 -> */
        var forward_DWT = function(ijr, uvr, p, q, cutoffU, cutoffV){
          var radix = 2;
          var N = Math.pow(radix, p);
          var M = Math.pow(radix, q);
          var ujr = init_arr(N, M);
          var i2u = function(j){
            var N2 = N;
            for(var Np=0; Np<p; ++Np){
              N2 /= 2;
              for(var i=0; i<N2; ++i){
                for(var n=0; n<4; ++n){
                  var a = ijr[2*i][j][n];
                  var b = ijr[2*i+1][j][n];
                  ujr[i][j][n] = a+b;
                  ujr[i+N2][j][n] = a-b;
                }
              }
              for(var u=0; u<N2; ++u){
                for(var n=0; n<4; ++n){
                  ijr[u][j][n] = ujr[u][j][n];
                }
              }
            }
          };
          var j2v = function(u){
            var M2 = M;
            for(var Nq=0; Nq<q; ++Nq){
              M2 /= 2;
              for(var j=0; j<M2; ++j){
                for(var n=0; n<4; ++n){
                  var a = ujr[u][2*j][n];
                  var b = ujr[u][2*j+1][n];
                  uvr[u][j][n] = a+b;
                  uvr[u][j+M2][n] = a-b;
                }
              }
              for(var v=0; v<M2; ++v){
                for(var n=0; n<4; ++n){
                  ujr[u][v][n] = uvr[u][v][n];
                }
              }
            }
          };
          // (i,j) -> (u,j)
          for(var j=0; j<M; ++j){
            i2u(j);
          }
          // (u,j) -> (u,v)
          for(var u=0; u<N; ++u){
            j2v(u);
          }
          // cut-off wavelet
          var threshold_u = cutoffU*N;
          var threshold_v = cutoffV*M;
          for(var v=0; v<M; ++v){
            for(var u=0; u<N; ++u){
              var isCutOff = (u >= threshold_u && v >= threshold_v);
              if(isCutOff){
                for(var n=0; n<4; ++n){
                  uvr[u][v][n] = 0;
                }
              }
            }
          }
        };
        var inverse_DWT = function(uvr, ijr, p, q){
          var radix = 2;
          var N = Math.pow(radix, p);
          var M = Math.pow(radix, q);
          var ivr = init_arr(N, M);
          var u2i = function(v){
            var N2 = 1;
            for(var Np=0; Np<p; ++Np){
              for(var u=0; u<N2; ++u){
                for(var n=0; n<4; ++n){
                  var a = uvr[u][v][n];
                  var b = uvr[u+N2][v][n];
                  ivr[2*u][v][n] = 0.5*(a+b);
                  ivr[2*u+1][v][n] = 0.5*(a-b);
                }
              }
              N2 *= 2;
              for(var i=0; i<N2; ++i){
                for(var n=0; n<4; ++n){
                  uvr[i][v][n] = ivr[i][v][n];
                }
              }
            }
          };
          var v2j = function(i){
            var M2 = 1;
            for(var Nq=0; Nq<q; ++Nq){
              for(var v=0; v<M2; ++v){
                for(var n=0; n<4; ++n){
                  var a = ivr[i][v][n];
                  var b = ivr[i][v+M2][n];
                  ijr[i][2*v][n] = 0.5*(a+b);
                  ijr[i][2*v+1][n] = 0.5*(a-b);
                }
              }
              M2 *= 2;
              for(var j=0; j<M2; ++j){
                for(var n=0; n<4; ++n){
                  ivr[i][j][n] = ijr[i][j][n];
                }
              }
            }
          };
          // (u,v) -> (i,v)
          for(var v=0; v<M; ++v){
            u2i(v);
          }
          // (i,v) -> (i,j)
          for(var i=0; i<N; ++i){
            v2j(i);
          }
        };
        /* -> Ver.2.72.29 */
        var output_data = function(ij){
          for(var n=0; n<4; ++n){
            if(sws_rgba[n]){
              for(var j=0; j<M; ++j){
                for(var i=0; i<N; ++i){
                  var ired = 4*(px_w*j+i);  // px_w
                  _data[ired+n] = Math.round(ij[i][j][n]);
                }
              }
            }
          }
        };
        if(isFFT){
        }
        else if(isDFT){
          var ijr = init_arr(N, M, true);
          var iji = init_arr(N, M);
          var uvr = init_arr(N, M);
          var uvi = init_arr(N, M);
          var cutoffU = arr_w[0] || 0;
          var cutoffV = arr_w[1] || 0;
          forward_DFT(ijr, iji, uvr, uvi, N, M, 1, 1, cutoffU, cutoffV);
          inverse_DFT(uvr, uvi, ijr, iji, N, M, 1/N, 1/M, 1, 1);
          output_data(ijr);
        }
        /* Ver.2.72.29 -> */
        else if(isDWT){
          var radix = 2;
          var p = get_power(radix, N);
          var q = get_power(radix, M);
          var N = Math.pow(radix, p);
          var M = Math.pow(radix, q);
          var ijr = init_arr(N, M, true);
          var uvr = init_arr(N, M);
          var cutoffU = arr_w[0] || 0;
          var cutoffV = arr_w[1] || 0;
          forward_DWT(ijr, uvr, p, q, cutoffU, cutoffV);
          inverse_DWT(uvr, ijr, p, q);
          output_data(ijr);
        }
        /* -> Ver.2.72.29 */
      }
      /* -> Ver.2.65.27 */
    }
    /* Ver.2.54.26 -> */
    else if(len_w > 5 && len_w < 9){
      var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
      var data0 = ID0.data;
      var a = arr_w[0] || 0;
      var b = arr_w[1] || 0;
      var c = arr_w[2] || 0;
      var d = arr_w[3] || 0;
      var e = arr_w[4] || 0;
      var f = arr_w[5] || 0;
      var isForward = arr_w[6] || 0;
      var det = (a*d-b*c);
      var ad = d/det;
      var bd = (-b)/det;
      var cd = (-c)/det;
      var dd = a/det;
      var ed = (c*f-e*d)/det;
      var fd = (e*b-a*f)/det;
      var callback_transform = (isForward)?
        function(i, j, ired, ired0, n){
          var ii = Math.round(i*a+j*c+e);
          var jj = Math.round(i*b+j*d+f);
          if(ii >= 0 && ii < px_w && jj >= 0 && jj < px_h){
            var ired = 4*(px_w*jj+ii);
            _data[ired+n] = data0[ired0+n];
          }
        }:
        function(i, j, ired, ired0, n){
          var ii = Math.round(i*ad+j*cd+ed);
          var jj = Math.round(i*bd+j*dd+fd);
          if(ii >= 0 && ii < px_w && jj >= 0 && jj < px_h){
            ii += is;
            jj += js;
            if(ii >= 0 && ii < px_w0 && jj >= 0 && jj < px_h0){
              var ired0 = 4*(px_w0*jj+ii);
              _data[ired+n] = data0[ired0+n];
            }
          }
        };
      if(hasRGBA && det){  // && not0
        _ID = ctx.createImageData(px_w, px_h);  // the same as original size
        _data = _ID.data;
        // rgba-color-space
        filter_callback(function(i, j, ired, ired0){
          for(var n=0; n<4; ++n){  // include a
            if(sws_rgba[n]){
              callback_transform(i, j, ired, ired0, n);
            }
          }
        });
      }
    }
    /* -> Ver.2.54.26 */
    else{
      var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
      var data0 = ID0.data;
      var composite = (len_w < 9)? self.composite_sw: self.composite;  // Ver.2.47.24
      var di = self.get_di(len_w);
      var dj = di;
      if(hasHSV){
        // make data1
        var ID1 = ctx.getImageData(0, 0, px_w0, px_h0);
        var data1 = ID1.data;
        // rgb2hsv
        self.convID_hsv(ID1, false, isConical);
        // hsv-color-space
        filter_callback(function(i, j, ired, ired0){
          for(var n=0; n<3; ++n){  // exclude a
            if(sws_hsv[n]){
              _data[ired+n] = composite(arr_w, data1, px_w0, px_h0, di, dj, is+i, js+j, n);
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
              _data[ired+n] = composite(arr_w, data0, px_w0, px_h0, di, dj, is+i, js+j, n);
            }
          }
        });
      }
    }
    /* Ver.2.63.27 -> */
    if(params.ID_mask){
      var ID0 = ctx.getImageData(0, 0, px_w0, px_h0);
      var data0 = ID0.data;
      var data_mask = params.ID_mask.data;
      var isInverse = params.isInverse;
      var isClear = params.isClear;
      filter_callback(function(i, j, ired, ired0){
        var mask_r = data_mask[ired0+0];
        var mask_g = data_mask[ired0+1];
        var mask_b = data_mask[ired0+2];
        var mask_a = data_mask[ired0+3];
        var isInMask = mask_r || mask_g || mask_b || mask_a;
        for(var n=0; n<4; ++n){
          var data_in = _data[ired+n];
          var data_out = (isClear)? 0: data0[ired0+n];
          if(isInverse){
            _data[ired+n] = (isInMask)? data_out: data_in;
          }
          else{
            _data[ired+n] = (isInMask)? data_in: data_out;
          }
        }
      });
    }
    /* -> Ver.2.63.27 */
  }
  return _ID;
};
