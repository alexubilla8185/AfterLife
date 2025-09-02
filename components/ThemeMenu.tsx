import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeMenuProps {
    onClose: () => void;
}

const ThemeMenu: React.FC<ThemeMenuProps> = ({ onClose }) => {
    const { theme, setTheme, accentColor, setAccentColor, randomizeTheme } = useTheme();

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50 animate-fade-in-fast"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">Theme</label>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-500/50 shadow text-primary-600 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 text-sm py-1.5 rounded-md transition-colors ${theme === 'dark' ? 'bg-gray-900/70 shadow text-primary-400 dark:text-white font-semibold' : 'text-gray-600 dark:text-gray-300'}`}
                        >
                            Dark
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2 block">Accent Color</label>
                    <div className="flex items-center justify-between gap-3">
                       <div className="relative h-10 w-10">
                           <input
                                type="color"
                                value={accentColor}
                                onChange={(e) => setAccentColor(e.target.value)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                aria-label="Choose accent color"
                            />
                            <div 
                                className="h-10 w-10 rounded-full border-2 border-gray-300 dark:border-gray-600 pointer-events-none"
                                style={{ backgroundColor: accentColor }}
                            />
                       </div>
                       <button
                            onClick={randomizeTheme}
                            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.69a8.25 8.25 0 00-11.664 0l-3.181 3.183" /></svg>
                            <span>Randomize</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ThemeMenu;