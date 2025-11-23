"use client";

import { Testimonials } from "@/components/testimonials";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/testimonials/")({
  component: TestimonialsPage,
  loader: async ({ context }) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in",
      });
    }
    return {
      userId: context.userId,
    };
  },
});

function TestimonialsPage() {
  return (
    <main className="container mx-auto px-4">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2 py-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-balance">
            What Our Volunteers Say
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-balance">
            Don't just take our word for it. Here's what real volunteers have to
            say about their experience.
          </p>
        </div>
      </div>
      <div className="w-full space-y-8 max-w-lg mx-auto pb-24">
        <Testimonials />
      </div>
    </main>
  );
}
