export default class Report {
    static send(phone: string, message: string): Promise<{
        id: any;
        post_id: any;
    }>;
    static remove(id: string | number, token: string | number): Promise<any>;
}
//# sourceMappingURL=Report.d.ts.map