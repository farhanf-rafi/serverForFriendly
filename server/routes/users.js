var express = require('express');
var router = express.Router();

const {
  registerUser,
  getAllUser,
  loginUser,
  getOwnProfile,
  editOwnProfile,
} = require('../controllers/user-controller');
const { auth } = require('../middlewares/auth');

//auth
router.post('/reg-user', registerUser);
router.post('/login', loginUser);

//all
router.get('/get-all-user', getAllUser);

//ownProfile
router.get('/profile', auth, getOwnProfile);
router.put('/profile', auth, editOwnProfile);

module.exports = router;
