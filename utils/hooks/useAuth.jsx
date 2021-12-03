import {
  useEffect, useState, createContext, useContext,
} from 'react';

import localforage from 'localforage';
import firebase from '@/utils/firebase';
import useFirestore from './useFirestore';
import { useError } from './useSnackbar';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(firebase.auth().currentUser);
  const [profile, setProfile] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('login');

  const { setError, setSuccess } = useError();

  const { getDocument, saveDocument } = useFirestore();

  const [fcmToken, setFcmToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [newNotif, setNewNotif] = useState(0);

  const generateToken = async () => {
    const status = await Notification.requestPermission();
    if (status && status === 'granted') {
      const fcmTokenProvided = await firebase.messaging().getToken();
      if (fcmTokenProvided) {
        setFcmToken(fcmTokenProvided);
        localforage.setItem('fcm_token', fcmTokenProvided);
        let tokens = [fcmTokenProvided];
        if (profile.fcmTokens) {
          if (!profile.fcmTokens.includes(fcmTokenProvided)) {
            tokens = [...tokens, ...profile.fcmTokens];
          } else {
            tokens = profile.fcmTokens;
          }
        }
        await firebase.firestore().collection('users').doc(profile.id).update({
          fcmTokens: tokens,
        });
      }
    }
  };

  const clearNotifs = async () => {
    setNotifications([]);
    await localforage.setItem('atenews-notifs', JSON.stringify([]));
  };

  useEffect(() => {
    setAuthUser(firebase.auth().currentUser);
  }, [firebase.auth().currentUser]);

  useEffect(() => {
    let unsub = () => { };
    if (profile && 'username' in profile) {
      localforage.getItem('fcm_token').then(async (token) => {
        setFcmToken(token);
        if (!fcmToken) {
          generateToken();
        }

        const notifs = await localforage.getItem('atenews-notifs');
        if (notifs) {
          setNotifications(JSON.parse(notifs));
        } else {
          setNotifications([]);
        }
        unsub = firebase.messaging().onMessage(async (payload) => {
          setNewNotif((prev) => prev + 1);
          let newNotifs = [...notifications];
          if (notifications) {
            newNotifs = [payload.data, ...newNotifs];
          }
          setNotifications(newNotifs);
          await localforage.setItem('atenews-notifs', JSON.stringify(newNotifs));
        });
      });

      firebase.analytics().setUserId(profile.id);
    }

    return () => {
      unsub();
    };
  }, [profile]);

  useEffect(() => {
    let unsubscribeProfile = () => { };
    const unsubscribe = firebase.auth()
      .onAuthStateChanged(async (user) => {
        if (loadingAuth) {
          setLoadingAuth(false);
        } else {
          setLoadingAuth(true);
        }

        setAuthUser(user);
        if (user) {
          unsubscribeProfile = getDocument(`users/${user.uid}`, async (data) => {
            setProfile({ ...data, id: user.uid });
          });
        } else {
          unsubscribeProfile();
          setProfile(null);
        }
      });
    return () => {
      unsubscribeProfile();
      unsubscribe();
    };
  }, []);

  const loginWithEmail = (email, password, callback, error) => firebase.auth()
    .signInWithEmailAndPassword(email, password).then(async () => {
      setSuccess('Welcome! You have successfully logged in.');
      callback();
    }).catch((err) => {
      error();
      if (err.message === 'The user account has been disabled by an administrator.') {
        setError('The system is still processing your account. Please try again after a few seconds!');
      } else {
        setError(err.message);
      }
    });

  const updateProfile = (document) => firebase.firestore()
    .doc(`users/${firebase.auth().currentUser.uid}`)
    .update(document);

  const registerEmail = (email, password, username, callback, error) => {
    const params = {
      email,
      password,
      username,
    };

    let formBody = [];
    // eslint-disable-next-line guard-for-in
    for (const property in params) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(params[property]);
      formBody.push(`${encodedKey}=${encodedValue}`);
    }
    formBody = formBody.join('&');

    return fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    }).then((response) => response.json()).then(() => {
      callback();
      setSuccess('Registration success! Email verification is required to interact with the community.');
    }).catch((err) => {
      error();
      setError(err.message);
    });
  };

  const loginWithFacebook = () => firebase.auth()
    .signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(async (result) => {
      if (result.additionalUserInfo.isNewUser) {
        await firebase.auth().signOut();
        setError('This Facebook account has not been connected to any Atenews account yet!');
        setProfile(null);
      } else {
        setSuccess('Welcome! You have successfully logged in.');
        await saveDocument(`users/${firebase.auth().currentUser.uid}`, {
          facebookUsername: result.additionalUserInfo.profile.name,
        });
      }
    }).catch((err) => {
      setError(err.message);
    });

  const connectWithFacebook = () => firebase.auth()
    .currentUser.linkWithPopup(new firebase.auth.FacebookAuthProvider()).then(async (result) => {
      await saveDocument(`users/${firebase.auth().currentUser.uid}`, {
        facebookUsername: result.additionalUserInfo.profile.name,
      });
    }).catch((err) => {
      setError(err.message);
    });

  const loginWithTwitter = () => firebase.auth()
    .signInWithPopup(new firebase.auth.TwitterAuthProvider()).then(async (result) => {
      if (result.additionalUserInfo.isNewUser) {
        await firebase.auth().signOut();
        setError('This Twitter account has not been connected to any Atenews account yet!');
        setProfile(null);
      } else {
        await saveDocument(`users/${firebase.auth().currentUser.uid}`, {
          twitterUsername: result.additionalUserInfo.username,
        });
        setSuccess('Welcome! You have successfully logged in.');
      }
    }).catch((err) => {
      setError(err.message);
    });

  const connectWithTwitter = () => firebase.auth()
    .currentUser.linkWithPopup(new firebase.auth.TwitterAuthProvider()).then(async (result) => {
      await saveDocument(`users/${firebase.auth().currentUser.uid}`, {
        twitterUsername: result.additionalUserInfo.username,
      });
    }).catch((err) => {
      setError(err.message);
    });

  const logout = async () => {
    let tokens = [];
    if (profile.fcmTokens) {
      tokens = profile.fcmTokens.filter((token) => token !== fcmToken);
    }
    await firebase.firestore().collection('users').doc(profile.id).update({
      fcmTokens: tokens,
    });

    return firebase.auth().signOut().then(() => {
      setProfile(null);
      setFcmToken(null);
      localforage.removeItem('atenews-notifs');
      setNotifications([]);
      localforage.removeItem('fcm_token');
    }).catch((err) => {
      setError(err.message);
    });
  };

  const deleteAccount = () => firebase.auth().currentUser.delete().then(async () => {
    await firebase.auth().signOut();
  }).catch((err) => {
    setError(err.message);
  });

  return (
    <AuthContext.Provider value={{
      loginWithEmail,
      registerEmail,
      loginWithFacebook,
      connectWithFacebook,
      loginWithTwitter,
      connectWithTwitter,
      updateProfile,
      authUser,
      profile,
      logout,
      loadingAuth,
      deleteAccount,
      formOpen,
      setFormOpen,
      formMode,
      setFormMode,
      fcmToken,
      notifications,
      newNotif,
      setNewNotif,
      clearNotifs,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const auth = useContext(AuthContext);
  return auth;
};
