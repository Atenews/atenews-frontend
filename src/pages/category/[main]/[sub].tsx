import React from 'react';

import listServerSideProps, { ListServerSideProps } from '@/utils/serverProps/listServerSideProps';

import ArchiveLayout from '@/components/ArchiveLayout';
import { GetServerSideProps } from 'next';

const SubCategoryPage: React.FC<ListServerSideProps> = (props) => (
  <ArchiveLayout {...props} />
);

export const getServerSideProps: GetServerSideProps = listServerSideProps;

export default SubCategoryPage;
