var express = require('express');
var router = express.Router();

const {
  registerUser,
  getAllUser,
  loginUser,
  getOwnProfile,
  editOwnProfile,
  searchPeople,
} = require('../controllers/user-controller');
const { auth } = require('../middlewares/auth');

//auth
router.post('/reg-user', registerUser);
router.post('/login', loginUser);

//users
router.get('/get-all-user', auth, getAllUser);
router.get('/search', auth, searchPeople);

//ownProfile
router.get('/profile/get-my-profile', auth, getOwnProfile);
router.put('/profile/edit-my-profile', auth, editOwnProfile);

module.exports = router;
