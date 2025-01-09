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
});

const User = mongoose.model("User", userSchema);

export default User;
