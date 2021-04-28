export default class GraphAPI {
    static callSendAPI(requestBody: any): void;
    static callMessengerProfileAPI(requestBody: any): void;
    static callSubscriptionsAPI(customFields: any): void;
    static callSubscribedApps(customFields: any): void;
    static getUserProfile(senderPsid: any): Promise<any[]>;
    static callUserProfileAPI(psid: any): Promise<any[]>;
    static getPersonaAPI(): Promise<any[]>;
    static postPersonaAPI(name: string, profile_picture_url: string): Promise<any>;
    static callNLPConfigsAPI(): void;
    static callFBAEventsAPI(senderPsid: any, eventName: any): void;
}
//# sourceMappingURL=GraphAPI.d.ts.map