import mongoose from "mongoose";

const WarrantyProductsSchema = new mongoose.Schema({
  shop: {
    type: String,
  },
  product_id: { type: String, unique: true },
  product_title: { type: String },
  product_handle: { type: String },
  product_vendor: { type: String },
  product_category: { type: String },
  product_category_id: { type: String },
  variant_id: { type: String },
  variant_sku: { type: String },
  variant_price: { type: String },
  range_min: { type: Number },
  range_max: { type: Number },
  created_at: { type: Date },
  updated_at: { type: Date },
});

const WarrantyProduct =  mongoose.model("warrantyProducts", WarrantyProductsSchema);

export default WarrantyProduct;
