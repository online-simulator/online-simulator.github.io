// online-simulator.github.io

function My_test_gacha(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
}

My_def.mix_in(My_test_gacha, My_original_main);

My_test_gacha.prototype.init = function(){
  var self = this;
  self.init_main.apply(self, arguments);
  return self;
};
My_test_gacha.prototype.init_elems = function(){
  var self = this;
  My_setup_elems_readonly$("textarea");
  My_setup_elems$_tag("button", self.handlers, "onclick");
  My_setup_elems$_tag("input", self.handlers, "onchange");
  My_setup_elems$_tag("select", self.handlers, "onchange");
  return self;
};
My_test_gacha.prototype.init_handlers = function(){
  var self = this;
  self.handlers.onload = function(args){
    var self = this;
    self.gacha = new My_gacha();
    self.len_MAX_display = {
      table: 5000,
      box: 5000
    };
    self.handler_onload();
    return self;
  };
  self.handlers.onbeforeunload = function(e){
    var self = this;
    return self;
  };
  self.handlers.onclick = function(e, elem){
    var self = this;
    switch(elem.id){
      case "roll_table1":
      case "roll_table10":
      case "roll_table100":
        var n = elem.id.match(/^roll_table(\d+)/)[1];
        self.handler_onclick_sw("table", n, 20);
        break;
      case "roll_box1":
      case "roll_box10":
      case "roll_box100":
        var n = elem.id.match(/^roll_box(\d+)/)[1];
        self.handler_onclick_sw("box", n, 20);
        break;
      case "shuffle_box":
        self.shuffle_box_id();
        break;
      case "reset_box":
        self.handler_onchange_sw("box");
        break;
      default:
        break;
    }
    return self;
  };
  self.handlers.onchange = function(e, elem){
    var self = this;
    if(elem.tagName.toUpperCase() === "SELECT"){
      self.handler_onchange_sw("table");
    }
    else switch(elem.id){
      case "checkbox-arr_table":
        self.display_table_id();
        break;
      case "checkbox-arr_box":
        self.display_box_id();
        break;
      case "input-item_comp":
      case "input-rarity_comp":
        self.check_box_id();
        break;
      default:
        break;
    }
    return self;
  };
  return self;
};
My_test_gacha.prototype.test = function(){
  var self = this;
  var str_table = "[N0,N1,N2,N3,N4,N5,N6,N7,N8,N9,N10,N11,N12,R0,R1,R2,R3,SR0,SR1,SSR0]";
  var arr_table = ['N0','N1','N2','N3','N4','N5','N6','N7','N8','N9','N10','N11','N12','R0','R1','R2','R3','SR0','SR1','SSR0'];
  self.gacha.init(arr_table || str_table).nroll_table(10, function(data){
    console.log(data.item);
  }, 1000);
  self.gacha.init(arr_table || str_table, 10).nroll_box(100, function(data){
    console.log(data.item);
  }, 100);
  return self;
};
My_test_gacha.prototype.make_table_id = function(){
  var self = this;
  var _str_table = "";
  var len_table0 = 1;
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
    len_table0 = My_math.lcm(len_table0, len);
  });
  arr_rarity.forEach(function(rarity){
    var en = list[rarity].ep*len_table0;
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
    self.gacha.setter.counter(rarity);
  });
  self.gacha.setter.rarity(arr_rarity);
  self.gacha.set_table(arr_item);
  My$_id("input-len_table0").value = len_table0;
  // not len_table0
  My$_id("input-len_table").value = self.gacha.table.length;
  My$_id("textarea-table").value = self.display_sw("table", self.gacha.table);
  return self;
};
My_test_gacha.prototype.display_sw = function(sw, arr){
  var self = this;
  var _str = "";
  var len = arr.length;
  if(len < self.len_MAX_display[sw]){
    var str = self.gacha.arr2str(arr);
    var q = (My$checkbox_id("checkbox-arr_"+sw))? "\'": "";
    _str = self.gacha.replace_str(str, q);
  }
  else{
    _str = "中身非表示でガチャ実行可";
  }
  return _str;
};
My_test_gacha.prototype.display_table_id = function(){
  var self = this;
  My$_id("textarea-table").value = self.display_sw("table", self.gacha.table);
  return self;
};
My_test_gacha.prototype.display_box_id = function(){
  var self = this;
  My$_id("textarea-box").value = self.display_sw("box", self.gacha.box);
  return self;
};
My_test_gacha.prototype.set_table_id = function(){
  var self = this;
  self.make_table_id();
  return self;
};
My_test_gacha.prototype.set_box_id = function(){
  var self = this;
  var k = My$selectNum_id("select-k");
  self.gacha.set_box(k);
  self.update_box_id();
  return self;
};
My_test_gacha.prototype.update_box_id = function(){
  var self = this;
  My$_id("input-len_box").value = self.gacha.box.length;
  My$_id("textarea-box").value = self.display_sw("box", self.gacha.box);
  My$_id("input-index_box").value = self.gacha.index;
  return self;
};
My_test_gacha.prototype.shuffle_box_id = function(){
  var self = this;
  if(self.gacha.timer) return false;
  if(self.gacha.box.length){
    self.gacha.shuffle_box();
    self.check_box_id();
    self.update_box_id();
    My$_id("input-item_box").value = "";
  }
  return self;
};
My_test_gacha.prototype.check_box_id = function(){
  var self = this;
  if(self.gacha.box.length){
    My$_id("input-roll_max_item").value = self.gacha.check_box(My$_id("input-item_comp").value);
    My$_id("input-roll_max_rarity").value = self.gacha.check_box(My$_id("input-rarity_comp").value, true);
  }
  return self;
};
My_test_gacha.prototype.nroll_common_sw = function(sw, n, opt_ms){
  var self = this;
  var _val = "";
  var n = Number(n);
  try{
    self.gacha["nroll_"+sw](n, function(data){
      var index = data.index;
      var item = data.item;
      if(n === 1){
        var len = self.gacha[sw].length;
        var prob = My_math.get_prob(self.gacha[sw], item);
        _val = "len="+len
          +", index="+index
          +", item:"+item
          +"("+prob*100+"\%)";
      }
      else{
        _val += data.item+((data.n === n-1)? "\;": ", ");
      }
      self.gacha.rarity.forEach(function(rarity){
        if(item.indexOf(rarity) === 0){
          ++self.gacha.counter[rarity];
        }
      });
      self.gacha.rarity.forEach(function(rarity){
        var prob = My_math.round_ex(self.gacha.counter[rarity]/self.gacha.counter.roll*100, 1);
        My$_id("input-sc"+rarity).value = self.gacha.counter[rarity]+"("+prob+"\%)";
      });
      My$_id("input-sum_roll").value = self.gacha.counter.roll;
      My$_id("input-item_"+sw).value = _val;
      My$_id("input-index_"+sw).value = index;
    }, opt_ms);
  }
  catch(e){
    throw e;
  }
  return self;
};
My_test_gacha.prototype.handler_onload = function(){
  var self = this;
  self.set_table_id();
  self.set_box_id();
  self.check_box_id();
  return self;
};
My_test_gacha.prototype.handler_onclick_sw = function(sw, n, opt_ms){
  var self = this;
  switch(sw){
    case "table":
      if(!(self.gacha.table.length)){
        self.set_table_id();
      }
      self.nroll_common_sw(sw, n, opt_ms);
      break;
    case "box":
      if(!(self.gacha.box.length)){
        self.handler_onload();
      }
      self.nroll_common_sw(sw, n, opt_ms);
      break;
    default:
      break;
  }
  return self;
};
My_test_gacha.prototype.handler_onchange_sw = function(sw){
  var self = this;
  switch(sw){
    case "table":
    case "box":
      self.gacha.clear_timer();
      self.gacha.clear_counter();
      self.gacha.setter.table();
      self.gacha.setter.box();
      My$arr("input[readonly],textarea[readonly]").forEach(function(elem){
        elem.value = "";
      });
      self.handler_onload();
      break;
    default:
      break;
  }
  return self;
};
