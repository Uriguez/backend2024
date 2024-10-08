const{createServer} = require("http");

const server = createServer((req, res) => {
res.write("Hola mundo!");
res.end();
}
);

server.listen();
console.log("Servidor web iniciado en 8080");
