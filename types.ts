import type { Chat } from "@google/genai";

export enum TabType {
  WebView = 'WEB_VIEW',
  ImageGenerator = 'IMAGE_GENERATOR',
  Chatbot = 'CHATBOT',
  PrivacySettings = 'PRIVACY_SETTINGS',
  Settings = 'SETTINGS',
}

export interface Tab {
  id: string;
  type: TabType;
  title: string;
  url?: string;
  favicon?: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  isLoading?: boolean;
}

export type ProtectionLevel = 'normal' | 'enhanced' | 'insane';

export interface VpnState {
    enabled: boolean;
    connected: boolean;
    server: string;
    connecting: boolean;
}

export interface CustomProtectionSettings {
  isCustomized: boolean;
  blockTrackers?: boolean;
  blockFingerprinting?: boolean;
  blockCryptomining?: boolean;
  secureDNS?: boolean;
  preventWebRTCLeaks?: boolean;
  totalCookieProtection?: boolean;
  partitionedStorage?: boolean;
  strongIsolation?: boolean;
  phishingMalwareProtection?: boolean;
}

export interface SearchEngine {
  id: string;
  name: string;
  keyword: string;
  urlTemplate: string;
}

export interface Settings {
  // General
  general: {
    restorePreviousSession: boolean;
    launchOnSystemStartup: boolean;
    checkDefaultBrowser: boolean;
    homePageUrl: string;
    newWindowAction: 'start' | 'blank' | 'custom';
    showSearchBarOnStart: boolean;
    showTopSitesOnStart: boolean;
    interfaceLanguage: string;
    useSystemFonts: boolean;
    defaultFont: string;
    defaultFontSize: number;
    pageZoom: number;
  };

  // Tabs & Windows
  tabs: {
    openLinksInNewTab: boolean;
    switchToNewTabsImmediately: boolean;
    warnOnCloseMultipleTabs: boolean;
    showTabPreviews: boolean;
    enableTabGroups: boolean;
    newTabAction: 'start' | 'blank' | 'custom';
    newTabCustomUrl: string;
    openExternalLinksInNewWindow: boolean;
    allowPopupsForTrusted: boolean;
  };
  
  // Start Page & New Tab
  startPage: {
      elements: {
          searchBar: boolean;
          topSites: boolean;
          suggestedContent: boolean;
          recentHistory: boolean;
          weatherWidget: boolean;
          aiQuickActions: boolean;
      };
      customUrl: string;
      showBackgroundImage: boolean;
      useDynamicBackgrounds: boolean;
      backgroundTransparency: number;
  };

  // Search & Address Bar
  search: {
      defaultEngine: string;
      customEngines: SearchEngine[];
      suggestions: {
          search: boolean;
          history: boolean;
          bookmarks: boolean;
          openTabs: boolean;
          trending: boolean;
      };
      addressBar: {
          isSearchBar: boolean;
          showProviderIcons: boolean;
          preloadSuggestions: boolean;
          showActionButtons: boolean;
      };
  };

  // Downloads & Files
  downloads: {
    location: string;
    alwaysAsk: boolean;
    showPanel: boolean;
    keepPrivateHistory: boolean;
    autoOpenKnownTypes: boolean;
  };
  
  // Content & Media
  media: {
    smoothScrolling: boolean;
    autoScrollOnMiddleClick: boolean;
    autoplay: 'allow' | 'block' | 'block-audio';
    hardwareAcceleration: boolean;
    enableWebGl: boolean;
    enableAv1: boolean;
    highlightLinks: boolean;
    showTouchKeyboard: boolean;
  };

  // Privacy & Cookies
  privacy: {
    cookiePolicy: 'allow' | 'block-third-party' | 'block-all';
    doNotTrack: boolean;
    blockFingerprinting: boolean;
    blockSocialTracking: boolean;
    rememberHistory: boolean;
    saveFormAutofill: boolean;
    savePasswords: boolean;
  };

  // Site Permissions (global defaults)
  permissions: {
    location: 'ask' | 'allow' | 'block';
    camera: 'ask' | 'allow' | 'block';
    microphone: 'ask' | 'allow' | 'block';
    notifications: 'ask' | 'allow' | 'block';
    clipboard: 'ask' | 'allow' | 'block';
    popups: 'ask' | 'allow' | 'block';
    autoplay: 'ask' | 'allow' | 'block';
    midi: 'ask' | 'allow' | 'block';
    usb: 'ask' | 'allow' | 'block';
    bluetooth: 'ask' | 'allow' | 'block';
    backgroundSync: 'ask' | 'allow' | 'block';
  };

  // Performance & System
  performance: {
      useRecommended: boolean;
      hardwareAcceleration: boolean;
      contentProcessLimit: number;
      suspendInactiveTabs: boolean;
      suspendTimeout: number; // in minutes
      unloadUnusedTabs: boolean;
      enableDoH: boolean;
      dohProvider: string;
      enableIPv6: boolean;
  };
  
  // Advanced
  advanced: {
      enableDevTools: boolean;
      showConsoleErrors: boolean;
      enableWebExperiments: boolean;
  };

  // --- Existing --- //
  protectionLevel: ProtectionLevel;
  customProtectionSettings: CustomProtectionSettings;
  vpn: VpnState;
}

export interface ChatState {
  chat: Chat | null;
  history: ChatMessage[];
  isLoading: boolean;
}