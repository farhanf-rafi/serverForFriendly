var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var userSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
  userPhoneNumber: String,
  fullName: String,
  bio: String,
});

userSchema.pre('save', async function () {
  if (!this.isModified('userPassword')) return;
  this.userPassword = await bcrypt.hash(this.userPassword, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.userPassword);
};

module.exports = mongoose.model('User', userSchema);
