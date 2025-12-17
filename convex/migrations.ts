import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

export const migrations = new Migrations<DataModel>(components.migrations);

export const setDefaultApprovedValue = migrations.define({
  table: "testimonials",
  migrateOne: () => ({ approved: true }),
});

export const backFillSearchText = migrations.define({
  table: "testimonials",
  migrateOne(_, doc) {
    if (doc.searchText) {
      return {};
    }
    const email = doc.email || "";
    const name = doc.name || "";
    const summary = doc.summary || "";
    const text = doc.testimonialText || "";
    const title = doc.title || "";
    const searchText = [email, name, summary, text, title].join(" ");
    return { searchText };
  },
});

export const runMigration = migrations.runner([
  internal.migrations.fillProcessingStatus,
]);

export const undoMigration = migrations.runner([
  internal.migrations.unsetProcessingStatus,
]);

export const fillProcessingStatus = migrations.define({
  table: "testimonials",
  migrateOne: (_, doc) => {
    if (doc.processingStatus) {
      return {};
    }

    if (!doc.testimonialText) {
      return { processingStatus: "transcriptionError" as const };
    }

    if (!doc.title || !doc.summary) {
      return { processingStatus: "summaryError" as const };
    }

    return { processingStatus: "completed" as const };
  },
});

export const unsetProcessingStatus = migrations.define({
  table: "testimonials",
  migrateOne: () => {
    return { processingStatus: undefined };
  },
});
