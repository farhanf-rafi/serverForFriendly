var express = require('express');
var router = express.Router();

const {
  registerUser,
  getAllUser,
  loginUser,
  getOwnProfile,
  editOwnProfile,
} = require('../controllers/user-controller');

//auth
router.post('/reg-user', registerUser);
router.post('/login', loginUser);

//all
router.get('/get-all-user', getAllUser);


//ownProfile
router.get("/profile/:userId",getOwnProfile)
router.put("/profile/:userId",editOwnProfile)

module.exports = router;
