#!/usr/bin/env node
const { Client } = require("@notionhq/client");
const commander = require("commander");
const dotenv = require("dotenv");

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function createDatabase() {
  // Implement the logic for creating the database if it doesn't exist
}

commander
  .command("setup <API_KEY> <DB_KEY>")
  .description("Setup the CLI with API_KEY and DB_KEY")
  .action(async (apiKey, dbKey) => {
    process.env.NOTION_API_KEY = apiKey;
    process.env.NOTION_DATABASE_ID = dbKey;

    await createDatabase();
  });

async function addHotkey(name, command) {
  // Implement the logic for adding a hotkey to the database
}

commander
  .command("add <name> <command>")
  .description("Add a hotkey with a name and command")
  .action(async (name, command) => {
    await addHotkey(name, command);
  });

async function listHotkeys(pattern) {
  // Implement the logic for listing hotkeys filtered by pattern
}

commander
  .command("list [pattern]")
  .description("List hotkeys filtered by pattern (optional)")
  .action(async (pattern) => {
    await listHotkeys(pattern);
  });

commander.parse(process.argv);
