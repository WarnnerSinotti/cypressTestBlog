import * as fs from 'fs';
import * as path from 'path';

const testDir: string = './cypress/e2e';
const outputDir: string = './documentacao/mapeamentoTestes';
const outputFile: string = path.join(outputDir, 'mapeamento-testes.md');
let outputContent: string = '';

// Garante que o diretório de saída exista
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Função para listar os testes e subpastas
function listTests(dir: string, folderName: string = ''): { totalTests: number; folderCounts: { [key: string]: number } } {
    const files = fs.readdirSync(dir);
    let totalTests = 0;
    const folderCounts: { [key: string]: number } = {};

    const subfolders = files.filter((file) => fs.statSync(path.join(dir, file)).isDirectory());

    const testFiles = files.filter(
        (file) => !fs.statSync(path.join(dir, file)).isDirectory() && (file.endsWith('.cy.ts') || file.endsWith('.cy.js'))
    );

    if (subfolders.length > 0 || testFiles.length > 0) {
        outputContent += `<details>\n`;
        outputContent += `<summary>📂 ${folderName} (${testFiles.length})</summary>\n\n`;
    }

    testFiles.forEach((file) => {
        const filePath = path.join(dir, file);

        const relativePath = path.relative(outputDir, filePath).replace(/\\/g, '/');

        const content = fs.readFileSync(filePath, 'utf-8');

        const testMatches = Array.from(content.matchAll(/(?:it|test)\(["'](.+?)["']\s*,/g), (match) => match[1]);

        if (testMatches.length > 0) {
            outputContent += `#### Teste: [${file}](${relativePath})\n`;

            testMatches.forEach((testName) => {
                outputContent += `- ${testName}\n`;
            });

            totalTests += testMatches.length;
        }
    });

    subfolders.forEach((subfolder) => {
        const result = listTests(path.join(dir, subfolder), subfolder);
        totalTests += result.totalTests;
        folderCounts[subfolder] = result.totalTests;
    });

    if (subfolders.length > 0 || testFiles.length > 0) {
        outputContent += `</details>\n\n`;
    }

    return { totalTests, folderCounts };
}

// Função principal
function listTestTypes() {
    outputContent += '# Testes E2E\n\n';

    // API
    outputContent += '## 🌐 [API](#api)\n';
    const apiResult = listTests(path.join(testDir, 'api'), 'API');
    outputContent += `### **Total de testes API: ${apiResult.totalTests}**\n\n`;

    // Web
    outputContent += '## 🖥️ [Web](#web)\n';
    const webResult = listTests(path.join(testDir, 'web'), 'Web');
    outputContent += `### **Total de testes Web: ${webResult.totalTests}**\n\n`;

    // Relatório
    outputContent += '## 📊 Relatório de Testes\n\n';

    outputContent += '### Total de testes em API\n';
    outputContent += '| Pasta | Quantidade de Testes |\n| ----- | ------------------- |\n';
    Object.entries(apiResult.folderCounts).forEach(([folder, count]) => {
        outputContent += `| ${folder} | ${count} |\n`;
    });

    outputContent += '\n### Total de testes em Web\n';
    outputContent += '| Pasta | Quantidade de Testes |\n| ----- | ------------------- |\n';
    Object.entries(webResult.folderCounts).forEach(([folder, count]) => {
        outputContent += `| ${folder} | ${count} |\n`;
    });
}

// Executa
listTestTypes();
fs.writeFileSync(outputFile, outputContent, 'utf-8');

console.log(`Arquivo gerado: ${outputFile}`);
