import { prisma } from "~/server/db";
import { getParkTicketsRedirectUrl } from "~/server/parkTickets";

export const getServerSideProps = async () => {
  const destination = await getParkTicketsRedirectUrl(prisma);

  return {
    redirect: {
      destination,
      permanent: false,
    },
  };
};

const ParkTicketsRedirect = () => null;

export default ParkTicketsRedirect;
