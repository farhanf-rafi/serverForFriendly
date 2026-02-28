const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn(
      `[AUTH] Missing or malformed token | ${req.method} ${req.originalUrl}`
    );
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');
    const decoded = /** @type {any} */ (jwt.verify(token, secret));
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.warn(
      `[AUTH] Invalid or expired token | ${req.method} ${req.originalUrl}`
    );
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};

module.exports = { auth };
