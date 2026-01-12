import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RoomResults } from './formulas';

interface PDFData {
    rooms: { id: number; dimensions: { B: number; C: number; D: number }; results: RoomResults }[];
    totalResults: RoomResults;
    prices: { [key: string]: number };
    currency: string;
    metadata: {
        project: string;
        client: string;
        date: string;
    };
    t: (key: string) => string;
}

// Force English numerals logic
const formatNumber = (num: number) => {
    return num.toLocaleString('en-GB');
};

export const generatePDF = async (
    logoBase64: string | null,
    title: string,
    data: PDFData
) => {
    const { rooms, totalResults, prices, currency, metadata, t } = data;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    let yOffset = 15;

    // 1. Logo
    if (logoBase64) {
        const logoWidth = 40;
        const logoHeight = 25;
        const xPos = (pdfWidth - logoWidth) / 2;
        pdf.addImage(logoBase64, 'JPEG', xPos, yOffset, logoWidth, logoHeight, undefined, 'FAST');
        yOffset += logoHeight + 5;
    } else {
        yOffset += 5;
    }

    // 2. Title
    pdf.setFontSize(22);
    pdf.setTextColor(44, 62, 80);
    pdf.text(title, pdfWidth / 2, yOffset, { align: 'center' });
    yOffset += 15;

    // 3. Metadata (Strict Order: Project > Client > Date)
    pdf.setFontSize(10);
    pdf.setTextColor(60);
    const centerX = pdfWidth / 2;

    // Project Name
    if (metadata.project) {
        pdf.text(`${t('projectName')}: ${metadata.project}`, centerX, yOffset, { align: 'center' });
        yOffset += 6;
    }

    // Client Name
    if (metadata.client) {
        pdf.text(`${t('clientName')}: ${metadata.client}`, centerX, yOffset, { align: 'center' });
        yOffset += 6;
    }

    // Date (English Numerals enforced)
    pdf.text(`${t('Date') || 'Date'}: ${metadata.date}`, centerX, yOffset, { align: 'center' });
    yOffset += 10;

    // 4. Tables with autoTable

    // Table 1: Bill of Quantities (Results)
    const resultsHeader = [
        [
            '#',
            t('dimensions'),
            t('nitsaf'),
            t('masloul'),
            t('gypsumBoards'),
            t('concreteScrews'),
            t('gypsumScrews'),
            t('bajScrews')
        ]
    ];

    const resultsRows = rooms.map((room, index) => [
        formatNumber(index + 1),
        `${formatNumber(room.dimensions.B)}x${formatNumber(room.dimensions.C)} (${t('n')} ${formatNumber(room.dimensions.D)})`,
        formatNumber(room.results.E),
        formatNumber(room.results.F),
        formatNumber(room.results.I),
        formatNumber(room.results.J),
        formatNumber(room.results.K),
        formatNumber(room.results.L)
    ]);

    // Total Row
    resultsRows.push([
        t('total'),
        '',
        formatNumber(totalResults.E),
        formatNumber(totalResults.F),
        formatNumber(totalResults.I),
        formatNumber(totalResults.J),
        formatNumber(totalResults.K),
        formatNumber(totalResults.L)
    ]);

    autoTable(pdf, {
        startY: yOffset,
        head: resultsHeader,
        body: resultsRows,
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], halign: 'center' }, // Blue
        bodyStyles: { halign: 'center' },
        styles: { font: 'helvetica', fontSize: 9 }, // Force standard font for English numerals
    });

    // @ts-ignore
    yOffset = pdf.lastAutoTable.finalY + 15;

    // Table 2: Materials & Cost
    const costHeader = [
        [
            t('material'),
            t('quantity'),
            `${t('unitPrice')} (${currency})`,
            `${t('cost')} (${currency})`
        ]
    ];

    const items = [
        { key: 'I', label: t('gypsumBoardItem') },
        { key: 'E', label: t('nitsaf') },
        { key: 'F', label: t('masloul') },
        { key: 'J', label: t('concreteScrews') },
        { key: 'K', label: t('gypsumScrews') },
        { key: 'L', label: t('bajScrews') },
    ];

    let totalCost = 0;
    const costRows = items.map(item => {
        const qty = totalResults[item.key as keyof RoomResults] || 0;
        const price = prices[item.key] || 0;
        const cost = qty * price;
        totalCost += cost;
        return [
            item.label,
            formatNumber(qty),
            formatNumber(price),
            formatNumber(cost)
        ];
    });

    costRows.push([
        t('totalCost'),
        '',
        '',
        formatNumber(totalCost)
    ]);

    autoTable(pdf, {
        startY: yOffset,
        head: costHeader,
        body: costRows,
        theme: 'grid',
        headStyles: { fillColor: [39, 174, 96], halign: 'center' }, // Green
        bodyStyles: { halign: 'center' },
        styles: { font: 'helvetica', fontSize: 9 },
    });

    // Footer
    const footerText = `Generated on ${metadata.date}`;
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(footerText, 10, pdfHeight - 10);

    pdf.save(`Gypsum_Quotation_${metadata.project || 'Export'}.pdf`);
};
