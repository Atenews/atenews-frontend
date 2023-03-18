import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';

import useMediaQuery from '@mui/material/useMediaQuery';

import Router from 'next/router';
import NProgress from 'nprogress';

import CssBaseline from '@mui/material/CssBaseline';

import localforage from 'localforage';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout/Layout';
import theme from '@/styles/theme';

import '@/styles/nprogress.css';

import { TrendingProvider } from '@/utils/hooks/useTrending';
import { ErrorProvider } from '@/utils/hooks/useSnackbar';
import { CacheProvider } from '@/utils/hooks/useCache';
import { CategoryProvider } from '@/utils/hooks/useCategory';

import trpc from '@/utils/trpc';

import 'react-toastify/dist/ReactToastify.css';

NProgress.configure({
  showSpinner: false,
});

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});

Router.events.on('routeChangeComplete', () => {
  NProgress.done();
  window.scrollTo(0, 0);
});

Router.events.on('routeChangeError', () => {
  NProgress.done();
});

const MyApp: React.FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, tmpSetDarkMode] = React.useState(false);

  const setDarkMode: React.Dispatch<React.SetStateAction<boolean>> = (stateProps) => {
    localforage.setItem('savedDarkModeState', stateProps);

    return tmpSetDarkMode(stateProps);
  };

  React.useEffect(() => {
    // Notification.requestPermission();
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }

    localforage.getItem<boolean>('savedDarkModeState').then((state) => {
      if (state !== null) {
        setDarkMode(state);
      } else {
        setDarkMode(prefersDarkMode);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
      </Head>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme(darkMode)}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <CacheProvider>
            <ErrorProvider>
              <TrendingProvider>
                <CategoryProvider>
                  <Layout setDarkMode={setDarkMode}>
                    <ToastContainer
                      position="bottom-center"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
                    <Component {...pageProps} />
                  </Layout>
                </CategoryProvider>
              </TrendingProvider>
            </ErrorProvider>
          </CacheProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
};

export default trpc.withTRPC(MyApp);
