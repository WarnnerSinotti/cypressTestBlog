import * as fs from 'fs';
import * as path from 'path';

const coverageFile = path.join(__dirname, '.nyc_output', 'out.json');

interface CoverageData {
    [filePath: string]: {
        path: string;
        statementMap: any;
        fnMap: any;
        branchMap: any;
        s: { [key: string]: number };
        f: { [key: string]: number };
        b: { [key: string]: number[] };
        _coverageSchema?: string;
        hash?: string;
    };
}

interface FileCoverage {
    path: string;
    statements: { total: number; covered: number; percentage: number };
    functions: { total: number; covered: number; percentage: number };
    branches: { total: number; covered: number; percentage: number };
}

function calculateCoverage(data: CoverageData): FileCoverage[] {
    const results: FileCoverage[] = [];

    for (const [filePath, coverage] of Object.entries(data)) {
        const statements = {
            total: Object.keys(coverage.statementMap || {}).length,
            covered: Object.values(coverage.s || {}).filter((count: number) => count > 0).length,
            percentage: 0,
        };
        statements.percentage =
            statements.total > 0 ? (statements.covered / statements.total) * 100 : 0;

        const functions = {
            total: Object.keys(coverage.fnMap || {}).length,
            covered: Object.values(coverage.f || {}).filter((count: number) => count > 0).length,
            percentage: 0,
        };
        functions.percentage = functions.total > 0 ? (functions.covered / functions.total) * 100 : 0;

        const branches = {
            total: Object.keys(coverage.branchMap || {}).length,
            covered: Object.values(coverage.b || {})
                .flat()
                .filter((count: number) => count > 0).length,
            percentage: 0,
        };
        branches.percentage = branches.total > 0 ? (branches.covered / branches.total) * 100 : 0;

        results.push({
            path: filePath,
            statements,
            functions,
            branches,
        });
    }

    return results;
}

function formatPercentage(value: number): string {
    return value.toFixed(2) + '%';
}

function getShortPath(fullPath: string): string {
    // Extrai apenas o nome do arquivo e alguns níveis de diretório
    const parts = fullPath.split(path.sep);
    if (parts.length > 3) {
        return '...' + path.sep + parts.slice(-3).join(path.sep);
    }
    return fullPath;
}

function main() {
    if (!fs.existsSync(coverageFile)) {
        console.error(`Arquivo de cobertura não encontrado: ${coverageFile}`);
        process.exit(1);
    }

    console.log(`\n📊 Analisando dados de cobertura de: ${coverageFile}\n`);

    try {
        const rawData = fs.readFileSync(coverageFile, 'utf-8');
        const data: CoverageData = JSON.parse(rawData);

        const fileCount = Object.keys(data).length;
        console.log(`✅ Total de arquivos analisados: ${fileCount}\n`);

        const coverageResults = calculateCoverage(data);

        // Ordena por porcentagem de statements (menor primeiro para ver os que precisam de atenção)
        coverageResults.sort((a, b) => a.statements.percentage - b.statements.percentage);

        // Estatísticas gerais
        const totalStats = coverageResults.reduce(
            (acc, file) => ({
                statements: {
                    total: acc.statements.total + file.statements.total,
                    covered: acc.statements.covered + file.statements.covered,
                },
                functions: {
                    total: acc.functions.total + file.functions.total,
                    covered: acc.functions.covered + file.functions.covered,
                },
                branches: {
                    total: acc.branches.total + file.branches.total,
                    covered: acc.branches.covered + file.branches.covered,
                },
            }),
            {
                statements: { total: 0, covered: 0 },
                functions: { total: 0, covered: 0 },
                branches: { total: 0, covered: 0 },
            },
        );

        const overallStats = {
            statements: {
                ...totalStats.statements,
                percentage:
                    totalStats.statements.total > 0
                        ? (totalStats.statements.covered / totalStats.statements.total) * 100
                        : 0,
            },
            functions: {
                ...totalStats.functions,
                percentage:
                    totalStats.functions.total > 0
                        ? (totalStats.functions.covered / totalStats.functions.total) * 100
                        : 0,
            },
            branches: {
                ...totalStats.branches,
                percentage:
                    totalStats.branches.total > 0
                        ? (totalStats.branches.covered / totalStats.branches.total) * 100
                        : 0,
            },
        };

        console.log('═'.repeat(80));
        console.log('📈 RESUMO GERAL DE COBERTURA');
        console.log('═'.repeat(80));
        console.log(
            `Statements: ${totalStats.statements.covered}/${totalStats.statements.total} (${formatPercentage(overallStats.statements.percentage)})`,
        );
        console.log(
            `Functions:   ${totalStats.functions.covered}/${totalStats.functions.total} (${formatPercentage(overallStats.functions.percentage)})`,
        );
        console.log(
            `Branches:    ${totalStats.branches.covered}/${totalStats.branches.total} (${formatPercentage(overallStats.branches.percentage)})`,
        );
        console.log('═'.repeat(80));
        console.log('\n');

        // Mostra os 10 arquivos com menor cobertura
        console.log('📉 TOP 10 ARQUIVOS COM MENOR COBERTURA DE STATEMENTS:');
        console.log('─'.repeat(80));
        coverageResults.slice(0, 10).forEach((file, index) => {
            console.log(`\n${index + 1}. ${getShortPath(file.path)}`);
            console.log(
                `   Statements: ${file.statements.covered}/${file.statements.total} (${formatPercentage(file.statements.percentage)})`,
            );
            console.log(
                `   Functions:   ${file.functions.covered}/${file.functions.total} (${formatPercentage(file.functions.percentage)})`,
            );
            console.log(
                `   Branches:    ${file.branches.covered}/${file.branches.total} (${formatPercentage(file.branches.percentage)})`,
            );
        });

        console.log('\n\n💡 DICA: Use o comando "npm run coverage:open" para ver o relatório HTML completo\n');
    } catch (error) {
        console.error('❌ Erro ao processar arquivo de cobertura:', error);
        process.exit(1);
    }
}

main();

