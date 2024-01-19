// config/db.config.js
import mongoose from 'mongoose';

// Clé secrète pour JWT
export const secretKey = 'votre_clé_secrète';

//Connexion à la base de données 
const connectDB = async () => {
  try {
    const uri = 'mongodb+srv://root:root@cluster0.rkawcvi.mongodb.net/?retryWrites=true&w=majority';

    await mongoose.connect(uri);
    console.log('Connexion à la base de données établie');
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error.message);
    process.exit(1);
  }
};

export default connectDB;
