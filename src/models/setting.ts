import mongoose, { Types, Document } from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    social_icon_position: {
      type: String,
      enum: ["Top", "Bottom"],
      default: "Top",
    },
    shopStatus: { type: Boolean, default: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
      unique: true,
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);

export default Setting;
