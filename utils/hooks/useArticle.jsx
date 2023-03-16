/* eslint-disable camelcase */
import React, {
  useState, createContext, useContext,
} from 'react';

import fetch from '@/utils/postFetch';

export const ArticleContext = createContext();

export const ArticleProvider = ({ children, post }) => {
  const [users, setUsers] = useState({});
  const [article, setArticle] = React.useState(null);
  const [writerImages, setWriterImages] = React.useState({});
  const [profiles, setProfiles] = React.useState({});
  const [commentsSocialStats, setCommentSocialStats] = React.useState({});
  const [repliesSocialStats, setRepliesSocialStats] = React.useState({});

  return (
    <ArticleContext.Provider
      value={{
        users: { users, setUsers },
        article: { article, setArticle },
        writerImages: { writerImages, setWriterImages },
        profiles: { profiles, setProfiles },
        comments: {
          commentsSocialStats, setCommentSocialStats,
        },
        replies: { repliesSocialStats, setRepliesSocialStats },
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
};

export const useArticle = () => {
  const article = useContext(ArticleContext);
  return article;
};
