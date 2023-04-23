import path from "path";
import fs from "fs";

export async function saveCreds(
  NOTION_TOKEN: string,
  NOTION_DATABASE_ID: string
) {
  let envFilePath: string;
  const dir = path.dirname(process.argv[1]);
  let envFileContent = `NOTION_TOKEN=${NOTION_TOKEN}\nNOTION_DATABASE_ID=${NOTION_DATABASE_ID}`;

  if (process.env.NODE_ENV === "development") {
    envFilePath = path.join(dir, "../", ".env");
    envFileContent += `\nNODE_ENV=development`;
  } else {
    envFilePath = path.join(dir, ".env");
  }

  fs.writeFileSync(envFilePath, envFileContent);
}

export async function saveHotkeyData(data: string[][]) {
  let hotkeyFilePath: string;
  const dir = path.dirname(process.argv[1]);
  const hotkeyFileContent = JSON.stringify(data);

  if (process.env.NODE_ENV === "development") {
    hotkeyFilePath = path.join(dir, "../", "hotkeys.json");
  } else {
    hotkeyFilePath = path.join(dir, "hotkeys.json");
  }

  fs.writeFileSync(hotkeyFilePath, hotkeyFileContent);
}
