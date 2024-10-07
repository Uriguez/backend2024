const{createServer} = require("http");

const server = createServer((req, res) => {
console.log(req.url);
res.writeHead(500);
res.write("Bienvenidos a mi primer");
}
);

server.listen(8080);
console.log("Servidor web iniciado en 8080");