import chalk from "chalk";
import inquirer, { QuestionCollection } from "inquirer";
import { Spinner } from "nanospinner";

export type LogType = "INFO" | "WARN" | "ERROR" | "SUCCESS" | "PROMPT";
export type SpinType = "SPINSTART" | "SPINERROR" | "SPINSUCCESS";
export type Input = "TOKEN" | "DATABASE_ID" | "COMMAND_PARAM" | "NAME_PARAM";
type Colors = "white" | "yellow" | "red" | "green";

const statusIcons = {
  INFO: chalk.white("➤"),
  WARN: chalk.yellow("⚠"),
  ERROR: chalk.red("✖"),
  SUCCESS: chalk.green("✔"),
  PROMPT: chalk.yellow("?"),
  SPIN_START: chalk.yellow("⠋"),
  SPIN_ERROR: chalk.red("✖"),
  SPIN_SUCCESS: chalk.green("✔"),
};

const inputDisplayNames = {
  TOKEN: "notion token",
  DATABASE_ID: "notion database id",
  COMMAND_PARAM: "command",
  NAME_PARAM: "command name",
};

function createPromptMsg(input: Input) {
  // prettier-ignore
  return `${statusIcons.PROMPT} Enter your ${chalk.yellow(inputDisplayNames[input])} -> `;
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

export function logger(status: LogType, message: string) {
  const icon = statusIcons[status];
  console.log(`${icon} ${message}`);
}

export function spinner(mySpinner: Spinner, status: SpinType, message: string) {
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
