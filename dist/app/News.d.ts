import User from "./User";
export default class News {
    user: User | null;
    webhookEvent: any;
    constructor(user: User | null, webhookEvent?: any);
    update(): Promise<any>;
    updateHeadlines(): Promise<unknown[]>;
    updateArticles(): Promise<any>;
    fetchAll(): Promise<unknown>;
    handleNews(): any;
    handlePayload(payload: any): any;
    handleDelete(): any[];
}
//# sourceMappingURL=News.d.ts.map