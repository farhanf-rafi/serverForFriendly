const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'blocked'],
      default: 'pending',
    },
    actionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

relationshipSchema.index(
  {
    user1: 1,
    user2: 1,
  },
  { unique: true }
);

relationshipSchema.pre('validate', async function () {
  if (this.user1.toString() > this.user2.toString()) {
    [this.user1, this.user2] = [this.user2, this.user1];
  }
});

relationshipSchema.pre('save', async function () {
  if (this.user1.equals(this.user2)) {
    throw new Error('User Cant Sent Request to User Itself');
  }
});

module.exports = mongoose.model('Relationship', relationshipSchema);
