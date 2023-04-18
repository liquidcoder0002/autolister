import express from "express";
import Product from "../db/Models/Product.js";
import Shop from "../db/Models/Shop.js";
import WarrantyProduct from "../db/Models/WarrantyProduct.js";

const router = express.Router();

router.post("/checkWarranty", async(_req,res)=>{
    const { productIds } = _req.body;
    try {
        var warrantiesArr = [];
        var currency = "";
        
        try {
            const shopData = await Shop.findOne().select(['money_format']);

            if(shopData && shopData.money_format)
            {

            if (
                shopData.money_format.replace(/ /g, "").includes("{{amount}}")
              ) {
                currency = shopData.money_format
                      .replace(/ /g, "")
                      .replace("{{amount}}", "")
              } else if (
                shopData.money_format
                  .replace(/ /g, "")
                  .includes("{{amount_no_decimals}}")
              ) {
                currency = shopData.money_format
                      .replace(/ /g, "")
                      .replace("{{amount_no_decimals}}", "")
              } else if (
                shopData.money_format
                  .replace(/ /g, "")
                  .includes("{{amount_with_comma_separator}}")
              ) {
                currency = shopData.money_format
                      .replace(/ /g, "")
                      .replace("{{amount_with_comma_separator}}", "")
              } else if (
                shopData.money_format
                  .replace(/ /g, "")
                  .includes("{{amount_no_decimals_with_comma_separator}}")
              ) {
                currency = shopData.money_format
                .replace(/ /g, "")
                .replace("{{amount_no_decimals_with_comma_separator}}", "")
              } else if (
                shopData.money_format
                  .replace(/ /g, "")
                  .includes("{{amount_with_apostrophe_separator}}")
              ) {
                currency = shopData.money_format
                .replace(/ /g, "")
                .replace("{{amount_with_apostrophe_separator}}", "")
              }
            }

        } catch (error) {
            console.log("Error while getting shop currency", error);
        }

        const getWarrantyProduct = await Product.find({product_id:{$in:productIds}}).select(['warranty_status','warranty_product_id','variant_id','product_id']);
        console.log(getWarrantyProduct,'getWarrantyProduct');
        
        if(getWarrantyProduct && getWarrantyProduct.length > 0)
        {
          for (const product of getWarrantyProduct) {

                if(product && product.warranty_status == 'Active' && product.warranty_product_id && product.warranty_product_id.length > 0)
                {
                    try {
                        const warranties = await WarrantyProduct.find({variant_id:product.warranty_product_id}).select(['product_title','variant_price','variant_id','product_id','variant_sku']);
                        if(warranties && warranties.length > 0)
                        {
                            for (const warranty of warranties) {
                                warrantiesArr.push({
                                    product_id:product.product_id.split("gid://shopify/Product/")[1],
                                    variant_id:product.variant_id.split("gid://shopify/ProductVariant/")[1],
                                    warranty_variant_id:warranty.variant_id.split("gid://shopify/ProductVariant/")[1],
                                    warranty_product_id:warranty.product_id.split("gid://shopify/Product/")[1],
                                    title:warranty.product_title,
                                    price:currency + warranty.variant_price,
                                    sku:warranty.variant_sku,
                                });
                                // warrantiesArr[product.variant_id] = {
                                //     title:warranty.product_title,
                                //     price:warranty.variant_price,
                                // }
                            }
                            console.log(warrantiesArr,'warrantiesArr');
                        }
                    } catch (error) {
                        console.log("Error while getting warranty product", error);
                    }
                }
            }
        }

        res.status(200).send({
            warranties:warrantiesArr
        });
    } catch (error) {
        console.log("Error while getting warranty", error);
    }
    
});

export default router;