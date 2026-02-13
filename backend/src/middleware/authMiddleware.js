const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Buscar el token en el Header (Authorization: Bearer <token>)
    const token = req.headers.authorization.split(' ')[1]; 
    
    // 2. Verificar si es válido
    const JWT_SECRET = process.env.JWT_SECRET || 'SECRET_KEY_SIMPLE';
    
    // 3. Guardar datos del usuario en la petición
    req.userData = { userId: decodedToken.userId, username: decodedToken.username, role: decodedToken.role };
    
    // 4. Dejar pasar
    next();
  } catch (error) {
    res.status(401).json({ error: 'Autenticación fallida: Token inválido o no existe' });
  }
};