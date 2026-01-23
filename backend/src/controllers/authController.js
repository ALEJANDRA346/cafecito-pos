const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Función para generar el "Gafete" digital (Token)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto_super_seguro', {
    expiresIn: '30d', // El gafete dura 30 días
  });
};

// @desc    Autorizar usuario y devolver token
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Buscar si el usuario existe por su nombre
    const user = await User.findOne({ username });

    // 2. Si existe, verificamos la contraseña con el método mágico que creamos en el Modelo
    if (user && (await user.matchPassword(password))) {
      
      // 3. ¡Todo correcto! Devolvemos los datos y el token
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(user._id),
      });

    } else {
      res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor al intentar entrar' });
  }
};