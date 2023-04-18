import { Card, DataTable, IndexTable, Modal } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";
export default function WarrantyProduct(props) {
  const { variantId } = props;
  const fetch = useAuthenticatedFetch();
  const [warrantyProduct, setWarrantyProduct] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (variantId) {
      setLoader(true);
      fetch(`/api/products/getWarrantyProduct?variant_id=${variantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.warranties.length) {
            let temp = [];

            data.warranties.map((e) => {
              temp.push({
                id: e.id,
                sku: e.sku,
                description: e.title,
                price:e.price,
              });
            });

            setWarrantyProduct(temp)
          }else{
            setWarrantyProduct([])
          }

          setLoader(false);
        })
        .catch((error) => {
          console.log("Error in get Db Product", error);
          setLoader(false);
        });
    }
  }, [variantId]);

  const rowMarkupProduct =
    Array.isArray(warrantyProduct) &&
    warrantyProduct.length &&
    warrantyProduct.map(({ id, sku, description, price }, index) => (
      <>
        <IndexTable.Row id={id} key={id} position={index}>
          <IndexTable.Cell> <span className="primary-color">{id.replace("gid://shopify/Product/","")}</span></IndexTable.Cell>
          <IndexTable.Cell>{sku}</IndexTable.Cell>
          <IndexTable.Cell>{description}</IndexTable.Cell>
          <IndexTable.Cell>{price}</IndexTable.Cell>
        </IndexTable.Row>
      </>
    ));

  return (
    <div className="m-20 mt-0">
      <IndexTable
        itemCount={warrantyProduct.length}
        selectable={false}
        loading={loader}
        headings={[
          { title: "Id" },
          { title: "Warranty Sku" },
          { title: "Warranty Description" },
          { title: "Price" },
        ]}
      >
        {rowMarkupProduct}
      </IndexTable>
    </div>
  );
}
