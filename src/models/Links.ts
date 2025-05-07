import mongoose, { Types, Document } from "mongoose";

const linksSchema = new mongoose.Schema(
  {
    name: { type: String },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    url: { type: String },
    image: { type: String, required: false },
    publish: { type: String, default: true },
  },
  { timestamps: true }
);

const Links = mongoose.model("Links", linksSchema);

export default Links;
