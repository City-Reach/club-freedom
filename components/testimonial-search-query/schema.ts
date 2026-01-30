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

export type TestimonialSearchQuery = inferParserType<
  typeof testimonialSearchQueryParams
>;

export const countActiveQueries = (query: TestimonialSearchQuery) => {
  let count = 0;

  if (query.q !== "") count++;
  if (query.author !== "") count++;
  if (query.formats.length > 0) count++;
  if (query.from !== null) count++;
  if (query.to !== null) count++;

  return count;
};
