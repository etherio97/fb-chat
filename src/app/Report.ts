import Axios from "axios";

export default class Report {
  static send(phone: string, message: string) {
    message = message.replace(/#n[we]{2}oo/gim, "");
    return Axios.post("https://api.nweoo.com/report", {
      phone,
      message,
      timestamp: Date.now(),
    }).then(({ data: { id, post_id } }) => ({
      id: id.toString(),
      post_id,
    }));
  }

  static remove(id: string | number) {
    return Axios.delete("https://api.nweoo.com/report/" + id)
      .then(({ data }) => data)
      .catch((e) => {
        throw new Error(e.response?.data || e.message);
      });
  }
}
