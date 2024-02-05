import { gql } from "@apollo/client";

export const GET_ALL_CHAIN_MINT_DETAILS = gql`
  query getAllChainDetails {
    mints(orderBy: TIMESTAMP_DESC, first: 1) {
      nodes {
        id
        tokenID
        timestamp
        from
      }
    }
  }
`;
