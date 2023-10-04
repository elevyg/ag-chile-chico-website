import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children: React.ReactElement;
};

export const ProtectedAdminLayout = ({ children }: Props) => {
  const router = useRouter();
  const { status: sessionStatus, data } = useSession();
  const authorized = sessionStatus === "authenticated";
  const unAuthorized = sessionStatus === "unauthenticated";
  const loading = sessionStatus === "loading";

  const isAdmin = data?.user.role === "ADMIN";

  useEffect(() => {
    if (loading || !router.isReady) return;

    if (unAuthorized || !isAdmin) {
      void router.push({
        pathname: "/",
        query: { returnUrl: router.asPath },
      });
    }
  }, [loading, unAuthorized, sessionStatus, router, isAdmin]);

  if (loading) {
    return null;
  }

  return authorized && isAdmin ? <div>{children}</div> : <></>;
};
