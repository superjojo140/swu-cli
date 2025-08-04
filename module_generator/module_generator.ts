import * as fs from 'fs';
import * as path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';


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

(async () => {
    const entityName: string = await promptForEntityName();
    const entityNameLowerCase = entityName.toLowerCase();
    const entityDisplayName: string = await promptForEntityDisplayName();
    const propertyNames: string[] = await promptForPropertyNames();

    const entityDir = path.join(process.cwd(), entityName);

    // Ensure the entity directory exists
    if (!fs.existsSync(entityDir)) {
        fs.mkdirSync(entityDir);
        console.log(chalk.greenBright(`📁 Created directory: ${entityName}`));
    } else {
        console.log(chalk.yellowBright(`⚠️ Directory ${entityName} already exists, skipping creation.`));
    }

    // Read template files from code_templates/ and replace xxx tokens with the actual entity name
    const templatesDir = path.join(__dirname, 'code_templates');
    
    const templateFiles = fs.readdirSync(templatesDir);

    const entityFiles = templateFiles.map(fileName => {
        const templatePath = path.join(templatesDir, fileName);
        let content = fs.readFileSync(templatePath, 'utf8');
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
            tableProperties += `    ${propertyName}: "${propertyName}",\n`;

        }
        content = content.replace(/xxxEntityInterfacePropertiesxxx/g, interfaceProperties);
        content = content.replace(/xxxEntityPropertiesTablexxx : "",/g, tableProperties);
        content = content.replace(/let xxxsetPropertyCodexxx;/g, setValueTs);
        content = content.replace(/let xxxgetPropertyCodexxx;/g, getValueTs);
        content = content.replace(/xxxEntityPropertiesInputsHtmlxxx/g, propertiesHtml);
        content = content.replace(/xxxEntityDisplayNamexxx/g, entityDisplayName);
        content = content.replace(/xxxEntityxxx/g, entityName);
        content = content.replace(/xxxentityxxx/g, entityNameLowerCase);



        return {
            name: fileName,
            content
        };
    });

    entityFiles.forEach(file => {
        const filePath = path.join(entityDir, file.name);
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


