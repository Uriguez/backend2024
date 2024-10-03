const express = require("express");

const app = express();

app.get("/usuarios", (req, res) => {
const usuarios = [
    {
        id: 1,
        nombre: "Uriel",
        apellido: "Castillo ",
        email: "uri61220@gmail.com",
    },

    {
        id: 2,
        nombre: "Jesus",
        apellido: "Alberto ",
        email: "jesusgarcia1090@gmail.com",
    },
]

    res.status(200).send(usuarios);
});
app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});