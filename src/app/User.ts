import { User as UserModel } from "../models/User";

type Mode = "delete" | "agent" | "default";

export default class User {
  public name: string;
  public firstName: string;
  public lastName: string;
  public profileURL: string;
  public gender?: string;
  public mode: Mode;
  public persona_id?: string;
  public headlines: string[];
  public reports: string[];
  public talk_to_agent?: number;
  public last_report?: number;
  public store: object;
  public credit_score: number;
  public role: string;
  public existing: Boolean;

  constructor(public psid: string) {
    this.name = "";
    this.firstName = "";
    this.lastName = "";
    this.profileURL = "";
    this.role = "user";
    this.mode = "default";
    this.credit_score = 80;
    this.headlines = [];
    this.reports = [];
    this.store = {};
  }

  setProfile(profile) {
    this.firstName = profile.first_name || "";
    this.lastName = profile.last_name || "";
    this.profileURL = profile.profile_pic || "";
    this.name = profile.name || `${profile.first_name} ${profile.last_name}`;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }

  setProperties(props) {
    this.mode = props.mode;
    this.store = props.store || {};
    this.reports = props.reports || [];
    this.headlines = props.headlines || [];
    this.talk_to_agent = props.talk_to_agent;
    this.last_report = props.last_report;
  }

  static find(user: User) {
    return UserModel.findOne(user).then((data) => {
      if (data) {
        user.setProfile(data);
        user.role = data["role"];
        user.credit_score = data["credit_score"];
        user.existing = true;
      }
      return user;
    });
  }

  toJSON() {
    let response = {
      psid: this.psid,
      first_name: this.firstName,
      last_name: this.lastName,
      gender: this.gender,
      persona_id: this.persona_id,
      role: this.role,
      credit_score: this.credit_score,
    };
    return response;
  }

  save() {
    let psid = this.psid;
    let data = this.toJSON();
    if (this.existing) {
      return UserModel.findOneAndUpdate({ psid }, data);
    }
    return UserModel.create({ psid, ...data });
  }
}
