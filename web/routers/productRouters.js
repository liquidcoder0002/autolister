import express from "express";
import productsApis from "../apis/products.js";
import shopifyProductApi from "../controllers/shopifyProduct.js";

const router = express.Router()

//get shopify product route
router.post("/getDbProduct", productsApis.getDbProducts);
router.get("/getWarrantyProduct", productsApis.getWarrantyProduct);

export default router;
