const { request, response } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const { clientsQueries } = require('../models/clients');

const saltRounds = 10;

// Para obtener todos los clientes
const getAllClients = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const clients = await conn.query(clientsQueries.getAll);
    
    // Filtrar solo los clientes activos
    const activeClients = clients.filter(client => client.is_active === 1);
    res.send(activeClients);

  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end();
  }
};

// Para obtener un cliente por RFC
const getClientByRfc = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc) {
    res.status(400).send('RFC is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const client = await conn.query(clientsQueries.getByRfc, [rfc]);

    if (client.length === 0) {
      res.status(404).send('Client not found');
      return;
    }

    res.send(client);
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Para agregar un nuevo cliente
const addClient = async (req = request, res = response) => {
  const { rfc, first_name, last_name, birth_date, gender, phone_number, email, address } = req.body;

  if (!rfc || !first_name || !last_name || !birth_date || !gender || !phone_number || !email || !address) {
    res.status(400).send('All fields are required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    
    // Validar que no exista un cliente con el mismo RFC o email
    const existingClient = await conn.query(clientsQueries.getByRfcOrEmail, [rfc, email]);

    if (existingClient.length > 0) {
      res.status(409).send('Client with this RFC or email already exists');
      return;
    }

    // Insertar el nuevo cliente
    const newClient = await conn.query(clientsQueries.create, [rfc, first_name, last_name, birth_date, gender, phone_number, email, address]);
    
    if (newClient.affectedRows === 0) {
      res.status(500).send('Client could not be created');
      return;
    }

    res.status(201).send('Client created successfully');

  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Para actualizar un cliente
const updateClient = async (req = request, res = response) => {
  const { rfc } = req.params; 
  const { first_name, last_name, birth_date, gender, phone_number, email, address } = req.body; 

  if (!rfc) {
    res.status(400).send('RFC is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar si el cliente existe y está activo
    const client = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (client.length === 0 || client[0].is_active === 0) {
      res.status(404).send('Client not found or inactive');
      return;
    }

    // Validar que no se repita el RFC o email
    const existingClient = await conn.query(clientsQueries.getByRfcOrEmail, [rfc, email]);
    if (existingClient.length > 0 && existingClient[0].rfc !== rfc) {
      res.status(409).send('Client with this RFC or email already exists');
      return;
    }

    // Actualizar los datos del cliente
    const updatedClient = await conn.query(clientsQueries.update, [
      first_name || client[0].first_name,
      last_name || client[0].last_name,
      birth_date || client[0].birth_date,
      gender || client[0].gender,
      phone_number || client[0].phone_number,
      email || client[0].email,
      address || client[0].address,
      rfc
    ]);

    if (updatedClient.affectedRows === 0) {
      res.status(500).send('Client could not be updated');
      return;
    }

    res.send('Client updated successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

// Para eliminar un cliente (marcar como inactivo)
const deleteClient = async (req = request, res = response) => {
  const { rfc } = req.params;

  if (!rfc) {
    res.status(400).send('RFC is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar si el cliente existe y está activo
    const client = await conn.query(clientsQueries.getByRfc, [rfc]);
    if (client.length === 0 || client[0].is_active === 0) {
      res.status(404).send('Client not found or already inactive');
      return;
    }

    // Marcar al cliente como inactivo
    const deletedClient = await conn.query(clientsQueries.delete, [rfc]);
    if (deletedClient.affectedRows === 0) {
      res.status(500).send('Client could not be deleted');
      return;
    }

    res.send('Client marked as inactive successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = { getAllClients, getClientByRfc, addClient, updateClient, deleteClient };
