const { request, response } = require('express');
const pool = require('../db/connection');
const { productsQueries } = require('../models/products');

const validMeasurementUnits = ['piece', 'meters', 'liters', 'square meters', 'cubic meters'];

// Obtener todos los productos que existen
const getAllProducts = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getAll); // Obtener todos los productos
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Obtener productos con existencias
const getProductsWithStock = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const products = await conn.query(productsQueries.getWithStock); // Obtener productos con stock > 0
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

//Obtener un producto por su ID
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

//Agregar un nuevo producto
const addProduct = async (req = request, res = response) => {
  const { product, description, stock, measurement_unit, price, discount } = req.body;

  if (!product || !measurement_unit || !price) {
    res.status(400).send('Product name, measurement unit, and price are required');
    return;
  }

  //Validar la unidad de medida que se introdujo
  if (!validMeasurementUnits.includes(measurement_unit)) {
    res.status(400).send('Invalid measurement unit');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const newProduct = await conn.query(productsQueries.create, [product, description, stock, measurement_unit, price, discount]);
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

//Actualizar un producto que ya existe
const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;
  const { product, description, stock, measurement_unit, price, discount } = req.body;

  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
    return;
  }

  // Validar la unidad de medida que se introdujo
  if (!validMeasurementUnits.includes(measurement_unit)) {
    res.status(400).send('Invalid measurement unit');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const updatedProduct = await conn.query(productsQueries.update, [product, description, stock, measurement_unit, price, discount, +id]);
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

//Vaciar la existencia de un producto
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
