import express from "express";
import settingsApis from "../apis/setting.js";

const router = express.Router();

//get setting data to display
router.get("/getSettings", settingsApis.getSettingData);

//update setting data
router.post("/updateSettings", settingsApis.updateSettingData);

//Status Update
router.post("/updateStatus", settingsApis.updateStatus);

export default router;
