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
          posts(first: 20, where: { categoryId: 3 }) {
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
      title: 'News',
      description: 'Welcome to the official student publication of AdDU. Here is a list of News written by Atenews.',
      id: 'https://atenews.ph/api/atom/news.xml',
      link: 'https://atenews.ph/api/atom/news.xml',
      language: 'en',
      feedLinks: {
        atom: 'https://atenews.ph/api/atom/news.xml',
        rss2: 'https://atenews.ph/api/rss/news.xml',
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
        image: imageGenerator(post.featuredImage?.node.sourceUrl, 800) ?? null,
        date: new Date(post.date),
      });
    });

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    // Display output to user
    res.end(feed.atom1());
  } catch (e) {
    res.send(JSON.stringify(e));
  }
};
