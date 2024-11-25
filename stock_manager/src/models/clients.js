const clientsQueries = {
  //Todos los clientes
  getAll: `SELECT * FROM clients WHERE is_active = 1`,

  //Cliente por su RFC
  getByRfc: `SELECT * FROM clients WHERE rfc = ?`,

  //Verifica un cliente por su RFC o por su email
  getByRfcOrEmail: `SELECT * FROM clients WHERE rfc = ? OR email = ?`,

  //Crea un nuevo cliente
  create: `INSERT INTO clients (rfc, first_name, last_name, birth_date, gender, phone_number, email, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

  //Actualiza un cliente existente
  update: `UPDATE clients SET first_name = ?, last_name = ?, birth_date = ?, gender = ?, phone_number = ?, email = ?, address = ? WHERE rfc = ?`,

  //El cliente esta como inactivo
  delete: `UPDATE clients SET is_active = 0 WHERE rfc = ?`
};

module.exports = { clientsQueries };
