import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeMenuProps {
    onClose: () => void;
}

const ThemeMenu: React.FC<ThemeMenuProps> = ({ onClose }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">Theme</label>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white shadow text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-900/50 shadow text-primary-400 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemeMenu;
