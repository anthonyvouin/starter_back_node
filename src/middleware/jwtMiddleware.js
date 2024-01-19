// src/middleware/jwtMiddleware.js
import jwt from 'jsonwebtoken';
import { secretKey } from '../../config/db.config.js';

// Fonction pour générer un token JWT
export const generateToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn: '1h' });
};

// Middleware pour la validation du token
export const jwtMiddleware = (req, res, next) => {
  // Récupérer le token depuis l'en-tête Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ message: 'Token manquant, authentification requise.' });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide, authentification requise.' });
  }
};
