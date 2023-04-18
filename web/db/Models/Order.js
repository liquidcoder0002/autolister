import mongoose from "mongoose";

const OrdersSchema = new mongoose.Schema({
  shop: {
    type: String,
  },
  order_id: { type: String, unique: true },
  order_name: { type: String },
  customer: { type: Object },
  billing_address: { type: Object },
  shipping_address: { type: Object },
  line_items: { type: Array },
  amount: { type: Number },
  total_warranty_product: { type: Number },
  total_warranty_amount: { type: Number },
  discount: { type: Array },
  created_at_date: { type: Date },
  created_at_timestamp: { type: Number },
});

const Orders = mongoose.model("orders", OrdersSchema);

export default Orders;
