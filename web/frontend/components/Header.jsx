import { Page, Icon, Stack, Tabs, TextStyle } from "@shopify/polaris";
import { useState, useCallback, useEffect } from "react";
import NotFound from "../pages/NotFound";
import { Analytics } from "./dashboard";
import { AllProducts } from "./products";
import { Customized } from "./settings";
import {
  HomeMinor,
  SettingsMinor,
  ProductsMinor,
  OrdersMinor,
} from "@shopify/polaris-icons";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";
export function Header() {

  const fetch = useAuthenticatedFetch();
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "Dashboard",
      content: (
        <Stack spacing="extraTight">
          <Icon source={HomeMinor} color={selected == 0 ? "primary" : ""} />
          <div className={selected == 0 ? "primary-color" : ""}>
            <TextStyle>Dashboard</TextStyle>
          </div>
        </Stack>
      ),
    },
    // {
    //   id: "Order",
    //   content: (
    //     <Stack spacing="extraTight">
    //       <Icon source={OrdersMinor} color={selected == 1 ? "primary" : ""}/>
    //       <div className={selected == 1 ? "primary-color" :""}><TextStyle>Orders</TextStyle></div>
    //     </Stack>
    //   ),
    // },
    {
      id: "Product",
      content: (
        <Stack spacing="extraTight">
          <Icon source={ProductsMinor} color={selected == 1 ? "primary" : ""} />
          <div className={selected == 1 ? "primary-color" : ""}>
            <TextStyle>Products</TextStyle>
          </div>
        </Stack>
      ),
    },
    // {
    //   id: "Setting",
    //   content: (
    //     <Stack spacing="extraTight">
    //       <Icon source={SettingsMinor} color={selected == 2 ? "primary" : ""} />
    //       <div className={selected == 2 ? "primary-color" : ""}>
    //         <TextStyle>Settings</TextStyle>
    //       </div>
    //     </Stack>
    //   ),
    // },
  ];

  function componentSelection(param) {
    switch (param) {
      case 0:
        return <Analytics />;
      // case 1:
      //   return <AllOrders />;
      case 1:
        return <AllProducts />;
      case 2:
        return <Customized />;
      default:
        return <NotFound />;
    }
  }

  return (
    <Page fullWidth>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        {componentSelection(selected)}
      </Tabs>
    </Page>
  );
}
