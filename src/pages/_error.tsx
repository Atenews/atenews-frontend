import React from 'react';
import Error from '@/components/Error';
import type { NextPage } from 'next';

const CustomError: NextPage<{ statusCode?: number }> = ({ statusCode }) => (
  <Error statusCode={statusCode} />
);

CustomError.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? (err.statusCode ?? 200) : 404;
  return { statusCode };
};

export default CustomError;
