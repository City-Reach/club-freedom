import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

export const testimonialFormats = ["video", "audio", "text"] as const;
export type TestimonialFormat = (typeof testimonialFormats)[number];
export const getTestimonialFormatLabel = (type: TestimonialFormat) => {
  switch (type) {
    case "text":
      return "Text";
    case "video":
      return "Video";
    case "audio":
      return "Audio";
  }
};

export const testimonialStatuses = [
  "pending",
  "published",
  "not-published",
] as const;
export type TestimonialStatus = (typeof testimonialStatuses)[number];
export const getTestimonialStatusLabel = (type: TestimonialStatus) => {
  switch (type) {
    case "pending":
      return "Pending";
    case "published":
      return "Published";
    case "not-published":
      return "Not Published";
  }
};

export const sortOrders = ["newest", "oldest"] as const;
export type SortOrder = (typeof sortOrders)[number];
export const getSortOrderLabel = (order: SortOrder) => {
  switch (order) {
    case "newest":
      return "Newest to Oldest";
    case "oldest":
      return "Oldest to Newest";
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
  statuses: parseAsArrayOf(parseAsStringLiteral(testimonialStatuses)).withDefault(
    [],
  ),
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
  if (query.order !== null) count++;
  if (query.statuses.length > 0) count++;

  return count;
};
