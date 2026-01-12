import { RoomResults } from './formulas';
import * as XLSX from 'xlsx';

// Safe access to utils for compatibility
const X = XLSX as any;

interface ExcelData {
    rooms: { id: number; dimensions: { B: number; C: number; D: number }; results: RoomResults }[];
    totalResults: RoomResults;
    prices: { [key: string]: number };
    currency: string;
    metadata: {
        project: string;
        client: string;
        date: string;
    };
    t: (key: any) => string;
}

export const generateExcel = (data: ExcelData) => {
    const { rooms, totalResults, prices, currency, metadata, t } = data;

    // Sheet 1: Results
    const resultsHeader = [
        '#',
        t('dimensions'),
        t('nitsaf'),
        t('masloul'),
        t('gypsumBoards'),
        t('concreteScrews'),
        t('gypsumScrews'),
        t('bajScrews')
    ];

    const resultsRows = rooms.map((room, index) => [
        index + 1,
        `${room.dimensions.B}x${room.dimensions.C} (${t('n')} ${room.dimensions.D})`,
        room.results.E,
        room.results.F,
        room.results.I,
        room.results.J,
        room.results.K,
        room.results.L
    ]);

    // Add Total Row
    resultsRows.push([
        t('total'),
        '',
        totalResults.E,
        totalResults.F,
        totalResults.I,
        totalResults.J,
        totalResults.K,
        totalResults.L
    ]);

    // Metadata for Sheet 1
    const metadataRows = [
        [t('projectName'), metadata.project],
        [t('clientName'), metadata.client],
        ['Date', metadata.date],
        [],
    ];

    // Combine Headers and Rows with Metadata
    const wsResults = X.utils.aoa_to_sheet([
        ...metadataRows,
        resultsHeader,
        ...resultsRows
    ]);

    // Sheet 2: Materials & Cost
    const items = [
        { key: 'I', label: t('gypsumBoardItem'), help: '120x300' },
        { key: 'E', label: t('nitsaf'), help: '300 cm' },
        { key: 'F', label: t('masloul'), help: '300 cm' },
        { key: 'J', label: t('concreteScrews'), help: '' },
        { key: 'K', label: t('gypsumScrews'), help: '' },
        { key: 'L', label: t('bajScrews'), help: '' },
    ];

    const costHeader = [t('material'), t('quantity'), `${t('unitPrice')} (${currency})`, `${t('cost')} (${currency})`];

    let totalCost = 0;
    const costRows = items.map(item => {
        const qty = totalResults[item.key as keyof RoomResults] || 0;
        const price = prices[item.key] || 0;
        const cost = qty * price;
        totalCost += cost;
        return [item.label, qty, price, cost];
    });

    costRows.push([t('totalCost'), '', '', totalCost]);

    const wsCost = X.utils.aoa_to_sheet([
        costHeader,
        ...costRows
    ]);

    const wb = X.utils.book_new();
    // Sheet names max 31 chars
    const sheet1Name = t('billOfQuantities').substring(0, 31) || 'Results';
    const sheet2Name = t('materialsAndCost').substring(0, 31) || 'Cost';

    X.utils.book_append_sheet(wb, wsResults, sheet1Name);
    X.utils.book_append_sheet(wb, wsCost, sheet2Name);

    X.writeFile(wb, `Gypsum_Mate_${metadata.project || 'Export'}.xlsx`);
};
