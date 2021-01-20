// Reference

My_entry.reference = function(){
  var self = this;
  self.init.apply(self, arguments);
  return self;
};

My_entry.reference.prototype.init = function(){
  var self = this;
  new My_entry.original_main().setup_constructors.call(self);
  new My_entry.original_main().make_instances.call(self, ["conv"]);
  return self;
};

// developer.mozilla.org about WebWorkers
// to
My_entry.reference.prototype.fn2url = function(fn){
  var self = this;
  var str_fn = "("+fn.toString()+")()";
  var blob = new Blob([str_fn], {type: "application/javascript"});
  return self.entry.conv.blob2url(blob);
};

// en.m.wikipedia.org/wiki/MIDI_tuning_standard
// to 30_wave
My_entry.reference.prototype.calc_freq = function(octave, code){
  var self = this;
  var d = (octave+2)*12+code;
  var _freq = Math.pow(2, (d-69)/12)*440;
  return _freq;
};

// ja.m.wikipedia.org about Fisher-Yates shuffle
// to 99_gacha
My_entry.reference.prototype.sort_random = function(_arr){
  var self = this;
  for(var i=_arr.length-1; i>0; --i){
    var j = self.gen_irand(i+1);
    self.switch_arr(_arr, i, j);
  }
  return _arr;
};
