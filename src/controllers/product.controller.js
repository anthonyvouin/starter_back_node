// controllers/product.controller.js
import axios from "axios";

const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res
        .status(400)
        .json({ error: "Code-barres manquant dans le corps de la requête." });
    }

    // Utiliser l'API Open Food Facts pour obtenir des informations sur le produit par son code-barres
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (response.data.product) {
      const productInfo = {
        name: response.data.product.product_name,
        description:
          response.data.product.generic_name ||
          response.data.product.ingredients_text,
        // Ajoutez d'autres informations du produit si nécessaire
      };

      res.json(productInfo);
    } else {
      res.status(404).json({ error: "Produit non trouvé" });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la recherche du produit par code-barres :",
      error.message
    );
    res.status(500).send("Erreur serveur");
  }
};

export default { getProductByBarcode };
