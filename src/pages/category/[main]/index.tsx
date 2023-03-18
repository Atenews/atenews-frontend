import React from 'react';

import listServerSideProps from '@/utils/serverProps/listServerSideProps';

import ArchiveLayout from '@/components/ArchiveLayout';

const CategoryPage: React.FC = (props) => (
  <ArchiveLayout {...props} />
);

export async function getServerSideProps(ctx) {
  return listServerSideProps(ctx.params.main);
}

export default CategoryPage;
