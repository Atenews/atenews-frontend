import React, {
  useEffect, useState, createContext, useContext, ReactNode, 
} from 'react';
import trpc from '@/utils/trpc';

interface CategoryContextProps {
  category: any[];
  setCategory: React.Dispatch<React.SetStateAction<any[]>>;
  categories: any[];
  setCategories: React.Dispatch<React.SetStateAction<any[]>>;
}

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryContext = createContext<CategoryContextProps>({} as CategoryContextProps);

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [category, setCategory] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  const trpcCategories = trpc.useContext().categories;

  useEffect(() => {
    trpcCategories.fetch().then((x) => {
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
  const category = useContext<CategoryContextProps>(CategoryContext);
  return category;
};
