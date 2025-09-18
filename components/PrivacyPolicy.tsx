import React from 'react';
import { View } from '../App';

interface PrivacyPolicyProps {
    onNavigate: (view: View) => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-surface text-on-surface">
            <header className="bg-surface-container border-b border-outline/30">
                <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onNavigate('landing')} aria-label="Back to Home" className="text-primary">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-8 w-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                            </svg>
                        </button>
                        <h1 className="text-3xl font-bold text-on-surface">Privacy Policy for AfterLife</h1>
                    </div>
                </div>
            </header>
            <main className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="space-y-8 text-on-surface-variant">
                    <p className="text-sm"><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">1. Introduction</h2>
                        <p>Welcome to AfterLife. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our application.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">2. Information We Collect</h2>
                        <p>We collect information you provide directly to us when you create an account. This includes:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                            <li><strong>Account Information:</strong> When you sign up using a social provider like Google or Facebook, we receive your basic profile information, which may include your full name, email address, and profile picture URL. If you sign up with email, we collect your email address.</li>
                            <li><strong>Memorial Content:</strong> Any information you voluntarily provide to create a memorial, such as bio, life span, photos, audio messages, and conditional responses, is stored securely.</li>
                            <li><strong>Tributes:</strong> Messages and names you provide when leaving a tribute are stored and displayed publicly within the memorial.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">3. How We Use Your Information</h2>
                        <p>We use the information we collect to:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                            <li>Provide, maintain, and improve our services.</li>
                            <li>Create and manage your user account and memorials.</li>
                            <li>Authenticate you when you log in.</li>
                            <li>Respond to your comments and questions.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">4. How We Share Your Information</h2>
                        <p>We do not share your personal information with third parties except in the following circumstances:</p>
                        <ul className="list-disc list-inside space-y-2 mt-2 pl-4">
                            <li>With your consent.</li>
                            <li>For legal reasons, such as complying with a law, regulation, or legal process.</li>
                            <li>With our service providers (like Supabase) who process data on our behalf and are subject to strict data protection agreements.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">5. Data Security</h2>
                        <p>We use reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">6. Data Deletion</h2>
                        <p>You have the right to delete your account and all associated data. For instructions on how to do this, please see our <button onClick={() => onNavigate('data-deletion')} className="text-primary hover:text-opacity-80 underline">Data Deletion Policy</button>.</p>
                    </section>
                    
                    <section>
                        <h2 className="text-2xl font-semibold text-on-surface mb-4">7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:alexubilla8185@gmail.com" className="text-primary hover:text-opacity-80 underline">alexubilla8185@gmail.com</a>.</p>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default PrivacyPolicy;