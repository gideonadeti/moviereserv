import Link from "next/link";

import SignUpForm from "@/app/components/forms/sign-up-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your information to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignUpForm />
          </CardContent>

          <CardFooter className="justify-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="text-primary font-medium hover:underline ml-1"
            >
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Page;
