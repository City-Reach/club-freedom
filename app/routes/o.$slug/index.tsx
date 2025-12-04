import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/o/$slug/")({
  loader: ({ params }) => {
    redirect({
      to: "/o/$slug/settings",
      params,
      throw: true,
    });
  },
});
