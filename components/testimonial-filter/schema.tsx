import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsArrayOf,
  parseAsIsoDate,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";

export const testimonialTypes = ["video", "audio", "text"] as const;

export const getTestimonialTypeLabel = (
  type: (typeof testimonialTypes)[number],
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

export const testimonialFilterParams = {
  q: parseAsString.withDefault(""),
  author: parseAsString.withDefault(""),
  testimonialTypes: parseAsArrayOf(
    parseAsStringLiteral(testimonialTypes),
  ).withDefault(["audio", "text", "video"]),
  before: parseAsIsoDate,
  after: parseAsIsoDate,
};

export const testimonialFilterSchema = createStandardSchemaV1(
  testimonialFilterParams,
  {
    partialOutput: true,
  },
);

export type TestimonialFilter = inferParserType<typeof testimonialFilterParams>;

export const useTestimonialFilter = () => {
  return useQueryStates(testimonialFilterParams);
};
