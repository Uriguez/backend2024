
const express = require("express");

const app = express();

const usuarios = [
  { id: 1,
    nombre: "Uriel",
    apellidos: "Castillo",
    email: "uri61220@gmail.com",
  },

  { id: 2,
    nombre: "Jesus",
    apellidos: "Alberto",
    email: "jesusgarcia@gmail.com",
  },
];

app.get("/usuarios",(req,res)=>{
    
  res.status(200).send(usuarios);
});

app.get("/usuarios/:id", (req, res) => {
const {id} = req.params;

if(isNaN(id)){
  res.status(400).send({error: "El id debe ser un número"});
  return;
}

  const usuario = usuarios.find((usuario)=> usuario.id === +id);

  if(usuario === undefined){
    res.status(404).send({error: `El usuario con id ${id} no existe`});
  return;
  };

  res.status(200).send(usuario);
});//end point

app.listen(3000, () => {
    console.log("Servidor cooriendo en http://localhost:3000")
});
