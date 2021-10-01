export default function Page() {
  return null;
}

export const getServerSideProps = async (ctx) => ({
  redirect: {
    destination: `/${ctx.params.slug}`,
    permanent: true,
  },
});
