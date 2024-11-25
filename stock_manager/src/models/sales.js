const salesQueries = {
    // Obtener todas las ventas
    getAllSales: 'SELECT * FROM sales',
    // Obtener venta por ID
    getSaleById: 'SELECT * FROM sales WHERE id = ?',
    // Insertar una nueva venta
    insertSale: 'INSERT INTO sales (client_id, product_id, quantity, sale_date, payment_method, ticket, invoice) VALUES (?, ?, ?, ?, ?, ?, ?)',
    // Eliminar una venta
    deleteSale: 'DELETE FROM sales WHERE id = ?',
    // Verificar si el RFC del cliente existe
    checkClientExists: 'SELECT * FROM clients WHERE id = ?',
    // Verificar si el ID del producto existe
    checkProductExists: 'SELECT * FROM products WHERE id = ?',
    // Verificar si el ticket ya existe
    checkTicketExists: 'SELECT * FROM sales WHERE ticket = ?',
    // Actualizar el stock de productos
    updateProductStock: 'UPDATE products SET stock = stock - ? WHERE id = ?',
    // Restaurar el stock de productos
    restoreProductStock: 'UPDATE products SET stock = stock + ? WHERE id = ?',
  };
  
  module.exports = salesQueries;
  