// online-simulator.github.io

importScripts("../../00_common/js/000_namespace/000_entry.js", "for_importScripts.js");

onmessage = function(e){
  postMessage(My_entry.job_imported(e.data));
};
