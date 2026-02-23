import { useEffect, useState } from "react";
import api from "../Services/api";
import Navbar from "../component/Navbar";

export default function AssignDiscount() {
  const [discounts, setDiscounts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [discountId, setDiscountId] = useState("");
  const [batchId, setBatchId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const d = await api.get("/discounts");
    const b = await api.get("/batches");
    setDiscounts(d.data);
    setBatches(b.data);
  };

  const handleAssign = async () => {
    await api.post("/discount-batches", {
      discount_id: discountId,
      batch_id: batchId,
    });

    alert("Assigned successfully");
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Assign Discount</h2>

        <select onChange={(e) => setDiscountId(e.target.value)} className="border p-2 mr-4">
          <option>Select Discount</option>
          {discounts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.discount_name}
            </option>
          ))}
        </select>

        <select onChange={(e) => setBatchId(e.target.value)} className="border p-2 mr-4">
          <option>Select Batch</option>
          {batches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.batch_name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAssign}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Assign
        </button>
      </div>
    </>
  );
}