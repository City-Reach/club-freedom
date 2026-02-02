import { convexQuery } from "@convex-dev/react-query";
import { usePaginatedQuery } from "convex/react";
import type { TestimonialSearchQuery } from "@/components/testimonial-search-query/schema";
import { api } from "@/convex/_generated/api";
import type { OrganizationPermissionCheck } from "./auth/permissions/organization";

export function hasPermissionQuery(
  permissions: OrganizationPermissionCheck,
  organizationId?: string,
) {
  return convexQuery(api.auth.checkUserPermissions, {
    permissions,
    organizationId,
  });
}

export function getMemberRoleQuery(organizationId: string) {
  return convexQuery(api.auth.getMemeberRole, {
    organizationId,
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
