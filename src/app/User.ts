type Mode = "delete" | "agent" | "default";

export default class User {
  public name: string;
  public firstName: string;
  public lastName: string;
  public profileURL: string;
  public locale?: string;
  public gender?: string;
  public mode: Mode;
  public headlines: string[];
  public reports: string[];
  public talk_to_agent?: number;
  public last_report?: number;
  public store: object;

  constructor(public psid: string) {
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.profileURL = "";
    this.mode = "default";
    this.headlines = [];
    this.reports = [];
    this.store = {};
  }

  setProfile(profile) {
    this.firstName = profile.first_name || "";
    this.lastName = profile.last_name || "";
    this.profileURL = profile.profile_pic || "";
    this.name = profile.name || "";
    this.locale = profile.locale;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }
}
