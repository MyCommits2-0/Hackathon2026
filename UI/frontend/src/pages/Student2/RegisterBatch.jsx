import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
export default function RegisterBatch() {
  const { batchId } = useParams();
  const navigate = useNavigate();

  const handleRegister = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await API.post("/registrations", {
      student_id: user.id,
      batch_id: batchId,
    });

    alert(`Final Amount: ${res.data.final_amount}`);
    navigate("/student/my-registrations");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Confirm Registration</h1>

      <button
        onClick={handleRegister}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Register Now
      </button>
    </div>
  );
}