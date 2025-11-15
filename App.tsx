

import React, { useState, useCallback, useRef, useEffect } from 'react';
import type { Tab, Settings, ChatState, ChatMessage, ProtectionLevel, VpnState, CustomProtectionSettings } from './types';
import { TabType } from './types';
import { generateImage, createChatSession, sendMessageToChat } from './services/geminiService';

// --- ICONS --- //
const BackIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path></svg>);
const ForwardIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13.1714 12.0007L8.22168 7.05093L9.63589 5.63672L15.9999 12.0007L9.63589 18.3646L8.22168 16.9504L13.1714 12.0007Z"></path></svg>);
const RefreshIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5374 19.5674C16.8821 21.068 14.5868 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C16.1254 2 19.6687 4.54228 21.1602 8.02061L18.5374 9.33203C17.4428 6.84313 14.9542 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C14.0363 19 15.8483 18.1815 17.1182 16.8818L14 14H22V22L18.5374 19.5674Z"></path></svg>);
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path></svg>);
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0007 10.5865L16.9504 5.63672L18.3646 7.05093L13.4149 12.0007L18.3646 16.9504L16.9504 18.3646L12.0007 13.4149L7.05093 18.3646L5.63672 16.9504L10.5865 12.0007L5.63672 7.05093L7.05093 5.63672L12.0007 10.5865Z"></path></svg>);
const AddIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path></svg>);
const ShieldIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12.5523 2 13 2.44772 13 3V5.0546C15.7235 5.55994 18 7.99949 18 11V14.153C18.4237 14.2831 18.823 14.4647 19.191 14.6931C19.7214 15.011 20 15.58 20 16.2025V18.471C20 19.0414 19.7571 19.5768 19.3243 19.9329C17.712 21.2483 15.0263 22 12 22C8.97368 22 6.28803 21.2483 4.67575 19.9329C4.24292 19.5768 4 19.0414 4 18.471V16.2025C4 15.58 4.27857 15.011 4.80901 14.6931C5.17699 14.4647 5.57629 14.2831 6 14.153V11C6 7.99949 8.27651 5.55994 11 5.0546V3C11 2.44772 11.4477 2 12 2ZM12 7C9.79086 7 8 8.79086 8 11V14.1132C9.27218 13.6828 10.6136 13.4336 12 13.4336C13.3864 13.4336 14.7278 13.6828 16 14.1132V11C16 8.79086 14.2091 7 12 7Z"></path></svg>);
const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 21C4.44772 21 4 20.5523 4 20V4C4 3.44772 4.44772 3 5 3H19C19.5523 3 20 3.44772 20 4V20C20 20.5523 19.5523 21 19 21H5ZM16.5 10C16.5 10.8284 15.8284 11.5 15 11.5C14.1716 11.5 13.5 10.8284 13.5 10C13.5 9.17157 14.1716 8.5 15 8.5C15.8284 8.5 16.5 9.17157 16.5 10ZM6 17.5L11 12.5L14 15.5L15.5 14L18 16.5V19H6V17.5Z"></path></svg>);
const ChatIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19H13L10.6667 21.3333C10.2982 21.7018 9.70178 21.7018 9.33333 21.3333L7 19H6C3.79086 19 2 17.2091 2 15V8C2 5.23858 4.23858 3 7 3H10Z"></path></svg>);
const SendIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13.0001H9V11.0001H3V2.04932L22 12.0001L3 21.9508V13.0001Z"></path></svg>);
const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 10.5L13.5 14L17 15.5L13.5 17L12 20.5L10.5 17L7 15.5L10.5 14L12 10.5ZM12 2C12.8284 2 13.5 2.67157 13.5 3.5L13.8475 4.56252L14.4375 4.65252C15.3039 4.78361 16 5.49257 16 6.375C16 7.23075 15.3533 7.92341 14.5125 8.06252L13.5 8.25L13.1525 9.28752C12.9377 9.99913 12.5 10.5 12 10.5C11.5 10.5 11.0623 9.99913 10.8475 9.28752L10.5 8.25L9.48748 8.06252C8.64667 7.92341 8 7.23075 8 6.375C8 5.49257 8.69611 4.78361 9.56252 4.65252L10.1525 4.56252L10.5 3.5C10.5 2.67157 11.1716 2 12 2ZM18.5 10C19.3284 10 20 10.6716 20 11.5L19.75 12.5L20.5 12.75C21.3284 13 22 13.6716 22 14.5C22 15.3284 21.3284 16 20.5 16.25L19.75 16.5L20 17.5C20 18.3284 19.3284 19 18.5 19C17.6716 19 17 18.3284 17 17.5L17.25 16.5L16.5 16.25C15.6716 16 15 15.3284 15 14.5C15 13.6716 15.6716 13 16.5 12.75L17.25 12.5L17 11.5C17 10.6716 17.6716 10 18.5 10Z"></path></svg>);
const GridIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 10H10V14H14V10ZM16 10V14H20V10H16ZM14 16V20H10V16H14ZM16 16H20V20H16V16ZM8 10H4V14H8V10ZM8 16H4V20H8V16ZM10 4H14V8H10V4ZM16 4V8H20V4H16ZM8 4H4V8H8V4Z"></path></svg>);
const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM12 3.291L4.5 7.54V16.459L12 20.709L19.5 16.459V7.54L12 3.291ZM12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10Z"></path></svg>);
const HistoryIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4ZM13 7V11.5858L16.2426 14.8284L14.8284 16.2426L11 12.4142V7H13Z"></path></svg>);
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10H18L12 16L6 10H11V3H13V10ZM4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19Z"></path></svg>);
const VpnIcon: React.FC<{ className?: string }> = ({ className }) => (<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C15.866 2 19 5.13401 19 9C19 11.2393 17.9863 13.2474 16.353 14.6142L18 22H6L7.64703 14.6142C6.01374 13.2474 5 11.2393 5 9C5 5.13401 8.13401 2 12 2ZM12 4C9.23858 4 7 6.23858 7 9C7 12.3137 9.68629 15 13 15H14.1615L13.5325 18H10.4675L9.83853 15H11C8.79086 15 7 12.3137 7 9C7 6.23858 9.23858 4 12 4Z"></path></svg>);

// --- HELPER HOOK for long press --- //
const useLongPress = (callback: () => void, ms = 300) => {
    const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const onMouseDown = () => { timeout.current = setTimeout(callback, ms); };
    const onMouseUp = () => { if (timeout.current) clearTimeout(timeout.current); };
    const onMouseLeave = () => { if (timeout.current) clearTimeout(timeout.current); };
    return { onMouseDown, onMouseUp, onMouseLeave };
};

// --- BROWSER COMPONENTS --- //

const TopBar: React.FC<{
    onUrlSubmit: (url: string) => void;
    onMenuClick: () => void;
    onServicesClick: () => void;
    settings: Settings;
}> = ({ onUrlSubmit, onMenuClick, onServicesClick, settings }) => {
    const [inputValue, setInputValue] = useState('');
    const backLongPress = useLongPress(() => console.log('Show back history'));
    const forwardLongPress = useLongPress(() => console.log('Show forward history'));
    const refreshLongPress = useLongPress(() => console.log('Force refresh'));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let url = inputValue.trim();
        if (!url) return;

        if (!url.startsWith('http://') && !url.startsWith('https://') && url.includes('.')) {
            url = 'https://' + url;
        } else if (!url.includes('.')) {
            url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
        }
        onUrlSubmit(url);
        setInputValue('');
    };
    
    const protectionColor = settings.vpn.connected ? 'text-cyan-400' :
                           settings.protectionLevel === 'insane' ? 'text-purple-400' :
                           settings.protectionLevel === 'enhanced' ? 'text-green-400' :
                           'text-slate-500';

    return (
        <div className="flex items-center gap-2 p-2 shrink-0">
            <button {...backLongPress} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><BackIcon className="w-5 h-5" /></button>
            <button {...forwardLongPress} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><ForwardIcon className="w-5 h-5" /></button>
            <button {...refreshLongPress} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><RefreshIcon className="w-5 h-5" /></button>
            <form onSubmit={handleSubmit} className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2" title={settings.vpn.connected ? `VPN Connected: ${settings.vpn.server}` : `Protection: ${settings.protectionLevel}`}>
                   <ShieldIcon className={`w-5 h-5 transition-colors ${protectionColor}`} />
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search Google or type a URL"
                    className={`w-full bg-slate-900/50 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 transition border border-transparent focus:border-cyan-400 ${
                        settings.protectionLevel === 'insane' ? 'focus:ring-purple-400/80 ring-2 ring-purple-500/50' : 'focus:ring-cyan-400/80'
                    }`}
                />
            </form>
            <button onClick={onServicesClick} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><GridIcon className="w-5 h-5" /></button>
            <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><MenuIcon className="w-5 h-5" /></button>
        </div>
    );
};

const TabBar: React.FC<{
    tabs: Tab[];
    activeTabId: string;
    onTabClick: (id: string) => void;
    onTabClose: (id:string) => void;
    onNewTab: () => void;
}> = ({ tabs, activeTabId, onTabClick, onTabClose, onNewTab }) => {
    return (
        <div className="flex items-center gap-1 pl-2 shrink-0 h-10">
            {tabs.map(tab => (
                 <div
                    key={tab.id}
                    onClick={() => onTabClick(tab.id)}
                    className={`relative flex items-center gap-2 h-full pl-3 pr-1 rounded-t-lg transition-colors cursor-pointer group ${
                        activeTabId === tab.id
                            ? 'bg-slate-700/50'
                            : 'bg-black/20 hover:bg-white/5'
                    }`}
                    style={{ minWidth: '100px', maxWidth: '200px' }}
                >
                    <div className={`absolute bottom-0 left-0 right-0 h-0.5 transition-colors ${activeTabId === tab.id ? 'bg-cyan-400' : 'bg-transparent'}`}></div>
                    
                    {tab.type === TabType.ImageGenerator && <ImageIcon className="w-4 h-4 text-cyan-300 shrink-0" />}
                    {tab.type === TabType.Chatbot && <ChatIcon className="w-4 h-4 text-purple-300 shrink-0" />}
                    {tab.type === TabType.PrivacySettings && <ShieldIcon className="w-4 h-4 text-green-300 shrink-0" />}
                     {tab.type === TabType.Settings && <SettingsIcon className="w-4 h-4 text-slate-300 shrink-0" />}
                    {tab.type === TabType.WebView && <img src={tab.favicon || `https://www.google.com/s2/favicons?domain=${tab.url}&sz=16`} className="w-4 h-4 shrink-0" alt="favicon" />}
                    
                    <span className="text-sm truncate flex-1">{tab.title}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onTabClose(tab.id); }}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors shrink-0"
                    >
                        <CloseIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
            <button onClick={onNewTab} className="p-2 ml-1 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors"><AddIcon className="w-5 h-5" /></button>
        </div>
    );
};

const ImageGeneratorView: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setImageUrl(null);
        setError(null);
        try {
            const url = await generateImage(prompt);
            setImageUrl(url);
        } catch (err) {
            setError('Failed to generate image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/50 p-4 text-white">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">Image Generator</h1>
                <p className="text-slate-400 mt-1">Powered by Imagen 4</p>
            </div>
            <div className="flex-grow flex items-center justify-center rounded-lg bg-black/20 overflow-hidden">
                {isLoading && (
                    <div className="flex flex-col items-center">
                        <SparklesIcon className="w-16 h-16 text-cyan-400 animate-pulse" />
                        <p className="mt-4 text-lg text-slate-300">Generating your vision...</p>
                    </div>
                )}
                {error && <p className="text-red-400">{error}</p>}
                {imageUrl && <img src={imageUrl} alt="Generated image" className="max-h-full max-w-full object-contain" />}
                {!isLoading && !imageUrl && !error && (
                    <div className="text-center text-slate-500">
                        <ImageIcon className="w-24 h-24 mx-auto mb-4" />
                        <p>Your generated image will appear here.</p>
                    </div>
                )}
            </div>
            <div className="mt-6 flex gap-2">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Describe the image you want to create..."
                    className="flex-1 bg-slate-900/80 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 transition"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <SparklesIcon className="w-5 h-5"/>
                    Generate
                </button>
            </div>
        </div>
    );
};

const ChatbotView: React.FC<{ chatState: ChatState, setChatState: React.Dispatch<React.SetStateAction<ChatState>> }> = ({ chatState, setChatState }) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatState.history]);

    const handleSend = async () => {
        if (!input.trim() || chatState.isLoading) return;
        const userMessage: ChatMessage = { sender: 'user', text: input };
        const loadingMessage: ChatMessage = { sender: 'bot', text: '...', isLoading: true };

        setChatState(prev => ({
            ...prev,
            history: [...prev.history, userMessage, loadingMessage],
            isLoading: true,
        }));
        setInput('');

        const currentChat = chatState.chat;
        if (!currentChat) return;

        const responseText = await sendMessageToChat(currentChat, input);

        setChatState(prev => {
            const newHistory = [...prev.history.slice(0, -1), { sender: 'bot' as const, text: responseText }];
            return {
                ...prev,
                history: newHistory,
                isLoading: false
            }
        });
    };

    return (
        <div className="flex flex-col h-full bg-slate-800/50 p-4 text-white">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                {chatState.history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                           {msg.isLoading ? <div className="animate-pulse">...</div> : <p>{msg.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-4 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-1 bg-slate-900/80 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-400/80 transition"
                    disabled={chatState.isLoading}
                />
                <button
                    onClick={handleSend}
                    disabled={chatState.isLoading}
                    className="bg-purple-500 hover:bg-purple-600 disabled:bg-purple-500/50 disabled:cursor-not-allowed text-white font-bold p-3 rounded-lg transition-colors"
                >
                    <SendIcon className="w-6 h-6"/>
                </button>
            </div>
        </div>
    );
};

const NewTabPage: React.FC<{ onSearch: (query: string) => void }> = ({ onSearch }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const query = formData.get('search') as string;
        if (query.trim()) {
            onSearch(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
        }
    };
    return (
        <div className="flex flex-col h-full items-center justify-center bg-slate-800/50 text-white">
            <h1 className="text-8xl font-thin mb-8">Aura</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-xl">
                 <input
                    type="text"
                    name="search"
                    placeholder="Search Google"
                    className="w-full bg-black/30 rounded-full py-3 px-6 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/80 transition"
                />
            </form>
        </div>
    );
};

const PrivacySettingsView: React.FC<{ settings: Settings, setSettings: React.Dispatch<React.SetStateAction<Settings>> }> = ({ settings, setSettings }) => {
    
    const protectionPresets: Record<ProtectionLevel, Omit<CustomProtectionSettings, 'isCustomized'>> = {
        normal: {
            blockTrackers: true,
            phishingMalwareProtection: true,
            blockFingerprinting: false,
            blockCryptomining: false,
            secureDNS: false,
            preventWebRTCLeaks: false,
            totalCookieProtection: false,
            partitionedStorage: false,
            strongIsolation: false,
        },
        enhanced: {
            blockTrackers: true,
            phishingMalwareProtection: true,
            blockFingerprinting: true,
            blockCryptomining: true,
            secureDNS: true,
            preventWebRTCLeaks: true,
            totalCookieProtection: false,
            partitionedStorage: true,
            strongIsolation: true,
        },
        insane: {
            blockTrackers: true,
            phishingMalwareProtection: true,
            blockFingerprinting: true,
            blockCryptomining: true,
            secureDNS: true,
            preventWebRTCLeaks: true,
            totalCookieProtection: true,
            partitionedStorage: true,
            strongIsolation: true,
        }
    };

    const getSettingValue = (key: keyof Omit<CustomProtectionSettings, 'isCustomized'>) => {
        if (settings.customProtectionSettings.isCustomized && settings.customProtectionSettings[key] !== undefined) {
            return settings.customProtectionSettings[key];
        }
        return protectionPresets[settings.protectionLevel][key];
    };

    const handleToggle = (key: keyof Omit<CustomProtectionSettings, 'isCustomized'>, value: boolean) => {
        setSettings(s => ({
            ...s,
            customProtectionSettings: {
                ...s.customProtectionSettings,
                isCustomized: true,
                [key]: value,
            }
        }));
    };
    
    const SettingToggle: React.FC<{label: string, description: string, settingKey: keyof Omit<CustomProtectionSettings, 'isCustomized'>}> = ({ label, description, settingKey }) => (
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
            <div>
                <h3 className="font-semibold">{label}</h3>
                <p className="text-slate-400 text-sm">{description}</p>
            </div>
            <button onClick={() => handleToggle(settingKey, !getSettingValue(settingKey))} className={`relative w-12 h-6 rounded-full transition-colors ${getSettingValue(settingKey) ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${getSettingValue(settingKey) ? 'transform translate-x-6' : ''}`}></span>
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-slate-800/50 p-6 text-white overflow-y-auto">
            <h1 className="text-3xl font-bold mb-2">Protection Settings</h1>
            <p className="text-slate-400 mb-8">Fine-tune your security and privacy features.</p>

            <div className="bg-slate-700/50 p-4 rounded-lg mb-8">
                <p>Current Mode: <span className="font-bold capitalize">{settings.protectionLevel}</span></p>
                {settings.customProtectionSettings.isCustomized && <p className="text-xs text-amber-300 mt-1">Customised from preset</p>}
                 {settings.protectionLevel === 'insane' && <p className="text-purple-300 mt-2">Warning: Insane mode may cause some websites to function incorrectly.</p>}
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Tracking Protection</h2>
                    <div className="space-y-3">
                       <SettingToggle label="Block Known Trackers" description="Prevents known tracking scripts from loading." settingKey="blockTrackers" />
                       <SettingToggle label="Block Fingerprinting Scripts" description="Protects against browser fingerprinting techniques." settingKey="blockFingerprinting" />
                       <SettingToggle label="Block Crypto-mining Scripts" description="Stops websites from using your computer to mine cryptocurrency." settingKey="blockCryptomining" />
                    </div>
                </div>

                 <div>
                    <h2 className="text-xl font-semibold mb-3">Network & DNS</h2>
                    <div className="space-y-3">
                       <SettingToggle label="Secure DNS (DNS over HTTPS)" description="Encrypts your DNS queries to prevent snooping." settingKey="secureDNS" />
                       <SettingToggle label="Prevent WebRTC IP Leaks" description="Stops WebRTC from revealing your real IP when using a VPN." settingKey="preventWebRTCLeaks" />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-3">Cookies & Storage Hardening</h2>
                    <div className="space-y-3">
                       <SettingToggle label="Total Cookie Protection" description="Isolates cookies to the site where they were created." settingKey="totalCookieProtection" />
                       <SettingToggle label="Partitioned Storage" description="Isolates storage for third-party content." settingKey="partitionedStorage" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-xl font-semibold mb-3">Phishing & Malware Protection</h2>
                    <div className="space-y-3">
                       <SettingToggle label="Phishing & Malware Protection" description="Checks sites against lists of phishing and malware sources." settingKey="phishingMalwareProtection" />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SETTINGS VIEW --- //
const SettingSection: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 pb-2 border-b border-white/10">{title}</h2>
        <div className="space-y-4">{children}</div>
    </div>
);

const SettingRow: React.FC<{ label: string, description?: string, children: React.ReactNode }> = ({ label, description, children }) => (
    <div className="flex items-center justify-between">
        <div>
            <label className="font-semibold">{label}</label>
            {description && <p className="text-slate-400 text-sm mt-1">{description}</p>}
        </div>
        <div className="flex-shrink-0">{children}</div>
    </div>
);

const SettingToggle: React.FC<{ checked: boolean, onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <button onClick={() => onChange(!checked)} className={`relative w-12 h-6 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-slate-600'}`}>
        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'transform translate-x-6' : ''}`}></span>
    </button>
);

const SettingSelect: React.FC<{ value: string, onChange: (value: string) => void, children: React.ReactNode }> = ({ value, onChange, children }) => (
     <select value={value} onChange={e => onChange(e.target.value)} className="bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500">
        {children}
    </select>
);

const SettingTextInput: React.FC<{ value: string, onChange: (value: string) => void, placeholder?: string }> = ({ value, onChange, placeholder }) => (
    <input 
        type="text" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        className="bg-slate-700 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-cyan-500 w-64"
    />
);

const SettingButton: React.FC<{ onClick: () => void, children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
        {children}
    </button>
);

const SettingsView: React.FC<{ settings: Settings, setSettings: React.Dispatch<React.SetStateAction<Settings>> }> = ({ settings, setSettings }) => {
    const [activeCategory, setActiveCategory] = useState('General');

    const categories = [
        'General', 'Tabs & Windows',
        'Performance & System', 'Advanced'
    ];

    const handleNestedChange = <T extends keyof Settings>(
        key: T,
        subkey: keyof Settings[T],
        value: Settings[T][keyof Settings[T]]
    ) => {
        setSettings(s => ({
            ...s,
            [key]: {
                // Fix: Cast s[key] to object to resolve a TypeScript error.
                // This function is only ever called with keys that map to object values in the Settings type,
                // so this assertion is safe.
                ...(s[key] as object),
                [subkey]: value,
            }
        }));
    };
    
    const renderContent = () => {
        switch (activeCategory) {
            case 'General':
                return (
                    <SettingSection title="General">
                        <SettingRow label="Restore previous session">
                            <SettingToggle checked={settings.general.restorePreviousSession} onChange={v => handleNestedChange('general', 'restorePreviousSession', v)} />
                        </SettingRow>
                         <SettingRow label="Open Aura Browser on system startup">
                            <SettingToggle checked={settings.general.launchOnSystemStartup} onChange={v => handleNestedChange('general', 'launchOnSystemStartup', v)} />
                        </SettingRow>
                         <SettingRow label="Always check if Aura Browser is the default browser">
                            <SettingToggle checked={settings.general.checkDefaultBrowser} onChange={v => handleNestedChange('general', 'checkDefaultBrowser', v)} />
                        </SettingRow>
                        <SettingRow label="Set as default browser">
                            <SettingButton onClick={() => alert("Setting as default...")}>Set as default</SettingButton>
                        </SettingRow>
                        <h3 className="text-lg font-bold mt-6 pt-4 border-t border-white/10">Home & Start Page</h3>
                         <SettingRow label="When opening a new window">
                            <SettingSelect value={settings.general.newWindowAction} onChange={v => handleNestedChange('general', 'newWindowAction', v)}>
                                <option value="start">Start Page</option>
                                <option value="blank">Blank Page</option>
                                <option value="custom">Custom URL</option>
                            </SettingSelect>
                        </SettingRow>
                        {settings.general.newWindowAction === 'custom' && (
                            <SettingRow label="Custom URL">
                                <SettingTextInput value={settings.general.homePageUrl} onChange={v => handleNestedChange('general', 'homePageUrl', v)} placeholder="https://..." />
                            </SettingRow>
                        )}
                         <SettingRow label="Show search bar on Start Page">
                            <SettingToggle checked={settings.general.showSearchBarOnStart} onChange={v => handleNestedChange('general', 'showSearchBarOnStart', v)} />
                        </SettingRow>
                         <SettingRow label="Show top sites on Start Page">
                            <SettingToggle checked={settings.general.showTopSitesOnStart} onChange={v => handleNestedChange('general', 'showTopSitesOnStart', v)} />
                        </SettingRow>
                    </SettingSection>
                );
            case 'Tabs & Windows':
                 return (
                    <SettingSection title="Tabs & Windows">
                        <h3 className="text-lg font-bold mb-2">Tabs Behavior</h3>
                         <SettingRow label="Open links in new tab instead of new window">
                            <SettingToggle checked={settings.tabs.openLinksInNewTab} onChange={v => handleNestedChange('tabs', 'openLinksInNewTab', v)} />
                        </SettingRow>
                        <SettingRow label="Switch to new tabs immediately">
                            <SettingToggle checked={settings.tabs.switchToNewTabsImmediately} onChange={v => handleNestedChange('tabs', 'switchToNewTabsImmediately', v)} />
                        </SettingRow>
                        <SettingRow label="Warn when closing multiple tabs">
                            <SettingToggle checked={settings.tabs.warnOnCloseMultipleTabs} onChange={v => handleNestedChange('tabs', 'warnOnCloseMultipleTabs', v)} />
                        </SettingRow>
                        <SettingRow label="Show tab previews on hover">
                            <SettingToggle checked={settings.tabs.showTabPreviews} onChange={v => handleNestedChange('tabs', 'showTabPreviews', v)} />
                        </SettingRow>
                        <SettingRow label="Enable tab groups">
                            <SettingToggle checked={settings.tabs.enableTabGroups} onChange={v => handleNestedChange('tabs', 'enableTabGroups', v)} />
                        </SettingRow>

                        <h3 className="text-lg font-bold mt-6 pt-4 border-t border-white/10">New Tabs Behavior</h3>
                        <SettingRow label="New tab opens with">
                             <SettingSelect value={settings.tabs.newTabAction} onChange={v => handleNestedChange('tabs', 'newTabAction', v)}>
                                <option value="start">Start Page</option>
                                <option value="blank">Blank Page</option>
                                <option value="custom">Custom URL</option>
                            </SettingSelect>
                        </SettingRow>
                         {settings.tabs.newTabAction === 'custom' && (
                            <SettingRow label="Custom URL for new tab">
                                <SettingTextInput value={settings.tabs.newTabCustomUrl} onChange={v => handleNestedChange('tabs', 'newTabCustomUrl', v)} placeholder="https://..." />
                            </SettingRow>
                        )}
                    </SettingSection>
                );
             case 'Performance & System':
                return (
                    <SettingSection title="Performance & System">
                         <SettingRow label="Use recommended performance settings">
                            <SettingToggle checked={settings.performance.useRecommended} onChange={v => handleNestedChange('performance', 'useRecommended', v)} />
                        </SettingRow>
                        {!settings.performance.useRecommended && (
                            <>
                                <SettingRow label="Use hardware acceleration">
                                    <SettingToggle checked={settings.performance.hardwareAcceleration} onChange={v => handleNestedChange('performance', 'hardwareAcceleration', v)} />
                                </SettingRow>
                                <SettingRow label="Suspend inactive tabs">
                                    <SettingToggle checked={settings.performance.suspendInactiveTabs} onChange={v => handleNestedChange('performance', 'suspendInactiveTabs', v)} />
                                </SettingRow>
                                 <SettingRow label="Unload unused tabs automatically">
                                    <SettingToggle checked={settings.performance.unloadUnusedTabs} onChange={v => handleNestedChange('performance', 'unloadUnusedTabs', v)} />
                                </SettingRow>
                            </>
                        )}
                         <h3 className="text-lg font-bold mt-6 pt-4 border-t border-white/10">Networking</h3>
                         <SettingRow label="Enable DNS over HTTPS (DoH)">
                            <SettingToggle checked={settings.performance.enableDoH} onChange={v => handleNestedChange('performance', 'enableDoH', v)} />
                        </SettingRow>
                         {settings.performance.enableDoH && (
                            <SettingRow label="DoH Provider">
                                <SettingSelect value={settings.performance.dohProvider} onChange={v => handleNestedChange('performance', 'dohProvider', v)}>
                                    <option>Cloudflare</option>
                                    <option>Google</option>
                                    <option>Quad9</option>
                                </SettingSelect>
                            </SettingRow>
                        )}
                        <SettingRow label="Enable IPv6">
                            <SettingToggle checked={settings.performance.enableIPv6} onChange={v => handleNestedChange('performance', 'enableIPv6', v)} />
                        </SettingRow>
                    </SettingSection>
                );
            case 'Advanced':
                 return (
                    <SettingSection title="Advanced">
                         <h3 className="text-lg font-bold mb-2">Developer Tools</h3>
                         <SettingRow label="Enable Developer Tools">
                            <SettingToggle checked={settings.advanced.enableDevTools} onChange={v => handleNestedChange('advanced', 'enableDevTools', v)} />
                        </SettingRow>
                        <SettingRow label="Show console errors in overlay">
                            <SettingToggle checked={settings.advanced.showConsoleErrors} onChange={v => handleNestedChange('advanced', 'showConsoleErrors', v)} />
                        </SettingRow>
                         <h3 className="text-lg font-bold mt-6 pt-4 border-t border-white/10">Experimental Features</h3>
                         <SettingRow label="Enable web experiment flags">
                            <SettingToggle checked={settings.advanced.enableWebExperiments} onChange={v => handleNestedChange('advanced', 'enableWebExperiments', v)} />
                        </SettingRow>
                         <h3 className="text-lg font-bold mt-6 pt-4 border-t border-white/10">Reset</h3>
                         <SettingRow label="Restore default settings" description="Resets all settings to their original values.">
                            <SettingButton onClick={() => confirm('Are you sure?') && alert('Settings reset!')}>Restore Defaults</SettingButton>
                        </SettingRow>
                        <SettingRow label="Clear all browser data" description="Deletes history, cookies, cache, and other site data.">
                             <button onClick={() => confirm('This will delete all data. Continue?') && alert('Data cleared!')} className="bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                                Clear Data
                            </button>
                        </SettingRow>
                    </SettingSection>
                );
            default:
                return <p className="text-slate-400">Settings for {activeCategory} will be implemented here.</p>;
        }
    };

    return (
        <div className="flex h-full bg-slate-800/50 text-white">
            <div className="w-64 shrink-0 bg-black/20 p-4 space-y-1">
                <h1 className="text-xl font-bold px-2 pb-4">Settings</h1>
                {categories.map(cat => (
                    <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded-md transition-colors text-sm ${activeCategory === cat ? 'bg-cyan-500/80' : 'hover:bg-white/10'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="flex-grow p-8 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    );
};


const ContentArea: React.FC<{ 
    tabs: Tab[], 
    activeTabId: string, 
    chatState: ChatState, 
    setChatState: React.Dispatch<React.SetStateAction<ChatState>>,
    onUrlSubmit: (url: string) => void,
    settings: Settings,
    setSettings: React.Dispatch<React.SetStateAction<Settings>>,
    iframeRefs: React.MutableRefObject<{[key: string]: HTMLIFrameElement | null}>
}> = ({ tabs, activeTabId, chatState, setChatState, onUrlSubmit, settings, setSettings, iframeRefs }) => {

    const renderTabContent = (tab: Tab) => {
         switch (tab.type) {
            case TabType.WebView:
                if (tab.url === 'aura://new-tab') {
                    return <NewTabPage onSearch={onUrlSubmit} />;
                }
                return <iframe 
                    src={tab.url} 
                    className="w-full h-full border-none" 
                    title={tab.title} 
                    ref={el => { iframeRefs.current[tab.id] = el; }}
                />;
            case TabType.ImageGenerator:
                return <ImageGeneratorView />;
            case TabType.Chatbot:
                return <ChatbotView chatState={chatState} setChatState={setChatState} />;
            case TabType.PrivacySettings:
                return <PrivacySettingsView settings={settings} setSettings={setSettings} />;
            case TabType.Settings:
                return <SettingsView settings={settings} setSettings={setSettings} />;
            default:
                return <div className="flex-grow bg-slate-800/50" />;
        }
    };
    
    return (
        <div className="w-full h-full">
            {tabs.map(tab => (
                 <div
                    key={tab.id}
                    className="w-full h-full"
                    style={{ display: tab.id === activeTabId ? 'block' : 'none' }}
                >
                    {renderTabContent(tab)} 
                </div>
            ))}
        </div>
    );
};

const MainMenu: React.FC<{
    settings: Settings, 
    setSettings: React.Dispatch<React.SetStateAction<Settings>>,
    onOpenPrivacySettings: () => void,
    onOpenSettings: () => void,
}> = ({ settings, setSettings, onOpenPrivacySettings, onOpenSettings }) => {
    
    const handleProtectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const level = parseInt(e.target.value, 10);
        let newLevel: ProtectionLevel = 'normal';
        if (level === 1) newLevel = 'enhanced';
        if (level === 2) newLevel = 'insane';
        setSettings(s => ({ ...s, protectionLevel: newLevel, customProtectionSettings: { isCustomized: false } }));
    };

    const handleVpnToggle = () => {
        const currentlyEnabled = settings.vpn.enabled;
        if (currentlyEnabled) {
            setSettings(s => ({ ...s, vpn: { ...s.vpn, enabled: false, connected: false, connecting: false } }));
        } else {
            // Simulate connection
            setSettings(s => ({ ...s, vpn: { ...s.vpn, enabled: true, connecting: true, server: 'Best Server' } }));
            setTimeout(() => {
                setSettings(s => {
                    if (s.vpn.enabled) { // check if it wasn't disabled during the timeout
                       return { ...s, vpn: { ...s.vpn, connected: true, connecting: false } };
                    }
                    return s;
                });
            }, 1500);
        }
    };
    
    const protectionLevels: ProtectionLevel[] = ['normal', 'enhanced', 'insane'];
    const protectionValue = protectionLevels.indexOf(settings.protectionLevel);

    return (
        <div className="absolute top-14 right-4 bg-slate-800/80 backdrop-blur-lg rounded-lg shadow-2xl border border-white/10 w-72 py-2 z-50 text-sm">
           <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors">
                <HistoryIcon className="w-5 h-5 text-slate-300"/>
                <span>History</span>
           </a>
           <a href="#" className="flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors">
                <DownloadIcon className="w-5 h-5 text-slate-300"/>
                <span>Downloads</span>
           </a>
            <button onClick={onOpenSettings} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors">
                <SettingsIcon className="w-5 h-5 text-slate-300"/>
                <span>Settings</span>
           </button>
           <div className="h-px bg-white/10 my-2"></div>
           
           <div className="px-4 py-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <VpnIcon className="w-5 h-5 text-slate-300"/>
                        <span>VPN</span>
                    </div>
                    <button onClick={handleVpnToggle} className={`relative w-12 h-6 rounded-full transition-colors ${settings.vpn.enabled ? 'bg-cyan-500' : 'bg-slate-600'}`}>
                        <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.vpn.enabled ? 'transform translate-x-6' : ''}`}></span>
                    </button>
                </div>
                {settings.vpn.enabled && <div className="text-xs text-slate-400 mt-1 pl-8">{settings.vpn.connecting ? 'Connecting...' : `Connected to ${settings.vpn.server}`}</div>}
           </div>

           <div className="px-4 py-2 mt-2">
                <div className="flex items-center gap-3 mb-2">
                    <ShieldIcon className="w-5 h-5 text-slate-300"/>
                    <span>Protection Mode: <span className="font-semibold capitalize">{settings.protectionLevel}</span></span>
                </div>
                <input 
                    type="range" 
                    min="0" 
                    max="2" 
                    step="1"
                    value={protectionValue}
                    onChange={handleProtectionChange}
                    className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer range-lg"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Normal</span>
                    <span>Enhanced</span>
                    <span>Insane</span>
                </div>
           </div>

           <div className="h-px bg-white/10 my-2"></div>
           <button onClick={onOpenPrivacySettings} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-white/10 transition-colors">
                <SettingsIcon className="w-5 h-5 text-slate-300"/>
                <span>Protection Settings</span>
           </button>
        </div>
    );
};

const GoogleServicesPanel: React.FC<{ onServiceClick: (url: string, title: string) => void }> = ({ onServiceClick }) => {
    const services = [
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Drive', url: 'https://drive.google.com' },
        { name: 'Calendar', url: 'https://calendar.google.com' },
        { name: 'Docs', url: 'https://docs.google.com' },
        { name: 'Sheets', url: 'https://sheets.google.com' },
        { name: 'Photos', url: 'https://photos.google.com' },
    ];
    return (
        <div className="absolute top-14 right-16 bg-slate-800/80 backdrop-blur-lg rounded-lg shadow-2xl border border-white/10 w-60 p-2 z-50">
            <div className="grid grid-cols-3 gap-2">
                {services.map(service => (
                    <button key={service.name} onClick={() => onServiceClick(service.url, service.name)} className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 aspect-square">
                        <img src={`https://www.google.com/s2/favicons?domain=${service.url}&sz=32`} alt={`${service.name} favicon`} className="w-8 h-8"/>
                        <span className="text-xs mt-1">{service.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

// --- MAIN APP --- //
export default function App() {
    const CHAT_HISTORY_KEY = 'aura_chat_history';
    
    const [tabs, setTabs] = useState<Tab[]>([
        { id: '1', type: TabType.WebView, title: 'New Tab', url: 'aura://new-tab' },
        { id: '2', type: TabType.ImageGenerator, title: 'Image Generator' },
        { id: '3', type: TabType.Chatbot, title: 'Aura Chatbot' },
    ]);
    const [activeTabId, setActiveTabId] = useState<string>('1');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isServicesPanelOpen, setIsServicesPanelOpen] = useState(false);
    const iframeRefs = useRef<{[key: string]: HTMLIFrameElement | null}>({});

    const [chatState, setChatState] = useState<ChatState>({
        chat: null,
        history: [],
        isLoading: false
    });
    
    useEffect(() => {
        const savedHistory = localStorage.getItem(CHAT_HISTORY_KEY);
        const initialHistory = savedHistory
            ? JSON.parse(savedHistory)
            : [{ sender: 'bot' as const, text: "Hello! I'm Aura Assistant. How can I help you today?" }];

        const chat = createChatSession();
        setChatState({
            chat,
            history: initialHistory,
            isLoading: false
        });
    }, []);

    useEffect(() => {
        if (chatState.history.length > 1) {
            localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(chatState.history));
        }
    }, [chatState.history]);

    const [settings, setSettings] = useState<Settings>({
        general: {
            restorePreviousSession: true,
            launchOnSystemStartup: false,
            checkDefaultBrowser: true,
            homePageUrl: 'https://www.google.com',
            newWindowAction: 'start',
            showSearchBarOnStart: true,
            showTopSitesOnStart: true,
            interfaceLanguage: 'en-US',
            useSystemFonts: true,
            defaultFont: 'Arial',
            defaultFontSize: 16,
            pageZoom: 100,
        },
        tabs: {
            openLinksInNewTab: true,
            switchToNewTabsImmediately: true,
            warnOnCloseMultipleTabs: true,
            showTabPreviews: false,
            enableTabGroups: true,
            newTabAction: 'start',
            newTabCustomUrl: '',
            openExternalLinksInNewWindow: false,
            allowPopupsForTrusted: true,
        },
        startPage: {
            elements: {
                searchBar: true,
                topSites: true,
                suggestedContent: true,
                recentHistory: false,
                weatherWidget: false,
                aiQuickActions: true,
            },
            customUrl: '',
            showBackgroundImage: true,
            useDynamicBackgrounds: true,
            backgroundTransparency: 85,
        },
        search: {
            defaultEngine: 'google',
            customEngines: [],
            suggestions: {
                search: true,
                history: true,
                bookmarks: true,
                openTabs: true,
                trending: false,
            },
            addressBar: {
                isSearchBar: true,
                showProviderIcons: true,
                preloadSuggestions: true,
                showActionButtons: true,
            },
        },
        downloads: {
            location: '~/Downloads',
            alwaysAsk: false,
            showPanel: true,
            keepPrivateHistory: false,
            autoOpenKnownTypes: false,
        },
        media: {
            smoothScrolling: true,
            autoScrollOnMiddleClick: true,
            autoplay: 'block-audio',
            hardwareAcceleration: true,
            enableWebGl: true,
            enableAv1: true,
            highlightLinks: false,
            showTouchKeyboard: true,
        },
        privacy: {
            cookiePolicy: 'block-third-party',
            doNotTrack: true,
            blockFingerprinting: true,
            blockSocialTracking: true,
            rememberHistory: true,
            saveFormAutofill: true,
            savePasswords: true,
        },
        permissions: {
            location: 'ask', camera: 'ask', microphone: 'ask', notifications: 'ask',
            clipboard: 'ask', popups: 'block', autoplay: 'ask', midi: 'ask', usb: 'ask',
            bluetooth: 'ask', backgroundSync: 'ask',
        },
        performance: {
            useRecommended: true,
            hardwareAcceleration: true,
            contentProcessLimit: 4,
            suspendInactiveTabs: true,
            suspendTimeout: 15,
            unloadUnusedTabs: true,
            enableDoH: true,
            dohProvider: 'Cloudflare',
            enableIPv6: true,
        },
        advanced: {
            enableDevTools: false,
            showConsoleErrors: false,
            enableWebExperiments: false,
        },
        protectionLevel: 'normal',
        customProtectionSettings: { isCustomized: false },
        vpn: { enabled: false, connected: false, server: 'Best Server', connecting: false }
    });
    
    const handleNewTab = (type: TabType = TabType.WebView, title: string = 'New Tab', url: string = 'aura://new-tab') => {
        const newTab: Tab = { id: Date.now().toString(), type, title, url };
        setTabs([...tabs, newTab]);
        setActiveTabId(newTab.id);
        setIsMenuOpen(false);
        setIsServicesPanelOpen(false);
    };

    const handleCloseTab = (id: string) => {
      const tabIndex = tabs.findIndex(t => t.id === id);
      const newTabs = tabs.filter(t => t.id !== id);
      
      if (newTabs.length === 0) {
          const newTab: Tab = { id: Date.now().toString(), type: TabType.WebView, title: 'New Tab', url: 'aura://new-tab' };
          setTabs([newTab]);
          setActiveTabId(newTab.id);
          return;
      }
      
      if (activeTabId === id) {
          const newActiveIndex = Math.max(0, tabIndex - 1);
          setActiveTabId(newTabs[newActiveIndex].id);
      }
      setTabs(newTabs);
    };
    
    const handleUrlSubmit = (url: string) => {
      setTabs(tabs.map(tab => {
        if (tab.id === activeTabId) {
          let title = 'Loading...';
          try {
            const urlObject = new URL(url);
            title = urlObject.hostname.replace('www.', '');
          } catch (_) {
            title = 'Search';
          }
          return { ...tab, url, title, type: TabType.WebView, favicon: undefined };
        }
        return tab;
      }));
    };

    const handleServiceClick = (url: string, title: string) => {
        handleNewTab(TabType.WebView, title, url);
        setIsServicesPanelOpen(false);
    }
    
    const handleOpenPrivacySettings = () => {
        handleNewTab(TabType.PrivacySettings, 'Protection Settings');
    };
    
    const handleOpenSettings = () => {
        handleNewTab(TabType.Settings, 'Settings');
    };

    const backgroundStyle: React.CSSProperties = {
        backgroundColor: `rgba(2, 6, 23, 0.85)`,
        backdropFilter: `blur(24px)`,
    };

    return (
        <div className="h-screen w-screen p-4 text-white font-sans flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `url(https://source.unsplash.com/random/1920x1080/?nature,water)` }}>
            <div 
                className="w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10"
                style={backgroundStyle}
            >
                <TopBar 
                    onUrlSubmit={handleUrlSubmit} 
                    onMenuClick={() => { setIsMenuOpen(o => !o); setIsServicesPanelOpen(false); }}
                    onServicesClick={() => { setIsServicesPanelOpen(o => !o); setIsMenuOpen(false); }}
                    settings={settings}
                />
                <TabBar 
                  tabs={tabs} 
                  activeTabId={activeTabId} 
                  onTabClick={setActiveTabId} 
                  onTabClose={handleCloseTab} 
                  onNewTab={() => handleNewTab()}
                />
                
                {isMenuOpen && <MainMenu 
                    settings={settings} 
                    setSettings={setSettings} 
                    onOpenPrivacySettings={handleOpenPrivacySettings} 
                    onOpenSettings={handleOpenSettings}
                />}
                {isServicesPanelOpen && <GoogleServicesPanel onServiceClick={handleServiceClick} />}

                <main className="flex-grow bg-black/30 overflow-hidden relative" onClick={() => { setIsMenuOpen(false); setIsServicesPanelOpen(false); }}>
                    <ContentArea 
                        tabs={tabs} 
                        activeTabId={activeTabId} 
                        chatState={chatState} 
                        setChatState={setChatState} 
                        onUrlSubmit={handleUrlSubmit}
                        settings={settings}
                        setSettings={setSettings}
                        iframeRefs={iframeRefs}
                    />
                </main>
            </div>
        </div>
    );
}
