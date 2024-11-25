const { Router } = require('express');
const {
  getAllClients,
  getClientByRfc,
  addClient,
  updateClient,
  deleteClient
} = require('../controllers/clients');

const router = Router();

// Ruta para obtener todos los clientes activos
router.get('/', getAllClients);

// Ruta para obtener un cliente por RFC
router.get('/:rfc', getClientByRfc);

// Ruta para agregar un nuevo cliente
router.post('/', addClient);

// Ruta para actualizar un cliente existente
router.put('/:rfc', updateClient);

// Ruta para eliminar (marcar como inactivo) un cliente
router.delete('/:rfc', deleteClient);

module.exports = router;
