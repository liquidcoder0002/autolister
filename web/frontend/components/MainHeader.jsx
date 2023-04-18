import { Card, Icon, Stack, Tabs, TextStyle } from "@shopify/polaris";
import { useState, useCallback } from "react";
import NotFound from "../pages/NotFound";
import { Analytics } from "./dashboard";
import { AllOrders } from "./orders";
import { AllProducts } from "./products";
import { Support } from "./support";
import {
  HomeMinor,
  SettingsMinor,
  ProductsMinor,
  QuestionMarkMinor,
} from "@shopify/polaris-icons";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Header } from "./Header";
import { Products } from "./autoLister";

export function MainHeader() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "Warranty",
      content: (
        <Stack spacing="extraTight">
          <Icon source={HomeMinor} color={selected == 0 ? "primary" : ""} />
          <div className={selected == 0 ? "primary-color" : ""}>
            <TextStyle>Warranty</TextStyle>
          </div>
        </Stack>
      ),
    },
    {
      id: "Auto Lister",
      content: (
        <Stack spacing="extraTight">
          <Icon
            source={ProductsMinor}
            color={selected == 1 ? "primary" : ""}
          />
          <div className={selected == 1 ? "primary-color" : ""}>
            <TextStyle>Auto Lister</TextStyle>
          </div>
        </Stack>
      ),
    },
    {
      id: "Support",
      content: (
        <Stack spacing="extraTight">
          <Icon
            source={QuestionMarkMinor}
            color={selected == 2 ? "primary" : ""}
          />
          <div className={selected == 2 ? "primary-color" : ""}>
            <TextStyle>Support</TextStyle>
          </div>
        </Stack>
      ),
    },
  ];

  function componentSelection(param) {
    switch (param) {
      case 0:
        return <Header />;
      case 1:
        return <Products />;
      case 2:
        return <Support />;
      default:
        return <NotFound />;
    }
  }

  return (
    // <Card>
    <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
      {componentSelection(selected)}
    </Tabs>
    // </Card>
  );
}
