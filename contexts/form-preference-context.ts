import { createContext, use } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

type FormPreferenceContext = {
  formPreference: Doc<"formPreferences">;
};

export const FormPreferenceContext =
  createContext<FormPreferenceContext | null>(null);

export function useFormPreferenceContext() {
  const context = use(FormPreferenceContext);
  if (!context) {
    throw new Error(
      "useFormPreferenceContext must be used within a FormPreferenceContext.Provider",
    );
  }
  return context;
}
