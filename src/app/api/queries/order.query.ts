import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const allOrdersQuery: DocumentNode = gql`
  query allOrders {
    allOrders {
      nodes {
        id,
        status,
        shipping,
        createdAt,
        orderItemsByOrderId {
          totalCount
        }
      }
    }
  }
`;

export const orderByIdQuery: DocumentNode = gql`
  query orderById($orderId: UUID!) {
    orderById(id: $orderId) {
      id,
      status,
      shipping,
      createdAt,
      amount,
      currency,
      customerByCustomerId {
        firstName,
        lastName
      },
      addressByShippingAddressId {
        firstName,
        lastName
        line1,
        line2,
        company,
        city,
        country,
        postcode
      },
      orderItemsByOrderId {
        nodes {
          quantity,
          id,
          productByProductSku {
            sku,
            name
          },
          productLinksByOrderItemId {
            nodes {
              type,
              url
            }
          }
        }
      }
    }
  }
`;
