import { procedure } from '@/server/trpc';
import WP from '@/utils/wordpress';

const handler = procedure.query(async () => {
  const staffs: Staff[] = await WP.staffs();
  return staffs;
});

export default handler;
