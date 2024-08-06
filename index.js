#!/usr/bin/env node

import { blue, green, red, blueBg, greenBg, redBg } from "./src/run.js"
import fs from "fs";
import path from "path";
import { input } from "@inquirer/prompts";
import select, { Separator } from "@inquirer/select";
import confirm from "@inquirer/confirm";
import chalk from "chalk";
import { execSync } from "child_process";
import { expressTemplate } from "./src/Templete/express.js";
import { hapiTemplate } from "./src/Templete/hapi.js";

import { nodejsTemplate } from "./src/Templete/node.js";

import { fastifyTemplate } from "./src/Templete/fastify.js";

import { fileTemp } from "./src/Folder/fileTemp.js";

red(`
▄▀─▄▀
─▀──▀
█▀▀▀▀▀█▄
█░░░░░█─█ Backend-Wala🍬
▀▄▄▄▄▄▀▀
`)
green("Are you looking for a Backend Template?");

const answer2 = await confirm({ message: "Building a Backend... Continue?" });

if (answer2) {
  blue("Great! Let's get started.");

  // Prompt for user input
  const projectName = await input({ message: "Enter your project name" });

  // Additional prompts can be added here
  const templateType = await select({
    message: "Select your template type",
    choices: [
      { name: "🚅 Express", value: "express" },
      { name: "🤖 Hapi", value: "hapi" },
      {name : "Node" , value : "node"} ,

      {name : "🚃 Fastify" , value : "fastify"} ,

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
  const useNodemon = await confirm({
    message: "Would you like to use Nodemon?🔥",
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
    type: "module",
    scripts: {
      start: "node server.js",
    },
    dependencies: {},
    devDependencies: {},
  };

  switch (templateType) {
    case "express":
      serverFileContent = expressTemplate();
      packageJsonContent.dependencies.express = "^4.17.1";
      packageJsonContent.dependencies["body-parser"] = "^1.19.0";
      break;
    case "hapi":
      serverFileContent = hapiTemplate();
      packageJsonContent.dependencies["@hapi/hapi"] = "^20.1.2";
      break;

    case "node" : 
      serverFileContent = nodejsTemplate();
      // don't need of express and body-parser
        break ;
    case "fastify":
      serverFileContent = fastifyTemplate();
      packageJsonContent.dependencies["fastify"] = "^4.28.1";
      break ;
    default:
      console.log(chalk.red("Invalid template type selected."));
      process.exit();
  }

  if (useMongoDB) {
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
  if (useNodemon) {
    packageJsonContent.devDependencies.nodemon = "^2.0.7";
    packageJsonContent.scripts.dev = "nodemon server.js";
  }
  // Create initial folder and file structure
  const folders = ["controllers", "models", "routes", "utils"];
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
  console.log(chalk.blue(`🔦Installing dependencies...`));
  execSync("npm install", { cwd: projectDir, stdio: "inherit" });

  console.log(chalk.green(`Dependencies installed successfully.`));
  blueBg(`To start your server, run 'npm start' in the project directory.`)
  const isStart = await confirm({
    message: "Would you like to start your server?🏃‍➡️",
  });
  if(isStart && useNodemon){
    execSync("npm run dev", { cwd: projectDir, stdio: "inherit" });
  }
  else if(isStart){
    execSync("npm start", { cwd: projectDir, stdio: "inherit" });
  }
  
} else {
  redBg("Operation cancelled.")
}
