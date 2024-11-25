const { Router } = require('express');
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getProductsWithStock } = require('../controllers/products');

const router = Router();

router.get('/', getAllProducts); //Mostrar todos los productos
router.get('/with-stock', getProductsWithStock); //Mostrar productos con stock > 0
router.get('/:id', getProductById); //Mostrar un producto por ID
router.post('/', addProduct); //Agrega un nuevo producto
router.put('/:id', updateProduct); // Actualiza un producto existente
router.delete('/:id', deleteProduct); //Vacia el stock del producto

module.exports = router;
