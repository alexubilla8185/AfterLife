import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '../hooks/useUser';
import { getSupabase } from '../services/supabaseClient';
import { CreatorProfile } from '../types';

interface ProfilePageProps {
    onNavigate: (view: 'creator' | 'visitor', memorialId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
    const { user, signOut } = useUser();
    const [memorials, setMemorials] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [memorialToDelete, setMemorialToDelete] = useState<CreatorProfile | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const supabase = getSupabase();

    const fetchMemorials = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('memorials')
            .select('id, name, life_span, audio_message_url')
            .eq('user_id', user.id);
        
        if (error) {
            console.error("Error fetching memorials:", error);
        } else {
            setMemorials(data as CreatorProfile[]);
        }
        setLoading(false);
    }, [user, supabase]);

    useEffect(() => {
        fetchMemorials();
    }, [fetchMemorials]);

    // Accessibility: Focus trap for delete confirmation modal
    useEffect(() => {
        if (memorialToDelete && modalRef.current) {
            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            ) as NodeListOf<HTMLElement>;
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            firstElement?.focus();

            const handleKeyDown = (e: KeyboardEvent) => {
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
            
            const currentModalRef = modalRef.current;
            currentModalRef.addEventListener('keydown', handleKeyDown);
            return () => currentModalRef.removeEventListener('keydown', handleKeyDown);
        }
    }, [memorialToDelete]);

    const handleDeleteMemorial = async () => {
        if (!memorialToDelete) return;

        const { id: memorialId, audio_message_url } = memorialToDelete;

        // 1. Delete associated data
        const tablesToDeleteFrom = ['conditional_responses', 'social_links', 'tributes'];
        for (const table of tablesToDeleteFrom) {
            const { error } = await supabase.from(table).delete().eq('memorial_id', memorialId);
            if (error) console.error(`Error deleting from ${table}:`, error);
        }

        // 2. Delete audio file from storage if it exists
        if (audio_message_url) {
            const filePath = audio_message_url.split('/memorials/')[1];
            if (filePath) {
                const { error: storageError } = await supabase.storage.from('memorials').remove([filePath]);
                if (storageError) console.error('Error deleting audio file:', storageError);
            }
        }

        // 3. Delete the memorial itself
        const { error: memorialError } = await supabase.from('memorials').delete().eq('id', memorialId);
        if (memorialError) {
            console.error("Error deleting memorial:", memorialError);
        }

        setMemorialToDelete(null);
        fetchMemorials(); // Refresh the list
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Loading profile...</h1>
                <p className="text-gray-500 dark:text-gray-400">You may be redirected to the login page.</p>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
                        <img src={user.avatar_url || ''} alt={user.full_name || 'User'} className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-white dark:border-gray-600" />
                        <div>
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{user.full_name}</h1>
                            <p className="text-lg text-gray-500 dark:text-gray-400">{user.email}</p>
                            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                                This is your personal hub. From here, you can manage the memorials you've created and view the tributes you've left for others.
                            </p>
                            <button
                                onClick={signOut}
                                className="mt-6 inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Creator Side */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">My Creator Hub</h2>
                            <button
                                disabled
                                className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 shadow-sm cursor-not-allowed opacity-60"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create New
                                <span className="absolute -top-2 -right-3 text-xs font-semibold bg-gray-500 text-white px-2 py-0.5 rounded-full">Soon</span>
                            </button>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Manage the digital legacies you are building.</p>

                        {loading ? <p className="text-gray-500 dark:text-gray-400">Loading memorials...</p> : (
                            memorials.length > 0 ? (
                                <div className="space-y-4">
                                    {memorials.map(memorial => (
                                        <div key={memorial.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-gray-800 dark:text-gray-200">{memorial.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{memorial.life_span}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onNavigate('creator', memorial.id)}
                                                    className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() => setMemorialToDelete(memorial)}
                                                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                                    aria-label="Delete memorial"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No memorials yet</h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Click 'Create New' to start building a legacy.</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Visitor Side */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">My Visitor Activity</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            (Coming Soon) View a collection of all the tributes you have left on other memorials across AfterLife.
                        </p>
                        <button
                            disabled
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-500 bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                            <span>View My Tributes</span>
                        </button>
                    </div>
                </div>
            </div>

            {memorialToDelete && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
                <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto border border-gray-200 dark:border-gray-700">
                    <h3 id="delete-modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                        Are you sure you want to delete the memorial for <strong>{memorialToDelete.name}</strong>? This action is irreversible.
                    </p>
                    <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={() => setMemorialToDelete(null)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteMemorial}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Confirm
                    </button>
                    </div>
                </div>
                </div>
            )}
        </>
    );
};

export default ProfilePage;