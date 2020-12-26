"use strict";

const My_counter = {n: 0};

const My_create_link = function(id_output, isInsertBefore){
  var n = My_counter.n++;
  var name = My$_id("input-name").value+n+".txt";
  var json = {p: {id: "wrapper-link"}, a: {id: "a"+n, it: "download"+n}, b: {id: "b"+n, it: "save"+n}, name: name, isIB: isInsertBefore};
  json.o = (id_output)? {id: id_output}: {tag: "input"};
  var handler = new My_handler_link(json);
  return handler;
};
