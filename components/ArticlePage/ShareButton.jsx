import React from 'react';

import { useTheme } from '@mui/material/styles';

import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  ShareOutlined as ShareIcon,
} from '@mui/icons-material';

import {
  Button,
  Dialog,
  Avatar,
  Grid,
  IconButton,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  useMediaQuery,
} from '@mui/material';

import {
  FacebookShareButton,
  TwitterShareButton,
} from 'react-share';

export default function Page({ article }) {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const fbShareRef = React.useRef();
  const twitterShareRef = React.useRef();

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        aria-label="Share article"
        onClick={handleClickOpen}
        variant="text"
        color={theme.palette.mode === 'light' ? 'primary' : 'secondary'}
        size="large"
        fullWidth
        style={{ height: '100%' }}
      >
        <ShareIcon style={{ marginRight: theme.spacing(1) }} />
        {article ? article.shareCount || 0 : 0}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Share via...</DialogTitle>
        <DialogContent style={{ padding: theme.spacing(4), paddingTop: 0 }}>
          <Grid container spacing={4}>
            <Grid item>
              <Grid container direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                  <FacebookShareButton
                    url={window.location.href}
                    ref={fbShareRef}
                    onShareWindowClose={handleClose}
                  />
                  <IconButton onClick={() => fbShareRef.current.click()} size="large">
                    <Avatar
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#3b5998',
                      }}
                    >
                      <FacebookIcon style={{ color: 'white', fontSize: 40 }} />
                    </Avatar>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Facebook</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction="column" justifyContent="center" alignItems="center">
                <Grid item>
                  <TwitterShareButton
                    url={window.location.href}
                    ref={twitterShareRef}
                    onShareWindowClose={handleClose}
                  />
                  <IconButton onClick={() => twitterShareRef.current.click()} size="large">
                    <Avatar
                      style={{
                        width: 60,
                        height: 60,
                        backgroundColor: '#00acee',
                      }}
                    >
                      <TwitterIcon style={{ color: 'white', fontSize: 40 }} />
                    </Avatar>
                  </IconButton>
                </Grid>
                <Grid item>
                  <Typography variant="body1">Twitter</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        {fullScreen ? (
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus variant="contained">
              Close
            </Button>
          </DialogActions>
        ) : null}
      </Dialog>
    </>
  );
}
