const jwt = require('jsonwebtoken');

const isFaculty = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'Faculty') {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Unauthorized: Invalid token or not an Faculty' });
  }
};

module.exports = { isFaculty };