import getRawBody from "raw-body";
import crypto from "crypto";

const validateWebhook = async (req, res, next) => {
  try {
    const { SHOPIFY_API_SECRET } = process.env;

    const hmac = req.get("X-Shopify-Hmac-Sha256");
    const body = await getRawBody(req);
    req.body = { ...JSON.parse(body) };

    const digest = crypto
      .createHmac("sha256", SHOPIFY_API_SECRET)
      .update(body, "utf8", "hex")
      .digest("base64");
    if (digest !== hmac) {
      return res.status(401).send("hmac validation failed");
    }
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).send("hmac validation failed");
  }
};

export default validateWebhook;