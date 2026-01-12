import React, { useState } from 'react';
import { Plus, Ruler, ArrowDownToLine, MoveHorizontal, MoveVertical } from 'lucide-react';
import { RoomInput } from '../utils/formulas';
import { useSettings } from '../context/SettingsContext';

interface RoomFormProps {
    onAddRoom: (room: RoomInput) => void;
}

export const RoomForm: React.FC<RoomFormProps> = ({ onAddRoom }) => {
    const { t } = useSettings();
    const [length, setLength] = useState<string>('');
    const [width, setWidth] = useState<string>('');
    const [drop, setDrop] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (length && width && drop) {
            onAddRoom({
                B: parseFloat(length),
                C: parseFloat(width),
                D: parseFloat(drop)
            });
            setLength('');
            setWidth('');
            setDrop('');
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100 print:hidden"
            data-html2canvas-ignore="true"
        >
            <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <Ruler className="text-blue-500" />
                {t('roomDimensions')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MoveHorizontal size={14} />
                        {t('length')}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            required
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{t('cm')}</span>
                    </div>
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <MoveVertical size={14} />
                        {t('width')}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            required
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{t('cm')}</span>
                    </div>
                </div>
                <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                        <ArrowDownToLine size={14} />
                        {t('drop')}
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={drop}
                            onChange={(e) => setDrop(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="0"
                            required
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400 text-sm">{t('cm')}</span>
                    </div>
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-sm active:transform active:scale-95"
            >
                <Plus size={18} />
                {t('addButton')}
            </button>
        </form>
    );
};
