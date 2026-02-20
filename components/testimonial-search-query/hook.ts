import { useQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { hasPermissionQuery } from "@/lib/query";
import { testimonialSearchQueryParams } from "./schema";

export const useTestimonialSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useQueryStates(
    testimonialSearchQueryParams,
  );

  const { data: canView } = useQuery(
    hasPermissionQuery({
      testimonial: ["view"],
    }),
  );

  const activeQueriesCount = useMemo(() => {
    let count = 0;

    if (searchQuery.author !== "") count++;
    if (searchQuery.formats.length > 0) count++;
    if (searchQuery.from !== null) count++;
    if (searchQuery.to !== null) count++;
    if (searchQuery.order !== null) count++;
    if (searchQuery.statuses.length > 0 && canView) count++;

    return count;
  }, [searchQuery, canView]);

  const resetSortAndFilters = () => {
    setSearchQuery({
      author: "",
      formats: [],
      statuses: [],
      from: null,
      to: null,
      order: null,
    });
  };

  return {
    searchQuery,
    setSearchQuery,
    resetSortAndFilters,
    activeQueriesCount,
  };
};
