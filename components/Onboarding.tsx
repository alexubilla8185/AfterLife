import React from 'react';

interface OnboardingProps {
  onComplete: () => void;
  context: 'creator' | 'visitor' | 'login';
}

const FeatureItem: React.FC<{ icon: JSX.Element; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <li className="flex items-start space-x-4">
        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 dark:bg-gray-700 rounded-lg">
            <div className="h-6 w-6 text-primary-600 dark:text-primary-400">{icon}</div>
        </div>
        <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200">{title}</h4>
            <p className="text-gray-600 dark:text-gray-300">{children}</p>
        </div>
    </li>
);

const CreatorGuide = () => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 border-l-4 border-primary-500 dark:border-primary-400 pl-4">For Creators: Building Your Legacy</h3>
    <ul className="space-y-6">
        <FeatureItem 
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>}
            title="Design Your Memorial"
        >
            Share your biography, important life events, and photos. Link to personal blogs, social media, or online galleries.
        </FeatureItem>
        <FeatureItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>}
            title="Program Interactive Responses"
        >
            Set up keyword-based replies. If a visitor's message contains 'miss you', you can pre-write a specific, comforting response.
        </FeatureItem>
    </ul>
  </div>
);

const VisitorGuide = () => (
  <div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 border-l-4 border-primary-500 dark:border-primary-400 pl-4">For Visitors: Connecting with Memories</h3>
      <ul className="space-y-6">
        <FeatureItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>}
            title="Interactive Chat"
        >
            Share thoughts and memories. You may receive a pre-programmed message, creating a powerful sense of connection.
        </FeatureItem>
        <FeatureItem
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345h5.364c.548 0 .842.733.397 1.088l-4.386 3.188a.563.563 0 00-.182.557l1.622 5.111a.563.563 0 01-.812.622l-4.386-3.188a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.812-.622l1.622-5.111a.563.563 0 00-.182-.557l-4.386-3.188a.563.563 0 01.397-1.088h5.364a.563.563 0 00.475-.345L11.48 3.5z" /></svg>}
            title="Leave a Public Tribute"
        >
            Post a message on the memorial wall for others to see, sharing stories and condolences with the community.
        </FeatureItem>
    </ul>
  </div>
);


const Onboarding: React.FC<OnboardingProps> = ({ onComplete, context }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col max-h-[90vh]">
        <header className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">How AfterLife Works</h2>
          <button 
            onClick={onComplete} 
            aria-label="Close guide" 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-8 md:p-10 overflow-y-auto space-y-10">
          {(context === 'login' || context === 'creator') && <CreatorGuide />}
          {(context === 'login' || context === 'visitor') && <VisitorGuide />}
        </main>

        <footer className="bg-gray-50 dark:bg-gray-800/50 p-6 mt-auto border-t border-gray-200 dark:border-gray-700 flex justify-end flex-shrink-0">
            <button
                onClick={onComplete}
                className="py-3 px-8 border border-transparent rounded-lg text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
                Got It
            </button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;