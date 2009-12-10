var tmpl = require( "./libaries/tmpl-node" );
var sys = require('sys');
process.mixin(GLOBAL, require("./settings"));


var t = tmpl.load("./templates/");
t.addCallback(function(){
  var html = tmpl[ "main.html" ]({ 
  
    "pageTitle" : '',
    "blogTitle" : settings.title,
    "strapline" : settings.strapline,
    "year"      : new Date().getFullYear(),
    "adminName" : settings.admin.name,
    "content": "data"
   });
   sys.puts(html);
});