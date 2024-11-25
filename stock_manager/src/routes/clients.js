const { Router } = require('express');
const {
  getAllClients,
  getClientByRfc,
  addClient,
  updateClient,
  deleteClient
} = require('../controllers/clients');

const router = Router();

//Ruta para los clientes activos
router.get('/', getAllClients);

//Ruta para el cliente por RFC
router.get('/:rfc', getClientByRfc);

//Ruta para agregar un nuevo cliente
router.post('/', addClient);

//Ruta para actualizar un cliente 
router.put('/:rfc', updateClient);

//Ruta para eliminar un cliente
router.delete('/:rfc', deleteClient);

module.exports = router;
