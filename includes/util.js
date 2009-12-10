var sys = require('sys'),
    posix = require('posix'),
    Showdown = require("../libaries/showdown");

var loadFile = function(filename){
  var p = new process.Promise();
  sys.puts("loading " + filename);
  
  var file = posix.cat(filename);
  file.addCallback(function(data) {
      p.emitSuccess(data);
  });
  file.addErrback(function() {
      sys.puts("Error loading " + filename);
      p.emmitError();
  });
  
  return p;
}
exports.loadFile = loadFile;

exports.loadMarkdown = function(filename){
  var p = new process.Promise();
  
  var file = loadFile(filename);
  file.addCallback(function(data){
    var converter = new Showdown.converter();
    var html = converter.makeHtml(data);
    p.emitSuccess(html);
  });
  
  return p;
}


var template = function(str, data) {
  var fn = new Function('obj',
    'var p=[],print=function(){p.push.apply(p,arguments);};' +
    'with(obj){p.push(\'' +
    str
      .replace(/[\n]/g, "\\n")
      .replace(/[\t]/g, "\\t")
      .replace(/[\r]/g, "\\r")
      .split("<%").join("\t")
      .replace(/((^|%>)[^\t]*)'/g, "$1\r")
      .replace(/\t=(.*?)%>/g, "',$1,'")
      .split("\t").join("');")
      .split("%>").join("p.push('")
      .split("\r").join("\\'")
  + "');}return p.join('');");
  return data ? fn(data) : fn;
};

exports.loadTemplate = function(filename, context){
  var p = new process.Promise();
  
  var file = loadFile(filename);
  file.addCallback(function(data){
    var data = template(data, context);
    p.emitSuccess(data);
  });
  
  return p;
}


// A Javascript implimentation of the php time_since functon by Dunstan Orchard
// http://www.1976design.com/blog/archive/2004/07/23/redesign-time-presentation/

exports.timeSince = function(oldTime){
	// array of time period chunks
	chunks = new Array(
			[60 * 60 * 24 * 365 , 'year'],
			[60 * 60 * 24 * 30 , 'month'],
			[60 * 60 * 24 * 7, 'week'],
			[60 * 60 * 24 , 'day'],
			[60 * 60 , 'hour'],
			[60 , 'minute'] 
	);
	newTime = new Date();
	// difference in seconds
	since = (newTime - oldTime) / 1000;
	limit = 6;
	
	for (i = 0; i < limit; i++){
		seconds = chunks[i][0];
		name = chunks[i][1];
		// finding the biggest chunk (if the chunk fits, break)
		if ((count = Math.floor(since / seconds)) != 0){
			break;
		}
	}
	output = (count == 1) ? ('1 ' + name) : (count + " " + name + "s");
	
	if (i + 1 < limit){
		seconds2 = chunks[i + 1][0];
		name2 = chunks[i + 1][1];
		if ((count2 = Math.floor((since - (seconds * count)) / seconds2)) != 0){
			output += (count2 == 1) ? (', 1 ' + name2) : (", " + count2 + " " + name2 + "s");
		}
	}
	return output;
}

