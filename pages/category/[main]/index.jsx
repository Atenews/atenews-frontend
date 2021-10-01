import React from 'react';

import listServerSideProps from '@/utils/serverProps/listServerSideProps';

import ArchiveLayout from '@/components/ArchiveLayout';

export default function Page(props) {
  return (
    <ArchiveLayout {...props} name={props.categoryName} />
  );
}

export async function getServerSideProps(ctx) {
  return listServerSideProps(ctx.params.main);
}
