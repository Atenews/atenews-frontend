import { SitemapStream, streamToPromise } from 'sitemap';

import { appRouter } from '@/server/routers/_app';
import slugGenerator from '@/utils/slugGenerator';
import { NextApiHandler } from 'next';

const Sitemap: NextApiHandler = async (req, res) => {
  const caller = appRouter.createCaller({ req, res });

  try {
    const smStream = new SitemapStream({
      hostname: `https://${req.headers.host}`,
    });

    const [siteMapData, menusData] = await Promise.all([
      caller.siteMap(),
      caller.menus(),
    ]);

    const categories = [
      '/',
      ...menusData.menus.map((menu) => menu.url.replace('https://atenews.ph', '')),
    ];

    categories.forEach((category) => {
      smStream.write({
        url: category,
        changefreq: 'daily',
        priority: 0.9,
      });
    });

    // Create each URL row
    siteMapData.posts.nodes.forEach((post) => {
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
      'Content-Type': 'application/rss+xml',
    });

    // Display output to user
    res.end(sitemapOutput);
  } catch (e) {
    res.send(JSON.stringify(e));
  }
};

export default Sitemap;
