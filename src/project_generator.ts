import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function generateProject() {
    const projectName = await askForProjectName();

    const { frontendDir, backendDir } = createProjectDirectories();

    await createEnvFile();
    createFrontendFiles(frontendDir, projectName);
    createBackendFiles(backendDir, projectName);

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

function createBackendFiles(backendDir: string, projectName: any) {
    const templatesDir = path.resolve(__dirname, './../code_templates/backend');

    const templateFiles = fs.readdirSync(templatesDir).filter(
        file => !file.includes('xxxEntityxxx')
    );

    for (const file of templateFiles) {
        const filePath = path.join(templatesDir, file);
        if (fs.statSync(filePath).isDirectory()) {
            const subFiles = fs.readdirSync(filePath);
            for (const subFile of subFiles) {
                const subFilePath = path.join(filePath, subFile);
                const targetSubPath = path.join(backendDir, file, subFile);

                let subContent = fs.readFileSync(subFilePath, 'utf-8');
                subContent = subContent.replace(/xxxProjectNamexxx/g, projectName);

                fs.mkdirSync(path.dirname(targetSubPath), { recursive: true });
                fs.writeFileSync(targetSubPath, subContent);
                console.log(chalk.blue(`Generated: ${targetSubPath}`));
            }
            continue;
        }
        const targetPath = path.join(backendDir, file);

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


async function createEnvFile() {
    console.log(chalk.blue('Preparing to generate your .env file. You will be prompted to enter values for each environment variable.'));

    const exampleEnvPath = path.resolve(__dirname, './../code_templates/.env.example');
    const targetEnvPath = path.join(process.cwd(), '.env');

    if (!fs.existsSync(exampleEnvPath)) {
        console.log(chalk.red('No .env.example file found.'));
        return;
    }

    const envContent = fs.readFileSync(exampleEnvPath, 'utf-8');
    const envLines = envContent.split('\n').filter(line => line.trim() !== '' && !line.trim().startsWith('#'));

    const questions = envLines.map(line => {
        const [key, defaultValue = ''] = line.split('=');
        return {
            type: 'input',
            name: key.trim(),
            message: `Enter value for ${key.trim()}:`,
            default: defaultValue.trim()
        };
    });

    //@ts-expect-error (fuck typing :-X)
    const answers = await inquirer.prompt(questions);
    const newEnvContent = Object.entries(answers)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    fs.writeFileSync(targetEnvPath, newEnvContent);
    fs.writeFileSync(path.join(process.cwd(), '.env.example'), envContent);
    console.log(chalk.green(`Generated: ${targetEnvPath}`));
}

