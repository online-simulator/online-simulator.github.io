// online-simulator.github.io

My_entry.job_imported = function(_data){
  var out = null;
  var isWorker = (typeof window === "undefined");
  try{
    var waveo = new My_entry.output_wave(_data.Bytes_perSample, _data.samples_perSecond, _data.number_channels);
    out = waveo.encode_soundData_LE(_data);
  }
  catch(e){
    out = e.message;
    out += (isWorker)? "@worker": "@main";
    throw new Error(out);
  }
  _data.out = out;
  return _data;
};
