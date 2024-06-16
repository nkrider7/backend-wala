#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import confirm from "@inquirer/confirm";
import chalk from "chalk";
import { execSync } from "child_process";
import { expressTemplate } from "./src/Templete/express.js";
import { hapiTemplate } from "./src/Templete/hapi.js";
import { fileTemp } from "./src/Folder/fileTemp.js";

console.log(chalk.blue("Are you looking for a Backend Template?"));

const answer2 = await confirm({ message: "Building a Backend... Continue?" });

if (answer2) {
  console.log(chalk.green("Great! Let's get started."));

  // Prompt for user input
  const projectName = await input({ message: "Enter your project name" });

  // Additional prompts can be added here
  const templateType = await select({
    message: "Select your template type",
    choices: [
      { name: "🚅 Express", value: "express" },
      { name: "🤖 Hapi", value: "hapi" },
      new Separator(),
      { name: "Cancel", value: "cancel" },
    ],
  });

  if (templateType === "cancel") {
    console.log(chalk.yellow("Operation cancelled."));
    process.exit();
  }

  // Prompt for MongoDB
  const useMongoDB = await confirm({
    message: "Would you like to use MongoDB?🥭",
  });

  // Create project directory
  const projectDir = path.join(process.cwd(), projectName);
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Create basic files based on template type
  let serverFileContent = "";
  let packageJsonContent = {
    name: projectName,
    version: "1.0.0",
    main: "server.js",
    scripts: {
      start: "node server.js",
    },
    dependencies: {},
  };

  switch (templateType) {
    case "express":
      serverFileContent = expressTemplate();
      packageJsonContent.dependencies.express = "^4.17.1";
      break;
    case "hapi":
      serverFileContent = hapiTemplate();
      packageJsonContent.dependencies["@hapi/hapi"] = "^20.1.2";
      break;
    default:
      console.log(chalk.red("Invalid template type selected."));
      process.exit();
  }

  if (useMongoDB) {
    packageJsonContent.dependencies["mongodb"] = "^4.1.0";
    packageJsonContent.dependencies["mongoose"] = "^5.12.3";
    serverFileContent = `
${serverFileContent.trim()}

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/${projectName}', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
`;
  }

  // Create initial folder and file structure
  const folders = ["controllers", "models", "routes"];
  const filesToCreate = fileTemp;

  folders.forEach((folder) => {
    const folderPath = path.join(projectDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    const files = filesToCreate[folder];
    if (files) {
      Object.entries(files).forEach(([file, content]) => {
        const filePath = path.join(folderPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, content, "utf8");
          console.log(`Created file: ${filePath}`);
        }
      });
    }
  });

  // Write server file
  const serverFilePath = path.join(projectDir, "server.js");
  fs.writeFileSync(serverFilePath, serverFileContent.trim());

  // Write package.json file
  const packageJsonPath = path.join(projectDir, "package.json");
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJsonContent, null, 2)
  );

  // Install dependencies
  console.log(
    chalk.green(`Project ${projectName} created successfully at ${projectDir}`)
  );
  console.log(chalk.green(`Installing dependencies...`));
  execSync("npm install", { cwd: projectDir, stdio: "inherit" });

  console.log(chalk.green(`Dependencies installed successfully.`));
  console.log(
    chalk.green(
      `To start your server, run 'npm start' in the project directory.`
    )
  );
} else {
  console.log(chalk.yellow("Operation cancelled."));
}
