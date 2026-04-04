const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required. Token missing.',
        data: null
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT token and use process.env.JWT_SECRET
    const secret = process.env.JWT_SECRET || 'fallback_shurima_secret';
    const decoded = jwt.verify(token, secret);
    
    // Attach decoded user to req.user
    req.user = decoded; // { id, role, iat, exp }
    
    next();
  } catch (error) {
    // Return 401 if invalid or expired
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token',
      data: null
    });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required',
      data: null
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: Admins only',
      data: null
    });
  }
  
  next();
};

module.exports = {
  verifyToken,
  isAdmin
};
