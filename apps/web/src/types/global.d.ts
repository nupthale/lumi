declare global {
  interface window {
    isElectron: boolean;
    isWindows: boolean;
    clientAPI: any;
  }
  var isElectron: boolean;
  var isWindows: boolean;
  var clientAPI: any;
}

export {};