import { Migrations } from "@convex-dev/migrations";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";

export const migrations = new Migrations<DataModel>(components.migrations);
export const run = migrations.runner();

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
  internal.migrations.backFillSearchText,
]);
