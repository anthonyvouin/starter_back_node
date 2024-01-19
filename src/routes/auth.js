// routes/auth.route.js
import express from 'express';
import authController from '../controllers/auth.controller.js';
import { jwtMiddleware } from '../middleware/jwtMiddleware.js';
import  adminMiddleware  from '../middleware/adminMiddleware.js';


const router = express.Router();

// Route de création de compte
router.post('/register', authController.registerUser);
//Route de connexion
router.post('/login', authController.loginUser);
//Route deconnéxion
router.post('/logout', jwtMiddleware, authController.logoutUser);
// Route suppréssion de compte
router.delete('/delete-account', jwtMiddleware, authController.deleteUser);
// Route de mise à jour des informations du compte
router.put('/update-account', jwtMiddleware, authController.updateUser);
// Route pour mettre à jour le mot de passe
router.put('/update-password', jwtMiddleware, authController.updatePassword);


router.get('/dashboard', jwtMiddleware, adminMiddleware, (req, res) => {
    res.json({ message: 'Coucou, je suis admin !' });
  });
  
  router.get('/test',(req, res) => {
    res.json({ message: 'Coucou, je suis un test!' });
  });
  

export default router;
