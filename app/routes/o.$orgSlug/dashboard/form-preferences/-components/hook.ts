import { parseAsString, useQueryState } from "nuqs";

export function useFormPreferenceIdParam() {
  const [formPreferenceId, setFormPreferenceId] = useQueryState(
    "id",
    parseAsString,
  );

  return { formPreferenceId, setFormPreferenceId };
}
