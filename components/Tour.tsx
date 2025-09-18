import React, { useState, useLayoutEffect, useRef, FC } from 'react';
import ReactDOM from 'react-dom';

export interface TourStep {
  target?: string;
  title: string;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TourProps {
  steps: TourStep[];
  isOpen: boolean;
  onClose: () => void;
}

const Tour: FC<TourProps> = ({ steps, isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [style, setStyle] = useState<React.CSSProperties>({ visibility: 'hidden', opacity: 0 });
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({ display: 'none' });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const step = steps[currentStep];

  useLayoutEffect(() => {
    if (!isOpen || !step) return;

    const targetElement = step.target ? document.querySelector(step.target) as HTMLElement : null;

    // Reset styles for the next step calculation
    setStyle({ visibility: 'hidden', opacity: 0 });
    setHighlightStyle({ display: 'none' });

    if (targetElement) {
      const originalPosition = targetElement.style.position;
      const originalZIndex = targetElement.style.zIndex;
      targetElement.style.position = 'relative';
      targetElement.style.zIndex = '1002';
      
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      const timer = setTimeout(() => {
        if (!tooltipRef.current) return;
        
        const elementRect = targetElement.getBoundingClientRect();
        setHighlightStyle({
            top: elementRect.top - 8,
            left: elementRect.left - 8,
            width: elementRect.width + 16,
            height: elementRect.height + 16,
            display: 'block'
        });

        const tooltipHeight = tooltipRef.current.offsetHeight;
        const tooltipWidth = tooltipRef.current.offsetWidth;
        const space = 12;
        let top = 0, left = 0;

        switch (step.position) {
            case 'top':
                top = elementRect.top - tooltipHeight - space;
                left = elementRect.left + (elementRect.width / 2) - (tooltipWidth / 2);
                break;
            case 'left':
                top = elementRect.top + (elementRect.height / 2) - (tooltipHeight / 2);
                left = elementRect.left - tooltipWidth - space;
                break;
            case 'right':
                top = elementRect.top + (elementRect.height / 2) - (tooltipHeight / 2);
                left = elementRect.right + space;
                break;
            default: // bottom
                top = elementRect.bottom + space;
                left = elementRect.left + (elementRect.width / 2) - (tooltipWidth / 2);
                break;
        }

        if (top < space) top = space;
        if (left < space) left = space;
        if (left + tooltipWidth > window.innerWidth) left = window.innerWidth - tooltipWidth - space;
        if (top + tooltipHeight > window.innerHeight) top = window.innerHeight - tooltipHeight - space;
        
        setStyle({ top, left, visibility: 'visible', opacity: 1 });
      }, 300);

      return () => {
        clearTimeout(timer);
        targetElement.style.position = originalPosition;
        targetElement.style.zIndex = originalZIndex;
      };
    } else { // For centered steps
      // Use a small delay to ensure the tooltip ref is available for measurement
      const timer = setTimeout(() => {
        setStyle({
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            visibility: 'visible',
            opacity: 1
        });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentStep, isOpen, step]);

  const handleNext = () => setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  const handlePrev = () => setCurrentStep(s => Math.max(s - 1, 0));
  const handleFinish = () => {
    setCurrentStep(0);
    onClose();
  };

  if (!isOpen || !step) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[1000] animate-fade-in">
      <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" onClick={handleFinish} />
      
      <div
          className="absolute rounded-lg shadow-2xl transition-all duration-300 pointer-events-none ring-4 ring-primary-500 ring-offset-4 ring-offset-transparent bg-gray-900/50"
          style={highlightStyle}
        />

      <div
        ref={tooltipRef}
        className="absolute bg-white dark:bg-gray-800 rounded-lg shadow-xl p-5 w-80 max-w-[calc(100vw-2rem)] transition-all duration-300 border border-gray-200 dark:border-gray-700"
        style={style}
      >
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{step.content}</p>
        <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{currentStep + 1} / {steps.length}</span>
            <div className="space-x-2">
                {currentStep > 0 && <button onClick={handlePrev} className="px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">Prev</button>}
                {currentStep < steps.length - 1 ? (
                    <button onClick={handleNext} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">Next</button>
                ) : (
                    <button onClick={handleFinish} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md">Finish</button>
                )}
            </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Tour;
