import { forwardRef } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import type { SxProps, Theme } from '@mui/material/styles';

type OldGridProps = {
  children?: React.ReactNode;
  container?: boolean;
  item?: boolean;
  xs?: number | 'auto' | boolean;
  sm?: number | 'auto' | boolean;
  md?: number | 'auto' | boolean;
  lg?: number | 'auto' | boolean;
  xl?: number | 'auto' | boolean;
  spacing?: number;
  columnSpacing?: number;
  rowSpacing?: number;
  direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  alignItems?: string;
  justifyContent?: string;
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  sx?: SxProps<Theme>;
  style?: React.CSSProperties;
  className?: string;
  component?: React.ElementType;
  variant?: string;
  zeroMinWidth?: boolean;
  key?: string | number;
  onClick?: React.MouseEventHandler;
  id?: string;
};

const LegacyGrid = forwardRef<HTMLDivElement, OldGridProps>(
  function LegacyGrid(props, ref) {
    const {
      children,
      container,
      item,
      xs,
      sm,
      md,
      lg,
      xl,
      spacing,
      columnSpacing,
      rowSpacing,
      direction,
      alignItems,
      justifyContent,
      wrap,
      sx,
      style,
      className,
      zeroMinWidth,
      key,
      onClick,
      id,
    } = props;

    if (direction === 'column' || direction === 'column-reverse') {
      const stackSx: SxProps<Theme> = {
        ...(alignItems ? { alignItems } : {}),
        ...(justifyContent ? { justifyContent } : {}),
        ...sx,
      };
      return (
        <Stack
          direction={direction}
          spacing={spacing}
          sx={stackSx}
          style={style}
          className={className}
          key={key}
          onClick={onClick}
          id={id}
        >
          {children}
        </Stack>
      );
    }

    const hasSize =
      xs !== undefined ||
      sm !== undefined ||
      md !== undefined ||
      lg !== undefined ||
      xl !== undefined;
    const sizeObj: Record<string, number | 'auto' | 'grow' | false> = {};
    if (xs !== undefined)
      sizeObj.xs = xs === true ? 'grow' : xs === false ? false : xs;
    if (sm !== undefined)
      sizeObj.sm = sm === true ? 'grow' : sm === false ? false : sm;
    if (md !== undefined)
      sizeObj.md = md === true ? 'grow' : md === false ? false : md;
    if (lg !== undefined)
      sizeObj.lg = lg === true ? 'grow' : lg === false ? false : lg;
    if (xl !== undefined)
      sizeObj.xl = xl === true ? 'grow' : xl === false ? false : xl;

    const gridSx: SxProps<Theme> = {
      ...(alignItems ? { alignItems } : {}),
      ...(justifyContent ? { justifyContent } : {}),
      ...(zeroMinWidth ? { minWidth: 0 } : {}),
      ...sx,
    };

    return (
      <Grid
        container={container}
        size={hasSize ? sizeObj : container ? undefined : 'grow'}
        spacing={spacing}
        columnSpacing={columnSpacing}
        rowSpacing={rowSpacing}
        direction={direction}
        wrap={wrap}
        sx={gridSx}
        style={style}
        className={className}
        key={key}
        onClick={onClick}
        id={id}
        ref={ref}
      >
        {children}
      </Grid>
    );
  },
);

export default LegacyGrid;
