export default class User {
  public name: string;
  public firstName: string;
  public lastName: string;
  public locale: string | null;
  public gender: string | null;
  public mode: null | "delete";
  public headlines: string[];
  public reports: string[];
  public last_report: number | null;

  constructor(public psid: string) {
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.locale = null;
    this.gender = null;
    this.last_report = null;
    this.headlines = [];
    this.reports = [];
  }

  setProfile(profile) {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.name = profile.name;
    this.locale = profile.locale;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }
}
