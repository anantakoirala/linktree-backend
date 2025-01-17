import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String },
    price: { type: Number, required: false },
    url: { type: String, required: false },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    image: { type: String, required: false },
    publish: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
