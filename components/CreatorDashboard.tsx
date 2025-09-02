import React, { useState } from 'react';
import { useMemorialProfile } from '../hooks/useMemorialProfile';
import { ResponseType } from '../types';

const ConditionalResponseForm: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [response, setResponse] = useState('');
  const { addConditionalResponse } = useMemorialProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !response.trim()) return;
    addConditionalResponse({
      keyword,
      response,
      type: ResponseType.TEXT,
    });
    setKeyword('');
    setResponse('');
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
      <h3 className="text-xl font-semibold font-serif text-slate-800 dark:text-slate-200">Add New Conditional Response</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-slate-700 dark:text-slate-300">If a visitor's message contains this keyword...</label>
            <input
            type="text"
            id="keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., 'miss you', 'remember'"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white"
            />
        </div>
        <div>
            <label htmlFor="response" className="block text-sm font-medium text-slate-700 dark:text-slate-300">...then respond with this message.</label>
            <textarea
            id="response"
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            rows={4}
            placeholder="e.g., 'I miss you too...'"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white"
            />
        </div>
        <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 dark:disabled:text-gray-400 transition-colors"
            disabled={!keyword.trim() || !response.trim()}
        >
            Save Response
        </button>
      </form>
    </div>
  );
};

const SocialLinksManager: React.FC = () => {
    const { profile, addSocialLink, removeSocialLink } = useMemorialProfile();
    const [platform, setPlatform] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(!platform.trim() || !url.trim()) return;
        addSocialLink({ platform, url });
        setPlatform('');
        setUrl('');
    }

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
            <h3 className="text-xl font-semibold font-serif text-slate-800 dark:text-slate-200">Social & Web Links</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <input
                        type="text"
                        value={platform}
                        onChange={e => setPlatform(e.target.value)}
                        placeholder="Platform (e.g., Blog)"
                        className="flex-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white"
                    />
                    <input
                        type="url"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="URL (https://...)"
                        className="flex-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-slate-900 dark:text-white"
                    />
                </div>
                 <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 dark:disabled:text-gray-400 transition-colors"
                    disabled={!platform.trim() || !url.trim()}
                >
                    Add Link
                </button>
            </form>
            <div className="space-y-3">
                {profile.socialLinks.map(link => (
                    <div key={link.id} className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-3 rounded-md border border-slate-200 dark:border-slate-600">
                        <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{link.platform}</p>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 dark:text-primary-400 hover:underline truncate">{link.url}</a>
                        </div>
                         <button onClick={() => removeSocialLink(link.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-500 flex-shrink-0 ml-4 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
  const { profile, removeConditionalResponse } = useMemorialProfile();
  const [responseToDelete, setResponseToDelete] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (responseToDelete) {
      removeConditionalResponse(responseToDelete);
      setResponseToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setResponseToDelete(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-6">Creator Profile</h2>
              <img src={profile.profileImageUrl} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4 object-cover" />
              <div className="text-center">
                  <h3 className="text-xl font-semibold dark:text-white">{profile.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{profile.lifeSpan}</p>
                  <p className="mt-4 text-slate-700 dark:text-slate-300">{profile.bio}</p>
              </div>
          </div>
          <SocialLinksManager />
          <ConditionalResponseForm />
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 mb-6">Managed Responses</h2>
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
              {profile.responses.length > 0 ? profile.responses.map(res => (
                  <div key={res.id} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 transition-transform hover:scale-[1.02] hover:shadow-md">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">When visitor says...</p>
                              <p className="font-semibold text-primary-700 dark:text-primary-400">"{res.keyword}"</p>
                              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Your reply:</p>
                              <p className="text-slate-800 dark:text-slate-200 italic">"{res.response}"</p>
                          </div>
                          <button onClick={() => setResponseToDelete(res.id)} className="text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-colors">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                             </svg>
                          </button>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-10 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                      <p className="text-slate-500 dark:text-slate-400">No conditional responses set up yet.</p>
                      <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Use the form to add your first one.</p>
                  </div>
              )}
          </div>
        </div>
      </div>
      {responseToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Confirm Deletion</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                Are you sure you want to delete this response?
            </p>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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

export default CreatorDashboard;