#!/usr/bin/env node

import fs from 'fs';
import { input } from '@inquirer/prompts';
import select, { Separator } from '@inquirer/select';
import confirm from '@inquirer/confirm';
import chalk from 'chalk';
import { execSync } from 'child_process';

console.log(chalk.blue('Hello Everyone! Are you looking for a Backend Template?'));

const answer2 = await confirm({ message: 'Continue?' });

if (answer2) {
  console.log(chalk.green('Great! Let\'s get started.'));
  
  // Prompt for user input
  const projectName = await input({ message: 'Enter your project name' });
  
  // Additional prompts can be added here
  // For example, selecting a template type
  const templateType = await select({
    message: 'Select your template type',
    choices: [
      { name: '🚅Express', value: 'express' },
      { name: '🐨Koa', value: 'koa' },
      { name: '🤖Hapi', value: 'hapi' },
      new Separator(),
      { name: 'Cancel', value: 'cancel' }
    ]
  });

  if (templateType === 'cancel') {
    console.log(chalk.yellow('Operation cancelled.'));
    process.exit();
  }

  // Prompt for MongoDB
  const useMongoDB = await confirm({ message: 'Would you like to use MongoDB?🥭' });

  // Create project directory
  const projectDir = `${process.cwd()}/${projectName}`;
  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  // Create basic files based on template type
  let serverFileContent = '';
  let packageJsonContent = {
    name: projectName,
    version: "1.0.0",
    main: "server.js",
    scripts: {
      start: "node server.js"
    },
    dependencies: {}
  };

  switch (templateType) {
    case 'express':
      serverFileContent = `
        const express = require('express');
        const app = express();
        const port = 3000;

        app.use(express.json());

        app.get('/', (req, res) => {
          res.send('Hello Backend Wala🍬');
        });

        // REST routes would go here

        app.listen(port, () => {
          console.log(\`Example app listening at http://localhost:\${port}\`);
        });
      `;
      packageJsonContent.dependencies.express = "^4.17.1";
      break;
    case 'koa':
      serverFileContent = `
        const Koa = require('koa');
        const Router = require('@koa/router');
        const bodyParser = require('koa-bodyparser');

        const app = new Koa();
        const router = new Router();
        const port = 3000;

        app.use(bodyParser());

        router.get('/', (ctx) => {
          ctx.body = 'Hello World';
        });

        // REST routes would go here

        app.use(router.routes()).use(router.allowedMethods());

        app.listen(port, () => {
          console.log(\`Server running at http://localhost:\${port}\`);
        });
      `;
      packageJsonContent.dependencies.koa = "^2.13.1";
      packageJsonContent.dependencies['@koa/router'] = "^10.0.0";
      packageJsonContent.dependencies['koa-bodyparser'] = "^4.3.0";
      break;
    case 'hapi':
      serverFileContent = `
        const Hapi = require('@hapi/hapi');

        const init = async () => {
          const server = Hapi.server({
            port: 3000,
            host: 'localhost'
          });

          server.route({
            method: 'GET',
            path: '/',
            handler: (request, h) => {
              return 'Hello World!';
            }
          });

          // REST routes would go here

          await server.start();
          console.log('Server running on %s', server.info.uri);
        };

        process.on('unhandledRejection', (err) => {
          console.log(err);
          process.exit(1);
        });

        init();
      `;
      packageJsonContent.dependencies['@hapi/hapi'] = "^20.1.2";
      break;
    default:
      console.log(chalk.red('Invalid template type selected.'));
      process.exit();
  }

  if (useMongoDB) {
    packageJsonContent.dependencies['mongodb'] = "^4.1.0";
    packageJsonContent.dependencies['mongoose'] = "^5.12.3";
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

  // Create necessary folders
  const folders = ['controllers', 'models', 'routes', 'services'];
  folders.forEach(folder => {
    const folderPath = `${projectDir}/${folder}`;
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }
  });

  // Write server file
  const serverFilePath = `${projectDir}/server.js`;
  fs.writeFileSync(serverFilePath, serverFileContent.trim());

  // Write package.json file
  const packageJsonPath = `${projectDir}/package.json`;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonContent, null, 2));

  // Install dependencies
  console.log(chalk.green(`Project ${projectName} created successfully at ${projectDir}`));
  console.log(chalk.green(`Installing dependencies...`));
  execSync('npm install', { cwd: projectDir, stdio: 'inherit' });
  execSync(`cd ${projectName}`, { cwd: process.cwd(), stdio: 'inherit' });
  execSync('npm start', { cwd: projectDir, stdio: 'inherit' })

  console.log(chalk.green(`Dependencies installed successfully.`));
  console.log(chalk.green(`To start your server, run 'npm start' in the project directory.`));
} else {
  console.log(chalk.yellow('Operation cancelled.'));
}
