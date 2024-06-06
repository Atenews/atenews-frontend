import React, { useEffect } from 'react';

const COMENTARIO_URL = 'https://comentario.atenews.ph/comentario.js';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'comentario-comments': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

const Comentario = () => {
  useEffect(() => {
    // @ts-ignore
    if (typeof window !== 'undefined') {
      // init empty object so comentario.js script extends this with global functions
      const script = document.createElement('script');
      // Replace this with the url to your comentario instance's comentario.js script
      script.src = COMENTARIO_URL;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <comentario-comments no-fonts="true" />
  );
};
export default Comentario;
