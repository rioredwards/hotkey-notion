// TODO list command
import { Client } from "@notionhq/client";
import { logger } from "../logger.js";
import {
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

type SelectColor =
  | "yellow"
  | "red"
  | "green"
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "blue"
  | "purple"
  | "pink";

type SelectProperty = {
  type: "select";
  select: {
    id: string;
    name: string;
    color: SelectColor;
  } | null;
  id: string;
};

type RichTextProperty = {
  type: "rich_text";
  rich_text: TextRichTextItemResponse[];
  id: string;
};

type TitleProperty = {
  type: "title";
  title: TextRichTextItemResponse[];
  id: string;
};

export async function queryDatabase(
  notion: Client,
  databaseId: string,
  filter: string
) {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: "App",
          direction: "descending",
        },
      ],
    });

    const results = response.results;

    const fullPages = results.filter((page) => {
      return "properties" in page;
    }) as PageObjectResponse[];

    const parsedPages = fullPages.map((page) => extractPageProperties(page));

    logger("SUCCESS", "success! here is your database: ");
    console.table(parsedPages);
  } catch (error) {
    console.error(error);
    logger("ERROR", "error querying database");
  }
}

function extractPageProperties(page: PageObjectResponse) {
  const titleProperty = page.properties.Command as TitleProperty;
  const richTextProperty = page.properties.Name as RichTextProperty;
  const selectProperty = page.properties.App as SelectProperty;

  const title = titleProperty?.title?.[0]?.plain_text ?? "";
  const name = richTextProperty?.rich_text?.[0]?.plain_text ?? "";
  const app = selectProperty?.select?.name ?? "";
  return [app, title, name];
}
