const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.status(200).send("Hola mundo!");
});//Obtener informacion

app.get("/prueba", (req, res) => {
    res.status(200).send("Hola desde la ruta de prueba");
});//Obtener informacion

app.post("/", (req, res) => {
    res.status(200).send("Hola desde POST!");
});// Crear un nuevo recurso o acceder

app.post("/prueba", (req, res) => {
    res.status(200).send("Hola desde la ruta de prueba POST!");
});// Crear un nuevo recurso o acceder

app.put("/", (req, res) => {
    res.status(200).send("Hola desde PUT");
});//Actualizar un recurso completo

app.patch("/", (req, res) => {
    res.status(200).send("Hola desde Patch");
});//Actualizacion parcial

app.delete("/", (req, res) => {
    res.status(200).send("Hola desde delete");
});//Eliminar un recurso

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});