import mongoose, { Types, Document } from "mongoose";

const socialIconSchema = new mongoose.Schema(
  {
    name: { type: String },
    displayName: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    value: { type: String },
    publish: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const SocialIcon = mongoose.model("SocialIcon", socialIconSchema);

export default SocialIcon;
