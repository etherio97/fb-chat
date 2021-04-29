import User from "./User";
export default class Response {
    static genQuickReply(text: any, quickReplies: any): {
        text: any;
        quick_replies: any[];
    };
    static genGenericTemplate(image_url: any, title: any, subtitle: any, buttons: any): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: {
                    title: any;
                    subtitle: any;
                    image_url: any;
                    buttons: any;
                }[];
            };
        };
    };
    static genImageTemplate(image_url: any, title: any, subtitle?: string): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                elements: {
                    title: any;
                    subtitle: string;
                    image_url: any;
                }[];
            };
        };
    };
    static genButtonTemplate(title: any, buttons: any): {
        attachment: {
            type: string;
            payload: {
                template_type: string;
                text: any;
                buttons: any;
            };
        };
    };
    static genText(text: any): {
        text: any;
    };
    static genTextWithPersona(text: any, persona_id: any): {
        text: any;
        persona_id: any;
    };
    static genPostbackButton(title: any, payload: any): {
        type: string;
        title: any;
        payload: any;
    };
    static genWebUrlButton(title: any, url: any): {
        type: string;
        title: any;
        url: any;
        messenger_extensions: boolean;
    };
    static genNuxMessage(user: User): {
        text: any;
    }[];
}
//# sourceMappingURL=Response.d.ts.map