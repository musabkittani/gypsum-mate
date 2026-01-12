import React from 'react';
import { Trash2 } from 'lucide-react';
import { RoomResults } from '../utils/formulas';
import { useSettings } from '../context/SettingsContext';

interface ResultsTableProps {
    rooms: { id: number; dimensions: { B: number; C: number; D: number }; results: RoomResults }[];
    total: RoomResults;
    onDeleteRoom: (id: number) => void;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ rooms, total, onDeleteRoom }) => {
    const { t } = useSettings();

    if (rooms.length === 0) {
        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
                {t('noRooms')}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 print:shadow-none print:border-none">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center print:hidden">
                <h3 className="font-bold text-lg text-gray-800">{t('billOfQuantities')}</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-start">
                    <thead className="bg-gray-50 text-gray-700 border-b">
                        <tr>
                            <th className="p-3 font-semibold">{t('room')}</th>
                            <th className="p-3 font-semibold">{t('dimensions')}</th>
                            <th className="p-3 font-semibold">{t('gypsumBoards')}</th>
                            <th className="p-3 font-semibold">{t('nitsaf')}</th>
                            <th className="p-3 font-semibold">{t('masloul')}</th>
                            {/* <th className="p-3 font-semibold">{t('hangers')}</th> */}
                            {/* <th className="p-3 font-semibold">{t('perimeter')}</th> */}
                            <th className="p-3 font-semibold">{t('concreteScrews')}</th>
                            <th className="p-3 font-semibold">{t('gypsumScrews')}</th>
                            <th className="p-3 font-semibold">{t('bajScrews')}</th>
                            <th className="p-3 font-semibold print:hidden">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {rooms.map((room, index) => (
                            <tr key={room.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-medium text-gray-900">{index + 1}</td>
                                <td className="p-3 text-gray-600">
                                    {room.dimensions.B}×{room.dimensions.C} ({t('n')} {room.dimensions.D})
                                </td>
                                <td className="p-3 font-bold text-blue-600 bg-blue-50/50">{room.results.I}</td>
                                <td className="p-3 text-gray-700">{room.results.E}</td>
                                <td className="p-3 text-gray-700">{room.results.F}</td>
                                {/* <td className="p-3 text-gray-700">{room.results.G}</td> */}
                                {/* <td className="p-3 text-gray-700">{room.results.H}</td> */}
                                <td className="p-3 text-gray-700">{room.results.J}</td>
                                <td className="p-3 text-gray-700">{room.results.K}</td>
                                <td className="p-3 text-gray-700">{room.results.L}</td>
                                <td className="p-3 print:hidden">
                                    <button
                                        onClick={() => onDeleteRoom(room.id)}
                                        className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded-full transition-colors"
                                        title={t('delete')}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot className="bg-gray-100 border-t-2 border-gray-200 font-bold text-gray-800">
                        <tr>
                            <td colSpan={2} className="p-3 text-start">{t('total')}</td>
                            <td className="p-3 text-blue-700">{total.I}</td>
                            <td className="p-3">{total.E}</td>
                            <td className="p-3">{total.F}</td>
                            {/* <td className="p-3">{total.G}</td> */}
                            {/* <td className="p-3">{total.H}</td> */}
                            <td className="p-3">{total.J}</td>
                            <td className="p-3">{total.K}</td>
                            <td className="p-3">{total.L}</td>
                            <td className="p-3 print:hidden"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};
