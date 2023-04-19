// TODO add command

import { Client } from "@notionhq/client";
import { Input, LogType, getInput, logger } from "../logger.js";

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

export async function getDatabaseEntry(): Promise<DatabaseEntry> {
  let entry = new DatabaseEntry();

  entry.name = await getInput(Input.NAME_PARAM);
  entry.command = await getInput(Input.COMMAND_PARAM);

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
                content: entry.name,
              },
            },
          ],
        },
        Name: {
          rich_text: [
            {
              text: {
                content: entry.command,
              },
            },
          ],
        },
      },
    });
    // console.log(response);
    logger(LogType.SUCCESS, "success! entry added to database");
  } catch (error) {
    logger(LogType.ERROR, "error adding entry to database");
  }
}
