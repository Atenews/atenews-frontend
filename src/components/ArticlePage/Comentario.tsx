import React, { useEffect, useRef } from 'react';

const COMENTARIO_URL = 'https://comentario.atenews.ph/comentario.js';

const Comentario = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = COMENTARIO_URL;
      script.defer = true;
      document.body.appendChild(script);

      const container = ref.current;
      if (container) {
        const el = document.createElement('comentario-comments');
        el.setAttribute('no-fonts', 'true');
        el.setAttribute('css-override', '/comentario.css');
        container.appendChild(el);
      }
    }
  }, []);

  return <div ref={ref} />;
};
export default Comentario;
