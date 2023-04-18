#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase } from "./services/server.js";
import { askForCredential, getCredentials } from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints.js";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getCredentials();
  let database: GetDatabaseResponse | null = null;

  // Attempt to connect to database
  while (!database) {
    const spinner = createSpinner(
      "Connecting to your notion database...\n"
    ).start();

    database = await connectToDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
    if (database) {
      spinner.success({ text: "Connected to database" });
    } else {
      spinner.error({ text: "Could not connect to database" });
      NOTION_DATABASE_ID = await askForCredential("notion database id");
      NOTION_TOKEN = await askForCredential("notion token");
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
