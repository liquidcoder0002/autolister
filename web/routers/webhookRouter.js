import express from "express";

const router = express.Router();

//get setting data to display
router.get("/customer_data_request", (req, res) => {
  res.status(200);
});

//update setting data
router.post("/customer_data_erasure", (req, res) => {
  res.status(200);
});

//Status Update
router.post("/shop_data_erasure", (req, res) => {
  res.status(200);
});

export default router;
