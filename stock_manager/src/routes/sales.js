const express = require('express');
const router = express.Router();
const { getAllSales, getSaleById, addSale, updateSale, deleteSale } = require('../controllers/sales');

//Mosrar todas las ventas
router.get('/', getAllSales);

//Mostrar la venta por ID
router.get('/:id', getSaleById);

//Mostrar una nueva venta
router.post('/', addSale);

//Actualiza una venta
router.put('/:id', updateSale);

//Elimina una venta
router.delete('/:id', deleteSale);

module.exports = router;
