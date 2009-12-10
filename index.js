var sys = require('sys');
var dj = require('./libaries/djangode');
var util = require('./includes/util');
var blog = require('./includes/blog');
var admin = require('./includes/admin');
process.mixin(GLOBAL, require("./settings"));



var app = dj.makeApp([
    ['^/$', function(req, res) {
      offset = req.uri.params.page || "0";
      blog.handleRequest({
        "type" : "index",
        "offset": offset,
        "res"  : res
      });
    }],
    ['^/slug/(\\w+)$', function(req, res, slug) {
      blog.handleRequest({
        "type" : "individual",
        "slug" : slug,
        "res"  : res
      });
    }],
    ['^/posts/(\\d+)(/\\d+)?(/\\w+)?$', function(req, res, year, month, slug) {
      offset = req.uri.params.page || "0";
      blog.handleRequest({
        "type" : "archive",
        "month": month,
        "year" : year,
        "slug" : slug,
        "offset": offset,
        "res"  : res
      });
    }],
    ['^/favicon\.ico$', function(req, res) {
        dj.respond(res, 'Nothing to see here');
    }],
    ['^/(static/.*)$', dj.serveFile], // Serve files from static-demo/
    ['^/admin/(\/.*)?$', admin.PageLoad]
]);

dj.serve(app, 8009);


