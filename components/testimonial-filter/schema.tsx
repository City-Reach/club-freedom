import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsString,
  useQueryStates,
} from "nuqs";

export const testimonialFilterParams = {
  q: parseAsString.withDefault(""),
  author: parseAsString.withDefault(""),
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
