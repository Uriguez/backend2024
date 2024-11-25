const { request, response } = require('express');
const pool = require('../db/connection');

//Mostrar todas las ventas agregadas
const getAllSales = async (req = request, res = response) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const sales = await conn.query('SELECT * FROM sales');
        res.send(sales);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

//Mostar una venta por su ID
const getSaleById = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        const sale = await conn.query('SELECT * FROM sales WHERE id = ?', [id]);
        if (sale.length === 0) {
            res.status(404).send('Sale not found');
            return;
        }
        res.send(sale[0]);
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

//Agregar una nueva venta y verificar que client_rfc y product_id existen en las tablas correspondientes

const addSale = async (req = request, res = response) => {
    const { client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice } = req.body;

    if (!client_rfc || !product_id || !quantity || !sale_date || !payment_method || !ticket || !invoice) {
        res.status(400).send('All fields are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        const clientExists = await conn.query('SELECT * FROM clients WHERE rfc = ?', [client_rfc]);
        if (clientExists.length === 0) {
            res.status(400).send('Client RFC does not exist');
            return;
        }

        const productExists = await conn.query('SELECT * FROM products WHERE id = ?', [product_id]);
        if (productExists.length === 0) {
            res.status(400).send('Product ID does not exist');
            return;
        }

        // Verificar que el ticket o la factura no se repita
        const ticketExists = await conn.query('SELECT * FROM sales WHERE ticket = ?', [ticket]);
        if (ticketExists.length > 0) {
            res.status(400).send('Ticket already exists');
            return;
        }

        const invoiceExists = await conn.query('SELECT * FROM sales WHERE invoice = ?', [invoice]);
        if (invoiceExists.length > 0) {
            res.status(400).send('Invoice already exists');
            return;
        }

        //Verifica si el producto tiene stock o no
        const productStock = await conn.query('SELECT stock FROM products WHERE id = ?', [product_id]);
        if (productStock[0].stock < quantity) {
            res.status(400).send('Insufficient stock');
            return;
        }

        // Insertar la venta
        const result = await conn.query('INSERT INTO sales (client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice) VALUES (?, ?, ?, ?, ?, ?, ?)', [client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice]);

        //Descuento
        await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, product_id]);

        res.status(201).send('Sale created successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

//Actualizar una venta existente y verificar que client_rfc y product_id existen en las tablas correspondientes
const updateSale = async (req = request, res = response) => {
    const { id } = req.params;
    const { client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice } = req.body;

    if (isNaN(id) || !client_rfc || !product_id || !quantity || !sale_date || !payment_method || !ticket || !invoice) {
        res.status(400).send('All fields are required');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();

        //Verificar que la venta existe
        const saleExists = await conn.query('SELECT * FROM sales WHERE id = ?', [id]);
        if (saleExists.length === 0) {
            res.status(404).send('Sale not found');
            return;
        }

        const clientExists = await conn.query('SELECT * FROM clients WHERE rfc = ?', [client_rfc]);
        if (clientExists.length === 0) {
            res.status(400).send('Client RFC does not exist');
            return;
        }

        const productExists = await conn.query('SELECT * FROM products WHERE id = ?', [product_id]);
        if (productExists.length === 0) {
            res.status(400).send('Product ID does not exist');
            return;
        }

        // Verificar que el ticket o la factura no se repita
        const ticketExists = await conn.query('SELECT * FROM sales WHERE ticket = ? AND id != ?', [ticket, id]);
        if (ticketExists.length > 0) {
            res.status(400).send('Ticket already exists');
            return;
        }

        const invoiceExists = await conn.query('SELECT * FROM sales WHERE invoice = ? AND id != ?', [invoice, id]);
        if (invoiceExists.length > 0) {
            res.status(400).send('Invoice already exists');
            return;
        }

        //Actualiza la venta
        const result = await conn.query('UPDATE sales SET client_rfc = ?, product_id = ?, quantity = ?, sale_date = ?, payment_method = ?, ticket = ?, invoice = ? WHERE id = ?', [client_rfc, product_id, quantity, sale_date, payment_method, ticket, invoice, id]);

        //Verifica si hubo cambio en la cantidad del producto
        if (result.affectedRows > 0) {
            // Descontar el nuevo stock y devolver el antiguo
            const oldSale = saleExists[0];
            if (oldSale.quantity !== quantity) {
                // Si se cambió la cantidad, se actualiza el stock
                await conn.query('UPDATE products SET stock = stock + ? - ? WHERE id = ?', [oldSale.quantity, quantity, product_id]);
            }
        }

        res.send('Sale updated successfully');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};

// Eliminar una venta existente
const deleteSale = async (req = request, res = response) => {
    const { id } = req.params;
    if (isNaN(id)) {
        res.status(400).send('Invalid ID');
        return;
    }

    let conn;
    try {
        conn = await pool.getConnection();
        
        //Verificar si la venta existe
        const saleExists = await conn.query('SELECT * FROM sales WHERE id = ?', [id]);
        if (saleExists.length === 0) {
            res.status(404).send('sale not found');
            return;
        }

        const sale = saleExists[0];

        await conn.query('UPDATE products SET stock = stock + ? WHERE id = ?', [sale.quantity, sale.product_id]);

        // Eliminar la venta
        const result = await conn.query('DELETE FROM sales WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(500).send('Sale could not be eliminated');
            return;
        }

        // Eliminado
        res.send('Sale successfully deleted');
    } catch (error) {
        res.status(500).send(error);
    } finally {
        if (conn) conn.end();
    }
};


module.exports = { getAllSales, getSaleById, addSale, updateSale, deleteSale };
