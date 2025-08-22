#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import DbGenerator from './db_generator.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
    const { entityName, entityDisplayName, propertyNames } = await askForUserInput();
    let replaceValues = generateReplaceValues(entityName, entityDisplayName, propertyNames);

    const targets: ModuleTarget[] = ["frontend", "backend", "model"];
    for (const target of targets) {
        const moduleDir = createModuleDirectory(entityName, target);
        generateFiles(replaceValues, target);
    }

    await askForSqlGeneration(entityName, propertyNames);

    printModuleCreationStatus(entityName);
})();


async function askForSqlGeneration(tableName: string, propertyNames: string[]) {
    const { shouldGenerate } = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'shouldGenerate',
            message: `Do you want to auto-generate the SQL table for "${tableName}"?`,
            default: true
        }
    ]);
    if (shouldGenerate) {
        const success = await DbGenerator.createTable(tableName, propertyNames);
        if (success) {
            console.log(chalk.greenBright(`✅ SQL table "${tableName}" generated successfully.`));
        } else {
            console.log(chalk.yellowBright(`⚠️ SQL table "${tableName}" already exists, skipping creation.`));
        }
    }
}


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
    const relativePath = `src/${target}/${entityName}`;

    //Ensure swu project setup is correct
    if (!fs.existsSync(targetPath)) {
        console.log(chalk.redBright(`❌ Directory ${chalk.bold(targetPath)} does not exist. Please make sure you have initialized your swu-project with "swu init" and you are calling this command from your project root`));
        process.exit(1); //Cancel here
    }

    // Ensure the module directory exists
    if (!fs.existsSync(modulePath)) {
        fs.mkdirSync(modulePath);
        console.log(chalk.greenBright(`📁 Created directory: ${relativePath}`));
    } else {
        console.log(chalk.yellowBright(`⚠️ Directory ${relativePath} already exists, skipping creation.`));
    }

    return modulePath;
}




function printModuleCreationStatus(entityName: string) {
    console.log(chalk.bold(chalk.greenBright(`\n✅ Created ${entityName} Module successfully!\n`)));
    console.log(`ℹ️  Make sure to define ${chalk.bold("process.env.BASE_URL")} because the generated code depends on it.`);
}

async function askForUserInput() {
    const entityName: string = await promptForEntityName();
    const entityDisplayName: string = await promptForEntityDisplayName();
    const propertyNames: string[] = await promptForPropertyNames();
    return { entityName, entityDisplayName, propertyNames };
}

// Read template files from code_templates/ and replace xxx tokens with the actual entity name
function generateFiles(replaceValues: ReplaceValues, target: ModuleTarget) {
    //read template files
    const templatesDir = path.join(__dirname, `../code_templates/${target}/xxxEntityxxx`);
    const templateFiles = fs.readdirSync(templatesDir);

    //generate output path
    const relativeOutputDir = `src/${target}/${replaceValues.entityName}`;
    const absolutOutputDir = path.join(process.cwd(), relativeOutputDir);

    //replace values in all found files
    const generatedFiles = templateFiles.map(fileName => {
        const templatePath = path.join(templatesDir, fileName);
        let content = fs.readFileSync(templatePath, 'utf8');

        content = content.replace(/xxxsqlInsertQueryxxx/g, replaceValues.sqlInsertQuery);
        content = content.replace(/xxxsqlUpdateQueryxxx/g, replaceValues.sqlUpdateQuery);
        content = content.replace(/xxxEntityInterfacePropertiesxxx/g, replaceValues.interfaceProperties);
        content = content.replace(/{ title: "", field: "xxxEntityPropertiesTablexxx" },/g, replaceValues.tableProperties);
        content = content.replace(/let xxxsetPropertyCodexxx;/g, replaceValues.setValueTs);
        content = content.replace(/let xxxgetPropertyCodexxx;/g, replaceValues.getValueTs);
        content = content.replace(/xxxEntityPropertiesInputsHtmlxxx/g, replaceValues.propertiesHtml);
        content = content.replace(/xxxEntityDisplayNamexxx/g, replaceValues.entityDisplayName);
        content = content.replace(/xxxEntityxxx/g, replaceValues.entityName);
        content = content.replace(/xxxentityxxx/g, replaceValues.entityNameLowerCase);

        return { name: fileName, content };
    });


    //write new files
    generatedFiles.forEach(file => {
        const filePath = path.join(absolutOutputDir, file.name);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, file.content, { encoding: 'utf8' });
            console.log(chalk.greenBright(`📄 Created ${file.name}`));
        } else {
            console.log(chalk.yellowBright(`${relativeOutputDir}/${file.name} already exists, skipping.`));
        }
    });
}

function generateReplaceValues(entityName: string, entityDisplayName: string, propertyNames: string[]): ReplaceValues {
    let propertiesHtml = '';
    let setValueTs = '';
    let getValueTs = '';
    let interfaceProperties = '';
    let tableProperties = '';
    let propertiesCsv = '';
    let propertiesUpdatePart = '';

    const entityNameLowerCase = entityName.toLowerCase();


    for (const propertyName of propertyNames) {


        propertiesCsv += propertyName + ", ";
        propertiesUpdatePart += `${propertyName} = ?, `;

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

    // Generate a string with "? " repeated for each property
    const questionMarks = Array(propertyNames.length).fill("?").join(", ").trim();
    propertiesCsv = propertiesCsv.slice(0, -2); // remove last ", "
    propertiesUpdatePart = propertiesUpdatePart.slice(0, -2); // remove last ", "

    let sqlInsertQuery = `INSERT INTO ${entityNameLowerCase} (${propertiesCsv}) VALUES (${questionMarks})`;
    let sqlUpdateQuery = `UPDATE ${entityNameLowerCase} SET ${propertiesUpdatePart} WHERE id = ?`;


    return { interfaceProperties, tableProperties, setValueTs, getValueTs, propertiesHtml, entityNameLowerCase, entityName, entityDisplayName, sqlInsertQuery, sqlUpdateQuery };
}

interface ReplaceValues {
    interfaceProperties: string;
    tableProperties: string;
    setValueTs: string;
    getValueTs: string;
    propertiesHtml: string;
    entityNameLowerCase: string;
    entityName: string;
    entityDisplayName: string;
    sqlInsertQuery: string;
    sqlUpdateQuery: string;
}

type ModuleTarget = "frontend" | "backend" | "model";