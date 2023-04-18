import AdminWarranty from "../db/Models/AdminWarranty.js";
import Product from "../db/Models/Product.js";
import WarrantyProduct from "../db/Models/WarrantyProduct.js";
import shopify from "../shopify.js";
import productCreator from "./shopifyProductCreate.js";


//delay
async function delay(delayInMS) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delayInMS);
  });
}


//query to call product api
const GET_PRODUCTS = `
    query productVariants($first: Int!, $cursor: String) {
      productVariants(first: $first, after: $cursor) {
          edges {
            node {
              id
              title
              price
              sku
              product {
                id
                title
                handle
                vendor
                productCategory {
                  productTaxonomyNode {
                    name
                  }
                }
              }
            }
            cursor
          }
          pageInfo {
            hasNextPage
          }
        }
    }
`;

const shopifyProductApi = {
  //shopify product api
  shopifyProductsGet: async (session, query, name, value, cursor) => {
    return new Promise(async (resolve, reject) => {
      //shopify object to call graphql apis
      const client = new shopify.api.clients.Graphql({ session });

      value = value ? value : [];
      var headers = {
        first: 50, // 50 by 50
        cursor: cursor,
        // query :`${vendor == "warranty" ? "" : "-"}vendor:'warranty'`
      };
      if (!headers.first) return reject("Pass variables in query properly!");

      //call apis using shopify object

      let response = await client.query({
        data: {
          query: query,
          variables: headers,
        },
      });

      response = response.body.data;

      if (!(response && response[name] && response[name]?.edges)) {
        return reject(
          "Not got Response data, pass name and edge properly in query!",
          response.data
        );
      }

      if (!response[name].pageInfo) {
        return reject(
          "Not got Response data, pass pageInfo properly in query!"
        );
      }

      let productData = response[name];

      let value1 = value.concat(productData.edges);

      if (!productData.pageInfo) {
        return reject(
          "Not got Response data, pass pageInfo properly in query!"
        );
      }

      const hasNext = productData.pageInfo.hasNextPage;

      if (!hasNext) {
        return resolve(value1);
      } else {
        await delay(1500);

        if (value1.length === 100) {
          return resolve(value1);
        } else {
          return resolve(
            await shopifyProductApi.shopifyProductsGet(
              session,
              query,
              name,
              value1,
              value1[value1.length - 1].cursor
            )
          );
        }
      }
    });
  },

  //get product data and add in DB
  addProductToDB: async (session, publishId) => {
    return new Promise(async (resolve, reject) => {
      //warranty product get from DB create on shopify

      //get ALL Warranty products from DB
      let warranties = await AdminWarranty.find({});
      let warranty_product = [];
      for (const warranty of warranties) {
        let input = {
          title: warranty.title,
          status: "ACTIVE",
          vendor: "Warranty",
          variants: { price: warranty.price, sku: warranty.sku, inventoryItem : { tracked:true }, inventoryPolicy: 'CONTINUE' },
          images: {src: "https://cdn.shopify.com/s/files/1/0743/3977/8875/files/paymore_logo.jpg?v=1680604284"}
        };

        let created_product = await productCreator(session, input, publishId);

        if (created_product.product.id) {
          warranty_product.push({
            id: created_product.product.id,
            variant_id: created_product.product?.variants?.edges[0]?.node?.id,
            range_min: warranty.range_min,
            range_max: warranty.range_max,
            warranty: warranty,
            product_category: warranty.category,
          });

          //store data in warranty product DB
          await WarrantyProduct.findOneAndUpdate(
            {
              shop: session.shop,
              product_id: created_product.product.id,
            },
            {
              shop: session.shop,
              product_id: created_product.product.id,
              product_title: warranty.title,
              product_handle: created_product.product.handle,
              product_vendor: warranty.vendor,
              product_category: warranty.category,
              variant_id: created_product.product?.variants?.edges[0]?.node?.id,
              variant_sku: warranty.sku,
              variant_price: warranty.price,
              range_min: warranty.range_min,
              range_max: warranty.range_max,
            },
            {
              upsert: true,
            }
          );
        }
      }

      //get shopify products
      let products = await shopifyProductApi.shopifyProductsGet(
        session,
        GET_PRODUCTS,
        "productVariants"
      );

      if (products?.length) {
        for (const prod of products) {
          let prod_temp = prod.node;

          if (prod_temp?.product?.vendor !== "Warranty") {
            let temp_w_product = [];

            //check warranties status
            if (warranty_product.length) {
              temp_w_product = warranty_product
                .filter((e) => {
                  if (
                    e.range_min < Number(prod_temp?.price) &&
                    Number(prod_temp?.price) < e.range_max
                  ) {
                    return e;
                    // if (
                    //   e.product_category ==
                    //   prod_temp?.product?.productCategory?.productTaxonomyNode?.name
                    // ) {
                    //   return e;
                    // }
                  }
                })
                .map((v) => {
                  return v.variant_id;
                });
            }

            //store data in DB
            await Product.findOneAndUpdate(
              {
                shop: session.shop,
                product_id: prod_temp?.product?.id,
                variant_id: prod_temp?.id,
              },
              {
                shop: session.shop,
                product_id: prod_temp.product.id,
                product_title: prod_temp.product.title,
                product_handle: prod_temp.product.handle,
                product_vendor: prod_temp.vendor,
                product_category:
                  prod_temp?.product?.productCategory?.productTaxonomyNode?.name,
                variant_id: prod_temp?.id,
                variant_title: prod_temp?.title,
                variant_sku: prod_temp?.sku,
                variant_price: Number(
                  prod_temp?.price
                ),
                $push: {
                  warranty_product_id: { $each: temp_w_product },
                },
                warranty_status: temp_w_product.length
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

      resolve(true);
    });
  },
};

export default shopifyProductApi;
