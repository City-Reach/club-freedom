## Auth Migration Instructions.

1. Ensure @convex-dev/migrations is installed.
2. Run the command to sync your desired Convex environment with the schema. For devs,
   this would be `pnpm convex dev`
3. Run the command below to change the data in the testimonials table
   `pnpx convex run migrations:run '{fn: "migrations:setDefaultApprovedValue"}'`

Note: pass the --prod argument to run this in production

### Adding the orgSlug field to the testimonials table

1. Add `ORGANIZATION_ID` environment variable to your convex environment. This is the desired organization id you want to add to all rows in the testimonials table.
2. Change the "organizationId" field in the testimonials table in convex\schema.ts to `v.optional(v.string())`
3. Ensure convex function sync is running with `pnpm comvex dev`
4. Run `pnpx convex run migrations:run '{fn: "migrations:setTestimonialOrganizationId"}'`
5. Change the "organizationId" field in the testimonials table in convex\schema.ts to `v.string()`
