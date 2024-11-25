const express = require('express');
const usersRoutes = require('./routes/users');       // Rutas de usuarios
const staffRoutes = require('./routes/staff');       // Rutas de staff
const clientsRoutes = require('./routes/clients');   // Rutas de clientes
const productsRoutes = require('./routes/products'); // Rutas de productos
const salesRoutes = require('./routes/sales');       // Rutas de ventas

class Server {
    constructor() {
        this.app = express();
        this.port = 3000;

        // Configurar middlewares
        this.middlewares();

        // Configurar rutas
        this.routes();
    }

    // Configurar middlewares
    middlewares() {
        this.app.use(express.json()); // Habilitar el parseo de JSON
    }

    // Configurar rutas
    routes() {
        this.app.use('/users', usersRoutes);       // Rutas de usuarios
        this.app.use('/staff', staffRoutes);       // Rutas de staff
        this.app.use('/clients', clientsRoutes);   // Rutas de clientes
        this.app.use('/products', productsRoutes); // Rutas de productos
        this.app.use('/sales', salesRoutes);       // Rutas de ventas
    }

    // Método para iniciar el servidor
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

module.exports = { Server };
