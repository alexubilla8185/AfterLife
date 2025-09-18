import React, { useState, useRef, useEffect } from 'react';
import { useMemorialProfile } from '../hooks/useMemorialProfile';
import { getSupabase } from '../services/supabaseClient';
import { CreatorProfile } from '../types';

interface EditProfileModalProps {
    onClose: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
    const { memorial, updateProfile, refetch } = useMemorialProfile();
    const [formData, setFormData] = useState<Partial<CreatorProfile>>({
        name: memorial?.profile.name || '',
        life_span: memorial?.profile.life_span || '',
        bio: memorial?.profile.bio || '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(memorial?.profile.profile_image_url || null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const supabase = getSupabase();

    // Accessibility: Focus trap for modal
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


    if (!memorial) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        let updatedProfileData = { ...formData };

        if (imageFile) {
            if (memorial.profile.profile_image_url) {
                const oldFilePath = memorial.profile.profile_image_url.split('/memorials/')[1];
                if (oldFilePath) {
                    await supabase.storage.from('memorials').remove([oldFilePath]);
                }
            }

            const fileExt = imageFile.name.split('.').pop();
            const fileName = `${memorial.profile.user_id}/${memorial.profile.id}-profile.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('memorials')
                .upload(fileName, imageFile, { upsert: true });

            if (uploadError) {
                console.error("Error uploading image:", uploadError);
                alert("Failed to upload new image.");
                setIsSaving(false);
                return;
            }
            
            const { data: { publicUrl } } = supabase.storage.from('memorials').getPublicUrl(fileName);
            updatedProfileData.profile_image_url = publicUrl;
        }

        await updateProfile(updatedProfileData);
        refetch();
        setIsSaving(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
            <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="edit-profile-title" className="bg-surface-container-high rounded-3xl p-6 w-full max-w-lg mx-auto border border-outline max-h-[90vh] flex flex-col">
                <div className="flex-shrink-0">
                    <h2 id="edit-profile-title" className="text-2xl font-bold text-on-surface mb-6">Edit Profile</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                    <div className="flex justify-center">
                        <div className="relative group">
                            <img
                                src={imagePreview || ''}
                                alt="Profile Preview"
                                className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-surface"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity"
                                aria-label="Change profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                </svg>
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/png, image/jpeg, image/webp"
                                className="hidden"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-on-surface-variant mb-1">Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                    <div>
                        <label htmlFor="life_span" className="block text-sm font-medium text-on-surface-variant mb-1">Life Span</label>
                        <input type="text" name="life_span" id="life_span" value={formData.life_span} onChange={handleInputChange} className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-on-surface-variant mb-1">Bio</label>
                        <textarea name="bio" id="bio" value={formData.bio} onChange={handleInputChange} rows={5} className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface" />
                    </div>
                </div>

                <div className="mt-6 flex-shrink-0 flex justify-end space-x-3 pt-4 border-t border-outline">
                    <button onClick={onClose} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium rounded-full hover:bg-outline/20 text-on-surface-variant">Cancel</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-on-primary bg-primary rounded-full hover:bg-opacity-80 disabled:opacity-50">{isSaving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileModal;