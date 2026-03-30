import { useEffect, useState } from "react";
import { getMyRegistrations } from "../../api/services";

export default function MyRegistrations() {
  const [registrations, setRegistrations] = useState([]);

  const student_id = localStorage.getItem("userId");

  const fetchRegistrations = async () => {
  try {
    setLoading(true); // 🔥 start loading

    const res = await getMyRegistrations(student_id);
    setRegistrations(res.data);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // 🔥 stop loading
  }
};

  useEffect(() => {
    fetchRegistrations();
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h3 className="mb-3">My Registrations</h3>

      {loading ? (
  <p>Loading...</p>
) : registrations.length === 0 ? (
  <p>No registrations found</p>
) : (
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Registration Code</th>
                <th>Course</th>
                <th>Batch</th>
                <th>Original Fee</th>
                <th>Discount</th>
                <th>Final Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((r) => (
                <tr key={r.id}>
                  <td>{r.registration_code}</td>
                  <td>{r.course_name || "N/A"}</td>
                  <td>{r.batch_name || "N/A"}</td>
                  <td>₹{r.original_fee}</td>
                  <td>₹{r.discount_amount}</td>
                  <td>₹{r.final_amount}</td>
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