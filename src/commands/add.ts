// TODO add command

import { Client } from "@notionhq/client";
import { LogType, logger } from "../logger.js";

export async function addToDatabase(
  notion: Client,
  databaseId: string,
  name: string,
  command: string
) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Command: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Name: {
          rich_text: [
            {
              text: {
                content: command,
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
