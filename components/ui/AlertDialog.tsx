import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: React.ReactNode;
    type?: 'info' | 'error' | 'confirmation';
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
}) => {
    const modalRef = useRef<HTMLDivElement>(null);
    
    // Focus trap and escape key handling
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        firstElement?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
            if (e.key !== 'Tab') return;
            
            if (e.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);

    }, [isOpen, onClose]);
    
    const Icon = () => {
        const iconClasses = {
            'info': 'bg-primary/10 text-primary',
            'error': 'bg-red-500/10 text-red-500',
            'confirmation': 'bg-yellow-500/10 text-yellow-500'
        };

        return (
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${iconClasses[type]}`}>
                 {type === 'error' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                 {type === 'confirmation' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                 {type === 'info' && <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            </div>
        );
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-md flex items-center justify-center p-4 z-[2000]">
                    <motion.div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="dialog-title"
                        className="bg-surface-container-high rounded-3xl p-6 w-full max-w-sm mx-auto border border-outline text-center"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                        <div className="flex justify-center mb-4">
                            <Icon />
                        </div>
                        <h3 id="dialog-title" className="text-lg font-semibold text-on-surface">{title}</h3>
                        <div className="mt-2 text-sm text-on-surface-variant">
                            {message}
                        </div>
                        <div className={`mt-6 flex ${type === 'confirmation' ? 'justify-between' : 'justify-center'} space-x-3`}>
                            {type === 'confirmation' && (
                                <button
                                    onClick={onCancel || onClose}
                                    className="flex-1 px-5 py-2.5 text-sm font-medium rounded-full hover:bg-outline/20 text-on-surface-variant"
                                >
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm || onClose}
                                className={`flex-1 px-5 py-2.5 text-sm font-medium text-on-primary rounded-full hover:bg-opacity-80
                                ${type === 'error' ? 'bg-red-600' : 'bg-primary'}`}
                            >
                                {type === 'confirmation' ? confirmText : 'Got it'}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AlertDialog;