"use client";

import { createContext, useContext, useEffect, useState } from "react";

import useAccessToken from "../hooks/use-access-token";
import useUser from "../hooks/use-user";
import { refreshAccessToken } from "../utils/auth-query-functions";

interface RefreshAccessTokenContextType {
  isRefreshing: boolean;
}

const RefreshAccessTokenContext = createContext<
  RefreshAccessTokenContextType | undefined
>(undefined);

export const useRefreshAccessToken = () => {
  const context = useContext(RefreshAccessTokenContext);

  if (context === undefined) {
    throw new Error("useRefreshAccessToken must be used within AuthProvider");
  }

  return context;
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAccessToken, clearAccessToken } = useAccessToken();
  const { setUser, clearUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(true);

  useEffect(() => {
    (async () => {
      setIsRefreshing(true);

      try {
        const { accessToken, user } = await refreshAccessToken();

        setAccessToken(accessToken);
        setUser(user);
      } catch (_error) {
        // If refresh fails, clear auth state (user is not authenticated)
        clearAccessToken();
        clearUser();
      } finally {
        setIsRefreshing(false);
      }
    })();
  }, [setAccessToken, setUser, clearAccessToken, clearUser]);

  return (
    <RefreshAccessTokenContext.Provider value={{ isRefreshing }}>
      {children}
    </RefreshAccessTokenContext.Provider>
  );
};

export default AuthProvider;
