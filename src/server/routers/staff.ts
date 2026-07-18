import { publicProcedure } from '@/server/trpc';
import WP from '@/utils/wordpress';

const handler = publicProcedure.query(async () => {
  const staffs: Staff[] = await WP.staffs();
  return staffs;
});

export default handler;
