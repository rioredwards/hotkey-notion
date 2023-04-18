#!/usr/bin/env node
import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("hello world");
}

async function connectToDatabase() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });
  const databaseId = process.env.NOTION_DATABASE_ID!;

  const database = await notion.databases.retrieve({
    database_id: databaseId,
  });

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  console.log("Got database:", database);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
