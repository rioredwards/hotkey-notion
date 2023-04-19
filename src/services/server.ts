// TODO server calls
import { Client } from "@notionhq/client";

export function createClient(token: string) {
  const notion = new Client({
    auth: token,
  });
  return notion;
}

export async function connectToDatabase(notion: Client, databaseId: string) {
  try {
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    return database;
  } catch (err) {
    return null;
  }
}
