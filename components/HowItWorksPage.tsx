import React from 'react';
import { View } from '../App';

interface HowItWorksPageProps {
    onNavigate: (view: View) => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
    
    const StepCard: React.FC<{
        step: number;
        icon: JSX.Element;
        title: string;
        children: React.ReactNode;
    }> = ({ step, icon, title, children }) => (
        <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full font-bold text-xl">{step}</div>
                <div className="sm:hidden flex-shrink-0 w-16 h-16 flex items-center justify-center bg-surface-container text-primary rounded-2xl">{icon}</div>
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-3">
                     <div className="hidden sm:flex flex-shrink-0 w-16 h-16 mr-5 items-center justify-center bg-surface-container text-primary rounded-2xl">{icon}</div>
                     <h3 className="text-2xl font-bold text-on-surface">{title}</h3>
                </div>
                <p className="text-on-surface-variant leading-relaxed">{children}</p>
            </div>
        </div>
    );
    
    return (
        <div className="min-h-screen bg-surface text-on-surface animate-fade-in">
             <header className="bg-surface-container border-b border-outline/30 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto py-5 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('landing')} aria-label="Back to Home" className="text-primary">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-on-surface">How AfterLife Works</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight sm:text-5xl">Craft a Legacy, Create a Connection</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-on-surface-variant">
                        AfterLife provides a new way to remember. It's a simple, four-step process from creation to connection.
                    </p>
                </div>

                <div className="space-y-16">
                    <StepCard 
                        step={1}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>}
                        title="Create a Memorial"
                    >
                        Begin by creating a new memorial. This is the digital canvas for a life story. You'll add a name, significant dates, a cherished photo, and a biography that captures the essence of the person.
                    </StepCard>
                    <StepCard 
                        step={2}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>}
                        title="Teach It Your Voice"
                    >
                        Bring the memorial to life by teaching it to respond. You can record a personal audio message and create custom replies. For example, if a visitor mentions "love," you can share a thought on what love meant to you.
                    </StepCard>
                     <StepCard 
                        step={3}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>}
                        title="The Magic of Connection"
                    >
                        When a visitor interacts, the system listens. If their message contains one of your keywords, it shares your pre-written response. If not, our AI provides a gentle, comforting reflection that honors your spirit without speaking for you.
                    </StepCard>
                    <StepCard 
                        step={4}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9 9 0 100-13.5h9a9 9 0 000 13.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12.75h4.5m-4.5-3h4.5" /></svg>}
                        title="An Enduring Legacy"
                    >
                        The memorial becomes a living space for remembrance. Visitors can leave tributes on the wall, creating a shared tapestry of memories. Your story continues, accessible for generations to come.
                    </StepCard>
                </div>
                
                <div className="mt-24 text-center">
                    <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Ready to Begin?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-on-surface-variant">
                       Explore a live demo or create your own account to start building a legacy today.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button 
                            onClick={() => onNavigate('login')} 
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-on-primary bg-primary shadow-lg hover:bg-opacity-90 transition-transform hover:scale-105"
                        >
                            Get Started for Free
                        </button>
                        <button 
                            onClick={() => onNavigate('demoVisitor')} 
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-on-surface-variant bg-surface-container-high border border-outline hover:bg-outline/20 transition-colors"
                        >
                           View a Demo
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
export default HowItWorksPage;