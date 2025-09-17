import React from 'react';

const DataDeletion: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">User Data Deletion Instructions</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <p>
                        We respect your right to control your personal data. You can request the deletion of your AfterLife account and all associated data at any time.
                    </p>

                    <h2>How to Request Data Deletion</h2>
                    <p>
                        To request the deletion of your data, please send an email to our support team with the subject line "Data Deletion Request".
                    </p>
                    
                    <p>
                        <strong>Email:</strong> <a href="mailto:alexubilla8185@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">alexubilla8185@gmail.com</a>
                    </p>

                    <h2>What Happens Next?</h2>
                    <p>
                        Please include the email address associated with your AfterLife account in your message. We will verify your identity and confirm your request within 48 hours. Once confirmed, we will permanently delete all of your data from our systems, including your profile, any memorials you have created, and any tributes you have left. This process is irreversible.
                    </p>
                    
                    <p>
                        The deletion will be completed within 30 days of your confirmed request.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default DataDeletion;
