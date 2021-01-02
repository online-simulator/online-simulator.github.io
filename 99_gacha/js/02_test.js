"use strict";

const My_test = new My_gacha();

My_gacha.prototype.test = function(){
  var self = this;
  var str_table = "[N0,N1,N2,N3,N4,N5,N6,N7,N8,N9,N10,N11,N12,R0,R1,R2,R3,SR0,SR1,SSR0]";
  var arr_table = ['N0','N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','R0','R1','R2','R3','SR0','SR1','SSR0'];
  self.init(arr_table || str_table).nroll_table(10, function(data){
    console.log(data.item);
  }, 1000);
  self.init(arr_table || str_table, 10).nroll_box(100, function(data){
    console.log(data.item);
  }, 100);
  return self;
};
My_gacha.prototype.make_table_id = function(){
  var self = this;
  var _str_table = "";
  var len_table = 1;
  var arr_rarity = ["N", "R", "SR", "SSR"];
  var rarity_normal = arr_rarity[0];
  var list = {};
  var prob_N = 100;
  var arr_item = [];
  arr_rarity.forEach(function(rarity){
    list[rarity] = {
      num: 0,
      prob: 0,
      ep: 0,
      en: 0
    };
    list[rarity].num = My$selectNum_id("select-n"+rarity);
    if(rarity !== rarity_normal){
      list[rarity].prob = My$selectNum_id("select-p"+rarity);
    }
    prob_N -= list[rarity].prob;
  });
  list[rarity_normal].prob = prob_N;
  My$_id("input-p"+rarity_normal).value = prob_N;
  arr_rarity.forEach(function(rarity){
    My$_id("input-ep"+rarity).value = list[rarity].prob/list[rarity].num;
    list[rarity].prob /= 100;
    list[rarity].ep = list[rarity].prob/list[rarity].num;
  });
  arr_rarity.forEach(function(rarity){
    var len = (list[rarity].ep)? 1/list[rarity].ep: 1;
    len_table = My_math.lcm(len_table, len);
  });
  arr_rarity.forEach(function(rarity){
    var en = list[rarity].ep*len_table;
    list[rarity].en = Math.round(en);
    My$_id("input-en"+rarity).value = en;
  });
  arr_rarity.forEach(function(rarity){
    for(var i=0, ie=list[rarity].num; i<ie; ++i){
      for(var j=0, je=list[rarity].en; j<je; ++j){
        arr_item.push(rarity+String(i));
      }
    }
  });
  arr_rarity.forEach(function(rarity){
    self.setter.counter(rarity);
  });
  self.setter.rarity(arr_rarity);
  self.set_table(arr_item);
  My$_id("input-len_table").value = len_table;
  // not len_table
  My$_id("len_table").value = self.table.length;
  My$_id("table").value = self.display_sw("table", self.table);
  return self;
};
My_gacha.prototype.display_sw = function(sw, arr){
  var self = this;
  var _str = "";
  var len = arr.length;
  if(len < self.len_MAX_display[sw]){
    var str = self.arr2str(arr);
    var q = (My$checkbox_id("checkbox-arr_"+sw))? "\'": "";
    _str = self.replace_str(str, q);
  }
  else{
    _str = "中身非表示でガチャ実行可";
  }
  return _str;
};
My_gacha.prototype.display_table_id = function(){
  var self = this;
  My$_id("table").value = self.display_sw("table", self.table);
  return self;
};
My_gacha.prototype.display_box_id = function(){
  var self = this;
  My$_id("box").value = self.display_sw("box", self.box);
  return self;
};
My_gacha.prototype.set_table_id = function(){
  var self = this;
  self.make_table_id();
  return self;
};
My_gacha.prototype.set_box_id = function(){
  var self = this;
  var k = My$selectNum_id("select-k");
  self.set_box(k);
  self.update_box_id();
  return self;
};
My_gacha.prototype.update_box_id = function(){
  var self = this;
  My$_id("len_box").value = self.box.length;
  My$_id("box").value = self.display_sw("box", self.box);
  My$_id("index_box").value = self.index;
  return self;
};
My_gacha.prototype.shuffle_box_id = function(){
  var self = this;
  if(self.timer) return false;
  if(self.box.length){
    self.shuffle_box();
    self.check_box_id();
    self.update_box_id();
    My$_id("item_box").value = "";
  }
  return self;
};
My_gacha.prototype.check_box_id = function(){
  var self = this;
  if(self.box.length){
    My$_id("roll_max_item").value = self.check_box(My$_id("item_comp").value);
    My$_id("roll_max_rarity").value = self.check_box(My$_id("rarity_comp").value, true);
  }
  return self;
};
My_gacha.prototype.nroll_common_sw = function(sw, n, opt_ms){
  var self = this;
  var _val = "";
  try{
    self["nroll_"+sw](n, function(data){
      var index = data.index;
      var item = data.item;
      if(n === 1){
        var len = self[sw].length;
        var prob = My_math.get_prob(self[sw], item);
        _val = "len="+len
          +", index="+index
          +", item:"+item
          +"("+prob*100+"\%)";
      }
      else{
        _val += data.item+((data.n === n-1)? "\;": ", ");
      }
      self.rarity.forEach(function(rarity){
        if(item.indexOf(rarity) === 0){
          ++self.counter[rarity];
        }
      });
      self.rarity.forEach(function(rarity){
        var prob = My_math.round_ex(self.counter[rarity]/self.counter.roll*100, 1);
        My$_id("input-sc"+rarity).value = self.counter[rarity]+"("+prob+"\%)";
      });
      My$_id("input-sum_roll").value = self.counter.roll;
      My$_id("item_"+sw).value = _val;
      My$_id("index_"+sw).value = index;
    }, opt_ms);
  }
  catch(e){
    throw e;
  }
  return self;
};
My_gacha.prototype.handler_onload = function(){
  var self = this;
  self.set_table_id();
  self.set_box_id();
  self.check_box_id();
  return self;
};
My_gacha.prototype.handler_onclick_sw = function(sw, n, opt_ms){
  var self = this;
  switch(sw){
    case "table":
      if(!self.table.length){
        self.set_table_id();
      }
      self.nroll_common_sw(sw, n, opt_ms);
      break;
    case "box":
      if(!self.box.length){
        self.handler_onload();
      }
      self.nroll_common_sw(sw, n, opt_ms);
      break;
    default:
      break;
  }
  return self;
};
My_gacha.prototype.handler_onchange_sw = function(sw){
  var self = this;
  switch(sw){
    case "table":
    case "box":
      self.clear_timer();
      self.clear_counter();
      self.setter.table();
      self.setter.box();
      My$arr("input[readonly],textarea[readonly]").forEach(function(dom){
        dom.value = "";
      });
      self.handler_onload();
      break;
    default:
      break;
  }
  return self;
};
