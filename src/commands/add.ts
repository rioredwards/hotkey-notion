// TODO add command

import { Client } from "@notionhq/client";
import { getInput, logger } from "../logger.js";

interface dynamicObject {
  [key: string]: any;
}

interface DatabaseEntry extends dynamicObject {
  name: string;
  command: string;
}

class DatabaseEntry implements DatabaseEntry {
  name: string;
  command: string;
  constructor(name: string = "", command: string = "") {
    this.name = name;
    this.command = command;
  }
}

export async function getUserDatabaseEntry(): Promise<DatabaseEntry> {
  let entry = new DatabaseEntry();

  entry.name = await getInput("NAME_PARAM");
  entry.command = await getInput("COMMAND_PARAM");

  return entry;
}

export async function addToDatabase(
  notion: Client,
  databaseId: string,
  entry: DatabaseEntry
) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Command: {
          title: [
            {
              text: {
                content: entry.command,
              },
            },
          ],
        },
        Name: {
          rich_text: [
            {
              text: {
                content: entry.name,
              },
            },
          ],
        },
      },
    });
    // console.log(response);
    logger("SUCCESS", "success! entry added to database");
  } catch (error) {
    logger("ERROR", "error adding entry to database");
  }
}
