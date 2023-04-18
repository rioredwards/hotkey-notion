#!/usr/bin/env node

import dotenv from "dotenv";
import { connectToDatabase } from "./services/server";

dotenv.config();

async function main() {
  let NOTION_TOKEN: string;
  let NOTION_DATABASE_ID: string;

  // Check if environment variables are set
  if (process.env.NOTION_TOKEN) {
    NOTION_TOKEN = process.env.NOTION_TOKEN;
    console.log("✅ NOTION_TOKEN is set");
  } else {
    throw new Error("❌NOTION_TOKEN is NOT set");
  }
  if (process.env.NOTION_DATABASE_ID) {
    NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
    console.log("✅ NOTION_DATABASE_ID is set");
  } else {
    throw new Error("❌ NOTION_TOKEN is NOT set");
  }

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
