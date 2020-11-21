import React from 'react';

import WP from '@/utils/wordpress';

import ArchiveLayout from '@/components/ArchiveLayout';

export default function Page(props) {
  return (
    // eslint-disable-next-line react/destructuring-assignment
    <ArchiveLayout {...props} name={`Search Results for "${props.query}"`} />
  );
}

export async function getServerSideProps({ query: rawQuery }) {
  try {
    const { query } = rawQuery;
    const [articles] = await Promise.all([
      WP.posts().search(query),
    ]);
    return { props: { articles, query, category: 'search' } };
  } catch (err) {
    return { props: { articles: [], query: '', category: 'search' } };
  }
}
