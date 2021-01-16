function My_reference(){
}

/* Reference */

// developer.mozilla.org
My_reference.fn2url = function(fn){
  var str_fn = "("+fn.toString()+")()";
  var blob = new Blob([str_fn], {type: "application/javascript"});
  return My_conv.blob2url(blob);
};

// en.m.wikipedia.org/wiki/MIDI_tuning_standard
My_reference.calc_freq = function(octave, code){
  var d = (octave+2)*12+code;
  var _freq = Math.pow(2, (d-69)/12)*440;
  return _freq;
};

// ja.m.wikipedia.org about Fisher-Yates shuffle
My_reference.sort_random = function(_arr){
  var self = this;
  for(var i=_arr.length-1; i>0; --i){
    var j = self.gen_irand(i+1);
    self.switch_arr(_arr, i, j);
  }
  return _arr;
};
