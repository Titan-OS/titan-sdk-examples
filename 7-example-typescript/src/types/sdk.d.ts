export declare interface AccessibilityReaderConfig {
    enabled: boolean;
    verbosity: 'concise' | 'standard' | 'detailed';
    tvOptimized: boolean;
    liveRegions: boolean;
    focusTracking: boolean;
}

declare interface DeviceCapabilities {
    os: string;
    browserEngine: string;
    hasStorage: boolean;
    support3d: string | boolean;
    supportUHD: string | boolean;
    supportHDR: string | boolean;
    supportHDR_HDR10?: string | boolean;
    supportHDR_DV?: string | boolean;
    supportWebSocket: boolean;
    supportPlayready: boolean | 'unknown';
    supportWidevineModular: boolean | 'unknown';
    supportAppleHLS: string | boolean;
    supportMSSmoothStreaming: string | boolean;
    supportMSSInitiator: string | boolean;
    supportMPEG_DASH: boolean | 'unknown';
    drmMethod: string;
    supportOIPF: boolean;
    supportEME: boolean;
    supportKeyNumeric?: string | boolean;
    supportKeyColor?: string | boolean;
    supportMultiscreen?: string | boolean;
    supportFHD?: string | boolean;
    supportMultiAudio?: string | boolean;
    supportTTMLInband?: string | boolean;
    supportTTMLOutofband?: string | boolean;
    supportFairplay?: string | boolean;
    supportAdobeHDS?: string | boolean;
    supportPrimetime?: string | boolean;
    supportClearKey?: string | boolean;
    supportWidevineClassic?: string | boolean;
    supportDolbyAtmos?: string | boolean;
}

export declare interface DeviceInfo {
    Channel: {
        appStore: string;
        vendor: string;
        brand: string;
    };
    Product: {
        platform: string;
        year: string;
        deviceID: string;
        firmwareVersion: string;
        firmwareComponentID: string;
        profileid?: string;
        mac?: string;
        ufversion?: string;
        country?: string;
        language?: string;
        WhaleAdID?: string;
        ifa?: string;
        ifaType?: string;
    };
    Capability: DeviceCapabilities;
}

export declare interface PublicAccessibilitySettings {
    getTTSSettings(): Promise<PublicTTSSettings>;
    getTMSettings(): Promise<PublicTTSSettings>;
    isTTSSupported(): Promise<boolean>;
    isTextMagnificationSupported(): Promise<boolean>;
    isTTSEnabled(): Promise<boolean>;
    isTMEnabled(): Promise<boolean>;
    startSpeaking(text: string | string[]): Promise<boolean>;
    stopSpeaking(): Promise<boolean>;
    enableReader(config: AccessibilityReaderConfig): Promise<boolean>;
    disableReader(): Promise<boolean>;
    onTTSSettingsChange(callback: (data: PublicTTSSettings) => void): () => void;
    onTMSettingsChange(callback: (data: PublicTTSSettings) => void): () => void;
}

export declare interface PublicTMSettings {
    enabled: boolean;
    scale?: number;
}

export declare interface PublicTTSSettings {
    enabled: boolean;
    rate?: number;
    volume?: number;
    pitch?: number;
}

export declare interface TitanSDK {
    VERSION: string;
    isReady: Promise<boolean>;
    deviceInfo: {
        getDeviceInfo(): Promise<DeviceInfo>;
    };
    accessibility: PublicAccessibilitySettings;
    apps: {
        launch(appId: string, deepLink?: string): Promise<boolean>;
    };
}

export { }
