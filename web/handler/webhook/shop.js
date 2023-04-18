import Product from "../../db/Models/Product.js";
import Shop from "../../db/Models/Shop.js";
import WarrantyProduct from "../../db/Models/WarrantyProduct.js";

const shopifyShopWebhook = {
  //shop uninstall webhook
  shopUninstalled: async (shop, product) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Shop.findOneAndUpdate({ shop }, { app_status: "uninstalled" });

        await Product.deleteMany({ shop });

        await WarrantyProduct.deleteMany({ shop });

        resolve(true);
      } catch (error) {
        resolve(error);
      }
    });
  },

  shopUpdate: async (shop, responseShop) => {
    return new Promise(async (resolve, reject) => {
      try {
        const shopifyData = {
          shop: shop,
          phone: responseShop.phone,
          name: responseShop.name,
          country_code: responseShop.country_code,
          country_name: responseShop.country_name,
          access_scope: process.env.SCOPES.split(","),
          domain: responseShop.domain,
          email: responseShop.email,
          customer_email: responseShop.customer_email,
          money_format: responseShop.money_format,
          currency: responseShop.currency,
          timezone: responseShop.iana_timezone,
          address1: responseShop.address1,
          address2: responseShop.address2,
          zip: responseShop.zip,
          city: responseShop.city,
        };

        await Shop.findOneAndUpdate({ shop }, shopifyData, {
          upsert: true,
        });
        resolve(true);
      } catch (e) {
        console.log("Error in shop update webhook", e);
        resolve(true);
      }
    });
  },
};

export default shopifyShopWebhook;
