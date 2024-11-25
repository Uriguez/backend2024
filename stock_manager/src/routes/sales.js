const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, addSale, updateSale, deleteSale } = require('../controllers/sales');

// Obtener todas las ventas
router.get('/', getAllSales);

// Obtener una venta por ID
router.get('/:id', getSaleById);

// Agregar una nueva venta
router.post('/', addSale);

// Actualizar una venta
router.put('/:id', updateSale);

// Eliminar una venta
router.delete('/:id', deleteSale);

module.exports = router;
