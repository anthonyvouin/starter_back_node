// controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { secretKey } from '../../config/db.config.js';

// const qui génère le token
const generateToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn: '1h' });
};

// Controller inscription
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Un compte avec cette adresse e-mail existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isAdmin: false, // Ajout d'isAdmin à false par défaut
    });

    await newUser.save();

    const token = generateToken({ email: newUser.email, userId: newUser._id });

    res.json({ message: 'Compte créé avec succès !', token });
  } catch (error) {
    console.error('Erreur lors de la création du compte:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

// Controller Connexion
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Adresse e-mail ou mot de passe incorrect.' });
    }

    const token = generateToken({ email: user.email, userId: user._id });

    res.json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

// Controller Déconnexion
const logoutUser = async (req, res) => {
  try {
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

// Controller Suppression du compte
const deleteUser = async (req, res) => {
  try {
    // Obtenez l'ID de l'utilisateur à partir du JWT vérifié
    const userId = req.user.userId;

    // Supprimez l'utilisateur de la base de données
    await User.findByIdAndDelete(userId);

    res.json({ message: 'Compte supprimé avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression du compte:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

// Controller Mise à jour des informations du compte
const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = req.user.userId;

    // Vérifier si l'e-mail est déjà utilisé par un autre utilisateur
    const isEmailTaken = await User.findOne({ email, _id: { $ne: userId } });
    if (isEmailTaken) {
      return res.status(400).json({ message: 'Cette adresse e-mail est déjà utilisée par un autre utilisateur.' });
    }

    // Mettez à jour les informations de l'utilisateur dans la base de données
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email },
      { new: true }
    );

    res.json({ message: 'Informations du compte mises à jour avec succès.', user: updatedUser });
  } catch (error) {
    console.error('Erreur lors de la mise à jour des informations du compte:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

// Controller de mise à jour de mot de passe
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.userId;

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mettez à jour le mot de passe de l'utilisateur dans la base de données
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du mot de passe:', error.message);
    res.status(500).send('Erreur serveur');
  }
};

export default { loginUser, registerUser, logoutUser, deleteUser, updateUser, updatePassword};
