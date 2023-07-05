var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  if (req.url == "/"){
    fs.readFile("page.html", 'utf8', function (error, pgResp){
      if (error){
        res.writeHead(404);
        res.write('Page not found');
      } else{
        res.writeHead(200,{'Content-Type': 'text/html'});
        res.write(pgResp);
      }
      res.end();
    })
  } else{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h2>ordinary-content</h2>');
    res.end();
  }
});

server.listen(5000);
console.log('The server is listening on port 5000');
