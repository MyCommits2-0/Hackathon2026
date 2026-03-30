import { useEffect, useState } from "react";
import API from "../../api/axios";
export default function MyRegistrations() {
  const [data, setData] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

const res = await API.get(
  `/common/student/${user.id}/history`
    );

    setData(res.data);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">My Registrations</h1>

      {data.map((r, i) => (
        <div key={i} className="border p-4 mb-3 rounded shadow">
          <p><b>Course:</b> {r.course_name}</p>
          <p><b>Batch:</b> {r.batch_name}</p>
          <p><b>Amount:</b> ₹{r.final_amount}</p>
          <p><b>Status:</b> {r.status}</p>
        </div>
      ))}
    </div>
  );
}