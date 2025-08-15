#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


async function promptForEntityName() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'entityName',
            message: 'Enter the name of the entity to generate:',
            validate: (input: string) => input.trim() !== '' || 'Entity name cannot be empty.'
        }
    ]);
    return answers.entityName;
}

async function promptForPropertyNames(): Promise<string[]> {
    const propertyNames: string[] = [];
    console.log(`Lets set the properties fo your entity now.\nYour entity must have an ${chalk.bold("id")} to work with SWU.\nAuto set property: ${chalk.blueBright("id")}`);

    while (true) {
        const { propertyName } = await inquirer.prompt([
            {
                type: 'input',
                name: 'propertyName',
                message: 'Enter a property name (leave empty to finish):'
            }
        ]);
        if (!propertyName || propertyName.trim() === '') {
            break;
        }
        propertyNames.push(propertyName.trim());
        console.log(`Set property: ${chalk.blueBright(propertyName.trim())}`);

    }
    return propertyNames;
}

async function promptForEntityDisplayName() {
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'entityDisplayName',
            message: 'Enter the display name of the entity:',
            validate: (input: string) => input.trim() !== '' || 'Display name cannot be empty.'
        }
    ]);
    return answers.entityDisplayName;
}

function createModuleDirectory(entityName: string, target: ModuleTarget) {
    const targetPath = path.join(process.cwd(), `src/${target}`);
    const modulePath = path.join(targetPath, entityName);

    //Ensure swu project setup is correct
    if (!fs.existsSync(targetPath)) {
        console.log(chalk.redBright(`❌ Directory ${chalk.bold(modulePath)} does not exist. Please make sure you have initialized your swu-project with "swu init" and you are calling this command from your project root`));
        process.exit(1); //Cancel here
    }


    // Ensure the module directory exists
    if (!fs.existsSync(modulePath)) {
        fs.mkdirSync(modulePath);
        console.log(chalk.greenBright(`📁 Created directory: ${entityName}`));
    } else {
        console.log(chalk.yellowBright(`⚠️ Directory ${entityName} already exists, skipping creation.`));
    }

    return modulePath;
}

(async () => {
    const entityName: string = await promptForEntityName();
    const entityNameLowerCase = entityName.toLowerCase();
    const entityDisplayName: string = await promptForEntityDisplayName();
    const propertyNames: string[] = await promptForPropertyNames();

    const frontendModuleDir = createModuleDirectory(entityName, 'frontend');

    // Read template files from code_templates/ and replace xxx tokens with the actual entity name
    const frontendTemplatesDir = path.join(__dirname, '../code_templates/frontend');
    const frontendTemplateFiles = fs.readdirSync(frontendTemplatesDir);

    let propertiesHtml = '';
    let setValueTs = '';
    let getValueTs = '';
    let interfaceProperties = '';
    let tableProperties = '';
    for (const propertyName of propertyNames) {
        propertiesHtml += `
                <div class="row">
                    <div class="col-md">
                    <div class="mb-3">
                        <label class="form-label">${propertyName}</label>
                        <input class="form-control" type="text" id="swu_${entityNameLowerCase}_modal_form_${propertyName}" required>
                    </div>
                    </div>
                </div>
                `;

        getValueTs += `    ${entityNameLowerCase}Data.${propertyName} = SwuDom.querySelectorAsInput("#swu_${entityNameLowerCase}_modal_form_${propertyName}").value;\n`;

        setValueTs += `    SwuDom.querySelectorAsInput("#swu_${entityNameLowerCase}_modal_form_${propertyName}").value = ${entityNameLowerCase}Data.${propertyName};\n`;

        interfaceProperties += `    ${propertyName}: string;\n`;
        tableProperties += `    { title: "${propertyName}", field: "${propertyName}", headerFilter:"input"},\n`;

    }

    const generatedFrontendFiles = frontendTemplateFiles.map(fileName => {
        const templatePath = path.join(frontendTemplatesDir, fileName);
        let content = fs.readFileSync(templatePath, 'utf8');

        content = content.replace(/xxxEntityInterfacePropertiesxxx/g, interfaceProperties);
        content = content.replace(/{ title: "", field: "xxxEntityPropertiesTablexxx" },/g, tableProperties);
        content = content.replace(/let xxxsetPropertyCodexxx;/g, setValueTs);
        content = content.replace(/let xxxgetPropertyCodexxx;/g, getValueTs);
        content = content.replace(/xxxEntityPropertiesInputsHtmlxxx/g, propertiesHtml);
        content = content.replace(/xxxEntityDisplayNamexxx/g, entityDisplayName);
        content = content.replace(/xxxEntityxxx/g, entityName);
        content = content.replace(/xxxentityxxx/g, entityNameLowerCase);

        return { name: fileName, content };
    });

    generatedFrontendFiles.forEach(file => {
        const filePath = path.join(frontendModuleDir, file.name);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, file.content, { encoding: 'utf8' });
            console.log(chalk.greenBright(`📄 Created ${entityName}/${file.name}`));
        } else {
            console.log(chalk.yellowBright(`${entityName}/${file.name} already exists, skipping.`));
        }
    });

    console.log(chalk.bold(chalk.greenBright(`\n✅ Created ${entityName} Module successfully!\n`)));
    console.log(`ℹ️  Make sure to define ${chalk.bold("process.env.BASE_URL")} because the generated code depends on it.`);

})();


type ModuleTarget = "frontend" | "backend";


