// online-simulator.github.io

My_entry.gacha = function(table, k){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.gacha.prototype.init = function(table, k){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["reference"]);
  self.setter = {};
  self.setter.timer = function(timer){
    self.timer = timer || null;
  };
  self.setter.counter = function(prop){
    if(prop){
      self.counter[prop] = 0;
    }
  };
  self.setter.rarity = function(arr){
    self.rarity = arr || [];
  };
  self.setter.k = function(k){
    self.k = k || 1;
  };
  self.setter.index = function(i){
    self.index = i || 0;
  };
  self.setter.table = function(arr){
    self.table = arr || [];
    self.setter.index();
  };
  self.setter.box = function(arr){
    self.box = arr || [];
    self.setter.index();
  };
  self.setter.gen_rand = function(fn){
    self.gen_rand = fn || function(){return Math.random();};
  };
  self.counter = {};
  self.regex = {};
  self.regex.s = /\s/g;
  self.regex.m = /\[.*?\]/g;
  self.regex.r = /\[|\]|\'|\"/g;
  for(var prop in self.setter){
    self.setter[prop]();
  }
  self.setter.counter("roll");
  self.set_table(table);
  self.set_box(k);
  return self;
};
My_entry.gacha.prototype.clear_timer = function(){
  var self = this;
  if(self.timer){
    clearInterval(self.timer);
    self.setter.timer();
  }
  return self;
};
My_entry.gacha.prototype.clear_counter = function(){
  var self = this;
  for(var prop in self.counter){
    self.counter[prop] = 0;
  }
  return self;
};
My_entry.gacha.prototype.arr2str = function(arr, opt_q){
  var self = this;
  var q = opt_q || "";
  var _str = (arr.length)? "\["+q+arr.join(q+","+q)+q+"\]": "";
  return _str;
};
My_entry.gacha.prototype.str2arr = function(str){
  var self = this;
  var _str = str.replace(self.regex.s, "").match(self.regex.m);
  _str = (Array.isArray(_str))?
    _str[0].replace(self.regex.r, "").split(","):
    [];
  return _str;
};
My_entry.gacha.prototype.replace_str = function(str, opt_q){
  var self = this;
  return self.arr2str(self.str2arr(str), opt_q);
};
My_entry.gacha.prototype.set_table = function(table){
  var self = this;
  switch(typeof table){
    case "string":
      table = self.str2arr(table);
      break;
    default:
      break;
  }
  self.setter.table(table);
  return self;
};
My_entry.gacha.prototype.set_box = function(k){
  var self = this;
  self.setter.box(self.make_box(k));
  return self;
};
My_entry.gacha.prototype.make_box = function(k){
  var self = this;
  self.setter.k(k);
  return self.sort_random(self.concat_n(self.table, k));
};
My_entry.gacha.prototype.concat_n = function(arr, n){
  var self = this;
  var _arr = [];
  for(var i=0; i<n; ++i){
    _arr = _arr.concat(arr);
  }
  return _arr;
};
My_entry.gacha.prototype.check_box = function(item_comp, isRarity){
  var self = this;
  var _di_max = 0;
  var arr_i = [];
  self.box.forEach(function(item, i){
    var sw = (isRarity)? (item.indexOf(item_comp) === 0): (item === item_comp);
    if(sw){
      arr_i.push(i);
    }
  });
  for(var i=0, len=arr_i.length; i<len; ++i){
    var di = 0;
    if(i){
      di = arr_i[i]-arr_i[i-1];
    }
    else{
      di = arr_i[i]-arr_i[len-1]+self.box.length;
    }
    _di_max = Math.max(_di_max, di);
  }
  return _di_max;
};
My_entry.gacha.prototype.shuffle_box = function(){
  var self = this;
  self.setter.index();
  self.sort_random(self.box);
  return self;
};
My_entry.gacha.prototype.sort_random = function(_arr){
  var self = this;
  return self.entry.reference.sort_random.call(self, _arr);
};
My_entry.gacha.prototype.switch_arr = function(_arr, i, j){
  var self = this;
  var w = _arr[i];
  _arr[i] = _arr[j];
  _arr[j] = w;
  return _arr;
};
My_entry.gacha.prototype.gen_irand = function(len){
  var self = this;
  // return (int) [0, len)
  return Math.floor(self.gen_rand()*len);
};
My_entry.gacha.prototype.roll_table = function(){
  var self = this;
  var _index = self.gen_irand(self.table.length);
  var _item = self.table[_index];
  return {index: _index, item: _item};
};
My_entry.gacha.prototype.roll_box = function(){
  var self = this;
  var _index = self.index;
  _index = (_index === self.box.length)? 0: _index;
  var _item = self.box[_index];
  self.index = _index+1;
  return {index: _index, item: _item};
};
My_entry.gacha.prototype.nroll_sw = function(sw, n, callback, opt_ms){
  var self = this;
  if(self.timer) return false;
  var n = Number(n);
  if(!(isNaN(n)) && self[sw].length){
    // for IE
    var counter = 0;
    var fn = function(){
      if(callback){
        ++self.counter.roll;
        var data = self["roll_"+sw]();
        data.n = counter;
        callback(data);
      }
      if(++counter === n){
        self.clear_timer();
      }
    };
    var timer = setInterval(fn, opt_ms || 50);
    self.setter.timer(timer);
  }
  return self;
};
My_entry.gacha.prototype.nroll_table = function(n, callback, opt_ms){
  var self = this;
  self.nroll_sw("table", n, callback, opt_ms);
  return self;
};
My_entry.gacha.prototype.nroll_box = function(n, callback, opt_ms){
  var self = this;
  self.nroll_sw("box", n, callback, opt_ms);
  return self;
};
