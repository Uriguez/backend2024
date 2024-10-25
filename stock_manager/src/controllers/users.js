
const {request, response} = require = ('express');

const users = [
    {id: 1, name: 'John Doe'},
    {id: 2, name: 'Jane Doe'},
    {id: 3, name: 'Bob Smith'},

];


const getAll = (req = request, res = response) => {
        res.send(users);
    }

    const getById = (req = request, res = response) =>{
        const {id} = req.params;

        if(isNaN(id)) {
            req.status(400).send('Invalid ID');
            return;
        }

        const user = users.find(user => user.id === +id);

        if(!user){
            res.status(404).send('User not found');
            return;
        }
        res.send(user);
    }
    module.exports = {getAll, getById};