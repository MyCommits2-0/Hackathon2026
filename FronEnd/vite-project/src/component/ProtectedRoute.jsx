import { useState } from "react";
import { registerStudentToBatch } from "../Services/registrationService";

export default function RegistrationPage() {
  const [studentId, setStudentId] = useState("");
  const [batchId, setBatchId] = useState("");

  const handleRegister = async () => {
    try {
      const res = await registerStudentToBatch({
        student_id: Number(studentId),
        batch_id: Number(batchId),
      });

      alert(JSON.stringify(res.data, null, 2));
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Register Student</h2>
      <input
        placeholder="Student ID"
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        placeholder="Batch ID"
        onChange={(e) => setBatchId(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}