import React, { useContext } from "react";
import { ShopContext } from "../context/Shopcontext";
import Title from "./Title";

const CartTotal = () => {
  const { totalcartAmount, currency, freeDeliveryEnabled, freeDeliveryThreshold, getEffectiveDeliveryFee } = useContext(ShopContext);
  const effectiveDeliveryFee = getEffectiveDeliveryFee();
  const subtotal = totalcartAmount();
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
            {subtotal}.00
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Delivery Fee</p>
          <p>
            {effectiveDeliveryFee === 0 ? (
              <span className="text-green-600 font-medium">FREE</span>
            ) : (
              `${currency}${effectiveDeliveryFee}.00`
            )}
          </p>
        </div>
        {freeDeliveryEnabled && subtotal >= freeDeliveryThreshold && (
          <p className="text-xs text-green-600 text-center">
            Free delivery on orders above {currency}{freeDeliveryThreshold}
          </p>
        )}
        <hr />

        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}{" "}
            {(subtotal + effectiveDeliveryFee).toFixed(2)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
