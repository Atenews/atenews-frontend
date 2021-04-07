import { SitemapStream, streamToPromise } from 'sitemap';
import slugGenerator from '@/utils/slugGenerator';

import WPGraphQL from '@/utils/wpgraphql';
import { gql } from 'graphql-request';

export default async (req, res) => {
  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`,
      cacheTime: 600000,
    });

    const data = await WPGraphQL.request(
      gql`
        query Sitemap {
          posts(first: 30) {
            nodes {
              slug
              categories {
                nodes {
                  name
                  databaseId
                  slug
                }
              }
              databaseId
            }
          }
        }              
      `,
    );

    const categories = [
      '/',
      '/news/university',
      '/news/local',
      '/news/national',
      '/news/sports',
      '/features',
      '/features/montage',
      '/features/artists',
      '/opinion/column',
      '/opinion/editorial',
      '/opinion/blueblood',
      '/photos/featured',
    ];

    categories.forEach((category) => {
      smStream.write({
        url: category,
        changefreq: 'daily',
        priority: 0.9,
      });
    });

    // Create each URL row
    data.posts.nodes.forEach((post) => {
      smStream.write({
        url: slugGenerator(post),
        changefreq: 'daily',
        priority: 0.5,
      });
    });

    // End sitemap stream
    smStream.end();

    // XML sitemap string
    const sitemapOutput = (await streamToPromise(smStream)).toString();

    // Change headers
    res.writeHead(200, {
      'Content-Type': 'application/xml',
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch (e) {
    res.send(JSON.stringify(e));
  }
};
