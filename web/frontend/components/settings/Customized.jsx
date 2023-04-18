import React, { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Heading,
  Subheading,
  TextContainer,
  Select,
  RangeSlider,
  Button,
  RadioButton,
  Card,
  Popover,
  ActionList,
  ColorPicker,
  hsbToHex,
  Spinner,
  Toast,
} from "@shopify/polaris";
import { useAuthenticatedFetch } from "../../hooks";

export function Customized() {
  const fetch = useAuthenticatedFetch();

  const [selected, setSelected] = useState("Cursive");

  const [value, setValue] = useState("button");
  const [val, setVal] = useState("first");

  const [selectedborder, setSelectedborder] = useState("dashed");

  const [rangeValue, setRangeValue] = useState(10);

  const [popoverActive, setPopoverActive] = useState(false);

  const [popoverActive2, setPopoverActive2] = useState(false);
  const [newstate, setNewState] = useState(true);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );
  const [isLoader, setIsLoader] = useState(false);
  const [isGetLoader, setGetIsLoader] = useState(false);

  const togglePopoverActive2 = useCallback(
    () => setPopoverActive2((popoverActive2) => !popoverActive2),
    []
  );

  const [toastSetting, setToastSetting] = useState({
    active: false
  });

  const toastMarkup = toastSetting.active ? (
    <Toast
      content={toastSetting.message}
      onDismiss={() =>
        setToastSetting({ ...toastSetting, active: !toastSetting.active })
      }
      error={toastSetting.isErr}
    />
  ) : null;

  const options = [
    { label: "Cursive", value: "cursive" },
    { label: "Fantasy", value: "fantasy" },
    { label: "Monospace", value: "monospace" },
    { label: "Roboto", value: "Roboto" },
  ];

  const borderoptions = [
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" },
    { label: "Double", value: "double" },
    { label: "Inset", value: "inset" },
    { label: "Solid", value: "solid" },
  ];

  const [primaryColor, setPrimaryColor] = useState({
    hue: 231.04477611940297,
    brightness: 0.84375,
    saturation: 0.5828125,
  });

  const [secondaryColor, setSecondaryColor] = useState({
    hue: 131.04477611940297,
    brightness: 0.84375,
    saturation: 0.5828125,
  });

  const handlePrimaryColorChange = (value) => {
    let hexColor = hsbToHex(value);
    //console.log("primary color=========", hexColor)

    // setPrimaryHexColor(hexColor);
    setPrimaryColor(value);
    setPcolor(hexColor);
  };

  const handleSecondaryColorChange = (value) => {
    let hexColor = hsbToHex(value);
    //console.log("primary color=========", hexColor)

    // setSecondaryHexColor(hexColor);
    setSecondaryColor(value);
    setScolor(hexColor);
  };

  const [pcolor, setPcolor] = useState(hsbToHex(primaryColor));

  const [scolor, setScolor] = useState(hsbToHex(secondaryColor));
  const activator = (
    <Button onClick={togglePopoverActive} disclosure fullWidth>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          verticalAlign: "middle",
          gap: "5px",
        }}
      >
        <div
          className="div_main"
          style={{
            backgroundColor: `${pcolor}`,
            width: `24px`,
            height: `24px`,
            borderRadius: "100%",
          }}
        ></div>
        <span>{pcolor}</span>
      </div>
    </Button>
  );

  const activator2 = (
    <Button onClick={togglePopoverActive2} disclosure fullWidth>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          verticalAlign: "middle",
          gap: "5px",
        }}
      >
        <div
          className="div_main"
          style={{
            backgroundColor: `${scolor}`,
            width: `24px`,
            height: `24px`,
            borderRadius: "100%",
          }}
        ></div>
        <span>{scolor}</span>
      </div>
    </Button>
  );

  const btnClick = (e) => {
    for (
      let index = 0;
      index < document.querySelectorAll(".preview_main").length;
      index++
    ) {
      document
        .querySelectorAll(".preview_main")
        [index].classList.remove("mystyle");
    }
    e.target.classList.add("mystyle");
    if (newstate == true) {
      setNewState(false);
    } else if (newstate == false) {
      setNewState(true);
    }
    //console.log("eeeeeeeeeeeeeeee", e.target)
  };

  var btnfirst = document
    .querySelectorAll(".preview_main")[0]
    ?.classList?.contains("mystyle");
  var btnsecond = document
    .querySelectorAll(".preview_main")[1]
    ?.classList?.contains("mystyle");

  useEffect((e) => {
    setGetIsLoader(true);
    fetch(`/api/settings/getSettings`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        setGetIsLoader(false);
        if (data?.settingData) {
          setSelected(data.settingData.font_style);
          setVal(data.settingData.display_type);
          setSelectedborder(data.settingData.button_border);
          setPcolor(data.settingData.selected_warranty_color);
          setScolor(data.settingData.unselected_warranty_color);
          setRangeValue(data.settingData.button_radius);
        }
      })
      .catch((error) => {
        console.log("Error in get Db Product", error);
        setGetIsLoader(false);
      });
  }, []);

  function handleSaveEvent() {
    let data = {
      font_style: selected,
      display_type: value,
      button_border: selectedborder,
      selected_warranty_color: pcolor,
      unselected_warranty_color: scolor,
      button_radius: rangeValue,
    };
    console.log("Successfully Updated", toastSetting);
    setIsLoader(true);
    fetch(`/api/settings/updateSettings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((data) => {
        setIsLoader(false);
        setToastSetting({
          message: "Successfully updated !!",
          isErr: false,
          active: true,
        });
       
      })
      .catch((error) => {
        console.log("Error in get Db Product", error);

        setToastSetting({
          message: "Something went wrong, Please try again later!",
          isErr: true,
          active: true,
        });
        setIsLoader(false);
      });
  }


  return (
    <div className="m-30">
      {toastMarkup}
      {isGetLoader ? (
        <div>
          <Spinner />
        </div>
      ) : (
        <Layout>
          <Layout.Section oneHalf>
            {/* <TextContainer>Online store dashboard</TextContainer> */}
            <Card sectioned>
              <subHeading className="main-heading">
                Select Your Brands Settings
              </subHeading>
              <div className="sub-heading">
                <Select
                  label="Select Font"
                  options={options}
                  onChange={(e) => {
                    setSelected(e);
                  }}
                  value={selected}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div className="sub-heading-tc">
                  <TextContainer>Select Warranty Display Type</TextContainer>
                </div>
                <RadioButton
                  label="Button"
                  checked={value === "button"}
                  onChange={(e) => {
                    setValue("button");
                  }}
                />
                <RadioButton
                  label="Radio"
                  checked={value === "radio"}
                  onChange={(e) => {
                    setValue("radio");
                  }}
                />
              </div>
              <div className="sub-heading">
                <Select
                  label="Select Button Border"
                  options={borderoptions}
                  onChange={(value) => {
                    setSelectedborder(value);
                  }}
                  value={selectedborder}
                />
              </div>

              <div className="flex-start" style={{ height: "auto" }}>
                <div className="sub-heading-tc">
                  <TextContainer className="sub-heading">
                    Select Primary Color (Selected Warranty)
                  </TextContainer>
                </div>
                <Popover
                  active={popoverActive}
                  activator={activator}
                  autofocusTarget="first-node"
                  onClose={togglePopoverActive}
                >
                  <Popover.Section>
                    <ColorPicker
                      onChange={handlePrimaryColorChange}
                      color={primaryColor}
                    />
                  </Popover.Section>
                </Popover>
              </div>
              {/* <Select
              label="Select Secondary Color (Unselected Warranty)"
              options={scoloroptions}
              onChange={handleSelectChange3}
              value={selectedscolor}
            /> */}

              <div className="flex-start" style={{ height: "auto" }}>
                <div className="sub-heading-tc">
                  <TextContainer className="sub-heading">
                    Select Secondary Color (Unselected Warranty)
                  </TextContainer>
                </div>
                <Popover
                  active={popoverActive2}
                  activator={activator2}
                  autofocusTarget="first-node"
                  onClose={togglePopoverActive2}
                >
                  <Popover.Section>
                    <ColorPicker
                      onChange={handleSecondaryColorChange}
                      color={secondaryColor}
                    />
                  </Popover.Section>
                </Popover>
              </div>

              <div className="sub-heading">
                <RangeSlider
                  label="Select Button Radius"
                  value={rangeValue}
                  onChange={(value) => setRangeValue(value)}
                  output
                />
              </div>
              <div className="save-form-button">
                <Button loading={isLoader} onClick={() => handleSaveEvent()}>
                  Save
                </Button>
              </div>
            </Card>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card sectioned>
              {/* <LegacyStack><Text as="h6">Online store dashboard</Text></LegacyStack> */}
              {/* <Text variant="headingMd" as="h2">Online store dashboard</Text> */}
              <subHeading class="main-heading">Preview</subHeading>
              <p className="p_tag_info">Select Preffered Warranty</p>
              <div className="preview_class">
                {value === "button" ? (
                  <>
                    <button
                      onClick={btnClick}
                      className="preview_main"
                      style={{
                        border: `1px ${selectedborder}`,
                        backgroundColor: `${btnfirst ? pcolor : scolor}`,
                        borderRadius: `${rangeValue}px`,
                      }}
                    >
                      <h1
                        className="main_price"
                        style={{ fontFamily: `${selected}` }}
                      >
                        $150
                      </h1>
                      <p
                        className="warranty_year"
                        style={{ fontFamily: `${selected}` }}
                      >
                        1 Year Warranty
                      </p>
                    </button>
                    <button
                      onClick={btnClick}
                      className="preview_main"
                      style={{
                        border: `1px ${selectedborder}`,
                        backgroundColor: `${btnsecond ? pcolor : scolor}`,
                        borderRadius: `${rangeValue}px`,
                      }}
                    >
                      <h1
                        className="main_price"
                        style={{ fontFamily: `${selected}` }}
                      >
                        $150
                      </h1>
                      <p
                        className="warranty_year"
                        style={{ fontFamily: `${selected}` }}
                      >
                        1 Year Warranty
                      </p>
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ display: "flex" }}>
                      <RadioButton
                        id="first"
                        name="first"
                        checked={val === "first"}
                        onChange={(e) => {
                          setVal("first");
                        }}
                      />
                      <p
                        className="warranty_year"
                        style={{ fontFamily: `${selected}` }}
                      >
                        1 Year Warranty
                      </p>
                      <h1
                        className="main_price"
                        style={{ fontFamily: `${selected}` }}
                      >
                        $150
                      </h1>
                    </div>
                    <div style={{ display: "flex" }}>
                      <RadioButton
                        id="second"
                        name="second"
                        checked={val === "second"}
                        onChange={(e) => {
                          setVal("second");
                        }}
                      />
                      <p
                        className="warranty_year"
                        style={{ fontFamily: `${selected}` }}
                      >
                        1 Year Warranty
                      </p>
                      <h1
                        className="main_price"
                        style={{ fontFamily: `${selected}` }}
                      >
                        $150
                      </h1>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </Layout.Section>
        </Layout>
      )}
    </div>
  );
}
