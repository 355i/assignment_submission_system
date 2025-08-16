import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '9900project';

/**
 * 验证 token 是否有效，并将用户信息挂载到 req.user
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next(); // 放行
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

/**
 * 角色验证中间件工厂：接受一个角色或角色数组
 * @param {string|string[]} allowedRoles
 */
export function requireRole(allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    next();
  };
}