import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { registerStudent } from "../../api/services";
import { getDiscounts } from "../../api/services";
import API from "../../api/axios"; // ✅ use your API

export default function Register() {
  const { batchId } = useParams();

  const [batch, setBatch] = useState(null);
  const [discounts, setDiscounts] = useState([]);
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const [finalAmount, setFinalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const student_id = localStorage.getItem("userId");

  // ✅ Fetch batch
  const fetchBatch = async () => {
    try {
      const res = await API.get(`/batches/${batchId}`);
      setBatch(res.data);
      setFinalAmount(res.data.fee);
    } catch {
      setMessage("❌ Failed to load batch");
    }
  };

  // ✅ Fetch discounts (FILTER ACTIVE)
  const fetchDiscounts = async () => {
    try {
      const res = await getDiscounts();

      const today = new Date();

      const activeDiscounts = res.data.filter((d) => {
        return (
          new Date(d.start_date) <= today &&
          new Date(d.end_date) >= today
        );
      });

      setDiscounts(activeDiscounts);
    } catch {
      setMessage("❌ Failed to load discounts");
    }
  };

  useEffect(() => {
    fetchBatch();
    fetchDiscounts();
  }, []);

  // ✅ Apply discount
  const applyDiscount = (discount) => {
    setSelectedDiscount(discount);

    let discountAmount = 0;

    if (discount.value_type === "FLAT") {
      discountAmount = discount.discount_value;
    } else {
      discountAmount =
        (batch.fee * discount.discount_value) / 100;
    }

    let final = batch.fee - discountAmount;
    if (final < 0) final = 0;

    setFinalAmount(final);
  };

  // ✅ Register
  const handleRegister = async () => {
    try {
      setLoading(true);

      await registerStudent({
        student_id,
        batch_id: batchId,
        discount_id: selectedDiscount?.id || null // 🔥 FIXED
      });

      setMessage("✅ Registration successful");
    } catch (err) {
      setMessage(err.response?.data?.error || "❌ Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!batch) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">

        <h3>Register for Batch</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {/* Batch Info */}
        <div className="mb-3">
          <p><strong>Batch:</strong> {batch.name}</p>
          <p><strong>Fee:</strong> ₹{batch.fee}</p>
        </div>

        {/* Discount */}
        <div className="mb-3">
          <label>Select Discount</label>
          <select
            className="form-control"
            onChange={(e) => {
              const d = discounts.find(x => x.id == e.target.value);
              if (d) applyDiscount(d);
              else {
                setSelectedDiscount(null);
                setFinalAmount(batch.fee);
              }
            }}
          >
            <option value="">No Discount</option>
            {discounts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.value_type} - {d.discount_value})
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p><strong>Final Amount:</strong> ₹{finalAmount}</p>
        </div>

        <button
          className="btn btn-success w-100"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Registration"}
        </button>

      </div>
    </div>
  );
}