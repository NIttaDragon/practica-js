const http = require('http');

const hostname ='127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) =>{
  res.ststusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('New Server\n');
});

server.listen(port, hostname, ()=>{
  console.log('Server running at http://${hostname}:${port}/')
})
