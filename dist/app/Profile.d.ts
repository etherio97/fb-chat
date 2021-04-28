export default class Profile {
    setWebhook(): void;
    setPageFeedWebhook(): void;
    setThread(): void;
    setGetStarted(): void;
    setGreeting(): void;
    setPersistentMenu(): void;
    setWhitelistedDomains(): void;
    getGetStarted(): {
        get_started: {
            payload: string;
        };
    };
    getGreeting(): {
        greeting: {
            locale: string;
            text: string;
        }[];
    };
    getPersistentMenu(): {
        persistent_menu: {
            locale: string;
            composer_input_disabled: boolean;
            call_to_actions: ({
                type: string;
                title: string;
                payload: string;
                url?: undefined;
                webview_height_ratio?: undefined;
            } | {
                type: string;
                title: string;
                url: string;
                webview_height_ratio: string;
                payload?: undefined;
            })[];
        }[];
    };
    getGreetingText(): {
        locale: string;
        text: string;
    };
    getMenuItems(): {
        locale: string;
        composer_input_disabled: boolean;
        call_to_actions: ({
            type: string;
            title: string;
            payload: string;
            url?: undefined;
            webview_height_ratio?: undefined;
        } | {
            type: string;
            title: string;
            url: string;
            webview_height_ratio: string;
            payload?: undefined;
        })[];
    };
    getWhitelistedDomains(): {
        whitelisted_domains: string[];
    };
}
//# sourceMappingURL=Profile.d.ts.map