import slugGenerator from '@/utils/slugGenerator';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';
import { Feed } from 'feed';

export default async (req, res) => {
  try {
    const data = await WPGraphQL.request(
      gql`
        query Articles {
          posts(first: 20, where: { categoryId: 19 }) {
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
      title: 'National News',
      description: 'Welcome to the official student publication of AdDU. Here is a list of National News written by Atenews.',
      id: 'national-news',
      link: 'https://atenews.ph/api/rss/national-news',
      language: 'en',
      feedLinks: {
        rss2: 'https://atenews.ph/api/rss/national-news',
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
        content: post.content,
        author: post.coauthors.nodes.map((author) => ({
          name: `${author.firstName} ${author.lastName}`,
          email: author.email,
        })),
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
