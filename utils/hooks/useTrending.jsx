import {
  useEffect, useState, createContext, useContext,
} from 'react';

export const TrendingContext = createContext();

export const TrendingProvider = ({ children }) => {
  const [trending, setTrending] = useState([]);

  return (
    <TrendingContext.Provider value={trending}>
      {children}
    </TrendingContext.Provider>
  );
};

export const useTrending = () => {
  const trending = useContext(TrendingContext);
  return trending;
};
