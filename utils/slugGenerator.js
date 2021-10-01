const generator = (article) => `/${article.slug}`;
/* let category = '';
  let condition = null;
  if (article.categories?.nodes) {
    condition = parseInt(article.categories.nodes[0].databaseId, 10);
  } else if (article.categories_detailed?.length) {
    condition = article.categories_detailed[0].term_id;
  } else if (article.categories?.length) {
    if (article.categories[0].termId) {
      condition = article.categories[0].termId;
    } else if (article.categories[0].term_id) {
      condition = article.categories[0].term_id;
    }
  }
  switch (condition) {
    case 3:
    case 20:
    case 18:
    case 19:
    case 7:
      category = '/news';
      break;
    case 4:
    case 437:
    case 31:
      category = '/features';
      break;
    case 13:
    case 21:
    case 428:
    case 590:
      category = '/opinion';
      break;
    case 430:
    case 431:
      category = '/photos';
      break;
    default:
  } */

export default generator;
