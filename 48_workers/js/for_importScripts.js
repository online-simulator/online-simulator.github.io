// online-simulator.github.io

var My_job_imported = function(_data){
  var out = null;
  var isWorker = (typeof window === "undefined");
  try{
//    error();
    out = Math[_data.sw_job](_data.in);
  }
  catch(e){
    out = e.message;
    out += (isWorker)? "@worker": "@main";
    throw new Error(out);
  }
  _data.out = out;
  return _data;
};
