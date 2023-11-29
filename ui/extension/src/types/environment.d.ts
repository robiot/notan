declare global {
  namespace NodeJS {
    interface ProcessEnvironment {
      __DEV__: string;
      __FIREFOX__: string;
    }
  }
}

export {};
