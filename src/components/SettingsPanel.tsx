import React, { useRef } from 'react';
import { X, Upload, Trash2, Globe, Coins, Image as ImageIcon } from 'lucide-react';
import { useSettings, Currency } from '../context/SettingsContext';

interface SettingsPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
    const {
        t,
        language,
        setLanguage,
        currency,
        setCurrency,
        logo,
        setLogo,
        direction,
        resetPrices
    } = useSettings();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Panel */}
            <div className={`
                relative w-full max-w-sm bg-white shadow-xl h-full p-6 transition-transform duration-300 transform
                ${direction === 'rtl' ? 'left-0' : 'right-0'}
            `}>
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Globe className="text-slate-600" />
                        {t('settings')}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Language Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Globe size={18} />
                            {t('selectLanguage')}
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setLanguage('ar')}
                                className={`
                                    py-2 px-4 rounded-md border text-sm font-medium transition-colors
                                    ${language === 'ar'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                                `}
                            >
                                العربية
                            </button>
                            <button
                                onClick={() => setLanguage('en')}
                                className={`
                                    py-2 px-4 rounded-md border text-sm font-medium transition-colors
                                    ${language === 'en'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                                `}
                            >
                                English
                            </button>
                        </div>
                    </div>

                    {/* Currency Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Coins size={18} />
                            {t('selectCurrency')}
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {(['₪', '$', '€'] as Currency[]).map((curr) => (
                                <button
                                    key={curr}
                                    onClick={() => setCurrency(curr)}
                                    className={`
                                        py-2 px-4 rounded-md border text-sm font-medium transition-colors
                                        ${currency === curr
                                            ? 'bg-green-600 text-white border-green-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}
                                    `}
                                >
                                    {curr}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Logo Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <ImageIcon size={18} />
                            {t('uploadLogo')}
                        </label>

                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleLogoUpload}
                            />

                            {logo ? (
                                <div className="space-y-4">
                                    <img src={logo} alt="Logo" className="max-h-24 mx-auto" />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setLogo(null);
                                        }}
                                        className="text-red-500 text-sm flex items-center gap-1 justify-center hover:text-red-700"
                                    >
                                        <Trash2 size={16} />
                                        {t('removeLogo')}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <Upload className="mx-auto h-8 w-8 mb-2 text-gray-400" />
                                    <span className="text-sm">JPG, PNG</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Coins size={18} />
                            {t('pricing')}
                        </label>
                        <button
                            onClick={resetPrices}
                            className="w-full py-2 px-4 rounded-md border border-red-200 text-red-600 hover:bg-red-50 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            <Trash2 size={16} />
                            {t('resetPrices')}
                        </button>
                    </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6">
                    <button
                        onClick={onClose}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
                    >
                        {t('close')}
                    </button>
                </div>
            </div>
        </div>
    );
};
