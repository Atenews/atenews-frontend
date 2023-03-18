import React from 'react';

import Error from '@/components/Error';

import type { ErrorProps } from 'next/error';
import type { NextPage } from 'next';

const CustomError: NextPage<ErrorProps> = ({ statusCode }) => <Error statusCode={statusCode} />;

CustomError.getInitialProps = ({ res, err }) => {
  // eslint-disable-next-line no-nested-ternary
  const statusCode = res ? res.statusCode : err ? (err.statusCode ?? 200) : 404;
  return { statusCode };
};

export default CustomError;
