"use client"; // Add this at the top of the file

import useCart from "@/lib/hooks/useCart";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image from next/image
import { useRouter } from "next/navigation";

const Checkout = () => {
  const { user } = useUser();
  const cart = useCart();

  const customer = {
    clerkId: user?.id,
    email: user?.emailAddresses[0].emailAddress,
    name: user?.fullName,
  };
  const router = useRouter();
  const [total, setTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [finalTotal, setFinalTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("creditCard");

  // State variables for form inputs initialized with customer data
  const [email, setEmail] = useState(customer.email || "");
  const [fullName, setFullName] = useState(customer.name || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Vietnam");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [cardInfo, setCardInfo] = useState("");
  const [cardDate, setCardDate] = useState("");
  const [cardCVC, setCardCVC] = useState("");

  useEffect(() => {
    console.log("check cartItems", cart.cartItems);
    if (cart && cart.cartItems) {
      const totalMoney = cart.cartItems.reduce(
        (acc, cartItem) => acc + cartItem.item.price * cartItem.quantity,
        0
      );
      setTotal(totalMoney);
    }
  }, [cart, cart.cartItems]); // Add dependencies to useEffect

  useEffect(() => {
    setFinalTotal(total + shippingCost);
  }, [total, shippingCost]);

  const handleShippingChange = (event) => {
    const selectedShipping = event.target.value;
    if (selectedShipping === "free") {
      setShippingCost(0);
    } else if (selectedShipping === "express") {
      setShippingCost(5);
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  if (!cart || !cart.cartItems) {
    return <div>Loading...</div>; // Handle loading state or empty cart
  }

  const handlePayment = async (event) => {
    event.preventDefault();

    // Prepare data to send to backend
    const formData = {
      customerClerkId: user?.id,
      email,
      fullName,
      phoneNumber,
      country,
      address,
      city,
      shippingMethod: shippingCost === 0 ? "free" : "express",
      paymentMethod,
      total,
      finalTotal,
    };

    if (paymentMethod === "creditCard") {
      formData.cardInfo = cardInfo;
      formData.cardDate = cardDate;
      formData.cardCVC = cardCVC;
    }

    try {
      // Make a POST request to the backend
      router.push("/payment_success");
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cartItems: cart.cartItems, formData }),
      });

      localStorage.clear();
    } catch (error) {
      console.error("An error occurred during payment processing:", error);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div>
        {cart.cartItems.map((cartItem) => (
          <div
            key={cartItem.item.id}
            className="w-full flex max-sm:flex-col max-sm:gap-3 hover:bg-grey-1 px-4 py-3 items-center max-sm:items-start justify-between"
          >
            <div className="flex items-center">
              <Image
                src={cartItem.item.media[0]}
                width={100}
                height={100}
                className="rounded-lg w-32 h-32 object-cover"
                alt="product"
              />
              <div className="flex flex-col gap-3 ml-4">
                <p className="text-body-bold">{cartItem.item.title}</p>
                {cartItem.color && (
                  <p className="text-small-medium">{cartItem.color}</p>
                )}
                {cartItem.size && (
                  <p className="text-small-medium">{cartItem.size}</p>
                )}
                <p className="text-small-medium">${cartItem.item.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handlePayment} className="w-full max-w-lg mt-8">
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-700"
          >
            Họ và tên
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Số điện thoại
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-700"
          >
            Quốc gia
          </label>
          <select
            id="country"
            name="country"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="Vietnam">Việt Nam</option>
            <option value="Laos">Lào</option>
            <option value="China">Trung Quốc</option>
            <option value="Cambodia">Campuchia</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Địa chỉ cụ thể
          </label>
          <input
            type="text"
            id="address"
            name="address"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-700"
          >
            Thành phố
          </label>
          <input
            type="text"
            id="city"
            name="city"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="shippingMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Phương thức vận chuyển
          </label>
          <select
            id="shippingMethod"
            name="shippingMethod"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            onChange={handleShippingChange}
          >
            <option value="free">
              Vận chuyển miễn phí 1-2 ngày làm việc - 0$
            </option>
            <option value="express">Vận chuyển nhanh - 5$</option>
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Phương thức thanh toán
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            onChange={handlePaymentChange}
            value={paymentMethod}
          >
            <option value="creditCard">Thanh toán bằng thẻ</option>
            <option value="cashOnDelivery">Thanh toán khi nhận hàng</option>
          </select>
        </div>

        {paymentMethod === "creditCard" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="cardInfo"
                className="block text-sm font-medium text-gray-700"
              >
                Thông tin thẻ
              </label>
              <input
                type="text"
                id="cardInfo"
                name="cardInfo"
                placeholder="Card Number"
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
                value={cardInfo}
                onChange={(e) => setCardInfo(e.target.value)}
              />
            </div>

            <div className="mb-4 flex space-x-4">
              <div>
                <label
                  htmlFor="cardDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày hết hạn
                </label>
                <input
                  type="text"
                  id="cardDate"
                  name="cardDate"
                  placeholder="MM/YY"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  value={cardDate}
                  onChange={(e) => setCardDate(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="cardCVC"
                  className="block text-sm font-medium text-gray-700"
                >
                  CVC
                </label>
                <input
                  type="text"
                  id="cardCVC"
                  name="cardCVC"
                  placeholder="CVC"
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  required
                  value={cardCVC}
                  onChange={(e) => setCardCVC(e.target.value)}
                />
              </div>
            </div>
          </>
        )}

        <div className="mb-4">
          <p className="text-lg font-semibold">
            Tổng giá tiền (chưa có ship): ${total}
          </p>
          <p className="text-lg font-semibold">
            Chi phí vận chuyển: ${shippingCost}
          </p>
          <p className="text-lg font-bold">
            Tổng tiền cuối cùng: ${finalTotal}
          </p>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Thanh toán
        </button>
      </form>
    </div>
  );
};

export default Checkout;
