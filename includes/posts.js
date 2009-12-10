process.mixin(GLOBAL, require("../settings"));
var Postgres = require('../libaries/postgres');
var sys = require('sys');

var db = null;

var getDB = function(){
  var db = new Postgres.Connection(
                  settings.database.name,
                  settings.database.username,
                  settings.database.password,
                  settings.database.port);
  return db;
}


var pre = settings.database.tablePrefix;

var safeSlug = function(slug){
  return slug.replace(/([^A-Za-z0-9\-]+)/g, '');
}
var safeInt = function(string){
  return string.replace(/([^0-9]+)/g, '');
}
var buildLimit = function(offset){
  var realOffset = parseInt(safeInt(offset)) * settings.postsPerPage;
  return " LIMIT "+settings.postsPerPage+" OFFSET "+realOffset;
}

var getWithDate = function(month, year, slug, offset){
  if(month){
    month = safeInt(month);
    var whereMonth = " AND EXTRACT(MONTH FROM Created) ='"+month+"'";
  } else {
    var whereMonth = '';
  }
  if(slug) {
    slug = safeSlug(slug);
    var whereSlug = " AND Slug='"+slug+"'";
  } else {
    var whereSlug = '';    
  }
  year  = safeInt(year);
  var sql = "WHERE EXTRACT(YEAR FROM Created) ='"+year+"'"+whereMonth+whereSlug+buildLimit(offset); 
  return sql;
}
var getWithCategory = function(category, offset){
  // TODO: implement categories bitch
  category = safeSlug(category);
  var sql = "WHERE EXTRACT(MONTH FROM Created) ='"+month+"' AND  EXTRACT(YEAR FROM Created) ='"+year+"'"+buildLimit(offset);     
  return sql;
}
var getDefault = function(offset){
  var sql = "ORDER BY Created DESC"+buildLimit(offset);   
  return sql;
}

var getPostCounts = function(){
  var sql = "SELECT distinct date_trunc('month', Created) AS something, date_part('epoch', Created) AS timestamp, COUNT(*) FROM posts GROUP BY Created";
}

var GetPosts = function(options){
  if(options.type === "archive"){
    var sql = getWithDate(options.month, options.year, options.slug, options.offset);
  } else if(options.type === "index" ){
    var sql = getDefault(options.offset);
  }
  sql = "SELECT *, date_part('epoch', Created) AS timestamp FROM "+pre+"posts "+sql;
  sys.puts(sql);
  var p = new process.Promise();
  var result = function(data){
    p.emitSuccess(data);
  }
  var error = function(errorNo, error){
    sys.p(error);
    p.emitError(error);    
  }
  var db = getDB();
  db.query(sql, result, error)
  return p;
}

exports.GetPosts = GetPosts;