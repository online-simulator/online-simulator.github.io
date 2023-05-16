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

// polygon-planet-log.blogspot.com/2012/02/javascript_25.html
// to 01_calc_simple 02_calc_graphing
My_entry.reference.prototype.get_pattern_token = function(){
  var self = this;
  var useES6 = (Number("0b0") === 0 && Number("0o0") === 0);
  var re = (useES6)?
//   0(?:[xX][0-9a-fA-F]+)|0(?:[bB][0-1]+)|0(?:[oO][0-7]+)
    /0(?:[xXbBoO][0-9a-zA-Z]+)|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[-+\/%*=&|^~<>!?:,;@()\\[\].{}]|[^\s+\/%*=&|^~<>!?:,;@()\\[\].{}'"-]+/:
    /0(?:[xX][0-9a-zA-Z]+)|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[-+\/%*=&|^~<>!?:,;@()\\[\].{}]|[^\s+\/%*=&|^~<>!?:,;@()\\[\].{}'"-]+/;
  return re;
};

// rewish.hatenadiary.org/entry/20100427/1272296260
// to 01_calc_simple 02_calc_graphing
My_entry.reference.prototype.fullStr2half = function(fullStr){
  var self = this;
  var ba = {b: /[Ａ-Ｚａ-ｚ０-９！-～]/g, a: function(fullStr){return String.fromCharCode(fullStr.charCodeAt(0)-0xFEE0);}};
  return fullStr.replace(ba.b, ba.a);
};

// en.m.wikipedia.org/wiki/Scientific_pitch_notation
// en.m.wikipedia.org/wiki/MIDI_tuning_standard
// to 30_wave
My_entry.reference.prototype.calc_freq = function(octave, note){
  var self = this;
  var m = (octave+1)*12+note;
  var _freq = Math.pow(2, (m-69)/12)*440;
  return _freq;
};

// en.m.wikipedia.org/wiki/Fisher-Yates_shuffle
// to 02_calc_graphing
My_entry.reference.prototype.sort_random = function(_arr){
  var self = this;
  for(var i=_arr.length-1; i>0; --i){
    var j = self.gen_irand(i+1);
    self.switch_arr(_arr, i, j);
  }
  return _arr;
};
