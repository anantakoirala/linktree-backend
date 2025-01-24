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
      color: "bg-[#000957]",
      text: "text-white",
      name: "Blue Horizon",
      linkStyle: "rounded-md",
      shopBox: "rounded-md",
      boxColor: "bg-[#344CB7]",
      hover: "",
      embosedBox: true,
      embosedBoxColor: "bg-[#FFEB00]",
      tabColor: "bg-blue-600",
      selectedShareLinkBackgroundIndex: 0,
      fill: "#FFEB00",
      shareLink_background: [
        { background: "bg-[#000957]", textColor: "text-white" }, // Deep blue - white text for contrast
        { background: "bg-[#344CB7]", textColor: "text-white" }, // Light blue - white text for readability
        { background: "bg-[#FFEB00]", textColor: "text-black" }, // Yellow - black text for readability
        { background: "bg-blue-500", textColor: "text-white" }, // Medium blue - white text for contrast
        { background: "bg-[#87CEEB]", textColor: "text-black" }, // Sky blue - black text for better readability
      ],
    },
  },
});

const User = mongoose.model("User", userSchema);

export default User;
