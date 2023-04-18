#!/usr/bin/env node
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;
const database = await notion.databases.retrieve({ database_id: databaseId });

class NotionPage {
  #name;
  #command;
  #app;
  #appColor;
  #note;

  constructor(name, command, app, appColor, note) {
    this.#name = name;
    this.#command = command;
    this.#app = app;
    this.#appColor = appColor;
    this.#note = note;
  }
}

async function addItem(name, command, app, appColor, note) {
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
        App: {
          select: {
            name: app,
            color: appColor,
          },
        },
      },
      Note: {
        rich_text: [
          {
            text: {
              content: note,
            },
          },
        ],
      },
    });
    console.log(response);
    console.log("Success! Entry added.");
  } catch (error) {
    console.error(error.body);
  }
}

async function listDatabaseProperties() {
  Object.entries(database.properties).forEach(
    ([propertyName, propertyValue]) => {
      console.log(`${propertyName}: ${propertyValue.type}`);
    }
  );
}

async function queryDatabase() {
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
    // console.log(response);
    const parsedEntry = response.results[0].properties.App.select;
    console.log("parsedEntry: ", parsedEntry);
  } catch (error) {
    console.error(error.body);
  }
}

addItem("Yurts in Big Sur, California");
// queryDatabase();

// Select: { id: 'KZX{', name: '🦕VSCode', color: 'blue' }

// Reference: url
// Name: rich_text
// Date: created_time
// App: select
// Last edited time: last_edited_time
// Note: rich_text
// Command: title

// {
//   object: 'page',
//   id: 'f40ed225-258a-47b5-b439-564d5f6a29fb',
//   created_time: '2023-04-17T06:27:00.000Z',
//   last_edited_time: '2023-04-17T06:34:00.000Z',
//   created_by: [Object],
//   last_edited_by: [Object],
//   cover: null,
//   icon: null,
//   parent: [Object],
//   archived: false,
//   properties: [Object],
//   url: 'https://www.notion.so/f40ed225258a47b5b439564d5f6a29fb'
// },

// properties: {
//   Reference: { id: 'Li_%7D', type: 'url', url: null },
//   Name: { id: 'O%7Dv%5E', type: 'rich_text', rich_text: [Array] },
//   Date: {
//     id: 'R%40%3B%3A',
//     type: 'created_time',
//     created_time: '2023-04-17T06:27:00.000Z'
//   },
//   App: { id: 'f%3A%7Bc', type: 'select', select: [Object] },
//   'Last edited time': {
//     id: 'raAX',
//     type: 'last_edited_time',
//     last_edited_time: '2023-04-17T06:34:00.000Z'
//   },
//   Note: { id: 'u_TQ', type: 'rich_text', rich_text: [] },
//   Command: { id: 'title', type: 'title', title: [Array] }
// },
