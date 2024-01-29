// controllers/product.controller.js
import axios from "axios";
import googleTrendsApi from "google-trends-api";

//route api info barcodde
const getProductByBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res
        .status(400)
        .json({ error: "Code-barres manquant dans le corps de la requête." });
    }

    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    if (response.data.product) {
      const productInfo = {
        name: response.data.product.product_name,
        description:
          response.data.product.generic_name ||
          response.data.product.ingredients_text,
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

//google trends
const getGoogleTrends = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res
        .status(400)
        .json({ error: "Mot-clé manquant dans les paramètres de la requête." });
    }

    const trendsData = await googleTrendsApi.interestOverTime({
      keyword: keyword,
    });

    if (trendsData) {
      const formattedData = {
        keyword: keyword,
        trends: trendsData,
        message: "Données de tendance Google récupérées avec succès.",
      };
      res.json(formattedData);
    } else {
      res.status(404).json({
        keyword: keyword,
        message:
          "Aucune donnée de tendance Google trouvée pour le mot-clé spécifié.",
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la recherche des tendances Google :",
      error.message
    );
    res.status(500).json({
      error: "Erreur serveur lors de la recherche des tendances Google.",
    });
  }
};

export default { getProductByBarcode, getGoogleTrends };