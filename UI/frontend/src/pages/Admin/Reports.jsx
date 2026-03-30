import { useEffect, useState } from "react";
import { getRegistrations } from "../../api/services";

export default function Reports() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await getRegistrations();
      setData(res.data);

      // 🔥 Calculate totals
      let revenue = 0;
      let discount = 0;

      res.data.forEach((r) => {
        revenue += Number(r.final_amount || 0);
        discount += Number(r.discount_amount || 0);
      });

      setTotalRevenue(revenue);
      setTotalDiscount(discount);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-4">

      <h2 className="mb-4">Admin Reports</h2>

      {/* Summary Cards */}
      <div className="row mb-4">

        <div className="col-md-6">
          <div className="card p-3 shadow text-center">
            <h5>Total Revenue</h5>
            <h3 className="text-success">₹ {totalRevenue}</h3>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card p-3 shadow text-center">
            <h5>Total Discount Given</h5>
            <h3 className="text-danger">₹ {totalDiscount}</h3>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="card p-3 shadow">
        <h4>All Registrations</h4>

        {loading ? (
          <p>Loading...</p>
        ) : data.length === 0 ? (
          <p>No data available</p>
        ) : (
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Code</th>
                <th>Student</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Original Fee</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {data.map((r) => (
                <tr key={r.id}>
                  <td>{r.registration_code}</td>
                  <td>{r.student_name || "N/A"}</td>
                  <td>{r.course_name || "N/A"}</td>
                  <td>{r.batch_name || "N/A"}</td>
                  <td>₹ {r.original_fee}</td>
                  <td>₹ {r.discount_amount}</td>
                  <td>₹ {r.final_amount}</td>
                  <td>
                    <span className="badge bg-success">
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}