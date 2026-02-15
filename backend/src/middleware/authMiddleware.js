const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 1. Validar que llegue el header
    if (!req.headers.authorization) {
        throw new Error('No hay cabecera Authorization');
    }

    const token = req.headers.authorization.split(' ')[1]; 
    
    // CORRECCIÓN 1: Usar la MISMA clave que tu login ('secreto_super_seguro')
    const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';
    
    // CORRECCIÓN 2: Crear la variable que faltaba (decodedToken)
    const decodedToken = jwt.verify(token, JWT_SECRET);
    
    // CORRECCIÓN 3: Adaptar los datos. 
    // Tu login envía { id: ... }, así que leemos .id
    req.userData = { 
        userId: decodedToken.id, // El login manda 'id', lo guardamos como userId
    };
    
    next();

  } catch (error) {
    console.error("❌ Error Auth:", error.message);
    res.status(401).json({ error: 'Autenticación fallida: Token inválido' });
  }
};