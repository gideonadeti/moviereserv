"use client";

import { Calendar, Film, Ticket, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Footer from "./footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Welcome to <span className="text-primary">Moviereserv</span>
          </h1>
          <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground">
            Your one-stop solution for booking movie tickets. Reserve your seats
            with ease and enjoy the best cinema experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 bg-muted/30">
        <div className="flex flex-col items-center space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center">
            Why Choose Moviereserv?
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-2xl">
            Experience seamless movie ticket booking with our intuitive platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mt-8">
            <Card>
              <CardHeader>
                <Film className="size-8 text-primary mb-2" />
                <CardTitle>Wide Selection</CardTitle>
                <CardDescription>
                  Browse through a vast collection of movies and showtimes
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Ticket className="size-8 text-primary mb-2" />
                <CardTitle>Easy Booking</CardTitle>
                <CardDescription>
                  Reserve your tickets in just a few clicks with our simple
                  booking process
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Calendar className="size-8 text-primary mb-2" />
                <CardTitle>Flexible Scheduling</CardTitle>
                <CardDescription>
                  Choose from multiple showtimes that fit your schedule
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="size-8 text-primary mb-2" />
                <CardTitle>Seat Selection</CardTitle>
                <CardDescription>
                  Pick your preferred seats for the best viewing experience
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col items-center text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Ready to Book Your Next Movie?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join thousands of movie lovers who trust Moviereserv for their
            ticket bookings. Get started today!
          </p>
          <Button asChild size="lg" className="mt-4">
            <Link href="/auth/sign-up">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
