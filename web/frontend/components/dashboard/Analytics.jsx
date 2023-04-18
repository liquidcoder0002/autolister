import {
  Card,
  Icon,
  Layout,
  Stack,
  TextStyle,
  DisplayText,
  Popover,
  DatePicker,
  Button,
  TextField,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import {
  ClockMajor,
  AnalyticsMajor,
  CalendarMinor,
} from "@shopify/polaris-icons";
import { OrderList } from "./OrderList";
import { dateFormatter } from "./dateFunction";
import { useAuthenticatedFetch } from "../../hooks";

export function Analytics() {
  const fetch = useAuthenticatedFetch();
  const [datePopoverActive, setDatePopoverActive] = useState(false);
  const [{ month, year }, setDate] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(new Date(new Date().getTime()).setDate(new Date().getDate() - 1)),
    end: new Date(),
  });
  const [filter, setFilter] = useState({
    email: "",
    order_no: "",
  });

  const [analyticsData, setAnalyticsData] = useState({
    product: 0,
    amount: 0,
  });

  //month and date change
  function handleMonthChange(month, year) {
    setDate({ month, year });
  }

  //filter value change
  function handleFilterChange(key, value) {
    setFilter({ ...filter, [key]: value });
  }

  //button text
  const buttonValue =
    dateFormatter(selectedDates.start) +
    " - " +
    dateFormatter(selectedDates.end);

  //Button for date
  const activator = (
    <Button
      icon={CalendarMinor}
      onClick={() => setDatePopoverActive(!datePopoverActive)}
      fullWidth
    >
      {buttonValue}
    </Button>
  );

  //get analytics data
  useEffect(() => {

    var data = {
      search: {
        name: filter.order_no,
        email: filter.email,
      },
      created_at_start: new Date(selectedDates.start).getTime(),
      created_at_end: new Date(selectedDates.end).getTime(),
    };

    fetch(
      `/api/orders/getAnalytics`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        if (data.analytics.length) {
          setAnalyticsData({
            product: data.analytics[0].total_warranty_product,
            amount: data.analytics[0].total_warranty_amount,
          });
        } else {
          setAnalyticsData({ product: 0, amount: 0 });
        }
      })
      .catch((error) => {
        console.log("Error in get Db Product", error);
      });
  }, [selectedDates.start, selectedDates.end, filter.email, filter.order_no]);

  return (
    <div>
      <div className="dashboard-filter">
        <Layout>
          <Layout.Section oneThird>
            <Popover
              active={datePopoverActive}
              activator={activator}
              onClose={() => setDatePopoverActive(false)}
            >
              <Card sectioned>
                <DatePicker
                  month={month}
                  year={year}
                  onChange={setSelectedDates}
                  onMonthChange={handleMonthChange}
                  selected={selectedDates}
                  multiMonth
                  allowRange
                />
              </Card>
            </Popover>
          </Layout.Section>
          <Layout.Section oneThird>
            <TextField
              placeholder="Order No."
              value={filter.order_no}
              onChange={(e) => {
                handleFilterChange("order_no", e);
              }}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <TextField
              placeholder="Email filter"
              value={filter.email}
              onChange={(e) => {
                handleFilterChange("email", e);
              }}
            />
          </Layout.Section>
        </Layout>
      </div>
      <div className="m-60 mt-0">
        <Layout>
          <Layout.Section oneHalf>
            <Card sectioned>
              <Stack alignment="center">
                <div className="icon-size">
                  <Icon source={ClockMajor} color="primary" />
                </div>
                <Stack vertical spacing="extraTight">
                  <DisplayText>
                    <span className="primary-color">{analyticsData.product}</span>
                  </DisplayText>
                  <TextStyle variation="strong">Total warranty count</TextStyle>
                </Stack>
              </Stack>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              <Stack alignment="center">
                <div className="icon-size">
                  <Icon source={AnalyticsMajor} color="primary" />
                </div>
                <Stack vertical spacing="extraTight">
                  <DisplayText>
                    <span className="primary-color">${analyticsData.amount}</span>
                  </DisplayText>
                  <TextStyle variation="strong">Total warranty sale</TextStyle>
                </Stack>
              </Stack>
            </Card>
          </Layout.Section>
        </Layout>
      </div>
      <div className="m-20">
        <OrderList filter={filter} selectedDates={selectedDates} />
      </div>
    </div>
  );
}
