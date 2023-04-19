import chalk, { ChalkInstance } from "chalk";
import inquirer, { QuestionCollection } from "inquirer";
import { Spinner } from "nanospinner";

export enum LogType {
  INFO,
  WARN,
  ERROR,
  SUCCESS,
  PROMPT,
}

export enum SpinType {
  SPINSTART,
  SPINERROR,
  SPINSUCCESS,
}

export enum Input {
  TOKEN,
  DATABASE_ID,
  COMMAND_PARAM,
  NAME_PARAM,
}

enum Colors {
  WHITE = "white",
  YELLOW = "yellow",
  RED = "red",
  GREEN = "green",
}

const statusIcons = {
  [LogType.INFO]: chalk[Colors.WHITE]("➤"),
  [LogType.WARN]: chalk[Colors.YELLOW]("⚠"),
  [LogType.ERROR]: chalk[Colors.RED]("✖"),
  [LogType.SUCCESS]: chalk[Colors.GREEN]("✔"),
  [LogType.PROMPT]: chalk[Colors.YELLOW]("?"),
  [SpinType.SPINSTART]: chalk[Colors.WHITE]("➤"),
  [SpinType.SPINERROR]: chalk[Colors.RED]("✖"),
  [SpinType.SPINSUCCESS]: chalk[Colors.GREEN]("✔"),
};

interface InputOptions {
  [key: number]: QuestionCollection;
}

interface InputDisplayNames {
  [key: number]: string;
}

const inputDisplayNames: InputDisplayNames = {
  [Input.TOKEN]: "notion token",
  [Input.DATABASE_ID]: "notion database id",
  [Input.COMMAND_PARAM]: "command",
  [Input.NAME_PARAM]: "name",
};

function createPromptMsg(input: Input) {
  // prettier-ignore
  return `${statusIcons[LogType.PROMPT]} Enter your ${chalk[Colors.YELLOW](inputDisplayNames[input])} -> `;
}

interface InputValidations {
  [key: number]: {
    check: (input: string) => boolean;
    hint: string;
  };
}

const inputValidations: InputValidations = {
  [Input.TOKEN]: {
    check: (input: string) => input.length === 50,
    hint: "token should be 50 characters long",
  },
  [Input.DATABASE_ID]: {
    check: (input: string) => input.length === 32,
    hint: "database id should be 32 characters long",
  },
  [Input.COMMAND_PARAM]: {
    check: (input: string) => input.length > 0,
    hint: "command cannot be empty",
  },
  [Input.NAME_PARAM]: {
    check: (input: string) => input.length > 0,
    hint: "name cannot be empty",
  },
};

const inputOptions: InputOptions = {
  [Input.TOKEN]: {
    prefix: "",
    type: "password",
    name: "value",
    message: createPromptMsg(Input.TOKEN),
  },
  [Input.DATABASE_ID]: {
    prefix: "",
    type: "password",
    name: "value",
    message: createPromptMsg(Input.DATABASE_ID),
  },
  [Input.COMMAND_PARAM]: {
    prefix: "",
    type: "input",
    name: "value",
    message: createPromptMsg(Input.COMMAND_PARAM),
  },
  [Input.NAME_PARAM]: {
    prefix: "",
    type: "input",
    name: "value",
    message: createPromptMsg(Input.NAME_PARAM),
  },
};

export function logger(status: LogType, message: string) {
  const icon = statusIcons[status];
  console.log(`${icon} ${message}`);
}

export function spinner(mySpinner: Spinner, status: SpinType, message: string) {
  switch (status) {
    case SpinType.SPINSTART:
      mySpinner.start({ text: message });
      break;
    case SpinType.SPINERROR:
      mySpinner.error({ text: message });
      break;
    case SpinType.SPINSUCCESS:
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
      logger(LogType.ERROR, inputValidations[input].hint);
    }
  } while (!value);

  return value;
}

// https://developers.notion.com/docs/create-a-notion-integration
