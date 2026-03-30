import { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const c = await API.get("/courses");
      const b = await API.get("/batches");

      setCourses(c.data.data || c.data);
      setBatches(b.data.data || b.data);

    } catch {
      alert("Unauthorized - Login again");
    }
  };

  const getBatches = (courseId) =>
    batches.filter((b) => b.course_id === courseId);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Courses</h1>

      {courses.map((c) => (
        <div key={c.id} className="mt-4 p-4 bg-white shadow rounded">
          <h2 className="font-bold">{c.course_name}</h2>

          <div className="grid grid-cols-3 gap-3 mt-3">
            {getBatches(c.id).map((b) => (
              <div key={b.id} className="p-3 border rounded">
                <p>{b.batch_name}</p>
                <p>₹{b.fee}</p>

                <button
                  onClick={() => navigate(`/student/register/${id}`)}
                  className="btn mt-2"
                >
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}