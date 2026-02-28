const handler = require('../utils/handler');
const Relationship = require('../models/relationship-model');
const { default: mongoose } = require('mongoose');

const sendRequest = handler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const senderId = req.user.id;
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'receiverId is required',
      });
    }

    const existingRelationship = await Relationship.findOne({
      $or: [
        { user1: senderId, user2: receiverId },
        { user1: receiverId, user2: senderId },
      ],
    });

    if (existingRelationship) {
      return res.status(409).json({
        success: false,
        message: 'Relationship already exists',
        data: existingRelationship,
      });
    }

    const newRelationship = await Relationship.create({
      user1: senderId,
      user2: receiverId,
      status: 'pending',
      actionBy: senderId,
    });

    console.log(
      `[FRIEND REQUEST] Sent | from: ${senderId} -> to: ${receiverId} | id: ${newRelationship._id}`
    );
    res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      data: newRelationship,
    });
  } catch (err) {
    console.error(`[FRIEND REQUEST] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

const acceptRequest = handler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.id;
    const { relationshipId } = req.params;

    const relationship = await Relationship.findById(relationshipId);

    if (!relationship) {
      return res
        .status(404)
        .json({ success: false, message: 'Relationship not found' });
    }

    const isPartOf =
      relationship.user1.equals(userId) || relationship.user2.equals(userId);

    if (!isPartOf) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    // Only the receiver (not the one who sent it) can accept
    if (relationship?.actionBy?.equals(userId)) {
      return res.status(403).json({
        success: false,
        message: 'You cannot accept your own request',
      });
    }

    if (relationship.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Request is already ${relationship.status}`,
      });
    }

    relationship.status = 'accepted';
    relationship.actionBy = new mongoose.Types.ObjectId(userId);
    await relationship.save();

    console.log(
      `[ACCEPT REQUEST] Accepted | relationshipId: ${relationshipId} | by: ${userId}`
    );
    res.status(200).json({
      success: true,
      message: 'Friend request accepted',
      data: relationship,
    });
  } catch (err) {
    console.error(`[ACCEPT REQUEST] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

const getAllPendingRequest = handler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const userId = req.user.id;

    const requests = await Relationship.find({
      status: 'pending',
      $or: [{ user1: userId }, { user2: userId }],
    }).populate('user1 user2', 'userName userEmail');

    // Only show requests where user is the recipient (not the one who sent it)
    const pending = requests
      .filter((rel) => !rel?.actionBy?.equals(userId))
      .map((rel) => {
        const sender = rel.user1._id.equals(rel.actionBy)
          ? rel.user1
          : rel.user2;
        const receiver = rel.user1._id.equals(rel.actionBy)
          ? rel.user2
          : rel.user1;
        return {
          _id: rel._id,
          status: rel.status,
          sender,
          receiver,
          createdAt: rel.createdAt,
          updatedAt: rel.updatedAt,
        };
      });

    console.log(
      `[PENDING REQUESTS] Fetched ${pending.length} request(s) for userId: ${userId}`
    );
    res.status(200).json({
      success: true,
      message: 'Fetched',
      data: pending,
    });
  } catch (err) {
    console.error(`[PENDING REQUESTS] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { sendRequest, acceptRequest, getAllPendingRequest };
