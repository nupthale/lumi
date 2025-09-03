interface ClientAPI {
  selectDirectory(): Promise<string | null>;
  saveSetting(data: { key: string; value: any }): Promise<void>;
  getSetting(key: string): Promise<any>;
}

interface ElectronAPI {
  ipcRenderer: {
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, func: (...args: any[]) => void): void;
    once(channel: string, func: (...args: any[]) => void): void;
  };
}

declare global {
  interface Window {
    clientAPI?: ClientAPI;
    isElectron?: boolean;
    electron?: ElectronAPI;
    __machineId__?: string;
    __appMode__?: string;
  }
}

export {}; 