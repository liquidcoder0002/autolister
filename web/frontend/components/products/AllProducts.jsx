import {
  Badge,
  Button,
  Card,
  Collapsible,
  DataTable,
  DisplayText,
  Icon,
  IndexTable,
  // Pagination,
  Select,
  Stack,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import {
  QuestionMarkInverseMinor,
  AnalyticsMinor,
  SearchMinor,
} from "@shopify/polaris-icons";
import PaginationT from "../providers/Pagination";
import WarrantyProduct from "./WarrantyProduct";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
export function AllProducts() {
  const fetch = useAuthenticatedFetch();
  const [product, setProduct] = useState([]);
  const [pagination, setPagination] = useState({
    pagePerRecords: 2,
    currentPage: 1,
    totalRecords: 0,
    pagePerRecordsOptions: [
      { label: "2", value: "2" },
      { label: "15", value: "15" },
      { label: "25", value: "25" },
    ],
  });
  const [totalRecords, setTotalRecords] = useState(0)
  const [isProductClickId, setIsProductClickId] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [isProductClickIdFlag, setIsProductClickFlag] = useState(false);

  const [filter, setFilter] = useState({
    name: "",
    status: "",
    allStatus: [
      { label: "Active", value: "active" },
      { label: "Pending", value: "pending" },
      { label: "Not available", value: "not" },
    ],
  });

  //handleProductClick
  function handleProductOnclick(id) {
    setIsProductClickId(id);
    setIsProductClickFlag(!isProductClickIdFlag);
  }

  //get Products
  function getProducts(currentPage) {
    var data = {
      search: {
        name: filter.name,
        status: filter.status,
      },

      page: currentPage ? (currentPage < 1 ? 1 : currentPage) : 1,
      pagePerRecords: pagination.pagePerRecords,
    };
    // data = { cursor:endCursor };
    setIsLoader(true);
    fetch(`/api/products/getDbProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.products) && data.products) {
          let product = [];
          data.products.map((prod) => {
            product.push({
              id: prod.product_id.replace("gid://shopify/Product/", ""),
              status: "Active",
              product_id: prod.product_id.replace("gid://shopify/Product/", ""),
              handle: prod.product_handle,
              sku: prod.variant_sku,
              name: prod.product_title,
              price: prod.variant_price,
              variant_id: prod.variant_id,
              warranty_status:prod.warranty_status
            });
          });

          setProduct(product);
          setTotalRecords(data.total_records);
        }
        setIsLoader(false);
      })
      .catch((error) => {
        console.log("Error in get Db Product", error);
        setIsLoader(false);
      });
  }

  useEffect(() => {
    getProducts();
  }, [filter, pagination.pagePerRecords]);

  //filter value change
  function handleFilterChange(key, value) {
    setFilter({ ...filter, [key]: value });
  }
  //pagination value change
  function handlePaginationChange(key, value) {
    setPagination({ ...pagination, [key]: value });
  }

  //list of products
  const rowMarkupProduct =
    Array.isArray(product) &&
    product.length &&
    product.map(({ id, status, product_id, sku, name, price, variant_id,warranty_status }, index) => (
      <>
        <IndexTable.Row
          onClick={() => {
            handleProductOnclick(variant_id);
          }}
          ariaExpanded={isProductClickId}
          ariaControls={`basic-collapsible-${isProductClickId}`}
          id={variant_id}
          key={variant_id}
          position={index}
        >
          <IndexTable.Cell>
            <div className="product-table-height">
              <Stack spacing="tight" alignment="center">
                <div
                  ariaExpanded={isProductClickId}
                  ariaControls={`basic-collapsible-${isProductClickId}`}
                  className="pointer-cursor"
                  onClick={() => {
                    handleProductOnclick(variant_id);
                  }}
                >
                  <Icon source={AnalyticsMinor} />
                </div>
                <TextStyle>
                  <Badge status={warranty_status == "Active" ? "attention" : "success"}>
                    {warranty_status}
                  </Badge>
                </TextStyle>
                <Icon source={QuestionMarkInverseMinor} />
              </Stack>
            </div>
          </IndexTable.Cell>
          <IndexTable.Cell>
            <span className="primary-color">{product_id}</span>
          </IndexTable.Cell>
          <IndexTable.Cell>{sku}</IndexTable.Cell>
          <IndexTable.Cell>{name}</IndexTable.Cell>
          <IndexTable.Cell>{price}</IndexTable.Cell>
        </IndexTable.Row>
        {/* <IndexTable.Row> */}
        {/* <IndexTable.Cell> */}
        <Collapsible
          open={variant_id === isProductClickId ? true : false}
          id={`basic-collapsible-${isProductClickId}`}
          transition={{
            duration: "200ms",
            timingFunction: "ease-in-out",
          }}
          expandOnPrint
        >
          <WarrantyProduct
            variantId={isProductClickId}
            onClose={() => {
              setIsProductClickId(null);
              setIsProductClickFlag(!isProductClickIdFlag);
            }}
          />
        </Collapsible>
        {/* </IndexTable.Cell> */}
        {/* </IndexTable.Row> */}
      </>
    ));

  return (
    <div>
      <div className="m-30 flex-wrap d-flex justify-content-between align-items-center gap-20 product-icon w-50 ml-auto">
        <div className="flex-1 text-align-end">
          <TextStyle>Filter by Warranty Status:</TextStyle>
        </div>
        <div className="flex-1">
          <Select
            options={filter.allStatus}
            placeholder="Status"
            onChange={(e) => handleFilterChange("status", e)}
            value={filter.status}
          />
        </div>
        <div className="flex-1">
          <TextField
            prefix={<Icon source={SearchMinor} />}
            placeholder="Search by Name"
            onChange={(e) => handleFilterChange("name", e)}
            value={filter.name}
          />
        </div>
      </div>

      <div className="order-list m-20 pt-10">
        <Card sectioned>
          <IndexTable
            itemCount={product.length}
            loading={isLoader}
            selectable={false}
            headings={[
              { title: "Warranty Status" },
              { title: "Product ID" },
              { title: "SKU" },
              { title: "Name" },
              { title: "Price" },
            ]}
          >
            {rowMarkupProduct}
          </IndexTable>
          <Card.Section>
            <PaginationT
              pagination={pagination}
              handlePaginationChange={(key, value) =>
                handlePaginationChange(key, value)
              }
              getItems={(page) => getProducts(page)}
              items={product}
              totalRecords={totalRecords}
            />
          </Card.Section>
        </Card>
      </div>
    </div>
  );
}
