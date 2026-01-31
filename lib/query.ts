import { queryOptions } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";
import type { TestimonialSearchQuery } from "@/components/testimonial-search-query/schema";
import { api } from "@/convex/_generated/api";
import { authClient } from "@/lib/auth/auth-client";
import type { PermissionCheck } from "@/lib/auth/permissions";

export function hasPermissionQuery(permissions: PermissionCheck) {
  return queryOptions({
    queryKey: ["hasPermission", permissions],
    queryFn: async () => {
      const { data } = await authClient.admin.hasPermission({
        permissions,
      });
      return data?.success || false;
    },
    staleTime: Infinity,
  });
}

export const TESTIMONIAL_PER_PAGE = 10;

export function useInfiniteTestimonialQuery(
  searchQuery: TestimonialSearchQuery,
) {
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
  const before = searchQuery.to
    ? searchQuery.to.getTime() + timezoneOffset + 24 * 60 * 60 * 1000 - 1
    : undefined;
  const after = searchQuery.from
    ? searchQuery.from.getTime() + timezoneOffset
    : undefined;

  return usePaginatedQuery(
    api.testimonials.getTestimonials,
    {
      searchQuery: searchQuery.q,
      filters: {
        author: searchQuery.author,
        types: searchQuery.formats,
        before,
        after,
      },
      order:
        searchQuery.order === "oldest"
          ? "asc"
          : searchQuery.order === "newest"
            ? "desc"
            : undefined,
    },
    {
      initialNumItems: TESTIMONIAL_PER_PAGE,
    },
  );
}
