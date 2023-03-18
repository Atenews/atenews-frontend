import { procedure } from '@/server/trpc';
import { gql } from 'graphql-request';
import WPGraphQL from '@/utils/wpgraphql';

export interface Query {
  menu: {
    menuItems: {
      nodes: {
        id: string;
        url: string;
        label: string;
        parentId: string;
      }[];
    };
  };
}

const handler = procedure.query(async () => {
  const data = await WPGraphQL.request<Query>(
    gql`
        query Menus {
          menu(id: "Atenews Nav", idType: NAME) {
            menuItems(first: 50) {
              nodes {
                id
                url
                label
                parentId
              }
            }
          }
        }            
      `,
  );
  return {
    menus: data.menu.menuItems.nodes,
  };
});

export default handler;
