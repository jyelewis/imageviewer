var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs')
var io = require('socket.io')(http);
var hound = require('hound');
//var chokidar = require('chokidar'); //for file monitoring


app.use("/images", express.static(__dirname + '/images'));
app.use("/resources", express.static(__dirname + '/resources'));

app.get('/', function(req, res){
	res.send(fs.readFileSync("index.html").toString());
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


function updateImage(imageURL) {
	if (imageURL.split('.')[1].toLowerCase() == "jpg") {
		console.log('Transmitting image', imageURL);
		io.emit('updateImage', imageURL, { for: 'everyone' });
	}
}

/*
setInterval(function(){updateImage("IMG_9991.JPG");}, 10000);

setTimeout(function(){
	setInterval(function(){updateImage("IMG_0006.JPG");}, 10000);
}, 5000);*/


//var watcher = chokidar.watch(__dirname + '/images', {persistent: true});
var watcher = hound.watch(__dirname + '/images');
watcher.on('create', function(path) {
	var parts = path.split('/');
	var imageName = parts[parts.length-1];
	console.log('New Image', imageName)
	updateImage(imageName);
});
