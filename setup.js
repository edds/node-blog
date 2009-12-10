var sys = require("sys");
var Postgres = require('./libaries/postgres');
process.mixin(GLOBAL, require("./settings"));


var db = new Postgres.Connection(
                settings.database.name,
                settings.database.username,
                settings.database.password,
                settings.database.port);
  
  
function createTables(){
  var posts = "\
      CREATE TABLE posts ( \
        PostID serial PRIMARY KEY, \
        Slug varchar(255) UNIQUE NOT NULL, \
        Title varchar(255), \
        Content text, \
        Created timestamp DEFAULT current_timestamp )";

  db.query(posts, function(data){
    sys.p(data);
    sys.puts("posts table created");
  }, function(code, error){
    sys.p(error)
  });
}

createTables();
db.close();
