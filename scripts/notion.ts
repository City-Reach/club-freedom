import { exit } from "node:process";
import { Client } from "@notionhq/client";

const notionApiKey = process.env.NOTION_API_KEY;
const notionDataSourceId = process.env.NOTION_DATA_SOURCE_ID;
const uniqueIdName = process.env.NOTION_UNIQUE_ID_NAME;

const taskId = 43;

if (!notionApiKey || !notionDataSourceId || !uniqueIdName) {
  console.error("Missing environment variables");
  exit(1);
}

const notion = new Client({ auth: notionApiKey });

const data = await notion.dataSources.query({
  data_source_id: notionDataSourceId,
  filter: {
    property: uniqueIdName,
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

const pageId = found.id;

console.log(pageId);
