import React from 'react';

import listServerSideProps from '@/utils/serverProps/listServerSideProps';

import ArchiveLayout from '@/components/ArchiveLayout';

const SubCategoryPage: React.FC = (props) => {
  return (
    <ArchiveLayout {...props} />
  );
}

export async function getServerSideProps(ctx) {
  return listServerSideProps(ctx.params.sub);
}

export default SubCategoryPage;