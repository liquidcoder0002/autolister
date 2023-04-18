import express from "express";
import ordersApis from "../apis/orders.js";

const router = express.Router()

//get shopify product route
router.post("/getDbOrder", ordersApis.getDbOrders);

//get analytics route
router.post("/getAnalytics", ordersApis.getAnalytics);


export default router;
