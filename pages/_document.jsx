/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';
import ServerStyleSheets from '@mui/styles/ServerStyleSheets';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preload" href="/logo.png" as="image" />
          <link rel="preload" href="/logo-blue.png" as="image" />
          <meta name="application-name" content="Atenews" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Atenews" />
          <meta name="description" content="The official student publication of the Ateneo de Davao University" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#195EA9" />
          <meta name="msapplication-TileColor" content="#195EA9" />

          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link rel="preconnect" href="https://firebase.googleapis.com" />
          <link rel="preconnect" href="https://cdn.statically.io" />

          <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap" />
          <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" />

          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&display=swap" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap" />

          <link rel="apple-touch-icon" sizes="57x57" href="/icons/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/icons/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/icons/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/icons/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/icons/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/icons/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/icons/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/icons/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/icons/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/icons/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />

          <link rel="manifest" href="/manifest.json" />

          <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () => originalRenderPage({
    enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
  });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), sheets.getStyleElement()],
  };
};
