import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



export async function generateProject() {
    const projectName = await askForProjectName();

    const { frontendDir, backendDir, modelDir } = createProjectDirectories();

    createFrontendFiles(frontendDir, projectName);
    createBackendFiles(backendDir, projectName);
    await createEnvFile();
    copyAssets();
    await createNpmScripts();

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
    const modelDir = path.join(srcDir, 'model');

    fs.mkdirSync(frontendDir, { recursive: true });
    fs.mkdirSync(backendDir, { recursive: true });
    fs.mkdirSync(modelDir, { recursive: true });

    console.log(chalk.green(`Created folders:
    - ${modelDir}
    - ${frontendDir}
    - ${backendDir}`));

    return { srcDir, frontendDir, backendDir, modelDir };
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
    const { fillEnvNow } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'fillEnvNow',
            message: 'Do you want to fill in the environment variables now?',
            default: true
        }
    ]);

    const exampleEnvPath = path.resolve(__dirname, './../code_templates/config/.env.example');
    const envContent = fs.readFileSync(exampleEnvPath, 'utf-8');

    if (fillEnvNow) {

        console.log(chalk.blue('Preparing to generate your .env file. You will be prompted to enter values for each environment variable. Press Enter to use the default value from .env.example'));

        const targetEnvPath = path.join(process.cwd(), '.env');

        if (!fs.existsSync(exampleEnvPath)) {
            console.log(chalk.red('No .env.example file found.'));
            return;
        }

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
        console.log(chalk.green(`Generated: ${targetEnvPath}`));
    }
    else {
        const targetEnvPath = path.join(process.cwd(), '.env');
        fs.writeFileSync(targetEnvPath, envContent);

    }

    const targetEnvExamplePath = path.join(process.cwd(), '.env.example');
    fs.writeFileSync(targetEnvExamplePath, envContent);
    console.log(chalk.green(`Created: ${targetEnvExamplePath}`));
}



function copyAssets() {
    const assetsSrcDir = path.resolve(__dirname, './../code_templates/assets');
    const assetsDestDir = path.join(process.cwd(), 'public/assets');

    function copyRecursive(src: string, dest: string) {
        if (fs.statSync(src).isDirectory()) {
            fs.mkdirSync(dest, { recursive: true });
            for (const entry of fs.readdirSync(src)) {
                copyRecursive(path.join(src, entry), path.join(dest, entry));
            }
        } else {
            fs.mkdirSync(path.dirname(dest), { recursive: true });
            fs.copyFileSync(src, dest);
            console.log(chalk.blue(`Copied asset: ${dest}`));
        }
    }

    if (fs.existsSync(assetsSrcDir)) {
        copyRecursive(assetsSrcDir, assetsDestDir);
        console.log(chalk.green(`Assets copied to: ${assetsDestDir}`));
    } else {
        console.log(chalk.yellow('No assets directory found to copy.'));
    }

    const gitignoreSrcPath = path.resolve(__dirname, './../code_templates/config/.gitignore');
    const gitignoreDestPath = path.join(process.cwd(), '.gitignore');

    if (fs.existsSync(gitignoreSrcPath)) {
        fs.copyFileSync(gitignoreSrcPath, gitignoreDestPath);
        console.log(chalk.green(`Copied .gitignore to: ${gitignoreDestPath}`));
    } else {
        console.log(chalk.yellow('No .gitignore file found to copy.'));
    }
}

async function createNpmScripts() {
    const { overwriteNpmScripts } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'overwriteNpmScripts',
            message: 'Do you want to generate npm scripts in package.json?',
            default: true
        }
    ]);

    if (!overwriteNpmScripts) {
        console.log(chalk.yellow('Skipped npm scripts generation.'));
        return;
    }

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.log(chalk.red('No package.json found in the current directory.'));
        return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    packageJson.scripts = {
        ...packageJson.scripts,
        "start": "cd src/backend && ts-node app.ts",
        "nodemon": "cd src/backend && nodemon --exec ts-node app.ts",
        "build": "cd src/frontend && webpack",
        "build-dev": "cd src/frontend && webpack --watch"
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('Npm scripts have been generated and written to package.json.'));
}

