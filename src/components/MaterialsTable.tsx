import React from 'react';
import { RoomResults } from '../utils/formulas';
import { useSettings } from '../context/SettingsContext';
import { TranslationKey } from '../i18n/translations';

interface MaterialsTableProps {
    totalResults: RoomResults;
    prices: { [key: string]: number };
    onPriceChange: (key: string, value: number) => void;
}

export const MaterialsTable: React.FC<MaterialsTableProps> = ({ totalResults, prices, onPriceChange }) => {
    const { t, currency } = useSettings();

    interface RowItem {
        key: string;
        labelKey: TranslationKey;
        qty: number;
        hidden?: boolean;
    }

    const rows: RowItem[] = [
        { key: 'I', labelKey: 'gypsumBoardItem', qty: totalResults.I },
        { key: 'E', labelKey: 'nitsaf', qty: totalResults.E },
        { key: 'F', labelKey: 'masloul', qty: totalResults.F },
        { key: 'G', labelKey: 'hangers', qty: totalResults.G, hidden: true },
        { key: 'H', labelKey: 'perimeter', qty: totalResults.H, hidden: true },
        { key: 'J', labelKey: 'concreteScrews', qty: totalResults.J },
        { key: 'K', labelKey: 'gypsumScrews', qty: totalResults.K },
        { key: 'L', labelKey: 'bajScrews', qty: totalResults.L },
    ];

    const totalCost = rows.reduce((acc, row) => {
        if (row.hidden) return acc;
        const price = prices[row.key] || 0;
        return acc + (row.qty * price);
    }, 0);

    return (
        <div id="materials-table-container" className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 mt-8 print:break-inside-avoid">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">{t('materialsAndCost')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-start">
                    <thead className="bg-gray-50 text-gray-700 border-b">
                        <tr>
                            <th className="p-3 w-1/3">{t('material')}</th>
                            <th className="p-3 w-1/6">{t('quantity')}</th>
                            <th className="p-3 w-1/4">{t('unitPrice')} ({currency})</th>
                            <th className="p-3 w-1/4">{t('cost')} ({currency})</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rows.filter(row => !row.hidden).map((row) => (
                            <tr key={row.key} className="hover:bg-gray-50">
                                <td className="p-3 font-medium text-gray-800">{t(row.labelKey)}</td>
                                <td className="p-3 font-bold text-blue-600">{row.qty}</td>
                                <td className="p-3">
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.5"
                                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 p-1 text-sm bg-gray-50 hover:bg-white transition-colors text-start"
                                        value={prices[row.key] || ''}
                                        onChange={(e) => onPriceChange(row.key, parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                    />
                                </td>
                                <td className="p-3 font-medium text-gray-900">
                                    {(row.qty * (prices[row.key] || 0)).toLocaleString()} {currency}
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-slate-800 text-white font-bold text-lg">
                            <td className="p-4" colSpan={3}>{t('totalCost')}</td>
                            <td className="p-4 text-green-400">{totalCost.toLocaleString()} {currency}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
