"use client";

import { useRefreshAccessToken } from "@/app/components/auth-provider";
import LandingPage from "@/app/components/landing-page";
import useUser from "@/app/hooks/use-user";

const Page = () => {
  const { user } = useUser();
  const { isRefreshing } = useRefreshAccessToken();

  // Show loading state while checking auth
  if (isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div>Loading...</div>
      </div>
    );
  }

  // If authenticated, return null (as requested)
  if (user) {
    return null;
  }

  // If not authenticated, show landing page
  return <LandingPage />;
};

export default Page;
