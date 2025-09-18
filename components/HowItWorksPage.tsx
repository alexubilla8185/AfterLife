import React from 'react';
import { View } from '../App';

interface HowItWorksPageProps {
    onNavigate: (view: View) => void;
}

const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
    const Card: React.FC<{ icon: JSX.Element, title: string, children: React.ReactNode }> = ({ icon, title, children }) => (
        <div className="bg-surface-container p-8 rounded-3xl border border-outline/30">
            <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-primary-container text-on-primary-container mb-6">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-3 text-on-surface">{title}</h3>
            <div className="text-on-surface-variant space-y-4">{children}</div>
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
            <main className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-on-surface tracking-tight">Two Roles, One Purpose</h2>
                    <p className="mt-4 max-w-3xl mx-auto text-lg text-on-surface-variant">
                        AfterLife is designed for both creating a legacy and connecting with one. Understand the journey from both perspectives.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                        title="The Creator's Journey"
                    >
                        <p>As a Creator, you are the architect of a digital memorial. This is your space to leave a lasting impression for family, friends, and future generations.</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Build the Profile:</strong> Share your life story, important dates, and a favorite photo.</li>
                            <li><strong>Record Your Voice:</strong> Upload or record an audio message for a personal touch.</li>
                            <li><strong>Set Custom Replies:</strong> Program special responses to keywords. If a visitor mentions "travel," you can leave a story about your favorite trip.</li>
                        </ul>
                    </Card>
                     <Card 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.931 8.931 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>}
                        title="The Visitor's Experience"
                    >
                        <p>As a Visitor, you can connect with a memorial in a profound and interactive way, celebrating the life of someone important.</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li><strong>Interactive Chat:</strong> Have a conversation. Receive custom messages left by the Creator or gentle, AI-powered reflections.</li>
                            <li><strong>Leave a Tribute:</strong> Share a memory on the Tribute Wall for everyone to see, creating a communal space of remembrance.</li>
                             <li><strong>Explore their Legacy:</strong> Listen to their audio message and explore the links they shared to their blogs, photo galleries, and more.</li>
                        </ul>
                    </Card>
                </div>
            </main>
        </div>
    );
};
export default HowItWorksPage;