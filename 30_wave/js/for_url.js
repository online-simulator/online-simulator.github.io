// online-simulator.github.io

importScripts("../../00_common/js/000_namespace/000_entry.js", "../../00_common/js/00_class/01_math_wave.js", "../../00_common/js/02_handler/02_handler_baseview.js", "../../00_common/js/03_original/03_original_main.js", "01_output_wave.js", "for_importScripts.js");

onmessage = function(e){
  postMessage(My_entry.job_imported(e.data));
};
