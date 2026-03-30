import { useState } from "react";
import API from "../../api/axios";
import { useParams } from "react-router-dom";

export default function Register() {
  const { batchId } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });


  const submit = async () => {
  try {
    if (!form.name || !form.email || !form.phone) {
      return alert("All fields required");
    }

    // Check existing student
    const students = await API.get("/students");
    let student = students.data.find(
      (s) => s.email === form.email
    );

    let studentId;

    if (student) {
      studentId = student.id;
    } else {
      const res = await API.post("/students", form);
      studentId = res.data.id;
    }

    const reg = await API.post("/registrations", {
      student_id: studentId,
      batch_id: batchId
    });

    alert(`Registered! Fee: ₹${reg.data.final_amount}`);

  } catch (err) {
    alert(err.response?.data?.error || err.message);
  }
};
//  const submit = async () => {
//   try {
//     if (!form.name || !form.email || !form.phone) {
//       return alert("All fields are required");
//     }

//     const studentRes = await API.post("/students", {
//       name: form.name.trim(),
//       email: form.email.trim(),
//       phone: form.phone.trim()
//     });

//     console.log("STUDENT RESPONSE:", studentRes.data);

//     const studentId =
//       studentRes.data.id ||
//       studentRes.data.data?.id ||
//       studentRes.data.data?.insertId;

//     if (!studentId) {
//       throw new Error("Student ID not received");
//     }

//     const res = await API.post("/registrations", {
//       student_id: Number(studentId),
//       batch_id: Number(batchId)
//     });

//     alert(
//       `✅ Registered!\nCode: ${res.data.registration_code}\nFee: ₹${res.data.final_amount}`
//     );

//   } catch (err) {
//     console.log("ERROR:", err.response?.data || err.message);
//     alert(err.response?.data?.error || err.message);
//   }
// };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded">
      <h2 className="font-bold mb-4 text-xl text-center">
        Student Registration
      </h2>

      <input
        className="input"
        placeholder="Name"
        onChange={e =>
          setForm({ ...form, name: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Email"
        onChange={e =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        className="input"
        placeholder="Phone"
        onChange={e =>
          setForm({ ...form, phone: e.target.value })
        }
      />

      <button
        onClick={submit}
        className="btn w-full mt-3"
      >
        Register
      </button>
    </div>
  );
}