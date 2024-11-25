const { request, response } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const { clientsQueries } = require('../models/clients');

const saltRounds = 10;

//Todos los clientes registrados
const getAllClients = async (req = request, res = response) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const clients = await conn.query(clientsQueries.getAll);
    
    //Clientes Frecuentes
    const activeClients = clients.filter(client => client.is_active === 1);
    res.send(activeClients);

  } catch (error) {
    res.status(500).send(error);
    return;
  } finally {
    if (conn) conn.end();
  }
};

// Registrar cliente por su ID
const getClientID = async (req = request, res = response) => {
  const { ID } = req.params;

  if (!ID) {
    res.status(400).send('ID is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    const client = await conn.query(clientsQueries.getID, [rfc]);

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
  const { ID, first_name, last_name, birth_date, gender, phone_number, email, address } = req.body;

  if (!ID || !first_name || !last_name || !birth_date || !gender || !phone_number || !email || !address) {
    res.status(400).send('All fields are required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();
    
    // Checar que no exista un cliente con el mismo ID o correo electronico
    const existingClient = await conn.query(clientsQueries.getIDOrEmail, [ID, email]);

    if (existingClient.length > 0) {
      res.status(409).send('Client with this ID or email already exists');
      return;
    }

    const newClient = await conn.query(clientsQueries.create, [ID, first_name, last_name, birth_date, gender, phone_number, email, address]);
    
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
  const { ID } = req.params; 
  const { first_name, last_name, birth_date, gender, phone_number, email, address } = req.body; // Datos a actualizar

  if (!ID) {
    res.status(400).send('ID is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar si el cliente existe y está activo
    const client = await conn.query(clientsQueries.getID, [ID]);
    if (client.length === 0 || client[0].is_active === 0) {
      res.status(404).send('Client not found or inactive');
      return;
    }

    //Validar que no se repita el ID o email
    const existingClient = await conn.query(clientsQueries.getIDOrEmail, [ID, email]);
    if (existingClient.length > 0 && existingClient[0].ID !== ID) {
      res.status(409).send('Client with this Id or email already exists');
      return;
    }

    //Actualizar los datos del cliente
    const updatedClient = await conn.query(clientsQueries.update, [
      first_name || client[0].first_name,
      last_name || client[0].last_name,
      birth_date || client[0].birth_date,
      gender || client[0].gender,
      phone_number || client[0].phone_number,
      email || client[0].email,
      address || client[0].address,
      ID
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
  const { ID } = req.params;

  if (!ID) {
    res.status(400).send('ID is required');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    //Verificar si el cliente existe y está activo
    const client = await conn.query(clientsQueries.getID, [ID]);
    if (client.length === 0 || client[0].is_active === 0) {
      res.status(404).send('Client not found or already inactive');
      return;
    }

    //Marcar al cliente como inactivo
    const deletedClient = await conn.query(clientsQueries.delete, [ID]);
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

module.exports = { getAllClients, getClientID, addClient, updateClient, deleteClient };
