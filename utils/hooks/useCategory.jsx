import {
  useEffect, useState, createContext, useContext,
} from 'react';

import postFetch from '@/utils/postFetch';

export const CategoryContext = createContext();

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    postFetch('/api/graphql/getCategories').then((res) => res.json()).then((x) => {
      setCategories(x.categories);
    });
  }, []);

  return (
    <CategoryContext.Provider value={{
      category,
      setCategory,
      categories,
      setCategories,
    }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const category = useContext(CategoryContext);
  return category;
};
