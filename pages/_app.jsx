import React from 'react';
import Head from 'next/head';
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
import '@/styles/main.css';

import { TrendingProvider } from '@/utils/hooks/useTrending';
import { AuthProvider } from '@/utils/hooks/useAuth';
import { ErrorProvider } from '@/utils/hooks/useSnackbar';
import { CacheProvider } from '@/utils/hooks/useCache';
import { CategoryProvider } from '@/utils/hooks/useCategory';

import firebase from '@/utils/firebase';

import 'react-toastify/dist/ReactToastify.css';

NProgress.configure({
  showSpinner: false,
});

Router.onRouteChangeStart = () => {
  NProgress.start();
};

Router.onRouteChangeComplete = (url) => {
  firebase.analytics().setCurrentScreen(window.location.pathname);
  firebase.analytics().logEvent('screen_view');
  firebase.analytics().logEvent('route_change', {
    url,
  });

  if (firebase.auth().currentUser) {
    firebase.auth().currentUser.reload();
  }
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

Router.events.on('routeChangeComplete', () => { window.scrollTo(0, 0); });

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Notification.requestPermission();
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    localforage.getItem('savedDarkModeState').then((state) => {
      if (state !== null) {
        setDarkMode(state);
      } else {
        setDarkMode(prefersDarkMode);
      }
    });

    firebase.auth().onAuthStateChanged(() => {
      if (!firebase.auth().currentUser) {
        setDarkMode(false);
        localforage.removeItem('savedDarkModeState');
      }
    });
  }, []);

  React.useEffect(() => {
    if (firebase.auth().currentUser) {
      localforage.setItem('savedDarkModeState', darkMode);
    }
  }, [darkMode]);

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
              <AuthProvider>
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
              </AuthProvider>
            </ErrorProvider>
          </CacheProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </>
  );
}
