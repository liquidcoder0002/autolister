import { Pagination, Select, TextStyle } from "@shopify/polaris";
import React from "react";

export default function PaginationT(props) {
  const { pagination, handlePaginationChange, getItems, items, totalRecords } = props;
console.log("totalRecordstotalRecords",totalRecords);
  //Pagination
  function hasNext() {
    var total = 1;
    if (totalRecords > pagination.pagePerRecords) {
      if (totalRecords > 0) {
        var total_page =
          parseInt(totalRecords) /
          parseInt(pagination.pagePerRecords);
        if (total_page > 0) {
          if (totalRecords % pagination.pagePerRecords !== 0) {
            total = Math.floor(total_page) + 1;
          } else {
            total = Math.floor(total_page);
          }
          if (total === pagination.currentPage) {
            return false;
          } else {
            return true;
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  return (
    <div>
      {" "}
      <div className="d-flex justify-content-right align-items-center">
        <TextStyle>Per Page</TextStyle>
        <div className="mr-20 ml-20">
          <Select
            options={pagination.pagePerRecordsOptions}
            onChange={(e) => {
              handlePaginationChange("pagePerRecords", e);
            }}
            value={pagination.pagePerRecords}
          />
        </div>
        <Pagination
          hasPrevious={
            pagination.currentPage === 1
              ? false
              : items.length > 0
              ? true
              : false
          }
          previousTooltip="Previous"
          onPrevious={() => {
            getItems(parseInt(pagination.currentPage) - 1);
            handlePaginationChange(
              "currentPage",
              parseInt(pagination.currentPage) - 1
            );
          }}
          hasNext={hasNext()}
          nextTooltip="Next"
          onNext={() => {
            getItems(parseInt(pagination.currentPage) + 1);
            handlePaginationChange(
              "currentPage",
              parseInt(pagination.currentPage) + 1
            );
          }}
        />
      </div>
    </div>
  );
}
