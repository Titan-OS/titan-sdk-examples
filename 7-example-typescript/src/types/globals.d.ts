import { TitanSDK } from './sdk.d.ts';

declare global {
  interface Window {
    TitanSDK: TitanSDK;
  }
}