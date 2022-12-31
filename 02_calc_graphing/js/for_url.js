// online-simulator.github.io

var files_all = [];

var combine_url = function(url, _files){
  _files.forEach(function(file, i){
    _files[i] = url+file;
  });
  return _files;
};

var url = "../../00_common/js/000_namespace/";
var files = ["000_entry.js"];
Array.prototype.push.apply(files_all, combine_url(url, files));
var url = "../../00_common/js/00_class/";
var files = ["000_reference.js", "00_def.js", "01_math.js", "01_math_com.js", "01_math_mat.js", "01_solver_com.js", "02_DATA.js", "02_operation.js", "02_parser.js", "02_unit.js"];
Array.prototype.push.apply(files_all, combine_url(url, files));
var url = "../../00_common/js/03_original/";
var files = ["03_original_main.js"];
Array.prototype.push.apply(files_all, combine_url(url, files));
var url = "";
var files = ["for_importScripts.js"];
Array.prototype.push.apply(files_all, combine_url(url, files));

files_all.forEach(function(file){
  importScripts(file);
});

onmessage = function(e){
  postMessage(My_entry.job_imported(e.data));
};
