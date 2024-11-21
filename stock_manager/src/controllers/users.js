const { request, response } = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const {usersQueries} = require('../models/users');

const saltRounds = 10;

// paraObtener todos los usuarios
const getAllUsers = async (req = request, res = response) => {
 let conn; 
try{
  conn = await pool.getConnection();
  const users= await conn.query(usersQueries.getAll );
  
  res.send(users);

} catch (error){
  res.status(500).send(error);
  return;
} finally{
 if (conn) conn.end();
}
};

// para Obtener un usuario por ID
const getUserById = async (req = request, res = response) => {
  const { id } = req.params; ;//se acceda en el solicitud atreves de req
  //se tiene que validar un numero por id

  if (isNaN(id)) {
    res.status(400).send('Invalid ID');
    return;
  }

  let conn;
  try{
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getById, [+id]);

    if (user.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    res.send(user);
  }catch (error) {
    res.status(500).send(error);
  }finally{
    if(conn) conn.end();
  }

  //hacer un arrgelo donde pasa un fincion deonde debe terner TRUBUTO Y QUE REPRESENTA EL ARRGELO
 // const user = users.find((user) => user.id === +id);
  //si el variable de usuario termine el valor si a ningino se debe avisar al users
  
};

// paraAgregar un nuevo usuario
const addUser = async (req = request, res = response) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    res.status(400).send('Name is required');
    return;
  }


let conn;  
  try{
    conn = await pool.getConnection();
    const user = await conn.query(usersQueries.getByUsername, [username]);

    if(user.length > 0 ){
      res.status(409).send('Username already exits');
      return;
    }
    const hashPasssword = await bcrypt.hash(password, saltRounds);

    const newUser = await conn.query(usersQueries.create, [username, hashPasssword, email]);
    if(newUser.affectedRows === 0){
      res.status(500).send('User could not be created');
      return;
    }
    //console.log(newUser);

    res.status(201).send("user created succesfully"); 

  }catch (error){
    res.status(500).send(error);
    return;
  }finally{
    if (conn) conn.end();
  }
};


const loginUser = async(req = request, res = response) =>{
  const {username, password} = req.body;

  if(!username || !password){
    res.status(400).send('Username and Password are mandatory!');
    return;
  }

  let conn;
  try{
    conn = await pool.getConnection();

    const user = await conn.query(usersQueries.getByUsername,[username]);
    if(user.length === 0){
      res.status(400).send('Bad username or password');
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if(!passwordMatch){
      res.status(403).send('Bad username or password');
      return;
    }
    res.send('Loged in!');
  }catch(error){
    res.status(500).send(error);
  }finally{
    if(conn) conn.end();
  }
}


// Actualizar un usuario existente con encriptación de contraseña si se proporciona
const updateUser = async (req = request, res = response) => {
  const { id } = req.params; // ID del usuario
  const { username, password, email } = req.body; // Datos del usuario a actualizar

  // Validar entradas
  if (isNaN(id) || (!username && !password && !email)) {
    res.status(400).send('Invalid request. Provide valid fields to update.');
    return;
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // Verificar si el usuario existe
    const user = await conn.query(usersQueries.getById, [+id]);
    if (user.length === 0) {
      res.status(404).send('User not found');
      return;
    }

    // Generar los campos actualizados dinámicamente
    const updatedFields = {
      username: username || user[0].username,
      email: email || user[0].email,
      password: user[0].password, // Mantener la contraseña actual si no se proporciona una nueva
    };

    // Encriptar la contraseña si se proporciona
    if (password) {
      updatedFields.password = await bcrypt.hash(password, saltRounds);
    }

    // Actualizar el usuario en la base de datos
    const result = await conn.query(usersQueries.update, [
      updatedFields.username,
      updatedFields.password,
      updatedFields.email,
      +id,
    ]);

    if (result.affectedRows === 0) {
      res.status(500).send('User could not be updated');
      return;
    }

    res.send('User updated successfully');
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};


// Eliminar un usuario
const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  if (isNaN(id)) {
    res.status(400).send('Invalid request');
    return;
  }

  let coon;
  try{
    conn = await pool.getConnection();
    
    const user = await conn.query(usersQueries.getById,[+id]);
    if (user.length ===0){
      res.status(404).send('User not found')
      return;
    }

    const deleteuser = await conn.query(usersQueries.delete, [+id]);
    if (deleteuser.affectedRows === 0) {
      res.status(500).send('User could not be deleted');
      return;
    }

    res.send("User deleted succefully");
  } catch (error) {
    res.status(500).send(error);
  } finally {
    if (conn) conn.end();
  }
};

module.exports = { getAllUsers, getUserById, addUser, loginUser, updateUser, deleteUser };