
import Setting from "../db/Models/Setting.js";
const settingsApis = {
  //get setting data from DB
  getSettingData: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;

      let settingData = await Setting.findOne({ shop: session.shop });

      res.status(200).send({
        settingData,
      });
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },

  //update setting data from DB
  updateSettingData: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;
      let {
        font_style,
        display_type,
        button_border,
        selected_warranty_color,
        unselected_warranty_color,
        button_radius,
      } = _req.body;

      let settingData = await Setting.findOneAndUpdate(
        { shop: session.shop },
        {
          font_style,
          display_type,
          button_border,
          selected_warranty_color,
          unselected_warranty_color,
          button_radius,
        },
        {
          upsert: true,
        }
      );

      res.status(200).send("Successfully updated");
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },

  //update status of widget
  updateStatus: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;
      let { status } = _req.body;

      let settingData = Setting.findOneAndUpdate(
        { shop: session.shop },
        {
          status,
        },
        {
          upsert: true,
        }
      );

      res.status(200).send("Successfully updated");
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },
};

export default settingsApis;
