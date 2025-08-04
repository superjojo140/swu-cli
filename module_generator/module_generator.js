"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
async function promptForEntityName() {
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'entityName',
            message: 'Enter the name of the entity to generate:',
            validate: (input) => input.trim() !== '' || 'Entity name cannot be empty.'
        }
    ]);
    return answers.entityName;
}
async function promptForPropertyNames() {
    const propertyNames = [];
    console.log(`Lets set the properties fo your entity now.\nYour entity must have an ${chalk_1.default.bold("id")} to work with SWU.\nAuto set property: ${chalk_1.default.blueBright("id")}`);
    while (true) {
        const { propertyName } = await inquirer_1.default.prompt([
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
        console.log(`Set property: ${chalk_1.default.blueBright(propertyName.trim())}`);
    }
    return propertyNames;
}
async function promptForEntityDisplayName() {
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'entityDisplayName',
            message: 'Enter the display name of the entity:',
            validate: (input) => input.trim() !== '' || 'Display name cannot be empty.'
        }
    ]);
    return answers.entityDisplayName;
}
(async () => {
    const entityName = await promptForEntityName();
    const entityNameLowerCase = entityName.toLowerCase();
    const entityDisplayName = await promptForEntityDisplayName();
    const propertyNames = await promptForPropertyNames();
    const entityDir = path.join(process.cwd(), entityName);
    // Ensure the entity directory exists
    if (!fs.existsSync(entityDir)) {
        fs.mkdirSync(entityDir);
        console.log(chalk_1.default.greenBright(`📁 Created directory: ${entityName}`));
    }
    else {
        console.log(chalk_1.default.yellowBright(`⚠️ Directory ${entityName} already exists, skipping creation.`));
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
            console.log(chalk_1.default.greenBright(`📄 Created ${entityName}/${file.name}`));
        }
        else {
            console.log(chalk_1.default.yellowBright(`${entityName}/${file.name} already exists, skipping.`));
        }
    });
    console.log(chalk_1.default.bold(chalk_1.default.greenBright(`\n✅ Created ${entityName} Module successfully!\n`)));
    console.log(`ℹ️  Make sure to define ${chalk_1.default.bold("process.env.BASE_URL")} because the generated code depends on it.`);
})();
