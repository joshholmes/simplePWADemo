var static = require('node-static');
var http = require('http');
const fs = require('fs');
    
var fileServer = new static.Server('./public');
  
http.createServer(function (request, response) {
    request.addListener('end', function () {
        console.log(request.url);
        console.log(request.httpVersion);
        console.log(JSON.stringify(request.headers));
        fileServer.serve(request, response, function (err, result) {
            console.log("Serving " + request.url);
            if (err) { // There was an error serving the file
                console.error("Error serving " + request.url + " - " + err.message);
 
                // Respond to the client
                response.writeHead(err.status, err.headers);
                response.end();
            }
        });
    }).resume();
}).listen(3000);