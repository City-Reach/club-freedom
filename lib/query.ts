import { useConvex } from "@convex-dev/react-query";
import { queryOptions, useInfiniteQuery } from "@tanstack/react-query";
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

const TESTIMONIAL_PER_PAGE = 10;

export function useInfiniteTestimonialQuery(
  searchQuery: TestimonialSearchQuery,
) {
  const convex = useConvex();
  const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
  const before = searchQuery.to
    ? searchQuery.to.getTime() + timezoneOffset + 24 * 60 * 60 * 1000 - 1
    : undefined;
  const after = searchQuery.from
    ? searchQuery.from.getTime() + timezoneOffset
    : undefined;

  const query = useInfiniteQuery({
    queryKey: ["testimonials", searchQuery],
    initialPageParam: null as string | null,
    maxPages: undefined,
    queryFn: async ({ pageParam }) => {
      return await convex.query(api.testimonials.getTestimonials, {
        searchQuery: searchQuery.q,
        filters: {
          author: searchQuery.author,
          types: searchQuery.formats,
          before,
          after,
        },
        paginationOpts: {
          cursor: pageParam,
          numItems: TESTIMONIAL_PER_PAGE,
        },
      });
    },
    getNextPageParam: (lastPage) =>
      lastPage.isDone || !lastPage.continueCursor
        ? undefined
        : lastPage.continueCursor,
  });

  return query;
}
