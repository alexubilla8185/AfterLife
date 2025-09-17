import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { supabase } from '../services/supabaseClient';
import { CreatorProfile } from '../types';

interface ProfilePageProps {
    onNavigate: (view: 'creator' | 'visitor', memorialId: string) => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
    const { user, signOut } = useUser();
    const [memorials, setMemorials] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMemorials = async () => {
            if (!user) return;
            setLoading(true);
            const { data, error } = await supabase
                .from('memorials')
                .select('*')
                .eq('user_id', user.id);
            
            if (error) {
                console.error("Error fetching memorials:", error);
            } else {
                setMemorials(data as CreatorProfile[]);
            }
            setLoading(false);
        }
        fetchMemorials();
    }, [user]);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Loading profile...</h1>
                <p className="text-slate-500 dark:text-slate-400">You may be redirected to the login page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
                    <img src={user.profileImageUrl} alt={user.name} className="w-36 h-36 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-600" />
                    <div>
                        <h1 className="text-4xl font-extrabold font-serif text-slate-900 dark:text-slate-100">{user.name}</h1>
                        <p className="text-lg text-slate-500 dark:text-slate-400">{user.email}</p>
                        <p className="mt-4 text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                            This is your personal hub. From here, you can manage the memorials you've created and view the tributes you've left for others.
                        </p>
                        <button
                            onClick={signOut}
                            className="mt-6 inline-flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-sm font-medium rounded-md text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
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
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200 mb-4">My Creator Hub</h2>
                    {loading ? <p className="text-slate-500 dark:text-slate-400">Loading memorials...</p> : (
                        memorials.length > 0 ? (
                            <div className="space-y-4">
                                <p className="text-slate-600 dark:text-slate-400 mb-2">Manage the digital legacies you are building.</p>
                                {memorials.map(memorial => (
                                    <div key={memorial.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-slate-200">{memorial.name}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{memorial.life_span}</p>
                                        </div>
                                        <button
                                            onClick={() => onNavigate('creator', memorial.id)}
                                            className="px-3 py-1.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm"
                                        >
                                            Manage
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-slate-600 dark:text-slate-400 mb-6">You haven't created any memorials yet.</p>
                        )
                    )}
                     {/* Add "Create New" button in the future here */}
                </div>

                {/* Visitor Side */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-slate-200 mb-4">My Visitor Activity</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6">
                        (Coming Soon) View a collection of all the tributes you have left on other memorials across AfterLife.
                    </p>
                    <button
                        disabled
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-700 cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                             <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>View My Tributes</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;