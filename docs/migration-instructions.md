## Auth Migration Instructions.

1. Ensure @convex-dev/migrations is installed.
2. Run the command to sync your desired Convex environment with the schema. For devs,
   this would be `pnpm convex dev`
3. Run the command below to change the data in the testimonials table
   `pnpx convex run migrations:run '{fn: "migrations:setDefaultApprovedValue"}'`
