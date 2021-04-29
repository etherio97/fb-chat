const BURMESE_NAMING = {
  arkar: "အာကာ",
  aung: "အောင်",
  aye: "အေး",
  htun: "ထွန်း",
  hein: "",
  htet: "",
  kaw: "ကော",
  kaung: "ကောင်း",
  ko: "ကို",
  kyaw: "ကျော်",
  lin: "လင်း",
  linn: "လင်း",
  maung: "မောင်",
  mg: "မောင်",
  moe: "မိုး",
  moh: "မို့",
  min: "မင်း",
  nwe: "နွယ်",
  nway: "နွေ",
  naing: "နိုင်",
  naung: "နောင်",
  la: "လ",
  lamin: "လမင်း",
  oo: "ဦး",
  paing: "ပိုင်",
  pan: "ပန်",
  phyo: "ဖြိုး",
  pyae: "ပြည့်",
  san: "စန်း",
  saw: "စော",
  soe: "စိုး",
  shain: "ရှိန်း",
  shin: "ရှင်း",
  saung: "ဆောင်း",
  su: "ဆု",
  ra: "ရ",
  rati: "ရတီ",
  tae: "သဲ",
  thae: "သဲ",
  thit: "သစ်",
  thitsar: "သစ္စာ",
  tun: "ထွန်း",
  wai: "ဝေ",
  ya: "ရ",
  yan: "ရန်",
  yadanar: "ရတနာ",
  yin: "ရင်",
  zaw: "ဇော်",
  zay: "ဇေ",
  zin: "ဇင်",
};

export default class User {
  public firstName: string;
  public lastName: string;
  public locale: string | null;
  public gender: string | null;
  public mode: null | "delete";
  public headlines: string[];
  public reports: string[];
  public last_report: number | null;

  constructor(public psid: string) {
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
    this.locale = profile.locale;
    if (profile.gender) {
      this.gender = profile.gender;
    }
  }

  get name() {
    if (!this.firstName) {
      return "";
    }
    if (!this.gender) {
      return `${this.firstName} ${this.lastName}`;
    }
    let sur = this.gender.toLowerCase().includes("female") ? "မ" : "ကို";
    return `${sur} ${burmeseName(this.firstName)} ${burmeseName(
      this.lastName
    )}`;
  }
}

function burmeseName(name) {
  return name
    .split(" ")
    .map((n) => BURMESE_NAMING[n.toLowerCase()] || n)
    .join(" ");
}
