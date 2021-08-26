// online-simulator.github.io

My_entry.filter = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.filter.prototype.init = function(){
  var self = this;
  return self;
};
My_entry.filter.prototype.run = function(ctx, params){
  var self = this;
  var px_w0 = ctx.canvas.width;
  var px_h0 = ctx.canvas.height;
  var is = params.is || 0;
  var js = params.js || 0;
  var px_w = params.px_w || px_w0;
  var px_h = params.px_h || px_h0;
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
    var sw_rgba = [sw_re(/r/i), sw_re(/g/i), sw_re(/b/i), sw_re(/a/i)];
    var di = Math.floor((Math.sqrt(len)-1)/2);
    var dj = di;
    var get_idata0 = function(i, j, n){
      return (4*(px_w0*j+i)+n);
    };
    var get_idata = function(i, j, n){
      return (4*(px_w*j+i)+n);
    };
    var composite = function(i0, j0, n){
      var _sum = 0;
      var sum_w = 0;
      var iw = 0;
      for(var j=-dj; j<=dj; ++j){
        for(var i=-di; i<=di; ++i){
          /* Ver.2.44.23 -> */
          var ired0 = get_idata0(is+i0+i, js+j0+j, 0);
          var data0i = data0[ired0+n];
          var wi = arr_w[iw++];
          if(data0i >= 0){      // exclude undefined
            _sum += wi*data0i;  // wi first
            sum_w += wi;
          }
          /* -> Ver.2.44.23 */
        }
      }
      return ((sum_w)? _sum/sum_w: _sum);
    };
    /* not optimized */
    for(var j=0; j<px_h; ++j){
      for(var i=0; i<px_w; ++i){
        var ired = get_idata(i, j, 0);
        for(var n=0; n<4; ++n){
          if(sw_rgba[n]){
            _data[ired+n] = composite(i, j, n);
          }
        }
      }
    }
  }
  return _ID;
};
