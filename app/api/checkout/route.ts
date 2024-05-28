import { NextRequest, NextResponse } from "next/server";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    const { formData, cartItems } = await req.json();

    const products = cartItems.map((item) => ({
      product: item.item._id,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      customerClerkId: formData.customerClerkId,
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      products: products,
      shippingAddress: { country: formData.country, address: formData.address },
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      totalAmount: formData.finalTotal,
    });

    await newOrder.save(); // Assuming you have a save method on the Order model

    let customer = await Customer.findOne({
      clerkId: formData.customerClerkId,
    });

    if (customer) {
      customer.orders.push(newOrder._id);
    } else {
      customer = new Customer({
        clerkId: formData.customerClerkId,
        email: formData.email,
        name: formData.fullName,
        orders: [newOrder._id],
      });
    }

    await customer.save();

    return new NextResponse("Order created", { status: 200 });
  } catch (err) {
    console.log("[checkout_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
