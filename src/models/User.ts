import { model, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    psid: {
      type: String,
      unique: true,
      required: true,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    gender: {
      type: String,
    },
    persona_id: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    credit_score: {
      type: Number,
      default: 80,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", UserSchema);
