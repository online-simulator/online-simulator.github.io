// online-simulator.github.io

My_entry.handler_calc = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.handler_calc.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["DATA", "parser"]);
  self.init_data();
  return self;
};
My_entry.handler_calc.prototype.init_data = function(){
  var self = this;
  self.data = self.entry.DATA.data();
  var options = self.data.options;
  options.makeLog = true;
  return self;
};
My_entry.handler_calc.prototype.set_vars = function(obj){
  var self = this;
  var DATA = self.entry.DATA;
  var data = self.data;
  for(var prop in obj){
    data.vars[prop] = DATA.tree_num(obj[prop], 0);
  }
  return self;
};
My_entry.handler_calc.prototype.get_ans = function(val){
  var self = this;
  var parser = self.entry.parser;
  var data = self.data;
  var _num = Number(val);
  if(isNaN(_num)){
    data.in = val;
    try{
      parser.run(data);
      _num = Number(data.log);
    }
    catch(e){
      _num = NaN;
    }
  }
  return _num;
};
My_entry.handler_calc.prototype.get_anss = function(obj, opt_obj){
  var self = this;
  for(var prop in obj){
    (opt_obj || obj)[prop] = self.get_ans(obj[prop]);
  }
  return self;
};
My_entry.handler_calc.prototype.update = function(obj_t, obj_f, opt_obj){
  var self = this;
  self.set_vars(obj_t);
  self.get_anss(obj_f, opt_obj);
  return self;
};
