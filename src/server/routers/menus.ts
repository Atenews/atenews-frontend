import { publicProcedure } from '@/server/trpc';
import WPGraphQL, { gql } from '@/utils/wpgraphql';

export interface Query {
  menu: {
    menuItems: {
      nodes: Menu[];
    };
  };
}

const handler = publicProcedure.query(async () => {
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
