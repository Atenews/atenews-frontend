import React, { useEffect } from 'react';

const CONTAINER_ID = 'commento_container';
const COMMENTO_URL = 'https://commento.atenews.ph/js/commento.js';

const Commento = ({
  pageId,
}: {
  pageId: string;
}) => {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined' && !window.commento) {
      // init empty object so commento.js script extends this with global functions
      // @ts-ignore
      window.commento = {};
      const script = document.createElement('script');
      // Replace this with the url to your commento instance's commento.js script
      script.src = COMMENTO_URL;
      script.async = true;
      // Set default attributes for first load
      script.setAttribute('data-auto-init', 'false');
      script.setAttribute('data-page-id', pageId ?? '');
      script.setAttribute('data-id-root', CONTAINER_ID);
      script.setAttribute('data-css-override', '/commento.css');
      script.onload = () => {
        // Tell commento.js to load the widget
        // @ts-ignore
        window.commento.main();
      };
      document.body.appendChild(script);
      // @ts-ignore
    } else if (typeof window !== 'undefined' && window.commento && 'reInit' in window.commento) {
      // In-case the commento.js script has already been loaded reInit the widget with a new pageId
      // @ts-ignore
      window.commento.reInit({
        pageId,
        idRoot: CONTAINER_ID,
        cssOverride: '/commento.css',
      });
    }
  }, []);

  return (
    <div
      key={pageId}
      id={CONTAINER_ID}
    />
  );
};
export default Commento;
