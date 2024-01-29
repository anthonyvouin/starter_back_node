// controllers/product.controller.js
import axios from "axios";
import NewsAPI from "newsapi"; // Assurez-vous d'installer cette bibliothèque (npm install newsapi)


const newsApiKey = "3ae6919659a44d84ba1cf314087964d9"; // Remplacez par votre clé API de l'API de nouvelles

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
        brand: response.data.product.brands,
        category: response.data.product.categories,
        image: response.data.product.image_url,
        ingredients: response.data.product.ingredients_text,
        nutriments: response.data.product.nutriments,
        labels: response.data.product.labels_tags,
        additives: response.data.product.additives_tags,
        allergens: response.data.product.allergens_tags,
        packaging: response.data.product.packaging,
        countries: response.data.product.countries_tags,
        // Ajoutez d'autres champs que vous souhaitez récupérer
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

//news
const getNewsByKeyword = async (keyword) => {
  try {
    const newsapi = new NewsAPI(newsApiKey);
    const response = await newsapi.v2.everything({
      q: keyword,
      language: "fr", // Vous pouvez ajuster la langue en fonction de vos besoins
    });

    return response.articles;
  } catch (error) {
    console.error(
      "Erreur lors de la recherche des actualités :",
      error.message
    );
    throw new Error("Erreur lors de la recherche des actualités");
  }
};

const getNews = async (req, res) => {
  try {
    const { keyword } = req.params;

    if (!keyword) {
      return res
        .status(400)
        .json({ error: "Mot-clé manquant dans les paramètres de la requête." });
    }

    const newsData = await getNewsByKeyword(keyword);

    const formattedData = {
      keyword,
      news: newsData,
      message: "Actualités récupérées avec succès.",
    };

    res.json(formattedData);
  } catch (error) {
    console.error(
      "Erreur lors de la recherche des actualités :",
      error.message
    );
    res.status(500).json({
      error: "Erreur serveur lors de la recherche des actualités.",
    });
  }
};

export default { getProductByBarcode, getNews };