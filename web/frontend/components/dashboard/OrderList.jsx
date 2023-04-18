import { Card, DataTable, EmptyState, Spinner } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import PaginationT from "../providers/Pagination";
import { useAppQuery, useAuthenticatedFetch } from "../../hooks";
export function OrderList(props) {
  const { filter, selectedDates } = props;
  const fetch = useAuthenticatedFetch();
  const [order, setOrder] = useState([]);
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
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoader, setIsLoader] = useState(false);

  //pagination value change
  function handlePaginationChange(key, value) {
    setPagination({ ...pagination, [key]: value });
  }

  //date Formate
  function dateFormatter(date) {
    var date = new Date(date);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];
  }

  //Get order from API
  function getOrders(currentPage) {
    var data = {
      search: {
        name: filter.order_no,
        email: filter.email,
      },

      page: currentPage ? (currentPage < 1 ? 1 : currentPage) : 1,
      pagePerRecords: pagination.pagePerRecords,
      created_at_start: new Date(selectedDates.start).getTime(),
      created_at_end: new Date(selectedDates.end).getTime(),
    };
    // data = { cursor:endCursor };
    setIsLoader(true);
    fetch(`/api/orders/getDbOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.orders) && data.orders) {
          let order = [];

          data.orders.map((prod) => {
            const sum = prod.line_items.reduce(
              (a, { quantity }) => a + quantity,
              0
            );
            console.log(sum);
            prod.line_items.map((e) => {});
            order.push([
              dateFormatter(prod.created_at_timestamp),
              <span className="primary-color">{prod.order_name}</span>,
              prod.total_warranty_amount,
              prod.total_warranty_product,
              sum,
              <span className="primary-color">
                {prod.order_id.replace("gid://shopify/Order/", "")}
              </span>,
              "$" + prod.amount,
            ]);
          });

          setOrder(order);
          setTotalRecords(data.total_records);
        }
        setIsLoader(false);
      })
      .catch((error) => {
        console.log("Error in get Db Product", error);
        setIsLoader(false);
      });
    handlePaginationChange("totalRecords", 5);
  }

  useEffect(() => {
    getOrders();
  }, [filter.email, filter.order_no, selectedDates.start, selectedDates.end]);

  return (
    <div className="order-list">
      {isLoader ? (
        <div className="text-align-center">
          <Spinner />
        </div>
      ) : order.length ? (
        <Card sectioned>
          <Card.Section>
            <DataTable
              columnContentTypes={[
                "text",
                "text",
                "text",
                "numeric",
                "numeric",
                "numeric",
                "numeric",
              ]}
              headings={[
                "Purchased Date",
                "Order Name",
                "Warranty Amount",
                "Warranty Products",
                "Quantity",
                "Order No",
                "Sales",
              ]}
              rows={order}
              stickyHeader
              verticalAlign="center"
            />
          </Card.Section>
          <Card.Section>
            <PaginationT
              pagination={pagination}
              handlePaginationChange={(key, value) =>
                handlePaginationChange(key, value)
              }
              getItems={(page) => getOrders(page)}
              items={order}
              totalRecords={totalRecords}
            />
          </Card.Section>
        </Card>
      ) : (
        <Card sectioned>
          <EmptyState
            heading="No orders found"
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          >
            <p>Try changing the filters or search term</p>
          </EmptyState>
        </Card>
      )}
    </div>
  );
}
