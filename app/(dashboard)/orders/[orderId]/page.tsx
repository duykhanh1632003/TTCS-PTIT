import { DataTable } from "@/components/custom ui/DataTable";
import { columns } from "@/components/orderItems/OrderItemsColums";

const OrderDetails = async ({ params }: { params: { orderId: string } }) => {
  const res = await fetch(
    `${process.env.ADMIN_DASHBOARD_URL}/api/orders/${params.orderId}`
  );
  const { orderDetails, customer } = await res.json();

  const { address, city, state, postalCode, country } =
    orderDetails.shippingAddress;
  console.log("Check đâ", res.json());
  return (
    <div className="flex flex-col p-10 gap-5">
      <p className="text-base-bold">
        ID đơn hàng:{" "}
        <span className="text-base-medium">{orderDetails._id}</span>
      </p>
      <p className="text-base-bold">
        Tên khách hàng:{" "}
        <span className="text-base-medium">{customer.name}</span>
      </p>
      <p className="text-base-bold">
        Địa chỉ nhận hàng:{" "}
        <span className="text-base-medium">
          {address}, {country}
        </span>
      </p>
      <p className="text-base-bold">
        Tổng tiền phải trả:{" "}
        <span className="text-base-medium">${orderDetails.totalAmount}</span>
      </p>
      <p className="text-base-bold">
        Phương thức vận chuyển:{" "}
        <span className="text-base-medium">{orderDetails.shippingMethod}</span>
      </p>
      <p className="text-base-bold">
        Phương thức thanh toán:{" "}
        <span className="text-base-medium">{orderDetails.paymentMethod}</span>
      </p>
      <DataTable
        columns={columns}
        data={orderDetails.products}
        searchKey="product"
      />
    </div>
  );
};

export default OrderDetails;
