import { useEffect, useState } from "react";
import api from "../Services/api";
import { registerStudentToBatch } from "../Services/registrationService";
import Navbar from "../component/Navbar";

export default function RegistrationPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const s = await api.get("/students");
    const b = await api.get("/batches");
    setStudents(s.data);
    setBatches(b.data);
  };

  const handleSubmit = async () => {
    if (!studentId || !batchId) {
      alert("Select student and batch");
      return;
    }

    try {
      const res = await registerStudentToBatch({
        student_id: Number(studentId),
        batch_id: Number(batchId),
      });

      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Error");
    }
  };

  return (
    <>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl font-bold mb-4">Student Registration</h2>

        <div className="grid grid-cols-2 gap-4">
          <select
            className="border p-2"
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            className="border p-2"
            onChange={(e) => setBatchId(e.target.value)}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.batch_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded"
        >
          Register
        </button>

        {result && (
          <div className="mt-6 bg-gray-100 p-4 rounded">
            <p>Original Fee: {result.original_fee}</p>
            <p>Discount: {result.discount_amount}</p>
            <p className="font-bold">Final: {result.final_amount}</p>
          </div>
        )}
      </div>
    </>
  );
}