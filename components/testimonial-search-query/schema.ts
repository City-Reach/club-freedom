import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
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

export const sortOrders = ["newest", "oldest", "relevant"] as const;
export const getSortOrderLabel = (order: (typeof sortOrders)[number]) => {
  switch (order) {
    case "newest":
      return "Newest";
    case "oldest":
      return "Oldest";
    case "relevant":
      return "Relevant";
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
  order: parseAsStringLiteral(sortOrders),
};

export const testimonialSearchQuerySchema = createStandardSchemaV1(
  testimonialSearchQueryParams,
  {
    partialOutput: true,
  },
);

export type TestimonialSearchQuery = inferParserType<
  typeof testimonialSearchQueryParams
>;

export const countActiveQueries = (query: TestimonialSearchQuery) => {
  let count = 0;

  if (query.author !== "") count++;
  if (query.formats.length > 0) count++;
  if (query.from !== null) count++;
  if (query.to !== null) count++;

  return count;
};
