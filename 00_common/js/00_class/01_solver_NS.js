// online-simulator.github.io

My_entry.solver_NS = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.solver_NS.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["def", "solver_real"]);
  return self;
};
My_entry.solver_NS.prototype.FS2d = function(options, uvp){
  var self = this;
  var solver = self.entry.solver_real;
  var dt = options.dt || 1;
  var Re = options.Re || 1;
  var Nnt = options.Nnt || 1;
  var dth = dt/2;
  var rdt = 1/dt;
  var u = uvp.u;
  var v = uvp.v;
  var ud = uvp.ud;
  var vd = uvp.vd;
  var p = uvp.p;
  var p0 = uvp.p0;
  var id = uvp.id;
  var hasP0 = uvp.hasP0;
  var i_unknowns = uvp.i_unknowns;
  var j_unknowns = uvp.j_unknowns;
  var i_p0 = i_unknowns[i_unknowns.length-1];
  var j_p0 = j_unknowns[j_unknowns.length-1];
  var Ni = uvp.Ni;
  var Nj = uvp.Nj;
  var len0 = uvp.len0;
  var len1 = len0*2;
  var len2 = len0*3;
  var dx = uvp.dx;
  var dy = uvp.dy;
  var dx2 = dx*2;
  var dy2 = dy*2;
  var dx12 = dx*12;
  var dy12 = dy*12;
  var dxp2 = dx*dx;
  var dyp2 = dy*dy;
  var rdx2 = 1/dx2;
  var rdy2 = 1/dy2;
  var rdx12 = 1/dx12;
  var rdy12 = 1/dy12;
  var rdxp2 = 1/dxp2;
  var rdyp2 = 1/dyp2;
  var r12dxp2 = 1/(dxp2*12);
  var r12dyp2 = 1/(dyp2*12);
  var m2rdxyp2 = -2*(1/dxp2+1/dyp2);
  var uimm = 0;
  var uim = 0;
  var uij = 0;
  var uip = 0;
  var uipp = 0;
  var ujmm = 0;
  var ujm = 0;
  var ujp = 0;
  var ujpp = 0;
  var vimm = 0;
  var vim = 0;
  var vij = 0;
  var vip = 0;
  var vipp = 0;
  var vjmm = 0;
  var vjm = 0;
  var vjp = 0;
  var vjpp = 0;
  var pimm = 0;
  var pim = 0;
  var pij = 0;
  var pip = 0;
  var pipp = 0;
  var pjmm = 0;
  var pjm = 0;
  var pjp = 0;
  var pjpp = 0;
  var nimm = 0;
  var nim = 0;
  var nij = 0;
  var nip = 0;
  var nipp = 0;
  var njmm = 0;
  var njm = 0;
  var njp = 0;
  var njpp = 0;
  var apim = 0;
  var apij = 0;
  var apip = 0;
  var apjm = 0;
  var apjp = 0;
  var auim = 0;
  var auij = 0;
  var auip = 0;
  var avjm = 0;
  var avij = 0;
  var avjp = 0;
  var update_uv = (options.order_upstream === 1)?
    function(i, j){
      var uij = u0[i][j];
      var vij = v0[i][j];
      if(i === 0){
        uim = uij;
        vim = vij;
      }
      else{
        uim = u0[i-1][j];
        vim = v0[i-1][j];
      }
      if(i === Ni-1){
        uip = uij;
        vip = vij;
      }
      else{
        uip = u0[i+1][j];
        vip = v0[i+1][j];
      }
      if(j === 0){
        ujm = uij;
        vjm = vij;
      }
      else{
        ujm = u0[i][j-1];
        vjm = v0[i][j-1];
      }
      if(j === Nj-1){
        ujp = uij;
        vjp = vij;
      }
      else{
        ujp = u0[i][j+1];
        vjp = v0[i][j+1];
      }
      var auij = Math.abs(uij);
      var avij = Math.abs(vij);
      var dudx = (-uim+uip)*rdx2;
      var dvdy = (-vjm+vjp)*rdy2;
      var cont = dudx+dvdy;
      var convx = uij*dudx+vij*(-ujm+ujp)*rdy2;
      var convy = uij*(-vim+vip)*rdx2+vij*dvdy;
      convx -= auij*(uim-2*uij+uip)*rdx2+avij*(ujm-2*uij+ujp)*rdy2;  // Order1
      convy -= auij*(vim-2*vij+vip)*rdx2+avij*(vjm-2*vij+vjp)*rdy2;  // Order1
      var diffx = (uim-2*uij+uip)*rdxp2+(ujm-2*uij+ujp)*rdyp2;  // Order2
      var diffy = (vim-2*vij+vip)*rdxp2+(vjm-2*vij+vjp)*rdyp2;  // Order2
      var dudt1 = -convx+diffx/Re;
      var dvdt1 = -convy+diffy/Re;
      var dudt0 = ud[i][j];
      var dvdt0 = vd[i][j];
      u[i][j] = uij+(3*dudt1-dudt0)*dth;  // Order2
      v[i][j] = vij+(3*dvdt1-dvdt0)*dth;  // Order2
      ud[i][j] = dudt1;
      vd[i][j] = dvdt1;
      c.push(Math.abs(cont));
    }:
    function(i, j){
      var uij = u0[i][j];
      var vij = v0[i][j];
      if(i === 0){
        uimm = uim = uij;
        vimm = vim = vij;
      }
      else if(i === 1 || id[i-1][j] === 0){
        uimm = uim = u0[i-1][j];
        vimm = vim = v0[i-1][j];
      }
      else{
        uimm = u0[i-2][j];
        vimm = v0[i-2][j];
        uim = u0[i-1][j];
        vim = v0[i-1][j];
      }
      if(i === Ni-1){
        uipp = uip = uij;
        vipp = vip = vij;
      }
      else if(i === Ni-2 || id[i+1][j] === 0){
        uipp = uip = u0[i+1][j];
        vipp = vip = v0[i+1][j];
      }
      else{
        uipp = u0[i+2][j];
        vipp = v0[i+2][j];
        uip = u0[i+1][j];
        vip = v0[i+1][j];
      }
      if(j === 0){
        ujmm = ujm = uij;
        vjmm = vjm = vij;
      }
      else if(j === 1 || id[i][j-1] === 0){
        ujmm = ujm = u0[i][j-1];
        vjmm = vjm = v0[i][j-1];
      }
      else{
        ujmm = u0[i][j-2];
        vjmm = v0[i][j-2];
        ujm = u0[i][j-1];
        vjm = v0[i][j-1];
      }
      if(j === Nj-1){
        ujpp = ujp = uij;
        vjpp = vjp = vij;
      }
      else if(j === Nj-2 || id[i][j+1] === 0){
        ujpp = ujp = u0[i][j+1];
        vjpp = vjp = v0[i][j+1];
      }
      else{
        ujpp = u0[i][j+2];
        vjpp = v0[i][j+2];
        ujp = u0[i][j+1];
        vjp = v0[i][j+1];
      }
      var auij = Math.abs(uij);
      var avij = Math.abs(vij);
      var dudx = (-uim+uip)*rdx2;
      var dvdy = (-vjm+vjp)*rdy2;
      var cont = dudx+dvdy;
      var convx = uij*(uimm-8*(uim-uip)-uipp)*rdx12+vij*(ujmm-8*(ujm-ujp)-ujpp)*rdy12;
      var convy = uij*(vimm-8*(vim-vip)-vipp)*rdx12+vij*(vjmm-8*(vjm-vjp)-vjpp)*rdy12;
      convx += auij*(uimm-4*(uim+uip)+6*uij+uipp)*rdx12+avij*(ujmm-4*(ujm+ujp)+6*uij+ujpp)*rdy12;  // Order3
      convy += auij*(vimm-4*(vim+vip)+6*vij+vipp)*rdx12+avij*(vjmm-4*(vjm+vjp)+6*vij+vjpp)*rdy12;  // Order3
      var diffx = (-(uimm+uipp)+16*(uim+uip)-30*uij)*r12dxp2+(-(ujmm+ujpp)+16*(ujm+ujp)-30*uij)*r12dyp2;  // Order4
      var diffy = (-(vimm+vipp)+16*(vim+vip)-30*vij)*r12dxp2+(-(vjmm+vjpp)+16*(vjm+vjp)-30*vij)*r12dyp2;  // Order4
      var dudt1 = -convx+diffx/Re;
      var dvdt1 = -convy+diffy/Re;
      var dudt0 = ud[i][j];
      var dvdt0 = vd[i][j];
      u[i][j] = uij+(3*dudt1-dudt0)*dth;  // Order2
      v[i][j] = vij+(3*dvdt1-dvdt0)*dth;  // Order2
      ud[i][j] = dudt1;
      vd[i][j] = dvdt1;
      c.push(Math.abs(cont));
    };
  var fix_p0 = (hasP0)?
    function(i, j){
      return p0[i][j];
    }:
    function(i, j){
      return (i === i_p0 && j === j_p0);
    };
  var set_coo = function(i, j){
    var uij = u[i][j];
    var vij = v[i][j];
    var pij = p[i][j];
    var nij = id[i][j];
    var m = (mA[mA.length-1] || 0)+1;
    var isP0 = fix_p0(i, j);
    auim = -rdx2;
    auij = 0;
    auip = rdx2;
    avjm = -rdy2;
    avij = 0;
    avjp = rdy2;
    if(isP0){
      apij = 1;
      apim = apip = apjm = apjp = 0;
    }
    else{
      apim = rdxp2;
      apij = m2rdxyp2;
      apip = rdxp2;
      apjm = rdyp2;
      apjp = rdyp2;
    }
    var aAij = [rdt, rdt];
    var mAij = [m, m+1];
    var nAij = [nij, nij+len0];
    if(i === 0){
      uim = uij;
      vim = vij;
      auij += auim;
      apij += apim;
    }
    else if(id[i-1][j] === 0){
      uim = u[i-1][j];
      vim = v[i-1][j];
      auij += auim;
      apij += apim;
    }
    else{
      uim = u[i-1][j];
      vim = v[i-1][j];
      nim = id[i-1][j];
      aAij.push(auim, apim);
      mAij.push(m, m+2);
      nAij.push(nim+len1, nim+len1);
    }
    if(i === Ni-1){
      uip = uij;
      vip = vij;
      auij += auip;
      apij += apip;
    }
    else if(id[i+1][j] === 0){
      uip = u[i+1][j];
      vip = v[i+1][j];
      auij += auip;
      apij += apip;
    }
    else{
      uip = u[i+1][j];
      vip = v[i+1][j];
      nip = id[i+1][j];
      aAij.push(auip, apip);
      mAij.push(m, m+2);
      nAij.push(nip+len1, nip+len1);
    }
    if(j === 0){
      ujm = uij;
      vjm = vij;
      avij += avjm;
      apij += apjm;
    }
    else if(id[i][j-1] === 0){
      ujm = u[i][j-1];
      vjm = v[i][j-1];
      avij += avjm;
      apij += apjm;
    }
    else{
      ujm = u[i][j-1];
      vjm = v[i][j-1];
      njm = id[i][j-1];
      aAij.push(avjm, apjm);
      mAij.push(m+1, m+2);
      nAij.push(njm+len1, njm+len1);
    }
    if(j === Nj-1){
      ujp = uij;
      vjp = vij;
      avij += avjp;
      apij += apjp;
    }
    else if(id[i][j+1] === 0){
      ujp = u[i][j+1];
      vjp = v[i][j+1];
      avij += avjp;
      apij += apjp;
    }
    else{
      ujp = u[i][j+1];
      vjp = v[i][j+1];
      njp = id[i][j+1];
      aAij.push(avjp, apjp);
      mAij.push(m+1, m+2);
      nAij.push(njp+len1, njp+len1);
    }
    var dudx = (-uim+uip)*rdx2;
    var dvdy = (-vjm+vjp)*rdy2;
    var cont = (isP0)? 0: dudx+dvdy;
    b.push(uij*rdt, vij*rdt, cont*rdt);
    aAij.push(auij, avij, apij);
    mAij.push(m, m+1, m+2);
    nAij.push(nij+len1, nij+len1, nij+len1);
    aA.push.apply(aA, aAij);
    mA.push.apply(mA, mAij);
    nA.push.apply(nA, nAij);
  };
  var c = [];
  var b = [];
  var aA = [];
  var mA = [];
  var nA = [];
  var x = [];
  for(var nt=0; nt<Nnt; ++nt){
    var u0 = self.entry.def.newClone(u);
    var v0 = self.entry.def.newClone(v);
    c.length = 0;
    for(var nu=0; nu<len0; ++nu){
      var i = i_unknowns[nu];
      var j = j_unknowns[nu];
      update_uv(i, j);
    }
    b.length = aA.length = mA.length = nA.length = 0;
    for(var nu=0; nu<len0; ++nu){
      var i = i_unknowns[nu];
      var j = j_unknowns[nu];
      set_coo(i, j);
    }
    x.length = 0;
    solver.gaussian_coo(options, {b: b, aA: aA, mA: mA, nA: nA, x: x});
    for(var nu=0; nu<len0; ++nu){
      var i = i_unknowns[nu];
      var j = j_unknowns[nu];
      var iu = id[i][j]-1;
      u[i][j] = x[iu];
      v[i][j] = x[iu+len0];
      p[i][j] = x[iu+len1];
    }
    uvp.t += dt;
    uvp.cmax = Math.max.apply(Math, c);
    if(isNaN(uvp.cmax)) break;
  }
  return self;
};
