import React from 'react';
import { useTheme } from '../hooks/useTheme';

interface ThemeMenuProps {
    onClose: () => void;
}

const ThemeMenu: React.FC<ThemeMenuProps> = ({ onClose }) => {
    const { theme, setTheme } = useTheme();

    return (
        <div 
            className="absolute top-full right-0 mt-2 w-56 bg-surface-container-high rounded-2xl shadow-lg border border-outline p-4 z-50 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-semibold text-on-surface-variant mb-2 block">Theme</label>
                    <div className="flex bg-surface-variant rounded-full p-1">
                        <button
                            onClick={() => setTheme('light')}
                            className={`flex-1 text-sm py-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-secondary-container shadow text-on-secondary-container font-semibold' : 'text-on-surface-variant'}`}
                        >
                            Light
                        </button>
                        <button
                            onClick={() => setTheme('dark')}
                            className={`flex-1 text-sm py-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-secondary-container shadow text-on-secondary-container font-semibold' : 'text-on-surface-variant'}`}
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