import Order from "../../db/Models/Order.js";

const shopifyOrderWebhook = {
  //product Create webhook
  orderCreate: async (shop, order) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(
          "order =================================",
          JSON.stringify(order, null, 2)
        );
        if (order.line_items.length) {
          let is_warranty = false;

          for (const o of order.line_items) {
            if (
              o.properties.length > 0 &&
              o.properties.some((item) => item.name === "_warranty")
            ) {
              is_warranty = true;
              break;
            }
          }

          if (is_warranty) {
            let line_items_DB = [];
            let total_warranty_product = 0;
            let total_warranty_amount = 0;

            for (const od of order.line_items) {
              let parentProductId = "";
              let parentVariantId = "";

              if (od.properties.some((item) => item.name === "_warranty")) {
                total_warranty_product = total_warranty_product + od.quantity;
                total_warranty_amount =
                  total_warranty_amount + parseFloat(od.price) * od.quantity;

                parentProductId = `gid://shopify/Product/${
                  od.properties.filter(
                    (property) => property.name == "_parentProductId"
                  )[0].value
                }`;
                parentVariantId = `gid://shopify/ProductVariant/${
                  od.properties.filter(
                    (property) => property.name == "_parentVariantId"
                  )[0].value
                }`;
              }

              line_items_DB.push({
                product_id: `gid://shopify/Product/${od.product_id}`,
                variant_id: `gid://shopify/ProductVariant/${od.variant_id}`,
                quantity: od.quantity,
                price: od.price,
                vendor: od.vendor,
                product_title: od.title,
                variant_title: od.variant_title,
                parent_product_id: parentProductId,
                parent_variant_id: parentVariantId,
              });
            }

            let db_data = {
              order_id: `gid://shopify/Order/${order.id}`,
              order_name: order.name,
              customer: {
                first_name: order.customer.first_name,
                last_name: order.customer.last_name,
                email: order.customer.email,
              },
              billing_address: order.billing_address,
              shipping_address: order.shipping_address,
              line_items: line_items_DB,
              amount: order.total_price,
              discount: order.total_discounts,
              created_at_date: new Date().getTime(),
              created_at_timestamp: new Date().getTime(),
              total_warranty_amount,
              total_warranty_product,
            };

            await Order.findOneAndUpdate(
              { shop, order_id: order.id },
              db_data,
              {
                upsert: true,
              }
            );
          }
        }
      } catch (error) {
        console.log("Error while inserting order", order);
        resolve(error);
      }
    });
  },
};

export default shopifyOrderWebhook;
