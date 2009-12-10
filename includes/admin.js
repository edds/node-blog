process.mixin(GLOBAL, require("../settings"));
var dj = require('../libaries/djangode'),
    tmpl = require('../libaries/tmpl-node'),
    posts = require('../includes/posts'),
    util = require('../includes/util'),
    sys = require('sys');


exports.PageLoad = function(req, res, path){
  path = path || "fuck";
  dj.respond(res, path);
  
}