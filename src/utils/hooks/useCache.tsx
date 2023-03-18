import React, { useState, createContext, useContext, ReactNode } from 'react';

interface CacheContextProps {
  users: [object, React.Dispatch<React.SetStateAction<object>>];
}

interface CacheProviderProps {
  children: ReactNode;
}

export const CacheContext = createContext<CacheContextProps>({} as CacheContextProps);

export const CacheProvider = ({ children }: CacheProviderProps) => {
  const [users, setUsers] = useState<object>({});

  return (
    <CacheContext.Provider value={{ users: [users, setUsers] }}>
      {children}
    </CacheContext.Provider>
  );
};

export const useCache = () => {
  const cache = useContext<CacheContextProps>(CacheContext);
  return cache;
};
