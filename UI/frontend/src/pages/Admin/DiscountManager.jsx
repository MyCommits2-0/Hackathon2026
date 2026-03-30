import { useEffect, useState } from "react";
import { getDiscounts, addDiscount } from "../../services/discountService";

export default function DiscountManager() {
  const [discounts, setDiscounts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    value_type: "PERCENTAGE",
    discount_value: "",
    start_date: "",
    end_date: "",
    applicable_to: "GLOBAL" // 🔥 NEW
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const res = await getDiscounts();
      setDiscounts(res.data);
    } catch (err) {
      setMessage("❌ Failed to load discounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name.trim()) return "Name required";
    if (form.discount_value <= 0) return "Invalid discount value";

    if (
      form.value_type === "PERCENTAGE" &&
      form.discount_value > 100
    ) return "Percentage cannot exceed 100";

    if (!form.start_date || !form.end_date)
      return "Select dates";

    if (form.start_date > form.end_date)
      return "Invalid date range";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      setMessage("⚠ " + error);
      return;
    }

    try {
      setLoading(true);
      await addDiscount(form);

      setMessage("✅ Discount added");

      setForm({
        name: "",
        value_type: "PERCENTAGE",
        discount_value: "",
        start_date: "",
        end_date: "",
        applicable_to: "GLOBAL"
      });

      fetchDiscounts();
    } catch (err) {
      setMessage("❌ Error adding discount");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">

        {/* Add Discount */}
        <div className="col-md-4">
          <div className="card p-3 shadow">
            <h4>Add Discount</h4>

            {message && (
              <div className="alert alert-info">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <input
                className="form-control mb-2"
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />

              <select
                className="form-control mb-2"
                name="value_type"
                value={form.value_type}
                onChange={handleChange}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FLAT">Flat</option>
              </select>

              <input
                type="number"
                className="form-control mb-2"
                name="discount_value"
                placeholder="Value"
                value={form.discount_value}
                onChange={handleChange}
              />

              {/* 🔥 NEW */}
              <select
                className="form-control mb-2"
                name="applicable_to"
                value={form.applicable_to}
                onChange={handleChange}
              >
                <option value="GLOBAL">Global</option>
                <option value="BATCH">Batch</option>
                <option value="STUDENT">Student</option>
              </select>

              <input
                type="date"
                className="form-control mb-2"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
              />

              <input
                type="date"
                className="form-control mb-2"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
              />

              <button
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add Discount"}
              </button>
            </form>
          </div>
        </div>

        {/* List */}
        <div className="col-md-8">
          <div className="card p-3 shadow">
            <h4>Discount List</h4>

            {loading ? (
              <p>Loading...</p>
            ) : discounts.length === 0 ? (
              <p>No discounts available</p>
            ) : (
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value</th>
                    <th>Applies To</th>
                    <th>Dates</th>
                  </tr>
                </thead>

                <tbody>
                  {discounts.map((d) => (
                    <tr key={d.id}>
                      <td>{d.name}</td>
                      <td>{d.value_type}</td>
                      <td>
                        {d.value_type === "PERCENTAGE"
                          ? `${d.discount_value}%`
                          : `₹ ${d.discount_value}`}
                      </td>
                      <td>{d.applicable_to || "GLOBAL"}</td>
                      <td>
                        {d.start_date} → {d.end_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}