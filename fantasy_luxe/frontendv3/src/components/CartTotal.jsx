import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "./Title";

const CartTotal = () => {
  const { totalcartAmount, currency, delivery_fee } = useContext(ShopContext);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {totalcartAmount()}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency}
            10.00
          </p>
        </div>
        <hr />

        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}{" "}
            {totalcartAmount() === 0 ? 0 : totalcartAmount() + 10}.00
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
