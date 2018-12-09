import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const registerUserProducerMutation: DocumentNode = gql`
  mutation registerUserProducer($email: String!, $password: String!) {
    registerUserProducer(input: {
      email: $email,
      password: $password
    })
    {
      customer {
        id
      }
    }
  }
`;

export const authUserProducerMutation: DocumentNode = gql`
  mutation authenticateUserProducer($email: String!, $password: String!) {
    authenticateUserProducer(input:{
      email: $email,
      password: $password
    }) {
      jwtToken
    }
  }
`;

// export const resetPasswordMutation: DocumentNode = gql`
//   mutation($email: String!) {
//     resetPassword(input: {
//       email: $email
//     }) {
//       string
//     }
//   }
// `;

// export const updatePasswordMutation: DocumentNode = gql`
//   mutation($customerId: UUID!, $password: String!, $newPassword: String!) {
//     updatePassword(
//       input: {
//         customerId: $customerId,
//         password: $password,
//         newPassword: $newPassword
//       }
//     ) {
//       boolean
//     }
//   }
// `;
