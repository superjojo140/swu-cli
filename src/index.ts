#!/usr/bin/env node
import { generateProject } from './project_generator.js';
import { generateModule } from './module_generator.js';
import inquirer from 'inquirer';

let [, , command] = process.argv;

if (!command) {
    const answer = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedCommand',
            message: 'What would you like to create?',
            choices: ['project', 'module'],
        },
    ]);
    command = answer.selectedCommand;
}

if (command === 'project') {
    generateProject();
} else if (command === 'module') {
    generateModule();
} 