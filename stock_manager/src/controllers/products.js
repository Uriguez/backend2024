const { request, response } = require('express');
const pool = require('../db/connection');
const { productsQueries } = require('../models/products');

const validMeasurementUnits = ['piece', 'meters', 'liters', 'square meters', 'cubic meters'];

//Obtener todos los productos
const getAllProducts = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getAll); 
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Obtener productos en existencia
const getProductsWithStock = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getWithStock); 
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Obtener un producto por ID
const getProductById = async (req = request, res = response) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const product = await conn.query(productsQueries.getById, [+id]); 
    if (product.length === 0) {
      res.status(404).send('Product not found');
      return;
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Agregar un producto
const addProduct = async (req = request, res = response) => {
  const { product, description, stock, price } = req.body;

  if (!product || !price) {
    res.status(400).send('Product name and price are required');
    return;
  }

  if (!validMeasurementUnits.includes(measurement_unit)) {
    res.status(400).send('Invalid measurement unit');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const newProduct = await conn.query(productsQueries.create, [product, description, stock, price]);
    if (newProduct.affectedRows === 0) {
      res.status(500).send('Product could not be created');
      return;
    }
    res.status(201).send('Product created successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Actualizar un producto existente
const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { product, description, stock, price } = req.body;

  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
    return;
  }

  // Validar measurement_unit
  if (!validMeasurementUnits.includes(measurement_unit)) {
    res.status(400).send('Invalid measurement unit');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const updatedProduct = await conn.query(productsQueries.update, [product, description, stock, price, +id]);
    if (updatedProduct.affectedRows === 0) {
      res.status(404).send('Product not found');
      return;
    }
    res.send('Product updated successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Eliminar (desactivar) un producto
const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;
  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const deletedProduct = await conn.query(productsQueries.delete, [+id]);
    if (deletedProduct.affectedRows === 0) {
      res.status(404).send('Product not found or already deactivated');
      return;
    }
    res.send('Product deactivated successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct, getProductsWithStock };
