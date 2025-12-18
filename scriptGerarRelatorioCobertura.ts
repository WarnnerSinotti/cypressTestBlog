import * as fs from 'fs';
import * as path from 'path';

const coverageFile = path.join(__dirname, '.nyc_output', 'out.json');
const outputDir = path.join(__dirname, 'coverage');
const outputHtmlFile = path.join(outputDir, 'index.html');

interface CoverageData {
    [filePath: string]: {
        path: string;
        statementMap: { [key: string]: any };
        fnMap: { [key: string]: any };
        branchMap: { [key: string]: any };
        s: { [key: string]: number };
        f: { [key: string]: number };
        b: { [key: string]: number[] };
        _coverageSchema?: string;
        hash?: string;
    };
}

interface FileCoverage {
    path: string;
    shortPath: string;
    statements: { total: number; covered: number; percentage: number };
    functions: { total: number; covered: number; percentage: number };
    branches: { total: number; covered: number; percentage: number };
    lines: { total: number; covered: number; percentage: number };
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

        // Calcula linhas cobertas baseado nas statements
        const lines = {
            total: statements.total,
            covered: statements.covered,
            percentage: statements.percentage,
        };

        // Extrai um caminho mais curto para exibição
        const parts = filePath.split(path.sep);
        const shortPath = parts.length > 4 ? '...' + path.sep + parts.slice(-4).join(path.sep) : filePath;

        results.push({
            path: filePath,
            shortPath,
            statements,
            functions,
            branches,
            lines,
        });
    }

    return results;
}

function formatPercentage(value: number): string {
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return value.toFixed(2);
}

function getColorClass(percentage: number): string {
    if (percentage >= 80) return 'high';
    if (percentage >= 50) return 'medium';
    return 'low';
}

function generateHtmlReport(coverageResults: FileCoverage[]): string {
    // Calcula estatísticas gerais
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
            lines: {
                total: acc.lines.total + file.lines.total,
                covered: acc.lines.covered + file.lines.covered,
            },
        }),
        {
            statements: { total: 0, covered: 0 },
            functions: { total: 0, covered: 0 },
            branches: { total: 0, covered: 0 },
            lines: { total: 0, covered: 0 },
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
        lines: {
            ...totalStats.lines,
            percentage:
                totalStats.lines.total > 0 ? (totalStats.lines.covered / totalStats.lines.total) * 100 : 0,
        },
    };

    // Ordena por porcentagem de statements
    coverageResults.sort((a, b) => a.statements.percentage - b.statements.percentage);

    const rowsHtml = coverageResults
        .map((file) => {
            const stmtPct = formatPercentage(file.statements.percentage);
            const branchPct = formatPercentage(file.branches.percentage);
            const funcPct = formatPercentage(file.functions.percentage);
            const linePct = formatPercentage(file.lines.percentage);

            return `
            <tr class="${getColorClass(file.statements.percentage)}">
                <td class="file" title="${file.path}">${file.shortPath}</td>
                <td class="pic">
                    <div class="chart"><div class="cover-fill" style="width: ${stmtPct}%"></div></div>
                </td>
                <td class="pct ${getColorClass(file.statements.percentage)}">${stmtPct}%</td>
                <td class="abs">${file.statements.covered}/${file.statements.total}</td>
                <td class="pct ${getColorClass(file.branches.percentage)}">${branchPct}%</td>
                <td class="abs">${file.branches.covered}/${file.branches.total}</td>
                <td class="pct ${getColorClass(file.functions.percentage)}">${funcPct}%</td>
                <td class="abs">${file.functions.covered}/${file.functions.total}</td>
                <td class="pct ${getColorClass(file.lines.percentage)}">${linePct}%</td>
                <td class="abs">${file.lines.covered}/${file.lines.total}</td>
            </tr>`;
        })
        .join('');

    return `<!doctype html>
<html lang="pt-BR">
<head>
    <title>Relatório de Cobertura de Código</title>
    <meta charset="utf-8" />
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        .wrapper {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
        }
        .header h1 {
            font-size: 2rem;
            margin-bottom: 1rem;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        }
        .stat-card {
            background: rgba(255,255,255,0.2);
            padding: 1rem;
            border-radius: 8px;
            backdrop-filter: blur(10px);
        }
        .stat-card .label {
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .stat-card .value {
            font-size: 1.8rem;
            font-weight: bold;
            margin-top: 0.5rem;
        }
        .stat-card .fraction {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        .content {
            padding: 2rem;
        }
        .filter {
            margin-bottom: 1rem;
        }
        .filter input {
            width: 100%;
            padding: 0.75rem;
            border: 2px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        .filter input:focus {
            outline: none;
            border-color: #667eea;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 1rem;
        }
        thead {
            background: #f8f9fa;
            position: sticky;
            top: 0;
        }
        th {
            padding: 1rem;
            text-align: left;
            font-weight: 600;
            border-bottom: 2px solid #ddd;
        }
        td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .file {
            font-family: 'Courier New', monospace;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .pct {
            font-weight: 600;
            text-align: right;
        }
        .abs {
            text-align: right;
            color: #666;
        }
        .high { color: #10b981; }
        .medium { color: #f59e0b; }
        .low { color: #ef4444; }
        .pic {
            width: 100px;
        }
        .chart {
            height: 20px;
            background: #eee;
            border-radius: 10px;
            overflow: hidden;
        }
        .cover-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981, #34d399);
            transition: width 0.3s ease;
        }
        .footer {
            text-align: center;
            padding: 1rem;
            color: #666;
            font-size: 0.9rem;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>📊 Relatório de Cobertura de Código</h1>
            <div class="stats">
                <div class="stat-card">
                    <div class="label">Statements</div>
                    <div class="value">${formatPercentage(overallStats.statements.percentage)}%</div>
                    <div class="fraction">${totalStats.statements.covered}/${totalStats.statements.total}</div>
                </div>
                <div class="stat-card">
                    <div class="label">Branches</div>
                    <div class="value">${formatPercentage(overallStats.branches.percentage)}%</div>
                    <div class="fraction">${totalStats.branches.covered}/${totalStats.branches.total}</div>
                </div>
                <div class="stat-card">
                    <div class="label">Functions</div>
                    <div class="value">${formatPercentage(overallStats.functions.percentage)}%</div>
                    <div class="fraction">${totalStats.functions.covered}/${totalStats.functions.total}</div>
                </div>
                <div class="stat-card">
                    <div class="label">Lines</div>
                    <div class="value">${formatPercentage(overallStats.lines.percentage)}%</div>
                    <div class="fraction">${totalStats.lines.covered}/${totalStats.lines.total}</div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="filter">
                <input type="text" id="fileSearch" placeholder="🔍 Filtrar arquivos...">
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Arquivo</th>
                        <th></th>
                        <th>Statements</th>
                        <th></th>
                        <th>Branches</th>
                        <th></th>
                        <th>Functions</th>
                        <th></th>
                        <th>Lines</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody id="coverageTable">
                    ${rowsHtml}
                </tbody>
            </table>
        </div>
        <div class="footer">
            Relatório gerado em ${new Date().toLocaleString('pt-BR')} | Total de arquivos: ${coverageResults.length}
        </div>
    </div>
    <script>
        const searchInput = document.getElementById('fileSearch');
        const tableBody = document.getElementById('coverageTable');
        const rows = Array.from(tableBody.querySelectorAll('tr'));

        searchInput.addEventListener('input', (e) => {
            const filter = e.target.value.toLowerCase();
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(filter) ? '' : 'none';
            });
        });
    </script>
</body>
</html>`;
}

function main() {
    if (!fs.existsSync(coverageFile)) {
        console.error(`❌ Arquivo de cobertura não encontrado: ${coverageFile}`);
        process.exit(1);
    }

    console.log(`\n📊 Processando dados de cobertura de: ${coverageFile}\n`);

    try {
        const rawData = fs.readFileSync(coverageFile, 'utf-8');
        const data: CoverageData = JSON.parse(rawData);

        const fileCount = Object.keys(data).length;
        console.log(`✅ Total de arquivos encontrados: ${fileCount}`);

        const coverageResults = calculateCoverage(data);
        console.log(`✅ Processando dados de cobertura...`);

        // Garante que o diretório existe
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const html = generateHtmlReport(coverageResults);
        fs.writeFileSync(outputHtmlFile, html, 'utf-8');

        console.log(`\n✅ Relatório HTML gerado com sucesso!`);
        console.log(`📁 Localização: ${outputHtmlFile}`);
        console.log(`\n💡 Para abrir o relatório, execute:`);
        console.log(`   npm run coverage:open-custom\n`);
    } catch (error) {
        console.error('❌ Erro ao processar dados de cobertura:', error);
        process.exit(1);
    }
}

main();

