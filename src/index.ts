#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase, createClient } from "./services/server.js";
import { getNotionCredentials } from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { logger, spinner } from "./logger.js";
import { Client } from "@notionhq/client";
import { addToDatabase, getUserDatabaseEntry } from "./commands/add.js";
import { queryDatabase } from "./commands/list.js";
import { drawTable } from "./table.js";
import {
  getHotkeysFromCache,
  saveCreds,
  saveHotkeysToCache,
} from "./services/storage.js";

interface hotkeyResponseObj {
  data: string[][] | null;
  err: Error | null;
}

dotenv.config();
// const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

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
    // await sleep();
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
    logger("SUCCESS", "saving credentials...");
    needToUpdateCreds = false;
  }

  // TODO Check if database has the correct schema

  // TODO Create a new database if needed

  // ADD COMMAND
  // const entry = await getUserDatabaseEntry();
  // await addToDatabase(notion, NOTION_DATABASE_ID, entry);

  // LIST COMMAND
  spinner(mySpinner, "SPINSTART", "querying database");
  let requestedCommands: string[][];
  // const { data, err } = await queryDatabase(
  //   notion,
  //   NOTION_DATABASE_ID,
  //   "Hello"
  // );
  const { data, err } = await getHotkeysFromCache();

  if (err) {
    console.log(err);
    spinner(mySpinner, "SPINERROR", "error querying database");
    return 1;
  } else {
    requestedCommands = data;
    spinner(mySpinner, "SPINSUCCESS", "success! here are your commands");
    spinner(mySpinner, "SPINSTART", "saving hotkeys to cache...");
    saveHotkeysToCache(requestedCommands);
    drawTable(requestedCommands);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
