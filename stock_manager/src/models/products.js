const productsQueries = {
    getAll: 'SELECT * FROM products', // Obtener todos los productos
    getWithStock: 'SELECT * FROM products WHERE stock > 0', // Obtener productos en existencia
    getById: 'SELECT * FROM products WHERE id = ?', // Obtener producto por ID
    create: 'INSERT INTO products (product, description, stock, price) VALUES (?, ?, ?, ?, ?, ?)', 
    update: 'UPDATE products SET product = ?, description = ?, stock = ?, price = ?, updated_at = NOW() WHERE id = ?', 
    delete: 'UPDATE products SET stock = 0 WHERE id = ?', // Inabilitar producto (
  };
  
  module.exports = { productsQueries };
  