const { Router } = require('express');
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getProductsWithStock } = require('../controllers/products');

const router = Router();

router.get('/', getAllProducts); // Obtener todos los productos
router.get('/with-stock', getProductsWithStock); // Obtener productos con stock > 0
router.get('/:id', getProductById); // Obtener un producto por ID
router.post('/', addProduct); // Agregar un nuevo producto
router.put('/:id', updateProduct); // Actualizar un producto existente
router.delete('/:id', deleteProduct); // Eliminar (desactivar) un producto

module.exports = router;
