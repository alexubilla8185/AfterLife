import React, { useState, useEffect, useRef } from 'react';
import { CreatorProfile, Tribute, ChatMessage, SocialLink } from '../types';
import { useMemorialProfile } from '../hooks/useMemorialProfile';
import { getGenericResponse } from '../services/geminiService';

const TributeForm: React.FC = () => {
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');
    const { addTribute, profile } = useMemorialProfile();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !message.trim()) return;
        addTribute({ author, message });
        setAuthor('');
        setMessage('');
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 space-y-4 h-full">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Leave a Tribute</h3>
            <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Name</label>
                <input
                    type="text"
                    id="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., A loving friend"
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                />
            </div>
            <div>
                <label htmlFor="tribute-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                <textarea
                    id="tribute-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={`Share a memory of ${profile.name}`}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                />
            </div>
            <button
                type="submit"
                disabled={!author.trim() || !message.trim()}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 dark:disabled:text-gray-400"
            >
                Post Tribute
            </button>
        </form>
    );
};

const TributeWall: React.FC<{ tributes: Tribute[] }> = ({ tributes }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Tributes & Memories</h3>
        <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {tributes.length > 0 ? tributes.map(tribute => (
                <div key={tribute.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="text-gray-800 dark:text-gray-200 italic">"{tribute.message}"</p>
                    <p className="text-right text-sm font-medium text-primary-700 dark:text-primary-400 mt-2">- {tribute.author}</p>
                    <p className="text-right text-xs text-gray-400 dark:text-gray-500">{tribute.timestamp.toLocaleDateString()}</p>
                </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tributes yet. Be the first to share a memory.</p>}
        </div>
    </div>
);


const ChatInterface: React.FC<{ profile: CreatorProfile }> = ({ profile }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { findResponseForMessage } = useMemorialProfile();
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = {
            id: new Date().toISOString(),
            sender: 'user',
            text: input,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        
        await new Promise(res => setTimeout(res, 1500));

        let memorialResponseText: string;
        const conditionalResponse = findResponseForMessage(input);

        if (conditionalResponse) {
            memorialResponseText = conditionalResponse.response;
        } else {
            memorialResponseText = await getGenericResponse(profile.name, input);
        }

        const memorialMessage: ChatMessage = {
            id: new Date().toISOString() + '-memorial',
            sender: 'memorial',
            text: memorialResponseText,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, memorialMessage]);
        setIsTyping(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-md flex flex-col h-full">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800/50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl px-4 py-2">
                          <div className="flex items-center space-x-1">
                            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
                          </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Share a thought or memory..."
                        className="flex-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                    />
                    <button onClick={handleSend} className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800" disabled={!input.trim() || isTyping}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                           <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};


const getSocialIcon = (platform: string): JSX.Element => {
    const p = platform.toLowerCase();
    const commonProps = { className: "h-5 w-5" };
    
    if (p.includes('linkedin')) {
        return <svg {...commonProps} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
    }
    if (p.includes('blog') || p.includes('website') || p.includes('gallery')) {
        return <svg {...commonProps} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" /></svg>;
    }
    return <svg {...commonProps} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
};

const VisitorView: React.FC<{ profile: CreatorProfile }> = ({ profile }) => {
    const { tributes } = useMemorialProfile();
    const [activeTab, setActiveTab] = useState<'chat' | 'tributes'>('chat');

    const ProfileHeader = () => (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
          <img src={profile.profileImageUrl} alt={profile.name} className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-600" />
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{profile.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{profile.lifeSpan}</p>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">{profile.bio}</p>
            {profile.socialLinks && profile.socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
                    {profile.socialLinks.map((link: SocialLink) => (
                        <a 
                            key={link.id} 
                            href={link.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                            {getSocialIcon(link.platform)}
                            <span className="text-sm font-medium">{link.platform}</span>
                        </a>
                    ))}
                </div>
            )}
          </div>
        </div>
      </div>
    );
    
    const TabButton: React.FC<{ tabName: 'chat' | 'tributes'; label: string; icon: JSX.Element; }> = ({ tabName, label, icon }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex items-center justify-center space-x-3 py-3 px-4 text-sm font-semibold rounded-t-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
            ${activeTab === tabName ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400' : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <ProfileHeader />
            
            <div className="bg-gray-100 dark:bg-gray-800/50 rounded-t-lg">
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <TabButton 
                        tabName="chat" 
                        label="Interactive Chat"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.931 8.931 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>}
                    />
                     <TabButton 
                        tabName="tributes" 
                        label="Tribute Wall"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                    />
                </div>
            </div>
            <div className="rounded-b-lg overflow-hidden shadow-md">
                {activeTab === 'chat' ? (
                    <ChatInterface profile={profile} />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white dark:bg-gray-800">
                        <TributeForm />
                        <TributeWall tributes={tributes} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisitorView;