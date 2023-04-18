import axios from "axios";

export default { 
  getRestClient: (shop, access_token) => {
    return axios.create({
      baseURL: `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}`,
      headers: {
        "X-Shopify-Access-Token": access_token,
        "Accept-Encoding": "gzip,deflate,compress"
      },
    });
  },
  getAccessToken: (client_id, client_secret, shop, code) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          url: `https://${shop}/admin/oauth/access_token`,
          method: "POST",
          headers: {
            "Accept-Encoding": "gzip,deflate,compress"
          },
          responseType: "json",
          data: {
            client_id,
            client_secret,
            code,
          }
        });

        return resolve(response.data);
      } catch (error) {
        console.log("error in get access token", error);
        return reject(error);
      }
    }),
  GetApiRest: (url, client_secret) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          url,
          method: "GET",
          headers: {
            "X-Shopify-Access-Token": client_secret,
            "Accept-Encoding": "gzip,deflate,compress"
          },
          responseType: "json",
        });
        console.log("response Access token", response.data)
        resolve(response.data);
      } catch (error) {
        console.log("error in get api rest", error);
        reject(error);
      }
    }),
  PostApiRest: (url, client_secret, data) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          url,
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": client_secret,
            "Accept-Encoding": "gzip,deflate,compress"
          },
          responseType: "json",
          data,
        });

        resolve(response.data);
      } catch (error) {
        console.log("error in post api rest", error);
        reject(error);
      }
    }),

    PostApiGraphql: (shop, client_secret, data) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          url: `https://${shop}/admin/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`,
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": client_secret,
            "Content-Type": "application/graphql",
            "Accept-Encoding": "gzip,deflate,compress"
          },
          responseType: "json",
          data,
        });

        resolve(response.data);
      } catch (error) {
        console.log("error in post api graphql", error);
        reject(error);
      }
    }),

    DeleteApiRest: (url, client_secret) =>
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios({
          url,
          method: "DELETE",
          headers: {
            "X-Shopify-Access-Token": client_secret,
            "Accept-Encoding": "gzip,deflate,compress"
          },
          responseType: "json",
  
        });
        resolve(response.data);
      } catch (error) {
        console.log("error in post api rest", error);
        reject(error);
      }
    }),
};