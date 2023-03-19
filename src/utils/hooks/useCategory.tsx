import React, {
  useEffect, useState, createContext, useContext, ReactNode,
} from 'react';
import trpc from '@/utils/trpc';

interface CategoryContextProps {
  category?: Category[];
  setCategory?: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
  categories?: Category[];
  setCategories?: React.Dispatch<React.SetStateAction<Category[] | undefined>>;
}

interface CategoryProviderProps {
  children: ReactNode;
}

export const CategoryContext = createContext<CategoryContextProps>({} as CategoryContextProps);

export const CategoryProvider = ({ children }: CategoryProviderProps) => {
  const [category, setCategory] = useState<Category[] | undefined>([]);
  const [categories, setCategories] = useState<Category[] | undefined>([]);

  const trpcCategories = trpc.useContext().categories;

  useEffect(() => {
    trpcCategories.fetch().then((x) => {
      setCategories(x.categories);
    });
  }, []);

  const value = React.useMemo(
    () => ({
      category,
      setCategory,
      categories,
      setCategories,
    }),
    [category, setCategory, categories, setCategories],
  );

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const category = useContext<CategoryContextProps>(CategoryContext);
  return category;
};
