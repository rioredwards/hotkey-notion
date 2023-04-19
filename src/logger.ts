import chalk from "chalk";
import inquirer, { QuestionCollection } from "inquirer";
import { Spinner } from "nanospinner";

export enum LogStatus {
  INFO,
  WARN,
  ERROR,
  SUCCESS,
  PROMPT,
}

export enum SpinStatus {
  SPINSTART,
  SPINERROR,
  SPINSUCCESS,
}

export enum Input {
  TOKEN,
  DATABASE_ID,
}

const chalkColors = {
  [LogStatus.INFO]: chalk.white,
  [LogStatus.WARN]: chalk.yellow,
  [LogStatus.ERROR]: chalk.red,
  [LogStatus.SUCCESS]: chalk.green,
};

const statusIcons = {
  [LogStatus.INFO]: chalkColors[LogStatus.INFO]("➤"),
  [LogStatus.WARN]: chalkColors[LogStatus.WARN]("⚠"),
  [LogStatus.ERROR]: chalkColors[LogStatus.ERROR]("✖"),
  [LogStatus.SUCCESS]: chalkColors[LogStatus.SUCCESS]("✔"),
  [LogStatus.PROMPT]: chalkColors[LogStatus.WARN]("?"),
  [SpinStatus.SPINSTART]: chalkColors[LogStatus.INFO]("➤"),
  [SpinStatus.SPINERROR]: chalkColors[LogStatus.ERROR]("✖"),
  [SpinStatus.SPINSUCCESS]: chalkColors[LogStatus.SUCCESS]("✔"),
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
};

function createPromptMsg(input: Input) {
  // prettier-ignore
  return `${statusIcons[LogStatus.PROMPT]} Enter your ${chalkColors[LogStatus.WARN](inputDisplayNames[input])} -> `;
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
};

export function logger(status: LogStatus, message: string) {
  const icon = statusIcons[status];
  console.log(`${icon} ${message}`);
}

export function spinner(
  mySpinner: Spinner,
  status: SpinStatus,
  message: string
) {
  switch (status) {
    case SpinStatus.SPINSTART:
      mySpinner.start({ text: message });
      break;
    case SpinStatus.SPINERROR:
      mySpinner.error({ text: message });
      break;
    case SpinStatus.SPINSUCCESS:
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
      logger(LogStatus.ERROR, inputValidations[input].hint);
    }
  } while (!value);

  return value;
}

// https://developers.notion.com/docs/create-a-notion-integration
