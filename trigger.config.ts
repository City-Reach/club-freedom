import { defineConfig } from "@trigger.dev/sdk";
import { ffmpeg } from "@trigger.dev/build/extensions/core";

export default defineConfig({
  // Your project ref from the Trigger.dev dashboard
  project: process.env.TRIGGER_PROJECT_REF || "",

  // Directories containing your tasks
  dirs: ["./src/trigger"], // Customize based on your project structure

  // Retry configuration
  retries: {
    enabledInDev: false, // Enable retries in development
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },

  // Build configuration (optional)
  build: {
    extensions: [ffmpeg()], // Build extensions go here
    external: ["fluent-ffmpeg"], // When a package is excluded from the bundle, it will be added to a dynamically generated package.json file in the build directory
  },

  // Max duration of a task in seconds
  maxDuration: 3600,
});
