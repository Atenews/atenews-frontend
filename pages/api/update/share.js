import fetch from 'node-fetch';
import admin from '@/utils/firebaseAdmin';
import trendFunction from '@/utils/trendFunction';
import slugGenerator from '@/utils/slugGenerator';

export default async (req, res) => {
  const articles = await (await admin.database().ref('articles').once('value')).val();
  const { accessToken } = (await admin.firestore().collection('keys').doc('facebook').get()).data();
  const { bearerToken } = (await admin.firestore().collection('keys').doc('twitter').get()).data();

  await Promise.all(Object.keys(articles).slice(0, 30).map(async (slug) => {
    const article = {
      ...articles[slug],
      slug,
    };
    let data = null;
    let data2 = null;
    let twitterData = null;
    let twitterData2 = null;
    try {
      const [response, response2] = await Promise.all([
        fetch(`https://graph.facebook.com/?id=https://atenews.ph${slugGenerator(article)}&fields=engagement&access_token=${accessToken}`),
        fetch(`https://graph.facebook.com/?id=https://atenews.ph/${slug}&fields=engagement&access_token=${accessToken}`),
      ].map((p) => p.catch((e) => e)));
      data = await response.json();
      data2 = await response2.json();
    } catch (err) {
      data = null;
      data2 = null;
    }

    try {
      const [twitterResponse, twitterResponse2] = await Promise.all([
        fetch(`https://api.twitter.com/2/tweets/search/recent?query=from:atenews url:"${slugGenerator(article)}"&tweet.fields=public_metrics`, {
          method: 'get',
          headers: new fetch.Headers({
            Authorization: `Bearer ${bearerToken}`,
          }),
        }),
        fetch(`https://api.twitter.com/2/tweets/search/recent?query=from:atenews url:"/${slug}"&tweet.fields=public_metrics`, {
          method: 'get',
          headers: new fetch.Headers({
            Authorization: `Bearer ${bearerToken}`,
          }),
        }),
      ].map((p) => p.catch((e) => e)));
      twitterData = await twitterResponse.json();
      twitterData2 = await twitterResponse2.json();
    } catch (err) {
      twitterData = null;
      twitterData2 = null;
    }

    let retweetCount = 0;
    let update = false;
    try {
      if (twitterData || twitterData2) {
        if ('data' in twitterData2) {
          retweetCount += (
            twitterData2.data[0].public_metrics.retweet_count
            + twitterData2.data[0].public_metrics.quote_count
          );
          update = true;
        }
        if ('data' in twitterData) {
          retweetCount += (
            twitterData.data[0].public_metrics.retweet_count
            + twitterData.data[0].public_metrics.quote_count
          );
          update = true;
        }
        if (update) {
          await admin.database().ref(`articles/${slug}`).update({
            retweetCount,
          });
        }
      } else {
        const temp = await admin.database().ref(`articles/${slug}`).once('value');
        if (temp.exists) {
          retweetCount = 'retweetCount' in temp.val() ? temp.val().retweetCount : 0;
        }
      }
    } catch (err) {
      retweetCount = 0;
    }

    let shareCount = 0;
    update = false;
    if (data) {
      if (data.engagement) {
        shareCount += data.engagement.share_count;
        update = true;
      }

      if (data2.engagement) {
        shareCount += data2.engagement.share_count;
        update = true;
      }

      if (update) {
        await admin.database().ref(`articles/${slug}`).update({
          shareCount: shareCount + retweetCount,
          trendScore: trendFunction(
            article.commentCount,
            shareCount + retweetCount,
            article.totalReactCount,
            article.votesCount,
            article.timestamp ? new Date(article.timestamp) : 0,
          ),
        });
      } else {
        await admin.database().ref(`articles/${slug}`).update({
          shareCount: article.shareCount + retweetCount,
          trendScore: trendFunction(
            article.commentCount,
            article.shareCount + retweetCount,
            article.totalReactCount,
            article.votesCount,
            article.timestamp ? new Date(article.timestamp) : 0,
          ),
        });
      }
    } else {
      await admin.database().ref(`articles/${slug}`).update({
        shareCount: article.shareCount + retweetCount,
        trendScore: trendFunction(
          article.commentCount,
          article.shareCount + retweetCount,
          article.totalReactCount,
          article.votesCount,
          article.timestamp ? new Date(article.timestamp) : 0,
        ),
      });
    }
  }).map((p) => p.catch(() => null)));

  res.status(200).send(true);
};
