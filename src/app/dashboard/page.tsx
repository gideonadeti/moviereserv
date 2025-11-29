"use client";

import useUser from "../hooks/use-user";

const Page = () => {
  const { user } = useUser();
  const firstName = user?.name.split(" ")[0];

  return <div>Welcome, {firstName}</div>;
};

export default Page;
