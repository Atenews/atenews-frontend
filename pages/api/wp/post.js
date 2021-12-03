/* eslint-disable camelcase */
import { decode } from 'html-entities';
import admin from '@/utils/firebaseAdmin';
import trendFunction from '@/utils/trendFunction';

export default async (req, res) => {
  const {
    title, slug, date, categories_detailed, trashed, api_key, featured_photo,
  } = req.body;

  await admin.firestore().collection('error').add({
    error: 'Debug post function',
    body: req.body,
    timestamp: new Date(),
  });

  if (title && slug && date && categories_detailed && api_key === 'F9Ud;J9%aSp>K%L*+^dnhjv:HWBoO!' && trashed !== null) {
    const categories = {};
    let i = 0;
    categories_detailed.forEach((category) => {
      const { term_id, name, slug: catSlug } = category;
      categories[i] = { term_id, name, slug: catSlug };
      i += 1;
    });

    const newArticle = {
      title,
      categories,
      timestamp: new Date(date).getTime(),
      commentCount: 0,
      shareCount: 0,
      reactCount: {
        angry: 0,
        disgusted: 0,
        happy: 0,
        sad: 0,
        worried: 0,
      },
      viewsCount: 0,
      totalReactCount: 0,
      trendScore: trendFunction(0, 0, 0, 0, new Date(date).getTime()),
      votesCount: 0,
      trashed: trashed === '1',
    };
    await admin.database().ref(`articles/${slug.replace('__trashed', '')}`).set(newArticle);

    await Promise.all(categories_detailed.map(async (category) => {
      await admin.messaging().send({
        data: {
          title: decode(title),
          description: decode(category.name),
          featured_photo,
          slug,
        },
        topic: `${category.term_id}`,
      });
    }));
    res.status(200).send(newArticle);
  } else {
    res.status(500).send('WP Article is required.');
  }
};
