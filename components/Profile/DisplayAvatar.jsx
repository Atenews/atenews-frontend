import React from 'react';

import { makeStyles } from '@mui/styles';

import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

import { useError } from '@/utils/hooks/useSnackbar';
import firebase from '@/utils/firebase';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import { useSpring, animated } from 'react-spring';

import imageGenerator from '@/utils/imageGenerator';

const useStyles = makeStyles((theme) => ({
  avatar: {
    height: 250,
    width: 250,
    backgroundColor: theme.palette.primary.main,
  },
}));

export default function DisplayAvatar({ editMode, profile, cdnKey }) {
  const classes = useStyles();
  const { setError, setSuccess } = useError();

  const [photoURL, setPhotoURL] = React.useState('');

  const hiddenFileInput = React.useRef();

  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);

  const [props, set] = useSpring(() => ({ opacity: 0 }));

  React.useEffect(() => {
    setPhotoURL(imageGenerator(profile.photoURL, 250));
  }, [profile]);

  const uploadImage = (imageFile) => {
    const fd = new FormData();
    fd.append('photo', imageFile);
    fd.append('uid', profile.id);
    fd.append('api_key', cdnKey);
    return fetch('https://wp.atenews.ph/wp-json/atenews/v1/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: fd,
    });
  };

  const handleImageInput = (e) => {
    const fileUploaded = e.target.files[0];
    e.target.value = null;
    if (fileUploaded) {
      setUploadingPhoto(true);
      uploadImage(fileUploaded).then(async (res) => {
        const data = await res.json();
        await firebase.firestore().collection('users').doc(profile.id).update({
          photoURL: data.message,
        });
        setPhotoURL(imageGenerator(data.message, 250));
        setUploadingPhoto(false);
        setSuccess('Successfully updated display photo!');
      }).catch((err) => {
        setError(err.message);
        setUploadingPhoto(false);
      });
    }
  };

  return (
    <>
      {editMode ? (
        <input
          type="file"
          ref={hiddenFileInput}
          onChange={handleImageInput}
          style={{ display: 'none' }}
        />
      ) : null}
      <IconButton
        disabled={!editMode || uploadingPhoto}
        onClick={() => { hiddenFileInput.current.click(); }}
        onMouseOver={() => { set({ opacity: 0.8 }); }}
        onMouseOut={() => { set({ opacity: 0 }); }}
        style={{ position: 'relative' }}
        size="large"
      >
        <Avatar className={classes.avatar} src={photoURL && !uploadingPhoto ? photoURL.replace('_normal', '') : ''}>
          {uploadingPhoto ? (
            <CircularProgress color="inherit" />
          ) : null}
        </Avatar>
        <animated.div style={props}>
          <Avatar
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              height: '100%',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
            }}
          >
            <AddCircleIcon style={{ fontSize: 100, color: 'white' }} />
          </Avatar>
        </animated.div>
      </IconButton>
    </>
  );
}
