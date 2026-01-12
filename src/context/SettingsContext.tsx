import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, TranslationKey } from '../i18n/translations';

export type Currency = '₪' | '$' | '€';

interface SettingsContextType {
    language: Language;
    direction: 'rtl' | 'ltr';
    currency: Currency;
    logo: string | null;
    materialPrices: { [key: string]: number };
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    setLogo: (logo: string | null) => void;
    updatePrice: (key: string, value: number) => void;
    resetPrices: () => void;
    t: (key: TranslationKey) => string;
}


export const DEFAULT_PRICES: { [key: string]: number } = {
    E: 0, // Nitsaf
    F: 0, // Masloul
    I: 0, // Gypsum Boards
    J: 0, // Concrete Screws
    K: 0, // Gypsum Screws
    L: 0, // Baj Screws (previously G/H hidden)
};

interface SettingsContextType {
    language: Language;
    direction: 'rtl' | 'ltr';
    currency: Currency;
    logo: string | null;
    materialPrices: { [key: string]: number };
    toggleLanguage: () => void;
    setLanguage: (lang: Language) => void;
    setCurrency: (curr: Currency) => void;
    setLogo: (logo: string | null) => void;
    updatePrice: (key: string, value: number) => void;
    resetPrices: () => void;
    t: (key: TranslationKey) => string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>('ar');
    const [currency, setCurrencyState] = useState<Currency>('₪');
    const [logo, setLogoState] = useState<string | null>(null);
    const [materialPrices, setMaterialPrices] = useState<{ [key: string]: number }>(DEFAULT_PRICES);

    // Initialize from LocalStorage
    useEffect(() => {
        // Language
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'ar' || savedLang === 'en')) {
            setLanguageState(savedLang);
        } else {
            const browserLang = navigator.language;
            setLanguageState(browserLang.startsWith('ar') ? 'ar' : 'en');
        }

        // Currency
        const savedCurr = localStorage.getItem('currency') as Currency;
        if (savedCurr && ['₪', '$', '€'].includes(savedCurr)) {
            setCurrencyState(savedCurr);
        }

        // Logo
        const savedLogo = localStorage.getItem('logo');
        if (savedLogo) {
            setLogoState(savedLogo);
        }

        // Prices
        const savedPrices = localStorage.getItem('materialPrices');
        if (savedPrices) {
            try {
                const parsed = JSON.parse(savedPrices);
                setMaterialPrices({ ...DEFAULT_PRICES, ...parsed });
            } catch (e) {
                console.error("Failed to parse saved prices", e);
            }
        }
    }, []);

    // Update DOM on language change
    useEffect(() => {
        document.documentElement.lang = language;
        document.dir = language === 'ar' ? 'rtl' : 'ltr';
    }, [language]);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
    };

    const toggleLanguage = () => {
        const newLang = language === 'ar' ? 'en' : 'ar';
        setLanguage(newLang);
    };

    const setCurrency = (curr: Currency) => {
        setCurrencyState(curr);
        localStorage.setItem('currency', curr);
    };

    const setLogo = (newLogo: string | null) => {
        setLogoState(newLogo);
        if (newLogo) {
            localStorage.setItem('logo', newLogo);
        } else {
            localStorage.removeItem('logo');
        }
    };

    const updatePrice = (key: string, value: number) => {
        setMaterialPrices(prev => {
            const newPrices = { ...prev, [key]: value };
            localStorage.setItem('materialPrices', JSON.stringify(newPrices));
            return newPrices;
        });
    };

    const resetPrices = () => {
        setMaterialPrices(DEFAULT_PRICES);
        localStorage.removeItem('materialPrices');
    };

    const t = (key: TranslationKey) => {
        return translations[language][key] || key;
    };

    const direction = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <SettingsContext.Provider value={{
            language,
            direction,
            currency,
            logo,
            materialPrices,
            toggleLanguage,
            setLanguage,
            setCurrency,
            setLogo,
            updatePrice,
            resetPrices,
            t
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
