import React, { useState, useEffect } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { useUser } from '../hooks/useUser';
import { CreatorProfile } from '../types';

interface AdminProfile {
    id: string;
    full_name: string | null;
    email: string | null;
    role: string;
}

const AdminPage: React.FC = () => {
    const { user } = useUser();
    const [users, setUsers] = useState<AdminProfile[]>([]);
    const [memorials, setMemorials] = useState<CreatorProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (user?.role !== 'admin') {
                setLoading(false);
                return;
            }
            
            const supabase = getSupabase();
            setLoading(true);
            
            const [usersRes, memorialsRes] = await Promise.all([
                supabase.from('profiles').select('*'),
                supabase.from('memorials').select('*')
            ]);
            
            if (usersRes.error) {
                console.error('Error fetching users:', usersRes.error);
            } else {
                setUsers(usersRes.data as AdminProfile[]);
            }

            if (memorialsRes.error) {
                console.error('Error fetching memorials:', memorialsRes.error);
            } else {
                setMemorials(memorialsRes.data as CreatorProfile[]);
            }
            
            setLoading(false);
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    if (loading) {
        return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading Admin Dashboard...</div>;
    }

    if (user?.role !== 'admin') {
        return (
            <div className="text-center py-20">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Admin Dashboard</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Platform-wide data overview.</p>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Users ({users.length})</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{u.full_name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Memorials Table */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Memorials ({memorials.length})</h2>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lifespan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User ID</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {memorials.map(m => (
                                <tr key={m.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{m.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{m.life_span}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 font-mono text-xs">{m.user_id}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
