process.mixin(GLOBAL, require("../settings"));
var dj = require('../libaries/djangode'),
    tmpl = require('../libaries/tmpl-node'),
    posts = require('../includes/posts'),
    util = require('../includes/util'),
    sys = require('sys'),
    options = null;

process.mixin( exports, {
  handleRequest: handleRequest,
  displayPosts: displayPosts,
  error: error,
  respond: respond
});

var t = tmpl.load(settings.templates);

function handleRequest(o){
  options = o;
  var p = posts.GetPosts(o);
  p.addCallback(function(data){
    displayPosts(data);
//    respond("hi mum");
  });
  p.addErrback(function(data){
    dj.respond(options.res, data);
  });
}
var displayPosts = function(rows){
  if(rows.length){
    var out = [];
    rows.forEach(function(row){
      row.date = new Date(parseInt(row.timestamp) * 1000 );
      row.since = util.timeSince(row.date);
      out.push(tmpl['post.html'](row));
    });
    respond(out.join(''));
  } else {
    respond(error());
  }
};
var error = function(message){
  return "<h1>error</h1><p>fuck</p>";
};
var respond = function(content){
  var template = tmpl["main.html"]({ 
    "pageTitle" : '',
    "blogTitle" : settings.title,
    "strapline" : settings.strapline,
    "year"      : new Date().getFullYear(),
    "adminName" : settings.admin.name,
    "content": content });
  
  dj.respond(options.res, template);

}