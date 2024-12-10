const {request, response } = ('express');
const bcrypt = require('bcrypt');
const pool = require('../db/connection');
const userQueries = require('../models/users');


const login = async (req = request,res = response) =>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400).send({
            message: "Some fields are missing"
        })
        return;
    }

    let conn;
    try{
        conn = await pool.getConnection();
        const [user] = await conn.query(userQueries.getByEmail, [email]);

        if(!user){
            res.status(404).send({
                message: "User not found"
            })
            return;
        }

        const valid = await bcrypt.compare(password, user.password);

        if(!valid){
            res.status(401).send({
                message: "Invalid credentials"
            })
            return;
        }

        res.status(200).send({
            message: "Successfully logged in",
            user
        });

    }catch(err){
        res.status(500).send(err);
        return;
    }finally{
        if (conn) conn.end();
    }
}

module.exports={
    login,
}