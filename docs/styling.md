# Styling

Two styling systems run side by side. This doc explains both, the theme, and the MUI compatibility shims you must use.

## The two systems

| System                        | Package                       | Used for                     | How it looks                                           |
| ----------------------------- | ----------------------------- | ---------------------------- | ------------------------------------------------------ |
| JSS via `makeStyles`          | `@mui/styles` v6              | Most existing components     | `const classes = useStyles(); className={classes.foo}` |
| Emotion via `sx` and `styled` | `@mui/material` v9 (built in) | Newer code, shims, overrides | `<Box sx={{ ... }}>`                                   |

Both read the same MUI theme. The app keeps `@mui/styles` because 40+ files use `makeStyles` and rewriting them is out of scope.

## The theme

`src/styles/theme.ts` exports `themeGenerator(dark: boolean)` which returns a MUI theme. Key parts:

- Breakpoints: `xs: 0, sm: 600, md: 1024, lg: 1280, xl: 1920` (note `md` is 1024, not the default 900)
- Fonts: `Open Sans` for body, `Montserrat` for headings
- Custom palette key `atenews` with brand colors:

```ts
atenews: {
  main: '#195EA9',
  news: '#263E8E',
  features: '#FAB417',
  highlight: '#972E34',
  montage: '#40AE4B',
  diversions: '#F9761D',
}
```

These are extended into the MUI palette type in `theme.d.ts`. Use `theme.palette.atenews.news` etc. for category colors.

Light/dark mode: `_app.tsx` holds `darkMode` state, builds the theme with `themeGenerator(darkMode)`, and persists the choice to localforage under `savedDarkModeState`. The initial server render always uses light mode, then the client applies the saved choice.

## Theme providers

`_app.tsx` wraps the app in two theme providers:

```tsx
<StylesThemeProvider theme={currentTheme}>
  {' '}
  {/* @mui/styles */}
  <MuiThemeProvider theme={currentTheme}>
    {' '}
    {/* @mui/material */}
    ...
  </MuiThemeProvider>
</StylesThemeProvider>
```

Both must wrap the app. `makeStyles` reads from `@mui/styles` ThemeProvider; MUI components read from `@mui/material` ThemeProvider. If you remove either, half the styles break.

`StyledEngineProvider injectFirst` is also set so Emotion styles are injected before JSS, letting `sx` overrides win where needed.

## SSR styling

`src/pages/_document.tsx` collects styles during server render:

1. `ServerStyleSheets` from `@mui/styles` collects JSS classes into a `<style id="jss-server-side">` block
2. `createEmotionServer` extracts Emotion critical CSS into `<style data-emotion="...">` blocks
3. Both are injected into `<head>`

On client mount, `_app.tsx` removes the `#jss-server-side` element so the client takes over.

## The MUICompat shims (important)

MUI 9 removed `Hidden` and replaced `Grid` v1 with Grid v2 (different API). The codebase has 40+ files using the old API. Two shims translate the old API to the new one so nothing needs rewriting.

**Always import from the shims, never from `@mui/material`:**

```ts
import Grid from '@/components/MUICompat/Grid';
import Hidden from '@/components/MUICompat/Hidden';
```

### Grid shim (`src/components/MUICompat/Grid.tsx`)

Accepts the old Grid v1 props and maps them:

| Old prop                                   | Shim behavior                                                                 |
| ------------------------------------------ | ----------------------------------------------------------------------------- |
| `container`                                | Passes `container` to Grid v2, adds `width: 100%` (v1 had this, v2 does not)  |
| `item`                                     | Ignored. Grid v2 infers item from `size`                                      |
| `xs` / `sm` / `md` / `lg` / `xl` as number | Converted to `size={{ breakpoint: number }}`                                  |
| `xs` / `sm` / etc. as `true`               | Converted to `size={{ breakpoint: 'grow' }}` (flex-grow)                      |
| No size prop on an item                    | No `size` passed, element uses natural width (matches v1)                     |
| `direction="column"` or `"column-reverse"` | Renders a `Stack` instead of Grid (Grid v2 dropped column direction on items) |
| `direction="row"`                          | Passed through to Grid v2                                                     |

Do not pass the reserved `key` prop through Grid. React warns if you do.

### Hidden shim (`src/components/MUICompat/Hidden.tsx`)

Wraps children in a `Box` with responsive `display`:

- When the breakpoint says visible: `display: contents` (the wrapper does not create a box, so children join the parent flex layout directly)
- When hidden: `display: none`

Supported props: `smUp`, `smDown`, `mdUp`, `mdDown`, `lgUp`, `lgDown`, `xlUp`, `xlDown`. Same semantics as old MUI `Hidden` (`mdUp` means hidden on md and up, visible below).

The `display: contents` trick matters for Grid layouts. If Hidden wrapped children in a normal `div`, that div would become the flex child and Grid sizing would not reach the inner Grid item (this caused hero images to collapse to 0 height before the fix).

## Writing styles

For new components, prefer the `sx` prop and `styled` over `makeStyles`. It works with Emotion, supports the theme, and needs no SSR plumbing.

```tsx
import Box from '@mui/material/Box';

<Box sx={{ p: 2, color: 'primary.main', display: { xs: 'none', md: 'block' } }}>
  ...
</Box>;
```

If you do use `makeStyles`, always read the theme through the hook:

```tsx
const useStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(2) },
}));
```

## CSS baseline

`CssBaseline` from MUI is rendered in `_app.tsx`. It sets box-sizing, body background, font, and a CSS reset.

## External CSS

- `nprogress` progress bar styles imported in `_app.tsx` (`src/styles/nprogress.css`)
- Google Fonts (Open Sans, Montserrat) loaded via `<link>` in `_document.tsx`
- `react-toastify` CSS imported in `_app.tsx`
