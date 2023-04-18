import Orders from "../db/Models/Order.js";

const ordersApis = {
  //get DB products
  getDbOrders: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;

      console.log("_req.body", _req.body);
      let { page, search, pagePerRecords, created_at_start, created_at_end } =
        _req.body;

      let query = { shop: session.shop };
      //search
      if (search) {
        if (search.name) {
          var s = ".*" + search.name + "*.";
          query.order_id = { $regex: new RegExp(s), $options: "i" };
        }
        // if (search.name) {
        //   var s = ".*" + search.name + "*.";
        //   query.order_name = { $regex: new RegExp(s), $options: "i" };
        // }
        if (search.email) {
          var s = ".*" + search.name + "*.";
          query.customer.email = { $regex: new RegExp(s), $options: "i" };
        }
        // if (search.name) {
        //   var s = ".*" + search.name + "*.";
        //   query.amount = { $regex: new RegExp(s), $options: "i" };
        // }
      }

      if (created_at_start || created_at_end) {
        query.created_at_timestamp = {
          $gte: Number(created_at_start),
          $lte: Number(created_at_end),
        };
      }

      console.log("query", query);
      //pagination
      if (page) page = Number(page);
      else page = 1;
      let limit = pagePerRecords;
      let skip = parseInt(page * limit) - limit;

      // console.log("query", JSON.parse(query));

      //get count of Products
      const total_records = await Orders.find(query).countDocuments();

      //get all Products added in DB
      const orders = await Orders.find(query).limit(limit).skip(skip);

      console.log("orders", orders.length);

      res.status(200).send({
        orders,
        total_records,
      });
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },

  //get Analytics
  getAnalytics: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;
      const { created_at_start, created_at_end, search } = _req.body;

      
      let query = { shop: session.shop };
      //search
      if (search) {
        if (search.name) {
          var s = ".*" + search.name + "*.";
          query.order_id = { $regex: new RegExp(s), $options: "i" };
        }
        if (search.email) {
          var s = ".*" + search.name + "*.";
          query.customer.email = { $regex: new RegExp(s), $options: "i" };
        }
      }

      if (created_at_start || created_at_end) {
        query.created_at_timestamp = {
          $gte: Number(created_at_start),
          $lte: Number(created_at_end),
        };
      }

      let analytics = await Orders.aggregate([
        {
          $match: query,
        },
        {
          $group: {
            _id: "expression",
            total_warranty_product: { $sum: "$total_warranty_product" },
            total_warranty_amount: { $sum: "$total_warranty_amount" },
          },
        },
      ]);

      console.log("analytics", analytics);

      res.status(200).send({
        analytics,
      });
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },
};

export default ordersApis;
