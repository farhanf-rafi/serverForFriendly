var express = require('express');
var router = express.Router();

const {
  registerUser,
  getAllUser,
  loginUser,
} = require('../controllers/user-controller');

router.get('/get-all-user', getAllUser);
router.post('/reg-user', registerUser);
router.post('/login', loginUser);

module.exports = router;
