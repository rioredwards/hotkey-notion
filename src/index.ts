#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase, createClient } from "./services/server.js";
import { getNotionCredentials, saveCreds } from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import {
  GetDatabaseResponse,
  getDatabase,
} from "@notionhq/client/build/src/api-endpoints.js";
import { SpinType, spinner } from "./logger.js";
import { Client } from "@notionhq/client";
import { addToDatabase, getDatabaseEntry } from "./commands/add.js";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getNotionCredentials();
  let notion: Client | null = null;
  let database: GetDatabaseResponse | null = null;
  const mySpinner = createSpinner();
  let needToUpdateCreds = false;

  // Connect to database
  while (!database || !notion) {
    spinner(mySpinner, SpinType.SPINSTART, "connecting to database");
    notion = createClient(NOTION_TOKEN);
    database = await connectToDatabase(notion, NOTION_DATABASE_ID);

    if (database) {
      spinner(mySpinner, SpinType.SPINSUCCESS, "connected to database");
    } else {
      spinner(mySpinner, SpinType.SPINERROR, "could not connect- try again!");
      needToUpdateCreds = true;
      ({ NOTION_TOKEN, NOTION_DATABASE_ID } = await getNotionCredentials());
    }
  }

  if (needToUpdateCreds) {
    saveCreds(NOTION_TOKEN!, NOTION_DATABASE_ID!);
    needToUpdateCreds = false;
  }

  // TODO Check if database has the correct schema

  // TODO Create a new database if needed

  // TODO Get user input
  const entry = await getDatabaseEntry();

  // TODO Add new entry to database
  await addToDatabase(notion, NOTION_DATABASE_ID, entry);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
