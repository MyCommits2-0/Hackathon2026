import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await API.get("/common/dropdowns");
    setBatches(res.data.batches);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Student Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {batches.map((b) => (
          <div
            key={b.id}
            className="border p-4 rounded shadow hover:shadow-lg"
          >
            <h2 className="text-lg font-semibold">{b.batch_name}</h2>

            <button
              onClick={() => navigate(`/student/register/${b.id}`)}
              className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Register
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/student/my-registrations")}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        View My Registrations
      </button>
    </div>
  );
}