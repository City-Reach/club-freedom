import {
  createStandardSchemaV1,
  type inferParserType,
  parseAsString,
} from "nuqs";

export const testimonialFilterSchema = {
  q: parseAsString.withDefault(""),
};

export const testimonialFilter = createStandardSchemaV1(
  testimonialFilterSchema,
);

export type TestimonialFilter = inferParserType<typeof testimonialFilterSchema>;
