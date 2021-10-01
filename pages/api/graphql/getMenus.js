import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

export default async (req, res) => {
  if (req.method !== 'POST') {
    res.status(500).send({
      error: 'Not a POST request.',
    });
  }
  try {
    const data = await WPGraphQL.request(
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
    res.status(200).send({
      menus: data.menu.menuItems.nodes,
    });
  } catch (err) {
    res.status(500).send({
      error: err.message,
    });
  }
};
