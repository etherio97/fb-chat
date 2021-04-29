export default class User {
    psid: string;
    firstName: string;
    lastName: string;
    locale: string | null;
    gender: string | null;
    mode: null | "delete";
    headlines: string[];
    reports: string[];
    last_report: number | null;
    constructor(psid: string);
    setProfile(profile: any): void;
    get name(): string;
}
//# sourceMappingURL=User.d.ts.map