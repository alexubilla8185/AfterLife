import React, { useState, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingProps {
  onClose: () => void;
}

const tourSteps = [
    {
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
        ),
        title: 'Welcome to AfterLife!',
        content: 'This is an interactive space for remembrance. You can explore as a Visitor or craft a lasting digital story as a Creator.',
    },
    {
        icon: (props: any) => (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        title: 'For Creators',
        content: 'As a Creator, you build your own digital memorial. Share your bio, link to your work, and write special messages that visitors can receive.',
    },
    {
        icon: (props: any) => (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
        ),
        title: 'Teach It Your Voice',
        content: 'Guide conversations by setting up "conditional responses". When a visitor mentions a keyword like "travel", you can share a special memory you\'ve pre-written for that topic.',
    },
    {
        icon: (props: any) => (
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        title: 'For Visitors',
        content: 'As a Visitor, you can explore a memorial, leave a tribute for others to see, and have a conversation with the memory of a loved one.',
    }
];

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 30 : -30,
    opacity: 0,
  }),
};

const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
    const [[step, direction], setStep] = useState([0, 0]);

    const paginate = (newDirection: number) => {
        const nextStep = step + newDirection;
        if (nextStep >= 0 && nextStep < tourSteps.length) {
            setStep([nextStep, newDirection]);
        }
    };
    
    const handleNext = () => {
        if (step === tourSteps.length - 1) {
            onClose();
        } else {
            paginate(1);
        }
    }

    const currentStepData = tourSteps[step];
    const Icon = currentStepData.icon;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 animate-fade-in">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div 
                className="relative bg-surface-container-high rounded-3xl w-full max-w-md mx-auto text-center p-8 overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
                <div className="flex flex-col items-center justify-center h-64">
                    <div className="w-16 h-16 flex items-center justify-center bg-primary-container text-primary rounded-2xl mb-6">
                        <Icon className="w-8 h-8"/>
                    </div>
                    
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="w-full"
                        >
                            <h2 className="text-2xl font-bold text-on-surface">{currentStepData.title}</h2>
                            <p className="mt-2 text-on-surface-variant">{currentStepData.content}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>
                
                <div className="flex items-center justify-center space-x-2 my-6">
                    {tourSteps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 rounded-full transition-all duration-300 ${i === step ? 'w-6 bg-primary' : 'w-2 bg-outline'}`}
                        />
                    ))}
                </div>

                <div className="flex items-center justify-between mt-8">
                     <button 
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium rounded-full hover:bg-outline/20 text-on-surface-variant"
                     >
                        Skip
                    </button>
                    <button 
                        onClick={handleNext}
                        className="px-6 py-3 text-sm font-medium text-on-primary bg-primary rounded-full hover:bg-opacity-80"
                    >
                        {step === tourSteps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Onboarding;