import { useRouter } from "@tanstack/react-router";
import { useQueryStates } from "nuqs";
import { useEffect, useRef } from "react";
import { testimonialSearchQueryParams } from "./schema";

export const useTestimonialSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useQueryStates(
    testimonialSearchQueryParams,
  );

  const router = useRouter();
  const frozenSearchQueryRef = useRef(searchQuery);
  const isPending = router.state.status === "pending";

  useEffect(() => {
    if (!isPending) {
      frozenSearchQueryRef.current = searchQuery;
    }
  }, [searchQuery, isPending]);

  const reset = () => {
    setSearchQuery({
      author: "",
      formats: [],
      from: null,
      to: null,
    });
  };

  return {
    searchQuery: frozenSearchQueryRef.current,
    liveSearchQuery: searchQuery,
    setSearchQuery,
    reset,
  };
};
