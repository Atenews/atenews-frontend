// This code creates a router from the trpc library.
// This router is used to create API endpoints for the application.
// This router is passed to the createProxySSGHelpers function which
// creates a helper function for the server side rendering.
// The router has many different endpoints which are used for different
// functionality within the application.

import { router } from '@/server/trpc';

import search from './search';
import updateViewCount from './updateViewCount';
import menus from './menus';
import articles from './articles';
import authorArticles from './authorArticles';
import category from './category';
import suggestions from './suggestions';
import categories from './categories';
import home from './home';
import customPage from './customPage';
import siteMap from './sitemap';
import staff from './staff';
import article from './article';

import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import superjson from 'superjson';

export const appRouter = router({
  search,
  updateViewCount,
  menus,
  articles,
  authorArticles,
  category,
  suggestions,
  categories,
  home,
  customPage,
  siteMap,
  staff,
  article,
});

// export type definition of API
export type AppRouter = typeof appRouter;

export const ssg = createProxySSGHelpers({
  router: appRouter,
  ctx: {},
  transformer: superjson,
});
