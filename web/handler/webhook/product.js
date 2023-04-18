import Product from "../../db/Models/Product.js";
import WarrantyProduct from "../../db/Models/WarrantyProduct.js";

const shopifyProductWebhook = {
  //product Create webhook
  productCreate: async (shop, product) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (product.vendor !== "Warranty") {
          if (product.variants.length) {
            for (const variants of product.variants) {
              //get warranty product
              let warranty_product = await WarrantyProduct.find({
                $and: [
                  { range_min: { $lt: Number(variants.price) } },
                  { range_max: { $gt: Number(variants.price) } },
                ],
              }).select(["variant_id"]);

              console.log("warranty_product", warranty_product);

              let warranty_variant_id = [];
              if (Array.isArray(warranty_product) && warranty_product.length) {
                warranty_product.map((e) => {
                  !warranty_variant_id.includes(e.variant_id) &&
                    warranty_variant_id.push(e.variant_id);
                });
              }

              //store data in DB
              await Product.findOneAndUpdate(
                {
                  shop: shop,
                  product_id: `gid://shopify/Product/${product?.id}`,
                  variant_id: `gid://shopify/ProductVariant/${variants.id}`,
                },
                {
                  shop: shop,
                  product_id: `gid://shopify/Product/${product.id}`,
                  product_title: product.title,
                  product_handle: product.handle,
                  product_vendor: product.vendor,
                  variant_id: `gid://shopify/ProductVariant/${variants.id}`,
                  variant_title: variants?.title,
                  variant_sku: variants?.sku,
                  variant_price: Number(variants?.price),
                  $push: {
                    warranty_product_id: { $each: warranty_variant_id },
                  },
                  warranty_status: warranty_variant_id.length
                    ? "Active"
                    : "Not Available",
                },
                {
                  upsert: true,
                }
              );
            }
          }
        }
      } catch (error) {
        resolve(error);
      }
    });
  },
  //product update webhook
  productUpdate: async (shop, product) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (product.vendor !== "Warranty") {
          if (product.variants.length) {
            for (const variants of product.variants) {
              //get warranty product
              let warranty_product = await WarrantyProduct.find({
                $and: [
                  { range_min: { $lt: Number(variants.price) } },
                  { range_max: { $gt: Number(variants.price) } },
                  { shop },
                ],
              }).select(["variant_id"]);

              console.log("warranty_product", warranty_product);

              let warranty_variant_id = [];
              if (Array.isArray(warranty_product) && warranty_product.length) {
                warranty_product.map((e) => {
                  !warranty_variant_id.includes(e.variant_id) &&
                    warranty_variant_id.push(e.variant_id);
                });
              }

              //store data in DB
              await Product.findOneAndUpdate(
                {
                  shop: shop,
                  product_id: `gid://shopify/Product/${product?.id}`,
                  variant_id: `gid://shopify/ProductVariant/${variants.id}`,
                },
                {
                  shop: shop,
                  product_id: `gid://shopify/Product/${product?.id}`,
                  product_title: product.title,
                  product_handle: product.handle,
                  product_vendor: product.vendor,
                  variant_id: `gid://shopify/ProductVariant/${variants.id}`,
                  variant_title: variants?.title,
                  variant_sku: variants?.sku,
                  variant_price: Number(variants?.price),
                  warranty_product_id: warranty_variant_id,
                  warranty_status: warranty_variant_id.length
                    ? "Active"
                    : "Not Available",
                },
                {
                  upsert: true,
                }
              );
            }
          }
        }
      } catch (error) {
        resolve(error);
      }
    });
  },
  //product delete webhook
  productDelete: async (shop, product) => {
    return new Promise(async (resolve, reject) => {
      try {
        await Product.deleteMany({
          shop,
          product_id: `gid://shopify/Product/${product}`,
        });
      } catch (error) {
        resolve(error);
      }
    });
  },
};

export default shopifyProductWebhook;
