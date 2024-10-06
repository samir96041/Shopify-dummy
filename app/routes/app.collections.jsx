import React from 'react'
import {Page, Layout, Card} from '@shopify/polaris'
import { useLoaderData } from "@remix-run/react";
import { authenticate } from '../shopify.server';

export async function loader({request}) {
    const { admin } = await authenticate.admin(request);
    const response = await admin.graphql(
        `#graphql
        query {
          collections(first: 5) {
            edges {
              node {
                id
                title
                handle
                updatedAt
                sortOrder
              }
            }
          }
        }`,
      );
      
      const data = await response.json();
      console.log(data)

      const {data : {collections:{edges}}} = data
      
    return edges ;
  }
  

const Collections = () => {
const getcollectiondata = useLoaderData()
console.log("getcollectiondata",getcollectiondata)

  return (
    <Page fullWidth>
    <Layout>
      <Layout.Section>
 {getcollectiondata.map((collection)=>{
    return(   
         <Card title="Online store dashboard" sectioned key={collection.node.id}>
          <p>{collection.node.title}</p>
        </Card>
        
        )

 })}

      </Layout.Section>
    </Layout>
  </Page>
  )
}

export default Collections