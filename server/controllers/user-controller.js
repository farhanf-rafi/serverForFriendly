const { get } = require('node:http');
var User = require('../models/user-model');
var handler = require('../utils/handler');
const jwt = require('jsonwebtoken');
const { json } = require('node:stream/consumers');

const loginUser = handler(async (req, res) => {
  try {
    const { userEmail, userPassword } = req.body;

    if (!userEmail || !userPassword) {
      return res.status(400).json({
        success: false,
        message: 'userEmail and userPassword are required',
      });
    }

    console.log(`[LOGIN] Attempt for: ${userEmail}`);

    const user = await User.findOne({ userEmail });
    if (!user) {
      console.warn(`[LOGIN] Failed - user not found: ${userEmail}`);
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await /** @type {any} */ (user).comparePassword(
      userPassword
    );
    if (!isMatch) {
      console.warn(`[LOGIN] Failed - wrong password: ${userEmail}`);
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: '7d',
    });

    console.log(`[LOGIN] Success for: ${userEmail} | userId: ${user._id}`);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
      },
    });
  } catch (err) {
    console.error(`[LOGIN] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

const registerUser = handler(async (req, res) => {
  try {
    const { userName, userEmail, userPassword } = req.body;

    const requiredFields = { userName, userEmail, userPassword };

    const missingField = Object.keys(requiredFields).find(
      (key) => requiredFields[key] == null
    );
    if (missingField) {
      return res.status(400).json({
        success: false,
        message: `${missingField} is required`,
      });
    }

    console.log(`[REGISTER] New user: ${userEmail}`);

    const newUser = await User.create({
      userName,
      userEmail,
      userPassword
    });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: newUser._id }, secret, { expiresIn: '7d' });

    console.log(`[REGISTER] Success | userId: ${newUser._id}`);
    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      data: { token },
    });
  } catch (err) {
    console.error(`[REGISTER] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

//all users
const getAllUser = handler(async (req, res) => {
  try {
    const allUsers = await User.find().select('-userPassword');

    res.status(200).json({
      success: true,
      message: 'Fetched Users',
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

//search users

var searchPeople = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === '') {
      return res
        .status(400)
        .json({ success: false, message: 'Query parameter "q" is required' });
    }

    const regex = new RegExp(q.trim(), 'i');

    const users = await User.find({
      $or: [
        { userName: regex },
        { fullName: regex },
        { userEmail: regex },
        { userPhoneNumber: regex },
      ],
    }).select('-userPassword');

    res
      .status(200)
      .json({ success: true, message: 'Search results', data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//profile controller
const getOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const userProfile = await User.findById(userId).select('-userPassword');
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Profile fetched',
      data: { userProfile },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

var editOwnProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, userEmail, userPhoneNumber, fullName, bio } = req.body;

    const userProfile = await User.findByIdAndUpdate(
      userId,
      { userName, userEmail, userPhoneNumber, fullName, bio },
      { new: true, runValidators: true }
    ).select('-userPassword');

    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated',
      data: { userProfile },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerUser,
  getAllUser,
  loginUser,
  getOwnProfile,
  editOwnProfile,
  searchPeople,
};
