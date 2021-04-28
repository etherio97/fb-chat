export default class User {
    psid: string;
    firstName: string;
    lastName: string;
    locale: string;
    timezone: string;
    gender: string | null;
    headlines: string[];
    constructor(psid: string);
    setProfile(profile: any): void;
}
//# sourceMappingURL=User.d.ts.map