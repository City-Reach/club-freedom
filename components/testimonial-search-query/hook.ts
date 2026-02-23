import { useQueryStates } from "nuqs";
import { testimonialSearchQueryParams } from "./schema";

export const useTestimonialSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useQueryStates(
    testimonialSearchQueryParams,
  );

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
  };
};
