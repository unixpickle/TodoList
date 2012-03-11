var http = require('http');
var list = require('./list.js');
var qs = require('querystring');
var port = 1234;

function handleAdd (request, response) {
	var body = '';
	request.on('data', function (data) {
		body += data;
	});
	request.on('end', function () {
		var item = qs.parse(body).str;
		if (item != null) {
			list.shared.insert(item);
			response.writeHead(302, {'Location': '/'});
			response.end();
		} else {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('Invalid request...');
		}
		response.end()
	});
}

function handleDelete (request, response) {
	console.log('Request to /del');
	var delID = parseInt(request.url.substr(5));
	list.shared.remove(delID);
	response.writeHead(302, {'Location': '/'});
	response.end();
}

http.createServer(function (request, response) {
	if (request.url == '/') {
		response.writeHead(200, {'Content-Type': 'text/html'});
		list.respond(response);
	} else if (request.url == '/add') {
		console.log('Request to /add');
		if (request.method == 'POST') {
			handleAdd(request, response);
		} else {
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.end();
		}
	} else if (request.url.substr(0, 5) == '/del/') {
		handleDelete(request, response);
	} else {
		response.writeHead(404, {'Content-Type': 'text/html'});
		response.end('<h1>404 Not Found</h1>');
	}
}).listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');
