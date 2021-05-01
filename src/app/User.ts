type Mode = "delete" | "agent" | "default";

export default class User {
  public name: string;
  public firstName: string;
  public lastName: string;
  public locale?: string;
  public gender?: string;
  public mode: Mode;
  public headlines: string[];
  public reports: string[];
  public talk_to_agent?: number;
  public last_report?: number;

  constructor(public psid: string) {
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.mode = "default";
    this.headlines = [];
    this.reports = [];
  }

  setProfile(profile) {
    this.firstName = profile.firstName || "";
    this.lastName = profile.lastName || "";
    this.name = profile.name || "";
    this.locale = profile.locale;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }
}
