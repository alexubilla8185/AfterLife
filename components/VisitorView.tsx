import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CreatorProfile, Tribute, ChatMessage, SocialLink } from '../types';
import { useMemorialProfile } from '../hooks/useMemorialProfile';
import Tour, { TourStep } from './Tour';

// Define the type for the Gemini API chat history format
type HistoryPart = {
  role: 'user' | 'model';
  parts: { text: string }[];
};


const visitorTourSteps: TourStep[] = [
    {
        target: '[data-tour-id="profile-header"]',
        title: "A Digital Memorial",
        content: "Welcome to this sacred space. Here you can read the person's story, see their life's work, and feel connected to their memory.",
        position: 'bottom',
    },
    {
        target: '[data-tour-id="interaction-tabs"]',
        title: "Two Ways to Interact",
        content: "You can engage through the 'Interactive Chat' for a personal conversation, or share a public message on the 'Tribute Wall'.",
        position: 'bottom',
    },
    {
        target: '[data-tour-id="chat-input"]',
        title: "Converse with Memory",
        content: "Share a thought, ask a question, or use the microphone to speak. The memorial now remembers your conversation. Special keyword-based replies from the creator are still here, alongside more contextual AI-generated responses.",
        position: 'top',
    },
    {
        target: '[data-tour-id="tribute-wall-tab"]',
        title: "Share a Tribute",
        content: "Click here to switch to the Tribute Wall. You can leave a public message, and if you need help finding the right words, use the AI Assistant.",
        position: 'bottom',
    }
];

const TributeForm: React.FC = () => {
    const [author, setAuthor] = useState('');
    const [message, setMessage] = useState('');
    const [isAssisting, setIsAssisting] = useState(false);
    const { addTribute, memorial } = useMemorialProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!author.trim() || !message.trim()) return;
        await addTribute({ author, message });
        setAuthor('');
        setMessage('');
    };

    const handleAssist = async () => {
        setIsAssisting(true);
        try {
            const response = await fetch('/.netlify/functions/assist-tribute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    memorialName: memorial?.profile.name,
                    memorialBio: memorial?.profile.bio,
                    userDraft: message,
                }),
            });
            if (!response.ok) throw new Error('Failed to get assistance.');
            const data = await response.json();
            if (data.text) {
                setMessage(data.text);
            }
        } catch (error) {
            console.error("Error getting tribute assistance:", error);
        } finally {
            setIsAssisting(false);
        }
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
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                />
            </div>
            <div>
                 <div className="flex justify-between items-center">
                    <label htmlFor="tribute-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Your Message</label>
                    <button type="button" onClick={handleAssist} disabled={isAssisting} className="text-xs font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50 flex items-center space-x-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0V6h-1a1 1 0 110-2h1V3a1 1 0 011-1zM7 8a1 1 0 011 1v1h1a1 1 0 110 2H8v1a1 1 0 11-2 0v-1H5a1 1 0 110-2h1V9a1 1 0 011-1zm5 4a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>{isAssisting ? 'Thinking...' : 'AI Assist'}</span>
                    </button>
                 </div>
                <textarea
                    id="tribute-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder={`Share a memory of ${memorial?.profile.name || '...'}`}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                />
            </div>
            <button
                type="submit"
                disabled={!author.trim() || !message.trim()}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800 dark:disabled:text-gray-400"
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
                    <p className="text-right text-xs text-gray-400 dark:text-gray-500">{new Date(tribute.created_at).toLocaleDateString()}</p>
                </div>
            )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tributes yet. Be the first to share a memory.</p>}
        </div>
    </div>
);


const ChatInterface: React.FC<{ profile: CreatorProfile, isTtsEnabled: boolean }> = ({ profile, isTtsEnabled }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [chatHistory, setChatHistory] = useState<HistoryPart[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const { findResponseForMessage } = useMemorialProfile();
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null); // Using 'any' for SpeechRecognition to handle vendor prefixes

    const isSpeechSupported = typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    useEffect(() => {
        if (!isSpeechSupported) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };
    }, [isSpeechSupported]);

    const toggleListening = () => {
        if (!recognitionRef.current) return;
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            setInput('');
            recognitionRef.current.start();
        }
    };


    useEffect(() => {
        const fetchWelcomeMessage = async () => {
            try {
                const response = await fetch('/.netlify/functions/get-welcome-message', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: profile.name, bio: profile.bio }),
                });
                if (!response.ok) throw new Error('Failed to fetch welcome message');
                const data = await response.json();
                
                const welcomeText = data.text || "Welcome. I'm glad you're here.";
                const welcomeMessage: ChatMessage = { id: 'initial-welcome', sender: 'memorial', text: welcomeText, timestamp: new Date() };
                
                setMessages([welcomeMessage]);
                setChatHistory([{ role: 'model', parts: [{ text: welcomeText }] }]);
            } catch (error) {
                console.error("Error fetching AI welcome message:", error);
                const fallbackText = "Welcome. I'm glad you're here. Feel free to share a thought or a memory.";
                const fallbackMessage: ChatMessage = { id: 'initial-fallback', sender: 'memorial', text: fallbackText, timestamp: new Date() };
                setMessages([fallbackMessage]);
                setChatHistory([{ role: 'model', parts: [{ text: fallbackText }] }]);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchWelcomeMessage();
    }, [profile.name, profile.bio]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      if (isTtsEnabled && 'speechSynthesis' in window && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.sender === 'memorial') {
            // Cancel any previous speech to prevent overlap
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(lastMessage.text);
            window.speechSynthesis.speak(utterance);
        }
      }

    }, [messages, isTtsEnabled]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: ChatMessage = { id: new Date().toISOString(), sender: 'user', text: input, timestamp: new Date() };
        setMessages(prev => [...prev, userMessage]);
        
        const currentInput = input;
        setInput('');
        setIsTyping(true);
        
        await new Promise(res => setTimeout(res, 1000));

        let memorialResponseText: string;
        const conditionalResponse = findResponseForMessage(currentInput);

        if (conditionalResponse) {
            memorialResponseText = conditionalResponse.response;
            // NOTE: We don't add conditional responses to the AI's chat history
            // to keep its context purely conversational.
        } else {
            // This is a conversational turn, so update history and call AI
            const newUserHistoryPart: HistoryPart = { role: 'user', parts: [{ text: currentInput }] };
            const historyForAPI = [...chatHistory, newUserHistoryPart];

            const response = await fetch('/.netlify/functions/get-gemini-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    creatorName: profile.name,
                    chatHistory: historyForAPI
                }),
            });

            if(response.ok) {
                const data = await response.json();
                memorialResponseText = data.text;
                // Update history with both user's and model's new messages
                const newModelHistoryPart: HistoryPart = { role: 'model', parts: [{ text: memorialResponseText }] };
                setChatHistory([...historyForAPI, newModelHistoryPart]);
            } else {
                memorialResponseText = "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
            }
        }

        const memorialMessage: ChatMessage = { id: new Date().toISOString() + '-memorial', sender: 'memorial', text: memorialResponseText, timestamp: new Date() };
        setMessages(prev => [...prev, memorialMessage]);
        setIsTyping(false);
    };

    const TypingIndicator = () => (
        <div className="flex justify-start">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-xl px-4 py-2">
              <div className="flex items-center space-x-1" aria-hidden={true}>
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></span>
              </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-b-lg shadow-sm flex flex-col h-full border border-gray-200 dark:border-gray-700 border-t-0">
            <div aria-live="polite" className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-800/50">
                {isInitialLoading ? (
                    <TypingIndicator />
                ) : (
                    messages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${msg.sender === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}>
                               <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))
                )}
                {isTyping && <TypingIndicator />}
                <div ref={chatEndRef} />
            </div>
            <div data-tour-id="chat-input" className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-center space-x-2">
                    <label htmlFor="chat-message-input" className="sr-only">Share a thought or memory</label>
                    <input
                        id="chat-message-input"
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={isListening ? "Listening..." : "Share a thought or memory..."}
                        className="flex-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-gray-900 dark:text-white"
                        disabled={isInitialLoading || isTyping}
                    />
                    {isSpeechSupported && (
                        <button onClick={toggleListening} aria-label={isListening ? "Stop listening" : "Use microphone"} className={`p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${isListening ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                             {isListening ? (
                                <span className="relative flex h-5 w-5" aria-hidden="true">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="relative h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-5.921V4a2 2 0 10-4 0v.08A6 6 0 014 8H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
                                </span>
                             ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8h-1a6 6 0 11-5.445-5.921V4a2 2 0 10-4 0v.08A6 6 0 014 8H3a7.001 7.001 0 006 6.93V17H7a1 1 0 100 2h6a1 1 0 100-2h-2v-2.07z" clipRule="evenodd" /></svg>
                             )}
                        </button>
                    )}
                    <button onClick={handleSend} aria-label="Send message" className="bg-primary-600 text-white rounded-full p-3 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-primary-400 dark:disabled:bg-primary-800" disabled={!input.trim() || isTyping || isInitialLoading}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
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
    const commonProps = { className: "h-5 w-5", "aria-hidden": true };
    
    if (p.includes('linkedin')) {
        return <svg {...commonProps} viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>;
    }
    if (p.includes('blog') || p.includes('website') || p.includes('gallery')) {
        return <svg {...commonProps} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m-9 9h18" /></svg>;
    }
    return <svg {...commonProps} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
};

interface VisitorViewProps {
    showTour: boolean;
    onTourFinish: () => void;
}

const VisitorView: React.FC<VisitorViewProps> = ({ showTour, onTourFinish }) => {
    const { memorial, loading } = useMemorialProfile();
    const [activeTab, setActiveTab] = useState<'chat' | 'tributes'>('chat');
    const [isTourOpen, setIsTourOpen] = useState(showTour);
    const [isTtsEnabled, setIsTtsEnabled] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('ttsEnabled') === 'true';
    });
    const isTtsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

    useEffect(() => {
        if(showTour) {
            setIsTourOpen(true);
        }
    }, [showTour]);

    const handleTourClose = () => {
        setIsTourOpen(false);
        localStorage.setItem('visitorTourSeen', 'true');
        onTourFinish();
    };

    const toggleTts = () => {
        const newValue = !isTtsEnabled;
        setIsTtsEnabled(newValue);
        localStorage.setItem('ttsEnabled', String(newValue));
        if (!newValue) {
            window.speechSynthesis.cancel();
        }
    };

    if (loading) {
        return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading Memorial...</div>;
    }

    if (!memorial) {
        return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Memorial not found.</div>;
    }

    const { profile, socialLinks, tributes } = memorial;

    const ProfileHeader = () => (
      <div data-tour-id="profile-header" className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-sm mb-8 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-8">
          <img src={profile.profile_image_url} alt={profile.name} className="w-36 h-36 rounded-full object-cover shadow-md border-4 border-white dark:border-gray-600" />
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">{profile.name}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">{profile.life_span}</p>
            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">{profile.bio}</p>
            
            {profile.audio_message_url && (
                <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">A message from {profile.name}:</p>
                    <audio controls src={profile.audio_message_url} className="w-full max-w-sm rounded-lg">
                        Your browser does not support the audio element.
                    </audio>
                </div>
            )}

            {socialLinks && socialLinks.length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3">
                    {socialLinks.map((link: SocialLink) => (
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
    
    interface TabButtonProps {
        tabName: 'chat' | 'tributes';
        label: string;
        icon: JSX.Element;
        'data-tour-id'?: string;
    }
    const TabButton: React.FC<TabButtonProps> = ({ tabName, label, icon, ...props }) => (
        <button
            role="tab"
            id={`tab-${tabName}`}
            aria-selected={activeTab === tabName}
            aria-controls={`tabpanel-${tabName}`}
            onClick={() => setActiveTab(tabName)}
            className={`flex-1 flex items-center justify-center space-x-3 py-4 px-4 text-sm font-semibold border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 rounded-t-lg
            ${activeTab === tabName 
                ? 'border-primary-600 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-300'}`}
            {...props}
        >
            {icon}
            <span>{label}</span>
        </button>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <Tour isOpen={isTourOpen} onClose={handleTourClose} steps={visitorTourSteps} />
            <ProfileHeader />
            
            <div className="bg-white dark:bg-gray-800 rounded-t-lg border-x border-t border-gray-200 dark:border-gray-700 relative">
                {isTtsSupported && (
                    <button
                        onClick={toggleTts}
                        aria-label={isTtsEnabled ? "Disable spoken responses" : "Enable spoken responses"}
                        className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-colors ${
                            isTtsEnabled
                                ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                        }`}
                    >
                        {isTtsEnabled ? (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
                        ) : (
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        )}
                    </button>
                )}
                <div role="tablist" aria-label="Interaction options" data-tour-id="interaction-tabs" className="flex border-b border-gray-200 dark:border-gray-700">
                    <TabButton 
                        tabName="chat" 
                        label="Interactive Chat"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.08-3.239A8.931 8.931 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd" /></svg>}
                    />
                     <TabButton 
                        data-tour-id="tribute-wall-tab"
                        tabName="tributes" 
                        label="Tribute Wall"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>}
                    />
                </div>
            </div>
            <div className="rounded-b-lg overflow-hidden">
                 <div
                    id="tabpanel-chat"
                    role="tabpanel"
                    aria-labelledby="tab-chat"
                    hidden={activeTab !== 'chat'}
                >
                    <ChatInterface profile={profile} isTtsEnabled={isTtsEnabled} />
                </div>
                <div
                    id="tabpanel-tributes"
                    role="tabpanel"
                    aria-labelledby="tab-tributes"
                    hidden={activeTab !== 'tributes'}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 border-t-0"
                >
                    <TributeForm />
                    <TributeWall tributes={tributes} />
                </div>
            </div>
        </div>
    );
};

export default VisitorView;