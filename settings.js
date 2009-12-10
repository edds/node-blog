var sys = require('sys');

exports.settings = {
  
  "title": "my new blog",
  "strapline": "I love node.js",
  
  "admin" : {
    "name": "Your Name",
    "email": "Your Email",
    // an md5 string, generate using `md5 -s mypassword`
    "password": "1a1dc91c907325c69271ddf0c944bc72"
  },
  
  "database" : {
    "name" : 'edd',
    "username" : 'edd',
    "password" : '',
    "port" : '5432',
    "tablePrefix" : ''
  },
  
  "postsPerPage" : 20,
  "templates" : "./templates/"
  
};
