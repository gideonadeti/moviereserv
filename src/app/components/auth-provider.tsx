"use client";

import { useEffect } from "react";

import useAccessToken from "../hooks/use-access-token";
import useUser from "../hooks/use-user";
import { refreshAccessToken } from "../utils/auth-query-functions";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAccessToken, clearAccessToken } = useAccessToken();
  const { setUser, clearUser } = useUser();

  useEffect(() => {
    (async () => {
      try {
        const { accessToken, user } = await refreshAccessToken();

        setAccessToken(accessToken);
        setUser(user);
      } catch (_error) {
        // If refresh fails, clear auth state (user is not authenticated)
        clearAccessToken();
        clearUser();
      }
    })();
  }, [setAccessToken, setUser, clearAccessToken, clearUser]);

  return <>{children}</>;
};

export default AuthProvider;
