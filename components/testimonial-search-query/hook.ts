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

  const isActive =
    frozenSearchQueryRef.current.author !== "" ||
    frozenSearchQueryRef.current.formats.length > 0 ||
    frozenSearchQueryRef.current.from !== null ||
    frozenSearchQueryRef.current.to !== null;

  const reset = () => {
    setSearchQuery({
      q: "",
      author: "",
      formats: [],
      from: null,
      to: null,
    });
  };

  return {
    searchQuery: frozenSearchQueryRef.current,
    setSearchQuery,
    isActive,
    reset,
  };
};
