import {
  Button,
  Card,
  ChoiceList,
  Layout,
  Select,
  Stack,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import HtmlEditor from "devextreme-react/html-editor";

export function Description() {
  const [listerData, setListerData] = useState({
    collection_options: [
      {
        label: "GPS+Cell Apple Watch SE 2nd Gen 44mm Midnight Aluminum A2727",
        value: "GPS+Cell Apple Watch SE 2nd Gen 44mm Midnight Aluminum A2727",
      },
      {
        label: "GPS+Cell Apple Watch SE 2nd Gen 44mm Midnight Metal A2727",
        value: "GPS+Cell Apple Watch SE 2nd Gen 44mm Midnight Metal A2727",
      },
    ],
    collection_value:
      "GPS+Cell Apple Watch SE 2nd Gen 44mm Midnight Aluminum A2727",
    template_options: [
      { label: "temp1", value: "temp1" },
      { label: "temp2", value: "temp2" },
    ],
    template_value: "",
    template_title: "",
    Phrases_options: [
      { label: "Phrases1", value: "Phrases1" },
      { label: "Phrases2", value: "Phrases2" },
    ],
    Phrases_value: "",
    included: [
      {
        label: "Apple Watch SE 2nd Gen 44mm Midnight",
        value: "Apple Watch SE 2nd Gen 44mm Midnight",
      },
      { label: "Screen Protector", value: "Screen Protector" },
      {
        label: "No box, or other accessories.",
        value: "No box, or other accessories.",
      },
    ],
    included_value: ["Apple Watch SE 2nd Gen 44mm Midnight"],
    specifications: [
      {
        title: "Brand",
        value: [],
        type: "checkbox",
        valueOption: [
          { label: "Apple", value: "Apple" },
          { label: "Samsung", value: "Samsung" },
          { label: "OnePlus", value: "OnePlus" },
          ,
        ],
      },
      {
        title: "EMI",
        value: [],
        type: "textfield",
        valueOption: ["sxschhk435DD"],
      },
      {
        title: "Color",
        value: [],
        type: "radiobutton",
        valueOption: [
          { label: "Black", value: "Black" },
          { label: "White", value: "White" },
          { label: "Red", value: "Red" },
        ],
      },
      {
        title: "Size",
        value: [],
        type: "dropdown",
        valueOption: [
          { label: "S", value: "S" },
          { label: "M", value: "M" },
          { label: "L", value: "L" },
        ],
      },
      {
        title: "Size",
        value: [],
        type: "dropdown",
        valueOption: [
          { label: "S", value: "S" },
          { label: "M", value: "M" },
          { label: "L", value: "L" },
        ],
      },
    ],
    phrases_name: "Select Cosmetic Phrase",
    phrases_value:
      "The watch is in gently pre-owned condition. The screen, buttons, crown, and dial are all in good condition. The watch comes with a screen protector, already on the watch. The band is in excellent shape with only a few small scuffs. Please view our close up photos, as these are taken of the actual item being offered for sale.",
  });
  const [htmlText, setHtmlText] = useState("");

  //get collection data
  useEffect(() => {
    async function fetchData() {}
    fetchData();
  }, []);

  //template list change based on collection
  useEffect(() => {}, [listerData.collection_value]);

  //change value of lister Data
  function handleListerData(key, value) {
    setListerData({ ...listerData, [key]: value });
  }

  //change value of lister specification Data
  function handleListerSpecificationData(value, i) {
    const updatedAreas = { ...listerData };
    updatedAreas["specifications"][i]["value"] = value;
    setListerData(updatedAreas);
  }

  console.log("listerData", listerData);

  useEffect(() => {
    setHtmlText(`<h1
            style="text-align: center;"
            class="product-single__title"
            data-mce-style=="text-align: center;"
            >
            ${listerData.collection_value}
            </h1>
            <hr />
            <h2>
            <span
              style="color: #64bc46;" 
              data-mce-style="color: #64bc46;" 
            >
              Items included in this sale:
            </span>
            </h2>
            ${
              listerData.included_value.length &&
              `<ul>
              ${
                listerData.included_value.length &&
                listerData.included_value.map((e) => {
                  return `<li>${e}</li>`;
                })
              }
            </ul>`
            }
            <p>
            <em>
              <span
                style="color: #f53d3d;"
                data-mce-style="color: #f53d3d;"
              >
                *Please note, if it is not listed it is not included - such as
                power cables or other accessories.
              </span>
            </em>
            </p>
            <h2>
            <span
              style="color: #64bc46;"
              data-mce-style="color: #64bc46;"
            >
              Specifications:
            </span>
            </h2>
            <table
            border="1"
            style="border-collapse: collapse; width: 100%; height: 198px;"
            data-mce-style="border-collapse: collapse; width: 100%; height: 198px;"
            >
            <tbody>
              ${
                listerData.specifications.length &&
                listerData.specifications
                  .map((e) => {
                    return `<tr
                      style="height: 18px;"
                      data-mce-style="height: 18px;"
                    >
                      <td
                        style="width: 50%; height: 18px;"
                        data-mce-style="width: 50%; height: 18px;"
                      >
                        ${e.title}
                      </td>
                      <td
                        style="width: 50%; height: 18px;"
                        data-mce-style="width: 50%; height: 18px;"
                      >
                        ${Array.isArray(e.value) ? e.value.join(",") : e.value}
                      </td>
                    </tr>`;
                  })
                  .join("")
              }
            </tbody>
            </table>
            <h2>
            <span
              style="color: #64bc46;"
              data-mce-style="color: #64bc46;"
            >
              ${listerData.phrases_name}:
            </span>
            </h2>
            <p>
           ${listerData.phrases_value}
            </p>
            <br />`);
  }, [
    listerData.collection_value,
    listerData.included_value.length,
    JSON.stringify(listerData.specifications),
    listerData.phrases_value,
  ]);

  //handle save event to change title
  function handleTitleChange() {
    console.log("html: " , htmlText);
  }

  return (
    <>
      <div>
        <Button onClick={()=>{handleTitleChange()}}>Save</Button>
      </div>
      <Layout>
        <Layout.Section oneHalf>
          <Card sectioned>
            <Stack vertical>
              <div>
                <TextStyle variation="strong">Collections : </TextStyle>
                <Select
                  options={listerData.collection_options}
                  onChange={(e) => {
                    handleListerData("collection_value", e);
                  }}
                  value={listerData.collection_value}
                />
              </div>
              <div>
                <TextStyle variation="strong">Templates : </TextStyle>
                <Select
                  options={listerData.template_options}
                  onChange={(e) => {
                    handleListerData("template_value", e);
                  }}
                  value={listerData.template_value}
                />
              </div>
              <div>
                <TextStyle variation="strong">Phrases : </TextStyle>
                <Select
                  options={listerData.Phrases_options}
                  onChange={(e) => {
                    handleListerData("Phrases_value", e);
                  }}
                  value={listerData.Phrases_value}
                />
              </div>
              <TextStyle>Template : </TextStyle>
              <Stack>
                <TextStyle variation="strong">Title : </TextStyle>
                <Stack.Item fill>
                  <TextField
                    placeholder="Title"
                    onChange={(e) => {
                      handleListerData("template_title", e);
                    }}
                    value={listerData.template_title}
                  />
                </Stack.Item>
              </Stack>
              <Stack>
                <TextStyle variation="strong">What's included : </TextStyle>
                <Stack.Item fill>
                  <ChoiceList
                    allowMultiple
                    choices={listerData.included}
                    selected={listerData.included_value}
                    onChange={(e) => {
                      handleListerData("included_value", e);
                    }}
                  />
                </Stack.Item>
              </Stack>
              <Stack>
                <TextStyle variation="strong">Specification : </TextStyle>
                <Stack.Item fill vertical>
                  {listerData.specifications.length &&
                    listerData.specifications.map((e, i) => {
                      return (
                        <Stack>
                          <TextStyle>{e.title}:</TextStyle>
                          <Stack.Item fill vertical>
                            {e.type == "textfield" && (
                              <TextField
                                placeholder="Enter attribute value"
                                value={e.value}
                                onChange={(e) => {
                                  handleListerSpecificationData(e, i);
                                }}
                              />
                            )}
                            {(e.type == "checkbox" ||
                              e.type == "radiobutton") && (
                              <ChoiceList
                                allowMultiple={e.type == "checkbox"}
                                choices={e.valueOption}
                                selected={e.value}
                                onChange={(e) => {
                                  handleListerSpecificationData(e, i);
                                }}
                              />
                            )}
                            {e.type == "dropdown" && (
                              <Select
                                options={e.valueOption}
                                onChange={(e) => {
                                  handleListerSpecificationData([e], i);
                                }}
                                value={e.value[0]}
                              />
                            )}
                            <br />
                          </Stack.Item>
                        </Stack>
                      );
                    })}
                </Stack.Item>
              </Stack>
              <TextStyle>Phrases : </TextStyle>
              <Stack>
                <TextStyle variation="strong">
                  {listerData.phrases_name} :{" "}
                </TextStyle>
                <Stack.Item fill>
                  <TextField
                    multiline={4}
                    placeholder="Title"
                    onChange={(e) => {
                      handleListerData("phrases_value", e);
                    }}
                    value={listerData.phrases_value}
                  />
                </Stack.Item>
              </Stack>
            </Stack>
          </Card>
        </Layout.Section>
        <Layout.Section oneHalf>
          <div>
            <Card sectioned>
              <iframe
                style={{
                  minHeight: "100vh",
                  width: "-webkit-fill-available",
                  border: "none",
                  overflow: "none",
                }}
                srcdoc={htmlText}
              ></iframe>
            </Card>
          </div>
        </Layout.Section>
      </Layout>
    </>
  );
}
