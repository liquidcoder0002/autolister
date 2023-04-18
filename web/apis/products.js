import Product from "../db/Models/Product.js";
import WarrantyProduct from "../db/Models/WarrantyProduct.js";

const productsApis = {
  //get DB products
  getDbProducts: async (_req, res, next) => {
    try {
      const session = res.locals.shopify.session;

      console.log("_req.body", _req.body);
      let { page, search, pagePerRecords } = _req.body;

      let query = {};
      //search
      if (search) {
        if (search.name) {
          var s = ".*" + search.name + "*.";
          query.product_title = { $regex: new RegExp(s), $options: "i" };
        }
        // if (search.name) {
        //   var s = ".*" + search.name + "*.";
        //   query.variant_sku = { $regex: new RegExp(s), $options: "i" };
        // }
        // if (search.name) {
        //   var s = ".*" + search.name + "*.";
        //   query.product_id = { $regex: new RegExp(s), $options: "i" };
        // }
        if (search.status) {
          var s = ".*" + search.status + "*.";
          query.warranty_status = { $regex: new RegExp(s), $options: "i" };
        }
        if (session.shop) {
          var s = ".*" + search.status + "*.";
          query = { ...query, shop: session.shop };
        }
      }

      console.log("query", query);
      //pagination
      if (page) page = Number(page);
      else page = 1;
      let limit = pagePerRecords;
      let skip = parseInt(page * limit) - limit;

      //get count of Products
      const total_records = await Product.find(query).countDocuments();

      //get all Products added in DB
      const products = await Product.find(query).limit(limit).skip(skip);

      console.log("products", products.length);

      res.status(200).send({
        products,
        total_records,
      });
    } catch (error) {
      console.log("Error in get Shopify Products", error);
      res.status(500).send("Something went wrong, Please try again lated!");
    }
  },

  getWarrantyProduct: async (_req, res, next) => {
    const { variant_id } = _req.query;
    try {
      var warrantiesArr = [];
      var currency = "";

      const getWarrantyProduct = await Product.find({ variant_id }).select([
        "warranty_status",
        "warranty_product_id"
      ]);
console.log("getWarrantyProduct",getWarrantyProduct);
      if (getWarrantyProduct && getWarrantyProduct.length > 0) {
        for (const product of getWarrantyProduct) {
          if (
            product &&
            product.warranty_status == "Active" &&
            product.warranty_product_id &&
            product.warranty_product_id.length > 0
          ) {
            try {
              const warranties = await WarrantyProduct.find({
                variant_id: product.warranty_product_id,
              }).select([
                "product_title",
                "product_id",
                "variant_price",
                "variant_id",
                "variant_sku",
                "variant_price",
              ]);
              if (warranties && warranties.length > 0) {
                console.log(product, "product");
                for (const warranty of warranties) {
                  warrantiesArr.push({
                    variant_id: warranty.variant_id,
                    id: warranty.product_id,
                    title: warranty.product_title,
                    price: currency + warranty.variant_price,
                    sku: warranty.variant_sku,
                  });
                  // warrantiesArr[product.variant_id] = {
                  //     title:warranty.product_title,
                  //     price:warranty.variant_price,
                  // }
                }
                console.log(warrantiesArr, "warrantiesArr");
              }
            } catch (error) {
              console.log("Error while getting warranty product", error);
            }
          }
        }
      }

      res.status(200).send({
        warranties: warrantiesArr,
      });
    } catch (error) {
      console.log("Error while getting warranty", error);
    }
  },
};

export default productsApis;
