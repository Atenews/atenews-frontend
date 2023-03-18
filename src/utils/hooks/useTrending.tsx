import React, { createContext, useContext, useEffect, useState } from 'react';

export type Trending = string[];

export interface TrendingContextValue {
  trending: Trending;
}

export const TrendingContext = createContext<TrendingContextValue>({ trending: [] });

export const TrendingProvider: React.FC = ({ children }) => {
  const [trending, setTrending] = useState<Trending>([]);

  return (
    <TrendingContext.Provider value={{ trending }}>
      {children}
    </TrendingContext.Provider>
  );
};

export const useTrending = (): Trending => useContext(TrendingContext).trending;
