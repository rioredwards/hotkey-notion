// TODO server calls
import { Client } from "@notionhq/client";

export async function connectToDatabase(token: string, databaseId: string) {
  const notion = new Client({
    auth: token,
  });

  const database = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return database;
}
