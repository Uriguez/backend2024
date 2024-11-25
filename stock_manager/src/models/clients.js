const clientsQueries = {
    // Obtener todos los clientes
    getAll: `SELECT * FROM clients WHERE is_active = 1`,
  
    // Obtener un cliente por su RFC
    getID: `SELECT * FROM clients WHERE ID = ?`,
  
    // Obtener un cliente por su RFC o por su email (para validación al agregar o actualizar)
    getIDOrEmail: `SELECT * FROM clients WHERE ID = ? OR email = ?`,
  
    // Crear un nuevo cliente
    create: `INSERT INTO clients (ID, first_name, last_name, birth_date, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  
    // Actualizar un cliente existente
    update: `UPDATE clients SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, phone_number = ?, email = ?, address = ? WHERE rfc = ?`,
  
    // Marcar un cliente como inactivo
    delete: `UPDATE clients SET is_active = 0 WHERE ID = ?`
  };
  
  module.exports = { clientsQueries };
  