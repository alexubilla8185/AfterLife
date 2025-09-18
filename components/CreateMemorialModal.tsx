import React, { useState, useRef, useEffect } from 'react';
import { getSupabase } from '../services/supabaseClient';
import { useUser } from '../hooks/useUser';

interface CreateMemorialModalProps {
    onClose: () => void;
}

const CreateMemorialModal: React.FC<CreateMemorialModalProps> = ({ onClose }) => {
    const { user } = useUser();
    const [name, setName] = useState('');
    const [lifeSpan, setLifeSpan] = useState('');
    const [bio, setBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);
    const supabase = getSupabase();

    useEffect(() => {
        if (modalRef.current) {
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
    }, []);

    const handleSave = async () => {
        if (!user || !name.trim()) return;
        setIsSaving(true);

        const { error } = await supabase
            .from('memorials')
            .insert({
                user_id: user.id,
                name,
                life_span: lifeSpan,
                bio,
                // Provide a default profile image
                profile_image_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=256`
            });

        if (error) {
            console.error("Error creating memorial:", error);
            alert("Failed to create memorial.");
            setIsSaving(false);
        } else {
            onClose(); // This will trigger a refetch on the profile page
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] transition-opacity animate-fade-in">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="create-memorial-title" className="bg-surface-container-high rounded-3xl p-6 w-full max-w-lg mx-auto border border-outline max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0">
                    <h2 id="create-memorial-title" className="text-2xl font-bold text-on-surface mb-6">Create New Memorial</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">Name*</label>
                        <input type="text" name="name" id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Jane Doe" required className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                    <div>
                        <label htmlFor="life_span" className="block text-sm font-medium text-on-surface-variant mb-1">Life Span</label>
                        <input type="text" name="life_span" id="life_span" value={lifeSpan} onChange={(e) => setLifeSpan(e.target.value)} placeholder="e.g., 1950 - 2024" className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-on-surface-variant mb-1">Bio</label>
                        <textarea name="bio" id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={5} placeholder="A short biography..." className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                </div>

                <div className="mt-6 flex-shrink-0 flex justify-end space-x-3 pt-4 border-t border-outline">
                    <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium rounded-full hover:bg-outline/20 text-on-surface-variant">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving || !name.trim()} className="px-5 py-2.5 text-sm font-medium text-on-primary bg-primary rounded-full hover:bg-opacity-80 disabled:opacity-50">{isSaving ? 'Creating...' : 'Create Memorial'}</button>
                </div>
            </div>
        </div>
    );
};

export default CreateMemorialModal;