import useSWR from 'swr';
import firebase from '@/utils/firebase';

const useFirestore = () => {
  const getDocument = (documentPath, onUpdate) => {
    const docRef = firebase.database().ref(documentPath);
    docRef.on('value', (doc) => {
      if (doc.exists()) {
        onUpdate(doc.val());
      } else {
        onUpdate(null);
      }
    });
    return docRef;
  };

  const getDocumentOnce = (documentPath) => {
    const { data } = useSWR(documentPath, (path) => firebase.database().ref(path).once('value'));
    if (!data.exists()) {
      return null;
    }
    return data.val();
  };

  const saveDocument = async (documentPath, document) => {
    await firebase.database()
      .ref(documentPath)
      .set(document, { merge: true });
  };

  return {
    getDocument,
    getDocumentOnce,
    saveDocument,
    firebase,
  };
};

export default useFirestore;
