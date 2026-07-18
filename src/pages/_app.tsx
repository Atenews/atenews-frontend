import React from 'react';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from '@mui/material/styles';
import { ThemeProvider as StylesThemeProvider } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';
import CssBaseline from '@mui/material/CssBaseline';
import localforage from 'localforage';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/Layout/Layout';
import themeGenerator from '@/styles/theme';
import '@/styles/nprogress.css';
import { ErrorProvider } from '@/utils/hooks/useSnackbar';
import { CategoryProvider } from '@/utils/hooks/useCategory';
import createEmotionCache from '@/utils/createEmotionCache';
import trpc from '@/utils/trpc';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import 'react-toastify/dist/ReactToastify.css';

NProgress.configure({ showSpinner: false });

const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

function AppInner({ Component, pageProps, emotionCache }: MyAppProps) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, tmpSetDarkMode] = React.useState(false);
  const router = useRouter();

  const setDarkMode: React.Dispatch<React.SetStateAction<boolean>> = (
    stateProps,
  ) => {
    localforage.setItem('savedDarkModeState', stateProps);
    return tmpSetDarkMode(stateProps);
  };

  React.useEffect(() => {
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

  React.useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleDone = () => {
      NProgress.done();
      window.scrollTo(0, 0);
    };
    const handleError = () => NProgress.done();

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleDone);
    router.events.on('routeChangeError', handleError);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleDone);
      router.events.off('routeChangeError', handleError);
    };
  }, [router]);

  const currentTheme = themeGenerator(darkMode);

  return (
    <StylesThemeProvider theme={currentTheme}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        <ErrorProvider>
          <CategoryProvider>
            <Layout setDarkMode={setDarkMode} darkMode={darkMode}>
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
        </ErrorProvider>
      </MuiThemeProvider>
    </StylesThemeProvider>
  );
}

const MyApp: React.FC<MyAppProps> = (props) => {
  const { emotionCache = clientSideEmotionCache } = props;

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
        />
      </Head>
      <NextThemeProvider>
        <StyledEngineProvider injectFirst>
          <AppInner {...props} />
        </StyledEngineProvider>
      </NextThemeProvider>
    </CacheProvider>
  );
};

export default trpc.withTRPC(MyApp);
