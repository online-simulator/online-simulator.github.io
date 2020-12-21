"use strict";

function My_run_n2dec(){
  var val_n = My$_id("input-n").value;
  var n = My$_id("select-n2dec").value;
  var dec = My_conv.n2dec(val_n, n);
  My$_id("output-dec").value = dec;
  var isChecked = My$_id("checkbox-dec-dec").checked;
  if(isChecked){
    My$_id("input-dec").value = dec;
    var n = My$_id("select-dec2n").value;
    My$_id("output-n").value = My_conv.dec2n(dec, n);
  }
}

function My_run_dec2n(){
  var val_dec = My$_id("input-dec").value;
  var n = My$_id("select-dec2n").value;
  My$_id("output-n").value = My_conv.dec2n(val_dec, n);
  var isChecked = My$_id("checkbox-dec-dec").checked;
  if(isChecked){
    My$_id("output-dec").value = val_dec;
    var n = My$_id("select-n2dec").value;
    My$_id("input-n").value = My_conv.dec2n(val_dec, n);
  }
}
