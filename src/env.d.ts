/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AGENT_WORKER?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_GA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Extend Window for custom env object
interface Window {
  env?: {
    REACT_APP_AGENT_WORKER?: string;
    REACT_APP_GOOGLE_CLIENT_ID?: string;
    VITE_AGENT_WORKER?: string;
    VITE_GOOGLE_CLIENT_ID?: string;
  };
  google?: {
    accounts: {
      id: {
        initialize: (config: any) => void;
        prompt: () => void;
        renderButton: (element: HTMLElement, config: any) => void;
        disableAutoSelect: () => void;
      };
    };
  };
}

// Create React App environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_AGENT_WORKER?: string;
    REACT_APP_GOOGLE_CLIENT_ID?: string;
    REACT_APP_GA_ID?: string;
  }
}
