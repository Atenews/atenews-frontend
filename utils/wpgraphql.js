import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://wp.atenews.ph/graphql';
const token = process.env.NEXT_PUBLIC_WEB_WP_API;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: token ? `Basic ${token}` : '',
  },
});

export default graphQLClient;
