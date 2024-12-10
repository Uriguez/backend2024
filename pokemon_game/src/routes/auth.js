const { Router } = require ('express');
const { login } = require ('../controllers/auth');

const router = Router();

router.post('/login', login);

router.post('/login', async (req, res) => {

});

module.exports = router;