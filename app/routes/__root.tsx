import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { authClient } from "@/lib/auth-client";
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import {
  fetchSession,
  getCookieName,
} from "@convex-dev/better-auth/react-start";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouteContext,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getCookie, getRequest } from "@tanstack/react-start/server";
import { ConvexReactClient } from "convex/react";
import appCss from "../globals.css?url";

const fetchAuth = createServerFn({ method: "GET" }).handler(async () => {
  const { createAuth } = await import("../../convex/auth");
  const { session } = await fetchSession(getRequest());
  const sessionCookieName = getCookieName(createAuth);
  const token = getCookie(sessionCookieName);
  return {
    userId: session?.user.id,
    token,
  };
});

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Club Freedom Testimonials",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  beforeLoad: async (ctx) => {
    // all queries, mutations and action made with TanStack Query will be
    // authenticated by an identity token.
    const { userId, token } = await fetchAuth();
    // During SSR only (the only time serverHttpClient exists),
    // set the auth token to make HTTP queries with.
    if (token) {
      ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    }
    return { userId, token };
  },
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });
  return (
    <ConvexBetterAuthProvider
      client={context.convexClient}
      authClient={authClient}
    >
      <RootDocument>
        <Outlet />
        <Toaster richColors position="bottom-center" />
      </RootDocument>
    </ConvexBetterAuthProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
