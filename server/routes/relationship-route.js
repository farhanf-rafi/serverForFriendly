const express = require('express');
const {
  sendRequest,
  acceptRequest,
  getAllPendingRequest,
} = require('../controllers/relationship-controller');
const { auth } = require('../middlewares/auth');
const router = express.Router();

router.post('/send-request', auth, sendRequest);
router.put('/accept/:relationshipId', auth, acceptRequest);
router.get('/pending', auth, getAllPendingRequest);

module.exports = router;
