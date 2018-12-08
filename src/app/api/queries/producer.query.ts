import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';

export const currentProducerQuery: DocumentNode = gql`
  query currentProducer {
    currentProducer {
      id,
      email
    }
  }
`;
