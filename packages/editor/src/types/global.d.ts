declare global {
  interface window {
    isElectron: boolean;
    clientAPI: any;
  }
  var isElectron: boolean;
  var clientAPI: any;
  var __appMode__: string;
}

export {};