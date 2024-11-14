const {Router} = require('express');
const {getAllUsers, getUserById, addUser, updateUser, deleteUser, loginUser}=require('../controllers/users');

const router =Router();

router.get('/',getAllUsers);
router.get('/:id',getUserById);
router.post('/', addUser);
router.post('/login', loginUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports=router;