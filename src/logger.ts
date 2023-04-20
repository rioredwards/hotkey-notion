import chalk from "chalk";
import inquirer, { QuestionCollection } from "inquirer";
import { Spinner } from "nanospinner";

const TABLE_DIM = { colWidth: [16, 16, 48] };

export type LogType = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "PROMPT";
export type SpinType = "SPINSTART" | "SPINERROR" | "SPINSUCCESS";
export type Input = "TOKEN" | "DATABASE_ID" | "COMMAND_PARAM" | "NAME_PARAM";

export type NotionColor =
  | "default"
  | "light gray"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red";

type ChalkColor =
  | "white"
  | "gray"
  | "yellow"
  | "yellowBright"
  | "yellow"
  | "green"
  | "blue"
  | "magenta"
  | "magentaBright"
  | "red"
  | "gray";

const statusIcons = {
  INFO: colorize("white", "➤"),
  WARN: colorize("yellow", "⚠"),
  ERROR: colorize("red", "✖"),
  SUCCESS: colorize("green", "✔"),
  PROMPT: colorize("yellow", "➤"),
  SPIN_START: colorize("yellow", "⚙"),
  SPIN_ERROR: colorize("red", "✖"),
  SPIN_SUCCESS: colorize("green", "✔"),
};

const inputDisplayNames = {
  TOKEN: "notion token",
  DATABASE_ID: "notion database id",
  COMMAND_PARAM: "command",
  NAME_PARAM: "command name",
};

function createPromptMsg(input: Input) {
  // prettier-ignore
  return `${statusIcons.PROMPT} Enter your ${colorize("yellow", inputDisplayNames[input])} -> `;
}

interface InputValidations {
  [key: string]: {
    check: (input: string) => boolean;
    hint: string;
  };
}

const inputValidations: InputValidations = {
  TOKEN: {
    check: (input: string) => input.length === 50,
    hint: "token should be 50 characters long",
  },
  DATABASE_ID: {
    check: (input: string) => input.length === 32,
    hint: "database id should be 32 characters long",
  },
  COMMAND_PARAM: {
    check: (input: string) => input.length > 0,
    hint: "command cannot be empty",
  },
  NAME_PARAM: {
    check: (input: string) => input.length > 0,
    hint: "name cannot be empty",
  },
};

interface InputOptions {
  [key: string]: QuestionCollection;
}

const inputOptions: InputOptions = {
  TOKEN: {
    prefix: "",
    type: "password",
    name: "value",
    message: createPromptMsg("TOKEN"),
  },
  DATABASE_ID: {
    prefix: "",
    type: "password",
    name: "value",
    message: createPromptMsg("DATABASE_ID"),
  },
  COMMAND_PARAM: {
    prefix: "",
    type: "input",
    name: "value",
    message: createPromptMsg("COMMAND_PARAM"),
  },
  NAME_PARAM: {
    prefix: "",
    type: "input",
    name: "value",
    message: createPromptMsg("NAME_PARAM"),
  },
};

export function colorize(color: ChalkColor, message: string) {
  return chalk[color](message);
}

export function logger(status: LogType, message: string) {
  const icon = statusIcons[status];
  console.log(`${icon} ${message}`);
}

export function logTable(table: string[][]) {
  // console.table(table);
  if (table.length === 0 || table[0].length === 0) {
    console.log("No data to display");
  }

  // Loop through each row
  for (let row of table) {
    let formattedRow = "";

    // Loop through each cell
    for (let i = 0; i < row.length; i++) {
      const cell = row[i];
      const targetWidth = TABLE_DIM.colWidth[i];
      const paddingLength =
        targetWidth - cell.length > 0 ? targetWidth - cell.length : 0;
      let padding = " ".repeat(paddingLength);

      if (cell.length >= targetWidth) {
        formattedRow += cell.substring(0, targetWidth - 3) + "...";
      } else {
        formattedRow += `${cell}${padding}`;
      }
    }
    console.log(formattedRow);
  }
}

export function spinner(mySpinner: Spinner, status: SpinType, message: string) {
  mySpinner.update({
    stream: process.stdout,
    frames: ["◡", "⊙", "◠"],
    interval: 100,
  });

  switch (status) {
    case "SPINSTART":
      mySpinner.start({ text: message });
      break;
    case "SPINERROR":
      mySpinner.error({ text: message });
      break;
    case "SPINSUCCESS":
      mySpinner.success({ text: message });
      break;
  }
}

export async function getInput(input: Input) {
  let value: string | undefined;

  do {
    const answers = await inquirer.prompt(inputOptions[input]);
    if (answers.value && inputValidations[input].check(answers.value)) {
      value = answers.value;
    } else {
      logger("ERROR", inputValidations[input].hint);
    }
  } while (!value);

  return value;
}

// https://developers.notion.com/docs/create-a-notion-integration

export function notionToChalkColor(notionColor: NotionColor): ChalkColor {
  switch (notionColor) {
    case "light gray":
      return "white";
    case "gray":
      return "gray";
    case "brown":
      return "yellow";
    case "orange":
      return "yellowBright";
    case "yellow":
      return "yellow";
    case "green":
      return "green";
    case "blue":
      return "blue";
    case "purple":
      return "magenta";
    case "pink":
      return "magentaBright";
    case "red":
      return "red";
    default:
      return "gray";
  }
}
