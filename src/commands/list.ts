// TODO list command
import { Client } from "@notionhq/client";
import { getInput, logger } from "../logger.js";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints.js";
import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints.js";

interface TextResponse {
  type: "rich_text";
  rich_text: Array<RichTextItemResponse>;
  id: string;
}

interface TitleResponse {
  type: "title";
  title: Array<RichTextItemResponse>;
  id: string;
}

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
          direction: "ascending",
        },
      ],
    });

    const results = (response.results as PageObjectResponse[])
      .slice(0)
      .map((page) => {
        const name =
          (page.properties.Name as TextResponse | undefined)?.rich_text?.[0]
            ?.plain_text ?? "";
        const command =
          (page.properties.Command as TitleResponse | undefined)?.title?.[0]
            ?.plain_text ?? "";

        return [name, command];
      });

    // const results = (response.results as PageObjectResponse[]).slice(25, 1);
    logger("SUCCESS", "success! here is your database: ");
    console.table(results);
  } catch (error) {
    console.error(error);
    logger("ERROR", "error querying database");
  }
}

[
  {
    object: "page",
    id: "3cf1ac8e-6f8a-457f-873e-e3d2b9680cc6",
    created_time: "2023-04-17T05:27:00.000Z",
    last_edited_time: "2023-04-17T06:23:00.000Z",
    created_by: { object: "user", id: "e45b305f-7c77-4d74-bf79-0e4d203b4be9" },
    last_edited_by: {
      object: "user",
      id: "e45b305f-7c77-4d74-bf79-0e4d203b4be9",
    },
    cover: null,
    icon: null,
    parent: {
      type: "database_id",
      database_id: "d473b57f-0562-49f9-9de0-500d272db853",
    },
    archived: false,
    properties: {
      Reference: [Object],
      Name: [Object],
      Date: [Object],
      App: [Object],
      "Last edited time": [Object],
      Note: [Object],
      Command: [Object],
    },
    url: "https://www.notion.so/s-3cf1ac8e6f8a457f873ee3d2b9680cc6",
  },
  {
    object: "page",
    id: "6ba985dd-edbb-4aae-8557-cef344ff51ad",
    created_time: "2023-04-17T06:33:00.000Z",
    last_edited_time: "2023-04-17T06:33:00.000Z",
    created_by: { object: "user", id: "e45b305f-7c77-4d74-bf79-0e4d203b4be9" },
    last_edited_by: {
      object: "user",
      id: "e45b305f-7c77-4d74-bf79-0e4d203b4be9",
    },
    cover: null,
    icon: null,
    parent: {
      type: "database_id",
      database_id: "d473b57f-0562-49f9-9de0-500d272db853",
    },
    archived: false,
    properties: {
      Reference: [Object],
      Name: [Object],
      Date: [Object],
      App: [Object],
      "Last edited time": [Object],
      Note: [Object],
      Command: [Object],
    },
    url: "https://www.notion.so/6ba985ddedbb4aae8557cef344ff51ad",
  },
];

// const results = (response.results as PageObjectResponse[])
//       .slice(25)
//       .map((page) => {
//         if (
//           page &&
//           page?.properties &&
//           page.properties?.Name &&
//           page.properties?.Command
//         ) {
//           return [
//             (page.properties.Name as TextResponse).rich_text[0].plain_text,
//             (page.properties.Command as TitleResponse).title[0].plain_text,
//           ];
//         } else {
//           return ["", ""];
//         }
//       });
