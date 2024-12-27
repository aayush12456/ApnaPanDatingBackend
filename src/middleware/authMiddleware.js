const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  jwt.verify(token, 'registerData', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = decoded; // Add user info to request
    next();
  });
};

module.exports = authMiddleware;
