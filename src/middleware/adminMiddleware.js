// middleware/adminMiddleware.js
import User from '../models/user.model.js';

const adminMiddleware = async (req, res, next) => {
  try {
    // Obtenez l'ID de l'utilisateur à partir du JWT vérifié
    const userId = req.user.userId;

    // Recherchez l'utilisateur dans la base de données
    const user = await User.findById(userId);

    // Vérifiez si l'utilisateur est administrateur
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Accès refusé. Vous n'êtes pas administrateur." });
    }

    // Si l'utilisateur est administrateur, passez à la prochaine étape
    next();
  } catch (error) {
    console.error('Erreur lors de la vérification du statut admin:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

export default adminMiddleware;
