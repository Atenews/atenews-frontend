# WordPress backend

WordPress at `wp.atenews.ph` is the content backend and source of truth for all published content. This doc lists what each WordPress thing maps to in the frontend, and how to add or change content.

## Endpoints

| Endpoint    | URL                               | Auth                                |
| ----------- | --------------------------------- | ----------------------------------- |
| WPGraphQL   | `https://wp.atenews.ph/graphql`   | Basic auth via application password |
| WP REST API | `https://wp.atenews.ph/wp-json`   | Public (read-only)                  |
| Admin       | `https://wp.atenews.ph/wp-admin/` | WordPress user login                |

The GraphQL endpoint requires authentication because the WordPress instance locks most fields behind login. The frontend sends an `Authorization: Basic <token>` header where the token is the base64 of `username:application password`. The token is stored in the `NEXT_PUBLIC_WEB_WP_API` env var.

## What maps to what

### Posts = articles

Each WordPress post is an article. The frontend reads:

| WordPress field | GraphQL field                                       | Frontend type           |
| --------------- | --------------------------------------------------- | ----------------------- |
| Post title      | `title(format: RENDERED)`                           | `Article.title`         |
| Post slug       | `slug`                                              | `Article.slug`          |
| Publish date    | `date`                                              | `Article.date`          |
| View count      | `postViews` (custom)                                | `Article.postViews`     |
| Excerpt         | `excerpt`                                           | `Article.excerpt`       |
| Content         | `content`                                           | `Article.content`       |
| Database ID     | `databaseId`                                        | `Article.databaseId`    |
| Featured image  | `featuredImage { node { sourceUrl(size: LARGE) } }` | `Article.featuredImage` |
| Authors         | `coauthors { nodes { ... } }`                       | `Article.coauthors`     |
| Categories      | `categories { nodes { ... } }`                      | `Article.categories`    |
| SEO             | `seo { fullHead, metaDesc, title }`                 | `Article.seo`           |

Authors use the PublishPress Authors plugin (the `coauthors` field). A single post can have multiple authors.

### Categories

The frontend groups posts by category slug. These slugs are referenced in code:

| Category slug     | Used by                                                      |
| ----------------- | ------------------------------------------------------------ |
| `news`            | Homepage News section, `/news/*` routes                      |
| `features`        | Homepage Features section, `/features/*` routes              |
| `opinion`         | `/opinion/*` routes                                          |
| `photos`          | `/photos/*` routes                                           |
| `editorial`       | Homepage Editorial section (1 latest)                        |
| `columns`         | Homepage Columns section (4 latest, also opinion columnists) |
| `featured-photos` | Homepage Hulagway section (1 latest)                         |
| `literary`        | Listed in nav menu                                           |

The homepage hardcodes these category names in `src/server/routers/home.ts`. If you rename a category slug in WordPress, update that file too.

### Menus

The navigation menu is the WordPress menu named **Atenews Nav**. Fetched by `src/server/routers/menus.ts`:

```graphql
menu(id: "Atenews Nav", idType: NAME) { menuItems { nodes { id url label parentId } } }
```

To add or reorder nav items, edit the menu in WordPress admin at Appearance > Menus. The menu name `Atenews Nav` must stay the same, or update the query in `menus.ts`.

Menu items are flattened to a tree client-side by `src/utils/flatListToHierarchical.ts` using `parentId`.

### Pages

Static pages (Terms and Conditions, Privacy Policy) are WordPress pages, not posts. Fetched by `src/server/routers/customPage.ts`:

```graphql
page(id: "<slug>", idType: URI) { content title date seo { ... } }
```

Routes:

- `/terms-and-conditions` reads the page with slug `terms-and-conditions`
- `/privacy-policy` reads the page with slug `privacy-policy`

To add a new static page, create it in WordPress and add a route under `src/pages/` that calls `caller.customPage({ slug })`.

### Staff

The staff list does NOT come from GraphQL. It uses a custom WP REST route registered by a plugin:

```
GET https://wp.atenews.ph/wp-json/atenews/v1/staffs
```

Registered client-side in `src/utils/wordpress.ts`:

```ts
wp.staffs = wp.registerRoute('atenews/v1', '/staffs');
```

Returns an array of `Staff` objects:

```ts
{
  id: number;
  display_name: string;
  user_nicename: string;   // used as the profile slug
  avatar: string;          // URL
  roles: string[];         // WordPress role slugs
}
```

Roles drive how staff are grouped on `/staff`. The frontend checks role slugs for keywords:

| Role contains                                            | Grouped under  |
| -------------------------------------------------------- | -------------- |
| `editor-in-chief`, `associate_editor`, `managing_editor` | Editors (top)  |
| `editor` (not one of the above)                          | Editors (rest) |
| `senior` or `head`                                       | Senior writers |
| `junior`                                                 | Junior writers |
| `trainee`                                                | Trainees       |

Roles ignored everywhere: `subscriber`, `contributor`, `administrator`, `editor` when used as a bare WP role. The list is in `src/utils/constants.ts` as `rolesIgnore`.

To change staff grouping, edit `src/pages/staff.tsx` (the `useEffect` that builds the `editors`, `seniors`, `juniors`, `trainees` arrays).

### SEO

Yoast SEO provides the `seo` field on posts, pages, categories, and the homepage. The frontend injects `seo.fullHead` into the page `<head>` via `html-react-parser`. Image URLs in the head are rewritten from `atenews.ph/wp-...` to `wp.atenews.ph/wp-...` so they resolve.

## How to add things

### Add a new article

1. Log into WordPress admin
2. Posts > Add New
3. Write content, set a featured image, pick categories and authors
4. Publish

It shows up on the site within 60 seconds (the GraphQL cache TTL). No frontend deploy needed.

### Add a new category

1. Posts > Categories in WordPress admin
2. Add the category with a slug
3. If you want it on the homepage or in a route, update `src/server/routers/home.ts` or add a page route

### Add a nav menu item

1. Appearance > Menus in WordPress admin
2. Edit the **Atenews Nav** menu
3. Add the item and save

No code change needed.

### Add a new staff member

1. Users > Add New in WordPress admin
2. Give them the right role(s) (see the role table above)
3. Set their avatar (via Gravatar or the profile plugin)

They appear on `/staff` once the REST endpoint returns them.

### Add a new section to the homepage

1. Add a category in WordPress (for example `multimedia`)
2. Edit `src/server/routers/home.ts`:
   - Add the category to the `Query` interface
   - Add a `posts(first: N, where: { categoryName: "multimedia" })` block to the GraphQL query
   - Return it in the handler
3. Add the section component under `src/components/Home/`
4. Render it in `src/pages/index.tsx`

## Plugins the frontend depends on

These WordPress plugins must stay active or the frontend breaks:

| Plugin                          | What it provides                           |
| ------------------------------- | ------------------------------------------ |
| WPGraphQL                       | The `/graphql` endpoint                    |
| Yoast SEO                       | The `seo` field on content                 |
| PublishPress Authors            | The `coauthors` field (multi-author posts) |
| Custom REST plugin (atenews/v1) | The `/staffs` route                        |

If any are disabled, the matching queries fail and pages return errors.

## The application password

The `NEXT_PUBLIC_WEB_WP_API` token is a WordPress application password for a user with read access. To rotate it:

1. WordPress admin > Users > (user) > Application Passwords
2. Add a new application password
3. Base64 encode `username:new_password`
4. Put the base64 string in `NEXT_PUBLIC_WEB_WP_API`

```bash
echo -n "username:xxxx xxxx xxxx xxxx xxxx xxxx" | base64
```

The current token decodes to `webapi:<app password>`.
