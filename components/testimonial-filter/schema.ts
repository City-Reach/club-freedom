import { type inferParserType, parseAsString } from "nuqs";

export const testimonialFilterSchema = {
  q: parseAsString.withDefault(""),
};

export type TestimonialFilter = inferParserType<typeof testimonialFilterSchema>;
