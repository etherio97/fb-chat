import User from "./User";
export default class Receive {
    user: User | null;
    webhookEvent: any;
    constructor(user: User | null, webhookEvent?: any);
    handleMessage(): void;
    handleTextMessage(): any;
    handleAttachmentMessage(): any;
    handleQuickReply(): any;
    handlePostback(): any;
    handleReferral(): any;
    handlePayload(payload: any): any;
    handlePrivateReply(type: any, object_id: any): void;
    sendMessage(response: any, delay?: number): void;
    firstEntity(nlp: any, name: any): any;
}
//# sourceMappingURL=Receive.d.ts.map