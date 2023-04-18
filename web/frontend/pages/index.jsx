import { Frame } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import "../components/general.css";
import { Header } from "../components";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { MainHeader } from "../components/MainHeader";
import { Customized } from "../components/settings";

export default function HomePage() {
  return (
    <Frame fullWidth>
      <MainHeader />
        {/* <Routes>
          <Route path="/" element={<MainHeader />}>
            <Route index element={<Header />} />
            <Route path="setting" element={<Customized />} />
          </Route>
        </Routes> */}
    </Frame>
  );
}
