import React, { useState, useCallback, useEffect } from "react";
import {
  Layout,
  Card,
} from "@shopify/polaris";

export function Support() {

  return (
    <div className="m-30">
        <div className="sub-heading">
            For support please contact us on <a href = "mailto: erik@paymore.com">erik@paymore.com</a>
        </div>
    </div>
  );
}