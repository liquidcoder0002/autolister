import { GraphqlQueryError } from "@shopify/shopify-api";
import shopify from "../shopify.js";
// import shopify from "./shopify.js";

export const DEFAULT_PRODUCTS_COUNT = 5;
const CREATE_PRODUCTS_MUTATION = `
  mutation populateProduct($input: ProductInput!) {
    productCreate(input: $input) {
      product {
        id
        handle
        title
        variants(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export default async function productCreator(session, input, publishId) {
  const client = new shopify.api.clients.Graphql({ session });

  try {
    let product = await client.query({
      data: {
        query: CREATE_PRODUCTS_MUTATION,
        variables: {
          input: input,
        },
      },
    });

    if (product?.body?.data?.productCreate){

      try {

        if(publishId && publishId != '')
        {
          await client.query({
            data: {
              query: `mutation publishablePublish {
                publishablePublish(id: "${product.body.data.productCreate.product.id}",
                input: {
                  publicationId: "${publishId}"
                }) {
                  publishable {
                    availablePublicationCount
                    publicationCount
                  }
                  shop {
                    publicationCount
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }`,
            },
          });
          
          return product.body.data.productCreate;
        }

        

      } catch (error) {
        console.log("Error in setting product publish", error);
      }

      
    }else{
      return {};
    }
  } catch (error) {
    if (error instanceof GraphqlQueryError) {
      throw new Error(
        `${error.message}\n${JSON.stringify(error.response, null, 2)}`
      );
    } else {
      throw error;
    }
  }
}
