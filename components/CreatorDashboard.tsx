import React, { useState, useEffect, useRef } from 'react';
import { useMemorialProfile } from '../hooks/useMemorialProfile';
import { getSupabase } from '../services/supabaseClient';
import EditProfileModal from './EditProfileModal';

const AudioMessageManager: React.FC = () => {
    const { memorial, updateProfile } = useMemorialProfile();
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(memorial?.profile.audio_message_url || null);
    const [isUploading, setIsUploading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const supabase = getSupabase();

    useEffect(() => {
        setAudioUrl(memorial?.profile.audio_message_url || null);
    }, [memorial?.profile.audio_message_url]);

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check your browser permissions.");
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setAudioBlob(file);
            setAudioUrl(URL.createObjectURL(file));
        }
    };

    const handleSaveAudio = async () => {
        if (!audioBlob || !memorial) return;
        setIsUploading(true);

        if (memorial.profile.audio_message_url) {
            const oldFilePath = memorial.profile.audio_message_url.split('/memorials/')[1];
            if (oldFilePath) {
                await supabase.storage.from('memorials').remove([oldFilePath]);
            }
        }

        const fileName = `${memorial.profile.user_id}/${memorial.profile.id}-${Date.now()}.webm`;
        const { data, error } = await supabase.storage
            .from('memorials')
            .upload(fileName, audioBlob);

        if (error) {
            console.error("Error uploading audio:", error);
            alert("Failed to upload audio.");
            setIsUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('memorials').getPublicUrl(data.path);
        
        await updateProfile({ audio_message_url: publicUrl });
        
        setAudioBlob(null);
        setIsUploading(false);
    };

    const handleDeleteAudio = async () => {
        if (!memorial?.profile.audio_message_url) return;
        
        const filePath = memorial.profile.audio_message_url.split('/memorials/')[1];
        if (!filePath) {
            console.error("Could not determine file path from URL.");
            await updateProfile({ audio_message_url: undefined });
            return;
        }
        
        await supabase.storage.from('memorials').remove([filePath]);
        await updateProfile({ audio_message_url: undefined });
        
        setAudioUrl(null);
        setAudioBlob(null);
    };

    return (
        <div className="bg-surface-container p-6 rounded-3xl border border-outline/30 space-y-4">
            <h3 className="text-xl font-semibold text-on-surface">Audio Message</h3>
            
            {audioUrl && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-on-surface-variant">Current Message:</p>
                    <audio controls src={audioUrl} className="w-full rounded-lg"></audio>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={isRecording ? handleStopRecording : handleStartRecording}
                    className={`flex-1 flex justify-center items-center space-x-2 py-3 px-4 rounded-full text-sm font-medium transition-colors ${
                        isRecording 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-secondary-container text-on-secondary-container hover:bg-opacity-80'
                    }`}
                >
                    {isRecording ? (
                         <>
                            <span className="relative flex h-3 w-3" aria-hidden="true"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span></span>
                            <span aria-live="polite">Stop Recording</span>
                         </>
                    ) : (
                        <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-5.921V4a2 2 0 10-4 0v.08A6 6 0 014 8H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg><span>Record Message</span></>
                    )}
                </button>

                <label htmlFor="audio-upload" className="flex-1 flex justify-center items-center space-x-2 py-3 px-4 rounded-full text-sm font-medium cursor-pointer transition-colors bg-secondary-container text-on-secondary-container hover:bg-opacity-80">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                    <span>Upload File</span>
                    <input id="audio-upload" type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                </label>
            </div>

            {audioBlob && (
                 <button
                    onClick={handleSaveAudio}
                    disabled={isUploading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-sm font-medium text-on-primary bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                   {isUploading ? 'Saving...' : 'Save New Message'}
                </button>
            )}
            
            {memorial?.profile.audio_message_url && !audioBlob && (
                 <button
                    onClick={handleDeleteAudio}
                    className="w-full flex justify-center items-center space-x-2 py-3 px-4 rounded-full text-sm font-medium text-red-600 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    <span>Delete Current Message</span>
                </button>
             )}
        </div>
    );
};


const ConditionalResponseForm: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');
  const { addConditionalResponse } = useMemorialProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !response.trim()) return;
    await addConditionalResponse({ keyword, response });
    setKeyword('');
    setResponse('');
  };

  return (
    <div className="bg-surface-container p-6 rounded-3xl border border-outline/30 space-y-4">
      <h3 className="text-xl font-semibold text-on-surface">Add New Conditional Response</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-on-surface-variant mb-1">If a message contains...</label>
            <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., 'miss you', 'remember'"
            className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
        </div>
        <div>
            <label htmlFor="response" className="block text-sm font-medium text-on-surface-variant mb-1">...respond with this message.</label>
            <textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="e.g., 'I miss you too...'"
            className="block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
            />
        </div>
        <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-sm font-medium text-on-primary bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            disabled={!keyword.trim() || !response.trim()}
        >
            Save Response
        </button>
      </form>
    </div>
  );
};

const SocialLinksManager: React.FC = () => {
    const { memorial, addSocialLink, removeSocialLink } = useMemorialProfile();
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!platform.trim() || !url.trim()) return;
        await addSocialLink({ platform, url });
        setPlatform('');
        setUrl('');
    }

    if (!memorial) return null;

    return (
        <div className="bg-surface-container p-6 rounded-3xl border border-outline/30 space-y-6">
            <h3 className="text-xl font-semibold text-on-surface">Social & Web Links</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                        type="text"
                        value={platform}
                        onChange={e => setPlatform(e.target.value)}
                        placeholder="Platform (e.g., Blog)"
                        className="flex-1 block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="URL (https://...)"
                        className="flex-1 block w-full px-4 py-3 bg-surface-variant border border-outline/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-on-surface"
                    />
                </div>
                 <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full text-sm font-medium text-on-primary bg-primary hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    disabled={!platform.trim() || !url.trim()}
                >
                    Add Link
                </button>
            </form>
            <div className="space-y-3">
                {memorial.socialLinks.map(link => (
                    <div key={link.id} className="flex items-center justify-between bg-surface-variant/50 p-3 rounded-xl border border-outline/30">
                        <div>
                            <p className="font-semibold text-on-surface">{link.platform}</p>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">{link.url}</a>
                        </div>
                         <button onClick={() => removeSocialLink(link.id)} aria-label={`Delete ${link.platform} link`} className="text-on-surface-variant hover:text-red-500 flex-shrink-0 ml-4 p-2 rounded-full transition-colors hover:bg-red-500/10">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                           </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const CreatorDashboard: React.FC = () => {
  const { memorial, loading, removeConditionalResponse } = useMemorialProfile();
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Accessibility: Focus trap for delete confirmation modal
  useEffect(() => {
    if (responseToDelete && modalRef.current) {
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
  }, [responseToDelete]);

  const handleConfirmDelete = async () => {
    if (responseToDelete) {
      await removeConditionalResponse(responseToDelete);
      setResponseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setResponseToDelete(null);
  };
  
  if (loading) {
      return <div className="text-center py-20 text-on-surface-variant">Loading Creator Dashboard...</div>
  }
  
  if (!memorial) {
      return <div className="text-center py-20 text-on-surface-variant">Could not load memorial data.</div>
  }

  const { profile, responses } = memorial;

  return (
    <>
      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="relative bg-surface-container p-6 rounded-3xl border border-outline/30">
              <h2 className="text-2xl font-bold text-on-surface mb-6">Creator Profile</h2>
              <img src={profile.profile_image_url} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <div className="text-center">
                  <h3 className="text-xl font-semibold text-on-surface">{profile.name}</h3>
                  <p className="text-sm text-on-surface-variant">{profile.life_span}</p>
                  <p className="mt-4 text-on-surface-variant">{profile.bio}</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="absolute top-4 right-4 p-2 text-on-surface-variant bg-surface-container-high hover:bg-outline/20 rounded-full transition-colors"
                aria-label="Edit Profile"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                  </svg>
              </button>
          </div>
          <AudioMessageManager />
          <SocialLinksManager />
          <ConditionalResponseForm />
        </div>
        <div className="lg:col-span-2 bg-surface-container p-6 rounded-3xl border border-outline/30">
          <h2 className="text-2xl font-bold text-on-surface mb-6">Managed Responses</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {responses.length > 0 ? responses.map(res => (
                  <div key={res.id} className="bg-surface-variant/50 p-4 rounded-2xl border border-outline/30">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-sm text-on-surface-variant">When visitor says...</p>
                              <p className="font-semibold text-primary">"{res.keyword}"</p>
                              <p className="mt-2 text-sm text-on-surface-variant">Your reply:</p>
                              <p className="text-on-surface italic">"{res.response}"</p>
                          </div>
                          <button onClick={() => setResponseToDelete(res.id)} aria-label={`Delete response for keyword "${res.keyword}"`} className="text-on-surface-variant hover:text-red-500 rounded-full p-2 transition-colors hover:bg-red-500/10">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-10 border-2 border-dashed border-outline/50 rounded-2xl">
                      <p className="text-on-surface-variant">No conditional responses set up yet.</p>
                      <p className="text-sm text-on-surface-variant/70 mt-1">Use the form to add your first one.</p>
                  </div>
              )}
          </div>
        </div>
      </div>
      {responseToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
          <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title" className="bg-surface-container-high rounded-3xl p-6 w-full max-w-sm mx-auto border border-outline">
            <h3 id="delete-modal-title" className="text-lg font-semibold text-on-surface">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-on-surface-variant">
                Are you sure you want to delete this response?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-5 py-2.5 text-sm font-medium rounded-full hover:bg-outline/20"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
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

export default CreatorDashboard;