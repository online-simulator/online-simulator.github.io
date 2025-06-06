// online-simulator.github.io

My_entry.draw_canvas = function(){
};

// mix-in
My_entry.draw_canvas.prototype.line = function(vec0, vec1, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  if(lineWidth){  // 0.3.0 ctx.lineWidth = 0 -> ctx.lineWidth -> 1
    var x0 = self.floor(vec0.x);
    var y0 = self.floor(vec0.y);
    var x1 = self.floor(vec1.x);
    var y1 = self.floor(vec1.y);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.closePath();
    self.enter(lineWidth, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
    ctx.restore();
  }
  return self;
};
/* 0.7.0 -> */
/* 0.4.0 -> */
My_entry.draw_canvas.prototype.lines = function(arr_vec, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_fillPath){
  var self = this;
  var ctx = self.ctx;
  var lineWidth = opt_lineWidth;
  var fillPath = opt_fillPath || false;
  var make_path = function(fillPath){
    ctx.beginPath();
    for(var n=0, len_n=arr_vec.length; n<len_n-1; ++n){
      var vec0 = arr_vec[n];
      var vec1 = arr_vec[n+1];
      var x0 = self.floor(vec0.x);
      var y0 = self.floor(vec0.y);
      var x1 = self.floor(vec1.x);
      var y1 = self.floor(vec1.y);
      if(fillPath){
        if(n === 0){
          ctx.moveTo(x0, y0);
        }
      }
      else{
        ctx.moveTo(x0, y0);
      }
      ctx.lineTo(x1, y1);
    }
    ctx.closePath();
  };
  ctx.save();
  // fill
  if(fillPath){
    make_path(true);
    self.enter(0, null, opt_styleRGBA, opt_globalCompositeOperation);
  }
  // stroke
  if(lineWidth){
    make_path(false);
    self.enter(lineWidth, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  }
  ctx.restore();
  return self;
};
/* -> 0.4.0 */
/* -> 0.7.0 */
/* 1.33.8 */
My_entry.draw_canvas.prototype.filter_mosaic = function(opt_ID, dx, dy, type, rgba){  // 1.45.8
  var self = this;
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  var _ID = opt_ID;
  if(_ID){
    px_w = _ID.width;
    px_h = _ID.height;
  }
  else{
    _ID = ctx.getImageData(0, 0, px_w, px_h);
  }
  var data = _ID.data;
  var rdx = Math.round(dx);
  var rdy = Math.round(dy);
  var arr_RGBA = [rgba.r, rgba.g, rgba.b, rgba.a];  // 1.45.8
  var filter_arr = null;
  switch(type){
    case "RGBA":
      filter_arr = function(arr, i){return arr_RGBA[i];};
      break;
    case "min":
      filter_arr = function(arr){return arr[0];};
      break;
    case "mean":
      filter_arr = function(arr){return arr[1];};
      break;
    case "max":
      filter_arr = function(arr){return arr[2];};
      break;
    default:
      break;
  }
  var set_arr = function(arr, value){
    arr[0] = Math.min(arr[0], value);
    arr[1] += value;
    arr[2] = Math.max(arr[2], value);
  };
  var hasArea = (rdx > 0 && rdy > 0);
  if(filter_arr && hasArea){
    /* 1.46.8 -> */
    var Ni = Math.ceil(px_w/rdx);
    var Nj = Math.ceil(px_h/rdy);
    for(var j=0; j<Nj; ++j){
      for(var i=0; i<Ni; ++i){
    /* -> 1.46.8 */
        var xs = rdx*i;
        var ys = rdy*j;
        var xe = Math.min(px_w, xs+rdx)-1;
        var ye = Math.min(px_h, ys+rdy)-1;
        var arr_r = [255, 0, 0];  // min, mean, max
        var arr_g = [255, 0, 0];
        var arr_b = [255, 0, 0];
        var arr_a = [255, 0, 0];
        var sum_w = 0;
        for(var yp=ys; yp<=ye; ++yp){
          for(var xp=xs; xp<=xe; ++xp){
            var ired = 4*(px_w*yp+xp);
            var r = data[ired+0];
            var g = data[ired+1];
            var b = data[ired+2];
            var a = data[ired+3];
            if(r+g+b+a){
              set_arr(arr_r, r);
              set_arr(arr_g, g);
              set_arr(arr_b, b);
              set_arr(arr_a, a);
              ++sum_w;
            }
          }
        }
        if(sum_w){
          arr_r[1] /= sum_w;
          arr_g[1] /= sum_w;
          arr_b[1] /= sum_w;
          arr_a[1] /= sum_w;
          var r = filter_arr(arr_r, 0);
          var g = filter_arr(arr_g, 1);
          var b = filter_arr(arr_b, 2);
          var a = filter_arr(arr_a, 3);
          for(var yp=ys; yp<=ye; ++yp){
            for(var xp=xs; xp<=xe; ++xp){
              var ired = 4*(px_w*yp+xp);
              data[ired+0] = r;
              data[ired+1] = g;
              data[ired+2] = b;
              data[ired+3] = a;
            }
          }
        }
      }
    }
  }
  return _ID;
};
/* 1.0.0 -> */
My_entry.draw_canvas.prototype.mask = function(x, y, w, h){
  var self = this;
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  var x0 = self.floor(x);
  var y0 = self.floor(y);
  var w0 = self.floor(w);
  var h0 = self.floor(h);
  if(w0 && h0){
    var ID = ctx.getImageData(x0, y0, w0, h0);
    ctx.clearRect(0, 0, px_w, px_h);
    ctx.putImageData(ID, x0, y0);
  }
  var _ID = ctx.getImageData(0, 0, px_w, px_h);
  return _ID;
};
My_entry.draw_canvas.prototype.none = function(){
  var self = this;
  return self;
};
My_entry.draw_canvas.prototype.textpath = function(){
  var self = this;
  self.textpath_sw.apply(self, arguments);
  return self;
};
My_entry.draw_canvas.prototype.make_gradLEN = function(arr_vec, vec0, isMin, isRound, Nrender){
  var self = this;
  var _gradLEN = [];
  var pi2 = Math.PI*2;
  var rdt = Nrender/pi2;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var sw = (isMin)? "min": "max";
  var callback = (isMin < 0)?
    function(n, len){
      var nr = (n+Nrender)%Nrender;
      _gradLEN[nr] = len;
    }:
    function(n, len){
      var nr = (n+Nrender)%Nrender;
      var len0 = _gradLEN[nr];
      var len1 = (isNaN(len0))? len: Math[sw](len0, len);  // 1.11.6
      _gradLEN[nr] = len1;
    };
  for(var i=0, len=arr_vec.length; i<len-1; ++i){
    var veci0 = arr_vec[i];
    var veci1 = arr_vec[i+1] || veci0;
    var dvec10 = {x: veci1.x-veci0.x, y: veci1.y-veci0.y};
    var dx0 = veci0.x-x0;
    var dy0 = veci0.y-y0;
    var dx1 = veci1.x-x0;
    var dy1 = veci1.y-y0;
    var t0 = Math.atan2(dy0, dx0);
    var t1 = Math.atan2(dy1, dx1);
    var n0 = Math.round(t0*rdt);
    var n1 = Math.round(t1*rdt);
    var dn = n1-n0;
    var dn0 = (n1+Nrender)-n0;
    var dn1 = n1-(n0+Nrender);
    var adn = Math.abs(dn);
    if(adn > Math.abs(dn0)){
      dn = dn0;
    }
    else if(adn > Math.abs(dn1)){
      dn = dn1;
    }
    var len0 = Math.sqrt(dx0*dx0+dy0*dy0);
    var len1 = Math.sqrt(dx1*dx1+dy1*dy1);
    var get_len = (isRound)?
      function(n){
        var k = (n-n0)/(dn || 1);
        return len0+(len1-len0)*k;
      }:
      function(n){
        var k = (n-n0)/(dn || 1);
        var dxn = dx0+dvec10.x*k;
        var dyn = dy0+dvec10.y*k;
        return Math.sqrt(dxn*dxn+dyn*dyn);
      };
    if(dn < 0){
      for(var n=n0; n>=n0+dn; --n){
        callback(n, get_len(n));
      }
    }
    else{
      for(var n=n0; n<=n0+dn; ++n){
        callback(n, get_len(n));
      }
    }
  }
  return _gradLEN;
};
/* 1.11.6 */
My_entry.draw_canvas.prototype.make_blurRAD = function(arr_vec, vec0, isMin, isRound, Nrender){
  var self = this;
  var _blurRAD = [];
  var gradLEN = [];
  var pi2 = Math.PI*2;
  var rdt = Nrender/pi2;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var sw = (isMin)? "min": "max";
  var callback = (isMin < 0)?
    function(n, len, phi){
      var nr = (n+Nrender)%Nrender;
      gradLEN[nr] = len;
      _blurRAD[nr] = phi;
    }:
    function(n, len, phi){
      var nr = (n+Nrender)%Nrender;
      var phi0 = _blurRAD[nr];
      var len0 = gradLEN[nr];
      var len1 = (isNaN(len0))? len: Math[sw](len0, len);
      gradLEN[nr] = len1;
      _blurRAD[nr] = (isNaN(phi0) || len1 === len)? phi: phi0;
    };
  for(var i=0, len=arr_vec.length; i<len-1; ++i){
    var veci0 = arr_vec[i];
    var veci1 = arr_vec[i+1] || veci0;
    var dvec10 = {x: veci1.x-veci0.x, y: veci1.y-veci0.y};
    var dx0 = veci0.x-x0;
    var dy0 = veci0.y-y0;
    var dx1 = veci1.x-x0;
    var dy1 = veci1.y-y0;
    var t0 = Math.atan2(dy0, dx0);
    var t1 = Math.atan2(dy1, dx1);
    var n0 = Math.round(t0*rdt);
    var n1 = Math.round(t1*rdt);
    var dn = n1-n0;
    var dn0 = (n1+Nrender)-n0;
    var dn1 = n1-(n0+Nrender);
    var adn = Math.abs(dn);
    if(adn > Math.abs(dn0)){
      dn = dn0;
    }
    else if(adn > Math.abs(dn1)){
      dn = dn1;
    }
    var len0 = Math.sqrt(dx0*dx0+dy0*dy0);
    var len1 = Math.sqrt(dx1*dx1+dy1*dy1);
    var get_len = (isRound)?
      function(n){
        var k = (n-n0)/(dn || 1);
        return len0+(len1-len0)*k;
      }:
      function(n){
        var k = (n-n0)/(dn || 1);
        var dxn = dx0+dvec10.x*k;
        var dyn = dy0+dvec10.y*k;
        return Math.sqrt(dxn*dxn+dyn*dyn);
      };
    var phi = Math.atan2(dvec10.y, dvec10.x);
    if(dn < 0){
      for(var n=n0; n>=n0+dn; --n){
        callback(n, get_len(n), phi);
      }
    }
    else{
      for(var n=n0; n<=n0+dn; ++n){
        callback(n, get_len(n), phi);
      }
    }
  }
  return _blurRAD;
};
My_entry.draw_canvas.prototype.make_krandR = function(krandR0, Ncycle){
  var self = this;
  var _krandR = [];
  for(var n=0; n<Ncycle; ++n){
    var krandR = krandR0*(Math.random()-0.5);  // krandR0 first
    _krandR[n] = 1+krandR;  // [0.5,1.5)
  }
  return _krandR;
};
My_entry.draw_canvas.prototype.make_sum_krandR = function(krandR){
  var self = this;
  var _sum_krandR = [0];
  for(var n=1, len_n=krandR.length; n<=len_n; ++n){
    _sum_krandR[n] = krandR[n-1]+_sum_krandR[n-1];
  }
  return _sum_krandR;
};
My_entry.draw_canvas.prototype.get_cycle = function(sum_krandR, LEN, len){
  var self = this;
  var _cycle = 0;
  for(var n=sum_krandR.length-1; n>=0; --n){
    if(sum_krandR[n]*LEN < len){
      _cycle = n;
      break;
    }
  }
  return _cycle;
};
My_entry.draw_canvas.prototype.gradation = function(colors, arr_vec, opt_globalCompositeOperation, vec0, offsetR, orderR, NrandR, NrandT, isMin, isRound, Nrender, Ncycle){
  var self = this;
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  var _ID = ctx.getImageData(0, 0, px_w, px_h);
  var data = _ID.data;
  var pi2 = Math.PI*2;
  var rdt = Nrender/pi2;
  var x0 = vec0.x;
  var y0 = vec0.y;
  /* 1.12.6 -> */
  var krandR0 = NrandR/255;
  var krandT0 = NrandT/255;
  var Ncolor = colors.length;
  var arr_rgba = self.colors2arr_rgba(colors);  // Ver.2.744.110
if(Ncycle){
  var gradLEN = self.make_gradLEN(arr_vec, vec0, isMin, isRound, Nrender);
  var krandR = self.make_krandR(krandR0, Ncycle);
  var sum_krandR = self.make_sum_krandR(krandR);
  var Ncycle_krandR = sum_krandR[sum_krandR.length-1];
  for(var yp=0; yp<px_h; ++yp){
    for(var xp=0; xp<px_w; ++xp){
      var dx = xp+0.5-x0;
      var dy = yp+0.5-y0;
      var t = Math.atan2(dy, dx);  // (-pi,pi]
      var n = Math.round(t*rdt);
      var nr = (n+Nrender)%Nrender;  // 1.11.6
      var LEN0 = gradLEN[nr];
      if(LEN0){
        var krandT = krandT0*(Math.random()-0.5);  // krandT0 first
        var len0 = Math.sqrt(dx*dx+dy*dy);
        var len = len0+krandT*LEN0;
        if(len < LEN0*Ncycle_krandR){
          var cycle = self.get_cycle(sum_krandR, LEN0, len);
          var LEN = LEN0*krandR[cycle];
          var LEN_filter = LEN*offsetR;
          var deno = LEN-LEN_filter;
          var nume = len-LEN0*sum_krandR[cycle]-LEN_filter;
          if(nume > 0){
            var isBound = (orderR && (offsetR || cycle+1 === Ncycle));
            var N = (isBound)? Ncolor-1: Ncolor;
            var dLEN = deno/N;
            var ic = Math.floor(nume/dLEN);
            var rgba0 = arr_rgba[ic];
            var rgba1 = arr_rgba[ic+1] || arr_rgba[0];  // cyclic boundary condition
            if(rgba0 && rgba1){
              var k = (orderR)? Math.pow((nume%dLEN)/dLEN, orderR): 0;
              var ired = 4*(px_w*yp+xp);
              data[ired+0] = rgba0.r+(rgba1.r-rgba0.r)*k;
              data[ired+1] = rgba0.g+(rgba1.g-rgba0.g)*k;
              data[ired+2] = rgba0.b+(rgba1.b-rgba0.b)*k;
              data[ired+3] = rgba0.a+(rgba1.a-rgba0.a)*k;
            }
            else{
              break;
            }
          }
        }
      }
    }
  }
}
else{
  var data_isOver = ctx.createImageData(px_w, px_h).data;
  var krandR = self.make_krandR(krandR0, Ncolor);
  var sum_krandR = self.make_sum_krandR(krandR);
  var Ncolor_krandR = ((orderR && offsetR)? sum_krandR[sum_krandR.length-2]: null) || sum_krandR[sum_krandR.length-1];
  var n0 = Nrender*offsetR;
  var kn0 = n0/Nrender;
  for(var i=0, len=arr_vec.length; i<len; ++i){
    var arr_veci = arr_vec[i];
    var xb = arr_veci.x-x0;
    var yb = arr_veci.y-y0;
    for(var n=n0; n<Nrender; ++n){
      var kn = n/Nrender;
      var rad = kn*pi2;
      var xa = +Math.cos(rad)*xb+Math.sin(rad)*yb;
      var ya = -Math.sin(rad)*xb+Math.cos(rad)*yb;
      var xp = Math.floor(x0+xa);
      var yp = Math.floor(y0+ya);
      if(xp >= 0 && xp < px_w && yp >= 0 && yp < px_h){
        var krandT = krandT0*(Math.random()-0.5);  // krandT0 first
        var deno = (1-offsetR || 1);
        var nume = kn-kn0+krandT/Ncolor;
        var icn = nume/deno;
        icn = (offsetR)? Math.min(Math.max(icn, 0), 1): (icn+1)%1;
        icn *= Ncolor_krandR;
        var ic = self.get_cycle(sum_krandR, 1, icn);
        var rgba0 = arr_rgba[ic];
        var rgba1 = arr_rgba[ic+1];
        if(offsetR){
          rgba0 = rgba0 || arr_rgba[0];
          rgba1 = rgba1 || arr_rgba[Ncolor-1];
        }
        else{
          rgba1 = rgba1 || arr_rgba[0];
        }
        var ired = 4*(px_w*yp+xp);
        var isOver = (isMin)? data_isOver[ired+0]: false;
        if(rgba0 && rgba1 && !(isOver)){
          var k = (orderR)? Math.pow((icn-ic)/(krandR[ic] || krandR[0]), orderR): 0;
          data[ired+0] = rgba0.r+(rgba1.r-rgba0.r)*k;
          data[ired+1] = rgba0.g+(rgba1.g-rgba0.g)*k;
          data[ired+2] = rgba0.b+(rgba1.b-rgba0.b)*k;
          data[ired+3] = rgba0.a+(rgba1.a-rgba0.a)*k;
          data_isOver[ired+0] = 1;
        }
      }
    }
  }
}
  /* -> 1.12.6 */
  return _ID;
};
/* -> 1.0.0 */
/* 1.11.6 */
/* 1.2.3 */
My_entry.draw_canvas.prototype.blur = function(arr_s, arr_vec, opt_globalCompositeOperation, vec0, offsetR, orderR, NrandR, NrandT, isMin, isRound, Nrender, Ncycle, isCyclic, isSquare, x_asym, y_asym, k_asym, Nrad_asym){
  var self = this;
  var filter = new My_entry.filter();
  var ctx = self.ctx;
  var px_w = ctx.canvas.width;
  var px_h = ctx.canvas.height;
  var _ID = ctx.getImageData(0, 0, px_w, px_h);
  var data = _ID.data;
  var ID0 = ctx.getImageData(0, 0, px_w, px_h);
  var data0 = ID0.data;
  var pi2 = Math.PI*2;
  /* 1.11.6 -> */
  var hasAsym = (x_asym || y_asym || k_asym || Nrad_asym);
  /* limiter -> */
  var Nrender = (hasAsym)? Math.min(Nrender, 2560): Nrender;
  /* -> limiter */
  var rdt = Nrender/pi2;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var krandR0 = NrandR/255;
  var krandT0 = NrandT/255;
  var Ns = arr_s.length;
  var make_arr_w = null;
  var get_arr_w2d = null;
  var arr_w3d = [];
  var arr_w2d = [];
  if(hasAsym){
    var rad_asym = (Nrad_asym)? Math.PI/Nrad_asym: 0;
    var blurRAD = self.make_blurRAD(arr_vec, vec0, isMin, isRound, Nrender);
    make_arr_w = function(sk, rad0){
      var _arr_w = [];
      var rad = rad0+rad_asym;
      var len = filter.get_len(sk);
      var di = 2*sk+1;
      for(var i=0; i<len; ++i){
        var jj = Math.floor(i/di);
        var ii = i%di;
        var xb = ii-sk-x_asym;
        var yb = jj-sk-y_asym;
        var xa = +Math.cos(rad)*xb+Math.sin(rad)*yb;
        var ya = -Math.sin(rad)*xb+Math.cos(rad)*yb;
        ya *= k_asym;
        var x2 = xa*xa;
        var y2 = ya*ya;
        var s2 = sk*sk;
        var isOutOfArea = (isSquare)? (x2 > s2 || y2 > s2): (x2+y2 > s2);
        var w = (isOutOfArea)? 0: 1;
        _arr_w[i] = w;
      }
      return _arr_w;
    };
    for(var nr=0, len_nr=blurRAD.length; nr<len_nr; ++nr){
      var arr_w2d = [];
      for(var s=0, len_s=21; s<len_s; ++s){
        var rad0 = blurRAD[nr] || 0;
        arr_w2d[s] = make_arr_w(s, rad0);
      }
      arr_w3d[nr] = arr_w2d;
    }
    get_arr_w2d = function(nr){
      return arr_w3d[nr];
    };
  }
  else{
    make_arr_w = function(sk, dummy_rad0){
      var _arr_w = [];
      var len = filter.get_len(sk);
      var di = 2*sk+1;
      for(var i=0; i<len; ++i){
        var jj = Math.floor(i/di);
        var ii = i%di;
        var xa = ii-sk;
        var ya = jj-sk;
        var x2 = xa*xa;
        var y2 = ya*ya;
        var s2 = sk*sk;
        var isOutOfArea = (isSquare)? 0: (x2+y2 > s2);
        var w = (isOutOfArea)? 0: 1;
        _arr_w[i] = w;
      }
      return _arr_w;
    };
    for(var s=0, len_s=21; s<len_s; ++s){
      arr_w2d[s] = make_arr_w(s, 0);
    }
    get_arr_w2d = function(nr){
      return arr_w2d;
    };
  }
  /* -> 1.11.6 */
  /* 1.12.6 -> */
if(Ncycle){
  var gradLEN = self.make_gradLEN(arr_vec, vec0, isMin, isRound, Nrender);
  var krandR = self.make_krandR(krandR0, Ncycle);
  var sum_krandR = self.make_sum_krandR(krandR);
  var Ncycle_krandR = sum_krandR[sum_krandR.length-1];
  for(var yp=0; yp<px_h; ++yp){
    for(var xp=0; xp<px_w; ++xp){
      var dx = xp+0.5-x0;
      var dy = yp+0.5-y0;
      var t = Math.atan2(dy, dx);  // (-pi,pi]
      var n = Math.round(t*rdt);
      /* 1.11.6 -> */
      var nr = (n+Nrender)%Nrender;
      var arr_w2d = get_arr_w2d(nr);
      var LEN0 = gradLEN[nr];
      /* -> 1.11.6 */
      if(LEN0){
        var len0 = Math.sqrt(dx*dx+dy*dy);
        var len = len0+LEN0*(Math.random()-0.5)*krandT0;
        if(len < LEN0*Ncycle_krandR){
          var cycle = self.get_cycle(sum_krandR, LEN0, len);
          var LEN = LEN0*krandR[cycle];
          var LEN_filter = LEN*offsetR;
          var deno = LEN-LEN_filter;
          var nume = len-LEN0*sum_krandR[cycle]-LEN_filter;
          if(nume > 0){
            var isBound = (isCyclic && orderR && (offsetR || cycle+1 === Ncycle));
            var N = (!(isCyclic) || isBound)? Ns-1: Ns;
            var dLEN = deno/N;
            var ic = Math.floor(nume/dLEN);
            var s0 = arr_s[ic];
            var s1 = arr_s[ic+1];
            /* 1.2.4 -> */
            if(isNaN(s1)){
              s1 = arr_s[0];  // cyclic boundary condition
            }
            /* -> 1.2.4 */
            if(!(isCyclic) && cycle > 0){
              s0 = arr_s[Ns-1];
              s1 = s0;
            }
            if(s0 >= 0 && s1 >= 0){
              var k = (orderR)? Math.pow((nume%dLEN)/dLEN, orderR): 0;
              var sk = Math.floor(s0+(s1-s0)*k);
              var ired = 4*(px_w*yp+xp);
              for(var n=0; n<4; ++n){
                /* 1.11.6 -> */
                var arr_w = arr_w2d[sk] || make_arr_w(sk, 0);
                data[ired+n] = filter.composite(arr_w, data0, px_w, px_h, sk, sk, 0+xp, 0+yp, n);  // 1.5.5
                /* -> 1.11.6 */
              }
            }
            else{
              break;
            }
          }
        }
      }
    }
  }
}
else{
  var data_isOver = ctx.createImageData(px_w, px_h).data;
  var krandR = self.make_krandR(krandR0, Ns);
  var sum_krandR = self.make_sum_krandR(krandR);
  var Ns_krandR = ((orderR && offsetR)? sum_krandR[sum_krandR.length-2]: null) || sum_krandR[sum_krandR.length-1];
  var n0 = Nrender*offsetR;
  var kn0 = n0/Nrender;
  for(var i=0, len=arr_vec.length; i<len; ++i){
    var arr_veci = arr_vec[i];
    var xb = arr_veci.x-x0;
    var yb = arr_veci.y-y0;
    for(var n=n0; n<Nrender; ++n){
      var kn = n/Nrender;
      var rad = kn*pi2;
      var xa = +Math.cos(rad)*xb+Math.sin(rad)*yb;
      var ya = -Math.sin(rad)*xb+Math.cos(rad)*yb;
      var xp = Math.floor(x0+xa);
      var yp = Math.floor(y0+ya);
      if(xp >= 0 && xp < px_w && yp >= 0 && yp < px_h){
        var krandT = krandT0*(Math.random()-0.5);  // krandT0 first
        var deno = (1-offsetR || 1);
        var nume = kn-kn0+krandT/Ns;
        var icn = nume/deno;
        icn = (offsetR)? Math.min(Math.max(icn, 0), 1): (icn+1)%1;
        icn *= Ns_krandR;
        var ic = self.get_cycle(sum_krandR, 1, icn);
        var s0 = arr_s[ic];
        var s1 = arr_s[ic+1];
        if(offsetR){
          if(isNaN(s0)){
            s0 = arr_s[0];
          }
          if(isNaN(s1)){
            s1 = arr_s[Ns-1];
          }
        }
        else{
          if(isNaN(s1)){
            s1 = (isCyclic)? arr_s[0]: arr_s[Ns-1];
          }
        }
        if(s0 >= 0 && s1 >= 0){
          var k = (orderR)? Math.pow((icn-ic)/(krandR[ic] || krandR[0]), orderR): 0;
          var sk = Math.floor(s0+(s1-s0)*k);
          var ired = 4*(px_w*yp+xp);
          var isOver0 = data_isOver[ired+0];
          var isOver1 = data_isOver[ired+1];
          var isOver = (isMin)? isOver0: (isOver0 && sk === isOver1);
          if(!(isOver)){
            for(var nn=0; nn<4; ++nn){  // nn
              var arr_w = arr_w2d[sk] || make_arr_w(sk, 0);
              data[ired+nn] = filter.composite(arr_w, data0, px_w, px_h, sk, sk, 0+xp, 0+yp, nn);
            }
            data_isOver[ired+0] = 1;
            data_isOver[ired+1] = sk;  // 0<=sk<=20
          }
        }
      }
    }
  }
}
  /* -> 1.12.6 */
  return _ID;
};
/* 0.5.0 -> */
My_entry.draw_canvas.prototype.text = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  var x = self.floor(vec0.x);
  var y = self.floor(vec0.y);
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.label = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var w = ctx.measureText(text).width;
  var h = fontSize;
  var t = (isY)? -Math.PI/2: 0;
  ctx.setTransform(Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), x0, y0);
  var x = self.floor(-w/2);
  var y = (isY)? self.floor(h): 0;
  ctx.fillText(text, x, y);
  ctx.strokeText(text, x, y);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.axis = function(text, vec0, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation, isY){
  var self = this;
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  var w = ctx.measureText(text).width;
  var h = fontSize;
  var w2 = (isY)? -w-h: -w/2;
  var h2 = (isY)? h/2: h*2;
  var x = vec0.x+w2;
  var y = vec0.y+h2;
  ctx.restore();
  self.text(text, {x: x, y: y}, opt_fontSize, opt_styleRGBA, opt_globalCompositeOperation);
  return self;
};
/* -> 0.5.0 */
/* 0.6.0 -> */
My_entry.draw_canvas.prototype.textbox = function(text, vec0, vec1, opt_fontSize, opt_styleRGBA_bg, opt_styleRGBA_fg, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var fontSize = self.floor(opt_fontSize || 0);
  var fontFamily = self.fontFamily;
  ctx.save();
  ctx.font = fontSize+"px "+fontFamily;
  var w = ctx.measureText(text).width;
  var dw = fontSize;
  var h = fontSize;
  var hr2 = h/2;
  ctx.restore();
  self.fill({x: vec0.x, y: vec0.y-hr2}, {x: vec1.x+w+dw, y: vec1.y+hr2}, opt_styleRGBA_bg, opt_globalCompositeOperation);
  self.text(text, {x: vec1.x+dw, y: vec1.y+hr2}, opt_fontSize, opt_styleRGBA_fg, opt_globalCompositeOperation);
  return self;
};
My_entry.draw_canvas.prototype.fill = function(vec0, vec1, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var x1 = self.floor(vec1.x);
  var y1 = self.floor(vec1.y);
  ctx.save();
  ctx.fillStyle = ctx.strokeStyle = self.color2style(opt_styleRGBA);
  ctx.globalCompositeOperation = opt_globalCompositeOperation || ctx.globalCompositeOperation;
  ctx.fillRect(x0, y0, x1-x0, y1-y0);
  ctx.restore();
  return self;
};
/* -> 0.6.0 */
My_entry.draw_canvas.prototype.circle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = self.floor(vec0.x);
  var y0 = self.floor(vec0.y);
  var r0 = self.floor(r);
  ctx.save();
  ctx.beginPath();
  ctx.arc(x0, y0, r0, 0, Math.PI*2);
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.triangle = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, opt_flagFlipY){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var k1 = 1.2091995761561452;  // Math.PI*Math.sqrt(4/27)
  var k2 = 0.5773502691896258;  // 1/Math.sqrt(3)
  var k3 = 1.1547005383792515;  // Math.sqrt(4/3)
  var dx = r*k1;
  var dy = dx*k2;
  var dy2 = dx*k3;
  ctx.save();
  ctx.beginPath();
  if(opt_flagFlipY){
    dy = -dy;
    dy2 = -dy2;
  }
  ctx.moveTo(self.floor(x0), self.floor(y0-dy2));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.triangle2 = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  self.triangle(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation, true);
  return self;
};
My_entry.draw_canvas.prototype.square = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(self.floor(x0-dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.diamond = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  var rad = Math.PI/4;
  var vec = self.rotate2d_vec({x: -dx, y: -dy}, rad);
  ctx.moveTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: +dx, y: -dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: +dx, y: +dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  var vec = self.rotate2d_vec({x: -dx, y: +dy}, rad);
  ctx.lineTo(self.floor(x0+vec.x), self.floor(y0+vec.y));
  ctx.closePath();
  self.enter(r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
My_entry.draw_canvas.prototype.cross = function(vec0, r, opt_lineWidth, opt_styleRGBA, opt_globalCompositeOperation){
  var self = this;
  var ctx = self.ctx;
  var x0 = vec0.x;
  var y0 = vec0.y;
  var dx = r*Math.sqrt(Math.PI)/2;
  var dy = dx;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(self.floor(x0-dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0+dx), self.floor(y0+dy));
  ctx.moveTo(self.floor(x0+dx), self.floor(y0-dy));
  ctx.lineTo(self.floor(x0-dx), self.floor(y0+dy));
  var lineWidth = opt_lineWidth || r/3+1;
  self.enter(r, lineWidth, opt_styleRGBA, opt_globalCompositeOperation);
  ctx.restore();
  return self;
};
