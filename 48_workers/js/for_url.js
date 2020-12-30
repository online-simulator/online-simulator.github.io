"use strict";

importScripts("for_importScripts.js");

onmessage = function(e){
  postMessage(My_job_imported(e.data));
};
