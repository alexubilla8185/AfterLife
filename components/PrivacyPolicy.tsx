import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <header className="bg-white dark:bg-gray-800 shadow-sm">
                <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8 text-primary-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Privacy Policy for AfterLife</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                    <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>

                    <h2>1. Introduction</h2>
                    <p>
                        Welcome to AfterLife. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our application.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us when you create an account. This includes:
                    </p>
                    <ul>
                        <li><strong>Account Information:</strong> When you sign up using a social provider like Google or Facebook, we receive your basic profile information, which may include your full name, email address, and profile picture URL. If you sign up with email, we collect your email address.</li>
                        <li><strong>Memorial Content:</strong> Any information you voluntarily provide to create a memorial, such as bio, life span, photos, audio messages, and conditional responses, is stored securely.</li>
                        <li><strong>Tributes:</strong> Messages and names you provide when leaving a tribute are stored and displayed publicly within the memorial.</li>
                    </ul>

                    <h2>3. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul>
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Create and manage your user account and memorials.</li>
                        <li>Authenticate you when you log in.</li>
                        <li>Respond to your comments and questions.</li>
                    </ul>
                    
                    <h2>4. How We Share Your Information</h2>
                    <p>
                        We do not share your personal information with third parties except in the following circumstances:
                    </p>
                    <ul>
                        <li>With your consent.</li>
                        <li>For legal reasons, such as complying with a law, regulation, or legal process.</li>
                        <li>With our service providers (like Supabase) who process data on our behalf and are subject to strict data protection agreements.</li>
                    </ul>

                    <h2>5. Data Security</h2>
                    <p>
                        We use reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
                    </p>

                    <h2>6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at alexubilla8185@gmail.com.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;
