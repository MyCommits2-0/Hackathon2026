import { useEffect, useState } from "react";
import api from "../Services/api";
import Navbar from "../component/Navbar";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    const res = await api.get("/common/dashboard");
    setStats(res.data);
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        {stats && (
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-blue-100 p-4 rounded">
              Total Students: {stats.total_students}
            </div>
            <div className="bg-green-100 p-4 rounded">
              Total Registrations: {stats.total_registrations}
            </div>
            <div className="bg-yellow-100 p-4 rounded">
              Revenue: ₹{stats.total_revenue}
            </div>
          </div>
        )}
      </div>
    </>
  );
}