import React, { useState, useEffect, useCallback } from 'react';
import { useUser } from '../hooks/useUser';
import { getSupabase } from '../services/supabaseClient';
import { CreatorProfile } from '../types';
import CreateMemorialModal from './CreateMemorialModal';
import { useDialog } from '../hooks/useDialog';

interface ProfilePageProps {
    onNavigate: (view: 'creator' | 'visitor', memorialId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
    const { user, signOut } = useUser();
    const { showConfirmation } = useDialog();
    const [memorials, setMemorials] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
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

    const handleDeleteMemorial = async (memorialToDelete: CreatorProfile) => {
        const { id: memorialId, audio_message_url } = memorialToDelete;

        const confirmed = await showConfirmation({
            title: 'Confirm Deletion',
            message: (
                 <p>
                    Are you sure you want to delete the memorial for <strong>{memorialToDelete.name}</strong>? This action is irreversible.
                </p>
            ),
            confirmText: 'Confirm'
        });

        if (!confirmed) return;

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

        fetchMemorials(); // Refresh the list
    };

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-on-surface">Loading profile...</h1>
                <p className="text-on-surface-variant">You may be redirected to the login page.</p>
            </div>
        );
    }

    return (
        <>
            {isCreateModalOpen && <CreateMemorialModal onClose={() => { setIsCreateModalOpen(false); fetchMemorials(); }} />}
            <div className="max-w-6xl mx-auto animate-fade-in">
                <div className="bg-surface-container p-6 md:p-8 rounded-3xl border border-outline/30">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
                        <img src={user.avatar_url || ''} alt={user.full_name || 'User'} className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover shadow-md border-4 border-surface" />
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-on-surface">{user.full_name}</h1>
                            <p className="text-base sm:text-lg text-on-surface-variant">{user.email}</p>
                            <p className="mt-4 text-on-surface-variant leading-relaxed max-w-2xl">
                                This is your personal hub. From here, you can manage the memorials you've created.
                            </p>
                            <button
                                onClick={signOut}
                                className="mt-6 inline-flex items-center space-x-2 px-5 py-2.5 border border-outline text-sm font-medium rounded-full text-on-surface-variant bg-surface-container hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="bg-surface-container p-6 rounded-3xl border border-outline/30">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-on-surface">My Creator Hub</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-on-primary-container bg-primary-container shadow-sm hover:bg-opacity-80 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Create New
                            </button>
                        </div>
                        
                        <p className="text-on-surface-variant mb-6">Manage the digital legacies you are building.</p>

                        {loading ? <p className="text-on-surface-variant">Loading memorials...</p> : (
                            memorials.length > 0 ? (
                                <div className="space-y-4">
                                    {memorials.map(memorial => (
                                        <div key={memorial.id} className="bg-surface-variant/50 p-4 rounded-2xl border border-outline/30 flex items-center justify-between">
                                            <div>
                                                <p className="font-semibold text-on-surface">{memorial.name}</p>
                                                <p className="text-sm text-on-surface-variant">{memorial.life_span}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => onNavigate('creator', memorial.id)}
                                                    className="px-4 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-opacity-80 rounded-full"
                                                >
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMemorial(memorial)}
                                                    className="p-2 text-on-surface-variant hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors"
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
                                <div className="text-left py-10 px-8 bg-surface-variant/30 border-2 border-dashed border-outline/30 rounded-2xl">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.572L16.25 21.75l-.648-1.178a2.625 2.625 0 00-1.732-1.732L12 18.25l1.178-.648a2.625 2.625 0 001.732-1.732L15.75 15l.648 1.178a2.625 2.625 0 001.732 1.732L19.5 18.25l-1.178.648a2.625 2.625 0 00-1.732 1.732z" /></svg>
                                        <h3 className="text-xl font-bold text-on-surface">Let's build your first digital legacy.</h3>
                                    </div>
                                    <p className="text-on-surface-variant mb-8">
                                        Follow these simple steps to create a meaningful, interactive memorial. The first step is to click the 'Create New' button above.
                                    </p>
                                    <div className="space-y-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full font-bold">1</div>
                                            <div>
                                                <h4 className="font-semibold text-on-surface">Create Your Memorial</h4>
                                                <p className="text-sm text-on-surface-variant">
                                                    Click the <strong>'Create New'</strong> button to begin. You'll add a name, life span, and a short bio. This is the foundation of the legacy.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full font-bold">2</div>
                                            <div>
                                                <h4 className="font-semibold text-on-surface">Personalize the Experience</h4>
                                                <p className="text-sm text-on-surface-variant">
                                                    Once created, you'll enter the Creator Dashboard. Upload a profile photo, record a personal audio message, and add links to important websites.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-primary-container text-on-primary-container rounded-full font-bold">3</div>
                                            <div>
                                                <h4 className="font-semibold text-on-surface">Add Interactive Responses</h4>
                                                <p className="text-sm text-on-surface-variant">
                                                    Bring the memorial to life. Create custom replies that visitors will receive when their messages contain keywords you've chosen, like "love" or "travel".
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfilePage;
