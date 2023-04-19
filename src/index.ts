#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase } from "./services/server.js";
import {
  CredentialType,
  getCredentials,
  saveCredentials,
} from "./commands/setup.js";
import { createSpinner } from "nanospinner";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { SpinStatus, logger, spinner } from "./logger.js";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getCredentials(
    CredentialType.CREATE
  );
  let database: GetDatabaseResponse | null = null;
  let needToUpdateCredentials = false;
  const mySpinner = createSpinner();

  // Attempt to connect to database
  while (!database) {
    spinner(mySpinner, SpinStatus.SPINSTART, "connecting to database");

    database = await connectToDatabase(NOTION_TOKEN, NOTION_DATABASE_ID);
    if (database) {
      spinner(mySpinner, SpinStatus.SPINSUCCESS, "connected to database");
    } else {
      spinner(mySpinner, SpinStatus.SPINERROR, "could not connect to database");
      needToUpdateCredentials = true;
      ({ NOTION_TOKEN, NOTION_DATABASE_ID } = await getCredentials(
        CredentialType.UPDATE
      ));
    }
  }

  if (needToUpdateCredentials) {
    saveCredentials(NOTION_TOKEN, NOTION_DATABASE_ID);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
