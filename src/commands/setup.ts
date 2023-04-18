import inquirer from "inquirer";
import chalk from "chalk";

// TODO setup command
export async function askForCredential(credName: string) {
  let credValue: string | undefined;

  do {
    const answers = await inquirer.prompt({
      name: "credValue",
      type: "input",
      message: `enter your ${chalk.red(credName)} ->`,
    });
    if (answers.credValue) {
      credValue = answers.credValue;
    } else {
      console.log("❌ invalid entry, please try again");
    }
  } while (!credValue);

  return credValue;
}

export async function getCredentials() {
  let { NOTION_TOKEN, NOTION_DATABASE_ID } = process.env;

  if (!NOTION_TOKEN) {
    console.log("❌ no notion token found");
    NOTION_TOKEN = await askForCredential("notion token");
    // NOTION_TOKEN = "example-token-123";
  }
  if (!NOTION_DATABASE_ID) {
    console.log("❌ no notion database id found");
    NOTION_DATABASE_ID = await askForCredential("notion database id");
    // NOTION_DATABASE_ID = "example-database-id-123";
  }
  // TODO save to .env
  return { NOTION_TOKEN, NOTION_DATABASE_ID };
}
