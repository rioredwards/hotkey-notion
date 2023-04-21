// TODO list command
import { Client } from "@notionhq/client";
import { NotionColor, colorize, notionToChalkColor } from "../logger.js";
import {
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints.js";

type SelectProperty = {
  type: "select";
  select: {
    id: string;
    name: string;
    color: NotionColor;
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
        {
          property: "Name",
          direction: "descending",
        },
        {
          timestamp: "last_edited_time",
          direction: "descending",
        },
      ],
    });

    const results = response.results;

    const fullPages = results.filter((page) => {
      return "properties" in page;
    }) as PageObjectResponse[];

    const parsedPages = fullPages.map((page) => extractPageProperties(page));
    return { data: parsedPages, error: null };
  } catch (error) {
    return { data: null, error: Error };
  }
}

function extractPageProperties(page: PageObjectResponse) {
  const titleProperty = page.properties.Command as TitleProperty;
  const richTextProperty = page.properties.Name as RichTextProperty;
  const selectProperty = page.properties.App as SelectProperty;

  const command = titleProperty.title[0]?.plain_text ?? "";
  const name = richTextProperty.rich_text[0]?.plain_text ?? "";
  const appName = selectProperty.select?.name ?? "";
  const appColor: NotionColor = selectProperty.select?.color ?? "default";
  // const coloredAppName = colorApp(appName, appColor);

  // return [appName, command, name];
  return { App: appName, Command: command, Name: name };
}

function colorApp(app: string, color: NotionColor) {
  const chalkColor = notionToChalkColor(color);
  return colorize(chalkColor, app);
}
