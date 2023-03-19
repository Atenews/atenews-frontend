import type { GetServerSideProps } from 'next';

export default function Page() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => ({
  redirect: {
    destination: `/${ctx.params?.slug}`,
    permanent: true,
  },
});
