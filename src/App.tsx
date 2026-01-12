import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { RoomForm } from './components/RoomForm';
import { ResultsTable } from './components/ResultsTable';
import { calculateRoom, RoomInput, RoomResults } from './utils/formulas';
import { FileDown, Calendar, FileSpreadsheet, User, Briefcase } from 'lucide-react';
import { generatePDF } from './utils/pdfGenerator';
import { generateExcel } from './utils/excelGenerator';
import { MaterialsTable } from './components/MaterialsTable';
import { SettingsProvider, useSettings } from './context/SettingsContext';

const AppContent: React.FC = () => {
    const { t, logo, direction, language, materialPrices, updatePrice, currency } = useSettings();
    const [rooms, setRooms] = useState<{ id: number; dimensions: { B: number; C: number; D: number }; results: RoomResults }[]>([]);

    // Phase 4: Metadata Inputs
    const [projectName, setProjectName] = useState('');
    const [clientName, setClientName] = useState('');

    const addRoom = (input: RoomInput) => {
        const results = calculateRoom(input);
        setRooms([...rooms, { id: Date.now(), dimensions: input, results }]);
    };

    const deleteRoom = (id: number) => {
        setRooms(rooms.filter(r => r.id !== id));
    };

    // Date formatted in English numerals defaults
    const getReportDate = () => {
        return new Intl.DateTimeFormat('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date());
    };

    const totalResults = useMemo(() => {
        return rooms.reduce((acc, room) => ({
            H: acc.H + room.results.H,
            G: acc.G + room.results.G,
            E: acc.E + room.results.E,
            F: acc.F + room.results.F,
            I: acc.I + room.results.I,
            J: acc.J + room.results.J,
            K: acc.K + room.results.K,
            L: acc.L + room.results.L,
        }), { H: 0, G: 0, E: 0, F: 0, I: 0, J: 0, K: 0, L: 0 });
    }, [rooms]);

    return (
        <div className={`min-h-screen bg-slate-100 font-sans pb-12 transition-all duration-300 ${direction === 'rtl' ? 'rtl' : 'ltr'}`}>
            <Header />

            <main className="container mx-auto px-4 py-8 max-w-5xl" id="export-container">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Calendar className="text-blue-600" size={20} />
                            {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </h2>
                    </div>
                </div>

                <RoomForm onAddRoom={addRoom} />

                <ResultsTable
                    rooms={rooms}
                    total={totalResults}
                    onDeleteRoom={deleteRoom}
                />

                {rooms.length > 0 && (
                    <>
                        <MaterialsTable
                            totalResults={totalResults}
                            prices={materialPrices}
                            onPriceChange={updatePrice}
                        />

                        {/* Export Section with Metadata */}
                        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100 print:hidden">
                            <h3 className="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">{t('pricing')} / Export</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4" data-html2canvas-ignore="true">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <Briefcase size={16} />
                                        {t('projectName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('projectName')}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                                        <User size={16} />
                                        {t('clientName')}
                                    </label>
                                    <input
                                        type="text"
                                        value={clientName}
                                        onChange={(e) => setClientName(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                                        placeholder={t('clientName')}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3" data-html2canvas-ignore="true">
                                <button
                                    onClick={() => generateExcel({
                                        rooms,
                                        totalResults,
                                        prices: materialPrices,
                                        currency,
                                        metadata: {
                                            project: projectName,
                                            client: clientName,
                                            date: getReportDate()
                                        },
                                        t
                                    })}
                                    className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-bold shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    <FileSpreadsheet size={20} />
                                    {t('exportExcel')}
                                </button>
                                <button
                                    onClick={() => generatePDF(logo, t('title'), {
                                        rooms,
                                        totalResults,
                                        prices: materialPrices,
                                        currency,
                                        metadata: {
                                            project: projectName,
                                            client: clientName,
                                            date: getReportDate()
                                        },
                                        t
                                    })}
                                    className="bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 font-bold shadow-md hover:shadow-lg transform active:scale-95"
                                >
                                    <FileDown size={20} />
                                    {t('exportPDF')}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

function App() {
    return (
        <SettingsProvider>
            <AppContent />
        </SettingsProvider>
    );
}

export default App;
