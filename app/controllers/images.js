var fs = require('fs');

// GET: /img/:filename
exports.getImage = function(req, res) {
	var filename = req.params.filename;
	var url = __dirname + "/../../public/img/" + filename; 
	
	fs.readFile(url, function(err, data) {
	  	if (err) throw err; // Fail if the file can't be read.
	    res.writeHead(200, {'Content-Type': 'image/jpeg'});
	    res.end(data); // Send the file data to the browser.
	});
}