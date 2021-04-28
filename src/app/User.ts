export default class User {
  public firstName: string;
  public lastName: string;
  public locale: string;
  public timezone: string;
  public gender: string | null;
  public headlines: string[];

  constructor(public psid: string) {
    this.firstName = "";
    this.lastName = "";
    this.locale = "";
    this.timezone = "";
    this.gender = undefined;
    this.headlines = [];
  }

  setProfile(profile) {
    this.firstName = profile.firstName;
    this.lastName = profile.lastName;
    this.locale = profile.locale;
    this.timezone = profile.timezone;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }
}
