import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export const testimonialFormats = ["video", "audio", "text"] as const;

export const getTestimonialFormatLabel = (
  type: (typeof testimonialFormats)[number],
) => {
  switch (type) {
    case "text":
      return "Text";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
  }
};

export const testimonialSearchQueryParams = {
  q: parseAsString.withDefault(""),
  author: parseAsString.withDefault(""),
  formats: parseAsArrayOf(parseAsStringLiteral(testimonialFormats)).withDefault(
    [],
  ),
  from: parseAsIsoDate,
  to: parseAsIsoDate,
};

export const testimonialSearchQuerySchema = createStandardSchemaV1(
  testimonialSearchQueryParams,
  {
    partialOutput: true,
  },
);

export type TestimonialFilter = inferParserType<
  typeof testimonialSearchQueryParams
>;

export const useTestimonialSearchQuery = () => {
  const [searchQuery, setSearchQuery] = useQueryStates(
    testimonialSearchQueryParams,
  );

  const isActive =
    searchQuery.author !== "" ||
    searchQuery.formats.length > 0 ||
    searchQuery.from !== null ||
    searchQuery.to !== null;

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
    searchQuery,
    setSearchQuery,
    isActive,
    reset,
  };
};
