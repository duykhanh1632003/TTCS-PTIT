import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerClerkId: String,
  fullName: String,
  email: String,
  phoneNumber: String,
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      color: String,
      size: String,
      quantity: Number,
    },
  ],
  shippingAddress: {
    address: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  shippingMethod: String,
  paymentMethod: String,
  totalAmount: Number,
createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
