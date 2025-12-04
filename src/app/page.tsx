"use client";

import { useRefreshAccessToken } from "@/app/components/auth-provider";
import FourUpcomingShowtimes from "@/app/components/four-upcoming-showtimes";
import LandingPage from "@/app/components/landing-page";
import useMovies from "@/app/hooks/use-movies";
import useUser from "@/app/hooks/use-user";

const Page = () => {
  const { moviesQuery, genresQuery } = useMovies();
  const { user } = useUser();
  const { isRefreshing } = useRefreshAccessToken();
  const isLoading =
    isRefreshing || moviesQuery.isPending || genresQuery.isPending;

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div>Loading...</div>
      </div>
    );
  }

  // If authenticated, show four upcoming showtimes
  if (user) {
    return (
      <div className="min-h-screen">
        <FourUpcomingShowtimes />
      </div>
    );
  }

  // If not authenticated, show landing page
  return <LandingPage />;
};

export default Page;
