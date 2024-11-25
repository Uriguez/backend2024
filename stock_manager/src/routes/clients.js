const { Router } = require('express');
const {
  getAllClients,
  getClientID,
  addClient,
  updateClient,
  deleteClient
} = require('../controllers/clients');

const router = Router();

// Ruta para obtener todos los clientes activos
router.get('/', getAllClients);

// Ruta para obtener un cliente por ID
router.get('/:rfc', getClientID);

// Ruta para agregar un nuevo cliente
router.post('/', addClient);

// Ruta para actualizar un cliente existente
router.put('/:rfc', updateClient);

// Ruta para eliminar un cliente
router.delete('/:rfc', deleteClient);

module.exports = router;
