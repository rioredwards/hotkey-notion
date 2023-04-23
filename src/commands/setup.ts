import { getInput, logger } from "../logger.js";

export async function getNotionCredentials(isUpdating: boolean): Promise<{
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
}> {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;

  if (!NOTION_TOKEN || !NOTION_DATABASE_ID || isUpdating) {
    if (!NOTION_TOKEN) logger("ERROR", "no token found!");
    NOTION_TOKEN = await getInput("TOKEN");
    if (!NOTION_DATABASE_ID) logger("ERROR", "no database id found!");
    NOTION_DATABASE_ID = await getInput("DATABASE_ID");
  }

  return {
    NOTION_TOKEN,
    NOTION_DATABASE_ID,
  };
}
