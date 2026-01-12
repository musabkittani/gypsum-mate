import React, { useState } from 'react';
import { Hammer, Settings } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { SettingsPanel } from './SettingsPanel';

export const Header: React.FC = () => {
    const { t } = useSettings();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <header className="bg-slate-900 text-white shadow-lg print:hidden">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 p-2 rounded-lg">
                        <Hammer className="h-6 w-6 text-slate-900" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{t('title')}</h1>
                        <p className="text-xs text-gray-400">{t('subtitle')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSettingsOpen(true)}
                        className="flex items-center gap-2 text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-md transition-colors border border-slate-700"
                    >
                        <Settings size={18} />
                        <span>{t('settings')}</span>
                    </button>
                    <div className="text-sm font-light text-gray-300 hidden md:block">
                        {t('tagline')}
                    </div>
                </div>
            </div>

            <SettingsPanel
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </header>
    );
};
