import '@mui/material/styles/createPalette';
import '@mui/material/styles/createTheme';

import '@mui/styles'; 
import type { Theme } from '@mui/material';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles/createTheme' {
  interface ThemeOptions {
    overrides?: ComponentsProps;
  }
}

declare module '@mui/material/styles/createPalette' {
  interface Palette {
    atenews: {
      news: string;
      features: string;
      highlight: string;
      montage: string;
      diversions: string;
    };
  }
  
  interface PaletteOptions {
    atenews?: {
      news?: string;
      features?: string;
      highlight?: string;
      montage?: string;
      diversions?: string;
    };
  }
}