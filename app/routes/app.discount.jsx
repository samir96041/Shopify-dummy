import React, { useState } from 'react'
import { authenticate } from '../shopify.server';
import { FormLayout, Checkbox, TextField, Button} from '@shopify/polaris';
import { Form, useActionData, useSubmit } from "@remix-run/react";


export const action = async ({request}) => {

    const { admin } = await authenticate.admin(request);

    const formData = await request.formData();
    const dynamicTitle = formData.get("discounttitle");
    const dynamicCode = formData.get("discountcode");

const response = await admin.graphql(
  `#graphql
  mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
    discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
      codeDiscountNode {
        codeDiscount {
          ... on DiscountCodeBasic {
            title
            codes(first: 10) {
              nodes {
                code
              }
            }
            startsAt
            endsAt
            customerSelection {
              ... on DiscountCustomerAll {
                allCustomers
              }
            }
            customerGets {
              value {
                ... on DiscountPercentage {
                  percentage
                }
              }
              items {
                ... on AllDiscountItems {
                  allItems
                }
              }
            }
            appliesOncePerCustomer
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
  {
    variables: {
      "basicCodeDiscount": {
        "title": dynamicTitle,
        "code": dynamicCode,
        "startsAt": "2022-06-21T00:00:00Z",
        "endsAt": "2022-09-21T00:00:00Z",
        "customerSelection": {
          "all": true
        },
        "customerGets": {
          "value": {
            "percentage": 0.2
          },
          "items": {
            "all": true
          }
        },
        "appliesOncePerCustomer": true
      }
    },
  },
);

const data = await response.json();

    return json({discount: data}) ;
  };


const Discount = () => {

    
const actiondata = useActionData()
console.log("actiondata",actiondata)
const submit = useSubmit();
const [discountTitle, setDiscountTitle] = useState("");
const [discountCode, setDiscountCode] = useState("");
const handleSubmit = () => submit({}, { replace: true, method: "POST" });
// console.log(actionData);


return (
  <Form onSubmit={handleSubmit} method="post">
    <FormLayout>
      <TextField
        value={discountTitle}
        onChange={(value) => setDiscountTitle(value)}
        label="Discount Title"
        name="discounttitle"
        id="discounttitle"
        autoComplete="off"
      />
      <TextField
        value={discountCode}
        onChange={(value) => setDiscountCode(value)}
        label="Discount Code"
        name="discountcode"
        id="discountcode"
        autoComplete="off"
      />

      <Button submit>Create a Discount</Button>
    </FormLayout>
  </Form>
);
}

export default Discount