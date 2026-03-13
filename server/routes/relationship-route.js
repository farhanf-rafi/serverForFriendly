const express = require('express');
const {
  sendRequest,
  acceptRequest,
  getAllPendingRequest,
  getAllFriend,
} = require('../controllers/relationship-controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.post('/send-request', auth, sendRequest);
router.put('/accept/:relationshipId', auth, acceptRequest);
router.get('/pending', auth, getAllPendingRequest);
router.get('/friends', auth, getAllFriend);

module.exports = router;
