// routes/product.route.js
import express from "express";
import productController from "../controllers/product.controller.js";

const router = express.Router();

router.post("/search-by-barcode", productController.getProductByBarcode);
router.get("/getNews/:keyword", productController.getNews);
router.get("/getProductStoresNearby/:productName", productController.getProductStoresNearby
);


export default router;
