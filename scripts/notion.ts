import { exit } from "node:process";
import { setOutput } from "@actions/core";
import { context } from "@actions/github";
import { Client } from "@notionhq/client";
import { z } from "zod";

const envSchema = z.object({
  NOTION_API_KEY: z.string().min(1),
  NOTION_DATA_SOURCE_ID: z.string().min(1),
  NOTION_UNIQUE_ID_NAME: z.string().min(1),
  NOTION_UNIQUE_ID_PREFIX: z.string().min(1),
  NOTION_STATUS_PROPERTY_NAME: z.string().min(1),
  NOTION_PR_PROPERTY_NAME: z.string().min(1),
  GITHUB_OUTPUT: z.string().optional(),
});

// Step 0: Set up env
const env = envSchema.parse(process.env);

const PR_TITLE_REGEX = new RegExp(
  `^\\[${env.NOTION_UNIQUE_ID_PREFIX}-(\\d+)\\]`,
);

// Step 1: Get the PR and extract the task ID from the title
const pullRequest = context.payload.pull_request;

if (!pullRequest) {
  console.log("No pull request found in the context");
  exit(1);
}

const prTitle = pullRequest.title;

const taskIdMatch = prTitle.match(PR_TITLE_REGEX);

if (!taskIdMatch) {
  console.warn(
    `PR title does not match the expected format: [${env.NOTION_UNIQUE_ID_PREFIX}-<ID>] <PR Title Name>`,
  );

  // Set output for GitHub Actions
  setOutput(
    "message",
    `❌ **Invalid PR Title Format**

Your PR title does not match the expected format.

**Expected format**: \`[${env.NOTION_UNIQUE_ID_PREFIX}-<ID>] <PR Title Name>\`
**Current title**: \`${prTitle}\`

Please update your PR title to include a valid Notion task ID.`,
  );

  exit(1);
}

const taskId = parseInt(taskIdMatch[1], 10);

// Step 2: Query Notion for the page with the given task ID
const notion = new Client({ auth: env.NOTION_API_KEY });

const data = await notion.dataSources.query({
  data_source_id: env.NOTION_DATA_SOURCE_ID,
  filter: {
    property: env.NOTION_UNIQUE_ID_NAME,
    unique_id: {
      equals: taskId,
    },
  },
});

const found = data.results.at(0);

if (!found || found.object !== "page") {
  console.log(`No task found with ID ${taskId}`);

  // Set output for GitHub Actions
  setOutput(
    "message",
    `⚠️ **Notion Task Not Found**

No Notion task found with ID: \`${env.NOTION_UNIQUE_ID_PREFIX}-${taskId}\`

Please verify that:
- The task ID in the PR title is correct
- The task exists in the Notion database`,
  );

  exit(1);
}

// Step 3: Update the Notion page with the PR link and status
const prPropertyName = env.NOTION_PR_PROPERTY_NAME;
const statusPropertyName = env.NOTION_STATUS_PROPERTY_NAME;
const taskStatus = pullRequest.merged ? "Done" : "In Progress";

await notion.pages.update({
  page_id: found.id,
  properties: {
    [statusPropertyName]: {
      status: {
        name: taskStatus,
      },
    },
    [prPropertyName]: {
      url: pullRequest.html_url || null,
    },
  },
});

console.log("Successfully updated Notion task");

// Set output for GitHub Actions
const notionPageUrl = `https://www.notion.so/${found.id.replace(/-/g, "")}`;
setOutput(
  "message",
  `✅ **Notion Task Found and Updated**

Successfully linked PR to Notion task: \`${env.NOTION_UNIQUE_ID_PREFIX}-${taskId}\`

- **Status**: ${taskStatus}
- **Notion Page**: [View Task](${notionPageUrl})`,
);
