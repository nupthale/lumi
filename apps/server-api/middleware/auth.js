const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // 从 cookie 中获取 token
  const token = req.cookies['x-auth-token'];
  
  if (!token) {
    return res.status(401).json({ message: '请先登录' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: '登录已过期，请重新登录' });
  }
};

module.exports = authMiddleware;