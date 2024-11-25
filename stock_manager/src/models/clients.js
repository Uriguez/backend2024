const clientsQueries = {
  // Obtener todos los clientes
  getAll: `SELECT * FROM clients WHERE is_active = 1`,

  // Obtener un cliente por su RFC
  getByRfc: `SELECT * FROM clients WHERE rfc = ?`,

  // Obtener un cliente por su RFC o por su email (para validación al agregar o actualizar)
  getByRfcOrEmail: `SELECT * FROM clients WHERE rfc = ? OR email = ?`,

  // Crear un nuevo cliente
  create: `INSERT INTO clients (rfc, first_name, last_name, birth_date, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

  // Actualizar un cliente existente
  update: `UPDATE clients SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, phone_number = ?, email = ?, address = ? WHERE rfc = ?`,

  // Marcar un cliente como inactivo
  delete: `UPDATE clients SET is_active = 0 WHERE rfc = ?`
};

module.exports = { clientsQueries };
