import { router } from '../trpc';
import search from './search';
import updateViewCount from './updateViewCount';
import menus from './menus';
import articles from './articles';
import authorArticles from './authorArticles';
import category from './category';
import suggestions from './suggestions';
import categories from './categories';

export const appRouter = router({
  search,
  updateViewCount,
  menus,
  articles,
  authorArticles,
  category,
  suggestions,
  categories,
});

// export type definition of API
export type AppRouter = typeof appRouter;
