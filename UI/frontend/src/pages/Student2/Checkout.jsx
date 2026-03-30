import { useState } from "react";
import API from "../../api/axios";

export default function Checkout() {
  const [batchFee, setBatchFee] = useState(50000);
  const [code, setCode] = useState("");
  const [final, setFinal] = useState(batchFee);

  const applyDiscount = async () => {
    try {
      const res = await API.post("/discounts/apply", {
        code,
        amount: batchFee
      });

      setFinal(res.data.finalAmount);
    } catch {
      alert("Invalid Coupon");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="text-xl font-bold">Checkout</h2>

      <p className="mt-2">Original Fee: ₹{batchFee}</p>

      <input
        placeholder="Enter Coupon"
        className="input"
        onChange={e => setCode(e.target.value)}
      />

      <button onClick={applyDiscount} className="btn">
        Apply Discount
      </button>

      <p className="mt-4 text-green-600 font-bold">
        Final Amount: ₹{final}
      </p>
    </div>
  );
}