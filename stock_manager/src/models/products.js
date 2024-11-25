const productsQueries = {
  getAll: 'SELECT * FROM products', //Mostrar todos los productos
  getWithStock: 'SELECT * FROM products WHERE stock > 0', //Mostrar productos con existencias
  getById: 'SELECT * FROM products WHERE id = ?', //Mostrar producto por ID
  create: 'INSERT INTO products (product, description, stock, measurement_unit, price, discount) VALUES (?, ?, ?, ?, ?, ?)', 
  update: 'UPDATE products SET product = ?, description = ?, stock = ?, measurement_unit = ?, price = ?, discount = ? WHERE id = ?',
  delete: 'UPDATE products SET stock = 0 WHERE id = ?', //Vaciar el stock del producto
};

module.exports = { productsQueries };
