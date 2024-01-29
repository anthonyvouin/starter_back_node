// routes/product.route.js
import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.post("/search-by-barcode", productController.getProductByBarcode);
router.get("/google-trends/:keyword", productController.getGoogleTrends);


export default router;
