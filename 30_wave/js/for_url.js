// online-simulator.github.io

importScripts("../../00_common/js/00_class/01_config.js", "../../00_common/js/00_class/01_math_wave.js", "../../00_common/js/02_handler/02_handler_baseview.js", "01_output_wave.js", "for_importScripts.js");

onmessage = function(e){
  postMessage(My_job_imported(e.data));
};
