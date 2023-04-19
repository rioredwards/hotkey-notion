import inquirer from "inquirer";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { Input, LogType, getInput, logger } from "../logger.js";

export enum CredType {
  UPDATE,
  CREATE,
}

export async function getCreds(method: CredType) {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;

  if (!NOTION_TOKEN || method === CredType.UPDATE) {
    if (!NOTION_TOKEN) {
      logger(LogType.ERROR, "no notion token found");
    }
    NOTION_TOKEN = await getInput(Input.TOKEN);
  }
  if (!NOTION_DATABASE_ID || method === CredType.UPDATE) {
    if (!NOTION_DATABASE_ID) {
      logger(LogType.ERROR, "no notion database id found");
    }
    NOTION_DATABASE_ID = await getInput(Input.DATABASE_ID);
  }

  return { NOTION_TOKEN, NOTION_DATABASE_ID };
}

export async function saveCreds(
  NOTION_TOKEN: string,
  NOTION_DATABASE_ID: string
) {
  logger(LogType.SUCCESS, "saving creds");

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
