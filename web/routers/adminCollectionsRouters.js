import express from "express";
import collectionApis from "../apis/adminCollection.js";

const router = express.Router()

//get shopify product route
router.post("/getAllCollection", collectionApis.getAllCollection);



export default router;
