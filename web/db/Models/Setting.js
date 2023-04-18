import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  shop: {
    type: String,
  },
  font_style: { type: String, default: "sans-serif" },
  display_type: { type: String, default: "button" },
  button_border: { type: String, default: "dashed" },
  selected_warranty_color: { type: String, default: "#FFFFFF" },
  unselected_warranty_color: { type: String, default: "#3CB04C" },
  button_radius: { type: Number, default: 10 },
  status: { type: Array, default: false },
});

const Setting = mongoose.model("settings", SettingsSchema);

export default Setting;
