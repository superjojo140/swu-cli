import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import DbGenerator from './db_generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function generateProject() {
    const projectName = await askForProjectName();

    const { srcDir, frontendDir, backendDir } = createProjectDirectories();

    createFrontendFiles(frontendDir, projectName);

    process.exit(0);
};


function createFrontendFiles(frontendDir: string, projectName: any) {
    const templatesDir = path.resolve(__dirname, './../code_templates/frontend');

    const templateFiles = fs.readdirSync(templatesDir).filter(
        file => !file.includes('xxxEntityxxx')
    );

    for (const file of templateFiles) {
        const filePath = path.join(templatesDir, file);
        const targetPath = path.join(frontendDir, file);

        let content = fs.readFileSync(filePath, 'utf-8');
        content = content.replace(/xxxProjectNamexxx/g, projectName);

        fs.writeFileSync(targetPath, content);
        console.log(chalk.blue(`Generated: ${targetPath}`));
    }
}

function createProjectDirectories() {
    const projectRoot = process.cwd();
    const srcDir = path.join(projectRoot, 'src');
    const frontendDir = path.join(srcDir, 'frontend');
    const backendDir = path.join(srcDir, 'backend');

    fs.mkdirSync(frontendDir, { recursive: true });
    fs.mkdirSync(backendDir, { recursive: true });

    console.log(chalk.green(`Created folders:
    - ${frontendDir}
    - ${backendDir}`));

    return { srcDir, frontendDir, backendDir };
}

async function askForProjectName() {
    let answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'Enter the name of your project:',
            validate: (input: string) => input.trim() !== '' || 'Project name cannot be empty.'
        }
    ]);
    return answers.projectName;
}


