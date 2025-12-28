import { exit } from "node:process";
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
});

// Step 0: Validate env
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
  exit(0);
}

// Step 3: Update the Notion page with the PR link and status
const url = pullRequest.html_url;

if (!url) {
  console.log("No PR URL found");
  exit(1);
}

const prPropertyName = env.NOTION_PR_PROPERTY_NAME;
const statusPropertyName = env.NOTION_STATUS_PROPERTY_NAME;

await notion.pages.update({
  page_id: found.id,
  properties: {
    [statusPropertyName]: {
      status: {
        name: pullRequest.merged ? "Done" : "In Progress",
      },
    },
    [prPropertyName]: {
      url,
    },
  },
});
