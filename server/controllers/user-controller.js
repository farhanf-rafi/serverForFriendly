var User = require('../models/user-model');
var handler = require('../utils/handler');
const jwt = require('jsonwebtoken');

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
      data:token
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
      userPassword,
      userEmail,
    });

    console.log(`[REGISTER] Success | userId: ${newUser._id}`);
    res.status(201).json({
      success: true,
      message: 'User Registered Successfully',
      data: newUser,
    });
  } catch (err) {
    console.error(`[REGISTER] Error: ${err.message}`);
    res.status(500).json({ success: false, message: err.message });
  }
});

const getAllUser = handler(async (req, res) => {
  try {
    const allUsers = await User.find().select('-userPassword');

    res.status(200).json({
      success: true,
      data: allUsers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = { registerUser, getAllUser, loginUser };
