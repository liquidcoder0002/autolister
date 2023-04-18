import Collection from "../db/Models/AdminCollection.js";
import Orders from "../db/Models/Order.js";

const collectionApis = {
  //get DB products
  getAllCollection: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;

      //get all Products added in DB
      const collections = await Collection.find({});

      console.log("collections", collections.length);

      res.status(200).send({
        collections,
      });
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },
};

export default collectionApis;
