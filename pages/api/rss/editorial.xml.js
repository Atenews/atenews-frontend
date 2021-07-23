import slugGenerator from '@/utils/slugGenerator';
import imageGenerator from '@/utils/imageGenerator';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';
import { Feed } from 'feed';

export default async (req, res) => {
  try {
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 20, where: { categoryId: 428 }) {
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
            nodes {
              title(format: RENDERED)
              slug
              date
              coauthors {
                nodes {
                  firstName
                  lastName
                  email
                  databaseId
                }
              }
              content
              excerpt
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              databaseId
              featuredImage {
                node {
                  sourceUrl(size: LARGE)
                }
              }
            }
          }
        }            
      `,
    );

    const feed = new Feed({
      title: 'Editorial',
      description: 'Welcome to the official student publication of AdDU. Here is a list of Editorials written by Atenews.',
      id: 'https://atenews.ph/api/rss/editorial.xml',
      link: 'https://atenews.ph/api/rss/editorial.xml',
      language: 'en',
      feedLinks: {
        atom: 'https://atenews.ph/api/atom/editorial.xml',
        rss2: 'https://atenews.ph/api/rss/editorial.xml',
      },
      author: {
        name: 'Atenews',
        email: 'atenews@addu.edu.ph',
        link: 'https://atenews.ph/',
      },
    });

    // Create each URL row
    data.posts.nodes.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `https://atenews.ph${slugGenerator(post)}`,
        link: `https://atenews.ph${slugGenerator(post)}`,
        description: post.excerpt,
        content: `<figure><img src="${imageGenerator(post.featuredImage?.node.sourceUrl, 800)}" class="type:primaryImage" /></figure>${post.content}`,
        author: [{
          name: `${post.coauthors?.nodes[0]?.firstName}`,
          email: post.coauthors?.nodes[0]?.email,
        }],
        image: post.featuredImage?.node.sourceUrl.replace('https://', 'http://') ?? null,
        date: new Date(post.date),
      });
    });

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    // Display output to user
    res.end(feed.rss2());
  } catch (e) {
    res.send(JSON.stringify(e));
  }
};
