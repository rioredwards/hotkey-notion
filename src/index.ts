#!/usr/bin/env node
import dotenv from "dotenv";
import { connectToDatabase } from "./services/server.js";
import { getCredentials } from "./commands/setup.js";
// import { askForToken } from "./commands/setup";

dotenv.config();

async function main() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = await getCredentials();

  // Attempt to connect to database
  const dbSetupResponse = await connectToDatabase(
    NOTION_TOKEN,
    NOTION_DATABASE_ID
  );
  if (dbSetupResponse) {
    console.log("✅ Connected to database");
  } else {
    throw new Error("❌ Could not connect to database");
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
