// online-simulator.github.io

var My_job_imported = function(data){
  var out = null;
  var isWorker = (typeof window === "undefined");
  try{
//    error();
    out = Math[data.sw_job](data.in);
  }
  catch(e){
    out = e.message;
    out += (isWorker)? "@worker": "@main";
    throw new Error(out);
  }
  data.out = out;
  return data;
};
