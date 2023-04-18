import mongoose from "mongoose";

const AdminWarrantySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: { type: Number },
  cost: { type: Number },
  category: { type: String },
  category_id: { type: String },
  range_min: { type: Number },
  range_max: { type: Number },
  sku: { type: String },
  status: { type: String },
  vendor: { type: String , default:"Warranty"},
});

const AdminWarranty = mongoose.model("adminWarranty", AdminWarrantySchema);

export default AdminWarranty;
