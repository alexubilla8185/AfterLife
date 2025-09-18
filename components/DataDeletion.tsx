import React from 'react';

const DataDeletion: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <header className="bg-surface-container border-b border-outline/30">
                <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                         <a href="/" aria-label="Back to Home" className="text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </a>
                        <h1 className="text-3xl font-bold text-on-surface">User Data Deletion Instructions</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 text-on-surface-variant">
                    <p>We respect your right to control your personal data. You can request the deletion of your AfterLife account and all associated data at any time.</p>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">How to Request Data Deletion</h2>
                        <p>To request the deletion of your data, please send an email to our support team with the subject line "Data Deletion Request".</p>
                        <p className="mt-4"><strong>Email:</strong> <a href="mailto:alexubilla8185@gmail.com" className="text-primary hover:text-opacity-80 underline">alexubilla8185@gmail.com</a></p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">What Happens Next?</h2>
                        <p>Please include the email address associated with your AfterLife account in your message. We will verify your identity and confirm your request within 48 hours. Once confirmed, we will permanently delete all of your data from our systems, including your profile, any memorials you have created, and any tributes you have left. This process is irreversible.</p>
                        <p className="mt-2">The deletion will be completed within 30 days of your confirmed request.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default DataDeletion;