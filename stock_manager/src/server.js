const express = require ('express');
const app = express();

class Server{
    constructor () {
        this.app = express();
        this.port = 3000;
        this.app.use(express.json());

}

start(){
    this.app.listen(this.port, () =>{
        console.log('Example app listening on port' + this.port);
    });
}
}

module.exports = {Server};
