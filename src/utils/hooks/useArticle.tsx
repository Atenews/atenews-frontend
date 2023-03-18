/* eslint-disable camelcase */
import React, {
 useState, createContext, useContext, ReactNode 
} from 'react';

interface ArticleProviderProps {
  post: any;
  children: ReactNode;
}

interface ArticleContextProps {
  users: {
    users: object;
    setUsers: React.Dispatch<React.SetStateAction<object>>;
  };
  article: {
    article: ArticleData | null;
    setArticle: React.Dispatch<React.SetStateAction<ArticleData | null>>;
  };
  writerImages: {
    writerImages: object;
    setWriterImages: React.Dispatch<React.SetStateAction<object>>;
  };
  profiles: {
    profiles: object;
    setProfiles: React.Dispatch<React.SetStateAction<object>>;
  };
  comments: {
    commentsSocialStats: object;
    setCommentSocialStats: React.Dispatch<React.SetStateAction<object>>;
  };
  replies: {
    repliesSocialStats: object;
    setRepliesSocialStats: React.Dispatch<React.SetStateAction<object>>;
  };
}

export const ArticleContext = createContext<ArticleContextProps>({} as ArticleContextProps);

export const ArticleProvider = ({ children, post }: ArticleProviderProps) => {
  const [users, setUsers] = useState<object>({});
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [writerImages, setWriterImages] = useState<object>({});
  const [profiles, setProfiles] = useState<object>({});
  const [commentsSocialStats, setCommentSocialStats] = useState<object>({});
  const [repliesSocialStats, setRepliesSocialStats] = useState<object>({});

  return (
    <ArticleContext.Provider
      value={{
        users: { users, setUsers },
        article: { article, setArticle },
        writerImages: { writerImages, setWriterImages },
        profiles: { profiles, setProfiles },
        comments: {
          commentsSocialStats,
          setCommentSocialStats,
        },
        replies: { repliesSocialStats, setRepliesSocialStats },
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticle = () => {
  const article = useContext<ArticleContextProps>(ArticleContext);
  return article;
};
