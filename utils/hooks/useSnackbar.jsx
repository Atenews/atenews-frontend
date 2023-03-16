import {
  useState, createContext, useContext, useEffect,
} from 'react';

import { toast } from 'react-toastify';

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [warning, setWarning] = useState(null);

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setError(null);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      toast.success(success, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setSuccess(null);
    }
  }, [success]);

  useEffect(() => {
    if (warning) {
      toast.warning(warning, {
        position: 'bottom-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setWarning(null);
    }
  }, [warning]);

  return (
    <ErrorContext.Provider
      value={{
        error,
        setError,
        success,
        setSuccess,
        warning,
        setWarning,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const auth = useContext(ErrorContext);
  return auth;
};
