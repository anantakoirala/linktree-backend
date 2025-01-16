import mongoose, { Types, Document } from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, unique: true },
  email: {
    type: String,
    unique: true,
    required: [true, "Please provide the email"],
  },
  password: { type: String, required: [true, "Please provide the password"] },
  image: { type: String, required: false },
  profile_title: { type: String, required: false },
  bio: { type: String, required: false },
  theme: {
    type: Object,
    default: {
      id: 2,
      color: "bg-[#000957]", // Deep Blue
      text: "text-white", // White text for contrast
      shopBox: "rounded-md",
      name: "Blue Horizon",
      linkStyle: "rounded-md", // Rounded link style
      boxColor: "bg-[#344CB7]", // Lighter Blue
      hover: "",
      embosedBox: true,
      embosedBoxColor: "bg-[#FFEB00]", // Yellow for embossed effect
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
