import fs from "fs";
import path from "path";
import { getInput, logger } from "../logger.js";

export async function getNotionCredentials(): Promise<{
  NOTION_TOKEN: string;
  NOTION_DATABASE_ID: string;
}> {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;

  while (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
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

export async function saveCreds(
  NOTION_TOKEN: string,
  NOTION_DATABASE_ID: string
) {
  logger("SUCCESS", "saving creds");

  let envFilePath: string;
  const dir = path.dirname(process.argv[1]);
  let envFileContent = `NOTION_TOKEN=${NOTION_TOKEN}\nNOTION_DATABASE_ID=${NOTION_DATABASE_ID}`;

  if (process.env.NODE_ENV === "development") {
    envFilePath = path.join(dir, "../", ".env");
    envFileContent += `\nNODE_ENV=development`;
  } else {
    envFilePath = path.join(dir, ".env");
  }

  fs.writeFileSync(envFilePath, envFileContent);
}
