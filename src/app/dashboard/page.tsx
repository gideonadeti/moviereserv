"use client";

import { useRefreshAccessToken } from "../components/auth-provider";
import useUser from "../hooks/use-user";

const Page = () => {
  const { isRefreshing } = useRefreshAccessToken();
  const { user } = useUser();
  const firstName = user?.name.split(" ")[0];

  if (isRefreshing) {
    return <div>Loading...</div>;
  }

  return <div>Welcome, {firstName}</div>;
};

export default Page;
