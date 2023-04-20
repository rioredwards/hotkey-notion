#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase, createClient } from "./services/server.js";
import { getNotionCredentials, saveCreds } from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { logTable, spinner } from "./logger.js";
import { Client } from "@notionhq/client";
import { addToDatabase, getUserDatabaseEntry } from "./commands/add.js";
import { queryDatabase } from "./commands/list.js";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getNotionCredentials(false);
  let notion: Client | null = null;
  let database: GetDatabaseResponse | null = null;
  const mySpinner = createSpinner();
  let needToUpdateCreds = false;

  // Connect to database
  while (!database || !notion) {
    spinner(mySpinner, "SPINSTART", "connecting to database");
    notion = createClient(NOTION_TOKEN);
    database = await connectToDatabase(notion, NOTION_DATABASE_ID);

    if (database) {
      spinner(mySpinner, "SPINSUCCESS", "connected to database");
    } else {
      spinner(mySpinner, "SPINERROR", "could not connect- try again!");
      needToUpdateCreds = true;
      ({ NOTION_TOKEN, NOTION_DATABASE_ID } = await getNotionCredentials(true));
    }
  }

  if (needToUpdateCreds) {
    saveCreds(NOTION_TOKEN!, NOTION_DATABASE_ID!);
    needToUpdateCreds = false;
  }

  // TODO Check if database has the correct schema

  // TODO Create a new database if needed

  // ADD COMMAND
  // const entry = await getUserDatabaseEntry();
  // await addToDatabase(notion, NOTION_DATABASE_ID, entry);

  // LIST COMMAND
  spinner(mySpinner, "SPINSTART", "querying database");
  let requestedCommands: Array<string[]> = [];
  const { data, error } = await queryDatabase(
    notion,
    NOTION_DATABASE_ID,
    "Hello"
  );

  if (error) {
    spinner(mySpinner, "SPINERROR", "error querying database");
    return 1;
  } else {
    requestedCommands = data;
    spinner(mySpinner, "SPINSUCCESS", "success! here are your commands");
    // requestedCommands.forEach((command) =>
    //   console.log(command[0], command[1], command[2])
    // );
    logTable(requestedCommands);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
