import React from 'react';
import { useLoaderData } from "@remix-run/react";
import { authenticate } from '../shopify.server';

export const loader = async ({request}) => {
  const { admin } = await authenticate.admin(request);
  const response = await admin.graphql(
    `#graphql
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            tags
          }
        }
      }
    }`
  );
  const data = await response.json();
  console.log(data);
  const { data: { products: { edges } } } = data;
  return edges;
};

const Product = () => {
  const getproductdata = useLoaderData();
  console.log("getcollectiondata", getproductdata);

  // Extract unique tags using reduce
  const uniqueTags = getproductdata.reduce((acc, product) => {
    product.node.tags.forEach(tag => {
      if (!acc.includes(tag)) {
        acc.push(tag);
      }
    });
    return acc;
  }, []);

  return (
    <div>
      {uniqueTags.map((tag, index) => (
        <p key={index}>{tag}</p>
      ))}
    </div>
  );
};

export default Product;
