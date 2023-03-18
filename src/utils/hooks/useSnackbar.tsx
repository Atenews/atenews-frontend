import React, {
  useState, createContext, useContext, useEffect,
} from 'react';

import { toast } from 'react-toastify';

interface ErrorContextType {
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  success: string | null;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  warning: string | null;
  setWarning: React.Dispatch<React.SetStateAction<string | null>>;
}

const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
  success: null,
  setSuccess: () => {},
  warning: null,
  setWarning: () => {},
});

interface ErrorProviderProps {
  children: React.ReactNode;
}

const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

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

const useError = (): ErrorContextType => {
  const errorContext = useContext(ErrorContext);
  return errorContext;
};

export { ErrorProvider, useError };
