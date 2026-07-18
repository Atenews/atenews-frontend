import type { Theme } from '@mui/material';
import { createTheme } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles' {
  interface Palette {
    atenews: {
      main: string;
      news: string;
      features: string;
      highlight: string;
      montage: string;
      diversions: string;
    };
  }

  interface PaletteOptions {
    atenews?: {
      main?: string;
      news?: string;
      features?: string;
      highlight?: string;
      montage?: string;
      diversions?: string;
    };
  }
}

const defaultTheme = createTheme();

export { defaultTheme };
