#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase } from "./services/server.js";
import { CredType, getCreds, saveCreds } from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { SpinType, logger, spinner } from "./logger.js";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getCreds(CredType.CREATE);
  let database: GetDatabaseResponse | null = null;
  let needToUpdateCreds = false;
  const mySpinner = createSpinner();

  // Attempt to connect to database
  while (!database) {
    spinner(mySpinner, SpinType.SPINSTART, "connecting to database");

    database = await connectToDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
    if (database) {
      spinner(mySpinner, SpinType.SPINSUCCESS, "connected to database");
    } else {
      spinner(mySpinner, SpinType.SPINERROR, "could not connect to database");
      needToUpdateCreds = true;
      ({ NOTION_TOKEN, NOTION_DATABASE_ID } = await getCreds(CredType.UPDATE));
    }
  }

  if (needToUpdateCreds) {
    saveCreds(NOTION_TOKEN, NOTION_DATABASE_ID);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
