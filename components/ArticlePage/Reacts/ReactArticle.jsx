import React from 'react';

import { useTheme } from '@mui/material/styles';

import { makeStyles } from '@mui/styles';

import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';

import { useArticle } from '@/utils/hooks/useArticle';
import { useError } from '@/utils/hooks/useSnackbar';

const useStyles = makeStyles(() => ({
  reacts: {
    width: 40,
    height: 57,
    overflow: 'visible',
  },
  buttonReacts: {
    width: 19,
    height: 26,
    backgroundColor: 'transparent',
    overflow: 'visible',
    border: 0,
  },
  infoReacts: {
    width: 30,
    height: 43,
    backgroundColor: 'transparent',
    overflow: 'visible',
    border: 0,
  },
  container: {
    width: 'fit-content',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  focusHighlight: {
    opacity: 0.3,
  },
}));

const ReactArticle = ({
  disableHover,
  slug,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { setError } = useError();
  const { article: { setArticle } } = useArticle();

  const [buttonText, setButtonText] = React.useState('React');
  const [react, setReact] = React.useState(null);

  React.useEffect(() => {
    switch (react) {
      case 'happy':
        setButtonText('Happy');
        break;
      case 'sad':
        setButtonText('Sad');
        break;
      case 'angry':
        setButtonText('Angry');
        break;
      case 'disgusted':
        setButtonText('Disgusted');
        break;
      case 'worried':
        setButtonText('Worried');
        break;
      default:
        setButtonText('React');
    }
  }, [react]);

  const handlePopoverOpen = (event) => {
    if (!disableHover) {
      setError('You need to be logged in to do this action!');
    }
  };

  const handlePopoverClose = () => {
    if (!disableHover) {
      setAnchorEl(null);
    }
  };

  const handleReact = (reactX) => {
    handlePopoverClose();
    if (react === '') {
      setArticle((prev) => ({
        ...prev,
        totalReactCount: prev?.totalReactCount || 0 + 1,
      }));
    }
  };

  const ButtonIcon = () => {
    let currentReact = null;
    switch (react) {
      case 'happy':
        currentReact = 'happy';
        break;
      case 'sad':
        currentReact = 'sad';
        break;
      case 'angry':
        currentReact = 'angry';
        break;
      case 'disgusted':
        currentReact = 'disgust';
        break;
      case 'worried':
        currentReact = 'worried';
        break;
      default:
        currentReact = null;
    }
    if (!currentReact) {
      return <InsertEmoticonIcon style={{ marginRight: theme.spacing(1) }} />;
    }
    return <Avatar className={classes.buttonReacts} style={{ marginRight: theme.spacing(1) }} src={`/reacts/${currentReact}.svg`} />;
  };

  return (
    <ClickAwayListener onClickAway={handlePopoverClose}>
      <div>
        <Button variant="text" color={theme.palette.mode === 'light' ? 'primary' : 'secondary'} size="large" fullWidth onClick={handlePopoverOpen}>
          <ButtonIcon />
          { buttonText === 'React' ? buttonText
            : <b>{buttonText}</b>}
        </Button>

        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="top"
          disablePortal={false}
          style={{ zIndex: 2000 }}
          modifiers={{
            flip: {
              enabled: false,
            },
            preventOverflow: {
              enabled: true,
              boundariesElement: 'scrollParent',
            },
          }}
        >
          <Grow in={Boolean(anchorEl)}>
            <Card elevation={0} variant="outlined" style={{ borderRadius: 40, marginBottom: theme.spacing(1) }}>
              <Grid container>
                <Grid item>
                  <Tooltip title="Happy" placement="top" arrow>
                    <CardActionArea
                      onClick={() => handleReact('happy')}
                      classes={{
                        focusHighlight: react === 'happy' ? classes.focusHighlight : null,
                      }}
                    >
                      <CardContent>
                        <Avatar className={classes.reacts} src="/reacts/happy.svg" />
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Sad" placement="top" arrow>
                    <CardActionArea
                      onClick={() => handleReact('sad')}
                      classes={{
                        focusHighlight: react === 'sad' ? classes.focusHighlight : null,
                      }}
                    >
                      <CardContent>
                        <Avatar className={classes.reacts} src="/reacts/sad.svg" />
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Angry" placement="top" arrow>
                    <CardActionArea
                      onClick={() => handleReact('angry')}
                      classes={{
                        focusHighlight: react === 'angry' ? classes.focusHighlight : null,
                      }}
                    >
                      <CardContent>
                        <Avatar className={classes.reacts} src="/reacts/angry.svg" />
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Disgusted" placement="top" arrow>
                    <CardActionArea
                      onClick={() => handleReact('disgusted')}
                      classes={{
                        focusHighlight: react === 'disgusted' ? classes.focusHighlight : null,
                      }}
                    >
                      <CardContent>
                        <Avatar className={classes.reacts} src="/reacts/disgust.svg" />
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Worried" placement="top" arrow>
                    <CardActionArea
                      onClick={() => handleReact('worried')}
                      classes={{
                        focusHighlight: react === 'worried' ? classes.focusHighlight : null,
                      }}
                    >
                      <CardContent>
                        <Avatar className={classes.reacts} src="/reacts/worried.svg" />
                      </CardContent>
                    </CardActionArea>
                  </Tooltip>
                </Grid>
              </Grid>
            </Card>
          </Grow>
        </Popper>
      </div>
    </ClickAwayListener>
  );
};

export default ReactArticle;
