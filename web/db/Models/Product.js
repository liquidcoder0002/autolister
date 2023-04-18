import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  shop: {
    type: String,
  },
  product_id: { type: String },
  product_title: { type: String },
  product_handle: { type: String },
  variant_id: { type: String, unique:true },
  variant_title: { type: String },
  variant_sku: { type: String },
  variant_price: { type: Number },
  warranty_product_id: { type: Array },
  product_category: { type: String },
  product_category_id: { type: String },
  warranty_status: { type: String }
});

const Product =  mongoose.model("products", ProductsSchema);

export default Product;
