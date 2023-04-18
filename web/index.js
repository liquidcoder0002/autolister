// @ts-check
import * as dotenv from "dotenv";
dotenv.config();
import cors from "cors";

import path, { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import GDPRWebhookHandlers from "./gdpr.js";
import productRouter from "./routers/productRouters.js";
import orderRouter from "./routers/orderRouters.js";
import scriptRouter from "./routers/scriptRouter.js";
import settingRouter from "./routers/settingRouter.js";
import webhookRouter from "./routers/webhookRouter.js";


//db connection
import connectDB from "./db/connect.js";

//shop model
import Shop from "./db/Models/Shop.js";

//shopify apis
import ShopifyApi from "./controllers/shopify_api.js";
import Product from "./db/Models/Product.js";
import shopifyProductApi from "./controllers/shopifyProduct.js";

//middlwares
import validateWebhook from "./middlewares/validateWebhook.js";
import shopifyProductWebhook from "./handler/webhook/product.js";
import shopifyOrderWebhook from "./handler/webhook/order.js";
import shopifyShopWebhook from "./handler/webhook/shop.js";

const PORT = parseInt(process.env.BACKEND_PORT || process.env.PORT, 10);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();
app.use(cors());

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  async (_req, res, next) => {
    const { shop, host, code, shopState } = _req.query;

    if (shop && host && code) {
      console.log("shop:", shop);

      const access_token = res.locals.shopify.session.accessToken;

      try {
        const responseShopData = await ShopifyApi.GetApiRest(
          `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/shop.json`,
          access_token
        );

        const responseShop = responseShopData && responseShopData?.shop;

        console.log("responseShop", responseShop);

        const shopData = await Shop.findOne({ shop }).select(["app_status"]);
        console.log("shopData", shopData);

        const client = new shopify.api.clients.Graphql({
          session: res.locals.shopify.session,
        });

        let getPublishId = await client.query({
          data: {
            query: `query publications {
              publications(first: 5) {
                edges {
                  node {
                    id
                    name
                    supportsFuturePublishing
                    app {
                      id
                      title
                      description
                      developerName
                    }
                  }
                }
              }
            }`,
          },
        });

        var publishId = "";

        if (
          getPublishId &&
          getPublishId?.body?.data?.publications?.edges?.length > 0
        ) {
          for (const publish of getPublishId.body.data.publications.edges) {
            if (publish.node.name == "Online Store") {
              publishId = publish.node.id;
            }
          }
        }

        if (
          shopData == null ||
          (shopData &&
            shopData.app_status &&
            shopData.app_status == "uninstalled")
        ) {
          shopifyProductApi.addProductToDB(
            res.locals.shopify.session,
            publishId
          );
        }

        await Shop.findOneAndUpdate(
          {
            shop: shop,
          },
          {
            shop: shop,
            access_token: access_token,
            phone: responseShop.phone,
            name: responseShop.name,
            country_code: responseShop.country_code,
            country_name: responseShop.country_name,
            access_scope: process.env.SCOPES.split(","),
            timestamp: new Date().getTime(),
            domain: responseShop.domain,
            email: responseShop.email,
            customer_email: responseShop.customer_email,
            money_format: responseShop.money_format,
            app_status: "installed",
            currency: responseShop.currency,
            timezone: responseShop.iana_timezone,
            address1: responseShop.address1,
            address2: responseShop.address2,
            zip: responseShop.zip,
            city: responseShop.city,
            shop_owner: responseShop.shop_owner,
            shop_plan:
              responseShop && responseShop.plan_name && responseShop.plan_name,
            publishId,
          },
          {
            upsert: true,
          }
        );

        console.log("Shop Data inserted");
        //insert shop data end

        //product update in DB

        //product update in DB end
      } catch (error) {
        console.log("Shop insert error", error);
      }
      console.log("access_token", access_token);
      const registerShopWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "shop/update",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerShopWebhook, "registerShopWebhook");

      if (registerShopWebhook) {
        console.log("Registered Shop webhook successfully...");
      }

      //register product webhook
      const registerProductCreateWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "products/create",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerProductCreateWebhook, "registerProductCreateWebhook");

      if (registerProductCreateWebhook) {
        console.log("Registered Shop webhook successfully...");
      }

      //register product delete webhook
      const registerProductDeleteWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "products/delete",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerProductDeleteWebhook, "registerProductCreateWebhook");

      if (registerProductDeleteWebhook) {
        console.log("Registered Shop webhook successfully...");
      }

      //register product update webhook
      const registerProductUpdateWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "products/update",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerProductUpdateWebhook, "registerProductCreateWebhook");

      if (registerProductUpdateWebhook) {
        console.log("Registered products update successfully...");
      }

      //register orders create webhook
      const registerOrderCreateWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "orders/create",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerOrderCreateWebhook, "registerOrderCreateWebhook");

      if (registerOrderCreateWebhook) {
        console.log("Registered Order create webhook successfully...");
      }

      const registerAppUninstallWebhook = await ShopifyApi.PostApiRest(
        `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/webhooks.json`,
        access_token,
        {
          webhook: {
            topic: "app/uninstalled",
            address: `${process.env.HOST}/hook/webhook`,
            format: "json",
          },
        }
      );

      console.log(registerAppUninstallWebhook, "registerAppUninstallWebhook");

      if (registerAppUninstallWebhook) {
        console.log("Registered app uninstall webhook successfully...");
      }

      // } catch (error) {
      //   console.log("Error trying to get access token", error);
      // }

      next();
    } else {
      res.status(400).send("Required parameters missing");
    }
  },
  shopify.redirectToShopifyOrAppRoot()
);
// app.post(
//   shopify.config.webhooks.path,
//   shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers })
// );

//Webhook Apis
app.post("/hook/webhook", validateWebhook, async (_req, res) => {
  console.log("in webhook function");
  const shop = _req.get("x-shopify-shop-domain");
  const topic = _req.get("x-shopify-topic");
  if (topic === "products/create") {
    if (_req?.body) {
      shopifyProductWebhook.productCreate(shop, _req.body);
    }

    return res.sendStatus(200);
  } else if (topic === "products/update") {
    if (_req?.body) {
      shopifyProductWebhook.productUpdate(shop, _req.body);
    }

    return res.sendStatus(200);

  } else if (topic === "products/delete") {

    if (_req?.body) {
      shopifyProductWebhook.productDelete(shop, _req.body);
    }

    return res.sendStatus(200);
  } else if (topic === "orders/create") {
    console.log("topic", topic);
    if (_req?.body) {
      shopifyOrderWebhook.orderCreate(shop, _req.body);
    }

    return res.sendStatus(200);
  } else if (topic === "shop/update") {

    if (_req?.body) {
      shopifyShopWebhook.shopUninstalled(shop, _req.body);
    }

    return res.sendStatus(200);
  } else if (topic === "app/uninstalled") {
    try {
      if (_req?.body) {
        shopifyShopWebhook.shopUninstalled(shop, _req.body);
      }

      return res.sendStatus(200);
    } catch (e) {
      console.log("Error in app uninstall webhook", e);
      return res.sendStatus(200);
    }
  }
});
app.use("/api/webhooks", validateWebhook, webhookRouter);

// All endpoints after this point will require an active session
app.use("/api/*", shopify.validateAuthenticatedSession());

app.use('/admin', async(req, res) => {
  return res.sendFile(path.join(process.cwd(),'admin','build',req.url === "/"? 'index.html':req.url));
});
app.use(express.json());

app.use("/script", scriptRouter);

app.use("/api/products", productRouter);
app.use("/api/settings", settingRouter);
app.use("/api/orders", orderRouter);

app.get("/api/products/count", async (_req, res) => {
  const countData = await shopify.api.rest.Product.count({
    session: res.locals.shopify.session,
  });
  res.status(200).send(countData);
});

app.get("/api/products/create", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});


app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log("Server is listening on port:", PORT);
  });
});