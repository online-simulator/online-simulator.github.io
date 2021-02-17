// online-simulator.github.io

My_entry.job_imported = function(_data){
  var out = null;
  var isWorker = (typeof window === "undefined");
  try{
    _data = new My_entry.parser().run(_data);  // the same reference returned
  }
  catch(e){
    out = e.message;
    out += (isWorker)? "@worker": "@main";
    throw new Error(out);
  }
  return _data;
};
